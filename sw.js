// Service worker de EventosBsAs.
// Estrategia deliberadamente conservadora: network-first para todo lo propio,
// con el cache solo como respaldo cuando no hay conexion. Asi la app se puede
// abrir offline pero nunca queda "congelada" mostrando datos viejos si hay red.
const CACHE = 'eventosbsas-v1';

// Rutas relativas al scope del service worker (funciona igual en localhost que
// en el subdirectorio /eventosbsas/ de GitHub Pages).
const PRECACHE = [
  './',
  './index.html',
  './data/lugares.json',
  './manifest.webmanifest',
  './assets/icon-192.png',
  './assets/icon-512.png',
  './assets/icon-maskable-512.png'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE)
      // addAll falla entero si un solo recurso falla: se cachea uno por uno
      // para que un 404 puntual no rompa la instalacion.
      .then(cache => Promise.all(PRECACHE.map(url => cache.add(url).catch(() => {}))))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  const req = event.request;
  // Solo se interceptan GET del propio origen. Los tiles del mapa y el CDN de
  // Leaflet se dejan pasar sin tocar, para no lidiar con respuestas opacas.
  if (req.method !== 'GET') return;
  if (new URL(req.url).origin !== self.location.origin) return;

  event.respondWith(
    fetch(req)
      .then(res => {
        if (res && res.ok) {
          const copy = res.clone();
          caches.open(CACHE).then(cache => cache.put(req, copy)).catch(() => {});
        }
        return res;
      })
      .catch(() => caches.match(req).then(hit => hit || caches.match('./index.html')))
  );
});
