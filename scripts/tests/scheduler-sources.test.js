const assert = require("node:assert/strict");
const { test } = require("node:test");
const { parseRss, parseHtmlLinks, absoluteUrl, fetchText, fetchSource, configuredSources } = require("../run_intelligence.js");

const source = { id: "admin_test", name: "Noticias de prueba", method: "rss_directo", feedUrl: "https://example.com/news/feed.xml", backendEnabled: true, userManaged: true };
const rss = (items) => `<?xml version="1.0"?><rss version="2.0"><channel>${items}</channel></rss>`;

test("RSS keeps titles, safe article links, source identity and valid dates", () => {
  const [article] = parseRss(rss(`<item><title><![CDATA[Expansión &amp; nuevas oficinas]]></title><description><![CDATA[<p>Noticia del día</p>]]></description><link>/economia/obra?a=1&amp;b=2</link><pubDate>Wed, 12 Nov 2025 12:00:00 GMT</pubDate></item>`), source);
  assert.equal(article.title, "Expansión & nuevas oficinas");
  assert.equal(article.summary, "Noticia del día");
  assert.equal(article.url, "https://example.com/economia/obra?a=1&b=2");
  assert.equal(article.sourceId, source.id);
  assert.equal(article.publishedAt, "2025-11-12T12:00:00.000Z");
});

test("Atom selects alternate article links instead of self or enclosure", () => {
  const [article] = parseRss(`<feed xmlns="http://www.w3.org/2005/Atom"><entry><title>Nuevo proyecto de inversión</title><summary>Expansión de la empresa</summary><link rel="self" href="/entry.xml"/><link rel="enclosure" href="/audio.mp3"/><link rel="alternate" href="../proyecto"/><updated>2026-11-13T00:00:00Z</updated></entry></feed>`, source);
  assert.equal(article.url, "https://example.com/proyecto");
  assert.equal(article.summary, "Expansión de la empresa");
  assert.equal(article.publishedAt, "2026-11-13T00:00:00.000Z");
});

test("prefixed Atom fields and RSS 1 RDF feeds are accepted", () => {
  const atom = parseRss(`<atom:feed xmlns:atom="http://www.w3.org/2005/Atom"><atom:entry><atom:title>Proyecto industrial</atom:title><atom:link href="/proyecto"/></atom:entry></atom:feed>`, source);
  assert.equal(atom[0].title, "Proyecto industrial");
  const rdf = parseRss(`<rdf:RDF xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"><item><title>Proyecto comercial</title><link>/comercio</link></item></rdf:RDF>`, source);
  assert.equal(rdf[0].url, "https://example.com/comercio");
});

test("HTML and incomplete feed envelopes fail rather than returning false success", () => {
  assert.throws(() => parseRss("<html><body>Este sitio no tiene RSS</body></html>", source), /RSS o Atom/);
  assert.throws(() => parseRss("<rss><channel>", source), /RSS o Atom/);
  assert.deepEqual(parseRss(rss(""), source), []);
});

test("unsafe article URLs are dropped, invalid dates do not discard safe articles", () => {
  const articles = parseRss(rss(`<item><title>Ejecutable</title><link>javascript:alert(1)</link></item><item><title>Credenciales</title><link>https://usuario:clave@example.com/private</link></item><item><title>Contenido inline</title><link>data:text/html,hello</link></item><item><title>Fecha inválida</title><link>articulo</link><pubDate>nunca</pubDate></item>`), source);
  assert.equal(articles.length, 1);
  assert.equal(articles[0].url, "https://example.com/news/articulo");
  assert.ok(Number.isFinite(Date.parse(articles[0].publishedAt)));
  assert.equal(absoluteUrl("", source.feedUrl), "");
  assert.equal(absoluteUrl("https://user@example.com/"), "");
});

test("HTML sources resolve and deduplicate safe links", () => {
  const items = parseHtmlLinks(`<a href="/noticia">Una nueva noticia empresarial</a><a href="https://example.com/noticia?utm_source=test">Una nueva noticia empresarial</a><a href="javascript:alert(1)">Un enlace que no debe abrirse</a><a href="https://user:pass@example.com/private">Un enlace con acceso privado</a>`, { ...source, pageUrl: "https://example.com/" });
  assert.equal(items.length, 1);
  assert.equal(items[0].url, "https://example.com/noticia");
});

test("configured sources include administrator feeds and websites only while enabled", () => {
  const site = { ...source, id: "admin_site", feedUrl: null, pageUrl: "https://example.com/", method: "html_polling" };
  const entries = configuredSources({ sources: [source, site, { ...source, id: "paused", backendEnabled: false }, { ...source, id: "email", method: "manual_email" }] });
  assert.deepEqual(entries.map((item) => item.id), ["admin_test", "admin_site"]);
});

test("fetch errors are reported as failed source runs", async (t) => {
  t.mock.method(globalThis, "fetch", async () => new Response("<html><body>Acceso bloqueado</body></html>"));
  const result = await fetchSource(source);
  assert.equal(result.run.status, "error");
  assert.match(result.run.error, /RSS o Atom/);
  assert.deepEqual(result.items, []);
  assert.ok(result.run.finishedAt);
});

test("timeout aborts a stalled response body, not just the initial request", async (t) => {
  t.mock.method(globalThis, "fetch", async (_url, options) => ({
    ok: true,
    headers: new Headers(),
    arrayBuffer: () => new Promise((resolve, reject) => options.signal.addEventListener("abort", () => reject(new Error("aborted")), { once: true }))
  }));
  await assert.rejects(fetchText(source.feedUrl, { timeoutMs: 10 }), /tardó demasiado/);
});

test("non-HTTP source URLs are rejected before any network request", async (t) => {
  const stub = t.mock.method(globalThis, "fetch", async () => { throw new Error("Unexpected request"); });
  await assert.rejects(fetchText("file:///etc/passwd"), /HTTP o HTTPS/);
  assert.equal(stub.mock.callCount(), 0);
});
