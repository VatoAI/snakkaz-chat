// Snakkaz Chat - Forbedret Service Worker

// Cache names
const STATIC_CACHE_NAME = 'snakkaz-static-v1';
const DYNAMIC_CACHE_NAME = 'snakkaz-dynamic-v1';
const API_CACHE_NAME = 'snakkaz-api-v1';
const IMAGE_CACHE_NAME = 'snakkaz-images-v1';

// Resources to precache
const PRECACHE_RESOURCES = [
  '/',
  '/index.html',
  '/offline.html', // Fallback page for offline
  '/manifest.json',
  '/favicon.ico',
];

// API paths that should be cached with different strategies
const API_PATHS = [
  { urlPattern: /\/api\/public\//, cacheName: API_CACHE_NAME, strategy: 'cache-first', maxAge: 60 * 60 * 1000 },
  { urlPattern: /\/api\/user\//, cacheName: API_CACHE_NAME, strategy: 'network-first', maxAge: 5 * 60 * 1000 },
  { urlPattern: /\/api\/messages\//, cacheName: API_CACHE_NAME, strategy: 'network-first', maxAge: 1 * 60 * 1000 },
];

// Install event - precache static resources
self.addEventListener('install', event => {
  console.log('Service Worker installing');
  
  event.waitUntil(
    caches.open(STATIC_CACHE_NAME)
      .then(cache => {
        console.log('Precaching static resources');
        return cache.addAll(PRECACHE_RESOURCES);
      })
      .then(() => self.skipWaiting())
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
  console.log('Service Worker activating');
  
  const currentCaches = [STATIC_CACHE_NAME, DYNAMIC_CACHE_NAME, API_CACHE_NAME, IMAGE_CACHE_NAME];
  
  event.waitUntil(
    caches.keys()
      .then(cacheNames => {
        return cacheNames.filter(cacheName => !currentCaches.includes(cacheName));
      })
      .then(cachesToDelete => {
        return Promise.all(cachesToDelete.map(cacheToDelete => {
          console.log(`Deleting old cache: ${cacheToDelete}`);
          return caches.delete(cacheToDelete);
        }));
      })
      .then(() => self.clients.claim())
  );
});

// Fetch event - apply different caching strategies
self.addEventListener('fetch', event => {
  // Skip non-GET requests
  if (event.request.method !== 'GET') {
    return;
  }
  
  // Get the URL from the request
  const url = new URL(event.request.url);
  
  // Apply different strategies based on the requested resource type
  
  // 1. API requests - use specific strategy based on API_PATHS configuration
  const apiConfig = API_PATHS.find(api => api.urlPattern.test(url.pathname));
  if (apiConfig) {
    if (apiConfig.strategy === 'cache-first') {
      event.respondWith(cacheFirstStrategy(event.request, apiConfig.cacheName, apiConfig.maxAge));
    } else {
      event.respondWith(networkFirstStrategy(event.request, apiConfig.cacheName));
    }
    return;
  }
  
  // 2. Image requests - use cache-first strategy with fallback
  if (url.pathname.match(/\.(jpg|jpeg|png|gif|svg|webp)$/)) {
    event.respondWith(cacheFirstWithFallbackStrategy(event.request, IMAGE_CACHE_NAME));
    return;
  }
  
  // 3. HTML navigation requests - use network-first strategy
  if (event.request.mode === 'navigate' || event.request.headers.get('accept')?.includes('text/html')) {
    event.respondWith(
      networkFirstStrategy(event.request, STATIC_CACHE_NAME)
        .catch(() => caches.match('/offline.html'))
    );
    return;
  }
  
  // 4. Default - use cache-first strategy for static assets
  event.respondWith(cacheFirstStrategy(event.request, STATIC_CACHE_NAME));
});

// Cache-first strategy
async function cacheFirstStrategy(request, cacheName, maxAge = null) {
  const cached = await caches.match(request);
  
  if (cached) {
    // If we have a maxAge, check if the cache is still valid
    if (maxAge) {
      const cachedResponse = cached.clone();
      const cachedDate = new Date(cachedResponse.headers.get('date'));
      
      if (Date.now() - cachedDate.getTime() > maxAge) {
        // Cached response is too old, fetch a new one
        return fetchAndCache(request, cacheName);
      }
    }
    
    return cached;
  }
  
  return fetchAndCache(request, cacheName);
}

// Network-first strategy
async function networkFirstStrategy(request, cacheName) {
  try {
    const response = await fetchAndCache(request, cacheName);
    return response;
  } catch (error) {
    console.log('Network request failed, falling back to cache', error);
    const cached = await caches.match(request);
    
    if (cached) {
      return cached;
    }
    
    throw error;
  }
}

// Cache-first with image fallback strategy
async function cacheFirstWithFallbackStrategy(request, cacheName) {
  try {
    return await cacheFirstStrategy(request, cacheName);
  } catch (error) {
    console.log('Failed to fetch image, using fallback', error);
    
    // Check if we have a fallback image in the cache
    const fallbackImage = await caches.match('/assets/image-placeholder.png');
    if (fallbackImage) {
      return fallbackImage;
    }
    
    // If no fallback in cache, create a simple one
    return new Response(
      '<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200"><rect fill="#eeeeee" width="200" height="200"/><text fill="#aaaaaa" font-family="sans-serif" font-size="16" dy="10.5" font-weight="bold" x="50%" y="50%" text-anchor="middle">Image</text></svg>',
      { headers: { 'Content-Type': 'image/svg+xml' } }
    );
  }
}

// Helper function to fetch and cache
async function fetchAndCache(request, cacheName) {
  const networkResponse = await fetch(request);
  
  // Only cache valid responses
  if (networkResponse.ok && networkResponse.status !== 206) { // Don't cache partial responses
    const clonedResponse = networkResponse.clone();
    
    caches.open(cacheName).then(cache => {
      if (request.method === 'GET') {
        cache.put(request, clonedResponse);
      }
    });
  }
  
  return networkResponse;
}

// Background sync for offline actions
self.addEventListener('sync', event => {
  if (event.tag === 'sync-messages') {
    event.waitUntil(syncMessages());
  }
});

// Function to sync pending messages when online
async function syncMessages() {
  try {
    const db = await openDatabase();
    const pendingMessages = await db.getAll('pending-messages');
    
    if (pendingMessages.length === 0) {
      return;
    }
    
    console.log(`Syncing ${pendingMessages.length} pending messages`);
    
    for (const message of pendingMessages) {
      try {
        const response = await fetch('/api/messages', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(message.data),
        });
        
        if (response.ok) {
          // Message successfully sent, remove from pending
          await db.delete('pending-messages', message.id);
          console.log(`Message ${message.id} synced successfully`);
        } else {
          console.error(`Failed to sync message ${message.id}:`, await response.text());
        }
      } catch (error) {
        console.error(`Error syncing message ${message.id}:`, error);
        // Leave in database for next sync attempt
      }
    }
  } catch (error) {
    console.error('Error in syncMessages:', error);
  }
}

// Simple IndexedDB wrapper
async function openDatabase() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('snakkaz-offline-db', 1);
    
    request.onupgradeneeded = event => {
      const db = event.target.result;
      db.createObjectStore('pending-messages', { keyPath: 'id', autoIncrement: true });
    };
    
    request.onsuccess = event => {
      const db = event.target.result;
      
      resolve({
        async getAll(storeName) {
          return new Promise((resolve, reject) => {
            const transaction = db.transaction(storeName, 'readonly');
            const store = transaction.objectStore(storeName);
            const request = store.getAll();
            
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
          });
        },
        
        async delete(storeName, id) {
          return new Promise((resolve, reject) => {
            const transaction = db.transaction(storeName, 'readwrite');
            const store = transaction.objectStore(storeName);
            const request = store.delete(id);
            
            request.onsuccess = () => resolve();
            request.onerror = () => reject(request.error);
          });
        },
        
        async add(storeName, data) {
          return new Promise((resolve, reject) => {
            const transaction = db.transaction(storeName, 'readwrite');
            const store = transaction.objectStore(storeName);
            const request = store.add(data);
            
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
          });
        }
      });
    };
    
    request.onerror = event => {
      reject(new Error('Failed to open database'));
    };
  });
}

// Listen for push notifications
self.addEventListener('push', event => {
  if (!event.data) {
    return;
  }
  
  try {
    const data = event.data.json();
    
    const options = {
      body: data.message,
      icon: '/assets/notification-icon.png',
      badge: '/assets/notification-badge.png',
      data: {
        url: data.url
      }
    };
    
    event.waitUntil(
      self.registration.showNotification(data.title || 'Snakkaz Chat', options)
    );
  } catch (error) {
    console.error('Error showing notification:', error);
  }
});

// Notification click event
self.addEventListener('notificationclick', event => {
  event.notification.close();
  
  if (event.notification.data && event.notification.data.url) {
    event.waitUntil(
      clients.openWindow(event.notification.data.url)
    );
  }
});
