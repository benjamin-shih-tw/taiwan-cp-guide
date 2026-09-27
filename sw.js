const CACHE_NAME = "taiwan-cp-guide-v30";
const CORE = [
  "./",
  "./index.html",
  "./v2/index.html",
  "./v2/style.css",
  "./v2/effects.css",
  "./v2/effects.js",
  "./v2/notion-renderer.js",
  "./v2/notion-renderer.css",
  "./v2/app.js",
  "./data/roadmap.js",
  "./data/templates.js",
  "./data/notion_courses_part1.js",
  "./data/notion_courses_part2.js",
  "./data/notion_courses_part3.js",
  "./data/notion_courses_part4.js",
  "./data/notion_courses_part5.js",
  "./data/notion_domain_relations.js",
  "./data/notion_ladders.js",
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
      .then(keys => Promise.all(keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", event => {
  if (!event.request.url.startsWith("http")) return;

  const url = new URL(event.request.url);
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

  event.respondWith(
    caches.match(event.request).then(cached => {
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
