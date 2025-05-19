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
  // Legg til CSS og JS filer som genereres ved bygging
  // Disse vil variere basert på filnavn fra bygging
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

// Støttefunksjon for å sjekke om en request er en API-request
const isApiRequest = (url) => {
  return url.includes('/api/') || 
         url.includes('supabase.co') || 
         url.includes('api.snakkaz.com');
};

// Støttefunksjon for å sjekke om en request er en statisk ressurs
const isStaticAsset = (url) => {
  return url.match(/\.(jpg|jpeg|png|gif|svg|webp|css|js|woff|woff2|ttf|eot)$/i);
};

// Håndterer nettverksforespørsler med strategier basert på ressurstype
self.addEventListener('fetch', (event) => {
  // Skip cross-origin requests som ikke er relevante å cache
  if (!event.request.url.startsWith(self.location.origin) && 
      !isApiRequest(event.request.url)) {
    return;
  }

  // Skip request for analytics som alltid skal gå til nettverket
  if (event.request.url.includes('analytics') || 
      event.request.url.includes('tracking') || 
      event.request.url.includes('sentry')) {
    return;
  }

  // Håndter OPTIONS-forespørsler direkte
  if (event.request.method === 'OPTIONS') {
    return;
  }

  // For API-forespørsler: alltid bruk nettverk først, med fallback
  if (isApiRequest(event.request.url)) {
    event.respondWith(
      fetch(event.request.clone())
        .then(response => {
          // Ikke cache API-svar som ikke er OK
          if (!response || response.status !== 200) {
            return response;
          }
          
          // Cache vellykkede GET-forespørsler for offline-bruk
          if (event.request.method === 'GET') {
            const responseToCache = response.clone();
            caches.open(CACHE_NAME + '-api').then(cache => {
              cache.put(event.request, responseToCache);
            }).catch(error => log('Kunne ikke cache API-svar:', error));
          }
          
          return response;
        })
        .catch(() => {
          log('API request feilet, prøver cache', event.request.url);
          return caches.match(event.request).then(cachedResponse => {
            if (cachedResponse) {
              return cachedResponse;
            }
            
            // Hvis API-forespørselen feiler og ikke finnes i cache,
            // returner en offline-respons som appen kan håndtere
            return new Response(
              JSON.stringify({ 
                offline: true, 
                error: 'Ingen nettverkstilkobling' 
              }),
              {
                status: 503,
                statusText: 'Service Unavailable',
                headers: { 'Content-Type': 'application/json' }
              }
            );
          });
        })
    );
    return;
  }

  // For HTML navigering: nettverk først, så cache, så offline-side
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request)
        .then(response => {
          // Cache den nye versjonen
          const responseToCache = response.clone();
          caches.open(CACHE_NAME).then(cache => {
            cache.put(event.request, responseToCache);
          }).catch(error => log('Kunne ikke cache navigasjons-svar:', error));
          
          return response;
        })
        .catch(() => {
          log('Navigasjon feilet, prøver cache');
          return caches.match(event.request)
            .then(cachedResponse => {
              if (cachedResponse) {
                return cachedResponse;
              }
              log('Ingen cachet navigasjons-svar, bruker offline-side');
              return caches.match(OFFLINE_URL);
            });
        })
    );
    return;
  }

  // For statiske ressurser: cache først, nettverk som backup
  if (isStaticAsset(event.request.url)) {
    event.respondWith(
      caches.match(event.request)
        .then(cachedResponse => {
          if (cachedResponse) {
            // Returner fra cache umiddelbart, men oppdater cache i bakgrunnen ved GET
            if (event.request.method === 'GET') {
              fetch(event.request)
                .then(networkResponse => {
                  if (networkResponse && networkResponse.status === 200) {
                    caches.open(CACHE_NAME).then(cache => {
                      cache.put(event.request, networkResponse.clone());
                    }).catch(error => log('Kunne ikke oppdatere cache:', error));
                  }
                })
                .catch(() => log('Kunne ikke oppdatere statisk ressurs i bakgrunnen'));
            }
            
            return cachedResponse;
          }
          
          // Ikke i cache, prøv nettverk og cache resultatet for fremtiden
          log('Statisk ressurs ikke i cache, henter fra nettverk', event.request.url);
          return fetch(event.request)
            .then(response => {
              if (!response || response.status !== 200) {
                return response;
              }
              
              // Cache for fremtidig bruk
              const responseToCache = response.clone();
              caches.open(CACHE_NAME).then(cache => {
                // Skip caching for HEAD requests
                if (event.request.method === 'GET') {
                  cache.put(event.request, responseToCache);
                }
              }).catch(error => log('Kunne ikke cache statisk ressurs:', error));
              
              return response;
            });
        })
        .catch(error => {
          log('Feil ved henting av statisk ressurs:', error);
          return new Response('Ressurs ikke tilgjengelig', { 
            status: 404, 
            statusText: 'Not Found' 
          });
        })
    );
    return;
  }

  // For alle andre forespørsler
  event.respondWith(
    fetch(event.request)
      .catch(() => {
        return caches.match(event.request);
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
        url: data.url || '/',
        timestamp: Date.now(),
        id: data.id || crypto.randomUUID()
      },
      actions: [
        {
          action: 'open',
          title: 'Åpne'
        },
        {
          action: 'close',
          title: 'Lukk'
        }
      ],
      // Vis varsel selv om appen er i forgrunnen
      requireInteraction: data.requireInteraction || false,
      // Sett prioritet høy for viktige meldinger
      priority: data.priority || 'default'
    };
    
    event.waitUntil(
      self.registration.showNotification(data.title || 'Snakkaz', options)
    );
  } catch (err) {
    log('Feil ved behandling av push-varsel:', err);
  }
});

// Når brukeren klikker på en notifikasjon
self.addEventListener('notificationclick', (event) => {
  const notification = event.notification;
  const action = event.action;
  const notificationData = notification.data || {};
  
  notification.close();
  
  if (action === 'close') {
    return;
  }
  
  // Standard handling er å åpne appen på riktig side
  event.waitUntil(
    clients.matchAll({ type: 'window' })
      .then(clientList => {
        // Finn eksisterende vindu og fokuser
        for (const client of clientList) {
          if (client.url === notificationData.url && 'focus' in client) {
            return client.focus();
          }
        }
        
        // Åpne nytt vindu hvis ingenting er åpent
        if (clients.openWindow) {
          return clients.openWindow(notificationData.url || '/');
        }
      })
  );
});

// Håndter meldinger fra klienten
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  if (event.data && event.data.type === 'CACHE_URLS') {
    event.waitUntil(
      caches.open(CACHE_NAME).then(cache => {
        return cache.addAll(event.data.urls || []);
      })
    );
  }
});
