/**
 * EMERGENCY REACT FIX - ULTRA-EARLY APPLICATION
 * Applied before ANY modules load to prevent useMergeRef errors
 */

// Execute immediately when this file is loaded
(function emergencyReactFix() {
  'use strict';
  
  if (typeof window === 'undefined') return;
  
  console.log('🚨 ULTRA-EARLY React fix applying...');
  
  const win = window as any;
  
  // Mark that we're applying the fix
  win.__EMERGENCY_REACT_FIX_APPLIED__ = true;
  
  // 1. CRITICAL: useLayoutEffect - The exact hook failing in useMergeRef
  if (!win.useLayoutEffect) {
    win.useLayoutEffect = function(effect: () => any, deps?: any[]) {
      console.log('🔧 Emergency useLayoutEffect executing');
      if (typeof effect === 'function') {
        try {
          // Execute immediately like real useLayoutEffect (synchronous)
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
  
  // 2. CRITICAL: useMergeRef - The exact function causing the error
  if (!win.useMergeRef) {
    win.useMergeRef = function(...refs: any[]) {
      console.log('🔧 Emergency useMergeRef executing with', refs.length, 'refs');
      return function(element: any) {
        refs.forEach(ref => {
          if (typeof ref === 'function') {
            try {
              ref(element);
            } catch (e) {
              console.warn('Emergency useMergeRef function ref error:', e);
            }
          } else if (ref && typeof ref === 'object' && ref !== null && 'current' in ref) {
            try {
              ref.current = element;
            } catch (e) {
              console.warn('Emergency useMergeRef object ref error:', e);
            }
          }
        });
      };
    };
  }
  
  // 3. Ensure React object exists and has the hooks
  if (!win.React) {
    win.React = {};
  }
  
  if (typeof win.React === 'object') {
    win.React.useLayoutEffect = win.React.useLayoutEffect || win.useLayoutEffect;
    win.React.useMergeRef = win.React.useMergeRef || win.useMergeRef;
  }
  
  // 4. Other essential hooks that might be needed
  if (!win.useRef) {
    win.useRef = function(initialValue: any) {
      console.log('🔧 Emergency useRef called');
      return { current: initialValue };
    };
    win.React.useRef = win.useRef;
  }
  
  if (!win.useCallback) {
    win.useCallback = function(callback: any, deps?: any[]) {
      console.log('🔧 Emergency useCallback called');
      return callback;
    };
    win.React.useCallback = win.useCallback;
  }
  
  // 5. Handle the specific error pattern from useMergeRef
  const originalError = console.error;
  console.error = function(...args: any[]) {
    const message = args.join(' ');
    if (message.includes('useLayoutEffect') || message.includes('useMergeRef')) {
      console.warn('🚨 INTERCEPTED React hook error, fix may need re-application:', message);
      // Re-apply fixes
      emergencyReactFix();
    }
    return originalError.apply(console, args);
  };
  
  console.log('✅ ULTRA-EARLY React fix completed');
})();

export {};
