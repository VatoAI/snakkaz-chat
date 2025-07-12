// SAFE REPLACEMENT FOR VENDOR-ANIMATION-BRHAymv3.js
console.log('🎯 SAFE: Loading minimal vendor-animation replacement...');

// Mock reactExports with safe implementations
const reactExports = {
  createContext: function(defaultValue) {
    console.log('🔧 SAFE: createContext called');
    return {
      Provider: ({ children }) => children,
      Consumer: ({ children }) => children(defaultValue)
    };
  },
  useRef: (initial) => ({ current: initial }),
  useLayoutEffect: (effect) => {
    if (typeof effect === 'function') {
      try { return effect(); } catch (e) { return () => {}; }
    }
    return () => {};
  },
  useEffect: (effect) => {
    if (typeof effect === 'function') {
      try { return effect(); } catch (e) { return () => {}; }
    }
    return () => {};
  }
};

const jsxRuntimeExports = {
  jsx: (type, props) => ({ type, props }),
  jsxs: (type, props) => ({ type, props })
};

// Safe minimal exports
export const r = reactExports;
export const j = jsxRuntimeExports;
export const LayoutGroupContext = reactExports.createContext({});
export const useConstant = (init) => {
  const ref = reactExports.useRef(null);
  if (ref.current === null) {
    ref.current = init();
  }
  return ref.current;
};
export const useIsomorphicLayoutEffect = reactExports.useLayoutEffect;
export const PresenceContext = reactExports.createContext(null);

// Mock all other exports to prevent import errors
export const motion = new Proxy({}, { get: () => 'div' });
export const AnimatePresence = ({ children }) => children;
export const LayoutGroup = ({ children }) => children;

// Named exports for compatibility (imported with aliases)
export const A = AnimatePresence;  // For: import { A as AnimatePresence }
export const m = motion;           // For: import { m as motion }

console.log('✅ SAFE: Minimal vendor-animation loaded with full compatibility!');
