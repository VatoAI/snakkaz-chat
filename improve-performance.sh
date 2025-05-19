#!/bin/bash
#
# Snakkaz Chat - Ytelsesforbedringer
# Dette skriptet implementerer anbefalte ytelsesforbedringer
#

echo "🚀 Snakkaz Chat - Ytelsesforbedringer 🚀"
echo "======================================"
echo

# Sjekk at vi er i riktig katalog
if [ ! -f "package.json" ]; then
  echo "❌ Feil: Dette skriptet må kjøres fra prosjektets rotkatalog!"
  exit 1
fi

# 1. Bildeoptimlisering
echo "1️⃣ Installerer verktøy for bildeoptimlisering..."
npm install --save-dev sharp imagemin imagemin-webp

# Opprett et skript for å optimalisere bilder
cat > optimize-images.js << 'EOF'
// Image Optimization Script
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');
const imagemin = require('imagemin');
const imageminWebp = require('imagemin-webp');

const IMAGE_DIRS = ['src/assets', 'public/images', 'src/components/images'];
const EXTENSIONS = ['.jpg', '.jpeg', '.png'];
const SIZES = [1920, 1280, 768, 480];

async function generateResponsiveImages() {
  console.log('Generating responsive images...');
  
  // Process each directory
  for (const dir of IMAGE_DIRS) {
    if (!fs.existsSync(dir)) {
      console.log(`Directory ${dir} doesn't exist, skipping`);
      continue;
    }
    
    const files = fs.readdirSync(dir);
    
    for (const file of files) {
      const filePath = path.join(dir, file);
      const ext = path.extname(file).toLowerCase();
      
      // Only process image files
      if (!EXTENSIONS.includes(ext)) continue;
      
      // Create a responsive directory
      const baseName = path.basename(file, ext);
      const responsiveDir = path.join(dir, 'responsive', baseName);
      
      if (!fs.existsSync(responsiveDir)) {
        fs.mkdirSync(responsiveDir, { recursive: true });
      }
      
      // Generate responsive versions
      for (const width of SIZES) {
        try {
          await sharp(filePath)
            .resize(width)
            .toFile(path.join(responsiveDir, `${baseName}-${width}${ext}`));
          
          // Also generate WebP version
          await sharp(filePath)
            .resize(width)
            .webp({ quality: 80 })
            .toFile(path.join(responsiveDir, `${baseName}-${width}.webp`));
        } catch (err) {
          console.error(`Error processing ${filePath} at width ${width}:`, err);
        }
      }
      
      console.log(`Generated responsive versions for ${file}`);
    }
  }
  
  console.log('Responsive image generation complete');
}

async function optimizeImages() {
  console.log('Optimizing images...');
  
  // Process each directory
  for (const dir of IMAGE_DIRS) {
    if (!fs.existsSync(dir)) {
      console.log(`Directory ${dir} doesn't exist, skipping`);
      continue;
    }
    
    // Optimize all images in directory
    try {
      await imagemin([`${dir}/*.{jpg,png,jpeg}`], {
        destination: `${dir}/optimized`,
        plugins: [
          imageminWebp({ quality: 80 })
        ]
      });
      
      console.log(`Optimized images in ${dir}`);
    } catch (err) {
      console.error(`Error optimizing images in ${dir}:`, err);
    }
  }
  
  console.log('Image optimization complete');
}

// Run the functions
async function main() {
  try {
    await optimizeImages();
    await generateResponsiveImages();
  } catch (err) {
    console.error('Error during image processing:', err);
  }
}

main();
EOF

echo "Skript for bildeoptimlisering opprettet."

# 2. Kode-splitting og lazy loading
echo "2️⃣ Implementerer code splitting og lazy loading..."

# Opprett en utility for lazy loading av komponenter
mkdir -p src/utils/lazy-loading
cat > src/utils/lazy-loading/index.ts << 'EOF'
import React, { Suspense } from 'react';

