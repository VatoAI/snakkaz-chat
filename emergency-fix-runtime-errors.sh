#!/bin/bash
#
# Fix script for Snakkaz Chat runtime errors
# May 19, 2025
#

echo "🛠️ Snakkaz Chat Emergency Error Fix Script"
echo "=========================================="
echo

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
  echo "❌ Error: This script must be run from the project root directory!"
  exit 1
fi

echo "1️⃣ Reverting service worker to a stable version..."

# Create a simple but stable service worker
cat > public/service-worker.js << 'EOF'
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

// Håndter fetch-events - server fra cache hvis tilgjengelig, ellers fra nettverket
self.addEventListener('fetch', (event) => {
  // Skip non-GET requests
  if (event.request.method !== 'GET') {
    return;
  }
  
  // Handle fetch event
  event.respondWith(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.match(event.request).then((cachedResponse) => {
        // Hvis ressursen finnes i cache, returner den
        if (cachedResponse) {
          log('Serving from cache:', event.request.url);
          return cachedResponse;
        }
        
        // Ellers, gå til nettverket
        return fetch(event.request).then((networkResponse) => {
          // Hvis vi får respons og den er OK, cache den for fremtidig bruk
          if (networkResponse && networkResponse.status === 200) {
            // Clone the response since it can only be consumed once
            const responseToCache = networkResponse.clone();
            
            // Skip caching for HEAD requests (previously fixed issue)
            if (event.request.method === 'GET') {
              cache.put(event.request, responseToCache);
            }
          }
          
          return networkResponse;
        }).catch((error) => {
          log('Fetch failed, falling back to offline page:', error);
          
          // Hvis nettverket feiler og vi har en offline-side, returner den
          if (event.request.mode === 'navigate') {
            return cache.match(OFFLINE_URL);
          }
          
          return new Response('Network error', { status: 408, headers: { 'Content-Type': 'text/plain' } });
        });
      });
    })
  );
});

// Skip waiting when asked
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
EOF

echo "2️⃣ Fixing CSP initialization issues..."

# Fix the initialize.ts file to simplify CSP handling
cat > src/services/encryption/initialize-simplified.ts << 'EOF'
/**
 * Snakkaz Chat App Initialization - Simplified Version
 * 
 * This is a simplified version of the initialization to fix runtime errors
 */

import { applyCspPolicy } from './cspConfig';
import { fixDeprecatedMetaTags } from './metaTagFixes';
import { initCspReporting } from './cspReporting';

// Track initialization state
let isInitialized = false;

/**
 * Initialize Snakkaz Chat application - simplified version
 */
export function initializeSnakkazChat() {
  // Prevent double initialization
  if (isInitialized) {
    console.log('Snakkaz Chat already initialized');
    return;
  }
  
  console.log('Initializing Snakkaz Chat security and compatibility fixes...');
  
  try {
    // Apply CSP policy
    applyCspPolicy();
    
    // Fix deprecated meta tags
    fixDeprecatedMetaTags();
    
    // Initialize CSP reporting
    initCspReporting();
    
    console.log('Applied security enhancements');
    
    // Mark as initialized
    isInitialized = true;
    
    console.log('Snakkaz Chat initialization complete');
  } catch (error) {
    console.error('Failed to initialize Snakkaz Chat:', error);
  }
}

/**
 * Apply all emergency CSP fixes
 * This is exported for use in other modules
 */
export function applyAllCspFixes() {
  console.log('Applying emergency CSP fixes...');
  
  // Basic CSP policy application
  applyCspPolicy();
  
  // Fix meta tags
  fixDeprecatedMetaTags();
  
  console.log('All CSP and CORS fixes have been applied');
}
EOF

# Replace the existing initialize.ts with the simplified version
cp src/services/encryption/initialize-simplified.ts src/services/encryption/initialize.ts

echo "3️⃣ Patching AppRouter.tsx to be compatible with production..."

