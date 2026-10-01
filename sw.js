const CACHE_NAME = "taiwan-cp-guide-v39";
const CORE = [
  "./",
  "./index.html",
  "./v2/index.html",
  "./v2/style.css",
  "./v2/effects.css",
  "./v2/effects.js",
  "./v2/app.js",
  "./data/roadmap.js",
  "./data/notion_catalog_snapshot.js",
  "./manifest.json"
];

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(CORE))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys
        .filter(key => key !== CACHE_NAME && key !== API_CACHE_NAME)
        .map(key => caches.delete(key))))
      .then(() => self.clients.claim())
  );
});

const LIVE_API_ORIGIN = "https://benjaminshih.vercel.app";
const LIVE_API_PREFIX = "/api/coding-course/";
const API_CACHE_NAME = "coding-course-live-api-v1";

async function cacheLiveResponse(request, response) {
  if (!response || !response.ok) return response;
  const cache = await caches.open(API_CACHE_NAME);
  await cache.put(request, response.clone());
  return response;
}

async function networkFirstWithFastFallback(request, timeoutMs) {
  const cache = await caches.open(API_CACHE_NAME);
  const cached = await cache.match(request);

  const network = fetch(request)
    .then(response => cacheLiveResponse(request, response))
    .catch(error => {
      if (cached) return cached;
      throw error;
    });

  if (!cached) return network;

  const timeout = new Promise(resolve => {
    setTimeout(() => resolve(cached), timeoutMs);
  });

  // Use fresh data when the API is responsive; never make a repeat visit wait
  // several seconds when a previously successful page is already cached.
  return Promise.race([network, timeout]);
}

self.addEventListener("fetch", event => {
  if (!event.request.url.startsWith("http")) return;

  const url = new URL(event.request.url);

  if (url.origin === LIVE_API_ORIGIN && url.pathname.startsWith(LIVE_API_PREFIX)) {
    const isPage = url.pathname.includes("/page/");
    event.respondWith(networkFirstWithFastFallback(event.request, isPage ? 650 : 1200));
    return;
  }

  if (url.origin !== self.location.origin) return;

  if (event.request.mode === "navigate") {
    event.respondWith(
      fetch(event.request)
        .then(response => {
          if (response && response.ok) {
            const copy = response.clone();
            caches.open(CACHE_NAME).then(cache => cache.put(event.request, copy));
          }
          return response;
        })
        .catch(() => caches.match(event.request).then(r => r || caches.match("./v2/index.html")))
    );
    return;
  }

  const isNetworkFirstAsset = /\/(?:v2\/(?:app|notion-renderer)\.(?:js|css)|data\/notion_catalog_snapshot\.js)$/.test(url.pathname);
  event.respondWith(
    isNetworkFirstAsset
      ? fetch(event.request)
          .then(response => {
            if (response && response.ok) {
              const copy = response.clone();
              caches.open(CACHE_NAME).then(cache => cache.put(event.request, copy));
            }
            return response;
          })
          .catch(() => caches.match(event.request))
      : caches.match(event.request).then(cached => {
          const network = fetch(event.request)
            .then(response => {
              if (response && response.ok) {
                const copy = response.clone();
                caches.open(CACHE_NAME).then(cache => cache.put(event.request, copy));
              }
              return response;
            })
            .catch(() => cached);
          return cached || network;
        })
  );
});
