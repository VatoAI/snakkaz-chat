// Snakkaz Chat App Service Worker - Simplified and Robust Version
const CACHE_VERSION = '3';
const CACHE_NAME = 'snakkaz-cache-v' + CACHE_VERSION;
const OFFLINE_URL = '/offline.html';

// Assets to cache on installation
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/offline.html',
  '/manifest.json',
  '/icons/snakkaz-icon-192.png',
  '/icons/snakkaz-icon-512.png',
  '/assets/index.css',
  '/assets/index.js'
];

// Quieter logging for production
const DEBUG = false;
const log = (...args) => {
  if (DEBUG) {
    console.log('[ServiceWorker]', ...args);
  }
};

// Install event - cache essential assets
self.addEventListener('install', (event) => {
  log('Installing service worker');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        log('Caching essential assets');
        return cache.addAll(ASSETS_TO_CACHE);
      })
      .catch(error => {
        console.error('Error during service worker install:', error);
        // Don't block installation even if caching fails
        return Promise.resolve();
      })
      .then(() => {
        log('Service worker installed');
        return self.skipWaiting();
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  log('Activating service worker');
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.filter(cacheName => {
            return cacheName.startsWith('snakkaz-cache-') && cacheName !== CACHE_NAME;
          }).map((cacheName) => {
            log('Removing old cache:', cacheName);
            return caches.delete(cacheName);
          })
        );
      })
      .then(() => {
        log('Service worker activated');
        return self.clients.claim();
      })
      .catch(error => {
        console.error('Error during service worker activation:', error);
        // Continue activation even if cache cleanup fails
        return self.clients.claim();
      })
  );
});

// Fetch event - network-first strategy with fallback to cache
self.addEventListener('fetch', (event) => {
  // Don't handle non-GET requests at all
  if (event.request.method !== 'GET') {
    return;
  }
  
  // Don't try to handle requests for other domains
  const url = new URL(event.request.url);
  if (url.origin !== location.origin) {
    return;
  }
  
  // Special handling for HTML navigation requests - network first
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request)
        .catch(() => {
          log('Navigation fetch failed, falling back to offline page');
          return caches.match(OFFLINE_URL);
        })
    );
    return;
  }
  
  // For all other GET requests - try network first, fall back to cache
  event.respondWith(
    fetch(event.request)
      .then(response => {
        // Clone the response to put one copy in cache
        const responseToCache = response.clone();
        
        // Only cache successful responses
        if (response.ok) {
          caches.open(CACHE_NAME)
            .then(cache => {
              cache.put(event.request, responseToCache);
            })
            .catch(error => {
              log('Failed to cache response:', error);
            });
        }
        
        return response;
      })
      .catch(() => {
        log('Fetch failed, checking cache');
        return caches.match(event.request);
      })
  );
});

// Handle message events (like skipWaiting)
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
