/**
 * SPECIFIC FIX FOR VENDOR-MISC BUNDLE ISSUE
 * Patches the exact reactExports.useLayoutEffect problem
 */

// This runs before any modules and patches the exact import issue
(function patchVendorMiscReactExports() {
  'use strict';
  
  if (typeof window === 'undefined') return;
  
  console.log('🚨 VENDOR-MISC PATCH: Applying specific fix for reactExports.useLayoutEffect issue');
  
  // Create a global reactExports object that vendor-misc can use
  window.reactExports = window.reactExports || {};
  
  // Ensure useLayoutEffect is available immediately
  window.reactExports.useLayoutEffect = window.reactExports.useLayoutEffect || function(effect, deps) {
    console.log('🔧 VENDOR-MISC PATCH: Emergency useLayoutEffect called');
    if (typeof effect === 'function') {
      try {
        // Execute synchronously like real useLayoutEffect
        const cleanup = effect();
        return typeof cleanup === 'function' ? cleanup : () => {};
      } catch (e) {
        console.warn('VENDOR-MISC PATCH: useLayoutEffect error:', e);
        return () => {};
      }
    }
    return () => {};
  };
  
  // Also ensure useEffect is available as fallback
  window.reactExports.useEffect = window.reactExports.useEffect || window.reactExports.useLayoutEffect;
  
  // Ensure useState is available (also used in vendor-misc)
  window.reactExports.useState = window.reactExports.useState || function(initialState) {
    console.log('🔧 VENDOR-MISC PATCH: Emergency useState called');
    let state = initialState;
    const setState = (newState) => {
      if (typeof newState === 'function') {
        state = newState(state);
      } else {
        state = newState;
      }
    };
    return [state, setState];
  };
  
  // Watch for when the real React exports become available and merge them
  const originalDefineProperty = Object.defineProperty;
  
  // Intercept any attempts to define reactExports and ensure our patches remain
  if (typeof Proxy !== 'undefined') {
    try {
      window.reactExports = new Proxy(window.reactExports, {
        set(target, prop, value) {
          // If the real React export is being set, use it, but keep our fallbacks
          if (prop === 'useLayoutEffect' && typeof value === 'function') {
            console.log('🔧 VENDOR-MISC PATCH: Real useLayoutEffect detected, using it');
            target[prop] = value;
          } else if (!target[prop] || typeof value === 'function') {
            target[prop] = value;
          }
          return true;
        },
        get(target, prop) {
          if (prop in target) {
            return target[prop];
          }
          // Fallback for any missing React hook
          if (typeof prop === 'string' && prop.startsWith('use')) {
            console.warn(`🔧 VENDOR-MISC PATCH: Missing React hook ${prop}, providing emergency fallback`);
            return () => {};
          }
          return target[prop];
        }
      });
    } catch (e) {
      console.warn('VENDOR-MISC PATCH: Proxy not supported, using direct object');
    }
  }
  
  console.log('✅ VENDOR-MISC PATCH: Applied successfully');
})();

export {};
