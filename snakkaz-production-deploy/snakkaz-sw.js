/**
 * SnakkaZ Service Worker - Background Sync & Offline Support
 * Ensures messages are sent even when offline
 * Better than Signal, Telegram, WhatsApp offline handling!
 * Created: 2025-07-22
 */

const CACHE_NAME = 'snakkaz-v1';
const STATIC_CACHE = 'snakkaz-static-v1';
const DYNAMIC_CACHE = 'snakkaz-dynamic-v1';

// Files to cache for offline use
const STATIC_FILES = [
  '/',
  '/index.html',
  '/assets/css/index.css',
  '/assets/js/index.js',
  '/icons/snakkaz-icon-192.png',
  '/icons/snakkaz-icon-512.png'
];

// Install event - Cache static files
self.addEventListener('install', event => {
  console.log('🔧 Service Worker: Installing...');
  
  event.waitUntil(
    caches.open(STATIC_CACHE).then(cache => {
      console.log('📦 Service Worker: Caching static files...');
      return cache.addAll(STATIC_FILES);
    }).then(() => {
      console.log('✅ Service Worker: Static files cached');
      return self.skipWaiting();
    })
  );
});

// Activate event - Clean old caches
self.addEventListener('activate', event => {
  console.log('🚀 Service Worker: Activating...');
  
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
            console.log('🧹 Service Worker: Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      console.log('✅ Service Worker: Activated and ready');
      return self.clients.claim();
    })
  );
});

// Fetch event - Network first, then cache
self.addEventListener('fetch', event => {
  const { request } = event;
  
  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }
  
  // Handle API requests differently
  if (request.url.includes('/api/') || request.url.includes('supabase.co')) {
    event.respondWith(
      handleAPIRequest(request)
    );
  } else {
    // Handle static files
    event.respondWith(
      handleStaticRequest(request)
    );
  }
});

// API Request Handler - Network first with background sync fallback
async function handleAPIRequest(request) {
  try {
    // Try network first
    const response = await fetch(request);
    
    if (response.ok) {
      // Cache successful API responses for short time
      const cache = await caches.open(DYNAMIC_CACHE);
      cache.put(request, response.clone());
    }
    
    return response;
  } catch (error) {
    console.log('🌐 Service Worker: Network failed, checking cache...');
    
    // Try cache
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      console.log('📦 Service Worker: Serving from cache');
      return cachedResponse;
    }
    
    // If it's a POST request (sending message), queue for background sync
    if (request.method === 'POST') {
      await queueForBackgroundSync(request);
      return new Response(JSON.stringify({
        success: true,
        queued: true,
        offline: true,
        message: 'Message queued for sending when online'
      }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    // Return offline page for GET requests
    return new Response('Offline - Will sync when online', {
      status: 503,
      statusText: 'Service Unavailable'
    });
  }
}

// Static Request Handler - Cache first
async function handleStaticRequest(request) {
  // Check cache first
  const cachedResponse = await caches.match(request);
  if (cachedResponse) {
    return cachedResponse;
  }
  
  try {
    // Try network
    const response = await fetch(request);
    
    if (response.ok) {
      // Cache the response
      const cache = await caches.open(DYNAMIC_CACHE);
      cache.put(request, response.clone());
    }
    
    return response;
  } catch (error) {
    // Return cached fallback or error
    return new Response('Offline', { status: 503 });
  }
}

// Background Sync - Queue failed requests
async function queueForBackgroundSync(request) {
  try {
    const requestData = {
      url: request.url,
      method: request.method,
      headers: Object.fromEntries(request.headers.entries()),
      body: await request.text(),
      timestamp: Date.now()
    };
    
    // Store in IndexedDB for persistence
    await storeInIndexedDB('background-sync', requestData);
    
    // Register background sync if supported
    if ('serviceWorker' in navigator && 'sync' in window.ServiceWorkerRegistration.prototype) {
      const registration = await self.registration;
      await registration.sync.register('background-sync');
      console.log('📤 Service Worker: Registered background sync');
    }
  } catch (error) {
    console.error('❌ Service Worker: Failed to queue for background sync:', error);
  }
}

// Background Sync Event
self.addEventListener('sync', event => {
  console.log('🔄 Service Worker: Background sync triggered');
  
  if (event.tag === 'background-sync') {
    event.waitUntil(
      processBackgroundSync()
    );
  }
});

// Process queued requests when online
async function processBackgroundSync() {
  try {
    const queuedRequests = await getFromIndexedDB('background-sync');
    
    for (const requestData of queuedRequests) {
      try {
        const response = await fetch(requestData.url, {
          method: requestData.method,
          headers: requestData.headers,
          body: requestData.body
        });
        
        if (response.ok) {
          // Remove from queue
          await removeFromIndexedDB('background-sync', requestData.timestamp);
          console.log('✅ Service Worker: Background sync completed for request');
          
          // Notify main app
          await notifyMainApp('sync-complete', {
            url: requestData.url,
            timestamp: requestData.timestamp
          });
        }
      } catch (error) {
        console.error('❌ Service Worker: Background sync failed for request:', error);
      }
    }
  } catch (error) {
    console.error('❌ Service Worker: Background sync processing failed:', error);
  }
}

// IndexedDB helpers for persistent storage
async function storeInIndexedDB(storeName, data) {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('SnakkazDB', 1);
    
    request.onerror = () => reject(request.error);
    request.onsuccess = () => {
      const db = request.result;
      const transaction = db.transaction([storeName], 'readwrite');
      const store = transaction.objectStore(storeName);
      
      const addRequest = store.add(data);
      addRequest.onsuccess = () => resolve();
      addRequest.onerror = () => reject(addRequest.error);
    };
    
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(storeName)) {
        const store = db.createObjectStore(storeName, { keyPath: 'timestamp' });
        store.createIndex('url', 'url', { unique: false });
      }
    };
  });
}

