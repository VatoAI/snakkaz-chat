/**
 * Import.meta environment setup for Jest
 * 
 * This file sets up a mock import.meta object for Jest testing since
 * Jest doesn't support import.meta natively.
 */

// Mock environment variables that would normally come from Vite
const mockEnv = {
  DEV: false, // Set to false for testing to avoid dev-specific code
  PROD: true,
  MODE: 'test',
  VITE_SUPABASE_URL: 'https://localhost:54321',
  VITE_SUPABASE_ANON_KEY: 'test-anon-key-for-jest',
  VITE_SUPABASE_SERVICE_ROLE_KEY: 'test-service-role-key-for-jest',
  VITE_APP_NAME: 'Snakkaz Chat Test',
  VITE_APP_VERSION: '1.0.0-test',
  VITE_PUBLIC_URL: 'http://localhost:3000',
  VITE_API_URL: 'http://localhost:54321',
};

// Create the import.meta mock object
const importMeta = {
  env: mockEnv,
  url: 'file:///jest-test-environment',
  hot: undefined, // HMR not available in Jest
  glob: jest.fn(() => ({})), // Mock glob function
};

// Set up global import.meta for Jest environment
Object.defineProperty(globalThis, 'import', {
  value: {
    meta: importMeta,
  },
  writable: true,
  configurable: true,
});

// Also set it on global for older Node.js versions
if (typeof global !== 'undefined') {
  global.import = { meta: importMeta };
}

// Additional setup for window object (for browser-like environment)
if (typeof window !== 'undefined') {
  window.import = { meta: importMeta };
}

// Set import.meta directly as a global for better compatibility
globalThis['import.meta'] = importMeta;

console.log('Import.meta setup complete for Jest environment');
