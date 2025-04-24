
const CACHE_NAME = 'snakkaz-cache-v5';
const urlsToCache = [
  '/',
  '/index.html',
  '/icons/snakkaz-icon-192.png',
  '/icons/snakkaz-icon-512.png',
  '/manifest.json',
  '/snakkaz-logo.png',
  '/chat',
  '/profil',
  '/register',
  'https://www.snakkaz.com/thumbnail.png',
  'https://dash.snakkaz.com/thumbnail.png'
];

// Install Service Worker and cache essential resources
self.addEventListener('install', (event) => {
  console.log('Service Worker: Installing...');
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Service Worker: Caching app shell and content');
        return cache.addAll(urlsToCache);
      })
      .then(() => {
        console.log('Service Worker: Installation completed');
        return self.skipWaiting();
      })
      .catch(error => {
        console.error('Service Worker: Installation failed:', error);
      })
  );
});

// Activate Service Worker and clean up old caches
self.addEventListener('activate', (event) => {
  console.log('Service Worker: Activating...');
  
  const cacheWhitelist = [CACHE_NAME];
  
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (!cacheWhitelist.includes(cacheName)) {
            console.log('Service Worker: Deleting old cache', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
    .then(() => {
      console.log('Service Worker: Now active, controlling all clients');
      return self.clients.claim();
    })
    .catch(error => {
      console.error('Service Worker: Activation failed:', error);
    })
  );
});

// Network-first strategy for most requests, falling back to cache
self.addEventListener('fetch', (event) => {
  // Skip cross-origin requests
  if (!event.request.url.startsWith(self.location.origin)) {
    return;
  }
  
  // Skip supabase API requests
  if (event.request.url.includes('supabase')) {
    return;
  }

  // For HTML files, always try network first
  if (event.request.headers.get('Accept').includes('text/html')) {
    event.respondWith(
      fetch(event.request)
        .then(response => {
          const responseClone = response.clone();
          caches.open(CACHE_NAME).then(cache => {
            cache.put(event.request, responseClone);
          });
          return response;
        })
        .catch(() => {
          return caches.match(event.request)
            .then(response => {
              return response || caches.match('/');
            });
        })
    );
    return;
  }

  // For other requests
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // Clone the response to store in cache
        if (event.request.method === 'GET') {
          const responseToCache = response.clone();
          caches.open(CACHE_NAME)
            .then((cache) => {
              cache.put(event.request, responseToCache);
            });
        }
        return response;
      })
      .catch(() => {
        // If network fetch fails, try to serve from cache
        return caches.match(event.request);
      })
  );
});

// Handle messages from clients
self.addEventListener('message', (event) => {
  if (event.data.action === 'skipWaiting') {
    self.skipWaiting();
  }
});

// Push notification handling
self.addEventListener('push', (event) => {
  if (!event.data) return;
  
  try {
    const data = event.data.json();
    const options = {
      body: data.body || 'Ny melding fra SnakkaZ',
      icon: '/icons/snakkaz-icon-192.png',
      badge: '/icons/snakkaz-icon-192.png',
      vibrate: [100, 50, 100],
      data: {
        url: data.url || '/'
      },
      actions: [
        {
          action: 'open',
          title: 'Åpne'
        }
      ]
    };
    
    event.waitUntil(
      self.registration.showNotification(
        data.title || 'SnakkaZ', 
        options
      )
    );
  } catch (error) {
    console.error('Error showing notification:', error);
  }
});

// Notification click handler
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  
  if (event.action === 'open' || !event.action) {
    event.waitUntil(
      clients.matchAll({type: 'window'})
        .then((clientList) => {
          const url = event.notification.data.url || '/';
          
          // Check if a window is already open
          for (const client of clientList) {
            if (client.url === url && 'focus' in client) {
              return client.focus();
            }
          }
          
          // If no window is open, open a new one
          if (clients.openWindow) {
            return clients.openWindow(url);
          }
        })
    );
  }
});

// Periodic sync for background updates (if supported)
self.addEventListener('periodicsync', (event) => {
  if (event.tag === 'update-messages') {
    event.waitUntil(
      fetch('/api/sync-messages')
        .then(response => {
          if (!response.ok) {
            throw new Error('Failed to sync messages');
          }
          return response.json();
        })
        .catch(error => {
          console.error('Periodic sync failed:', error);
        })
    );
  }
});