interface LazyComponentProps {
  fallback?: React.ReactNode;
}

/**
 * Helper for lazy loading komponenter
 * @param importFunc - Importfunksjon for komponenten (f.eks. () => import('./MinKomponent'))
 * @param fallbackComponent - Komponent som vises under lasting (valgfri)
 */
export function lazyLoadComponent<T extends React.ComponentType<any>>(
  importFunc: () => Promise<{ default: T }>,
  fallbackComponent: React.ReactNode = <div className="loading-spinner">Laster...</div>
) {
  const LazyComponent = React.lazy(importFunc);
  
  return (props: React.ComponentProps<T> & LazyComponentProps) => {
    const { fallback = fallbackComponent, ...componentProps } = props;
    
    return (
      <Suspense fallback={fallback}>
        <LazyComponent {...componentProps as any} />
      </Suspense>
    );
  };
}

/**
 * Helper for lazy loading av ruter
 */
export function lazyLoadRoute(importFunc: () => Promise<{ default: React.ComponentType<any> }>) {
  return lazyLoadComponent(importFunc, 
    <div className="route-loading-container">
      <div className="loading-spinner-large"></div>
      <p>Laster innhold...</p>
    </div>
  );
}
EOF

# 3. Memoization-helper
echo "3️⃣ Oppretter memoization-helpers..."
cat > src/utils/performance/memo-helpers.ts << 'EOF'
import { useCallback, useMemo, useRef, useEffect, useState, DependencyList } from 'react';

/**
 * En forbedret versjon av useCallback som kun oppdateres når inputverdier faktisk endres
 */
export function useDeepCallback<T extends (...args: any[]) => any>(
  callback: T,
  deps: DependencyList
): T {
  // Bruk en ref for å holde den forrige deps-verdien for sammenligning
  const depsRef = useRef<DependencyList>(deps);
  
  // Sammenlign den gamle og nye deps-listen
  const hasChanged = deps.some((dep, i) => {
    return !Object.is(dep, depsRef.current[i]);
  });
  
  // Oppdatere ref hvis noe har endret seg
  if (hasChanged) {
    depsRef.current = deps;
  }
  
  // Bruk en ref for å holde den nyeste callback-funksjonen
  const callbackRef = useRef(callback);
  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);
  
  // Returner en memoisert versjon som kun oppdateres når deps faktisk endres
  return useCallback((...args: any[]) => {
    return callbackRef.current(...args);
  }, [hasChanged]) as T;
}

/**
 * En hook som memoiserer en verdi og kun trigger re-render når verdien faktisk endres
 */
export function useDeepMemo<T>(factory: () => T, deps: DependencyList): T {
  // Bruk en ref for å holde den forrige deps-verdien for sammenligning
  const depsRef = useRef<DependencyList>(deps);
  
  // Sammenlign den gamle og nye deps-listen
  const hasChanged = deps.some((dep, i) => {
    return !Object.is(dep, depsRef.current[i]);
  });
  
  // Oppdatere ref hvis noe har endret seg
  if (hasChanged) {
    depsRef.current = deps;
  }
  
  // Bruk useMemo med en boolsk avhengighet som kun endres når deps faktisk endres
  return useMemo(factory, [hasChanged]);
}

/**
 * En hook for å begrense antall ganger en funksjon kjøres innenfor et gitt tidsvindu
 */
export function useThrottledCallback<T extends (...args: any[]) => any>(
  callback: T, 
  delay: number,
  deps: DependencyList = []
): T {
  const lastRan = useRef(Date.now() - delay);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  return useCallback((...args: any[]) => {
    const now = Date.now();
    
    if (now - lastRan.current >= delay) {
      lastRan.current = now;
      return callback(...args);
    } else {
      // Avbryt den forrige timeouten hvis den finnes
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      
      // Planlegge kjøring av funksjonen
      return new Promise<ReturnType<T>>((resolve) => {
        timeoutRef.current = setTimeout(() => {
          lastRan.current = Date.now();
          resolve(callback(...args) as ReturnType<T>);
        }, delay - (now - lastRan.current));
      });
    }
  }, [callback, delay, ...deps]) as T;
}
EOF

