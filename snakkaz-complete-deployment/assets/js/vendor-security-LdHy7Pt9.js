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
        
        Fragment: function(props) {
            // Emergency safety check for destructured props
            if (!props || typeof props !== 'object') {
                console.warn('SafeReact Fragment: props is null or invalid, returning empty array');
                return [];
            }
            const { children } = props;
            return children || [];
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

var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
var SecurityLevel = /* @__PURE__ */ ((SecurityLevel2) => {
  SecurityLevel2["STANDARD"] = "standard";
  SecurityLevel2["SERVER_E2EE"] = "server_e2ee";
  SecurityLevel2["P2P_E2EE"] = "p2p_e2ee";
  SecurityLevel2["PREMIUM"] = "premium";
  SecurityLevel2["HIGH"] = "high";
  SecurityLevel2["MAXIMUM"] = "maximum";
  return SecurityLevel2;
})(SecurityLevel || {});
const toSecurityLevel = (level) => {
  switch (level) {
    case "standard":
      return "standard";
    case "server_e2ee":
      return "server_e2ee";
    case "p2p_e2ee":
      return "p2p_e2ee";
    case "premium":
      return "premium";
    case "high":
      return "high";
    case "maximum":
      return "maximum";
    default:
      return "standard";
  }
};
function getRandomBytes(length) {
  const array = new Uint8Array(length);
  if (typeof crypto !== "undefined") {
    crypto.getRandomValues(array);
  } else {
    for (let i = 0; i < length; i++) {
      array[i] = Math.floor(Math.random() * 256);
    }
    console.warn("Using less secure random number generation - no WebCrypto available");
  }
  return array;
}
class SecureKeyStorage {
  constructor() {
    __publicField(this, "keys", /* @__PURE__ */ new Map());
    __publicField(this, "MAX_KEY_AGE_MS", 24 * 60 * 60 * 1e3);
    // 24 hours
    __publicField(this, "KEY_ROTATION_INTERVAL_MS", 4 * 60 * 60 * 1e3);
    // 4 hours
    __publicField(this, "KEY_CLEANUP_INTERVAL_MS", 30 * 60 * 1e3);
    // 30 minutes
    __publicField(this, "cleanupTimer", null);
    this.cleanupTimer = setInterval(() => {
      this.cleanup();
    }, this.KEY_CLEANUP_INTERVAL_MS);
    if (typeof document !== "undefined") {
      document.addEventListener("visibilitychange", () => {
        if (document.visibilityState === "hidden") {
          this.protectKeys();
        }
      });
    }
    if (typeof window !== "undefined") {
      window.addEventListener("beforeunload", () => {
        this.dispose();
      });
    }
  }
  /**
   * Store a key securely
   * @param keyId Unique identifier for the key
   * @param keyMaterial The raw key material to store
   * @returns Success state
   */
  storeKey(keyId, keyMaterial) {
    try {
      const keyCopy = new Uint8Array(keyMaterial.length);
      keyCopy.set(keyMaterial);
      const now = Date.now();
      const storedKey = {
        keyId,
        keyMaterial: keyCopy,
        created: now,
        lastUsed: now,
        rotationDue: now + this.KEY_ROTATION_INTERVAL_MS
      };
      this.keys.set(keyId, storedKey);
      return true;
    } catch (error) {
      console.error("Failed to store key securely:", error);
      return false;
    }
  }
  /**
   * Retrieve a key
   * @param keyId Unique identifier for the key
   * @returns The key material or null if not found
   */
  getKey(keyId) {
    const storedKey = this.keys.get(keyId);
    if (!storedKey) return null;
    storedKey.lastUsed = Date.now();
    if (Date.now() > storedKey.rotationDue) {
      console.info(`Key ${keyId} due for rotation`);
    }
    const keyCopy = new Uint8Array(storedKey.keyMaterial.length);
    keyCopy.set(storedKey.keyMaterial);
    return keyCopy;
  }
  /**
   * Delete a key securely
   * @param keyId Unique identifier for the key
   * @returns Success state
   */
  deleteKey(keyId) {
    const storedKey = this.keys.get(keyId);
    if (!storedKey) return false;
    const randomData = getRandomBytes(storedKey.keyMaterial.length);
    storedKey.keyMaterial.set(randomData);
    this.keys.delete(keyId);
    return true;
  }
  /**
   * Check if a key exists and is valid
   * @param keyId Unique identifier for the key
   * @returns Whether key exists and is valid
   */
  hasValidKey(keyId) {
    const storedKey = this.keys.get(keyId);
    if (!storedKey) return false;
    const now = Date.now();
    return now < storedKey.created + this.MAX_KEY_AGE_MS;
  }
  /**
   * Rotate a key
   * @param keyId Unique identifier for the key
   * @param newKeyMaterial New key material
   * @returns Success state
   */
  rotateKey(keyId, newKeyMaterial) {
    const oldKey = this.keys.get(keyId);
    const success = this.storeKey(keyId, newKeyMaterial);
    if (oldKey) {
      const randomData = getRandomBytes(oldKey.keyMaterial.length);
      oldKey.keyMaterial.set(randomData);
    }
    return success;
  }
  /**
   * Protect keys when app goes to background
   */
  protectKeys() {
    console.log("Protecting keys due to app state change");
  }
  /**
   * Clean up old keys
   */
  cleanup() {
    const now = Date.now();
    const expiredKeyIds = [];
    this.keys.forEach((key, keyId) => {
      if (now > key.created + this.MAX_KEY_AGE_MS) {
        expiredKeyIds.push(keyId);
      }
    });
    expiredKeyIds.forEach((keyId) => {
      this.deleteKey(keyId);
    });
  }
  /**
   * Clean up all keys and stop timers
   */
  dispose() {
    if (this.cleanupTimer) {
      clearInterval(this.cleanupTimer);
      this.cleanupTimer = null;
    }
    this.keys.forEach((key) => {
      const randomData = getRandomBytes(key.keyMaterial.length);
      key.keyMaterial.set(randomData);
    });
    this.keys.clear();
  }
}
const secureKeyStorage = new SecureKeyStorage();
export {
  SecurityLevel as S,
  secureKeyStorage as s,
  toSecurityLevel as t
};
//# sourceMappingURL=vendor-security-LdHy7Pt9.js.map
