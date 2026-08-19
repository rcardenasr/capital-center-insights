const KEY = "cci-state-v2";
const fields = ["nombre_cliente", "empresa", "rubro", "tipo_activo", "ubicacion", "distrito", "provincia", "departamento", "area", "palabras_clave", "estado", "observaciones"];
const labels = { nombre_cliente: "Nombre cliente", empresa: "Empresa", rubro: "Rubro", tipo_activo: "Tipo activo", ubicacion: "Ubicacion", distrito: "Distrito", provincia: "Provincia", departamento: "Departamento", area: "Area", palabras_clave: "Palabras clave", estado: "Estado", observaciones: "Observaciones" };
const d = (n = 0) => { const x = new Date(); x.setDate(x.getDate() + n); return x.toISOString().slice(0, 10); };
const demoClients = [
  ["CLI-001", "Inversiones Lurin Sur SAC", "Capital Center", "industrial / logistico", "terreno", "Lurin, Lima", "Lurin", "Lima", "Lima", "52 ha", "parque industrial, logistica, zonificacion, carretera, almacenes", "Seguimiento", "Interes en activos con acceso a Panamericana Sur."],
  ["CLI-002", "Desarrolladora Chilca Este SAC", "Capital Center", "desarrollo inmobiliario", "terreno", "Chilca, Canete", "Chilca", "Canete", "Lima", "34 ha", "habilitacion urbana, energia, expansion industrial, suelo eriazo", "Activo", "Busca cambios de norma y proyectos de infraestructura."],
  ["CLI-003", "Grupo Patrimonial Ancon Norte", "Capital Center", "expansion urbana", "terreno", "Ancon, Lima", "Ancon", "Lima", "Lima", "65 ha", "nueva ciudad, vivienda, servicios, zonificacion, transporte", "Activo", "Monitorear anuncios de servicios basicos y vias."],
  ["CLI-004", "Fondo Inmobiliario Santa Rosa", "Capital Center", "comercial / mixto", "proyecto", "Piura", "Piura", "Piura", "Piura", "18 ha", "retail, uso mixto, expansion urbana, comercio, servicios", "Oportunidad", "Evaluar demanda comercial en nuevos ejes urbanos."],
  ["CLI-005", "Corporacion Terranova Peru", "Capital Center", "agroindustrial / inmobiliario", "terreno", "Ica", "Ica", "Ica", "Ica", "40 ha", "agroexportacion, agua, energia, logistica, habilitacion", "Seguimiento", "Alta sensibilidad a normas de agua e infraestructura."],
  ["CLI-006", "Logistica Panamericana Norte", "Capital Center", "logistico", "inmueble", "Huachipa, Lima", "Lurigancho-Chosica", "Lima", "Lima", "22 ha", "almacenes, ultima milla, vias, puente, zonificacion industrial", "Activo", "Interes en mejoras viales y nodos de distribucion."],
  ["CLI-007", "Andes Retail Properties", "Capital Center", "retail", "proyecto", "Arequipa", "Cerro Colorado", "Arequipa", "Arequipa", "12 ha", "centro comercial, vivienda, aeropuerto, expansion, consumo", "Oportunidad", "Busca suelos para comercio y usos complementarios."],
  ["CLI-008", "Consorcio Industrial Pucusana", "Capital Center", "industrial", "terreno", "Pucusana, Lima", "Pucusana", "Lima", "Lima", "29 ha", "industria liviana, habilitacion, carretera, puerto, servicios", "Activo", "Requiere seguimiento de permisos y servicios."],
  ["CLI-009", "Patrimonio Norte Chico", "Capital Center", "turistico / residencial", "terreno", "Huaral, Lima", "Huaral", "Huaral", "Lima", "44 ha", "segunda vivienda, carretera, turismo, agua, habilitacion urbana", "Prospecto", "Potencial de desarrollo residencial de baja densidad."],
  ["CLI-010", "Proyecto Mixto Trujillo Oeste", "Capital Center", "uso mixto", "proyecto", "Trujillo", "Victor Larco Herrera", "Trujillo", "La Libertad", "16 ha", "vivienda, comercio, via expresa, expansion urbana, servicios", "Seguimiento", "Monitorear planes metropolitanos y ejecucion vial."]
].map((r) => Object.fromEntries(["id", ...fields].map((k, i) => [k, r[i]])));
const demoSignals = [
  ["Nueva inversion logistica anunciada cerca de Lurin", "Un operador regional evalua ampliar almacenes con acceso a la Panamericana Sur.", "Feed publico demo", d(), "Lurin, parque industrial, logistica, almacenes", "Oportunidad"],
  ["Municipalidad publica ajuste de zonificacion en Chilca", "La propuesta incorpora suelo productivo y servicios complementarios.", "Normativa municipal demo", d(), "Chilca, zonificacion, habilitacion urbana, industrial", "Riesgo"],
  ["Plan de servicios para expansion urbana en Ancon", "Prioriza agua, saneamiento y conexiones viales para nuevos polos urbanos.", "Plan territorial demo", d(-1), "Ancon, servicios, nueva ciudad, transporte, vivienda", "Seguimiento"],
  ["Nuevo eje comercial toma impulso en Piura", "Desarrolladores reportan demanda por proyectos mixtos y retail.", "Mercado inmobiliario demo", d(), "Piura, retail, uso mixto, comercio", "Oportunidad"],
  ["Proyecto de energia mejora factibilidad en Ica", "La ampliacion de redes reduciria tiempos de habilitacion.", "Infraestructura demo", d(-2), "Ica, energia, agroexportacion, habilitacion", "Oportunidad"],
  ["Mejora vial en Huachipa favorece ultima milla", "La intervencion reduce tiempos hacia almacenes y corredores logisticos.", "Infraestructura demo", d(-1), "Huachipa, almacenes, ultima milla, vias, puente", "Oportunidad"],
  ["Arequipa evalua habilitaciones cerca del aeropuerto", "Cerro Colorado concentra interes comercial y residencial.", "Mercado regional demo", d(-3), "Arequipa, Cerro Colorado, centro comercial, aeropuerto, vivienda", "Seguimiento"],
  ["Pucusana prioriza servicios para industria liviana", "El distrito revisa cartera de servicios basicos productivos.", "Gestion urbana demo", d(), "Pucusana, industria liviana, servicios, carretera", "Oportunidad"],
  ["Nuevo tramo vial eleva interes por terrenos en Huaral", "La mejora de conectividad fortalece segunda vivienda y turismo.", "Infraestructura demo", d(-4), "Huaral, segunda vivienda, turismo, carretera", "Seguimiento"],
  ["Trujillo actualiza expansion urbana", "La propuesta refuerza ejes comerciales, vivienda y corredores de servicios.", "Plan metropolitano demo", d(-1), "Trujillo, vivienda, comercio, via expresa, servicios", "Riesgo"]
].map((r, i) => ({ id: `SIG-${i + 1}`, title: r[0], summary: r[1], source: r[2], date: r[3], tags: r[4].split(/,\s*/), type: r[5] }));
let state = JSON.parse(localStorage.getItem(KEY) || "null") || { session: null, clients: demoClients, signals: demoSignals, settings: { companyName: "Capital Center", logoText: "CC", browserNotifications: false } };
let view = state.session ? "dashboard" : "login", clientId = null, filters = {}, rows = [], headers = [], mapping = {};
const $ = (s, x = document) => x.querySelector(s), $$ = (s, x = document) => [...x.querySelectorAll(s)];
const h = (v) => String(v ?? "").replace(/[&<>"']/g, (m) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "\"": "&quot;", "'": "&#039;" })[m]);
const norm = (v) => String(v || "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();
const key = (v) => norm(v).replace(/[^a-z0-9]/g, "");
const aliases = {
  nombre_cliente: ["nombrecliente", "cliente", "clientes", "razonsocial", "razonsocialcliente", "nombre", "nombres"],
  empresa: ["empresa", "compania", "cliente", "razonsocial"],
  rubro: ["rubro", "sector", "industria", "actividad", "giro"],
  tipo_activo: ["tipoactivo", "activo", "tipoinmueble", "tipopredio"],
  ubicacion: ["ubicacion", "direccion", "zona", "localidad"],
  distrito: ["distrito"],
  provincia: ["provincia"],
  departamento: ["departamento", "region"],
  area: ["area", "aream2", "m2", "hectareas", "ha"],
  palabras_clave: ["palabrasclave", "keywords", "tags", "intereses"],
  estado: ["estado", "situacion", "status"],
  observaciones: ["observaciones", "comentarios", "notas", "ncontrato", "contrato", "codigocontrato", "numerocontrato"]
};
const toks = (v) => norm(v).split(/[,;/\s]+/).filter((x) => x.length > 2);
const save = () => localStorage.setItem(KEY, JSON.stringify(state));
function bestHeader(field) {
  const wanted = aliases[field] || [key(field)];
  return headers.find((hh) => wanted.includes(key(hh))) || headers.find((hh) => wanted.some((a) => key(hh).includes(a) || a.includes(key(hh)))) || "";
}
function score(c, s) {
  const hay = norm([s.title, s.summary, s.tags.join(" ")].join(" "));
  const loc = [c.ubicacion, c.distrito, c.provincia, c.departamento].map(norm).filter(Boolean).filter((x) => hay.includes(x)).length;
  const kw = toks(c.palabras_clave).filter((x) => hay.includes(x)).length;
  const rb = toks(c.rubro).filter((x) => hay.includes(x)).length;
  const n = loc * 35 + kw * 12 + rb * 10;
  return { ...s, score: n, priority: n >= 60 ? "Alta" : n >= 32 ? "Media" : "Baja", clientId: c.id, clientName: c.nombre_cliente };
}
const related = (c) => state.signals.map((s) => score(c, s)).filter((s) => s.score >= 18).sort((a, b) => b.score - a.score);
const alerts = () => state.clients.flatMap(related);
const pill = (t, c = "") => `<span class="pill ${c}">${h(t)}</span>`;
const cls = (p) => p === "Alta" ? "high" : p === "Media" ? "medium" : "low";
const nav = (v, t, b = "") => `<button class="${view === v ? "active" : ""}" data-view="${v}"><span>${t}</span>${b ? `<span class="badge">${b}</span>` : ""}</button>`;
const head = (e, t, a = "") => `<div class="topbar"><div><div class="eyebrow">${e}</div><h1 class="page-title">${t}</h1></div><div class="actions">${a}</div></div>`;
const kpi = (t, v, n) => `<article class="card kpi"><span>${t}</span><strong>${v}</strong><small>${n}</small></article>`;
function render() {
  const app = $("#app");
  if (view === "login") {
    app.innerHTML = `<section class="login-shell"><div class="login-brand"><div><span class="brand-mark">CC</span><h2 class="brand-title">Capital Center Intelligence</h2><p>Monitoreo comercial e inmobiliario para detectar novedades, riesgos y oportunidades asociadas a clientes y activos estrategicos.</p></div><p>Demo MVP con clientes ficticios, reglas de relevancia y notificaciones listas para presentacion.</p></div><div class="login-panel"><form class="login-card" id="login"><p class="eyebrow">Acceso piloto</p><h1>Ingresa al panel</h1><p>Usa las credenciales demo precargadas para explorar la plataforma.</p><div class="field"><label>Correo</label><input type="email" value="demo@capitalcenter.pe"></div><div class="field"><label>Clave</label><input type="password" value="capitaldemo"></div><button class="btn primary">Entrar al piloto</button></form></div></section>`;
    $("#login").onsubmit = (e) => { e.preventDefault(); state.session = { at: new Date().toISOString() }; save(); view = "dashboard"; render(); toast("Sesion iniciada", "Bienvenido al piloto."); };
    return;
  }
  const n = alerts().filter((a) => a.priority !== "Baja").length;
  app.innerHTML = `<div class="app-shell"><aside class="sidebar"><div class="brand"><span class="brand-mark">${h(state.settings.logoText)}</span><div><strong>${h(state.settings.companyName)}</strong><span>Intelligence</span></div></div><nav class="nav">${nav("dashboard", "Dashboard")}${nav("clients", "Clientes")}${nav("alerts", "Centro de alertas", n)}${nav("settings", "Configuracion")}</nav><button class="btn ghost" data-action="logout">Cerrar sesion</button></aside><main class="main">${routes[view]?.() || routes.dashboard()}</main></div>`;
  bind();
}
const routes = {
  dashboard() {
    const a = alerts(), today = d(), top = state.clients.map((c) => ({ ...c, n: related(c).length })).sort((x, y) => y.n - x.n).slice(0, 5);
    return `${head("Panel ejecutivo", "Capital Center Intelligence", `<button class="btn" data-action="simulate">Simular alerta</button><button class="btn primary" data-action="import">Importar archivo</button>`)}<section class="grid kpi-grid">${kpi("Total clientes", state.clients.length, "Base activa del piloto")}${kpi("Alertas activas", a.filter((x) => x.priority !== "Baja").length, "Prioridad media y alta")}${kpi("Noticias hoy", state.signals.filter((x) => x.date === today).length, "Senales demo detectadas")}${kpi("Oportunidades", a.filter((x) => x.type === "Oportunidad").length, "Coincidencias comerciales")}</section><section class="grid two-col" style="margin-top:16px"><div class="card pad"><div class="section-title"><h2>Ultimas actualizaciones</h2><button class="btn" data-view="alerts">Ver alertas</button></div><div class="timeline">${a.slice(0, 6).map((x) => `<div class="timeline-item"><strong>${h(x.title)}</strong><p>${h(x.clientName)} - ${x.date} - score ${x.score}</p></div>`).join("")}</div></div><div class="card pad"><div class="section-title"><h2>Clientes destacados</h2></div>${top.map((c) => `<div class="alert-item"><div class="alert-head"><button class="link-button" data-client="${c.id}">${h(c.nombre_cliente)}</button>${pill(c.n + " alertas", c.n > 2 ? "high" : "medium")}</div><span class="muted">${h(c.ubicacion)} - ${h(c.rubro)}</span></div>`).join("")}</div></section><section class="card pad" style="margin-top:16px"><div class="section-title"><h2>Mapa referencial de activos</h2><span class="muted">Vista demo por ubicacion</span></div><div class="map">${state.clients.map((c, i) => `<button class="map-point" title="${h(c.nombre_cliente)}" data-client="${c.id}" style="left:${12 + i * 19 % 78}%;top:${18 + i * 31 % 64}%"></button>`).join("")}</div></section>`;
  },
  clients() {
    const q = norm(filters.q), list = state.clients.filter((c) => (!q || norm(Object.values(c).join(" ")).includes(q)) && ["ubicacion", "rubro", "tipo_activo", "estado"].every((k) => !filters[k] || c[k] === filters[k]));
    const opts = (k, l) => `<select class="select" data-filter="${k}"><option value="">${l}</option>${[...new Set(state.clients.map((c) => c[k]).filter(Boolean))].sort().map((v) => `<option ${filters[k] === v ? "selected" : ""}>${h(v)}</option>`).join("")}</select>`;
    return `${head("Base comercial", "Clientes", `<button class="btn" data-action="new">Nuevo cliente</button><button class="btn primary" data-action="import">Importar archivo</button>`)}<section class="card pad"><div class="toolbar"><input class="search" id="q" placeholder="Buscar cliente, empresa, ubicacion o palabra clave" value="${h(filters.q || "")}">${opts("ubicacion", "Ubicacion")}${opts("rubro", "Rubro")}${opts("tipo_activo", "Activo")}${opts("estado", "Estado")}</div><div class="table-wrap"><table><thead><tr><th>Cliente</th><th>Rubro</th><th>Activo</th><th>Ubicacion</th><th>Area</th><th>Estado</th><th>Alertas</th></tr></thead><tbody>${list.map((c) => `<tr><td><button class="link-button" data-client="${c.id}">${h(c.nombre_cliente)}</button><div class="muted">${h(c.empresa)}</div></td><td>${h(c.rubro)}</td><td>${h(c.tipo_activo)}</td><td>${h(c.ubicacion)}</td><td>${h(c.area)}</td><td>${pill(c.estado)}</td><td>${pill(related(c).length, related(c).length > 2 ? "high" : "medium")}</td></tr>`).join("") || `<tr><td colspan="7"><div class="empty">No hay clientes para estos filtros.</div></td></tr>`}</tbody></table></div></section>`;
  },
  detail() {
    const c = state.clients.find((x) => x.id === clientId) || state.clients[0], a = related(c);
    return `${head("Detalle de cliente", h(c.nombre_cliente), `<button class="btn" data-view="clients">Volver</button><button class="btn wine" data-action="simulate" data-id="${c.id}">Simular alerta</button>`)}<section class="grid detail-grid"><div class="card pad"><div class="section-title"><h2>Informacion general</h2></div><div class="profile-list">${fields.filter((f) => f !== "palabras_clave").map((f) => `<div><span>${labels[f]}</span><strong>${h(c[f] || "-")}</strong></div>`).join("")}</div><div class="section-title" style="margin-top:18px"><h2>Palabras clave</h2></div><div class="pill-row">${toks(c.palabras_clave).map((x) => pill(x)).join("")}</div></div><div class="grid"><div class="card pad"><div class="section-title"><h2>Noticias y alertas relacionadas</h2>${pill(a.length + " coincidencias", a.length > 2 ? "high" : "medium")}</div>${a.map(alertCard).join("") || `<div class="empty">Aun no hay senales relacionadas.</div>`}</div><div class="card pad"><div class="section-title"><h2>Historial</h2></div><div class="timeline"><div class="timeline-item"><strong>Cliente incorporado</strong><p>Registro disponible para monitoreo por ubicacion, rubro y palabras clave.</p></div><div class="timeline-item"><strong>Reglas activas</strong><p>El sistema compara titulares demo contra temas de interes.</p></div></div></div></div></section>`;
  },
  alerts() {
    return `${head("Monitoreo", "Centro de alertas", `<button class="btn" data-action="notify">Permitir notificaciones</button><button class="btn wine" data-action="simulate">Simular alerta</button>`)}<section class="card pad"><div class="table-wrap"><table><thead><tr><th>Prioridad</th><th>Novedad</th><th>Cliente</th><th>Fuente</th><th>Fecha</th><th>Accion</th></tr></thead><tbody>${alerts().map((a) => `<tr><td>${pill(a.priority, cls(a.priority))}</td><td><strong>${h(a.title)}</strong><div class="muted">${h(a.summary)}</div></td><td>${h(a.clientName)}</td><td>${h(a.source)}</td><td>${a.date}</td><td><button class="btn" data-client="${a.clientId}">Abrir</button></td></tr>`).join("")}</tbody></table></div></section>`;
  },
  settings() {
    return `${head("Preferencias", "Configuracion basica")}<section class="grid two-col"><form class="card pad" id="settings"><div class="section-title"><h2>Marca y entorno demo</h2></div><div class="field"><label>Nombre de empresa</label><input name="companyName" value="${h(state.settings.companyName)}"></div><div class="field"><label>Logo textual</label><input name="logoText" maxlength="4" value="${h(state.settings.logoText)}"></div><div class="field"><label>Notificaciones</label><select name="browserNotifications"><option value="true" ${state.settings.browserNotifications ? "selected" : ""}>Activas</option><option value="false" ${!state.settings.browserNotifications ? "selected" : ""}>Inactivas</option></select></div><div class="actions"><button class="btn primary">Guardar</button><button class="btn" type="button" data-action="reset">Restaurar demo</button></div></form><div class="card pad"><div class="section-title"><h2>Fuentes preparadas</h2></div><div class="timeline"><div class="timeline-item"><strong>RSS y feeds publicos</strong><p>Capa prevista para titulares de mercado, infraestructura y normativa.</p></div><div class="timeline-item"><strong>Reglas de relevancia</strong><p>Coincidencia por ubicacion, rubro y palabras clave.</p></div></div></div></section>`;
  }
};
function alertCard(a) { return `<article class="alert-item"><div class="alert-head"><strong>${h(a.title)}</strong>${pill(`${a.priority} - ${a.score}`, cls(a.priority))}</div><span class="muted">${h(a.summary)}</span><div class="pill-row">${pill(a.type)}${pill(a.source)}${pill(a.date)}</div></article>`; }
function bind() {
  $$("[data-view]").forEach((b) => b.onclick = () => { view = b.dataset.view; clientId = null; render(); });
  $$("[data-client]").forEach((b) => b.onclick = () => { clientId = b.dataset.client; view = "detail"; render(); });
  $$("[data-action]").forEach((b) => b.onclick = () => action(b.dataset.action, b.dataset.id));
  $("#q")?.addEventListener("input", (e) => { filters.q = e.target.value; render(); });
  $$("[data-filter]").forEach((s) => s.onchange = (e) => { filters[e.target.dataset.filter] = e.target.value; render(); });
  $("#settings")?.addEventListener("submit", (e) => { e.preventDefault(); const f = Object.fromEntries(new FormData(e.target)); state.settings = { ...state.settings, ...f, browserNotifications: f.browserNotifications === "true" }; save(); toast("Configuracion guardada", "Los cambios ya se reflejan."); render(); });
}
function action(a, id) {
  if (a === "logout") { state.session = null; save(); view = "login"; return render(); }
  if (a === "import") return importModal();
  if (a === "new") return clientModal();
  if (a === "simulate") return simulate(id);
  if (a === "reset") { state.clients = demoClients; state.signals = demoSignals; save(); toast("Demo restaurada", "La base volvio a su estado inicial."); render(); }
  if (a === "notify") return notify();
}
function notify() {
  if (!("Notification" in window)) return toast("No disponible", "Este navegador no soporta notificaciones.");
  Notification.requestPermission().then((p) => { state.settings.browserNotifications = p === "granted"; save(); toast("Notificaciones", p === "granted" ? "Permiso concedido." : "Permiso no concedido."); render(); });
}
function simulate(id) {
  const c = state.clients.find((x) => x.id === id) || state.clients[Math.floor(Math.random() * state.clients.length)];
  const s = { id: `SIG-${Date.now()}`, title: `Nueva noticia relevante para ${c.nombre_cliente}`, summary: `Se detecto una novedad demo asociada a ${c.ubicacion}.`, source: "Motor demo Capital Center", date: d(), tags: [c.distrito, c.provincia, ...toks(c.palabras_clave).slice(0, 3)], type: "Oportunidad" };
  state.signals.unshift(s); save(); toast("Alerta detectada", s.title);
  if (state.settings.browserNotifications && window.Notification?.permission === "granted") new Notification("Capital Center Intelligence", { body: s.title });
  render();
}
function clientModal() {
  modal(`<div class="modal-header"><h2>Nuevo cliente</h2><button class="btn" data-close>Cerrar</button></div><form class="modal-body" id="newc"><div class="mapping-grid">${fields.map((f) => `<div class="field"><label>${labels[f]}</label><input name="${f}"></div>`).join("")}</div><div class="modal-footer"><button class="btn" type="button" data-close>Cancelar</button><button class="btn primary">Guardar cliente</button></div></form>`);
  $("#newc").onsubmit = (e) => { e.preventDefault(); const c = Object.fromEntries(new FormData(e.target)); c.id = `CLI-${Date.now()}`; state.clients.unshift(c); save(); closeModal(); toast("Cliente creado", c.nombre_cliente || "Nuevo registro."); view = "clients"; render(); };
}
function importModal() {
  rows = []; headers = []; mapping = {};
  modal(`<div class="modal-header"><div><div class="eyebrow">Importacion</div><h2>Cargar clientes desde Excel o CSV</h2></div><button class="btn" data-close>Cerrar</button></div><div class="modal-body"><div class="field"><label>Archivo .xlsx o .csv</label><input id="file" type="file" accept=".xlsx,.xls,.csv"></div><div id="importbox"><div class="empty">Selecciona un archivo para ver la preview.</div></div></div><div class="modal-footer"><button class="btn" data-close>Cancelar</button><button class="btn primary" id="go" disabled>Importar registros</button></div>`);
  $("#file").onchange = readFile; $("#go").onclick = doImport;
}
function readFile(e) {
  const file = e.target.files[0], r = new FileReader();
  r.onload = (x) => {
    if (file.name.toLowerCase().endsWith(".csv")) parseCsv(String(x.target.result));
    else if (window.XLSX) { const wb = XLSX.read(x.target.result, { type: "array" }); rows = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]], { defval: "" }); headers = Object.keys(rows[0] || {}); }
    else return toast("Excel no disponible", "No cargo la libreria de Excel.");
    fields.forEach((f) => mapping[f] = bestHeader(f));
    renderImport();
  };
  file.name.toLowerCase().endsWith(".csv") ? r.readAsText(file) : r.readAsArrayBuffer(file);
}
function parseCsv(text) {
  const lines = text.split(/\r?\n/).filter((l) => l.trim()).map(csvLine);
  headers = lines[0] || []; rows = lines.slice(1).map((r) => Object.fromEntries(headers.map((x, i) => [x, r[i] || ""])));
}
function csvLine(line) {
  const out = []; let cur = "", q = false;
  for (let i = 0; i < line.length; i++) { const c = line[i]; if (c === '"' && line[i + 1] === '"') { cur += '"'; i++; } else if (c === '"') q = !q; else if (c === "," && !q) { out.push(cur.trim()); cur = ""; } else cur += c; }
  out.push(cur.trim()); return out;
}
function renderImport() {
  $("#go").disabled = !rows.length;
  $("#importbox").innerHTML = `<div class="section-title"><h2>Preview (${rows.length} registros)</h2><span class="muted">Mapea las columnas antes de guardar</span></div><div class="mapping-grid">${fields.map((f) => `<div class="field"><label>${labels[f]}</label><select data-map="${f}"><option value="">Sin mapear</option>${headers.map((x) => `<option ${mapping[f] === x ? "selected" : ""}>${h(x)}</option>`).join("")}</select></div>`).join("")}</div><div class="table-wrap"><table><thead><tr>${headers.map((x) => `<th>${h(x)}</th>`).join("")}</tr></thead><tbody>${rows.slice(0, 6).map((r) => `<tr>${headers.map((x) => `<td>${h(r[x])}</td>`).join("")}</tr>`).join("")}</tbody></table></div>`;
  $$("[data-map]").forEach((s) => s.onchange = (e) => mapping[e.target.dataset.map] = e.target.value);
}
function doImport() {
  const contractHeader = headers.find((x) => ["ncontrato", "contrato", "codigocontrato", "numerocontrato"].includes(key(x)));
  const added = rows.map((r, i) => {
    const contract = contractHeader ? String(r[contractHeader] || "").trim() : "";
    const c = { id: contract || `IMP-${Date.now()}-${i}` };
    fields.forEach((f) => c[f] = mapping[f] ? r[mapping[f]] || "" : "");
    c.nombre_cliente ||= c.empresa || `Cliente importado ${i + 1}`;
    c.empresa ||= c.nombre_cliente;
    if (contract && !String(c.observaciones || "").includes(contract)) c.observaciones = `Contrato: ${contract}${c.observaciones ? " | " + c.observaciones : ""}`;
    return c;
  });
  state.clients = [...added, ...state.clients]; save(); closeModal(); view = "clients"; toast("Importacion completada", `${added.length} clientes agregados.`); render();
}
function modal(html) {
  const m = document.createElement("div"); m.className = "modal-backdrop"; m.id = "modal"; m.innerHTML = `<div class="modal" role="dialog" aria-modal="true">${html}</div>`; document.body.appendChild(m);
  $$("[data-close]", m).forEach((b) => b.onclick = closeModal); m.onclick = (e) => { if (e.target === m) closeModal(); };
}
const closeModal = () => $("#modal")?.remove();
function toast(t, m) {
  const n = document.createElement("div"); n.className = "toast"; n.innerHTML = `<strong>${h(t)}</strong><span>${h(m)}</span>`; $("#toast-region").appendChild(n); setTimeout(() => n.remove(), 4200);
}
render();
