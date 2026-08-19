const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const ROOT = path.resolve(__dirname, "..");
const CONFIG_PATH = path.join(ROOT, "alertas_clientes_config.json");
const DATA_DIR = path.join(ROOT, "data");
const SIGNALS_PATH = path.join(DATA_DIR, "intel_signals.json");
const RUNS_PATH = path.join(DATA_DIR, "intel_runs.json");

const MAX_SIGNALS = Number(process.env.MAX_SIGNALS || 600);
const MAX_RSS_ITEMS = Number(process.env.MAX_RSS_ITEMS || 35);
const MAX_GOOGLE_CLIENTS = Number(process.env.MAX_GOOGLE_CLIENTS || 33);
const ENABLE_CLIENT_GOOGLE_NEWS = String(process.env.ENABLE_CLIENT_GOOGLE_NEWS || "false").toLowerCase() === "true";

const norm = (value) =>
  String(value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();

const key = (value) => norm(value).replace(/[^a-z0-9]/g, "");
const toks = (value) => norm(value).split(/[,;/\s]+/).filter((x) => x.length > 2);
const stripHtml = (value) => decodeEntities(String(value || "").replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim());
const GENERIC_MATCH_TERMS = new Set([
  "peru", "empresa", "proyecto", "proyectos", "oficina", "oficinas", "terreno", "terrenos",
  "inversion", "inversiones", "infraestructura", "licencia", "licencias", "permiso", "permisos",
  "ampliacion", "expansion", "planta", "almacen", "almacenes", "local", "sede", "apertura",
  "obra", "obras", "concesion", "licitacion", "arrendamiento", "alquiler", "lima", "sac",
  "proinversion", "gestion", "funcionarios", "directorio", "constitucion", "puerto", "puertos",
  "grupo", "gobierno", "internacional", "nacional", "logistica", "transporte", "mina", "mineria",
  "tecnologia", "construccion", "corporativo", "comercial", "industrial", "servicios", "para",
  "produccion", "energia", "deuda", "contrato", "cobre", "nueva tienda", "centro de distribucion"
]);
const isDistinctiveTerm = (term) => term.length > 4 && /\s/.test(term) && !GENERIC_MATCH_TERMS.has(term);

function decodeEntities(value) {
  const named = {
    amp: "&",
    lt: "<",
    gt: ">",
    quot: "\"",
    apos: "'",
    nbsp: " "
  };
  return String(value || "").replace(/&(#x?[0-9a-f]+|[a-z]+);/gi, (match, code) => {
    if (code[0] === "#") {
      const base = code[1]?.toLowerCase() === "x" ? 16 : 10;
      const raw = code[1]?.toLowerCase() === "x" ? code.slice(2) : code.slice(1);
      const n = Number.parseInt(raw, base);
      return Number.isFinite(n) ? String.fromCodePoint(n) : match;
    }
    return named[code.toLowerCase()] || match;
  });
}

function normalizeUrl(url) {
  try {
    const u = new URL(url);
    [...u.searchParams.keys()].forEach((param) => {
      if (/^utm_|^gclid$|^fbclid$|^mc_/i.test(param)) u.searchParams.delete(param);
    });
    u.hash = "";
    if (u.protocol === "http:") u.protocol = "https:";
    return u.toString().replace(/\/$/, "");
  } catch {
    return String(url || "");
  }
}

function sha256(value) {
  return crypto.createHash("sha256").update(String(value || "")).digest("hex");
}

async function fetchText(url) {
  const res = await fetch(url, {
    headers: {
      "user-agent": "CapitalCenterIntelligence/1.0 (+https://rcardenasr.github.io/capital-center-insights/)",
      "accept": "application/rss+xml, application/xml, text/xml, text/html;q=0.9, */*;q=0.8"
    }
  });
  if (!res.ok) throw new Error(`HTTP ${res.status} ${res.statusText}`);
  const charset = res.headers.get("content-type")?.match(/charset=([^;]+)/i)?.[1]?.trim() || "utf-8";
  const bytes = await res.arrayBuffer();
  try {
    return new TextDecoder(charset).decode(bytes);
  } catch {
    return new TextDecoder("utf-8").decode(bytes);
  }
}

function tagValue(xml, tag) {
  const match = xml.match(new RegExp(`<${tag}(?:\\s[^>]*)?>([\\s\\S]*?)<\\/${tag}>`, "i"));
  if (!match) return "";
  return stripHtml(match[1].replace(/^<!\[CDATA\[|\]\]>$/g, ""));
}

function parseRss(xmlText, source) {
  const itemBlocks = [...String(xmlText || "").matchAll(/<item\b[\s\S]*?<\/item>/gi)].map((m) => m[0]);
  return itemBlocks.slice(0, MAX_RSS_ITEMS).map((item) => {
    const title = tagValue(item, "title");
    const summary = tagValue(item, "description") || tagValue(item, "content:encoded");
    const url = tagValue(item, "link") || tagValue(item, "guid");
    const rawDate = tagValue(item, "pubDate") || tagValue(item, "published") || tagValue(item, "updated");
    const parsedDate = rawDate ? new Date(rawDate) : new Date();
    return {
      sourceId: source.id,
      sourceName: source.name,
      title,
      summary,
      url,
      publishedAt: Number.isNaN(parsedDate.getTime()) ? new Date().toISOString() : parsedDate.toISOString(),
      rawMetadata: { method: source.method, category: source.category }
    };
  }).filter((item) => item.title && item.url);
}

function absoluteUrl(url, baseUrl) {
  try {
    return new URL(url, baseUrl).toString();
  } catch {
    return url;
  }
}

function parseHtmlLinks(html, source) {
  const items = [];
  for (const match of String(html || "").matchAll(/<a\b[^>]*href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi)) {
    const text = stripHtml(match[2]);
    if (text.length < 18 || text.length > 220) continue;
    const url = absoluteUrl(decodeEntities(match[1]), source.pageUrl);
    if (!/^https?:\/\//i.test(url)) continue;
    items.push({
      sourceId: source.id,
      sourceName: source.name,
      title: text,
      summary: text,
      url,
      publishedAt: new Date().toISOString(),
      rawMetadata: { method: source.method, category: source.category }
    });
  }
  const seen = new Set();
  return items.filter((item) => {
    const id = normalizeUrl(item.url);
    if (seen.has(id)) return false;
    seen.add(id);
    return true;
  }).slice(0, MAX_RSS_ITEMS);
}

function signalKeywordTypes(text, config) {
  const hay = norm(text);
  return (config.signalTypes || []).map((type) => ({
    type: type.type,
    weight: type.weight || 0,
    keywords: (type.keywords || []).filter((kw) => hay.includes(norm(kw)))
  })).filter((type) => type.keywords.length);
}

function isAmbiguousClient(clientName) {
  return ["pill", "daily", "lumnina", "griffield"].includes(key(clientName));
}

function matchClientToItem(client, item, config, forcedClient = null) {
  const title = norm(item.title);
  const summary = norm(item.summary);
  const hay = `${title} ${summary}`;
  const clientName = norm(client.client);
  const exactTitle = clientName && title.includes(clientName);
  const exactSummary = clientName && summary.includes(clientName);
  const keywords = (client.keywords || []).map(norm).filter((kw) => kw.length > 3);
  const matchedKeywords = [...new Set(keywords.filter((kw) => hay.includes(kw)).slice(0, 12))];
  const distinctiveMatches = matchedKeywords.filter(isDistinctiveTerm);
  const signalTypes = signalKeywordTypes(hay, config);
  const hasClientMatch = exactTitle || exactSummary || distinctiveMatches.length > 0 || forcedClient;
  if (!hasClientMatch || !signalTypes.length) return null;

  const locationTerms = toks(client.locationProbable).filter((term) => !["por", "confirmar", "peru", "lima"].includes(term));
  const locationMatch = locationTerms.some((term) => hay.includes(term));
  const recent = item.publishedAt ? (Date.now() - new Date(item.publishedAt).getTime()) / 86400000 <= 7 : false;
  const officialSource = /gob|elperuano|proinversion|mef|minem|mtc|produce|osinergmin|senace|oefa/i.test(item.sourceName || item.sourceId || "");

  let score = 0;
  if (exactTitle) score += 35;
  if (!exactTitle && exactSummary) score += 20;
  if (distinctiveMatches.length) score += Math.min(25, 8 + distinctiveMatches.length * 4);
  score += Math.min(25, signalTypes.reduce((total, type) => total + type.weight, 0) * 3);
  if (officialSource) score += 15;
  if (locationMatch) score += 10;
  if (recent) score += 10;
  if (isAmbiguousClient(client.client) && !exactTitle) score -= 25;
  score = Math.max(0, Math.min(100, score));

  return {
    clientId: client.contractNumber || key(client.client),
    clientName: client.client,
    matchedKeywords,
    signalType: signalTypes[0].type,
    relevanceScore: score,
    priority: score >= 70 ? "Alta" : score >= 45 ? "Media" : "Baja",
    locationText: locationMatch ? client.locationProbable : "",
    status: "new"
  };
}

function rssClientSource(client) {
  return {
    id: `google_news_${key(client.client)}`,
    name: `Google News - ${client.client}`,
    method: "dynamic_rss",
    feedUrl: client.googleNewsRssUrl,
    priority: "alta"
  };
}

async function fetchSource(source) {
  const startedAt = new Date().toISOString();
  const run = {
    runId: `RUN-${Date.now()}-${key(source.id)}`,
    sourceId: source.id,
    sourceName: source.name,
    startedAt,
    status: "running",
    itemsRead: 0,
    itemsNew: 0,
    itemsMatched: 0,
    error: ""
  };
  try {
    const url = source.feedUrl || source.pageUrl;
    if (!url) throw new Error("Fuente sin URL");
    const text = await fetchText(url);
    const items = source.method === "html_polling" ? parseHtmlLinks(text, source) : parseRss(text, source);
    run.itemsRead = items.length;
    run.status = "success";
    return { run, items };
  } catch (error) {
    run.status = "error";
    run.error = error.message || String(error);
    return { run, items: [] };
  } finally {
    run.finishedAt = new Date().toISOString();
  }
}

function loadJson(filePath, fallback) {
  try {
    return JSON.parse(fs.readFileSync(filePath, "utf8"));
  } catch {
    return fallback;
  }
}

function signalListFromPayload(payload) {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.signals)) return payload.signals;
  return [];
}

