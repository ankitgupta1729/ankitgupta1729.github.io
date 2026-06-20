// Polymath service worker — installable PWA + offline reading.
// Bump CACHE when you want to force-refresh caches.
const CACHE = "polymath-v2";
const CORE = ["/", "/offline.html", "/manifest.webmanifest", "/favicon.svg", "/icon-192.png"];

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(CACHE).then((c) => c.addAll(CORE)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))).then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);

  // Only handle same-origin requests (let CDN/Supabase/HF pass through to network).
  if (url.origin !== self.location.origin) return;

  // Navigations (pages): network-first, fall back to cache, then offline page.
  if (req.mode === "navigate") {
    event.respondWith(
      fetch(req)
        .then((res) => {
          const copy = res.clone();
          caches.open(CACHE).then((c) => c.put(req, copy));
          return res;
        })
        .catch(() => caches.match(req).then((r) => r || caches.match("/offline.html")))
    );
    return;
  }

  // Immutable, content-hashed assets (and fonts/images): cache-first.
  const immutable = url.pathname.startsWith("/_astro/") || url.pathname.startsWith("/pagefind/") || /\.(woff2?|png|jpg|jpeg|webp|gif|ico)$/.test(url.pathname);
  if (immutable) {
    event.respondWith(
      caches.match(req).then((cached) => cached || fetch(req).then((res) => {
        if (res.ok) { const copy = res.clone(); caches.open(CACHE).then((c) => c.put(req, copy)); }
        return res;
      }).catch(() => cached))
    );
    return;
  }

  // Everything else same-origin (non-hashed JS/CSS/JSON like /poly-qa.js):
  // network-first so updates show immediately; fall back to cache offline.
  event.respondWith(
    fetch(req).then((res) => {
      if (res.ok) { const copy = res.clone(); caches.open(CACHE).then((c) => c.put(req, copy)); }
      return res;
    }).catch(() => caches.match(req))
  );
});
