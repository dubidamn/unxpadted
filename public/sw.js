const CACHE_NAME = 'unxpadted-pwa-v5';
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './broadcast.html',
  './player.html',
  './gm.html',
  './css/design-system.css',
  './css/components.css',
  './css/broadcast.css',
  './css/player.css',
  './css/gm.css',
  './js/audio.js',
  './js/broadcast.js',
  './js/player.js',
  './js/gm.js',
  './manifest.json',
  './favicon.ico',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/icon-192-maskable.png',
  './icons/icon-512-maskable.png',
  './assets/Global Assets/Logotype_Overlay@2x.png',
  './assets/Global Assets/Main Screen.jpeg'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(async (cache) => {
      // Use individually resolved promises so failure of one optional asset doesn't break worker
      await Promise.allSettled(
        ASSETS_TO_CACHE.map((url) =>
          cache.add(url).catch((err) => {
            console.warn(`[SW] Warning: Optional asset cache failed: ${url}`, err);
          })
        )
      );
    }).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  
  // Skip non-GET and websocket/socket.io polling requests
  if (req.method !== 'GET' || req.url.includes('/socket.io/')) {
    return;
  }

  event.respondWith(
    caches.match(req).then((cachedResponse) => {
      const fetchPromise = fetch(req)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200 && networkResponse.type === 'basic') {
            const responseToCache = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(req, responseToCache);
            });
          }
          return networkResponse;
        })
        .catch(() => {
          // If offline and request is navigation, serve index or broadcast
          if (req.mode === 'navigate') {
            return caches.match('./broadcast.html') || caches.match('./index.html') || caches.match('/');
          }
        });

      return cachedResponse || fetchPromise;
    })
  );
});
