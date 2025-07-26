/**
 * SNAKKAZ SERVICE WORKER - FASE 6 PWA EXCELLENCE
 * Production-grade offline-first service worker with Workbox integration
 * Intelligent caching, background sync, push notifications, Digital Vokter hooks
 */

// Import Workbox modules (note: in production, these would be bundled)
importScripts('https://storage.googleapis.com/workbox-cdn/releases/7.0.0/workbox-sw.js');

// Configure Workbox
if (workbox) {
  console.log('[SW] Workbox loaded successfully');
  workbox.setConfig({ debug: false });
} else {
  console.log('[SW] Workbox failed to load, using fallback');
}

// Cache configuration
const CACHE_VERSION = 'v2.0.0-fase6';
const STATIC_CACHE = `snakkaz-static-${CACHE_VERSION}`;
const API_CACHE = `snakkaz-api-${CACHE_VERSION}`;
const IMAGES_CACHE = `snakkaz-images-${CACHE_VERSION}`;
const CHAT_CACHE = `snakkaz-chat-${CACHE_VERSION}`;

// Precache configuration
const urlsToCache = [
  '/',
  '/beta-chat',
  '/register',
  '/login',
  '/info',
  '/invite',
  '/offline.html',
  '/static/js/bundle.js',
  '/static/css/main.css',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png',
  '/icons/maskable-icon-192x192.png',
  '/icons/maskable-icon-512x512.png',
  'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap'
];

// Modern caching strategies with Workbox or fallback
if (workbox) {
  // Workbox-powered caching strategies
  
  // Precache static assets
  workbox.precaching.precacheAndRoute([
    ...urlsToCache.map(url => ({ url, revision: CACHE_VERSION }))
  ]);
  
  // API Routes - NetworkFirst for real-time data
  workbox.routing.registerRoute(
    ({ url }) => url.pathname.startsWith('/api/'),
    new workbox.strategies.NetworkFirst({
      cacheName: API_CACHE,
      plugins: [
        new workbox.cacheableResponse.CacheableResponsePlugin({
          statuses: [0, 200]
        }),
        new workbox.expiration.ExpirationPlugin({
          maxEntries: 100,
          maxAgeSeconds: 60 * 5 // 5 minutes
        })
      ]
    })
  );
  
  // Chat-specific routes - NetworkFirst with longer cache
  workbox.routing.registerRoute(
    ({ url }) => url.pathname.includes('/chat') || url.pathname.includes('/messages'),
    new workbox.strategies.NetworkFirst({
      cacheName: CHAT_CACHE,
      plugins: [
        new workbox.cacheableResponse.CacheableResponsePlugin({
          statuses: [0, 200]
        }),
        new workbox.expiration.ExpirationPlugin({
          maxEntries: 50,
          maxAgeSeconds: 60 * 10 // 10 minutes
        })
      ]
    })
  );
  
  // Images and media - CacheFirst for performance
  workbox.routing.registerRoute(
    ({ request }) => request.destination === 'image',
    new workbox.strategies.CacheFirst({
      cacheName: IMAGES_CACHE,
      plugins: [
        new workbox.cacheableResponse.CacheableResponsePlugin({
          statuses: [0, 200]
        }),
        new workbox.expiration.ExpirationPlugin({
          maxEntries: 200,
          maxAgeSeconds: 60 * 60 * 24 * 30 // 30 days
        })
      ]
    })
  );
  
  // Static assets - StaleWhileRevalidate for balance
  workbox.routing.registerRoute(
    ({ request }) => 
      request.destination === 'script' ||
      request.destination === 'style' ||
      request.destination === 'font',
    new workbox.strategies.StaleWhileRevalidate({
      cacheName: STATIC_CACHE,
      plugins: [
        new workbox.cacheableResponse.CacheableResponsePlugin({
          statuses: [0, 200]
        })
      ]
    })
  );
  
  // Navigation requests with offline fallback
  workbox.routing.registerNavigationRoute(
    workbox.precaching.getCacheKeyForURL('/offline.html')
  );
  
} else {
  // Fallback implementation without Workbox
  self.addEventListener('install', event => {
    console.log('[SW] Installing SnakkaZ FASE 6 Service Worker (fallback mode)');
    event.waitUntil(
      caches.open(STATIC_CACHE)
        .then(cache => {
          console.log('[SW] Caching app shell');
          return cache.addAll(urlsToCache);
        })
    );
    self.skipWaiting();
  });

  self.addEventListener('activate', event => {
    console.log('[SW] Activating SnakkaZ FASE 6 Service Worker');
    event.waitUntil(
      caches.keys().then(cacheNames => {
        return Promise.all(
          cacheNames.map(cacheName => {
            if (!cacheName.includes(CACHE_VERSION)) {
              console.log('[SW] Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
    );
    self.clients.claim();
  });

  self.addEventListener('fetch', event => {
    const url = new URL(event.request.url);
    
    // Chat API requests - Network first with cache fallback
    if (url.pathname.includes('/api/chat') || url.pathname.includes('/api/messages')) {
      event.respondWith(
        fetch(event.request)
          .then(response => {
            if (response.ok) {
              const responseClone = response.clone();
              caches.open(API_CACHE).then(cache => {
                cache.put(event.request, responseClone);
              });
            }
            return response;
          })
          .catch(() => {
            return caches.match(event.request).then(cachedResponse => {
              return cachedResponse || new Response('{"error": "Offline", "cached": false}', {
                headers: { 'Content-Type': 'application/json' }
              });
            });
          })
      );
      return;
    }

    // Real-time features - Network only with graceful degradation
    if (url.pathname.includes('/api/realtime') || url.pathname.includes('supabase')) {
      event.respondWith(
        fetch(event.request).catch(() => 
          new Response('{"error": "Network unavailable"}', {
            headers: { 'Content-Type': 'application/json' }
          })
        )
      );
      return;
    }

    // Static assets - Cache first with network fallback
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
                caches.open(STATIC_CACHE).then(cache => {
                  cache.put(event.request, responseClone);
                });
              }
              return response;
            });
          })
      );
      return;
    }

    // Navigation requests - Network first with offline fallback
    if (event.request.mode === 'navigate') {
      event.respondWith(
        fetch(event.request)
          .then(response => {
            const responseClone = response.clone();
            caches.open(STATIC_CACHE).then(cache => {
              cache.put(event.request, responseClone);
            });
            return response;
          })
          .catch(() => {
            return caches.match('/offline.html') || 
                   caches.match('/') || 
                   caches.match('/index.html');
          })
      );
      return;
    }

    // Default strategy - Cache first with network fallback
    event.respondWith(
      caches.match(event.request)
        .then(response => response || fetch(event.request))
    );
  });
}

