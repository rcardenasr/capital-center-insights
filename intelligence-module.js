const INTEL_KEY = "cci-intel-signals-v1";
const INTEL_RUNS_KEY = "cci-intel-runs-v1";
const INTEL_REMOTE_URL = "./data/intel_signals.json?v=20260819-google-news1";
const ENABLE_BROWSER_CLIENT_GOOGLE_NEWS = localStorage.getItem("cci-enable-client-google-news") !== "false";
const intel = {
  config: null,
  remoteMeta: null,
  signals: JSON.parse(localStorage.getItem(INTEL_KEY) || "[]"),
  runs: JSON.parse(localStorage.getItem(INTEL_RUNS_KEY) || "[]"),
  filters: {}
};

const saveIntel = () => {
  localStorage.setItem(INTEL_KEY, JSON.stringify(intel.signals.slice(0, 400)));
  localStorage.setItem(INTEL_RUNS_KEY, JSON.stringify(intel.runs.slice(0, 80)));
};

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

function compatibleStateSignal(signal) {
  return {
    id: signal.id,
    title: signal.title,
    summary: signal.summary || "",
    source: signal.sourceName || signal.source || "",
    url: signal.url || "",
    date: String(signal.publishedAt || signal.createdAt || "").slice(0, 10),
    tags: signal.matchedKeywords || [],
    type: signal.signalType || "Oportunidad"
  };
}

function mergeIntelSignals(incoming) {
  const current = new Map(intel.signals.map((signal) => [signal.externalId || signal.id, signal]));
  incoming.forEach((signal) => {
    const id = signal.externalId || signal.id;
    if (!id) return;
    current.set(id, { ...(current.get(id) || {}), ...signal });
  });
  intel.signals = [...current.values()]
    .sort((a, b) => new Date(b.publishedAt || b.createdAt || 0) - new Date(a.publishedAt || a.createdAt || 0))
    .slice(0, 400);

  const stateById = new Map(state.signals.map((signal) => [signal.id, signal]));
  intel.signals.forEach((signal) => {
    const compatible = compatibleStateSignal(signal);
    if (stateById.has(signal.id)) Object.assign(stateById.get(signal.id), compatible);
    else state.signals.unshift(compatible);
  });
  state.signals = state.signals.slice(0, 260);
}

async function loadPublishedIntelSignals() {
  try {
    const res = await fetch(INTEL_REMOTE_URL);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const payload = await res.json();
    const signals = Array.isArray(payload) ? payload : payload.signals || [];
    mergeIntelSignals(signals);
    intel.remoteMeta = Array.isArray(payload) ? { generatedAt: null, totals: null } : payload;
    saveIntel();
    save();
    return signals.length;
  } catch (err) {
    console.warn("No se pudo leer data/intel_signals.json", err);
    return 0;
  }
}

async function loadIntelConfig() {
  if (intel.config) return intel.config;
  const res = await fetch("./alertas_clientes_config.json?v=20260819-intel1");
  if (!res.ok) throw new Error(`No se pudo leer alertas_clientes_config.json (${res.status})`);
  intel.config = await res.json();
  return intel.config;
}

function normalizeUrl(url) {
  try {
    const u = new URL(url);
    [...u.searchParams.keys()].forEach((k) => {
      if (/^utm_|^gclid$|^fbclid$|^mc_/i.test(k)) u.searchParams.delete(k);
    });
    u.hash = "";
    u.protocol = "https:";
    return u.toString().replace(/\/$/, "");
  } catch {
    return key(url);
  }
}