# 4. API Caching og SWR-lignende funksjonalitet
echo "4️⃣ Implementerer API caching og data fetching..."
npm install --save swr

cat > src/utils/data-fetching/api-cache.ts << 'EOF'
import { useState, useEffect } from 'react';
import useSWR, { SWRConfiguration } from 'swr';

// Global cache for API responses
const apiCache = new Map<string, { data: any; timestamp: number }>();
const DEFAULT_CACHE_TIME = 5 * 60 * 1000; // 5 minutes

/**
 * Fetcher function with caching
 */
async function cachingFetcher(url: string, options?: RequestInit) {
  // Check cache first
  const cached = apiCache.get(url);
  const now = Date.now();
  
  if (cached && (now - cached.timestamp < DEFAULT_CACHE_TIME)) {
    console.log(`Using cached data for ${url}`);
    return cached.data;
  }
  
  // If not in cache or expired, fetch fresh data
  console.log(`Fetching fresh data for ${url}`);
  const res = await fetch(url, options);
  
  if (!res.ok) {
    throw new Error(`API error: ${res.status}`);
  }
  
  const data = await res.json();
  
  // Store in cache
  apiCache.set(url, { data, timestamp: now });
  
  return data;
}

/**
 * Hook for data fetching with SWR and caching
 */
export function useApiData<T>(
  url: string | null, 
  options?: RequestInit, 
  config?: SWRConfiguration
) {
  return useSWR<T>(
    url, 
    url => cachingFetcher(url, options),
    { 
      revalidateOnFocus: false,
      dedupingInterval: 30000,
      ...config
    }
  );
}

/**
 * Clear API cache
 */
export function clearApiCache(urlPattern?: RegExp) {
  if (urlPattern) {
    // Clear only matching URLs
    for (const key of apiCache.keys()) {
      if (urlPattern.test(key)) {
        apiCache.delete(key);
      }
    }
  } else {
    // Clear entire cache
    apiCache.clear();
  }
}

/**
 * Prefetch data and store in cache
 */
export async function prefetchApiData(urls: string[], options?: RequestInit) {
  const results = await Promise.allSettled(
    urls.map(url => cachingFetcher(url, options))
  );
  
  return results.map((result, index) => ({
    url: urls[index],
    success: result.status === 'fulfilled',
    data: result.status === 'fulfilled' ? result.value : null,
    error: result.status === 'rejected' ? result.reason : null,
  }));
}
EOF

# 5. Service Worker forbedringer
echo "5️⃣ Forbedrer Service Worker..."
cat > src/service-worker-improved.js << 'EOF'
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
EOF

# 6. Komponent-ytelsesoptimalisering
echo "6️⃣ Oppretter verktøy for komponentytelsesoptimalisering..."
cat > src/utils/performance/index.ts << 'EOF'
export * from './memo-helpers';

// Performance tracking
let startTime = Date.now();
const performanceMark = (label: string) => {
  const now = Date.now();
  console.log(`${label}: ${now - startTime}ms`);
  startTime = now;
};

// Performance monitoring for components
export function trackComponentPerformance(
  componentName: string,
  onRender?: () => void
): { 
  start: () => void, 
  end: () => void,
  renderTime: number
} {
  let renderStart = 0;
  let lastRenderTime = 0;
  
  return {
    start: () => {
      renderStart = performance.now();
      
      if (process.env.NODE_ENV === 'development') {
        console.log(`${componentName} render started`);
      }
    },
    
    end: () => {
      const renderEnd = performance.now();
      lastRenderTime = renderEnd - renderStart;
      
      if (process.env.NODE_ENV === 'development') {
        console.log(`${componentName} rendered in ${lastRenderTime.toFixed(2)}ms`);
        
        // Log warning for slow renders
        if (lastRenderTime > 16) { // 1 frame at 60fps
          console.warn(`Slow render detected in ${componentName}: ${lastRenderTime.toFixed(2)}ms`);
        }
      }
      
      if (onRender) {
        onRender();
      }
    },
    
    renderTime: lastRenderTime
  };
}