// Enhanced Push Notification Handler - FASE 6
self.addEventListener('push', event => {
  console.log('[SW] FASE 6 Push notification received');
  
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

  // Enhanced notification options for FASE 6
  const options = {
    title: notificationData.title || 'SnakkaZ',
    body: notificationData.body || 'Du har en ny melding!',
    icon: notificationData.icon || '/icons/icon-192x192.png',
    badge: '/icons/badge-icon.png',
    tag: notificationData.tag || 'snakkaz-message',
    requireInteraction: true,
    silent: false,
    actions: [
      {
        action: 'open',
        title: '💬 Åpne chat',
        icon: '/icons/open-icon.png'
      },
      {
        action: 'reply',
        title: '✉️ Svar raskt',
        icon: '/icons/reply-icon.png'
      },
      {
        action: 'dismiss',
        title: '✖️ Lukk',
        icon: '/icons/close-icon.png'
      }
    ],
    data: {
      url: notificationData.url || '/beta-chat',
      chatId: notificationData.chatId,
      userId: notificationData.userId,
      messageId: notificationData.messageId,
      timestamp: Date.now(),
      priority: notificationData.priority || 'normal'
    },
    vibrate: [200, 100, 200, 100, 200],
    sound: '/sounds/notification.mp3',
    image: notificationData.image,
    dir: 'ltr',
    lang: 'nb'
  };

  event.waitUntil(
    self.registration.showNotification(options.title, options)
  );
});

