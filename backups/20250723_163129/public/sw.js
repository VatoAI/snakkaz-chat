// Service Worker for SnakkaZ Beta - Optimal Mobile Performance
const CACHE_NAME = 'snakkaz-beta-v1.0.0';
const urlsToCache = [
  '/',
  '/beta-chat',
  '/register',
  '/login',
  '/info',
  '/invite',
  '/static/js/bundle.js',
  '/static/css/main.css',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png',
  'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap'
];

// Install Event - Cache Resources
self.addEventListener('install', event => {
  console.log('[SW] Installing SnakkaZ Beta Service Worker');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('[SW] Caching app shell');
        return cache.addAll(urlsToCache);
      })
  );
  self.skipWaiting();
});

// Activate Event - Clean Old Caches
self.addEventListener('activate', event => {
  console.log('[SW] Activating SnakkaZ Beta Service Worker');
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('[SW] Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch Event - Network First Strategy for Chat, Cache First for Assets
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);
  
  // Chat API requests - Always fresh
  if (url.pathname.includes('/api/chat') || url.pathname.includes('/api/messages')) {
    event.respondWith(
      fetch(event.request)
        .catch(() => new Response('{"error": "Offline"}', {
          headers: { 'Content-Type': 'application/json' }
        }))
    );
    return;
  }

  // Real-time features - Network only
  if (url.pathname.includes('/api/realtime') || url.pathname.includes('supabase')) {
    event.respondWith(fetch(event.request));
    return;
  }

  // Static assets - Cache first
  if (event.request.destination === 'image' || 
      event.request.destination === 'style' || 
      event.request.destination === 'script' ||
      event.request.destination === 'font') {
    event.respondWith(
      caches.match(event.request)
        .then(response => {
          if (response) {
            return response;
          }
          return fetch(event.request).then(response => {
            if (response.status === 200) {
              const responseClone = response.clone();
              caches.open(CACHE_NAME).then(cache => {
                cache.put(event.request, responseClone);
              });
            }
            return response;
          });
        })
    );
    return;
  }

  // Navigation requests - Network first with cache fallback
  if (event.request.mode === 'navigate') {
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
          return caches.match('/') || caches.match('/index.html');
        })
    );
    return;
  }

  // Default strategy - Cache first
  event.respondWith(
    caches.match(event.request)
      .then(response => response || fetch(event.request))
  );
});

// Push Notification Handler
self.addEventListener('push', event => {
  console.log('[SW] Push notification received');
  
  let notificationData = {};
  
  try {
    notificationData = event.data ? event.data.json() : {};
  } catch (e) {
    console.log('[SW] Push event data is not JSON');
    notificationData = {
      title: 'SnakkaZ',
      body: 'Du har en ny melding!',
      icon: '/icons/icon-192x192.png'
    };
  }

  const options = {
    title: notificationData.title || 'SnakkaZ',
    body: notificationData.body || 'Du har en ny melding!',
    icon: notificationData.icon || '/icons/icon-192x192.png',
    badge: '/icons/badge-icon.png',
    tag: notificationData.tag || 'snakkaz-message',
    requireInteraction: true,
    actions: [
      {
        action: 'open',
        title: 'Åpne chat',
        icon: '/icons/open-icon.png'
      },
      {
        action: 'dismiss',
        title: 'Lukk',
        icon: '/icons/close-icon.png'
      }
    ],
    data: {
      url: notificationData.url || '/beta-chat',
      chatId: notificationData.chatId,
      userId: notificationData.userId
    },
    vibrate: [200, 100, 200],
    sound: '/sounds/notification.mp3'
  };

  event.waitUntil(
    self.registration.showNotification(options.title, options)
  );
});

// Notification Click Handler
self.addEventListener('notificationclick', event => {
  console.log('[SW] Notification clicked');
  
  event.notification.close();

  if (event.action === 'dismiss') {
    return;
  }

  const urlToOpen = event.notification.data?.url || '/beta-chat';

  event.waitUntil(
    clients.matchAll({ type: 'window' }).then(clientList => {
      // Check if app is already open
      for (const client of clientList) {
        if (client.url.includes('snakkaz') && 'focus' in client) {
          client.focus();
          client.postMessage({
            type: 'NOTIFICATION_CLICKED',
            url: urlToOpen,
            data: event.notification.data
          });
          return;
        }
      }
      
      // Open new window if app not open
      if (clients.openWindow) {
        return clients.openWindow(urlToOpen);
      }
    })
  );
});

// Background Sync for Offline Messages
self.addEventListener('sync', event => {
  if (event.tag === 'background-sync-messages') {
    console.log('[SW] Background sync triggered');
    event.waitUntil(syncOfflineMessages());
  }
});

async function syncOfflineMessages() {
  // Implementation for syncing offline messages when connection is restored
  try {
    const cache = await caches.open(CACHE_NAME);
    const offlineMessages = await cache.match('/offline-messages');
    
    if (offlineMessages) {
      const messages = await offlineMessages.json();
      // Send messages to server
      console.log('[SW] Syncing offline messages:', messages.length);
    }
  } catch (error) {
    console.error('[SW] Failed to sync offline messages:', error);
  }
}

// Share Target Handler
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);
  
  if (url.pathname === '/share' && event.request.method === 'GET') {
    event.respondWith(handleShareTarget(event.request));
  }
});

async function handleShareTarget(request) {
  const url = new URL(request.url);
  const title = url.searchParams.get('title') || '';
  const text = url.searchParams.get('text') || '';
  const shareUrl = url.searchParams.get('url') || '';

  // Redirect to chat with shared content
  const chatUrl = `/beta-chat?share=true&title=${encodeURIComponent(title)}&text=${encodeURIComponent(text)}&url=${encodeURIComponent(shareUrl)}`;
  
  return Response.redirect(chatUrl, 302);
}

console.log('[SW] SnakkaZ Beta Service Worker loaded successfully');
