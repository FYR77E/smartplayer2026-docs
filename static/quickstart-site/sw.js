/* SmartPlayer Quickstart Service Worker (scoped to /quickstart-site/). */

const CACHE_NAME = 'sp-quickstart-site-v3';
const CORE = [
  './',
  './index.html',
  './manual-common.css',
  './manual-common.js',
  './favicon.svg',
  './favicon.ico',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => cache.addAll(CORE))
      .then(() => self.skipWaiting())
      .catch(() => {})
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(keys.map((k) => (k === CACHE_NAME ? Promise.resolve() : caches.delete(k))))
      )
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  // Only handle requests within quickstart-site (avoid affecting Docusaurus).
  const inScope =
    url.origin === self.location.origin &&
    (url.pathname.startsWith('/quickstart-site/') || url.pathname.startsWith('/image/'));
  if (!inScope) return;

  const isHtmlRequest =
    req.mode === 'navigate' || req.destination === 'document' || url.pathname.endsWith('/index.html');

  if (isHtmlRequest) {
    event.respondWith(
      fetch(req)
        .then((res) => {
          const copy = res.clone();
          caches.open(CACHE_NAME).then((c) => c.put(req, copy)).catch(() => {});
          return res;
        })
        .catch(() => caches.match(req).then((cached) => cached || caches.match('./index.html')))
    );
    return;
  }

  event.respondWith(
    caches.match(req).then((cached) => {
      if (cached) return cached;
      return fetch(req)
        .then((res) => {
          const copy = res.clone();
          caches.open(CACHE_NAME).then((c) => c.put(req, copy)).catch(() => {});
          return res;
        })
        .catch(() => cached)
    })
  );
});
