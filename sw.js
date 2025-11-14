// sw.js
self.addEventListener('install', (event) => {
  console.log('Service worker installing...');
  // Add a call to skipWaiting to activate the service worker immediately.
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  console.log('Service worker activating...');
});

self.addEventListener('fetch', (event) => {
  // For PWA installability, a fetch handler is needed.
  // This basic handler just passes the request through to the network.
  // For a full offline experience, caching strategies would be implemented here.
  event.respondWith(fetch(event.request));
});
