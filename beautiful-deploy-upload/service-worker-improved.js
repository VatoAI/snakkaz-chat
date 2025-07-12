// /workspaces/snakkaz-chat/src/service-worker-improved.js
// Improved Service Worker for Snakkaz Chat Application
// This service worker provides advanced caching strategies for different asset types

// Cache name versioning to allow for easy updates
const CACHE_NAME_STATIC = 'snakkaz-static-v1';
const CACHE_NAME_DYNAMIC = 'snakkaz-dynamic-v1';
const CACHE_NAME_API = 'snakkaz-api-v1';
const CACHE_NAME_IMAGES = 'snakkaz-images-v1';

// Assets to cache on install (critical for offline functionality)
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/offline.html', // Create this file for offline fallback
  '/css/main.css',
  '/js/main.js',
  '/js/chunk-vendors.js',
  '/favicon.ico',
  '/logo.png'
];

// Cache time limits (in milliseconds)
const API_CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
const DYNAMIC_CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours

// Maximum size for dynamic cache
const DYNAMIC_CACHE_MAX_ITEMS = 50;

// Install event - cache static assets
self.addEventListener('install', (event) => {
  console.log('[Service Worker] Installing new service worker...');
  event.waitUntil(
    caches.open(CACHE_NAME_STATIC)
      .then((cache) => {
        console.log('[Service Worker] Caching static assets');
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => {
        console.log('[Service Worker] Static assets cached successfully');
        return self.skipWaiting();
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('[Service Worker] Activating new service worker...');
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            // Delete old versions of our caches
            if (
              cacheName !== CACHE_NAME_STATIC &&
              cacheName !== CACHE_NAME_DYNAMIC &&
              cacheName !== CACHE_NAME_API &&
              cacheName !== CACHE_NAME_IMAGES
            ) {
              console.log('[Service Worker] Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        console.log('[Service Worker] Claiming clients');
        return self.clients.claim();
      })
  );
});

// Helper function to determine which cache to use
const getCacheNameForRequest = (request) => {
  const url = new URL(request.url);
  
  // API requests
  if (url.pathname.includes('/api/') || url.pathname.includes('/data/')) {
    return CACHE_NAME_API;
  }
  
  // Image files
  if (
    url.pathname.match(/\.(jpg|jpeg|png|gif|svg|webp)$/) || 
    request.destination === 'image'
  ) {
    return CACHE_NAME_IMAGES;
  }
  
  // Static assets (CSS, JS, fonts)
  if (
    url.pathname.match(/\.(css|js|woff2?|ttf|eot)$/) ||
    request.destination === 'script' ||
    request.destination === 'style' ||
    request.destination === 'font'
  ) {
    return CACHE_NAME_STATIC;
  }
  
  // Everything else goes to dynamic cache
  return CACHE_NAME_DYNAMIC;
};

// Helper function to determine caching strategy
const getCachingStrategy = (request) => {
  const url = new URL(request.url);
  
  // API requests - Network first with cache fallback
  if (url.pathname.includes('/api/') || url.pathname.includes('/data/')) {
    return 'network-first';
  }
  
  // Static assets - Cache first with network fallback
  if (STATIC_ASSETS.includes(url.pathname) || url.pathname.match(/\.(css|js|woff2?|ttf|eot)$/)) {
    return 'cache-first';
  }
  
  // Images - Stale while revalidate
  if (url.pathname.match(/\.(jpg|jpeg|png|gif|svg|webp)$/) || request.destination === 'image') {
    return 'stale-while-revalidate';
  }
  
  // HTML pages (except offline.html) - Network first
  if (url.pathname.endsWith('.html') || url.pathname === '/') {
    return 'network-first';
  }
  
  // Default strategy
  return 'network-first';
};

// Helper function to clean up old cache entries
const trimCache = async (cacheName, maxItems) => {
  const cache = await caches.open(cacheName);
  const keys = await cache.keys();
  
  if (keys.length > maxItems) {
    console.log(`[Service Worker] Trimming cache ${cacheName}, current size: ${keys.length}`);
    await cache.delete(keys[0]);
    // Recursively trim until we're at the max
    await trimCache(cacheName, maxItems);
  }
};

// Fetch event - implement different caching strategies
self.addEventListener('fetch', (event) => {
  // Skip cross-origin requests
  if (!event.request.url.startsWith(self.location.origin)) {
    return;
  }
  
  // Skip non-GET requests
  if (event.request.method !== 'GET') {
    return;
  }
  
  // Skip HEAD requests for caching (previously identified issue)
  if (event.request.method === 'HEAD') {
    return;
  }
  
  const strategy = getCachingStrategy(event.request);
  const cacheName = getCacheNameForRequest(event.request);
  
  switch (strategy) {
    case 'cache-first':
      event.respondWith(cacheFirstStrategy(event.request, cacheName));
      break;
    case 'network-first':
      event.respondWith(networkFirstStrategy(event.request, cacheName));
      break;
    case 'stale-while-revalidate':
      event.respondWith(staleWhileRevalidateStrategy(event.request, cacheName));
      break;
    default:
      event.respondWith(networkFirstStrategy(event.request, cacheName));
  }
  
  // Trim caches to prevent them from growing too large
  if (cacheName === CACHE_NAME_DYNAMIC) {
    trimCache(CACHE_NAME_DYNAMIC, DYNAMIC_CACHE_MAX_ITEMS);
  }
});

// Cache First Strategy - Try cache, fall back to network
const cacheFirstStrategy = async (request, cacheName) => {
  const cache = await caches.open(cacheName);
  const cachedResponse = await cache.match(request);
  
  if (cachedResponse) {
    console.log(`[Service Worker] Serving from cache: ${request.url}`);
    return cachedResponse;
  }
  
  console.log(`[Service Worker] Fetching from network: ${request.url}`);
  try {
    const networkResponse = await fetch(request);
    // Clone the response before caching it
    const clonedResponse = networkResponse.clone();
    
    event.waitUntil(
      cache.put(request, clonedResponse)
    );
    
    return networkResponse;
  } catch (error) {
    console.log(`[Service Worker] Network error for: ${request.url}`, error);
    
    // For HTML requests, return the offline page
    if (request.destination === 'document') {
      return caches.match('/offline.html');
    }
    
    return new Response('Network error', { status: 408, headers: { 'Content-Type': 'text/plain' } });
  }
};

// Network First Strategy - Try network, fall back to cache
const networkFirstStrategy = async (request, cacheName) => {
  try {
    console.log(`[Service Worker] Fetching from network first: ${request.url}`);
    const networkResponse = await fetch(request);
    
    // Only cache successful responses
    if (networkResponse.ok) {
      const cache = await caches.open(cacheName);
      // Clone the response before caching it
      const clonedResponse = networkResponse.clone();
      
      event.waitUntil(
        cache.put(request, clonedResponse)
      );
    }
    
    return networkResponse;
  } catch (error) {
    console.log(`[Service Worker] Network error, falling back to cache for: ${request.url}`);
    const cache = await caches.open(cacheName);
    const cachedResponse = await cache.match(request);
    
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // For HTML requests, return the offline page
    if (request.destination === 'document') {
      return caches.match('/offline.html');
    }
    
    return new Response('Network error and no cache available', { 
      status: 404, 
      headers: { 'Content-Type': 'text/plain' } 
    });
  }
};

// Stale While Revalidate - Return from cache, then update cache from network
const staleWhileRevalidateStrategy = async (request, cacheName) => {
  const cache = await caches.open(cacheName);
  const cachedResponse = await cache.match(request);
  
  // Update the cache in the background
  const fetchPromise = fetch(request).then(async (networkResponse) => {
    if (networkResponse.ok) {
      await cache.put(request, networkResponse.clone());
      console.log(`[Service Worker] Updated cached version of: ${request.url}`);
    }
    return networkResponse;
  }).catch(error => {
    console.log(`[Service Worker] Network error while revalidating: ${request.url}`, error);
  });
  
  // Return the cached response immediately if we have it
  if (cachedResponse) {
    console.log(`[Service Worker] Returning cached version of: ${request.url}`);
    event.waitUntil(fetchPromise);
    return cachedResponse;
  }
  
  // If we don't have a cached response, wait for the network
  console.log(`[Service Worker] No cached version, waiting for network: ${request.url}`);
  return fetchPromise;
};

// Background sync event for offline message sending
self.addEventListener('sync', (event) => {
  console.log('[Service Worker] Background Sync event:', event.tag);
  
  if (event.tag === 'sync-messages') {
    event.waitUntil(syncMessages());
  }
});

// Helper function to sync messages sent while offline
const syncMessages = async () => {
  try {
    // Get all messages from IndexedDB that need to be synced
    const db = await openMessagesDB();
    const messages = await getMessagesToSync(db);
    
    console.log(`[Service Worker] Syncing ${messages.length} messages`);
    
    for (const message of messages) {
      try {
        // Try to send the message
        const response = await fetch('/api/messages', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(message.data),
        });
        
        if (response.ok) {
          // If successful, remove it from the sync queue
          await removeMessageFromSyncQueue(db, message.id);
          console.log(`[Service Worker] Successfully synced message ${message.id}`);
        } else {
          console.log(`[Service Worker] Failed to sync message ${message.id}, status: ${response.status}`);
        }
      } catch (error) {
        console.error(`[Service Worker] Error syncing message ${message.id}:`, error);
      }
    }
    
    // Close the database connection
    db.close();
  } catch (error) {
    console.error('[Service Worker] Error during message sync:', error);
  }
};

// Helper functions for IndexedDB operations
const openMessagesDB = () => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('snakkaz-messages', 1);
    
    request.onerror = (event) => {
      reject('Error opening IndexedDB');
    };
    
    request.onsuccess = (event) => {
      resolve(event.target.result);
    };
    
    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains('offline-messages')) {
        db.createObjectStore('offline-messages', { keyPath: 'id' });
      }
    };
  });
};

