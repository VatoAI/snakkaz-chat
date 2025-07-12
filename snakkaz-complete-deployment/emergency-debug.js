// SnakkaZ Emergency Debug Console
(function() {
    'use strict';
    
    console.log('🚀 EMERGENCY DEBUG: Loading SnakkaZ Emergency Debug System...');
    
    // Emergency SafeReact fallback
    if (!window.SafeReact) {
        console.log('🔧 EMERGENCY: Creating SafeReact fallback...');
        window.SafeReact = {
            createContext: function(defaultValue) {
                console.log('🔧 Safe createContext called with:', defaultValue);
                return {
                    Provider: ({ children, value }) => children,
                    Consumer: ({ children }) => typeof children === 'function' ? children(defaultValue) : children,
                    _currentValue: defaultValue,
                    _context: true
                };
            },
            createElement: function(type, props, ...children) {
                return { type, props, children };
            },
            Component: class Component {
                constructor(props) { 
                    this.props = props || {}; 
                    this.state = {}; 
                }
                setState(updates) { 
                    this.state = { ...this.state, ...updates }; 
                }
            },
            useContext: (context) => context._currentValue || {},
            useRef: (initial) => ({ current: initial }),
            useCallback: (fn) => fn,
            useMemo: (fn) => fn(),
            useEffect: () => {},
            useLayoutEffect: () => {},
            useState: (initial) => [initial, () => {}]
        };
        console.log('✅ EMERGENCY: SafeReact fallback created');
    }
    
    // Emergency error handler
    window.addEventListener('error', function(event) {
        console.error('🚨 EMERGENCY ERROR:', {
            message: event.message,
            filename: event.filename,
            lineno: event.lineno,
            colno: event.colno,
            error: event.error
        });
    });
    
    // Emergency unhandled rejection handler
    window.addEventListener('unhandledrejection', function(event) {
        console.error('🚨 EMERGENCY REJECTION:', event.reason);
    });
    
    // Debug info panel
    const createDebugPanel = () => {
        const panel = document.createElement('div');
        panel.innerHTML = `
            <div style="
                position: fixed;
                top: 10px;
                left: 10px;
                background: rgba(0, 0, 0, 0.9);
                color: #00ff00;
                padding: 10px;
                border-radius: 5px;
                font-family: monospace;
                font-size: 12px;
                z-index: 99999;
                border: 1px solid #00ff00;
            ">
                <div>🚀 SnakkaZ Emergency Debug</div>
                <div>SafeReact: ${!!window.SafeReact ? '✅' : '❌'}</div>
                <div>React: ${!!window.React ? '✅' : '❌'}</div>
                <div>Time: ${new Date().toLocaleTimeString()}</div>
                <button onclick="this.parentElement.parentElement.remove()" style="
                    background: #00ff00;
                    border: none;
                    color: black;
                    cursor: pointer;
                    margin-top: 5px;
                    padding: 2px 5px;
                ">Close</button>
            </div>
        `;
        document.body.appendChild(panel);
        
        // Auto-remove after 30 seconds
        setTimeout(() => {
            if (panel.parentElement) {
                panel.remove();
            }
        }, 30000);
    };
    
    // Wait for DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', createDebugPanel);
    } else {
        createDebugPanel();
    }
    
    console.log('✅ EMERGENCY DEBUG: System loaded successfully');
})();
