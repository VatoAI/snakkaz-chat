/**
 * SnakkaZ Mobile Service Worker
 * Background sync, caching, push notifications
 */

const CACHE_NAME = 'snakkaz-mobile-v1';
const STATIC_CACHE = 'snakkaz-static-v1';
const DYNAMIC_CACHE = 'snakkaz-dynamic-v1';

// Critical files to cache for offline operation
const STATIC_FILES = [
    '/',
    '/index.html',
    '/static/css/main.css',
    '/static/js/main.js',
    '/src/performance/SnakkazMobileEngine.js',
    '/src/performance/SnakkazUltimateSpeedEngine.js',
    '/src/analytics/SnakkazAnalytics.js',
    '/src/security/SnakkazSecurity.js',
    '/manifest.json'
];

// Install service worker
self.addEventListener('install', event => {
    console.log('📱 SW: Installing SnakkaZ Mobile Service Worker...');
    
    event.waitUntil(
        caches.open(STATIC_CACHE)
            .then(cache => {
                console.log('📱 SW: Caching static files');
                return cache.addAll(STATIC_FILES);
            })
            .then(() => {
                console.log('📱 SW: Installation complete');
                return self.skipWaiting();
            })
    );
});

// Activate service worker
self.addEventListener('activate', event => {
    console.log('📱 SW: Activating SnakkaZ Mobile Service Worker...');
    
    event.waitUntil(
        caches.keys()
            .then(cacheNames => {
                return Promise.all(
                    cacheNames.map(cacheName => {
                        if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
                            console.log('📱 SW: Deleting old cache:', cacheName);
                            return caches.delete(cacheName);
                        }
                    })
                );
            })
            .then(() => {
                console.log('📱 SW: Activation complete');
                return self.clients.claim();
            })
    );
});

// Fetch with cache-first strategy for static files, network-first for API
self.addEventListener('fetch', event => {
    const request = event.request;
    const url = new URL(request.url);
    
    // Skip non-GET requests
    if (request.method !== 'GET') {
        return;
    }
    
    // Handle API requests (network-first with background sync)
    if (url.pathname.includes('/api/') || url.hostname.includes('supabase')) {
        event.respondWith(
            fetch(request)
                .then(response => {
                    // Cache successful API responses
                    if (response.ok) {
                        const responseClone = response.clone();
                        caches.open(DYNAMIC_CACHE)
                            .then(cache => cache.put(request, responseClone));
                    }
                    return response;
                })
                .catch(() => {
                    // Return cached response if network fails
                    return caches.match(request)
                        .then(cachedResponse => {
                            if (cachedResponse) {
                                console.log('📱 SW: Serving cached API response');
                                return cachedResponse;
                            }
                            // Return offline fallback
                            return new Response(JSON.stringify({
                                error: 'Offline - data not available',
                                offline: true,
                                timestamp: Date.now()
                            }), {
                                headers: { 'Content-Type': 'application/json' }
                            });
                        });
                })
        );
        return;
    }
    
    // Handle static files (cache-first)
    event.respondWith(
        caches.match(request)
            .then(cachedResponse => {
                if (cachedResponse) {
                    console.log('📱 SW: Serving cached static file');
                    return cachedResponse;
                }
                
                // Fetch and cache new files
                return fetch(request)
                    .then(response => {
                        if (response.ok) {
                            const responseClone = response.clone();
                            caches.open(DYNAMIC_CACHE)
                                .then(cache => cache.put(request, responseClone));
                        }
                        return response;
                    })
                    .catch(() => {
                        // Return offline fallback for HTML requests
                        if (request.headers.get('accept').includes('text/html')) {
                            return new Response(`
                                <!DOCTYPE html>
                                <html>
                                <head>
                                    <title>SnakkaZ - Offline</title>
                                    <meta charset="utf-8">
                                    <meta name="viewport" content="width=device-width, initial-scale=1">
                                    <style>
                                        body {
                                            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif;
                                            display: flex;
                                            align-items: center;
                                            justify-content: center;
                                            min-height: 100vh;
                                            margin: 0;
                                            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                                            color: white;
                                            text-align: center;
                                        }
                                        .offline-container {
                                            padding: 2rem;
                                            background: rgba(255, 255, 255, 0.1);
                                            border-radius: 1rem;
                                            backdrop-filter: blur(10px);
                                        }
                                        h1 { margin: 0 0 1rem 0; font-size: 2rem; }
                                        p { margin: 0; opacity: 0.8; }
                                        .icon { font-size: 3rem; margin-bottom: 1rem; }
                                    </style>
                                </head>
                                <body>
                                    <div class="offline-container">
                                        <div class="icon">📱</div>
                                        <h1>SnakkaZ</h1>
                                        <p>You're offline, but SnakkaZ still works!</p>
                                        <p>Your messages will sync when you're back online.</p>
                                    </div>
                                </body>
                                </html>
                            `, {
                                headers: { 'Content-Type': 'text/html' }
                            });
                        }
                        
                        return new Response('Offline', { status: 503 });
                    });
            })
    );
});