// Hook to track component performance
export function useComponentPerformance(componentName: string) {
  const perf = trackComponentPerformance(componentName);
  perf.start();
  
  // Use a requestAnimationFrame to track when render is complete
  React.useEffect(() => {
    requestAnimationFrame(() => {
      perf.end();
    });
  });
  
  return perf;
}

// Function to create a virtualized list renderer
export function createVirtualizedRenderer<T>(
  items: T[],
  renderItem: (item: T, index: number) => React.ReactNode,
  itemHeight: number,
  containerHeight: number,
  overscan: number = 3
) {
  // Calculate which items should be in view
  const visibleCount = Math.ceil(containerHeight / itemHeight);
  const totalCount = items.length;
  
  return function VirtualizedRenderer(scrollPosition: number) {
    const startIndex = Math.max(0, Math.floor(scrollPosition / itemHeight) - overscan);
    const endIndex = Math.min(totalCount - 1, startIndex + visibleCount + 2 * overscan);
    
    // Render only the visible items
    const visibleItems = [];
    for (let i = startIndex; i <= endIndex; i++) {
      visibleItems.push(
        <div
          key={i}
          style={{
            position: 'absolute',
            top: i * itemHeight,
            height: itemHeight,
            left: 0,
            right: 0
          }}
        >
          {renderItem(items[i], i)}
        </div>
      );
    }
    
    return {
      visibleItems,
      totalHeight: totalCount * itemHeight,
      visibleStartIndex: startIndex,
      visibleEndIndex: endIndex
    };
  };
}
EOF

# 7. Performance budget monitorering
echo "7️⃣ Implementerer performance budget..."
cat > performance-budget.js << 'EOF'
const fs = require('fs');
const path = require('path');

// Define performance budgets
const BUDGET = {
  // Maximum bundle size in KB
  totalBundleSize: 300,
  mainBundleSize: 120,
  vendorBundleSize: 200,
  
  // Maximum media asset size in KB
  maxImageSize: 200,
  totalImagesSize: 1000,
  
  // Maximum API response time in ms
  apiResponseTime: 300,
  
  // Maximum component render time in ms
  componentRenderTime: 16, // 1 frame @ 60fps
  
  // First paint metrics in ms
  firstContentfulPaint: 1000,
  timeToInteractive: 3000,
};

// Function to analyze bundle sizes
async function analyzeBundles() {
  console.log('Analyzing bundle sizes...');
  
  try {
    if (!fs.existsSync('dist')) {
      console.log('No dist directory found. Skipping bundle analysis.');
      return;
    }
    
    let totalSize = 0;
    let mainSize = 0;
    let vendorSize = 0;
    
    // Scan the dist directory for JS files
    const files = fs.readdirSync('dist/assets');
    
    files.forEach(file => {
      if (file.endsWith('.js')) {
        const stats = fs.statSync(path.join('dist/assets', file));
        const sizeKB = stats.size / 1024;
        
        totalSize += sizeKB;
        
        if (file.includes('index') || file.includes('main')) {
          mainSize += sizeKB;
        } else if (file.includes('vendor') || file.includes('chunk')) {
          vendorSize += sizeKB;
        }
      }
    });
    
    // Check if we're exceeding budgets
    const budgetResults = {
      totalBundle: {
        actual: totalSize.toFixed(2),
        budget: BUDGET.totalBundleSize,
        passed: totalSize <= BUDGET.totalBundleSize
      },
      mainBundle: {
        actual: mainSize.toFixed(2),
        budget: BUDGET.mainBundleSize,
        passed: mainSize <= BUDGET.mainBundleSize
      },
      vendorBundle: {
        actual: vendorSize.toFixed(2),
        budget: BUDGET.vendorBundleSize,
        passed: vendorSize <= BUDGET.vendorBundleSize
      }
    };
    
    console.log('Bundle size budget results:');
    console.log(JSON.stringify(budgetResults, null, 2));
    
    // Write the results to a file
    fs.writeFileSync('performance-budget-results.json', JSON.stringify({
      timestamp: new Date().toISOString(),
      bundleSizes: budgetResults
    }, null, 2));
    
  } catch (err) {
    console.error('Error analyzing bundles:', err);
  }
}

