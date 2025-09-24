const CACHE_NAME = 'safepath-cache-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/src/main.tsx',
  '/src/App.css',
  '/src/index.css',
  '/src/assets/hero-travel-india.jpg',
  '/favicon.ico',
  '/manifest.json'
];

// Install event: caches all the essential assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('Opened cache');
      return cache.addAll(urlsToCache).catch((error) => {
        console.error('Failed to cache:', error);
      });
    })
  );
});

// Fetch event: serves cached assets when offline
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      // Return the cached response if found
      if (response) {
        return response;
      }
      // Otherwise, fetch from the network
      return fetch(event.request);
    })
  );
});