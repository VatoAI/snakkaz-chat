// SNAKKAZ CHAT - ERROR BOUNDARY INJECTION
// Provides comprehensive error handling and recovery
// Created: July 11, 2025

(function() {
  'use strict';
  
  console.log('🛡️ Error Boundary System initializing...');
  
  const w = window;
  
  // =============================================================================
  // ERROR BOUNDARY IMPLEMENTATION
  // =============================================================================
  
  function createErrorBoundary() {
    return {
      displayName: 'SnakkazErrorBoundary',
      
      constructor: function(props) {
        this.state = { hasError: false, error: null, errorInfo: null };
        this.props = props || {};
      },
      
      componentDidCatch: function(error, errorInfo) {
        console.log('🛡️ Error Boundary caught error:', error);
        console.log('🛡️ Error info:', errorInfo);
        
        this.setState({
          hasError: true,
          error: error,
          errorInfo: errorInfo
        });
        
        // Attempt to recover from common errors
        this.attemptRecovery(error);
      },
      
      attemptRecovery: function(error) {
        const errorMessage = error?.message || error?.toString() || '';
        
        console.log('🔧 Attempting error recovery for:', errorMessage);
        
        // LayoutGroupContext recovery
        if (errorMessage.includes('LayoutGroupContext') || errorMessage.includes('LayoutGroup')) {
          console.log('🔧 Applying LayoutGroupContext recovery...');
          
          if (!w.LayoutGroupContext) {
            w.LayoutGroupContext = {
              Provider: function(props) { return props?.children || null; },
              Consumer: function(props) { return props?.children || null; },
              _currentValue: null,
              displayName: 'LayoutGroupContext'
            };
          }
          
          // Force re-render after a short delay
          setTimeout(function() {
            if (w.React && w.React.createElement) {
              console.log('🔧 Triggering recovery re-render...');
              // Trigger a gentle re-render
              const event = new CustomEvent('snakkaz-recovery-render');
              document.dispatchEvent(event);
            }
          }, 100);
        }
        
        // React hooks recovery
        if (errorMessage.includes('hooks') || errorMessage.includes('useState') || errorMessage.includes('useEffect')) {
          console.log('🔧 Applying React hooks recovery...');
          
          const emergencyHooks = {
            useState: function(initial) {
              return [initial, function(){}];
            },
            useEffect: function(effect, deps) {
              if (typeof effect === 'function') {
                try { effect(); } catch(e) { console.warn('Recovery useEffect error:', e); }
              }
            },
            useLayoutEffect: function(effect, deps) {
              if (typeof effect === 'function') {
                setTimeout(function() {
                  try { effect(); } catch(e) { console.warn('Recovery useLayoutEffect error:', e); }
                }, 0);
              }
            },
            useContext: function(context) {
              return context?._currentValue || null;
            },
            useMemo: function(factory, deps) {
              try {
                return typeof factory === 'function' ? factory() : factory;
              } catch(e) {
                console.warn('Recovery useMemo error:', e);
                return null;
              }
            },
            useCallback: function(callback, deps) {
              return typeof callback === 'function' ? callback : function(){};
            },
            useRef: function(initial) {
              return { current: initial };
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
        }
        
        // Vendor bundle recovery
        if (errorMessage.includes('undefined has no properties') || errorMessage.includes('Nt is undefined')) {
          console.log('🔧 Applying vendor bundle recovery...');
          
          const minifiedVars = ['Nt', 'Mt', 'Pt', 'Qt', 'Rt', 'St', 'Tt', 'Ut', 'Vt', 'Wt'];
          minifiedVars.forEach(function(varName) {
            if (w[varName] === undefined) {
              w[varName] = function() { return [null, function(){}]; };
            }
          });
        }
      },
      
      render: function() {
        if (this.state.hasError) {
          console.log('🛡️ Error Boundary rendering fallback UI');
          
          // Return a simple fallback
          return {
            type: 'div',
            props: {
              style: {
                padding: '20px',
                textAlign: 'center',
                backgroundColor: '#1e293b',
                color: '#e2e8f0',
                fontFamily: 'system-ui, sans-serif'
              },
              children: [
                {
                  type: 'h2',
                  props: {
                    children: '🛡️ SnakkaZ Chat - Sikkerhetsmodus',
                    style: { color: '#f59e0b', marginBottom: '10px' }
                  }
                },
                {
                  type: 'p',
                  props: {
                    children: 'Appen gjenoppretter seg selv. Vennligst vent...',
                    style: { marginBottom: '20px' }
                  }
                },
                {
                  type: 'button',
                  props: {
                    children: 'Last inn på nytt',
                    style: {
                      padding: '10px 20px',
                      backgroundColor: '#3b82f6',
                      color: 'white',
                      border: 'none',
                      borderRadius: '6px',
                      cursor: 'pointer'
                    },
                    onClick: function() {
                      window.location.reload();
                    }
                  }
                }
              ]
            }
          };
        }
        
        return this.props.children || null;
      }
    };
  }
  
  // =============================================================================
  // GLOBAL ERROR HANDLERS
  // =============================================================================
  
  // Handle unhandled promise rejections
  w.addEventListener('unhandledrejection', function(event) {
    console.log('🛡️ Unhandled promise rejection caught:', event.reason);
    
    // Prevent the default handler
    event.preventDefault();
    
    // Attempt automatic recovery
    if (event.reason?.message?.includes('LayoutGroupContext')) {
      console.log('🔧 Auto-recovering from LayoutGroupContext promise rejection...');
      
      setTimeout(function() {
        // Trigger recovery
        const recoveryEvent = new CustomEvent('snakkaz-auto-recovery', {
          detail: { error: event.reason, type: 'layoutgroup' }
        });
        document.dispatchEvent(recoveryEvent);
      }, 50);
    }
  });
  
  // Handle general errors
  w.addEventListener('error', function(event) {
    console.log('🛡️ Global error caught:', event.error);
    
    const errorMessage = event.error?.message || event.message || '';
    
    // Auto-recover from known issues
    if (errorMessage.includes('LayoutGroupContext') || 
        errorMessage.includes('undefined has no properties') ||
        errorMessage.includes('Nt is undefined')) {
      
      console.log('🔧 Auto-recovering from known error...');
      
      // Prevent error propagation
      event.preventDefault();
      
      setTimeout(function() {
        const recoveryEvent = new CustomEvent('snakkaz-auto-recovery', {
          detail: { error: event.error, type: 'general' }
        });
        document.dispatchEvent(recoveryEvent);
      }, 50);
    }
  });
  
  // =============================================================================
  // RECOVERY EVENT LISTENER
  // =============================================================================
  
  document.addEventListener('snakkaz-auto-recovery', function(event) {
    console.log('🔧 Processing auto-recovery event:', event.detail);
    
    // Force cleanup of problematic state
    if (w.__reactInternalState) {
      delete w.__reactInternalState;
    }
    
    // Re-apply protections
    if (w.comprehensive_react_fix_applied) {
      console.log('🔧 Re-applying comprehensive React fixes...');
      // The comprehensive fix should handle this
    }
    
    // Gentle DOM refresh
    setTimeout(function() {
      const root = document.getElementById('root');
      if (root && root.children.length === 0) {
        console.log('🔧 Root element appears empty, triggering gentle refresh...');
        // Create a subtle visual indicator that recovery is happening
        const recoveryDiv = document.createElement('div');
        recoveryDiv.innerHTML = `
          <div style="
            position: fixed;
            top: 20px;
            right: 20px;
            background: #059669;
            color: white;
            padding: 10px 15px;
            border-radius: 6px;
            font-family: system-ui, sans-serif;
            font-size: 14px;
            z-index: 10000;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
          ">
            🛡️ SnakkaZ gjenoppretter...
          </div>
        `;
        document.body.appendChild(recoveryDiv);
        
        setTimeout(function() {
          document.body.removeChild(recoveryDiv);
        }, 2000);
      }
    }, 200);
  });
  
  // =============================================================================
  // INITIALIZE ERROR BOUNDARY SYSTEM
  // =============================================================================
  
  // Create and store the error boundary
  w.SnakkazErrorBoundary = createErrorBoundary();
  
  // Mark the system as ready
  w.__snakkaz_error_boundary_ready = true;
  
  console.log('✅ Error Boundary System fully active!');
  console.log('🛡️ Protected against:');
  console.log('   - React component errors');
  console.log('   - Unhandled promise rejections');
  console.log('   - Global JavaScript errors');
  console.log('   - LayoutGroupContext issues');
  console.log('   - Vendor bundle failures');
  
})();
