// Snakkaz Chat App Service Worker - Optimalisert for mobilbruk og produksjon
const CACHE_VERSION = '2';
const CACHE_NAME = 'snakkaz-cache-v' + CACHE_VERSION;
const OFFLINE_URL = '/offline.html';

// Ressurser som skal caches ved installasjon
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/offline.html',
  '/snakkaz-logo.png',
  '/favicon.ico',
  '/manifest.json',
  '/icons/snakkaz-icon-192.png',
  '/icons/snakkaz-icon-512.png',
  '/assets/index.css',
  '/assets/index.js'
];

// Logger for feilsøking, deaktiveres i produksjon
const DEBUG = false;
const log = (...args) => {
  if (DEBUG) {
    console.log('[ServiceWorker]', ...args);
  }
};

// Installer service worker og cache nødvendige ressurser
self.addEventListener('install', (event) => {
  log('Installerer');
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      log('Cache åpnet, legger til filer');
      return cache.addAll(ASSETS_TO_CACHE)
        .then(() => log('Alle ressurser cachet'))
        .catch(error => {
          log('Feil ved caching av ressurser:', error);
          // Fortsett med serviceworker selv om noen filer ikke kunne caches
          return Promise.resolve();
        });
    })
  );
  self.skipWaiting();
});

// Aktiverer service worker og fjerner gamle cacher
self.addEventListener('activate', (event) => {
  log('Aktiverer');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.filter(cacheName => {
          // Fjern alle caches som begynner med 'snakkaz-cache-' men ikke er den gjeldende versjonen
          return cacheName.startsWith('snakkaz-cache-') && cacheName !== CACHE_NAME;
        }).map((cacheName) => {
          log('Fjerner gammel cache:', cacheName);
          return caches.delete(cacheName);
        })
      );
    }).then(() => {
      log('Serviceworker er nå aktiv');
      return self.clients.claim();
    })
  );
});

// Håndter fetch-events - server fra cache hvis tilgjengelig, ellers fra nettverket
self.addEventListener('fetch', (event) => {
  // Skip non-GET requests
  if (event.request.method !== 'GET') {
    return;
  }
  
  // Handle fetch event
  event.respondWith(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.match(event.request).then((cachedResponse) => {
        // Hvis ressursen finnes i cache, returner den
        if (cachedResponse) {
          log('Serving from cache:', event.request.url);
          return cachedResponse;
        }
        
        // Ellers, gå til nettverket
        return fetch(event.request).then((networkResponse) => {
          // Hvis vi får respons og den er OK, cache den for fremtidig bruk
          if (networkResponse && networkResponse.status === 200) {
            // Clone the response since it can only be consumed once
            const responseToCache = networkResponse.clone();
            
            // Skip caching for HEAD requests (previously fixed issue)
            if (event.request.method === 'GET') {
              cache.put(event.request, responseToCache);
            }
          }
          
          return networkResponse;
        }).catch((error) => {
          log('Fetch failed, falling back to offline page:', error);
          
          // Hvis nettverket feiler og vi har en offline-side, returner den
          if (event.request.mode === 'navigate') {
            return cache.match(OFFLINE_URL);
          }
          
          return new Response('Network error', { status: 408, headers: { 'Content-Type': 'text/plain' } });
        });
      });
    })
  );
});

// Skip waiting when asked
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
