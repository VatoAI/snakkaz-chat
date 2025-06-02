// React State Fix - Polyfill for use-sync-external-store
// This ensures proper React state synchronization across the app

import { useSyncExternalStore } from 'use-sync-external-store/shim';

// Polyfill fix for "ni is undefined" error
if (typeof window !== 'undefined' && !window.useSyncExternalStore) {
  window.useSyncExternalStore = useSyncExternalStore;
}

// Export for use in components that need explicit synchronization
export { useSyncExternalStore };

// Global React state fix
if (typeof globalThis !== 'undefined') {
  globalThis.useSyncExternalStore = useSyncExternalStore;
}
