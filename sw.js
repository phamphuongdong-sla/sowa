const CACHE_NAME = 'cnsl-pwa-v2';
const urlsToCache = [
  '/',
  '/index.html',
  '/dashboard.html',
  '/Nhiem_vu.html',
  '/Quy_trinh_citywork.html',
  '/Quy_trinh_kiem_dinh.html',
  '/Quy_trinh_su_co.html',
  '/Thu_tuc_xuat_kho.html',
  '/lich_chot_chi_so.html',
  '/shared.css',
  '/favicon.png'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        return cache.addAll(urlsToCache);
      })
  );
  self.skipWaiting();
});

self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);
  const isUiAsset = event.request.mode === 'navigate' ||
    url.pathname.endsWith('.html') || url.pathname.endsWith('.css');

  if (isUiAsset) {
    event.respondWith(
      fetch(event.request)
        .then(response => {
          const copy = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, copy));
          return response;
        })
        .catch(() => caches.match(event.request))
    );
    return;
  }

  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          return response;
        }
        return fetch(event.request);
      })
  );
});

self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});
