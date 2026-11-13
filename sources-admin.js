/* Shared source configuration is written only through GitHub's authenticated API. */
(() => {
  "use strict";
  const REPOSITORY = "rcardenasr/capital-center-insights";
  const OWNER_ID = 56749658;
  const FILE_PATH = `/repos/${REPOSITORY}/contents/alertas_clientes_config.json`;

  function sourceUrl(value) {
    const raw = String(value || "").trim();
    let url;
    try { url = new URL(raw); } catch { throw new Error("Escribe un enlace completo que empiece con https:// o http://."); }
    if (!/^https?:$/.test(url.protocol) || url.username || url.password || raw.length > 2048) {
      throw new Error("Usa un enlace HTTP o HTTPS público, sin credenciales.");
    }
    const host = url.hostname.toLowerCase();
    if (host === "localhost" || !host.includes(".") || /\.(local|localhost|internal)$/.test(host) ||
        /^(127\.|10\.|192\.168\.|169\.254\.|0\.|172\.(1[6-9]|2\d|3[01])\.)/.test(host)) {
      throw new Error("La fuente debe ser una página pública de noticias.");
    }
    url.hash = "";
    return url.href;
  }

  function urlKey(value) {
    try {
      const url = new URL(sourceUrl(value));
      url.protocol = "https:";
      url.searchParams.sort();
      return url.href.replace(/\/$/, "");
    } catch { return ""; }
  }

  function applySourceChange(config, change) {
    if (!config || !Array.isArray(config.sources)) throw new Error("La configuración de fuentes no es válida.");
    const next = JSON.parse(JSON.stringify(config));
    if (change.type === "add") {
      const name = String(change.name || "").trim();
      if (!name || name.length > 100) throw new Error("Escribe un nombre de entre 1 y 100 caracteres.");
      const url = sourceUrl(change.url);
      if (!["rss_directo", "html_polling"].includes(change.method)) throw new Error("Selecciona el tipo de fuente.");
      if (next.sources.some((s) => [s.feedUrl, s.pageUrl].some((u) => u && urlKey(u) === urlKey(url)))) {
        throw new Error("Ese enlace ya está registrado. Revisa las fuentes de la lista.");
      }
      next.sources.push({
        id: `web_${crypto.randomUUID()}`, name, category: "noticias_personalizadas",
        method: change.method, feedUrl: change.method === "rss_directo" ? url : null,
        pageUrl: change.method === "html_polling" ? url : null,
        pollMinutes: 360, priority: "media", backendEnabled: true, userManaged: true
      });
    } else if (change.type === "toggle") {
      const source = next.sources.find((s) => s.id === change.id && s.userManaged === true);
      if (!source) throw new Error("La fuente ya no está disponible. Recarga la lista.");
      source.backendEnabled = change.enabled === true;
    } else {
      throw new Error("Acción de fuentes no reconocida.");
    }
    next.updatedAt = new Date().toISOString();
    return next;
  }

  function encodeConfig(config) {
    return btoa(Array.from(new TextEncoder().encode(JSON.stringify(config, null, 2) + "\n"), (b) => String.fromCharCode(b)).join(""));
  }

  function decodeConfig(content) {
    return JSON.parse(new TextDecoder().decode(Uint8Array.from(atob(content.replace(/\s/g, "")), (c) => c.charCodeAt(0))));
  }

  function createSourceRepository(fetcher = fetch) {
    let token = "", generation = 0, writing = false;
    async function request(path, credential, options = {}) {
      let response;
      try {
        response = await fetcher(`https://api.github.com${path}`, {
          ...options, cache: "no-store", credentials: "omit", redirect: "error",
          referrerPolicy: "no-referrer", signal: AbortSignal.timeout(20000),
          headers: { Accept: "application/vnd.github+json", "X-GitHub-Api-Version": "2022-11-28",
            Authorization: `Bearer ${credential}`, ...(options.body ? { "Content-Type": "application/json" } : {}) }
        });
      } catch {
        throw new Error(options.method === "PUT"
          ? "No se pudo confirmar el guardado. Recarga las fuentes antes de intentarlo otra vez."
          : "No se pudo conectar con GitHub. Revisa tu conexión e inténtalo otra vez.");
      }
      if (!response.ok) {
        if (response.status === 401) { token = ""; throw new Error("El token no es válido o ha vencido. Vuelve a conectar tu cuenta."); }
        if (response.status === 403 || response.status === 404) throw new Error("Revisa que el token permita Contents: Read and write en capital-center-insights. GitHub también puede limitar las solicitudes temporalmente.");
        if (response.status === 409 || response.status === 422) throw new Error("GitHub no aceptó el cambio. Recarga las fuentes y revisa los permisos o las reglas de la rama antes de reintentar.");
        throw new Error(`GitHub no pudo completar la operación (HTTP ${response.status}).`);
      }
      return response.json();
    }
    async function read(credential) {
      const file = await request(`${FILE_PATH}?ref=main`, credential);
      if (file.encoding !== "base64" || !file.sha || !file.content) throw new Error("No se pudo leer la configuración de fuentes.");
      const config = decodeConfig(file.content);
      if (!Array.isArray(config.sources)) throw new Error("La configuración de fuentes no es válida.");
      return { config, sha: file.sha };
    }
    return {
      connected: () => Boolean(token),
      disconnect() { token = ""; generation++; },
      async connect(value) {
        token = "";
        const attempt = ++generation;
        const credential = String(value || "").trim();
        if (!credential || /\s/.test(credential) || credential.length > 300) throw new Error("Introduce tu token de acceso de GitHub.");
        const user = await request("/user", credential);
        if (user.id !== OWNER_ID || user.login?.toLowerCase() !== "rcardenasr") throw new Error("Solo la cuenta rcardenasr puede administrar las fuentes de esta página.");
        const result = await read(credential);
        if (attempt !== generation) throw new Error("La conexión de administración se cerró.");
        token = credential;
        return result.config;
      },
      async reload() {
        if (!token) throw new Error("Conecta tu cuenta de administradora primero.");
        return (await read(token)).config;
      },
      async change(change) {
        if (!token) throw new Error("Conecta tu cuenta de administradora primero.");
        if (writing) throw new Error("Espera a que termine el guardado actual.");
        writing = true;
        const credential = token, attempt = generation;
        try {
          const latest = await read(credential);
          const config = applySourceChange(latest.config, change);
          if (attempt !== generation) throw new Error("La conexión de administración se cerró.");
          await request(FILE_PATH, credential, { method: "PUT", body: JSON.stringify({
            message: change.type === "add" ? "Add news source from website" : "Update news source status from website",
            branch: "main", sha: latest.sha, content: encodeConfig(config)
          }) });
          return config;
        } finally { writing = false; }
      }
    };
  }

  if (typeof module !== "undefined" && module.exports) {
    module.exports = { sourceUrl, urlKey, applySourceChange, encodeConfig, decodeConfig, createSourceRepository };
    return;
  }

  const repository = createSourceRepository();
  let busy = false, message = "", error = false;
  let draft = { name: "", url: "", method: "html_polling" };
  const tokenLink = "https://github.com/settings/personal-access-tokens/new?name=Capital+Center+Fuentes&target_name=rcardenasr&expires_in=30&contents=write";
  const disabled = () => busy ? "disabled" : "";

  function sourceList(sources) {
    return sources.map((s) => {
      let url = "";
      try { url = sourceUrl(s.feedUrl || s.pageUrl); } catch { /* Dynamic sources have no fixed URL. */ }
      return `<li class="source-item"><div class="source-info"><strong>${h(s.name)}</strong>
        <div class="pill-row">${pill(s.backendEnabled ? "Activa" : "Pausada", s.backendEnabled ? "medium" : "low")}${pill(s.feedUrl ? "RSS / Atom" : s.pageUrl ? "Página web" : "Fuente integrada")}</div>
        ${url ? `<a class="source-url" href="${h(url)}" target="_blank" rel="noopener noreferrer">${h(url)}</a>` : ""}</div>
        ${repository.connected() && s.userManaged === true ? `<button class="btn" type="button" data-source-toggle="${h(s.id)}" data-enabled="${!s.backendEnabled}" aria-label="${s.backendEnabled ? "Pausar" : "Activar"} ${h(s.name)}" ${disabled()}>${s.backendEnabled ? "Pausar" : "Activar"}</button>` : ""}</li>`;
    }).join("");
  }

  routes.sources = function () {
    if (!state.session) return "";
    const sources = intel.config?.sources || [];
    const custom = sources.filter((s) => s.userManaged === true);
    return `${head("Administración", "Fuentes de noticias", `<button class="btn" type="button" data-source-reload ${disabled()}>Recargar fuentes</button>`)}
      <p class="sources-intro">Agrega medios y páginas públicas para ampliar el monitoreo de Capital Center. Las fuentes se comparten en toda la plataforma.</p>
      <div class="source-feedback ${error ? "source-error" : ""}" role="status" aria-live="polite">${h(message)}</div>
      ${repository.connected() ? `<section class="card pad source-access"><div><strong>Administración conectada · rcardenasr</strong><p class="muted">Puedes agregar y pausar fuentes para toda la página.</p></div><button type="button" class="btn" data-source-disconnect ${disabled()}>Desconectar</button></section>
      <section class="card pad source-form-card"><div class="section-title"><h2>Agregar una fuente</h2></div>
        <form id="source-add"><fieldset ${disabled()}><div class="source-form-grid">
          <div class="field"><label for="source-name">Nombre de la fuente</label><input id="source-name" name="name" required maxlength="100" placeholder="Ej. Noticias de economía" value="${h(draft.name)}"></div>
          <div class="field"><label for="source-method">Tipo de enlace</label><select id="source-method" name="method"><option value="html_polling" ${draft.method === "html_polling" ? "selected" : ""}>Página web de noticias</option><option value="rss_directo" ${draft.method === "rss_directo" ? "selected" : ""}>Canal RSS / Atom</option></select></div>
          <div class="field source-url-field"><label for="source-url">Enlace público</label><input id="source-url" name="url" type="url" required maxlength="2048" placeholder="https://medio.com/noticias" value="${h(draft.url)}" aria-describedby="source-help"></div>
        </div><p id="source-help" class="muted">Los canales RSS se consultan al actualizar las noticias. Las páginas web se revisan en el proceso automático, aproximadamente cada 6 horas; algunos medios pueden impedir su lectura. Solo las noticias relevantes para tus clientes generan alertas.</p>
        <button class="btn primary" type="submit">${busy ? "Guardando…" : "Agregar fuente"}</button></fieldset></form>
      </section>` : `<section class="card pad source-connect"><div><p class="eyebrow">SOLO ADMINISTRADORA</p><h2>Conecta tu cuenta de GitHub</h2><p>Solo la cuenta <strong>rcardenasr</strong> puede guardar cambios. El acceso piloto no otorga permisos de administración.</p>
        <details><summary>Cómo obtener tu token de acceso</summary><ol><li>Abre <a href="${tokenLink}" target="_blank" rel="noopener noreferrer">Crear token en GitHub</a> con tu cuenta rcardenasr.</li><li>En <strong>Repository access</strong>, elige <strong>Only select repositories</strong> y selecciona <strong>capital-center-insights</strong>.</li><li>Comprueba el permiso <strong>Contents: Read and write</strong>, elige una caducidad corta y genera el token.</li><li>Pégalo aquí. Solo se enviará a GitHub y se olvidará al recargar o cerrar la sesión. No lo compartas.</li></ol></details></div>
        <form id="source-connect"><div class="field"><label for="source-token">Token de GitHub</label><input id="source-token" type="password" required maxlength="300" autocomplete="off" spellcheck="false" placeholder="github_pat_…" ${disabled()}></div><button type="submit" class="btn primary" ${disabled()}>${busy ? "Conectando…" : "Conectar administradora"}</button></form></section>`}
      <section class="card pad source-form-card"><div class="section-title"><h2>Fuentes agregadas</h2>${pill(custom.length)}</div><ul class="source-list">${sourceList(custom)}</ul>${custom.length ? "" : `<p class="empty">Todavía no se han agregado fuentes desde la web.</p>`}</section>
      <details class="card pad source-form-card"><summary>Fuentes incluidas en la plataforma (${sources.length - custom.length})</summary><ul class="source-list">${sourceList(sources.filter((s) => !s.userManaged))}</ul></details>`;
  };

  async function perform(operation, success) {
    if (busy || !state.session) return;
    busy = true; error = false; message = ""; render();
    try {
      const config = await operation();
      if (config) intel.config = config;
      message = success; error = false;
    } catch (err) { message = err.message; error = true; }
    finally { busy = false; if (state.session) render(); }
  }

  const previousRender = render;
  render = function () {
    previousRender();
    if (!state.session) { repository.disconnect(); return; }
    const navigation = $(".nav");
    if (navigation) {
      const button = document.createElement("button");
      button.textContent = "Fuentes de noticias";
      button.className = view === "sources" ? "active" : "";
      button.onclick = () => { view = "sources"; clientId = null; render(); };
      navigation.insertBefore(button, navigation.querySelector('[data-view="settings"]'));
    }
    $("#source-connect")?.addEventListener("submit", (event) => {
      event.preventDefault();
      const input = $("#source-token");
      const credential = input.value;
      input.value = "";
      perform(() => repository.connect(credential), "Cuenta verificada. Ya puedes agregar fuentes.");
    });
    $("#source-add")?.addEventListener("input", (event) => {
      if (event.target.name) draft[event.target.name] = event.target.value;
    });
    $("#source-add")?.addEventListener("submit", (event) => {
      event.preventDefault();
      const change = { type: "add", ...Object.fromEntries(new FormData(event.target)) };
      perform(async () => {
        // Validate before a network write; repeat against the latest remote file to avoid duplicates.
        applySourceChange(intel.config, change);
        const config = await repository.change(change);
        draft = { name: "", url: "", method: "html_polling" };
        return config;
      }, "Fuente guardada para toda la página. La publicación puede tardar unos minutos; las noticias llegarán en la próxima actualización.");
    });
    $$('[data-source-toggle]').forEach((button) => button.onclick = () => perform(
      () => repository.change({ type: "toggle", id: button.dataset.sourceToggle, enabled: button.dataset.enabled === "true" }),
      "Estado guardado. Se aplicará en las próximas consultas; las noticias anteriores se conservan."
    ));
    $('[data-source-disconnect]')?.addEventListener("click", () => {
      repository.disconnect(); message = "Administración desconectada."; error = false; render();
    });
    $('[data-source-reload]')?.addEventListener("click", () => perform(async () => {
      if (repository.connected()) return repository.reload();
      const response = await fetch("./alertas_clientes_config.json", { cache: "no-store" });
      if (!response.ok) throw new Error("No se pudieron cargar las fuentes publicadas.");
      return response.json();
    }, "Lista de fuentes actualizada."));
  };
  const previousAction = action;
  action = function (name, id) {
    if (name === "logout") { repository.disconnect(); message = ""; draft = { name: "", url: "", method: "html_polling" }; }
    return previousAction(name, id);
  };
  window.addEventListener("pagehide", () => repository.disconnect());
  loadIntelConfig().then(() => { if (view === "sources") render(); }).catch(() => {
    message = "No se pudieron cargar las fuentes. Usa Recargar fuentes para reintentar."; error = true;
    if (view === "sources") render();
  });
  render();
})();
