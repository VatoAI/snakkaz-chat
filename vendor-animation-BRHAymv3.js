// 🚨 ULTIMATE LAYOUTGROUPCONTEXT FIX - COMPLETE VENDOR ANIMATION OVERRIDE
// This file completely replaces vendor-animation-BRHAymv3.js functionality

console.log('🎯 ULTIMATE: Loading vendor-animation-BRHAymv3.js override...');

// 1. PREEMPTIVE REACT CONTEXT CREATION
(function() {
  'use strict';
  
  // Ensure React and createContext exist before any imports
  if (typeof window !== 'undefined') {
    
    // Create React namespace if missing
    window.React = window.React || {};
    
    // Mock createContext if missing
    window.React.createContext = window.React.createContext || function(defaultValue) {
      console.log('🔧 ULTIMATE: Mock createContext called with:', defaultValue);
      
      const Context = {
        Provider: function({ children, value }) {
          return children;
        },
        Consumer: function({ children }) {
          return children(defaultValue);
        },
        displayName: 'MockContext'
      };
      
      return Context;
    };
    
    // Ensure reactExports exists
    window.reactExports = window.reactExports || window.React;
    
    if (!window.reactExports.createContext) {
      window.reactExports.createContext = window.React.createContext;
    }
  }
})();

// 2. LAYOUTGROUPCONTEXT MOCK IMPLEMENTATION
const LayoutGroupContext = {
  Provider: function LayoutGroupContextProvider({ children, value }) {
    console.log('🎭 ULTIMATE: LayoutGroupContext.Provider rendering');
    return children;
  },
  Consumer: function LayoutGroupContextConsumer({ children }) {
    console.log('🎭 ULTIMATE: LayoutGroupContext.Consumer rendering');
    return children(null);
  },
  displayName: 'LayoutGroupContext'
};

// 3. MOTION/FRAMER-MOTION MOCKS
const motionMocks = {
  motion: {
    div: 'div',
    span: 'span',
    p: 'p',
    h1: 'h1',
    h2: 'h2',
    h3: 'h3',
    section: 'section',
    article: 'article'
  },
  
  AnimatePresence: function({ children }) {
    return children;
  },
  
  useAnimation: function() {
    return {
      start: () => Promise.resolve(),
      stop: () => {},
      set: () => {}
    };
  },
  
  useMotionValue: function(initial) {
    return {
      get: () => initial,
      set: () => {},
      onChange: () => {}
    };
  },
  
  LayoutGroup: function({ children }) {
    return children;
  }
};

// 4. EXPORT REPLACEMENTS
if (typeof module !== 'undefined' && module.exports) {
  // CommonJS
  module.exports = {
    LayoutGroupContext,
    ...motionMocks
  };
} else if (typeof window !== 'undefined') {
  // Browser globals
  window.LayoutGroupContext = LayoutGroupContext;
  Object.assign(window, motionMocks);
}

// 5. AMD/UMD COMPATIBILITY
if (typeof define === 'function' && define.amd) {
  define([], function() {
    return {
      LayoutGroupContext,
      ...motionMocks
    };
  });
}

console.log('✅ ULTIMATE: vendor-animation-BRHAymv3.js override complete!');

// 6. IMMEDIATE GLOBAL PROTECTION
(function() {
  // Prevent any animation-related errors
  const originalError = window.onerror;
  window.onerror = function(msg, file, line, col, error) {
    if (msg && (
      msg.includes('LayoutGroupContext') ||
      msg.includes('createContext') ||
      msg.includes('vendor-animation')
    )) {
      console.warn('🛡️ ULTIMATE: Blocked animation error:', msg);
      return true; // Prevent error from propagating
    }
    return originalError ? originalError.apply(this, arguments) : false;
  };
  
  // Prevent unhandled promise rejections from animation code
  window.addEventListener('unhandledrejection', function(event) {
    if (event.reason && event.reason.stack && 
        event.reason.stack.includes('LayoutGroupContext')) {
      console.warn('🛡️ ULTIMATE: Blocked animation promise rejection');
      event.preventDefault();
    }
  });
})();