async function sha256(text) {
  const bytes = new TextEncoder().encode(text);
  const hash = await crypto.subtle.digest("SHA-256", bytes);
  return [...new Uint8Array(hash)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

function signalKeywordTypes(text, config) {
  const n = norm(text);
  return (config.signalTypes || []).map((t) => ({
    type: t.type,
    weight: t.weight || 0,
    keywords: (t.keywords || []).filter((kw) => n.includes(norm(kw)))
  })).filter((x) => x.keywords.length);
}

function clientConfigFor(client, config) {
  return (config.clients || []).find((c) =>
    String(c.contractNumber || "").trim() === String(client.id || "").trim() ||
    key(c.client) === key(client.nombre_cliente)
  );
}

function isAmbiguousClient(name) {
  return ["pill", "daily", "lumnina", "griffield"].includes(key(name));
}

function matchClientToItem(client, item, config, forcedClientConfig = null) {
  const cconf = forcedClientConfig || clientConfigFor(client, config);
  const title = norm(item.title);
  const summary = norm(item.summary);
  const hay = `${title} ${summary}`;
  const clientName = norm(client.nombre_cliente);
  const exactTitle = clientName && title.includes(clientName);
  const exactSummary = clientName && summary.includes(clientName);
  const kws = [...toks(client.palabras_clave), ...((cconf?.keywords || []).map(norm))]
    .filter((x) => x.length > 3);
  const matchedKeywords = [...new Set(kws.filter((kw) => hay.includes(kw)).slice(0, 12))];
  const distinctiveMatches = matchedKeywords.filter(isDistinctiveTerm);
  const signalTypes = signalKeywordTypes(hay, config);
  const hasSignal = signalTypes.length > 0;
  const hasSpecificClientMatch = exactTitle || exactSummary || distinctiveMatches.length > 0 || forcedClientConfig;
  if (!hasSpecificClientMatch || !hasSignal) return null;

  const locationTerms = toks(client.ubicacion).filter((x) => !["por", "confirmar", "peru", "lima"].includes(x));
  const locationMatch = locationTerms.some((x) => hay.includes(x));
  const recent = item.publishedAt ? (Date.now() - new Date(item.publishedAt).getTime()) / 86400000 <= 7 : false;
  const officialSource = /gob|elperuano|proinversion|mef|minem|mtc|produce|osinergmin|senace|oefa/i.test(item.sourceName || item.sourceId || "");
  let score = 0;
  if (exactTitle) score += 35;
  if (!exactTitle && exactSummary) score += 20;
  if (distinctiveMatches.length) score += Math.min(25, 8 + distinctiveMatches.length * 4);
  score += Math.min(25, signalTypes.reduce((a, x) => a + x.weight, 0) * 3);
  if (officialSource) score += 15;
  if (locationMatch) score += 10;
  if (recent) score += 10;
  if (isAmbiguousClient(client.nombre_cliente) && !exactTitle) score -= 25;
  score = Math.max(0, Math.min(100, score));

  return {
    clientId: client.id,
    clientName: client.nombre_cliente,
    matchedKeywords,
    signalType: signalTypes[0]?.type || "otro",
    relevanceScore: score,
    priority: score >= 70 ? "Alta" : score >= 45 ? "Media" : "Baja",
    locationText: locationMatch ? client.ubicacion : "",
    status: "new"
  };
}

function parseRssIntel(xmlText, source) {
  const xml = new DOMParser().parseFromString(xmlText, "text/xml");
  return [...xml.querySelectorAll("item")].slice(0, 35).map((item) => {
    const get = (tag) => item.querySelector(tag)?.textContent?.trim() || "";
    const publishedAt = get("pubDate") ? new Date(get("pubDate")).toISOString() : new Date().toISOString();
    return {
      sourceId: source.id,
      sourceName: source.name,
      title: cleanHtml(get("title")),
      summary: cleanHtml(get("description")),
      url: get("link") || get("guid"),
      publishedAt,
      rawMetadata: { category: [...item.querySelectorAll("category")].map((x) => cleanHtml(x.textContent)) }
    };
  }).filter((x) => x.title);
}

function rssClientSource(clientConfig) {
  return {
    id: `google_news_${key(clientConfig.client)}`,
    name: `Google News - ${clientConfig.client}`,
    method: "dynamic_rss",
    feedUrl: clientConfig.googleNewsRssUrl,
    priority: "alta"
  };
}

async function fetchIntelSource(source) {
  const startedAt = new Date().toISOString();
  const run = { runId: `RUN-${Date.now()}-${key(source.id)}`, sourceId: source.id, startedAt, status: "running", itemsRead: 0, itemsNew: 0, itemsMatched: 0, error: "" };
  try {
    const url = source.feedUrl || source.url;
    if (!url) throw new Error("Fuente sin URL");
    const items = parseRssIntel(await fetchText(url), source);
    run.itemsRead = items.length;
    run.status = "success";
    return { run, items };
  } catch (err) {
    run.status = "error";
    run.error = err.message || String(err);
    return { run, items: [] };
  } finally {
    run.finishedAt = new Date().toISOString();
  }
}

async function normalizeAndStoreItems(items, config, forcedClientConfig = null) {
  const existing = new Map(intel.signals.map((s) => [s.externalId, s]));
  let itemsNew = 0, itemsMatched = 0;
  for (const item of items) {
    const normalized = normalizeUrl(item.url || `${item.sourceId}-${item.title}-${item.publishedAt}`);
    const externalId = await sha256(normalized || `${item.sourceId}-${key(item.title)}-${item.publishedAt}`);
    const clientsToCheck = forcedClientConfig
      ? state.clients.filter((c) => key(c.nombre_cliente) === key(forcedClientConfig.client) || String(c.id) === String(forcedClientConfig.contractNumber))
      : state.clients;
    for (const client of clientsToCheck) {
      const match = matchClientToItem(client, item, config, forcedClientConfig);
      if (!match) continue;
      itemsMatched++;
      const id = `${externalId}-${key(match.clientId)}`;
      if (existing.has(id)) {
        existing.get(id).lastSeenAt = new Date().toISOString();
        continue;
      }
      itemsNew++;
      const signal = {
        id,
        externalId: id,
        sourceId: item.sourceId,
        sourceName: item.sourceName,
        title: item.title,
        summary: item.summary,
        url: item.url,
        publishedAt: item.publishedAt,
        firstSeenAt: new Date().toISOString(),
        lastSeenAt: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        rawMetadata: item.rawMetadata || {},
        ...match
      };
      intel.signals.unshift(signal);
      state.signals.unshift(compatibleStateSignal(signal));
    }
  }
  state.signals = state.signals.slice(0, 240);
  intel.signals = intel.signals.slice(0, 400);
  return { itemsNew, itemsMatched };
}

async function runIntelRefresh() {
  const buttons = $$('[data-action="run-intel"]');
  buttons.forEach((b) => { b.disabled = true; b.textContent = "Ejecutando..."; });
  try {
    const config = await loadIntelConfig();
    const directSources = (config.sources || []).filter((s) =>
      s.backendEnabled && s.feedUrl && ["gestion_economia_rss", "elcomercio_economia_rss", "elcomercio_dia1_rss", "elcomercio_casaymas_rss"].includes(s.id)
    );
    const googleClients = ENABLE_BROWSER_CLIENT_GOOGLE_NEWS
      ? (config.clients || []).filter((c) => c.enabled && c.googleNewsRssUrl && c.confidence !== "bajo").slice(0, 8)
      : [];
    const jobs = [
      ...directSources.map((source) => ({ source })),
      ...googleClients.map((client) => ({ source: rssClientSource(client), client }))
    ];
    let totalRead = 0, totalNew = 0, totalMatched = 0;
    for (const job of jobs) {
      const result = await fetchIntelSource(job.source);
      const stored = await normalizeAndStoreItems(result.items, config, job.client || null);
      result.run.itemsNew = stored.itemsNew;
      result.run.itemsMatched = stored.itemsMatched;
      totalRead += result.run.itemsRead;
      totalNew += stored.itemsNew;
      totalMatched += stored.itemsMatched;
      intel.runs.unshift(result.run);
    }
    state.settings.lastIntelSync = new Date().toISOString();
    saveIntel();
    save();
    toast("Inteligencia actualizada", `${totalNew} nuevas señales, ${totalMatched} coincidencias, ${totalRead} items leidos.`);
    render();
  } catch (err) {
    toast("Error de inteligencia", err.message || String(err));
  } finally {
    buttons.forEach((b) => { b.disabled = false; b.textContent = "Actualizar inteligencia"; });
  }
}

function filteredIntelSignals() {
  const f = intel.filters;
  return intel.signals.filter((s) =>
    (!f.client || s.clientName === f.client) &&
    (!f.type || s.signalType === f.type) &&
    (!f.source || s.sourceName === f.source) &&
    (!f.priority || s.priority === f.priority) &&
    (!f.status || s.status === f.status) &&
    (!f.q || norm([s.title, s.summary, s.clientName, s.sourceName].join(" ")).includes(norm(f.q)))
  ).sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));
}