// Background sync for pending messages
self.addEventListener('sync', event => {
    console.log('📱 SW: Background sync triggered:', event.tag);
    
    if (event.tag === 'snakkaz-background-sync') {
        event.waitUntil(doBackgroundSync());
    }
});

async function doBackgroundSync() {
    try {
        console.log('📱 SW: Performing background sync...');
        
        // Get pending messages from IndexedDB or localStorage
        const pendingMessages = await getPendingMessages();
        
        if (pendingMessages.length === 0) {
            console.log('📱 SW: No pending messages to sync');
            return;
        }
        
        console.log(`📱 SW: Syncing ${pendingMessages.length} pending messages`);
        
        // Send pending messages
        for (const message of pendingMessages) {
            try {
                await sendMessage(message);
                console.log('📱 SW: Message synced:', message.id);
                
                // Remove from pending list
                await removePendingMessage(message.id);
                
                // Notify main app
                await notifyMainApp('message-synced', message);
                
            } catch (error) {
                console.error('📱 SW: Failed to sync message:', error);
                // Keep in pending list for next sync
            }
        }
        
        console.log('📱 SW: Background sync completed');
        
    } catch (error) {
        console.error('📱 SW: Background sync failed:', error);
    }
}

async function getPendingMessages() {
    try {
        // Try IndexedDB first
        if ('indexedDB' in self) {
            return await getFromIndexedDB('pendingMessages');
        }
        
        // Fallback to localStorage simulation
        return JSON.parse(await getFromCache('snakkaz-pending-messages') || '[]');
    } catch (error) {
        console.error('📱 SW: Failed to get pending messages:', error);
        return [];
    }
}

