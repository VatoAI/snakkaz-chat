// Snakkaz Chat App Service Worker - Optimalisert for mobilbruk
const CACHE_NAME = 'snakkaz-cache-v1';
const OFFLINE_URL = '/offline.html';
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/offline.html',
  '/snakkaz-logo.png',
  '/favicon.ico',
  '/manifest.json',
  '/icons/snakkaz-icon-192.png',
  '/icons/snakkaz-icon-512.png'
];

// Installer service worker og cache nødvendige ressurser
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('Cache åpnet');
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
  self.skipWaiting();
});

// Aktiverer service worker og fjerner gamle cacher
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('Fjerner gammel cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Håndterer nettverksforespørsler med cache-first strategi
self.addEventListener('fetch', (event) => {
  // Skip cross-origin requests
  if (!event.request.url.startsWith(self.location.origin)) {
    return;
  }

  // API-forespørsler bruker network-first
  if (event.request.url.includes('/api/') || event.request.url.includes('supabase')) {
    event.respondWith(
      fetch(event.request)
        .then(response => {
          return response;
        })
        .catch(() => {
          return caches.match(event.request).then(cachedResponse => {
            if (cachedResponse) {
              return cachedResponse;
            }
            
            // Hvis API-forespørselen feiler og det ikke er i cache,
            // returner en offline-respons som appen kan håndtere
            return new Response(
              JSON.stringify({ offline: true, error: 'Du er offline' }),
              {
                headers: { 'Content-Type': 'application/json' }
              }
            );
          });
        })
    );
    return;
  }

  // For HTML-dokumenter, prøv nettverk først, så cache, så offline-side
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request)
        .catch(() => {
          return caches.match(event.request)
            .then(cachedResponse => {
              if (cachedResponse) {
                return cachedResponse;
              }
              return caches.match(OFFLINE_URL);
            });
        })
    );
    return;
  }

  // For bilder og andre ressurser: cache først, så nettverk
  event.respondWith(
    caches.match(event.request)
      .then(cachedResponse => {
        if (cachedResponse) {
          // Returnerer fra cache umiddelbart, men oppdater cache i bakgrunnen
          const fetchPromise = fetch(event.request)
            .then(networkResponse => {
              if (networkResponse && networkResponse.status === 200) {
                const cloneResponse = networkResponse.clone();
                caches.open(CACHE_NAME).then(cache => {
                  cache.put(event.request, cloneResponse);
                });
              }
              return networkResponse;
            })
            .catch(() => cachedResponse);

          return cachedResponse;
        }
        
        // Ikke i cache, prøv nettverk
        return fetch(event.request)
          .then(response => {
            if (!response || response.status !== 200) {
              return response;
            }
            
            // Cache responsen for fremtidig bruk
            const responseToCache = response.clone();
            caches.open(CACHE_NAME).then(cache => {
              cache.put(event.request, responseToCache);
            });
            
            return response;
          });
      })
  );
});

// Lytter etter push-varsler
self.addEventListener('push', (event) => {
  if (!event.data) return;
  
  try {
    const data = event.data.json();
    
    const options = {
      body: data.body || 'Ny melding i Snakkaz',
      icon: '/icons/snakkaz-icon-192.png',
      badge: '/icons/snakkaz-icon-192.png',
      vibrate: [100, 50, 100],
      data: {
        url: data.url || '/'
      }
    };
    
    event.waitUntil(
      self.registration.showNotification(data.title || 'Snakkaz', options)
    );
  } catch (err) {
    console.error('Feil ved behandling av push-varsel:', err);
  }
});

// Når brukeren klikker på en notifikasjon
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  
  event.waitUntil(
    clients.matchAll({ type: 'window' })
      .then(clientList => {
        for (const client of clientList) {
          if (client.url === event.notification.data.url && 'focus' in client) {
            return client.focus();
          }
        }
        if (clients.openWindow) {
          return clients.openWindow(event.notification.data.url || '/');
        }
      })
  );
});