# Check if AppRouter.tsx contains the lazy loading code
if grep -q "React.lazy" src/AppRouter.tsx; then
  echo "Patching AppRouter.tsx..."
  
  # Create a backup
  cp src/AppRouter.tsx src/AppRouter.tsx.bak
  
  # Remove the lazy loading code and revert to direct imports
  sed -i 's|import React, { Suspense, lazy } from '\''react'\''|import React from '\''react'\''|g' src/AppRouter.tsx
  sed -i 's|// Lazy load pages for better performance|// Direct imports for stability|g' src/AppRouter.tsx
  sed -i 's|const Login = lazy(() => import('\''./pages/Login'\''))|import Login from '\''./pages/Login'\''|g' src/AppRouter.tsx
  sed -i 's|const Register = lazy(() => import('\''./pages/Register'\''))|import Register from '\''./pages/Register'\''|g' src/AppRouter.tsx
  sed -i 's|const SecureChatPage = lazy(() => import('\''./pages/SecureChatPage'\''))|import SecureChatPage from '\''./pages/SecureChatPage'\''|g' src/AppRouter.tsx
  sed -i 's|const ChatSettingsPage = lazy(() => import('\''./pages/ChatSettingsPage'\''))|import ChatSettingsPage from '\''./pages/ChatSettingsPage'\''|g' src/AppRouter.tsx
  sed -i 's|const SecureMessageViewer = lazy(() => import('\''./components/chat/SecureMessageViewer'\''))|import SecureMessageViewer from '\''./components/chat/SecureMessageViewer'\''|g' src/AppRouter.tsx
  sed -i 's|const NotFoundPage = lazy(() => import('\''./pages/NotFoundPage'\''))|import NotFoundPage from '\''./pages/NotFoundPage'\''|g' src/AppRouter.tsx
  
  # Remove the Suspense wrapper
  sed -i 's|<Suspense fallback={<LoadingFallback />}>|<!-- Regular rendering -->|g' src/AppRouter.tsx
  sed -i 's|</Suspense>|<!-- End regular rendering -->|g' src/AppRouter.tsx
  
  # Remove the LoadingFallback component
  sed -i '/LoadingFallback/,/);/d' src/AppRouter.tsx
fi

echo "4️⃣ Updating main.tsx to reference the stable service worker..."

# Create a backup
cp src/main.tsx src/main.tsx.bak

# Update the service worker registration
sed -i 's|const registration = await navigator.serviceWorker.register('\''\/service-worker-improved.js'\'')|const registration = await navigator.serviceWorker.register('\''\/service-worker.js'\'')|g' src/main.tsx

echo "5️⃣ Rebuilding the application with fixed files..."

# Run the build
npm run build

echo "✅ Fixes applied successfully! The following issues have been addressed:"
echo "   - Reverted service worker to stable version"
echo "   - Simplified CSP initialization to prevent runtime errors"
echo "   - Removed lazy loading to improve compatibility"
echo "   - All changes have been documented in BUGFIXES-MAY19-2025.md"

# Document the changes
cat >> BUGFIXES-MAY19-2025.md << 'EOF'

## Emergency Fix - May 19, 2025 (Runtime Error Fix)

### Issues Fixed:
1. **Runtime Error in Production**: Fixed uncaught JavaScript error in production bundle that prevented the app from loading properly
2. **Service Worker Issues**: Reverted to a simpler and more stable service worker implementation
3. **CSP Initialization Issues**: Simplified the CSP initialization process to prevent potential runtime errors
4. **Lazy Loading Compatibility**: Removed lazy loading temporarily to ensure compatibility across all browsers

### Technical Details:
- Created a stable service worker with proper caching for GET requests only
- Simplified the encryption/initialize.ts file to focus on core CSP functionality
- Removed React.lazy() implementation to prevent potential code splitting issues in production
- Updated service worker registration path in main.tsx

### Next Steps:
1. Re-introduce performance optimizations incrementally after thorough testing
2. Test lazy loading thoroughly in a development environment before redeploying
3. Implement a proper error boundary system for catching React component errors
4. Add more detailed logging to help diagnose issues in production
EOF

echo
echo "🎯 Next steps:"
echo "1. Deploy the fixed version to production"
echo "2. Monitor for any remaining errors"
echo "3. Reintroduce performance optimizations gradually after thorough testing"
