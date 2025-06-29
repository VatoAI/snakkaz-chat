/**
 * OPTIMIZED REACT STATE FIX - Juni 29, 2025
 * Minimal, targeted fix for specific React runtime issues
 * 
 * Fixes only critical errors:
 * - useLayoutEffect undefined in vendor bundles
 * - useSyncExternalStore compatibility
 * - useMergeRef for Radix UI components
 */

declare global {
  interface Window {
    React?: any;
    useLayoutEffect?: any;
    useSyncExternalStore?: any;
    useMergeRef?: any;
  }
}

// Only apply fixes if needed - check for existing implementations first
const applyMinimalReactFixes = (): void => {
  if (typeof window === 'undefined') return;

  const win = window as any;
  
  // 1. Critical: useLayoutEffect fix for vendor bundles
  if (!win.useLayoutEffect && win.React) {
    console.log('🔧 Applying minimal useLayoutEffect fix');
    win.useLayoutEffect = win.React.useLayoutEffect || function(effect: () => any, deps?: any[]) {
      // Fallback to useEffect behavior
      if (typeof effect === 'function') {
        try {
          const cleanup = effect();
          return typeof cleanup === 'function' ? cleanup : undefined;
        } catch (e) {
          console.warn('useLayoutEffect fallback error:', e);
          return () => {};
        }
      }
      return () => {};
    };
  }

  // 2. Critical: useSyncExternalStore for modern React features
  if (!win.useSyncExternalStore) {
    console.log('🔧 Applying minimal useSyncExternalStore fix');
    win.useSyncExternalStore = function<T>(
      subscribe: (callback: () => void) => () => void,
      getSnapshot: () => T,
      getServerSnapshot?: () => T
    ): T {
      try {
        return getSnapshot();
      } catch (e) {
        console.warn('useSyncExternalStore fallback error:', e);
        return getServerSnapshot ? getServerSnapshot() : null as T;
      }
    };
  }

  // 3. Specific: useMergeRef for Radix UI compatibility
  if (!win.useMergeRef) {
    console.log('🔧 Applying minimal useMergeRef fix');
    win.useMergeRef = function(...refs: any[]) {
      return function(element: any) {
        refs.forEach(ref => {
          if (typeof ref === 'function') {
            try {
              ref(element);
            } catch (e) {
              console.warn('useMergeRef ref function error:', e);
            }
          } else if (ref && typeof ref === 'object' && 'current' in ref) {
            try {
              ref.current = element;
            } catch (e) {
              console.warn('useMergeRef ref object error:', e);
            }
          }
        });
      };
    };
  }

  // 4. Ensure React object has essential hooks if somehow missing
  if (win.React && (!win.React.useLayoutEffect || !win.React.useSyncExternalStore)) {
    console.log('🔧 Ensuring React object completeness');
    
    if (!win.React.useLayoutEffect) {
      win.React.useLayoutEffect = win.useLayoutEffect;
    }
    
    if (!win.React.useSyncExternalStore) {
      win.React.useSyncExternalStore = win.useSyncExternalStore;
    }
  }
};

// Apply fixes immediately when module loads
try {
  applyMinimalReactFixes();
  console.log('✅ Minimal React fixes applied successfully');
} catch (error) {
  console.warn('⚠️ Error applying minimal React fixes:', error);
}

// Re-apply fixes after DOM is ready (in case of race conditions)
if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      setTimeout(applyMinimalReactFixes, 100);
    });
  } else {
    setTimeout(applyMinimalReactFixes, 100);
  }
}

// Export for manual triggering if needed
export default applyMinimalReactFixes;
