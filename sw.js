const CACHE_NAME = "taiwan-cp-guide-v1";
const ASSETS_TO_CACHE = [
  "./",
  "./index.html",
  "./style.css",
  "./app.js",
  "./data/roadmap.js",
  "./data/templates.js",
  "./data/coach_db.js",
  "./data/contest_db.js",
  "./tutorials/ad-hoc.md",
  "./tutorials/all-roots.md",
  "./tutorials/basic-dp.md",
  "./tutorials/binary-lifting.md",
  "./tutorials/binary-search-sorted-array.md",
  "./tutorials/binary-search.md",
  "./tutorials/bitsets.md",
  "./tutorials/centroid.md",
  "./tutorials/combinatorics.md",
  "./tutorials/complete-rec.md",
  "./tutorials/convex-hull-trick.md",
  "./tutorials/convex-hull.md",
  "./tutorials/dc-dp.md",
  "./tutorials/digit-dp.md",
  "./tutorials/dp-bitmasks.md",
  "./tutorials/dp-ranges.md",
  "./tutorials/dp-trees.md",
  "./tutorials/dsu.md",
  "./tutorials/enumeration-bruteforce.md",
  "./tutorials/fenwick-tree.md",
  "./tutorials/fft-ntt.md",
  "./tutorials/flood-fill.md",
  "./tutorials/func-graphs.md",
  "./tutorials/game-theory.md",
  "./tutorials/geometry-advanced.md",
  "./tutorials/graph-traversal.md",
  "./tutorials/hashing.md",
  "./tutorials/hashmaps.md",
  "./tutorials/hld.md",
  "./tutorials/intro-bitwise.md",
  "./tutorials/intro-ds.md",
  "./tutorials/intro-graphs.md",
  "./tutorials/intro-greedy.md",
  "./tutorials/intro-sets-maps.md",
  "./tutorials/intro-sorted-sets.md",
  "./tutorials/intro-sorting.md",
  "./tutorials/intro-tree.md",
  "./tutorials/knapsack.md",
  "./tutorials/linear-algebra.md",
  "./tutorials/link-cut-tree.md",
  "./tutorials/lis.md",
  "./tutorials/matrix-expo.md",
  "./tutorials/max-flow.md",
  "./tutorials/meet-in-the-middle.md",
  "./tutorials/merging.md",
  "./tutorials/min-cost-flow.md",
  "./tutorials/min-cut.md",
  "./tutorials/monotonic-structures.md",
  "./tutorials/more-prefix-sums.md",
  "./tutorials/mst.md",
  "./tutorials/number-theory.md",
  "./tutorials/offline-algorithms.md",
  "./tutorials/paths-grids.md",
  "./tutorials/persistent-ds.md",
  "./tutorials/prefix-sums.md",
  "./tutorials/priority-queues.md",
  "./tutorials/rect-geo.md",
  "./tutorials/scc-advanced.md",
  "./tutorials/segment-tree.md",
  "./tutorials/segtree-ext.md",
  "./tutorials/shortest-path-basic.md",
  "./tutorials/simulation.md",
  "./tutorials/sliding-window-gold.md",
  "./tutorials/slope-trick.md",
  "./tutorials/sorting-custom.md",
  "./tutorials/sqrt.md",
  "./tutorials/string-suffix.md",
  "./tutorials/strongly-connected-components.md",
  "./tutorials/sweep-line.md",
  "./tutorials/ternary-search.md",
  "./tutorials/time-complexity.md",
  "./tutorials/toposort.md",
  "./tutorials/tree-euler.md",
  "./tutorials/two-pointers.md",
  "./manifest.json",
  "./icons/icon-192.png",
  "./icons/icon-512.png"
];

// Install Service Worker and cache core static assets
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("[Service Worker] Pre-caching core assets...");
      return cache.addAll(ASSETS_TO_CACHE).catch(err => {
        console.warn("[Service Worker] Pre-cache failed for some assets, continuing anyway:", err);
      });
    }).then(() => self.skipWaiting())
  );
});

// Activate Service Worker and clean up old caches
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log("[Service Worker] Removing old cache:", cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch Interceptor: Stale-While-Revalidate Strategy
self.addEventListener("fetch", (event) => {
  // Only intercept HTTP/HTTPS schemes
  if (!event.request.url.startsWith("http")) {
    return;
  }
  
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        // Fetch new version in background to update cache
        fetch(event.request).then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, networkResponse);
            });
          }
        }).catch(() => {/* Ignore network errors */});
        
        return cachedResponse;
      }
      
      // If not in cache, fetch from network and cache it dynamically
      return fetch(event.request).then((networkResponse) => {
        if (!networkResponse || networkResponse.status !== 200) {
          return networkResponse;
        }
        
        const responseToCache = networkResponse.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, responseToCache);
        });
        
        return networkResponse;
      }).catch(() => {
        // Fallback for offline mode if resources are missing
        console.log("[Service Worker] Resource offline fetch failed.");
      });
    })
  );
});
