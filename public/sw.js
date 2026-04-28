// Service Worker básico para permitir actualizaciones rápidas
const CACHE_NAME = 'chispas-v1';

self.addEventListener('install', (event) => {
  // Fuerza al Service Worker a activarse de inmediato
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  // Limpia cachés antiguos y toma el control de las pestañas abiertas
  event.waitUntil(clients.claim());
});

self.addEventListener('fetch', (event) => {
  // Estrategia: Network First (Red primero)
  // Esto asegura que si hay internet, siempre traiga lo nuevo de Firebase
  event.respondWith(
    fetch(event.request).catch(() => {
      return caches.match(event.request);
    })
  );
});