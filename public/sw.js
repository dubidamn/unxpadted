const CACHE_NAME = 'unxpadted-cache-v4';
const ASSETS = [
  '/',
  '/index.html',
  '/display.html',
  '/gm.html',
  '/team.html',
  '/team-skinned.html',
  '/team-skinned-matrix.html',
  '/css/style.css',
  '/css/team-skinned.css',
  '/css/team-skinned-matrix.css',
  '/js/team.js',
  '/js/team-skinned.js',
  '/js/team-skinned-matrix.js',
  '/js/display.js',
  '/js/gm.js',
  '/js/audio.js',
  '/manifest.json',
  '/favicon.ico',
  '/assets/brand/unxpadted-logotype.png',
  '/assets/brand/Infinix_logo.svg.webp'
];

self.addEventListener('install', (evt) => {
  evt.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (evt) => {
  evt.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (evt) => {
  if (evt.request.url.includes('/socket.io/') || evt.request.method !== 'GET') {
    return;
  }
  evt.respondWith(
    caches.match(evt.request).then((cachedRes) => {
      return cachedRes || fetch(evt.request).then((networkRes) => {
        return caches.open(CACHE_NAME).then((cache) => {
          cache.put(evt.request, networkRes.clone());
          return networkRes;
        });
      });
    }).catch(() => caches.match('/index.html'))
  );
});
