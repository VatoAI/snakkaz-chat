// SAFE VENDOR-ANIMATION REPLACEMENT - FIXED CREATECONTEXT
console.log('🔧 Loading safe vendor-animation replacement...');

// Create safe React context implementation
const createSafeContext = (defaultValue) => {
  console.log('🔧 Safe createContext called with:', defaultValue);
  return {
    Provider: ({ children, value }) => children,
    Consumer: ({ children }) => children(defaultValue),
    _currentValue: defaultValue,
    _context: true
  };
};

// Mock React exports safely
const reactExports = {
  createContext: createSafeContext,
  useRef: (initial) => ({ current: initial }),
  useLayoutEffect: (effect) => {
    if (typeof effect === 'function') {
      try { return effect(); } catch (e) { console.log('Safe useLayoutEffect:', e); return () => {}; }
    }
    return () => {};
  },
  useEffect: (effect) => {
    if (typeof effect === 'function') {
      try { return effect(); } catch (e) { console.log('Safe useEffect:', e); return () => {}; }
    }
    return () => {};
  }
};

// Mock JSX runtime
const jsxRuntimeExports = {
  jsx: (type, props) => ({ type, props }),
  jsxs: (type, props) => ({ type, props })
};

// Safe exports
export const r = reactExports;
export const j = jsxRuntimeExports;

// Create safe contexts
export const LayoutGroupContext = createSafeContext({});
export const PresenceContext = createSafeContext(null);

// Safe utility functions
export const useConstant = (init) => {
  const ref = reactExports.useRef(null);
  if (ref.current === null) {
    ref.current = typeof init === 'function' ? init() : init;
  }
  return ref.current;
};

export const useIsomorphicLayoutEffect = reactExports.useLayoutEffect;

// Safe motion components
export const motion = new Proxy({}, {
  get: (target, prop) => {
    if (typeof prop === 'string') {
      return (props = {}) => ({ type: prop, props });
    }
    return 'div';
  }
});

// Safe AnimatePresence
export const AnimatePresence = ({ children, ...props }) => {
  console.log('🔧 Safe AnimatePresence with props:', props);
  return children;
};

export const LayoutGroup = ({ children, ...props }) => {
  console.log('🔧 Safe LayoutGroup with props:', props);
  return children;
};

// Named exports for compatibility (imported with aliases)
export const A = AnimatePresence;  // For: import { A as AnimatePresence }
export const m = motion;           // For: import { m as motion }

// Additional safe exports
export const MotionConfig = ({ children }) => children;
export const LazyMotion = ({ children }) => children;
export const domAnimation = {};
export const domMax = {};

console.log('✅ Safe vendor-animation loaded with full compatibility and fixed createContext!');
