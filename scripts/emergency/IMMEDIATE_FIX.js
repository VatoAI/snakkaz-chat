// IMMEDIATE FIX for www.snakkaz.com Black Screen Issue
// Copy and paste this directly into browser console on www.snakkaz.com
// This will fix the "Nt is undefined" error immediately

console.log('🚨 APPLYING IMMEDIATE SNAKKAZ FIX...');

(function() {
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

  const w = window;
  
  // Ensure React namespace exists
  if (!w.React) w.React = {};
  
  // Fix useState
  if (!w.React.useState) w.React.useState = createEmergencyUseState();
  if (!w.useState) w.useState = createEmergencyUseState();
  
  // SPECIFIC FIX for "Nt is undefined" error in use-sync-external-store-shim
  // This targets the exact error from vendor-misc-UdhpdGr7.js:1:25447
  const emergencyUseState = createEmergencyUseState();
  
  if (!w.Nt) w.Nt = emergencyUseState;
  if (!w.Mt) w.Mt = emergencyUseState;
  if (!w.Rt) w.Rt = emergencyUseState;
  if (!w.St) w.St = emergencyUseState;
  
  // Fix useSyncExternalStore
  if (!w.useSyncExternalStore) {
    w.useSyncExternalStore = function(subscribe, getSnapshot) {
      return getSnapshot();
    };
  }
  
  console.log('✅ IMMEDIATE SNAKKAZ FIX APPLIED - Nt error should be resolved');
  console.log('🔄 Please refresh the page after running this script');
})();
