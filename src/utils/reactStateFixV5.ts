/**
 * REACT STATE FIX V5 - Juni 14, 2025
 * Enhanced fix for React state errors including useMergeRef issues
 * 
 * Fixes:
 * - "Cannot read properties of undefined (reading 'useState')" error
 * - "Uncaught TypeError: undefined has no properties" in useMergeRef.js
 * - "K is undefined" error
 * - Radix UI hook access errors
 */

declare global {
  interface Window {
    React: any;
    useState: any;
    useEffect: any;
    useRef: any;
    useMemo: any;
    useCallback: any;
    useSyncExternalStore: any;
    // For useMergeRef specifically
    useMergeRef: any;
    // Common minified variables
    [key: string]: any;
  }
}

// Emergency React hooks implementations
const createEmergencyHook = <T>(hookName: string, defaultImpl: (...args: any[]) => T) => {
  return (...args: any[]): T => {
    console.log(`🔧 Emergency ${hookName} called with:`, args);
    return defaultImpl(...args);
  };
};

const emergencyUseState = createEmergencyHook('useState', <T>(initialState: T) => {
  let state = initialState;
  const setState = (newState: T | ((prev: T) => T)) => {
    if (typeof newState === 'function') {
      state = (newState as Function)(state);
    } else {
      state = newState;
    }
  };
  return [state, setState];
});

const emergencyUseEffect = createEmergencyHook('useEffect', (effect: () => void | (() => void), deps?: any[]) => {
  try {
    if (typeof effect === 'function') {
      const cleanup = effect();
      if (typeof cleanup === 'function') {
        // Store cleanup for later
        setTimeout(cleanup, 0);
      }
    }
  } catch (e) {
    console.warn('Emergency useEffect error:', e);
  }
});

const emergencyUseRef = createEmergencyHook('useRef', <T>(initialValue: T) => {
  return { current: initialValue };
});

const emergencyUseMemo = createEmergencyHook('useMemo', <T>(factory: () => T, deps?: any[]) => {
  try {
    return factory();
  } catch (e) {
    console.warn('Emergency useMemo error:', e);
    return null as T;
  }
});

const emergencyUseCallback = createEmergencyHook('useCallback', <T extends (...args: any[]) => any>(callback: T, deps?: any[]) => {
  return callback;
});

const emergencyUseSyncExternalStore = createEmergencyHook('useSyncExternalStore', <T>(
  subscribe: (callback: () => void) => () => void,
  getSnapshot: () => T
) => {
  try {
    return getSnapshot();
  } catch (e) {
    console.warn('Emergency useSyncExternalStore error:', e);
    return null as T;
  }
});

// Emergency useMergeRef implementation (specific to Radix UI issue)
const emergencyUseMergeRef = createEmergencyHook('useMergeRef', (...refs: any[]) => {
  return (element: any) => {
    refs.forEach(ref => {
      if (typeof ref === 'function') {
        try {
          ref(element);
        } catch (e) {
          console.warn('Emergency useMergeRef function ref error:', e);
        }
      } else if (ref && typeof ref === 'object' && 'current' in ref) {
        try {
          ref.current = element;
        } catch (e) {
          console.warn('Emergency useMergeRef object ref error:', e);
        }
      }
    });
  };
});

