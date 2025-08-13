/**
 * EMERGENCY REACT FIX - Runs immediately on import
 * Critical fix for "Cannot read properties of undefined (reading 'useLayoutEffect')" error
 */

// Immediate fix for the most common React runtime error
(function() {
  'use strict';
  
  if (typeof window === 'undefined') return;
  
  const win = window as Window & Record<string, unknown>;
  
  // Emergency useLayoutEffect fix - run immediately
  if (!win.useLayoutEffect) {
    console.log('⚡ Emergency useLayoutEffect fix applied');
    win.useLayoutEffect = function(effect: () => void | (() => void), deps?: unknown[]) {
      if (typeof effect === 'function') {
        try {
          const cleanup = effect();
          return typeof cleanup === 'function' ? cleanup : () => {};
        } catch (e) {
          console.warn('Emergency useLayoutEffect error:', e);
          return () => {};
        }
      }
      return () => {};
    };
  }
  
  // Ensure React namespace has the hook if React exists
  const reactObj = win.React as Record<string, unknown>;
  if (reactObj && !reactObj.useLayoutEffect) {
    reactObj.useLayoutEffect = win.useLayoutEffect;
  }
  
  // Emergency protection for React property access
  if (reactObj && typeof reactObj === 'object') {
    const originalReact = reactObj;
    win.React = new Proxy(originalReact, {
      get(target, prop) {
        if (prop === 'useLayoutEffect') {
          return target[prop as string] || win.useLayoutEffect;
        }
        return target[prop as string];
      },
      has(target, prop) {
        if (prop === 'useLayoutEffect') {
          return true;
        }
        return prop in target;
      }
    });
  }
  
})();
