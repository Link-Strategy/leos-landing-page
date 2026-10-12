// Bump CACHE_NAME to purge every client's caches on the next visit.
const CACHE_NAME = "leos-v2";
const OFFLINE_FALLBACK = "/";

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.add(OFFLINE_FALLBACK)).catch(() => {}));
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))))
      .then(() => self.clients.claim()),
  );
});

function isStaticAsset(url) {
  return (
    url.pathname.startsWith("/_next/static/") ||
    url.pathname.startsWith("/wp-content/") ||
    url.pathname.startsWith("/wp-includes/") ||
    url.pathname.startsWith("/icons/") ||
    url.pathname.startsWith("/assets/") ||
    /\.(?:png|jpe?g|gif|webp|avif|svg|ico|woff2?|ttf)$/i.test(url.pathname)
  );
}

async function putInCache(request, response) {
  if (response && response.status === 200 && response.type === "basic") {
    const cache = await caches.open(CACHE_NAME);
    await cache.put(request, response.clone());
  }
  return response;
}

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;
  // Never cache dynamic data.
  if (url.pathname.startsWith("/api/") || url.pathname.startsWith("/_next/data/") || url.searchParams.has("_rsc")) {
    return;
  }

  // Pages: network-first so every deploy/content change shows immediately; cache only as offline fallback.
  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request)
        .then((response) => putInCache(request, response))
        .catch(async () => (await caches.match(request)) || caches.match(OFFLINE_FALLBACK)),
    );
    return;
  }

  // Static assets (fingerprinted or rarely changing): cache-first.
  if (isStaticAsset(url)) {
    event.respondWith(
      caches.match(request).then((cached) => cached || fetch(request).then((response) => putInCache(request, response))),
    );
  }
});
