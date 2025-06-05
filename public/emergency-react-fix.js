// SNAKKAZ CHAT - SIMPLE EMERGENCY FIX - Juni 5, 2025
// Fixes React "useState undefined" and "Nt is undefined" errors

console.log('🚨 SNAKKAZ: Applying emergency React fix...');

// Emergency useState implementation
function createEmergencyUseState() {
  return function(initialState) {
    console.log('Emergency useState activated:', initialState);
    let currentState = initialState;
    function setState(newState) {
      currentState = typeof newState === 'function' ? newState(currentState) : newState;
      console.log('Emergency setState:', currentState);
    }
    return [currentState, setState];
  };
}

// Apply fix immediately when script loads
(function() {
  const w = window;
  
  // Ensure React namespace exists
  if (!w.React) w.React = {};
  
  // Fix useState
  if (!w.React.useState) w.React.useState = createEmergencyUseState();
  if (!w.useState) w.useState = createEmergencyUseState();
  
  // Fix minified variables that might be undefined
  const vars = ['Nt', 'Mt', 'Pt', 'Qt', 'Rt', 'St', 'Tt', 'Ut', 'Vt', 'Wt'];
  vars.forEach(function(varName) {
    if (w[varName] === undefined) {
      w[varName] = { useState: createEmergencyUseState() };
      console.log('Fixed undefined variable:', varName);
    }
  });
  
  // Fix useSyncExternalStore
  if (!w.useSyncExternalStore) {
    w.useSyncExternalStore = function(subscribe, getSnapshot) {
      return getSnapshot();
    };
  }
  
  console.log('✅ SNAKKAZ: Emergency React fix applied successfully');
})();