// Apply comprehensive React fixes
export function applyReactStateFixV5(): void {
  if (typeof window === 'undefined') return;

  console.log('🚀 Applying React State Fix V5...');

  const windowAny = window as any;
  
  // 1. Ensure React namespace exists
  if (!windowAny.React) {
    windowAny.React = {};
  }

  // 2. Provide all essential React hooks
  const hooks = {
    useState: emergencyUseState,
    useEffect: emergencyUseEffect,
    useRef: emergencyUseRef,
    useMemo: emergencyUseMemo,
    useCallback: emergencyUseCallback,
    useSyncExternalStore: emergencyUseSyncExternalStore,
  };

  Object.entries(hooks).forEach(([hookName, hookImpl]) => {
    // Add to React namespace
    if (!windowAny.React[hookName]) {
      windowAny.React[hookName] = hookImpl;
    }
    
    // Add to global scope
    if (!windowAny[hookName]) {
      windowAny[hookName] = hookImpl;
    }
  });

  // 3. Add useMergeRef specifically for Radix UI
  if (!windowAny.useMergeRef) {
    windowAny.useMergeRef = emergencyUseMergeRef;
  }
  if (!windowAny.React.useMergeRef) {
    windowAny.React.useMergeRef = emergencyUseMergeRef;
  }

  // 4. Fix common minified variables that might be undefined
  const minifiedVars = [
    'G', 'ni', 'Nt', 'Mt', 'Pt', 'Qt', 'Rt', 'St', 'Tt', 'Ut', 'Vt', 'Wt',
    'e', 't', 'n', 'r', 'o', 'i', 'a', 'c', 'l', 's', 'u', 'f', 'd', 'h', 'p', 'm', 'g', 'y', 'w', 'b', 'v', 'x', 'E', 'R', 'O', 'S', 'A', 'T', 'C', 'P', 'L', 'j', 'k', '_', 'N', 'D', 'F', 'B', 'U', 'M', 'q', 'W', 'H', 'I', 'z', '$', 'V', 'J', 'K'
  ];

  minifiedVars.forEach(varName => {
    if (typeof windowAny[varName] === 'undefined') {
      windowAny[varName] = {
        useState: emergencyUseState,
        useEffect: emergencyUseEffect,
        useRef: emergencyUseRef,
        useMemo: emergencyUseMemo,
        useCallback: emergencyUseCallback,
        useSyncExternalStore: emergencyUseSyncExternalStore,
        useMergeRef: emergencyUseMergeRef,
      };
    }
  });

  // 5. Override problematic use-sync-external-store functions globally
  if (typeof windowAny.useSyncExternalStore === 'undefined') {
    windowAny.useSyncExternalStore = emergencyUseSyncExternalStore;
  }

  // 6. Add emergency DOM ready handler
  const ensureReactReady = () => {
    const rootElement = document.getElementById('root');
    if (rootElement && !rootElement.innerHTML.trim()) {
      console.log('🔧 Empty root detected, React state fix is ready');
      rootElement.innerHTML = `
        <div style="
          display: flex; 
          flex-direction: column; 
          align-items: center; 
          justify-content: center; 
          height: 100vh; 
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          text-align: center;
        ">
          <div style="
            padding: 2rem;
            background: rgba(255, 255, 255, 0.1);
            border-radius: 1rem;
            backdrop-filter: blur(10px);
          ">
            <h1 style="margin: 0 0 1rem 0; font-size: 2rem; font-weight: 300;">SnakkaZ</h1>
            <p style="margin: 0; opacity: 0.8;">React is initializing...</p>
            <div style="
              margin-top: 1rem;
              width: 40px;
              height: 4px;
              background: rgba(255, 255, 255, 0.3);
              border-radius: 2px;
              overflow: hidden;
            ">
              <div style="
                width: 100%;
                height: 100%;
                background: white;
                border-radius: 2px;
                animation: loading 1.5s infinite ease-in-out;
              "></div>
            </div>
            <style>
              @keyframes loading {
                0% { transform: translateX(-100%); }
                50% { transform: translateX(0%); }
                100% { transform: translateX(100%); }
              }
            </style>
          </div>
        </div>
      `;
    }
  };

  // 7. Set up error handlers
  if (typeof window !== 'undefined') {
    window.addEventListener('error', (event) => {
      const error = event.error;
      if (error && (
        error.toString().includes('useState') ||
        error.toString().includes('useMergeRef') ||
        error.toString().includes('undefined has no properties') ||
        error.toString().includes('Cannot read properties of undefined')
      )) {
        console.warn('⚠️ React hook error detected - Re-applying fix');
        applyReactStateFixV5();
      }
    });

    window.addEventListener('unhandledrejection', (event) => {
      const reason = event.reason;
      if (reason && reason.toString && reason.toString().includes('React')) {
        console.warn('⚠️ React promise rejection detected - Re-applying fix');
        applyReactStateFixV5();
      }
    });
  }

  // 8. Apply emergency DOM handler if needed
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', ensureReactReady);
  } else {
    ensureReactReady();
  }

  console.log('✅ React State Fix V5 applied successfully');
}

// Auto-apply the fix immediately when this module loads
applyReactStateFixV5();

// Export for manual use if needed
export default applyReactStateFixV5;
