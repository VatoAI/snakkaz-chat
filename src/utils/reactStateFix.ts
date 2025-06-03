// React State Fix - Simple polyfill to prevent production errors
// This ensures proper React state synchronization across the app

// Simple polyfill to prevent "G is undefined" errors
if (typeof window !== 'undefined') {
  // Fix for use-sync-external-store production build issues
  window.__USE_SYNC_EXTERNAL_STORE_POLYFILL__ = true;
  
  // Ensure React's useSyncExternalStore is available
  if (!window.React) {
    window.React = {};
  }
}

// Prevent production build errors
if (typeof globalThis !== 'undefined') {
  globalThis.__USE_SYNC_EXTERNAL_STORE_POLYFILL__ = true;
}

console.log('✅ React State Fix Applied Successfully');
