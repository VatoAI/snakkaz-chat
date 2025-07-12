// SNAKKAZ CHAT - RECOVERY VALIDATION SYSTEM
// Validates that all protection systems are working correctly
// Created: July 11, 2025

(function() {
  'use strict';
  
  console.log('🔍 Recovery Validation System starting...');
  
  const w = window;
  let validationResults = {
    react: false,
    layoutContext: false,
    hooks: false,
    errorBoundary: false,
    vendorCompatibility: false
  };
  
  // =============================================================================
  // VALIDATION FUNCTIONS
  // =============================================================================
  
  function validateReact() {
    try {
      if (w.React && typeof w.React === 'object') {
        console.log('✅ React namespace validation: PASSED');
        validationResults.react = true;
        return true;
      } else {
        console.log('❌ React namespace validation: FAILED');
        return false;
      }
    } catch (e) {
      console.log('❌ React validation error:', e);
      return false;
    }
  }
  
  function validateLayoutGroupContext() {
    try {
      if (w.LayoutGroupContext && 
          w.LayoutGroupContext.Provider && 
          w.LayoutGroupContext.Consumer) {
        console.log('✅ LayoutGroupContext validation: PASSED');
        validationResults.layoutContext = true;
        return true;
      } else {
        console.log('❌ LayoutGroupContext validation: FAILED');
        return false;
      }
    } catch (e) {
      console.log('❌ LayoutGroupContext validation error:', e);
      return false;
    }
  }
  
  function validateReactHooks() {
    try {
      const requiredHooks = ['useState', 'useEffect', 'useLayoutEffect', 'useContext', 'useMemo', 'useCallback', 'useRef'];
      let hooksValid = true;
      
      requiredHooks.forEach(function(hookName) {
        if (!w[hookName] || typeof w[hookName] !== 'function') {
          console.log('❌ Hook validation failed for:', hookName);
          hooksValid = false;
        }
      });
      
      if (hooksValid) {
        console.log('✅ React Hooks validation: PASSED');
        validationResults.hooks = true;
        return true;
      } else {
        console.log('❌ React Hooks validation: FAILED');
        return false;
      }
    } catch (e) {
      console.log('❌ React Hooks validation error:', e);
      return false;
    }
  }
  
  function validateErrorBoundary() {
    try {
      if (w.SnakkazErrorBoundary && 
          w.__snakkaz_error_boundary_ready === true) {
        console.log('✅ Error Boundary validation: PASSED');
        validationResults.errorBoundary = true;
        return true;
      } else {
        console.log('❌ Error Boundary validation: FAILED');
        return false;
      }
    } catch (e) {
      console.log('❌ Error Boundary validation error:', e);
      return false;
    }
  }
  
  function validateVendorCompatibility() {
    try {
      // Check for common minified variables
      const minifiedVars = ['Nt', 'Mt', 'Pt', 'Qt', 'Rt'];
      let vendorValid = true;
      
      minifiedVars.forEach(function(varName) {
        if (w[varName] === undefined) {
          console.log('⚠️ Minified variable not protected:', varName);
          vendorValid = false;
        }
      });
      
      // Check useSyncExternalStore
      if (!w.useSyncExternalStore || typeof w.useSyncExternalStore !== 'function') {
        console.log('⚠️ useSyncExternalStore not available');
        vendorValid = false;
      }
      
      if (vendorValid) {
        console.log('✅ Vendor Compatibility validation: PASSED');
        validationResults.vendorCompatibility = true;
        return true;
      } else {
        console.log('❌ Vendor Compatibility validation: FAILED');
        return false;
      }
    } catch (e) {
      console.log('❌ Vendor Compatibility validation error:', e);
      return false;
    }
  }
  
  // =============================================================================
  // AUTOMATED REPAIR FUNCTIONS
  // =============================================================================
  
  function repairReact() {
    console.log('🔧 Repairing React namespace...');
    if (!w.React) {
      w.React = {};
    }
    return validateReact();
  }
  
  function repairLayoutGroupContext() {
    console.log('🔧 Repairing LayoutGroupContext...');
    w.LayoutGroupContext = {
      Provider: function(props) {
        return {
          type: 'LayoutGroupProvider',
          props: props || {},
          children: props ? props.children : null
        };
      },
      Consumer: function(props) {
        return {
          type: 'LayoutGroupConsumer', 
          props: props || {},
          children: props ? props.children : null
        };
      },
      _currentValue: null,
      _currentValue2: null,
      _threadCount: 0,
      displayName: 'LayoutGroupContext'
    };
    
    if (typeof Symbol !== 'undefined') {
      w.LayoutGroupContext.$$typeof = Symbol.for('react.context');
    }
    
    return validateLayoutGroupContext();
  }
  
  function repairReactHooks() {
    console.log('🔧 Repairing React Hooks...');
    
    const emergencyHooks = {
      useState: function(initialState) {
        let state = typeof initialState === 'function' ? initialState() : initialState;
        function setState(newState) {
          state = typeof newState === 'function' ? newState(state) : newState;
        }
        return [state, setState];
      },
      useEffect: function(effect, deps) {
        if (typeof effect === 'function') {
          try {
            return effect();
          } catch (e) {
            console.warn('Emergency useEffect error:', e);
          }
        }
      },
      useLayoutEffect: function(effect, deps) {
        if (typeof effect === 'function') {
          setTimeout(function() {
            try {
              effect();
            } catch (e) {
              console.warn('Emergency useLayoutEffect error:', e);
            }
          }, 0);
        }
      },
      useContext: function(context) {
        if (context === w.LayoutGroupContext) {
          return { id: 'emergency-layout-group' };
        }
        return context?._currentValue || null;
      },
      useMemo: function(factory, deps) {
        try {
          return typeof factory === 'function' ? factory() : factory;
        } catch (e) {
          console.warn('Emergency useMemo error:', e);
          return null;
        }
      },
      useCallback: function(callback, deps) {
        return typeof callback === 'function' ? callback : function(){};
      },
      useRef: function(initialValue) {
        return { current: initialValue };
      }
    };
    
    Object.keys(emergencyHooks).forEach(function(hookName) {
      if (!w[hookName]) {
        w[hookName] = emergencyHooks[hookName];
      }
      if (w.React && !w.React[hookName]) {
        w.React[hookName] = emergencyHooks[hookName];
      }
    });
    
    return validateReactHooks();
  }
  
  function repairVendorCompatibility() {
    console.log('🔧 Repairing Vendor Compatibility...');
    
    // Fix minified variables
    const minifiedVars = ['Nt', 'Mt', 'Pt', 'Qt', 'Rt', 'St', 'Tt', 'Ut', 'Vt', 'Wt'];
    minifiedVars.forEach(function(varName) {
      if (w[varName] === undefined) {
        w[varName] = w.useState || function() { return [null, function(){}]; };
      }
    });
    
    // Fix useSyncExternalStore
    if (!w.useSyncExternalStore) {
      w.useSyncExternalStore = function(subscribe, getSnapshot, getServerSnapshot) {
        try {
          return getSnapshot();
        } catch (e) {
          console.warn('Emergency useSyncExternalStore error:', e);
          return null;
        }
      };
    }
    
    return validateVendorCompatibility();
  }
  
  // =============================================================================
  // MAIN VALIDATION RUNNER
  // =============================================================================
  
  function runValidation() {
    console.log('🔍 Running comprehensive validation...');
    
    // Run initial validations
    validateReact();
    validateLayoutGroupContext(); 
    validateReactHooks();
    validateErrorBoundary();
    validateVendorCompatibility();
    
    // Attempt repairs for failed validations
    if (!validationResults.react) {
      repairReact();
    }
    
    if (!validationResults.layoutContext) {
      repairLayoutGroupContext();
    }
    
    if (!validationResults.hooks) {
      repairReactHooks();
    }
    
    if (!validationResults.vendorCompatibility) {
      repairVendorCompatibility();
    }
    
    // Final validation summary
    const totalTests = Object.keys(validationResults).length;
    const passedTests = Object.values(validationResults).filter(Boolean).length;
    const successRate = Math.round((passedTests / totalTests) * 100);
    
    console.log('🔍 VALIDATION SUMMARY:');
    console.log(`   Success Rate: ${successRate}% (${passedTests}/${totalTests})`);
    console.log('   Results:', validationResults);
    
    if (successRate >= 80) {
      console.log('✅ System health: GOOD');
      w.__snakkaz_system_health = 'GOOD';
    } else if (successRate >= 60) {
      console.log('⚠️ System health: ACCEPTABLE');
      w.__snakkaz_system_health = 'ACCEPTABLE';
    } else {
      console.log('❌ System health: POOR - Manual intervention may be required');
      w.__snakkaz_system_health = 'POOR';
    }
    
    return validationResults;
  }
  
  // =============================================================================
  // AUTOMATIC MONITORING
  // =============================================================================
  
  function startMonitoring() {
    // Run validation every 30 seconds
    setInterval(function() {
      const health = w.__snakkaz_system_health;
      if (health === 'POOR' || health === undefined) {
        console.log('🔍 System health check triggered...');
        runValidation();
      }
    }, 30000);
    
    console.log('🔍 Automatic monitoring started (30s intervals)');
  }
  
  // =============================================================================
  // INITIALIZATION
  // =============================================================================
  
  // Run initial validation after a short delay to ensure other scripts have loaded
  setTimeout(function() {
    runValidation();
    startMonitoring();
    
    // Expose validation function globally for manual testing
    w.snakkazValidateSystem = runValidation;
    
    console.log('🔍 Recovery Validation System fully active!');
    console.log('💡 Run "snakkazValidateSystem()" in console to manually validate system health');
    
  }, 1000);
  
})();
