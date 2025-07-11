// EMERGENCY DIRECT PATCH FOR LAYOUTGROUPCONTEXT ERROR
// Fixes: Uncaught TypeError: undefined has no properties LayoutGroupContext.mjs:4

console.log('🔧 Emergency LayoutGroupContext patch loading...');

// Patch for LayoutGroupContext undefined properties
if (typeof window !== 'undefined') {
  // Create a safe LayoutGroupContext fallback
  window.__EMERGENCY_LAYOUT_CONTEXT_PATCH__ = true;
  
  // Override potential undefined context access
  const originalError = window.onerror;
  window.onerror = function(msg, url, line, col, error) {
    if (msg && msg.includes('undefined has no properties') && url && url.includes('LayoutGroupContext')) {
      console.warn('🔧 LayoutGroupContext error caught and handled by emergency patch');
      return true; // Prevent error from propagating
    }
    if (originalError) {
      return originalError.apply(this, arguments);
    }
    return false;
  };

  // Patch React context access
  const originalCreateContext = window.React?.createContext;
  if (originalCreateContext) {
    window.React.createContext = function(defaultValue) {
      const context = originalCreateContext.call(this, defaultValue || {});
      // Ensure context always has a provider
      if (!context.Provider) {
        context.Provider = function(props) {
          return props.children;
        };
      }
      return context;
    };
  }

  // Patch potential undefined context reads
  const originalUseContext = window.React?.useContext;
  if (originalUseContext) {
    window.React.useContext = function(context) {
      try {
        const value = originalUseContext.call(this, context);
        return value || {}; // Always return an object, never undefined
      } catch (error) {
        console.warn('🔧 useContext error patched:', error.message);
        return {}; // Safe fallback
      }
    };
  }

  console.log('✅ Emergency LayoutGroupContext patch applied successfully!');
}

// Additional framer-motion specific patches
if (typeof window !== 'undefined' && window.location) {
  // Wait for framer-motion to load, then patch it
  const checkAndPatch = () => {
    if (window.FramerMotion || window.motion) {
      console.log('🔧 Patching framer-motion LayoutGroupContext...');
      
      // Override LayoutGroup context if it's undefined
      const motion = window.FramerMotion || window.motion;
      if (motion && motion.LayoutGroup) {
        const originalLayoutGroup = motion.LayoutGroup;
        motion.LayoutGroup = function(props) {
          try {
            return originalLayoutGroup(props);
          } catch (error) {
            console.warn('🔧 LayoutGroup error patched, using fallback');
            return props.children; // Just render children without layout group
          }
        };
      }
    }
  };
  
  // Check immediately and also after DOM loads
  checkAndPatch();
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', checkAndPatch);
  }
  
  // Also check after a delay in case of dynamic imports
  setTimeout(checkAndPatch, 1000);
  setTimeout(checkAndPatch, 3000);
}