function optFilter(keyName, label, values) {
  return `<select class="select" data-intel-filter="${keyName}"><option value="">${label}</option>${[...new Set(values.filter(Boolean))].sort().map((v) => `<option ${intel.filters[keyName] === v ? "selected" : ""}>${h(v)}</option>`).join("")}</select>`;
}

function intelligenceView() {
  const rows = filteredIntelSignals();
  const last = state.settings.lastIntelSync ? new Date(state.settings.lastIntelSync).toLocaleString() : "Aun no ejecutado";
  const remoteLast = intel.remoteMeta?.generatedAt ? new Date(intel.remoteMeta.generatedAt).toLocaleString() : "Pendiente";
  const remoteTotals = intel.remoteMeta?.totals;
  return `${head("Inteligencia comercial", "Alertas reales", `<button class="btn primary" data-action="run-intel">Actualizar inteligencia</button>`)}
    <section class="grid kpi-grid">
      ${kpi("Señales guardadas", intel.signals.length, "Deduplicadas por URL y cliente")}
      ${kpi("Alta relevancia", intel.signals.filter((s) => s.priority === "Alta").length, "Score >= 70")}
      ${kpi("Fuentes configuradas", intel.config?.sources?.length || 12, remoteTotals ? `${remoteTotals.sourcesOk || 0} OK / ${remoteTotals.sourcesError || 0} con error` : "RSS, Google News y HTML")}
      ${kpi("Scheduler", remoteLast, `Manual: ${last}`)}
    </section>
    <section class="card pad" style="margin-top:16px">
      <div class="toolbar intel-toolbar">
        <input class="search" data-intel-filter="q" placeholder="Buscar titulo, cliente o fuente" value="${h(intel.filters.q || "")}">
        ${optFilter("client", "Cliente", intel.signals.map((s) => s.clientName))}
        ${optFilter("type", "Tipo", intel.signals.map((s) => s.signalType))}
        ${optFilter("source", "Fuente", intel.signals.map((s) => s.sourceName))}
        ${optFilter("priority", "Relevancia", ["Alta", "Media", "Baja"])}
        ${optFilter("status", "Estado", ["new", "reviewed", "dismissed", "opportunity"])}
      </div>
      <div class="table-wrap"><table><thead><tr><th>Fecha</th><th>Cliente</th><th>Tipo</th><th>Titulo</th><th>Fuente</th><th>Score</th><th>Estado</th><th>Abrir</th></tr></thead><tbody>
        ${rows.map((s) => `<tr><td>${h(String(s.publishedAt || "").slice(0, 10))}</td><td>${h(s.clientName)}</td><td>${pill(s.signalType)}</td><td><strong>${sourceAnchor(s, h(s.title))}</strong><div class="muted">${h(s.summary || "")}</div><div class="pill-row">${s.matchedKeywords.slice(0, 5).map((x) => pill(x)).join("")}</div></td><td>${sourceAnchor(s, h(s.sourceName))}</td><td>${pill(s.relevanceScore, cls(s.priority))}</td><td>${pill(s.status)}</td><td>${s.url ? `<a class="btn" href="${h(s.url)}" target="_blank" rel="noopener">Abrir</a>` : ""}</td></tr>`).join("") || `<tr><td colspan="8"><div class="empty">Todavia no hay señales reales. Usa Actualizar inteligencia.</div></td></tr>`}
      </tbody></table></div>
    </section>`;
}

