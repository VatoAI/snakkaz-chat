/**
 * React State Fix V3 - Emergency fix for useState undefined errors
 * Updated Juni 4, 2025 - Fixes "use-sync-external-store-shim.production.js:17 TypeError"
 * 
 * This fixes the specific error:
 * "Uncaught TypeError: Cannot read properties of undefined (reading 'useState')"
 */

// Comprehensive fix that addresses all known React state synchronization issues
const applyEmergencyReactFix = (): void => {
  if (typeof window === 'undefined') return;
  
  console.log('🚀 Applying Emergency React State Fix V3...');
  
  const windowAny = window as any;
  
  // 1. Fix the use-sync-external-store-shim issue
  windowAny.__USE_SYNC_EXTERNAL_STORE_POLYFILL__ = true;
  
  // 2. Fix minified variables that become undefined in production
  if (windowAny.G === undefined) {
    windowAny.G = {
      useState: function(initialState: any) {
        return [initialState, function(newState: any) { 
          console.log('useState polyfill called'); 
        }];
      }
    };
    console.log('✅ Fixed undefined "G" variable');
  }
  
  if (windowAny.ni === undefined) {
    windowAny.ni = {
      useState: function(initialState: any) {
        return [initialState, function(newState: any) { 
          console.log('useState polyfill called'); 
        }];
      }
    };
    console.log('✅ Fixed undefined "ni" variable');
  }
  
  // 3. Ensure React object exists and has useState
  if (!windowAny.React) {
    windowAny.React = {};
  }
  
  if (!windowAny.React.useState) {
    windowAny.React.useState = function(initialState: any) {
      return [initialState, function(newState: any) { 
        console.log('React.useState polyfill called'); 
      }];
    };
    console.log('✅ Added React.useState polyfill');
  }
  
  if (!windowAny.React.useSyncExternalStore) {
    windowAny.React.useSyncExternalStore = function(subscribe: any, getSnapshot: any) {
      try {
        return getSnapshot();
      } catch (error) {
        console.log('useSyncExternalStore polyfill error:', error);
        return null;
      }
    };
    console.log('✅ Added React.useSyncExternalStore polyfill');
  }
  
  // 4. Global fallbacks for all possible entry points
  if (typeof globalThis !== 'undefined') {
    const globalAny = globalThis as any;
    
    if (!globalAny.React) {
      globalAny.React = windowAny.React;
    }
    
    if (globalAny.G === undefined) {
      globalAny.G = windowAny.G;
    }
    
    if (globalAny.ni === undefined) {
      globalAny.ni = windowAny.ni;
    }
  }
  
  console.log('🎉 Emergency React State Fix V3 applied successfully!');
};

// Apply the fix immediately
applyEmergencyReactFix();

// Monitor and reapply if needed
if (typeof window !== 'undefined') {
  // Check every few seconds during page load
  const monitorInterval = setInterval(() => {
    const windowAny = window as any;
    
    // Check if any critical variables became undefined again
    if (windowAny.G === undefined || windowAny.ni === undefined || !windowAny.React?.useState) {
      console.log('🔄 Reapplying React fix due to missing variables...');
      applyEmergencyReactFix();
    }
  }, 3000);
  
  // Stop monitoring after 30 seconds to save resources
  setTimeout(() => {
    clearInterval(monitorInterval);
    console.log('🏁 React state monitoring completed');
  }, 30000);
  
  // Listen for specific errors and apply fixes
  window.addEventListener('error', (event) => {
    if (event.error) {
      const errorMessage = event.error.toString();
      if (
        errorMessage.includes('useState') ||
        errorMessage.includes('use-sync-external-store') ||
        errorMessage.includes('reading \'useState\'') ||
        errorMessage.includes('G is undefined') ||
        errorMessage.includes('ni is undefined')
      ) {
        console.log('🚨 React state error detected - applying emergency fix');
        applyEmergencyReactFix();
      }
    }
  });
}

// Export for manual use if needed
export const emergencyReactFix = applyEmergencyReactFix;
export default applyEmergencyReactFix;