const getMessagesToSync = (db) => {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(['offline-messages'], 'readonly');
    const store = transaction.objectStore('offline-messages');
    const request = store.getAll();
    
    request.onerror = (event) => {
      reject('Error getting messages to sync');
    };
    
    request.onsuccess = (event) => {
      resolve(event.target.result);
    };
  });
};

const removeMessageFromSyncQueue = (db, id) => {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(['offline-messages'], 'readwrite');
    const store = transaction.objectStore('offline-messages');
    const request = store.delete(id);
    
    request.onerror = (event) => {
      reject(`Error removing message ${id} from sync queue`);
    };
    
    request.onsuccess = (event) => {
      resolve();
    };
  });
};

// Push notification event
self.addEventListener('push', (event) => {
  console.log('[Service Worker] Push notification received:', event);
  
  let notificationData = {};
  
  try {
    notificationData = event.data.json();
  } catch (error) {
    notificationData = {
      title: 'New notification',
      body: event.data ? event.data.text() : 'No details available',
      icon: '/logo.png'
    };
  }
  
  event.waitUntil(
    self.registration.showNotification(notificationData.title, {
      body: notificationData.body,
      icon: notificationData.icon || '/logo.png',
      badge: notificationData.badge || '/badge.png',
      data: notificationData.data,
      actions: notificationData.actions || []
    })
  );
});

// Notification click event
self.addEventListener('notificationclick', (event) => {
  console.log('[Service Worker] Notification clicked:', event.notification.tag);
  
  event.notification.close();
  
  // If there's a specific URL in the notification data, open it
  let urlToOpen = new URL('/', self.location.origin).href;
  
  if (event.notification.data && event.notification.data.url) {
    urlToOpen = event.notification.data.url;
  }
  
  event.waitUntil(
    clients.matchAll({ type: 'window' }).then((clientList) => {
      // If we already have a window open, focus it
      for (const client of clientList) {
        if (client.url === urlToOpen && 'focus' in client) {
          return client.focus();
        }
      }
      
      // Otherwise, open a new window
      if (clients.openWindow) {
        return clients.openWindow(urlToOpen);
      }
    })
  );
});
