const rssSources = [
  ["Gestion Economia", "https://gestion.pe/arc/outboundfeeds/rss/category/economia/?outputType=xml"],
  ["Gestion Empresas", "https://gestion.pe/arc/outboundfeeds/rss/category/economia/empresas/?outputType=xml"],
  ["Gestion Inmobiliaria", "https://gestion.pe/arc/outboundfeeds/rss/category/tu-dinero/inmobiliaria/?outputType=xml"],
  ["Gestion Ultimas Noticias", "https://gestion.pe/arc/outboundfeeds/rss/?outputType=xml"]
];

const fetchText = async (url) => {
  const urls = [
    url,
    `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`,
    `https://corsproxy.io/?${encodeURIComponent(url)}`
  ];
  let lastError = null;
  for (const u of urls) {
    try {
      const res = await fetch(u);
      if (res.ok) return await res.text();
      lastError = new Error(`HTTP ${res.status}`);
    } catch (err) {
      lastError = err;
    }
  }
  throw lastError || new Error("No se pudo leer el RSS.");
};

function cleanHtml(text) {
  return String(text || "").replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}

function parseRss(xmlText, sourceName) {
  const xml = new DOMParser().parseFromString(xmlText, "text/xml");
  return [...xml.querySelectorAll("item")].slice(0, 30).map((item) => {
    const get = (tag) => item.querySelector(tag)?.textContent?.trim() || "";
    const date = get("pubDate") ? new Date(get("pubDate")).toISOString().slice(0, 10) : d();
    const title = cleanHtml(get("title"));
    const summary = cleanHtml(get("description"));
    const link = get("link");
    const categories = [...item.querySelectorAll("category")].map((x) => cleanHtml(x.textContent));
    return {
      id: `RSS-${key(sourceName)}-${key(title).slice(0, 60)}`,
      title,
      summary,
      source: sourceName,
      date,
      link,
      tags: [...categories, title, summary].join(" ").split(/[,;/\s]+/).filter((x) => x.length > 3).slice(0, 40),
      type: /riesgo|alerta|sunat|multa|crisis|conflicto|cae|frena|ilegal/i.test(`${title} ${summary}`) ? "Riesgo" : "Oportunidad"
    };
  }).filter((x) => x.title);
}

async function refreshGestionRss() {
  const btns = $$('[data-action="refresh-rss"]');
  btns.forEach((b) => { b.disabled = true; b.textContent = "Actualizando..."; });
  try {
    const batches = [];
    for (const [name, url] of rssSources) {
      try {
        batches.push(...parseRss(await fetchText(url), name));
      } catch (err) {
        console.warn("RSS source failed", name, err);
      }
    }
    if (!batches.length) throw new Error("No se pudo leer ningun canal RSS de Gestion.");
    const existing = new Set(state.signals.map((s) => s.id || key(`${s.source}-${s.title}`)));
    const fresh = batches.filter((s) => !existing.has(s.id));
    state.signals = [...fresh, ...state.signals].slice(0, 240);
    state.settings.lastRssSync = new Date().toISOString();
    save();
    toast("Noticias actualizadas", `${fresh.length} titulares nuevos de Gestion.`);
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
      `<strong>RSS Gestion activo</strong><p>Economia, Empresas, Inmobiliaria y ultimas noticias. Ultima actualizacion: ${h(last)}.</p>`
    );
  };
}

const originalAction = action;
action = function (a, id) {
  if (a === "refresh-rss") return refreshGestionRss();
  return originalAction(a, id);
};
