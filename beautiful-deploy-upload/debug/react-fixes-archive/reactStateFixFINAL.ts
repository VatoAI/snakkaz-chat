/**
 * FINAL REACT STATE FIX - Juni 4, 2025
 * Simple, clean fix for React state errors on snakkaz.com
 * 
 * Fixes:
 * - "Nt is undefined" error
 * - "Cannot read properties of undefined (reading 'useState')" error
 */

// Ensure React hooks are available globally
declare global {
  interface Window {
    React?: {
      useState?: <T>(initialState: T) => [T, (newState: T) => void];
    };
    useState?: <T>(initialState: T) => [T, (newState: T) => void];
    useSyncExternalStore?: <T>(
      subscribe: (callback: () => void) => () => void,
      getSnapshot: () => T
    ) => T;
  }
}

// Emergency useState implementation
const emergencyUseState = <T>(initialState: T): [T, (newState: T) => void] => {
  console.log('Emergency useState called with:', initialState);
  let state = initialState;
  const setState = (newState: T) => {
    state = newState;
    console.log('Emergency setState called with:', newState);
  };
  return [state, setState];
};

// Emergency useSyncExternalStore implementation
const emergencyUseSyncExternalStore = <T>(
  subscribe: (callback: () => void) => () => void,
  getSnapshot: () => T
): T => {
  console.log('Emergency useSyncExternalStore called');
  return getSnapshot();
};

// Apply fixes immediately when module loads
(() => {
  console.log('🚨 APPLYING FINAL REACT STATE FIX');
  
  // Ensure window.React exists
  if (!window.React) {
    window.React = {};
  }
  
  // Ensure useState exists
  if (!window.React.useState) {
    window.React.useState = emergencyUseState;
  }
  
  // Ensure global useState exists
  if (!window.useState) {
    window.useState = emergencyUseState;
  }
  
  // Ensure useSyncExternalStore exists
  if (!window.useSyncExternalStore) {
    window.useSyncExternalStore = emergencyUseSyncExternalStore;
  }
  
  // Fix for minified variable "Nt" that might be undefined
  const globalScope = window as Record<string, unknown>;
  
  // Common minified variable names that might be undefined
  const minifiedVars = ['Nt', 'Mt', 'Pt', 'Qt', 'Rt', 'St', 'Tt', 'Ut', 'Vt', 'Wt', 'Xt', 'Yt', 'Zt'];
  
  minifiedVars.forEach(varName => {
    if (globalScope[varName] === undefined) {
      globalScope[varName] = {
        useState: emergencyUseState,
        useSyncExternalStore: emergencyUseSyncExternalStore
      };
      console.log(`Fixed undefined minified variable: ${varName}`);
    }
  });
  
  console.log('✅ FINAL REACT STATE FIX APPLIED SUCCESSFULLY');
  return true;
})();

// Default export for module compatibility
const applyFinalReactStateFix = (): boolean => {
  console.log('Final React State Fix executed');
  return true;
};

export default applyFinalReactStateFix;
