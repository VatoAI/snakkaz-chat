// Comprehensive React Mock System for Vendor Bundles
(function() {
    'use strict';
    
    // Safe React implementation
    const SafeReact = {
        Component: class Component {
            constructor(props) {
                this.props = props || {};
                this.state = {};
            }
            setState(updates) {
                if (typeof updates === 'function') {
                    updates = updates(this.state);
                }
                this.state = { ...this.state, ...updates };
            }
            render() {
                return null;
            }
        },
        
        createElement: function(type, props, ...children) {
            if (typeof type === 'string') {
                return {
                    type: type,
                    props: { ...props, children: children.length === 1 ? children[0] : children },
                    $$typeof: Symbol.for('react.element')
                };
            }
            if (typeof type === 'function') {
                try {
                    return type(props);
                } catch (e) {
                    console.warn('SafeReact: Component error caught', e);
                    return { type: 'div', props: { children: 'Component Error' } };
                }
            }
            return { type: 'div', props: { children: children } };
        },
        
        createContext: function(defaultValue) {
            const context = {
                Provider: function({ children, value }) {
                    return children;
                },
                Consumer: function({ children }) {
                    return typeof children === 'function' ? children(defaultValue) : children;
                },
                _currentValue: defaultValue,
                _context: true,
                displayName: 'Context'
            };
            return context;
        },
        
        forwardRef: function(render) {
            return function(props) {
                return render(props, { current: null });
            };
        },
        
        Fragment: function({ children }) {
            return children;
        },
        
        memo: function(component) {
            return component;
        },
        
        useCallback: function(callback, deps) {
            return callback;
        },
        
        useContext: function(context) {
            return context._currentValue || {};
        },
        
        useEffect: function(effect, deps) {
            try {
                if (typeof effect === 'function') {
                    const cleanup = effect();
                    if (typeof cleanup === 'function') {
                        // Store cleanup for potential later use
                        return cleanup;
                    }
                }
            } catch (e) {
                console.warn('SafeReact: useEffect error caught', e);
            }
        },
        
        useLayoutEffect: function(effect, deps) {
            return this.useEffect(effect, deps);
        },
        
        useMemo: function(factory, deps) {
            try {
                return typeof factory === 'function' ? factory() : factory;
            } catch (e) {
                console.warn('SafeReact: useMemo error caught', e);
                return null;
            }
        },
        
        useRef: function(initialValue) {
            return { current: initialValue };
        },
        
        useState: function(initialState) {
            const state = typeof initialState === 'function' ? initialState() : initialState;
            const setState = function(newState) {
                // In a real app, this would trigger re-render
                console.log('SafeReact: setState called with', newState);
            };
            return [state, setState];
        },
        
        useReducer: function(reducer, initialState) {
            const dispatch = function(action) {
                console.log('SafeReact: dispatch called with', action);
            };
            return [initialState, dispatch];
        },
        
        isValidElement: function(element) {
            return element && typeof element === 'object' && element.$$typeof === Symbol.for('react.element');
        },
        
        Children: {
            forEach: function(children, fn) {
                if (Array.isArray(children)) {
                    children.forEach(fn);
                } else if (children) {
                    fn(children, 0);
                }
            },
            map: function(children, fn) {
                if (Array.isArray(children)) {
                    return children.map(fn);
                } else if (children) {
                    return [fn(children, 0)];
                }
                return [];
            },
            count: function(children) {
                return Array.isArray(children) ? children.length : children ? 1 : 0;
            },
            only: function(children) {
                if (Array.isArray(children) && children.length === 1) {
                    return children[0];
                }
                return children;
            }
        }
    };
    
    // Ensure global React availability
    if (typeof window !== 'undefined') {
        window.React = window.React || SafeReact;
        window.SafeReact = SafeReact;
    }
    
    // For module systems
    if (typeof module !== 'undefined' && module.exports) {
        module.exports = SafeReact;
    }
    
    // For AMD
    if (typeof define === 'function' && define.amd) {
        define(function() { return SafeReact; });
    }
})();

function composeEventHandlers(originalEventHandler, ourEventHandler, { checkForDefaultPrevented = true } = {}) {
  return function handleEvent(event) {
    originalEventHandler == null ? void 0 : originalEventHandler(event);
    if (checkForDefaultPrevented === false || !event.defaultPrevented) {
      return ourEventHandler == null ? void 0 : ourEventHandler(event);
    }
  };
}
function clamp(value, [min, max]) {
  return Math.min(max, Math.max(min, value));
}
export {
  clamp as a,
  composeEventHandlers as c
};
//# sourceMappingURL=vendor-radix-ui-UJNVxv2C.js.map