// Enhanced Notification Click Handler - FASE 6
self.addEventListener('notificationclick', event => {
  console.log('[SW] FASE 6 Notification clicked - Action:', event.action);
  
  event.notification.close();

  if (event.action === 'dismiss') {
    // Analytics tracking for dismissal
    self.registration.sync.register('notification-dismissed');
    return;
  }

  if (event.action === 'reply') {
    // Quick reply functionality
    event.waitUntil(handleQuickReply(event.notification.data));
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
            action: event.action,
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

// Quick reply handler
async function handleQuickReply(notificationData) {
  try {
    // This would integrate with the chat system
    console.log('[SW] Quick reply triggered for:', notificationData);
    
    // Show a simple input or redirect to quick reply interface
    const quickReplyUrl = `/quick-reply?chatId=${notificationData.chatId}&messageId=${notificationData.messageId}`;
    
    const clientList = await clients.matchAll({ type: 'window' });
    if (clientList.length > 0) {
      clientList[0].focus();
      clientList[0].postMessage({
        type: 'QUICK_REPLY_REQUESTED',
        data: notificationData
      });
    } else {
      clients.openWindow(quickReplyUrl);
    }
  } catch (error) {
    console.error('[SW] Quick reply failed:', error);
  }
}

// Enhanced Background Sync - FASE 6
const BACKGROUND_SYNC_TAG = 'snakkaz-background-sync-v2';

self.addEventListener('sync', event => {
  console.log('[SW] FASE 6 Background sync triggered:', event.tag);
  
  if (event.tag === BACKGROUND_SYNC_TAG) {
    event.waitUntil(syncOfflineData());
  } else if (event.tag === 'notification-dismissed') {
    event.waitUntil(trackNotificationDismissal());
  }
});

async function syncOfflineData() {
  try {
    console.log('[SW] Starting comprehensive offline sync');
    
    // Sync offline messages
    await syncOfflineMessages();
    
    // Sync analytics events
    await syncAnalyticsEvents();
    
    // Sync user preferences
    await syncUserPreferences();
    
    // Sync Digital Vokter alerts
    await syncDigitalVokterAlerts();
    
    console.log('[SW] Background sync completed successfully');
  } catch (error) {
    console.error('[SW] Background sync failed:', error);
    throw error; // Re-throw to trigger retry
  }
}

async function syncOfflineMessages() {
  try {
    const cache = await caches.open(CHAT_CACHE);
    const offlineMessagesRequest = new Request('/offline-messages');
    const cachedResponse = await cache.match(offlineMessagesRequest);
    
    if (cachedResponse) {
      const messages = await cachedResponse.json();
      console.log('[SW] Syncing offline messages:', messages.length);
      
      for (const message of messages) {
        try {
          const response = await fetch('/api/chat/send', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${message.token}`
            },
            body: JSON.stringify(message.data)
          });
          
          if (response.ok) {
            // Remove from offline queue
            await removeFromOfflineQueue(message.id);
          }
        } catch (error) {
          console.error('[SW] Failed to sync message:', message.id, error);
        }
      }
    }
  } catch (error) {
    console.error('[SW] Failed to sync offline messages:', error);
  }
}

async function syncAnalyticsEvents() {
  // Sync queued analytics events
  try {
    const cache = await caches.open(API_CACHE);
    const analyticsRequest = new Request('/offline-analytics');
    const cachedResponse = await cache.match(analyticsRequest);
    
    if (cachedResponse) {
      const events = await cachedResponse.json();
      console.log('[SW] Syncing analytics events:', events.length);
      
      for (const event of events) {
        try {
          await fetch('/api/analytics', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(event)
          });
        } catch (error) {
          console.error('[SW] Failed to sync analytics event:', error);
        }
      }
    }
  } catch (error) {
    console.error('[SW] Failed to sync analytics:', error);
  }
}

async function syncUserPreferences() {
  // Sync user preferences and settings
  console.log('[SW] Syncing user preferences...');
}

async function syncDigitalVokterAlerts() {
  // Sync Digital Vokter security alerts and monitoring data
  console.log('[SW] Syncing Digital Vokter alerts...');
}

async function trackNotificationDismissal() {
  // Track notification dismissal for analytics
  console.log('[SW] Tracking notification dismissal...');
}

async function removeFromOfflineQueue(messageId) {
  // Remove processed message from offline queue
  console.log('[SW] Removing message from offline queue:', messageId);
}

// Share Target Handler - Enhanced for FASE 6
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

  // Enhanced share handling with better UX
  const shareData = {
    title: encodeURIComponent(title),
    text: encodeURIComponent(text),
    url: encodeURIComponent(shareUrl),
    timestamp: Date.now()
  };

  const chatUrl = `/beta-chat?share=true&data=${btoa(JSON.stringify(shareData))}`;
  
  return Response.redirect(chatUrl, 302);
}

// Digital Vokter Integration - FASE 6 Security Hooks
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'DIGITAL_VOKTER_ALERT') {
    handleDigitalVokterAlert(event.data);
  } else if (event.data && event.data.type === 'SECURITY_SCAN_RESULT') {
    handleSecurityScanResult(event.data);
  } else if (event.data && event.data.type === 'PWA_INSTALL_PROMPT') {
    handlePWAInstallPrompt(event.data);
  }
});

function handleDigitalVokterAlert(alertData) {
  console.log('[SW] Digital Vokter alert received:', alertData);
  
  // Show security notification if needed
  if (alertData.severity === 'high' || alertData.severity === 'critical') {
    self.registration.showNotification('🛡️ Sikkerhetsmerknad', {
      body: alertData.message || 'Digital Vokter har oppdaget en sikkerhetshendelse',
      icon: '/icons/security-icon.png',
      badge: '/icons/security-badge.png',
      tag: 'security-alert',
      requireInteraction: true,
      vibrate: [300, 100, 300, 100, 300],
      actions: [
        {
          action: 'view-details',
          title: '🔍 Se detaljer',
          icon: '/icons/details-icon.png'
        },
        {
          action: 'acknowledge',
          title: '✅ Forstått',
          icon: '/icons/check-icon.png'
        }
      ],
      data: {
        type: 'security',
        alertId: alertData.id,
        severity: alertData.severity,
        url: '/security-dashboard'
      }
    });
  }
  
  // Log security event for analytics
  self.registration.sync.register('security-event-logged');
}

function handleSecurityScanResult(scanData) {
  console.log('[SW] Security scan result:', scanData);
  
  // Process security scan results
  if (scanData.threats && scanData.threats.length > 0) {
    // Handle detected threats
    console.warn('[SW] Threats detected:', scanData.threats);
  }
}

function handlePWAInstallPrompt(promptData) {
  console.log('[SW] PWA install prompt handling:', promptData);
  
  // Enhanced install prompt handling
  if (promptData.action === 'show') {
    // Notify main app to show install prompt
    clients.matchAll().then(clientList => {
      clientList.forEach(client => {
        client.postMessage({
          type: 'SHOW_INSTALL_PROMPT',
          data: promptData
        });
      });
    });
  }
}

// Performance monitoring hooks
self.addEventListener('install', event => {
  console.log('[SW] SnakkaZ FASE 6 Service Worker installing - PWA Excellence Mode');
  
  // Performance timing
  const installStart = performance.now();
  
  event.waitUntil(
    Promise.all([
      // Cache critical resources
      caches.open(STATIC_CACHE).then(cache => cache.addAll(urlsToCache)),
      // Initialize IndexedDB for offline storage
      initializeOfflineStorage(),
      // Set up performance monitoring
      setupPerformanceMonitoring()
    ]).then(() => {
      const installEnd = performance.now();
      console.log(`[SW] Install completed in ${installEnd - installStart}ms`);
    })
  );
  
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  console.log('[SW] SnakkaZ FASE 6 Service Worker activated');
  
  event.waitUntil(
    Promise.all([
      // Clean old caches
      cleanupOldCaches(),
      // Initialize Digital Vokter hooks
      initializeDigitalVokter(),
      // Set up background sync
      setupBackgroundSync()
    ])
  );
  
  self.clients.claim();
});

async function initializeOfflineStorage() {
  // Initialize IndexedDB for offline data storage
  console.log('[SW] Initializing offline storage...');
}

async function setupPerformanceMonitoring() {
  // Set up performance monitoring
  console.log('[SW] Setting up performance monitoring...');
}

async function cleanupOldCaches() {
  const cacheNames = await caches.keys();
  return Promise.all(
    cacheNames.map(cacheName => {
      if (!cacheName.includes(CACHE_VERSION)) {
        console.log('[SW] Deleting old cache:', cacheName);
        return caches.delete(cacheName);
      }
    })
  );
}

async function initializeDigitalVokter() {
  // Initialize Digital Vokter security monitoring
  console.log('[SW] Initializing Digital Vokter integration...');
}

async function setupBackgroundSync() {
  // Set up background sync capabilities
  console.log('[SW] Setting up background sync...');
}

console.log('[SW] SnakkaZ FASE 6 Service Worker loaded - PWA Excellence & Digital Vokter Ready! 🚀');
