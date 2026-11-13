const rssSources = [
  ["Gestion Economia", "https://gestion.pe/arc/outboundfeeds/rss/category/economia/?outputType=xml"],
  ["Gestion Empresas", "https://gestion.pe/arc/outboundfeeds/rss/category/economia/empresas/?outputType=xml"],
  ["Gestion Inmobiliaria", "https://gestion.pe/arc/outboundfeeds/rss/category/tu-dinero/inmobiliaria/?outputType=xml"],
  ["Gestion Ultimas Noticias", "https://gestion.pe/arc/outboundfeeds/rss/?outputType=xml"]
];

function newsHttpUrl(value, baseUrl) {
  if (!String(value || "").trim()) return "";
  try {
    const url = new URL(String(value).trim(), baseUrl);
    return ["http:", "https:"].includes(url.protocol) && !url.username && !url.password ? url.href : "";
  } catch {
    return "";
  }
}

const fetchText = async (value) => {
  const url = newsHttpUrl(value);
  if (!url) throw new Error("La fuente debe tener una URL http o https válida.");
  const urls = [
    url,
    `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`,
    `https://corsproxy.io/?${encodeURIComponent(url)}`
  ];
  let lastError = null;
  for (const u of urls) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 12000);
    try {
      const res = await fetch(u, { signal: controller.signal });
      if (res.ok) return await res.text();
      lastError = new Error(`HTTP ${res.status}`);
    } catch (err) {
      lastError = err.name === "AbortError" ? new Error("La fuente tardó demasiado en responder.") : err;
    } finally {
      clearTimeout(timeout);
    }
  }
  throw lastError || new Error("No se pudo leer el RSS.");
};

function cleanHtml(text) {
  return String(text || "").replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}

function parseNewsFeed(xmlText, feedUrl, limit = 35) {
  const xml = new DOMParser().parseFromString(xmlText, "text/xml");
  if (xml.querySelector("parsererror") || !["rss", "rdf", "feed"].includes(xml.documentElement?.localName?.toLowerCase())) {
    throw new Error("El enlace no contiene un canal RSS o Atom válido.");
  }
  const atom = xml.documentElement.localName.toLowerCase() === "feed";
  return [...xml.getElementsByTagNameNS("*", atom ? "entry" : "item")].slice(0, limit).map((item) => {
    const children = [...item.children];
    const get = (tag) => children.find((node) => node.localName === tag)?.textContent?.trim() || "";
    const date = new Date(get("pubDate") || get("published") || get("updated") || get("date"));
    const title = cleanHtml(get("title"));
    const summary = cleanHtml(get("description") || get("summary") || get("content"));
    const atomLink = children.find((node) => node.localName === "link" && [null, "", "alternate"].includes(node.getAttribute("rel")));
    const link = atom ? atomLink?.getAttribute("href") : get("link") || (/^https?:\/\//i.test(get("guid")) ? get("guid") : "");
    const categories = children.filter((node) => node.localName === "category").map((node) => cleanHtml(node.getAttribute("term") || node.textContent));
    return {
      title,
      summary,
      url: newsHttpUrl(link, feedUrl),
      publishedAt: Number.isNaN(date.getTime()) ? new Date().toISOString() : date.toISOString(),
      categories
    };
  }).filter((item) => item.title);
}

function parseRss(xmlText, sourceName, feedUrl) {
  return parseNewsFeed(xmlText, feedUrl, 30).map(({ title, summary, url, publishedAt, categories }) => {
    return {
      id: `RSS-${key(sourceName)}-${key(title).slice(0, 60)}`,
      title,
      summary,
      source: sourceName,
      date: publishedAt.slice(0, 10),
      url,
      tags: [...categories, title, summary].join(" ").split(/[,;/\s]+/).filter((x) => x.length > 3).slice(0, 40),
      type: /riesgo|alerta|sunat|multa|crisis|conflicto|cae|frena|ilegal/i.test(`${title} ${summary}`) ? "Riesgo" : "Oportunidad"
    };
  });
}

function configuredNewsSources(config) {
  const configured = (config?.sources || []).filter((source) => source.userManaged === true && source.backendEnabled && source.feedUrl && source.method !== "html_polling");
  const seen = new Set();
  return [...rssSources, ...configured.map((source) => [source.name, source.feedUrl])].filter(([, url]) => {
    const normalized = newsHttpUrl(url);
    if (!normalized || seen.has(normalized)) return false;
    seen.add(normalized);
    return true;
  });
}

async function refreshGestionRss() {
  const btns = $$('[data-action="refresh-rss"]');
  btns.forEach((b) => { b.disabled = true; b.textContent = "Actualizando..."; });
  try {
    const config = typeof loadIntelConfig === "function" ? await loadIntelConfig() : null;
    const batches = [];
    let succeeded = 0, failed = 0;
    for (const [name, url] of configuredNewsSources(config)) {
      try {
        batches.push(...parseRss(await fetchText(url), name, url));
        succeeded++;
      } catch (err) {
        failed++;
        console.warn("RSS source failed", name, err);
      }
    }
    if (!succeeded) throw new Error("No se pudo leer ningún canal RSS. Revisa las fuentes o vuelve a intentarlo.");
    const existing = new Set(state.signals.map((s) => s.id || key(`${s.source}-${s.title}`)));
    const fresh = batches.filter((s) => {
      if (existing.has(s.id)) return false;
      existing.add(s.id);
      return true;
    });
    state.signals = [...fresh, ...state.signals].slice(0, 240);
    state.settings.lastRssSync = new Date().toISOString();
    save();
    toast("Noticias actualizadas", `${fresh.length} titulares nuevos. ${succeeded} fuentes leídas${failed ? `; ${failed} no respondieron o no tienen un RSS válido` : ""}.`);
    render();
  } catch (err) {
    toast("No se pudo actualizar", err.message || "Revisa conexion o CORS del RSS.");
  } finally {
    btns.forEach((b) => { b.disabled = false; b.textContent = "Actualizar noticias"; });
  }
}

if (typeof routes !== "undefined") {
  const oldDashboard = routes.dashboard;
  routes.dashboard = function () {
    return oldDashboard().replace(
      '<button class="btn" data-action="simulate">Simular alerta</button>',
      '<button class="btn" data-action="refresh-rss">Actualizar noticias</button><button class="btn" data-action="simulate">Simular alerta</button>'
    );
  };

  const oldAlerts = routes.alerts;
  routes.alerts = function () {
    return oldAlerts().replace(
      '<button class="btn" data-action="notify">Permitir notificaciones</button>',
      '<button class="btn primary" data-action="refresh-rss">Actualizar noticias</button><button class="btn" data-action="notify">Permitir notificaciones</button>'
    ).replace(
      "<th>Accion</th>",
      "<th>Accion</th>"
    ).replaceAll(
      "</button></td></tr>",
      "</button></td></tr>"
    );
  };

  const oldSettings = routes.settings;
  routes.settings = function () {
    const last = state.settings.lastRssSync ? new Date(state.settings.lastRssSync).toLocaleString() : "Aun no ejecutado";
    return oldSettings().replace(
      "<strong>RSS y feeds publicos</strong><p>Capa prevista para titulares de mercado, infraestructura y normativa.</p>",
      `<strong>Fuentes de noticias</strong><p>Gestión y canales RSS agregados por la administradora. Última actualización: ${h(last)}.</p>`
    );
  };
}

const originalAction = action;
action = function (a, id) {
  if (a === "refresh-rss") return refreshGestionRss();
  return originalAction(a, id);
};
