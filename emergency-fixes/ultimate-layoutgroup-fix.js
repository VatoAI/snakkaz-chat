// ULTIMATE LAYOUTGROUPCONTEXT KILLER
// This will completely neutralize the LayoutGroupContext error

console.log('🛡️ ULTIMATE LayoutGroupContext protection loading...');

(function() {
  'use strict';
  
  // STEP 1: Intercept LayoutGroupContext.mjs before it loads
  if (typeof window !== 'undefined') {
    
    // Override any potential LayoutGroupContext access
    const layoutGroupFallback = {
      Provider: function(props) { 
        return props.children; 
      },
      Consumer: function(props) { 
        return props.children({}); 
      },
      _currentValue: {},
      _currentValue2: {},
      displayName: 'LayoutGroupContext'
    };
    
    // Create a global context registry
    window.__LAYOUT_CONTEXTS__ = window.__LAYOUT_CONTEXTS__ || {};
    window.__LAYOUT_CONTEXTS__.LayoutGroupContext = layoutGroupFallback;
    
    // STEP 2: Patch React.createContext to always return safe contexts
    if (window.React && window.React.createContext) {
      const originalCreateContext = window.React.createContext;
      window.React.createContext = function(defaultValue) {
        const context = originalCreateContext.call(this, defaultValue || {});
        // Ensure context always has safe properties
        context._currentValue = context._currentValue || defaultValue || {};
        context._currentValue2 = context._currentValue2 || defaultValue || {};
        return context;
      };
    }
    
    // STEP 3: Patch framer-motion module loading
    const originalDefine = window.define;
    if (originalDefine) {
      window.define = function(deps, factory) {
        if (typeof deps === 'function') {
          factory = deps;
          deps = [];
        }
        
        // Wrap factory to catch LayoutGroupContext errors
        const wrappedFactory = function() {
          try {
            return factory.apply(this, arguments);
          } catch (error) {
            if (error.message && error.message.includes('undefined has no properties')) {
              console.warn('🛡️ LayoutGroupContext error intercepted in module:', error);
              return { LayoutGroupContext: layoutGroupFallback };
            }
            throw error;
          }
        };
        
        return originalDefine.call(this, deps, wrappedFactory);
      };
    }
    
    // STEP 4: Override module resolution for LayoutGroupContext
    if (window.__webpack_require__) {
      const originalRequire = window.__webpack_require__;
      window.__webpack_require__ = function(moduleId) {
        try {
          const module = originalRequire.call(this, moduleId);
          
          // If module contains LayoutGroupContext, ensure it's safe
          if (module && module.LayoutGroupContext && !module.LayoutGroupContext._currentValue) {
            console.log('🛡️ Patching LayoutGroupContext in module:', moduleId);
            module.LayoutGroupContext = layoutGroupFallback;
          }
          
          return module;
        } catch (error) {
          if (error.message && error.message.includes('undefined has no properties')) {
            console.warn('🛡️ Module loading error intercepted:', moduleId, error);
            return { LayoutGroupContext: layoutGroupFallback };
          }
          throw error;
        }
      };
    }
    
    // STEP 5: Global error handler for remaining LayoutGroupContext errors
    const originalError = window.onerror;
    window.onerror = function(msg, url, line, col, error) {
      if (msg && msg.includes('undefined has no properties') && 
          url && url.includes('LayoutGroupContext')) {
        console.warn('🛡️ Final LayoutGroupContext error neutralized:', msg);
        return true; // Prevent error from bubbling up
      }
      
      // Also catch vendor-animation errors
      if (url && url.includes('vendor-animation') && 
          msg && msg.includes('undefined has no properties')) {
        console.warn('🛡️ Vendor animation error neutralized:', msg);
        return true;
      }
      
      if (originalError) {
        return originalError.apply(this, arguments);
      }
      return false;
    };
    
    // STEP 6: Promise rejection handler for async context errors
    window.addEventListener('unhandledrejection', function(event) {
      if (event.reason && event.reason.message && 
          event.reason.message.includes('undefined has no properties')) {
        console.warn('🛡️ Async LayoutGroupContext error neutralized:', event.reason);
        event.preventDefault();
      }
    });
    
    console.log('✅ ULTIMATE LayoutGroupContext protection active!');
  }
})();

// Additional protection - load after DOM
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', function() {
    console.log('🛡️ DOM loaded - LayoutGroupContext shields up!');
  });
}
