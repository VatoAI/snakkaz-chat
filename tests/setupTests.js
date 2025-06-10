// Import testing library extensions
import '@testing-library/jest-dom';

// Mock environment variables for tests
process.env.VITE_SUPABASE_URL = 'https://test.supabase.co';
process.env.VITE_SUPABASE_ANON_KEY = 'test-anon-key-for-testing';
process.env.NODE_ENV = 'test';

// Mock ResizeObserver for testing environment
global.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));

// Mock IntersectionObserver for testing environment
global.IntersectionObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));

// Mock matchMedia for testing environment
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // deprecated
    removeListener: jest.fn(), // deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Mock Supabase client for testing
jest.mock('@/lib/supabaseClient', () => ({
  supabase: {
    auth: {
      signInWithPassword: jest.fn(),
      signUp: jest.fn(),
      signOut: jest.fn(),
      getUser: jest.fn(),
      onAuthStateChange: jest.fn(() => ({
        data: {
          subscription: {
            unsubscribe: jest.fn()
          }
        }
      })),
    },
    from: jest.fn(() => ({
      select: jest.fn().mockReturnThis(),
      insert: jest.fn().mockReturnThis(),
      update: jest.fn().mockReturnThis(),
      delete: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      single: jest.fn(),
    })),
  },
}));

// Mock CryptoKey constructor
global.CryptoKey = jest.fn().mockImplementation(function(type, algorithm) {
  this.type = type || 'secret';
  this.algorithm = algorithm || { name: 'AES-GCM' };
  this.extractable = true;
  this.usages = ['encrypt', 'decrypt'];
});

// Mock crypto for testing environment
const mockCrypto = {
  getRandomValues: jest.fn((arr) => {
    for (let i = 0; i < arr.length; i++) {
      arr[i] = Math.floor(Math.random() * 256);
    }
    return arr;
  }),
  subtle: {
    generateKey: jest.fn().mockResolvedValue({
      publicKey: new CryptoKey('public', { name: 'ECDH', namedCurve: 'P-256' }),
      privateKey: new CryptoKey('private', { name: 'ECDH', namedCurve: 'P-256' })
    }),
    importKey: jest.fn().mockResolvedValue(new CryptoKey('secret', { name: 'AES-GCM' })),
    exportKey: jest.fn().mockImplementation(() => ({
      kty: 'EC',
      crv: 'P-256',
      x: 'test-x-value-' + Math.random().toString(36).substring(7),
      y: 'test-y-value-' + Math.random().toString(36).substring(7),
      d: 'test-d-value-' + Math.random().toString(36).substring(7)
    })),
    encrypt: jest.fn().mockResolvedValue(new Uint8Array([5, 6, 7, 8])),
    decrypt: jest.fn().mockResolvedValue(new Uint8Array([9, 10, 11, 12])),
    sign: jest.fn().mockResolvedValue(new Uint8Array([13, 14, 15, 16])),
    verify: jest.fn().mockResolvedValue(true),
    deriveKey: jest.fn().mockResolvedValue(new CryptoKey('secret', { name: 'AES-GCM' })),
    deriveBits: jest.fn().mockResolvedValue(new Uint8Array([17, 18, 19, 20])),
  },
};

Object.defineProperty(window, 'crypto', {
  value: mockCrypto,
});

Object.defineProperty(global, 'crypto', {
  value: mockCrypto,
});

// Mock localStorage for testing
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

// Mock sessionStorage for testing
const sessionStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};

Object.defineProperty(window, 'sessionStorage', {
  value: sessionStorageMock,
});

// Mock console methods to reduce test noise
const originalConsoleError = console.error;
const originalConsoleWarn = console.warn;

beforeEach(() => {
  // Reset all mocks before each test
  jest.clearAllMocks();
  
  // Suppress console errors/warnings during tests unless they're expected
  console.error = jest.fn();
  console.warn = jest.fn();
});

afterEach(() => {
  // Restore console methods
  console.error = originalConsoleError;
  console.warn = originalConsoleWarn;
});
