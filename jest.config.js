export default {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  roots: ['<rootDir>/src'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$': 'jest-transform-stub'
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
      }
    }],
    '^.+\\.(js|jsx)$': 'babel-jest'
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  testTimeout: 60000, // Increased timeout for integration tests
  collectCoverageFrom: [
    'src/**/*.{ts,tsx,js,jsx}',
    '!src/**/*.d.ts',
    '!src/tests/**/*',
    '!src/vite-env.d.ts'
  ],
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov', 'html']
};