function upsertSignals(existingSignals, items, config, forcedClient = null) {
  const byId = new Map(existingSignals.map((signal) => [signal.externalId || signal.id, signal]));
  let itemsNew = 0;
  let itemsMatched = 0;
  for (const item of items) {
    const normalized = normalizeUrl(item.url || `${item.sourceId}-${item.title}-${item.publishedAt}`);
    const baseExternalId = sha256(normalized || `${item.sourceId}-${key(item.title)}-${item.publishedAt}`);
    const clientsToCheck = forcedClient ? [forcedClient] : (config.clients || []).filter((client) => client.enabled);
    for (const client of clientsToCheck) {
      const match = matchClientToItem(client, item, config, forcedClient);
      if (!match) continue;
      itemsMatched++;
      const externalId = `${baseExternalId}-${key(match.clientId || match.clientName)}`;
      const existing = byId.get(externalId);
      if (existing) {
        existing.lastSeenAt = new Date().toISOString();
        continue;
      }
      itemsNew++;
      byId.set(externalId, {
        id: externalId,
        externalId,
        sourceId: item.sourceId,
        sourceName: item.sourceName,
        title: item.title,
        summary: String(item.summary || "").slice(0, 600),
        url: item.url,
        publishedAt: item.publishedAt,
        firstSeenAt: new Date().toISOString(),
        lastSeenAt: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        rawMetadata: item.rawMetadata || {},
        ...match
      });
    }
  }
  const signals = [...byId.values()]
    .sort((a, b) => new Date(b.publishedAt || b.createdAt) - new Date(a.publishedAt || a.createdAt))
    .slice(0, MAX_SIGNALS);
  return { signals, itemsNew, itemsMatched };
}

