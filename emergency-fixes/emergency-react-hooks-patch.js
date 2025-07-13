// Emergency React Hooks Fix for SnakkaZ Live
// Fixes: Uncaught TypeError: undefined has no properties in LayoutGroupContext.mjs

(function() {
  'use strict';
  
  // Ultra-early React hooks stabilization
  if (typeof window !== 'undefined' && !window.__SNAKKAZ_HOOKS_FIXED__) {
    
    // Polyfill for React Context issues
    if (typeof React !== 'undefined' && React.createContext) {
      const originalCreateContext = React.createContext;
      React.createContext = function(defaultValue) {
        const context = originalCreateContext.call(this, defaultValue);
        
        // Ensure context has required properties
        if (!context.Consumer) {
          context.Consumer = function({ children }) {
            return children(defaultValue);
          };
        }
        
        if (!context.Provider) {
          context.Provider = function({ children, value }) {
            return children;
          };
        }
        
        return context;
      };
    }
    
    // Fix for framer-motion LayoutGroupContext
    window.__FRAMER_MOTION_PATCHES__ = {
      LayoutGroupContext: {
        Provider: ({ children }) => children,
        Consumer: ({ children }) => children(null)
      }
    };
    
    // Mark as fixed
    window.__SNAKKAZ_HOOKS_FIXED__ = true;
    console.log('✅ EMERGENCY: React hooks fix applied for SnakkaZ');
  }
})();