async function sendMessage(message) {
    const supabaseUrl = 'https://wqpoozpbceucynsojmbk.supabase.co';
    const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndxcG9venBiY2V1Y3luc29qbWJrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzk1NjgzMDUsImV4cCI6MjA1NTE0NDMwNX0.vu1s86gQKEPXFleOZ1U2uOjW-kj4k4RAiKTbOuXPUD8';
    
    const response = await fetch(`${supabaseUrl}/rest/v1/messages`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${supabaseKey}`,
            'apikey': supabaseKey,
            'Prefer': 'return=minimal'
        },
        body: JSON.stringify(message)
    });
    
    if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    return response;
}

async function removePendingMessage(messageId) {
    try {
        // Try IndexedDB first
        if ('indexedDB' in self) {
            await removeFromIndexedDB('pendingMessages', messageId);
        }
        
        // Update cache
        const pending = await getPendingMessages();
        const updated = pending.filter(msg => msg.id !== messageId);
        await saveToCache('snakkaz-pending-messages', JSON.stringify(updated));
        
    } catch (error) {
        console.error('📱 SW: Failed to remove pending message:', error);
    }
}

async function notifyMainApp(type, data) {
    try {
        const clients = await self.clients.matchAll();
        
        clients.forEach(client => {
            client.postMessage({
                type,
                data,
                timestamp: Date.now()
            });
        });
        
    } catch (error) {
        console.error('📱 SW: Failed to notify main app:', error);
    }
}

// IndexedDB helpers
async function getFromIndexedDB(storeName) {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open('SnakkazDB', 1);
        
        request.onerror = () => reject(request.error);
        
        request.onsuccess = () => {
            const db = request.result;
            const transaction = db.transaction([storeName], 'readonly');
            const store = transaction.objectStore(storeName);
            const getRequest = store.getAll();
            
            getRequest.onsuccess = () => resolve(getRequest.result || []);
            getRequest.onerror = () => reject(getRequest.error);
        };
        
        request.onupgradeneeded = () => {
            const db = request.result;
            if (!db.objectStoreNames.contains(storeName)) {
                db.createObjectStore(storeName, { keyPath: 'id' });
            }
        };
    });
}

async function removeFromIndexedDB(storeName, id) {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open('SnakkazDB', 1);
        
        request.onerror = () => reject(request.error);
        
        request.onsuccess = () => {
            const db = request.result;
            const transaction = db.transaction([storeName], 'readwrite');
            const store = transaction.objectStore(storeName);
            const deleteRequest = store.delete(id);
            
            deleteRequest.onsuccess = () => resolve();
            deleteRequest.onerror = () => reject(deleteRequest.error);
        };
    });
}

// Cache helpers
async function getFromCache(key) {
    try {
        const cache = await caches.open(DYNAMIC_CACHE);
        const response = await cache.match(`/cache/${key}`);
        
        if (response) {
            return await response.text();
        }
        
        return null;
    } catch (error) {
        console.error('📱 SW: Failed to get from cache:', error);
        return null;
    }
}

async function saveToCache(key, value) {
    try {
        const cache = await caches.open(DYNAMIC_CACHE);
        await cache.put(`/cache/${key}`, new Response(value));
    } catch (error) {
        console.error('📱 SW: Failed to save to cache:', error);
    }
}

// Push notification handling
self.addEventListener('push', event => {
    console.log('📱 SW: Push notification received');
    
    if (!event.data) {
        return;
    }
    
    try {
        const data = event.data.json();
        
        const options = {
            body: data.message || 'New message received',
            icon: '/icons/icon-192x192.png',
            badge: '/icons/badge-72x72.png',
            tag: 'snakkaz-message',
            requireInteraction: false,
            actions: [
                {
                    action: 'reply',
                    title: 'Reply',
                    icon: '/icons/reply.png'
                },
                {
                    action: 'view',
                    title: 'View',
                    icon: '/icons/view.png'
                }
            ],
            data: {
                roomId: data.room_id,
                messageId: data.message_id,
                userId: data.user_id
            }
        };
        
        event.waitUntil(
            self.registration.showNotification(data.title || 'SnakkaZ', options)
        );
        
    } catch (error) {
        console.error('📱 SW: Failed to show notification:', error);
    }
});

// Notification click handling
self.addEventListener('notificationclick', event => {
    console.log('📱 SW: Notification clicked:', event.action);
    
    event.notification.close();
    
    const data = event.notification.data;
    
    if (event.action === 'reply') {
        // Open quick reply
        event.waitUntil(
            clients.openWindow(`/chat/${data.roomId}?action=reply&messageId=${data.messageId}`)
        );
    } else {
        // Open chat room
        event.waitUntil(
            clients.openWindow(`/chat/${data.roomId}`)
        );
    }
});

// Message handling from main app
self.addEventListener('message', event => {
    const { type, data } = event.data;
    
    switch(type) {
        case 'CACHE_PENDING_MESSAGE':
            cachePendingMessage(data);
            break;
            
        case 'CLEAR_PENDING_MESSAGES':
            clearPendingMessages();
            break;
            
        case 'REQUEST_SYNC':
            self.registration.sync.register('snakkaz-background-sync');
            break;
            
        case 'UPDATE_CACHE':
            updateCache(data);
            break;
    }
});

async function cachePendingMessage(message) {
    try {
        const pending = await getPendingMessages();
        pending.push(message);
        await saveToCache('snakkaz-pending-messages', JSON.stringify(pending));
        
        console.log('📱 SW: Cached pending message:', message.id);
    } catch (error) {
        console.error('📱 SW: Failed to cache pending message:', error);
    }
}

async function clearPendingMessages() {
    try {
        await saveToCache('snakkaz-pending-messages', '[]');
        console.log('📱 SW: Cleared pending messages');
    } catch (error) {
        console.error('📱 SW: Failed to clear pending messages:', error);
    }
}

async function updateCache(data) {
    try {
        const cache = await caches.open(DYNAMIC_CACHE);
        await cache.put(data.url, new Response(data.content));
        console.log('📱 SW: Updated cache:', data.url);
    } catch (error) {
        console.error('📱 SW: Failed to update cache:', error);
    }
}

console.log('📱 SW: SnakkaZ Mobile Service Worker loaded');
console.log('💪 SW: Background sync, offline support, and push notifications ready!');
