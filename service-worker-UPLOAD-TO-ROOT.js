// SnakkaZ Service Worker - PWA & Offline Support
const CACHE_NAME = 'snakkaz-v1.0.0';
const STATIC_CACHE = 'snakkaz-static-v1';
const DYNAMIC_CACHE = 'snakkaz-dynamic-v1';

// Files to cache immediately
const STATIC_FILES = [
  '/',
  '/index.html',
  '/manifest.json',
  '/favicon.ico',
  '/assets/js/index-BWQuTEbr.js',
  '/assets/js/vendor-react-core-Cd05VJ5Y.js',
  '/assets/js/vendor-react-dom-DmiX1e6y.js',
  '/assets/js/vendor-animation-BRHAymv3.js',
  '/assets/js/components-ui-CoK5VGD0.js',
  '/assets/js/app-utils-CvwRV1zG.js',
  '/assets/css/index-BuuGx747.css',
  '/assets/css/pages-main-mrR2Awbu.css'
];

// Install event - cache static files
self.addEventListener('install', (event) => {
  console.log('🔧 Service Worker: Installing...');
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then((cache) => {
        console.log('📦 Service Worker: Caching static files');
        return cache.addAll(STATIC_FILES);
      })
      .then(() => {
        console.log('✅ Service Worker: Installation complete');
        return self.skipWaiting();
      })
      .catch((error) => {
        console.log('❌ Service Worker: Install error:', error);
      })
  );
});

// Activate event - clean old caches
self.addEventListener('activate', (event) => {
  console.log('🚀 Service Worker: Activating...');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
            console.log('🗑️ Service Worker: Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      console.log('✅ Service Worker: Activation complete');
      return self.clients.claim();
    })
  );
});

// Fetch event - serve from cache with network fallback
self.addEventListener('fetch', (event) => {
  const { request } = event;
  
  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }
  
  // Skip external requests
  if (!request.url.startsWith(self.location.origin)) {
    return;
  }
  
  event.respondWith(
    caches.match(request)
      .then((cachedResponse) => {
        if (cachedResponse) {
          console.log('📦 Service Worker: Serving from cache:', request.url);
          return cachedResponse;
        }
        
        // Not in cache, fetch from network
        return fetch(request)
          .then((response) => {
            // Check if response is valid
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }
            
            // Clone response for caching
            const responseToCache = response.clone();
            
            // Cache dynamic content
            caches.open(DYNAMIC_CACHE)
              .then((cache) => {
                cache.put(request, responseToCache);
              });
            
            return response;
          })
          .catch((error) => {
            console.log('❌ Service Worker: Fetch error:', error);
            
            // Return offline page for navigation requests
            if (request.destination === 'document') {
              return caches.match('/index.html');
            }
            
            throw error;
          });
      })
  );
});

// Background sync for offline actions
self.addEventListener('sync', (event) => {
  console.log('🔄 Service Worker: Background sync:', event.tag);
  
  if (event.tag === 'chat-sync') {
    event.waitUntil(
      // Handle offline chat messages
      console.log('💬 Service Worker: Syncing offline chat messages')
    );
  }
});

// Push notifications
self.addEventListener('push', (event) => {
  console.log('🔔 Service Worker: Push notification received');
  
  const options = {
    body: event.data ? event.data.text() : 'New message in SnakkaZ',
    icon: '/favicon.ico',
    badge: '/favicon.ico',
    tag: 'snakkaz-notification'
  };
  
  event.waitUntil(
    self.registration.showNotification('SnakkaZ', options)
  );
});

console.log('✅ Service Worker: Loaded successfully');
