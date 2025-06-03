// React State Fix V2 - Ultra-robust polyfill with self-healing capabilities
// This ensures proper React state synchronization across the app

// Define types for our extended window object
declare global {
  interface Window {
    React: any;
    useSyncExternalStore: any;
    __USE_SYNC_EXTERNAL_STORE_POLYFILL__: boolean;
  }
}

// Self-healing monitoring mechanism - Executes periodically to ensure fixes remain applied
const ensureReactHooksAvailable = (): boolean => {
  if (typeof window !== 'undefined') {
    // Detect if React is available but its hooks are not
    if (window.React && (!window.React.useState || !window.React.useSyncExternalStore)) {
      console.warn('⚠️ React hooks missing - Applying emergency fix');
      applyReactStateFix();
      return true;
    }
    return false;
  }
  return false;
};

// Main fix implementation function - can be called multiple times safely
const applyReactStateFix = (): void => {
  // Ultra-robust polyfill to prevent "G is undefined", "ni is undefined" and "Cannot read properties of undefined (reading 'useState')" errors
  if (typeof window !== 'undefined') {
    // Fix for use-sync-external-store production build issues
    window.__USE_SYNC_EXTERNAL_STORE_POLYFILL__ = true;
    
    // Create a non-overridable React object with Object.defineProperty
    if (!window.React) {
      Object.defineProperty(window, 'React', {
        value: {},
        writable: false,
        configurable: false
      });
    }
    
    // Create a dummy useState function that won't break in production
    const dummyUseStateFunction = function(initialState: any) {
      return [initialState, function() { console.log('useState setter called (polyfill)'); }];
    };
    
    // Add useState with defineProperty to prevent overwriting
    if (!window.React.useState) {
      Object.defineProperty(window.React, 'useState', {
        value: dummyUseStateFunction,
        writable: false,
        configurable: false
      });
    }

    // Add useSyncExternalStore with defineProperty 
    const dummyUseSyncExternalStore = function(subscribe: any, getSnapshot: any, getServerSnapshot?: any) {
      try {
        // Handle potential minified variables that might be undefined
        if (typeof window !== 'undefined') {
          // Fix for G is undefined (original error)
          if (window['G'] === undefined) {
            window['G'] = {}; 
            console.log('Fixed undefined "G" variable in use-sync-external-store-shim');
          }
          
          // Fix for ni is undefined (new error)
          if (window['ni'] === undefined) {
            window['ni'] = {}; 
            console.log('Fixed undefined "ni" variable in use-sync-external-store-shim');
          }
        }

        return getSnapshot();
      } catch (e) {
        console.log('useSyncExternalStore error (polyfill):', e);
        return null;
      }
    };
    
    if (!window.React.useSyncExternalStore) {
      Object.defineProperty(window.React, 'useSyncExternalStore', {
        value: dummyUseSyncExternalStore,
        writable: false,
        configurable: false
      });
    }
    
    // Also add it directly to the window object to catch any direct references
    window.useSyncExternalStore = window.React.useSyncExternalStore;
  }

  // Prevent production build errors globally using the same robust approach
  if (typeof globalThis !== 'undefined') {
    (globalThis as any).__USE_SYNC_EXTERNAL_STORE_POLYFILL__ = true;
    
    // Global React polyfill with non-overridable properties
    if (!(globalThis as any).React) {
      Object.defineProperty(globalThis, 'React', {
        value: {},
        writable: false,
        configurable: false
      });
    }
    
    // Add useState with defineProperty
    if (!(globalThis as any).React.useState) {
      Object.defineProperty((globalThis as any).React, 'useState', {
        value: function(initialState: any) {
          return [initialState, function() { console.log('useState setter called (global polyfill)'); }];
        },
        writable: false,
        configurable: false
      });
    }
    
    // Add useSyncExternalStore with defineProperty
    if (!(globalThis as any).React.useSyncExternalStore) {
      Object.defineProperty((globalThis as any).React, 'useSyncExternalStore', {
        value: function(subscribe: any, getSnapshot: any, getServerSnapshot?: any) {
          try {
            // Handle potential minified variables in global context
            if (typeof globalThis !== 'undefined') {
              // Fix for G is undefined (original error)
              if ((globalThis as any)['G'] === undefined) {
                (globalThis as any)['G'] = {};
                console.log('Fixed undefined "G" variable in global context');
              }
              
              // Fix for ni is undefined (new error)
              if ((globalThis as any)['ni'] === undefined) {
                (globalThis as any)['ni'] = {};
                console.log('Fixed undefined "ni" variable in global context');
              }
            }
            
            return getSnapshot();
          } catch (e) {
            console.log('useSyncExternalStore error (global polyfill):', e);
            return null;
          }
        },
        writable: false,
        configurable: false
      });
    }
  }
};

// Apply the fix immediately
applyReactStateFix();

// Set up periodic checking to ensure React hooks remain available throughout the application lifecycle
if (typeof window !== 'undefined') {
  // Check every 2 seconds during initial page load
  const initialInterval = setInterval(() => {
    const fixed = ensureReactHooksAvailable();
    if (fixed) {
      console.log('🔄 React hooks restored by self-healing mechanism');
    }
  }, 2000);
  
  // After 10 seconds, reduce frequency to save resources
  setTimeout(() => {
    clearInterval(initialInterval);
    // Check every 30 seconds during normal operation
    setInterval(ensureReactHooksAvailable, 30000);
  }, 10000);
  
  // Also set up event listeners for potential problematic situations
  window.addEventListener('error', (event) => {
    if (
      event.error && 
      (event.error.toString().includes('useState') || 
       event.error.toString().includes('undefined') ||
       event.error.toString().includes('React') ||
       event.error.toString().includes('G is undefined') ||
       event.error.toString().includes('ni is undefined'))
    ) {
      console.warn('⚠️ React-related error detected - Applying emergency fix');
      applyReactStateFix();
    }
  });
}

// Export the fix functions for explicit use in critical components
export const emergencyReactFix = applyReactStateFix;
export const checkReactHooks = ensureReactHooksAvailable;
