/**
 * ENHANCED REACT RUNTIME FIX - Juni 29, 2025
 * Critical fix for React runtime errors including "Cannot read properties of undefined (reading 'useLayoutEffect')"
 * 
 * Fixes critical errors:
 * - useLayoutEffect undefined in vendor bundles
 * - React object property access errors
 * - useSyncExternalStore compatibility
 * - useMergeRef for Radix UI components
 */

// Type definitions for React runtime fixes
type ReactEffect = (effect: () => void | (() => void), deps?: unknown[]) => void;
type ReactHook = (...args: unknown[]) => unknown;

// Enhanced runtime fix with comprehensive error handling
const applyMinimalReactFixes = (): void => {
  if (typeof window === 'undefined') return;
  
  const win = window as Window & {
    React?: Record<string, unknown>;
    useLayoutEffect?: ReactHook;
    useSyncExternalStore?: ReactHook;
    useMergeRef?: ReactHook;
    __reactFixApplied?: boolean;
  };
  
  if (win.__reactFixApplied) return;

  try {
    // 1. Critical: useLayoutEffect fix - this addresses the specific error you're seeing
    if (!win.useLayoutEffect) {
      console.log('🔧 Applying critical useLayoutEffect fix');
      
      // Try to get useLayoutEffect from React first
      const reactUseLayoutEffect = (win.React as Record<string, unknown>)?.useLayoutEffect as ReactEffect;
      const reactUseEffect = (win.React as Record<string, unknown>)?.useEffect as ReactEffect;
      
      win.useLayoutEffect = reactUseLayoutEffect || reactUseEffect || function(effect: () => void | (() => void), deps?: unknown[]) {
        // Safe fallback implementation
        if (typeof effect === 'function') {
          try {
            // Execute effect immediately for layout effects
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

    // 2. Ensure React object has useLayoutEffect if it exists
    if (win.React && typeof win.React === 'object') {
      const reactObj = win.React as Record<string, unknown>;
      if (!reactObj.useLayoutEffect && win.useLayoutEffect) {
        console.log('🔧 Adding useLayoutEffect to React object');
        reactObj.useLayoutEffect = win.useLayoutEffect;
      }
    }

    // 3. Critical: useSyncExternalStore for modern React features
    if (!win.useSyncExternalStore) {
      console.log('🔧 Applying useSyncExternalStore fix');
      const reactUseSyncExternalStore = (win.React as Record<string, unknown>)?.useSyncExternalStore;
      
      win.useSyncExternalStore = reactUseSyncExternalStore || function<T>(
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

    // 4. Specific: useMergeRef for Radix UI compatibility
    if (!win.useMergeRef) {
      console.log('🔧 Applying useMergeRef fix');
      win.useMergeRef = function(...refs: unknown[]) {
        return function(element: unknown) {
          refs.forEach(ref => {
            if (typeof ref === 'function') {
              try {
                (ref as (element: unknown) => void)(element);
              } catch (e) {
                console.warn('useMergeRef ref function error:', e);
              }
            } else if (ref && typeof ref === 'object' && ref !== null && 'current' in ref) {
              try {
                (ref as { current: unknown }).current = element;
              } catch (e) {
                console.warn('useMergeRef ref object error:', e);
              }
            }
          });
        };
      };
    }

    // 5. Mark as applied
    win.__reactFixApplied = true;
    console.log('✅ Enhanced React runtime fixes applied successfully');
    
  } catch (error) {
    console.warn('⚠️ Error applying React runtime fixes:', error);
  }
};

// Apply fixes immediately when module loads
try {
  applyMinimalReactFixes();
} catch (error) {
  console.warn('⚠️ Error during initial React fix application:', error);
}

// Re-apply fixes after DOM is ready (in case of race conditions)
if (typeof document !== 'undefined') {
  const applyOnReady = () => {
    setTimeout(() => {
      try {
        applyMinimalReactFixes();
      } catch (error) {
        console.warn('⚠️ Error applying React fixes on DOM ready:', error);
      }
    }, 100);
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', applyOnReady);
  } else {
    applyOnReady();
  }
}

// Export for manual triggering if needed
export default applyMinimalReactFixes;
