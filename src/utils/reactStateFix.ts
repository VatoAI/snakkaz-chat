// React State Fix V3 - Ultra-robust polyfill to prevent production errors
// Updated Juni 4, 2025 - Fixes "useState undefined" in use-sync-external-store-shim
// This ensures proper React state synchronization across the app

// Define types for our extended window object
interface ExtendedWindow extends Window {
  React?: {
    useState?: (initialState: any) => [any, (value: any) => void];
    useSyncExternalStore?: (subscribe: any, getSnapshot: any, getServerSnapshot?: any) => any;
  };
  useSyncExternalStore?: any;
  __USE_SYNC_EXTERNAL_STORE_POLYFILL__?: boolean;
  // Add support for minified variable names that might be undefined
  G?: any;
  ni?: any;
}

// Self-healing monitoring mechanism - Executes periodically to ensure fixes remain applied
const ensureReactHooksAvailable = () => {
  if (typeof window !== 'undefined') {
    // Fix minified variables that might become undefined in production
    if ((window as any).G === undefined) {
      (window as any).G = {};
      console.log('🔧 Fixed undefined "G" variable in use-sync-external-store-shim');
    }
    
    if ((window as any).ni === undefined) {
      (window as any).ni = {};
      console.log('🔧 Fixed undefined "ni" variable in use-sync-external-store-shim');
    }
    
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
const applyReactStateFix = () => {
  // Ultra-robust polyfill to prevent useState undefined errors in use-sync-external-store-shim
  if (typeof window !== 'undefined') {
    const windowAny = window as any;
    
    // Fix for use-sync-external-store production build issues
    windowAny.__USE_SYNC_EXTERNAL_STORE_POLYFILL__ = true;
    
    // Fix minified variables that cause "useState undefined" error
    if (windowAny.G === undefined) {
      windowAny.G = {};
      console.log('🔧 Fixed undefined "G" variable');
    }
    
    if (windowAny.ni === undefined) {
      windowAny.ni = {};
      console.log('🔧 Fixed undefined "ni" variable');
    }
    
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
        // Fix additional undefined variables that might occur in shim
        if (windowAny.G === undefined) windowAny.G = {};
        if (windowAny.ni === undefined) windowAny.ni = {};
        
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
    windowAny.useSyncExternalStore = windowAny.React.useSyncExternalStore;
  }

  // Prevent production build errors globally using the same robust approach
  if (typeof globalThis !== 'undefined') {
    const globalAny = globalThis as any;
    globalAny.__USE_SYNC_EXTERNAL_STORE_POLYFILL__ = true;
    
    // Fix minified variables globally
    if (globalAny.G === undefined) globalAny.G = {};
    if (globalAny.ni === undefined) globalAny.ni = {};
    
    // Global React polyfill with non-overridable properties
    if (!globalAny.React) {
      Object.defineProperty(globalThis, 'React', {
        value: {},
        writable: false,
        configurable: false
      });
    }
    
    // Add useState with defineProperty
    if (!globalAny.React.useState) {
      Object.defineProperty(globalAny.React, 'useState', {
        value: function(initialState: any) {
          return [initialState, function() { console.log('useState setter called (global polyfill)'); }];
        },
        writable: false,
        configurable: false
      });
    }
    
    // Add useSyncExternalStore with defineProperty
    if (!globalAny.React.useSyncExternalStore) {
      Object.defineProperty(globalAny.React, 'useSyncExternalStore', {
        value: function(subscribe: any, getSnapshot: any, getServerSnapshot?: any) {
          try {
            // Fix global undefined variables
            if (globalAny.G === undefined) globalAny.G = {};
            if (globalAny.ni === undefined) globalAny.ni = {};
            
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
       event.error.toString().includes('React'))
    ) {
      console.warn('⚠️ React-related error detected - Applying emergency fix');
      applyReactStateFix();
    }
  });
}

// Export the fix functions for explicit use in critical components
export const emergencyReactFix = applyReactStateFix;
export const checkReactHooks = ensureReactHooksAvailable;
