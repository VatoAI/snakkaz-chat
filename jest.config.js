export default {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  roots: ['<rootDir>/src'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  setupFilesAfterEnv: ['<rootDir>/src/tests/setupTests.ts'],
  testMatch: [
    '**/__tests__/**/*.test.(ts|tsx|js|jsx)',
    '**/tests/**/*.test.(ts|tsx|js|jsx)',
  ],
  transform: {
    '^.+\\.(ts|tsx)$': ['ts-jest', { 
      tsconfig: {
        target: 'ES2020',
        lib: ['ES2020', 'DOM', 'DOM.Iterable'],
        module: 'CommonJS',
        moduleResolution: 'Node',
        jsx: 'react-jsx',
        esModuleInterop: true,
        allowSyntheticDefaultImports: true,
        skipLibCheck: true,
        strict: false,
        noImplicitAny: false,
        isolatedModules: true,
        baseUrl: '.',
        paths: {
          '@/*': ['./src/*']
        }
      },
      isolatedModules: true,
      useESM: false
    }],
    '^.+\\.(js|jsx)$': ['babel-jest', { configFile: './babel.config.cjs' }],
  },
  transformIgnorePatterns: [
    'node_modules/(?!(isows|@supabase|@tanstack|@floating-ui|@headlessui|@heroicons|@tailwindcss|@vitejs|@types|nanoid|p-retry|p-timeout|uint8arrays|is-network-error|peerjs|retry|otpauth|qrcode)/)',
  ],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node']
};