if (typeof routes !== "undefined") {
  routes.intelligence = intelligenceView;
  const previousRender = render;
  render = function () {
    previousRender();
    const navEl = $(".nav");
    if (navEl && !navEl.querySelector('[data-view="intelligence"]')) {
      const b = document.createElement("button");
      b.dataset.view = "intelligence";
      b.innerHTML = `<span>Inteligencia</span><span class="badge">${intel.signals.filter((s) => s.priority !== "Baja").length}</span>`;
      b.onclick = () => { view = "intelligence"; clientId = null; render(); };
      const alertsButton = navEl.querySelector('[data-view="alerts"]');
      navEl.insertBefore(b, alertsButton?.nextSibling || null);
    }
  };

  const oldDetail = routes.detail;
  routes.detail = function () {
    const html = oldDetail();
    const c = state.clients.find((x) => x.id === clientId);
    if (!c) return html;
    const recent = intel.signals.filter((s) => s.clientId === c.id).slice(0, 5);
    const block = `<div class="card pad"><div class="section-title"><h2>Señales reales</h2>${pill(`${recent.length} recientes`)}</div>${recent.map((s) => `<div class="alert-item"><div class="alert-head"><strong>${sourceAnchor(s, h(s.title))}</strong>${pill(s.relevanceScore, cls(s.priority))}</div><span class="muted">${sourceAnchor(s, h(s.sourceName))} - ${h(String(s.publishedAt).slice(0, 10))}</span></div>`).join("") || `<div class="empty">Sin señales reales para este cliente.</div>`}</div>`;
    return html.replace("</section>", `${block}</section>`);
  };
}

document.addEventListener("input", (e) => {
  if (e.target?.dataset?.intelFilter) {
    intel.filters[e.target.dataset.intelFilter] = e.target.value;
    render();
  }
});

document.addEventListener("change", (e) => {
  if (e.target?.dataset?.intelFilter) {
    intel.filters[e.target.dataset.intelFilter] = e.target.value;
    render();
  }
});

const previousIntelAction = action;
action = function (a, id) {
  if (a === "run-intel") return runIntelRefresh();
  return previousIntelAction(a, id);
};

Promise.all([loadIntelConfig(), loadPublishedIntelSignals()])
  .then(() => { if (view === "intelligence" || view === "dashboard" || view === "alerts") render(); })
  .catch((err) => console.warn(err));
