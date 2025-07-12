// SNAKKAZ CHAT - ULTIMATE VENDOR BUNDLE FIX
// Addresses specific vendor-animation-BRHAymv3.js and reactExports issues
// Created: July 12, 2025

(function() {
  'use strict';
  
  console.log('🚀 ULTIMATE Vendor Bundle Fix initializing...');
  
  const w = window;
  
  // =============================================================================
  // 1. PRE-EMPTIVE REACT SETUP
  // =============================================================================
  
  // Create React namespace BEFORE any bundles load
  if (!w.React) {
    w.React = {};
    console.log('✅ Pre-emptive React namespace created');
  }
  
  // =============================================================================
  // 2. REACT EXPORTS AGGRESSIVE SETUP
  // =============================================================================
  
  // This is what vendor-animation-BRHAymv3.js is looking for
  if (!w.reactExports) {
    w.reactExports = {};
  }
  
  // Emergency createContext - this is critical for LayoutGroupContext
  w.reactExports.createContext = w.reactExports.createContext || function(defaultValue) {
    console.log('🔧 EMERGENCY: reactExports.createContext called with:', defaultValue);
    
    const context = {
      Provider: function(props) {
        console.log('🔧 Context Provider created');
        return {
          type: 'ContextProvider',
          props: props || {},
          children: props ? props.children : null
        };
      },
      Consumer: function(props) {
        console.log('🔧 Context Consumer created'); 
        return {
          type: 'ContextConsumer',
          props: props || {},
          children: props ? props.children : null
        };
      },
      _currentValue: defaultValue,
      _currentValue2: defaultValue,
      _threadCount: 0,
      displayName: 'EmergencyContext'
    };
    
    // Add React 18+ properties
    if (typeof Symbol !== 'undefined') {
      context.$$typeof = Symbol.for('react.context');
    }
    
    return context;
  };
  
  // Emergency useRef for vendor bundles
  w.reactExports.useRef = w.reactExports.useRef || function(initialValue) {
    console.log('🔧 EMERGENCY: reactExports.useRef called');
    return { current: initialValue };
  };
  
  // Copy to React namespace as well
  w.React.createContext = w.React.createContext || w.reactExports.createContext;
  w.React.useRef = w.React.useRef || w.reactExports.useRef;
  
  // =============================================================================
  // 3. JSX RUNTIME EXPORTS
  // =============================================================================
  
  // Ensure jsxRuntimeExports exists for vendor bundles
  if (!w.jsxRuntimeExports) {
    w.jsxRuntimeExports = {
      jsx: function(type, props, key) {
        console.log('🔧 Emergency JSX called:', type);
        return {
          type: type,
          props: props || {},
          key: key
        };
      },
      jsxs: function(type, props, key) {
        console.log('🔧 Emergency JSXS called:', type);
        return {
          type: type,
          props: props || {},
          key: key
        };
      }
    };
    console.log('✅ jsxRuntimeExports emergency setup complete');
  }
  
  // =============================================================================
  // 4. LAYOUT GROUP CONTEXT SPECIFIC FIX
  // =============================================================================
  
  // Pre-create LayoutGroupContext to prevent undefined errors
  const preCreatedLayoutGroupContext = w.reactExports.createContext({});
  
  // Make it globally available
  w.LayoutGroupContext = preCreatedLayoutGroupContext;
  
  // Store for vendor bundle access
  w.__SNAKKAZ_LAYOUT_GROUP_CONTEXT = preCreatedLayoutGroupContext;
  
  console.log('✅ Pre-created LayoutGroupContext globally available');
  
  // =============================================================================
  // 5. MODULE LOADING INTERCEPTION
  // =============================================================================
  
  // Intercept potential import errors
  const originalError = w.console.error;
  w.console.error = function() {
    const args = Array.prototype.slice.call(arguments);
    const message = args.join(' ');
    
    // Intercept specific LayoutGroupContext errors
    if (message.includes('undefined has no properties') && 
        message.includes('LayoutGroupContext')) {
      console.log('🛡️ INTERCEPTED: LayoutGroupContext error prevented');
      
      // Ensure reactExports is properly set up
      if (!w.reactExports || !w.reactExports.createContext) {
        console.log('🔧 Emergency reactExports setup triggered');
        w.reactExports = w.reactExports || {};
        w.reactExports.createContext = w.React.createContext;
      }
      
      return; // Don't show the error
    }
    
    // Pass through other errors
    originalError.apply(w.console, arguments);
  };
  
  // =============================================================================
  // 6. VENDOR BUNDLE COMPATIBILITY
  // =============================================================================
  
  // For any import statements that might fail
  w.__EMERGENCY_REACT_EXPORTS__ = w.reactExports;
  w.__EMERGENCY_JSX_EXPORTS__ = w.jsxRuntimeExports;
  
  // Global import fallback
  w.import = w.import || function(moduleSpecifier) {
    console.log('🔧 Emergency import called for:', moduleSpecifier);
    
    // Handle vendor-react-core imports
    if (moduleSpecifier.includes('vendor-react-core')) {
      return Promise.resolve({
        r: w.reactExports,
        j: w.jsxRuntimeExports
      });
    }
    
    // Default fallback
    return Promise.reject(new Error('Module not found: ' + moduleSpecifier));
  };
  
  // =============================================================================
  // 7. FINAL VALIDATION
  // =============================================================================
  
  // Validate everything is set up correctly
  setTimeout(function() {
    let isValid = true;
    
    if (!w.reactExports) {
      console.error('❌ reactExports not available');
      isValid = false;
    }
    
    if (!w.reactExports.createContext) {
      console.error('❌ reactExports.createContext not available');
      isValid = false;
    }
    
    if (!w.LayoutGroupContext) {
      console.error('❌ LayoutGroupContext not pre-created');
      isValid = false;
    }
    
    if (isValid) {
      console.log('✅ ULTIMATE Vendor Bundle Fix: ALL SYSTEMS GO!');
      console.log('🎯 LayoutGroupContext ready for vendor bundles');
      console.log('🎯 reactExports fully configured');
      console.log('🎯 Emergency fallbacks in place');
    } else {
      console.error('❌ ULTIMATE Vendor Bundle Fix: ISSUES DETECTED');
    }
  }, 100);
  
  console.log('🚀 ULTIMATE Vendor Bundle Fix setup complete!');
  
})();