async function main() {
  const config = loadJson(CONFIG_PATH, null);
  if (!config) throw new Error(`No se pudo leer ${CONFIG_PATH}`);
  fs.mkdirSync(DATA_DIR, { recursive: true });
  let signals = signalListFromPayload(loadJson(SIGNALS_PATH, []));
  let runs = loadJson(RUNS_PATH, []);

  const sources = (config.sources || []).filter((source) => source.backendEnabled && (source.feedUrl || source.pageUrl) && source.method !== "manual_email");
  const googleClients = ENABLE_CLIENT_GOOGLE_NEWS
    ? (config.clients || []).filter((client) => client.enabled && client.googleNewsRssUrl).slice(0, MAX_GOOGLE_CLIENTS)
    : [];
  const jobs = [
    ...sources.map((source) => ({ source })),
    ...googleClients.map((client) => ({ source: rssClientSource(client), client }))
  ];

  let totals = { itemsRead: 0, itemsNew: 0, itemsMatched: 0, sourcesOk: 0, sourcesError: 0 };
  for (const job of jobs) {
    const result = await fetchSource(job.source);
    const stored = upsertSignals(signals, result.items, config, job.client || null);
    signals = stored.signals;
    result.run.itemsNew = stored.itemsNew;
    result.run.itemsMatched = stored.itemsMatched;
    totals.itemsRead += result.run.itemsRead;
    totals.itemsNew += stored.itemsNew;
    totals.itemsMatched += stored.itemsMatched;
    totals.sourcesOk += result.run.status === "success" ? 1 : 0;
    totals.sourcesError += result.run.status === "error" ? 1 : 0;
    runs.unshift(result.run);
    console.log(`${result.run.status.toUpperCase()} ${job.source.name}: ${result.run.itemsRead} items, ${stored.itemsMatched} matches, ${stored.itemsNew} new${result.run.error ? ` (${result.run.error})` : ""}`);
  }

  const payload = {
    generatedAt: new Date().toISOString(),
    country: config.country || "PE",
    sourcesConfigured: config.sources?.length || 0,
    clientsConfigured: config.clients?.length || 0,
    clientGoogleNewsEnabled: ENABLE_CLIENT_GOOGLE_NEWS,
    totals,
    signals
  };
  fs.writeFileSync(SIGNALS_PATH, `${JSON.stringify(payload, null, 2)}\n`, "utf8");
  fs.writeFileSync(RUNS_PATH, `${JSON.stringify(runs.slice(0, 200), null, 2)}\n`, "utf8");
  console.log(`Generated ${signals.length} signals at ${SIGNALS_PATH}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