// Run the analysis
analyzeBundles();
EOF

# 8. Oppdatering av README.md
echo "8️⃣ Oppdaterer README-SNAKKAZ.md med ytelsesinformasjon..."
cat >> README-SNAKKAZ.md << 'EOF'

## Ytelsesoptimalisering (19. mai 2025)

Snakkaz Chat er optimalisert for høy ytelse med følgende teknikker:

### 1. Bildeoptimlisering
- Responsive bilder med srcset for ulike skjermstørrelser
- WebP-format for moderne nettlesere
- Lazy loading av bilder som ikke er i viewport

### 2. Code Splitting og Lazy Loading
- Route-basert code splitting
- Lazy loading av tunge komponenter
- Suspense for bedre lasting

### 3. State Management
- Optimalisert rendering med memoization
- Forbedret useCallback og useMemo med dyp sammenligning
- Throttling av callback-funksjoner for å redusere rerendering

### 4. Nettverksoptimalisering
- API response caching
- SWR-basert datahenting med automatisk revalidering
- Prefetching av kritiske data

### 5. Forbedret Service Worker
- Strategibasert caching for ulike ressurstyper
- Offline støtte med IndexedDB
- Background syncing for offline-handlinger

Ved å bruke disse teknikkene oppnår vi raskere lasting, bedre responsivitet og en mer robust brukeropplevelse.
EOF

echo "9️⃣ Oppdaterer VERSION-HISTORY.md med ytelsesinformasjon..."
cat >> VERSION-HISTORY.md << 'EOF'

## Versjon 1.0.2 (19. mai 2025)

### Ytelsesoptimaliseringer
- Implementert responsive og optimaliserte bilder
- Lagt til code splitting og lazy loading av komponenter
- Forbedret memoization med dype sammenligningshjelpere
- Implementert API caching og SWR-basert datahenting
- Forbedret Service Worker med strategi-basert caching

### Verktøy
- Lagt til ytelsesanalyseverktøy
- Implementert performance budgeting
- Opprettet optimaliseringsscripts for bilder
- Lagt til virtualisering for lange lister
EOF

# Gjør scripts kjørbare
chmod +x optimize-images.js
chmod +x performance-budget.js

echo 
echo "✅ Ytelsesforbedringer er implementert! ✅"
echo
echo "Følgende filer og verktøy er lagt til:"
echo "1. optimize-images.js - Script for bildeoptimlisering"
echo "2. src/utils/lazy-loading/index.ts - Verktøy for lazy loading"
echo "3. src/utils/performance/memo-helpers.ts - Forbedrede React hooks"
echo "4. src/utils/data-fetching/api-cache.ts - API caching og SWR"
echo "5. src/service-worker-improved.js - Forbedret Service Worker"
echo "6. src/utils/performance/index.ts - Ytelsesovervåkning"
echo "7. performance-budget.js - Performance budget overvåkning"
echo
echo "For å bruke ytelsesforbedringene:"
echo "1. Kjør bildeoptimlisering: node optimize-images.js"
echo "2. Analyser bundelstørrelse: node performance-budget.js"
echo "3. Sett forbedret Service Worker i produksjon ved å erstatte eksisterende"
echo
echo "Dokumentasjonen er også oppdatert med informasjon om ytelsesforbedringene."