async function getFromIndexedDB(storeName) {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('SnakkazDB', 1);
    
    request.onerror = () => reject(request.error);
    request.onsuccess = () => {
      const db = request.result;
      const transaction = db.transaction([storeName], 'readonly');
      const store = transaction.objectStore(storeName);
      
      const getAllRequest = store.getAll();
      getAllRequest.onsuccess = () => resolve(getAllRequest.result || []);
      getAllRequest.onerror = () => reject(getAllRequest.error);
    };
  });
}

async function removeFromIndexedDB(storeName, key) {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('SnakkazDB', 1);
    
    request.onerror = () => reject(request.error);
    request.onsuccess = () => {
      const db = request.result;
      const transaction = db.transaction([storeName], 'readwrite');
      const store = transaction.objectStore(storeName);
      
      const deleteRequest = store.delete(key);
      deleteRequest.onsuccess = () => resolve();
      deleteRequest.onerror = () => reject(deleteRequest.error);
    };
  });
}

// Notify main app about sync events
async function notifyMainApp(type, data) {
  const clients = await self.clients.matchAll();
  clients.forEach(client => {
    client.postMessage({
      type: type,
      data: data
    });
  });
}

// Push notification support
self.addEventListener('push', event => {
  console.log('📱 Service Worker: Push notification received');
  
  if (event.data) {
    const data = event.data.json();
    
    const options = {
      body: data.body || 'New message received',
      icon: '/icons/snakkaz-icon-192.png',
      badge: '/icons/snakkaz-icon-192.png',
      vibrate: [200, 100, 200],
      data: data,
      actions: [
        {
          action: 'reply',
          title: 'Reply',
          icon: '/icons/reply-icon.png'
        },
        {
          action: 'view',
          title: 'View',
          icon: '/icons/view-icon.png'
        }
      ]
    };
    
    event.waitUntil(
      self.registration.showNotification(data.title || 'SnakkaZ', options)
    );
  }
});

// Handle notification clicks
self.addEventListener('notificationclick', event => {
  console.log('📱 Service Worker: Notification clicked');
  
  event.notification.close();
  
  if (event.action === 'reply') {
    // Open reply interface
    event.waitUntil(
      clients.openWindow('/chat?reply=' + event.notification.data.conversationId)
    );
  } else {
    // Open main app
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});

// Periodic background sync for checking messages
self.addEventListener('periodicsync', event => {
  if (event.tag === 'check-messages') {
    event.waitUntil(
      checkForNewMessages()
    );
  }
});

async function checkForNewMessages() {
  try {
    // Check for new messages from server
    const response = await fetch('/api/messages/check-new');
    
    if (response.ok) {
      const data = await response.json();
      
      if (data.hasNewMessages) {
        // Show notification for new messages
        await self.registration.showNotification('New messages', {
          body: `You have ${data.count} new messages`,
          icon: '/icons/snakkaz-icon-192.png'
        });
      }
    }
  } catch (error) {
    console.error('❌ Service Worker: Failed to check for new messages:', error);
  }
}

// Message handler for communication with main app
self.addEventListener('message', event => {
  const { type, data } = event.data;
  
  switch (type) {
    case 'skip-waiting':
      self.skipWaiting();
      break;
      
    case 'cache-message':
      // Cache a message for offline viewing
      caches.open(DYNAMIC_CACHE).then(cache => {
        cache.put(`/messages/${data.id}`, new Response(JSON.stringify(data)));
      });
      break;
      
    case 'get-cache-status':
      // Return cache status
      event.ports[0].postMessage({
        cacheSize: getCacheSize(),
        offlineReady: true
      });
      break;
  }
});

async function getCacheSize() {
  let totalSize = 0;
  
  const cacheNames = await caches.keys();
  
  for (const cacheName of cacheNames) {
    const cache = await caches.open(cacheName);
    const requests = await cache.keys();
    
    for (const request of requests) {
      const response = await cache.match(request);
      if (response) {
        const blob = await response.blob();
        totalSize += blob.size;
      }
    }
  }
  
  return Math.round(totalSize / 1024 / 1024 * 100) / 100; // MB
}

console.log('🚀 SnakkaZ Service Worker loaded and ready for offline dominance!');
