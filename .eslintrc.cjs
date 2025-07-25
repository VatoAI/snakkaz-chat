module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true
  },
  extends: [
    'eslint:recommended'
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true
    }
  },
  rules: {
    'no-unused-vars': 'warn',
    'no-console': 'off',
    'no-empty': 'warn'
  },
  ignorePatterns: [
    'dist/**',
    'node_modules/**',
    'coverage/**',
    'build/**',
    'docs/**',
    'scripts/**',
    'tools/**',
    'mcp-server/**',
    'emergency-fixes/**',
    'deployment-package/**',
    'snakkaz-production-fresh-deploy/**',
    'public/**',
    'babel.config.js',
    'jest.config.js',
    'vite.config.js',
    'eslint.config.js',
    '*.config.js',
    '*.config.mjs',
    '*.config.cjs'
  ]
};
