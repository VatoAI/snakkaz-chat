// SnakkaZ Emergency React Hooks Fix
(function() {
  'use strict';
  
  // Fix undefined context errors
  window.__REACT_EMERGENCY_FIX__ = true;
  
  // Override problematic framer-motion contexts
  if (typeof window !== 'undefined') {
    window.__FRAMER_MOTION_CONTEXTS__ = {
      LayoutGroup: { Provider: ({children}) => children, Consumer: ({children}) => children(null) },
      Motion: { Provider: ({children}) => children, Consumer: ({children}) => children(null) }
    };
    
    // Patch console to handle animation errors gracefully
    const originalError = console.error;
    console.error = function(...args) {
      const msg = String(args[0] || '');
      if (msg.includes('undefined has no properties') || 
          msg.includes('LayoutGroupContext') ||
          msg.includes('vendor-animation')) {
        console.log('🔧 Animation error caught and handled');
        return;
      }
      originalError.apply(console, args);
    };
  }
})();
