// Mock auth context for testing
export const createMockAuthContext = (overrides = {}) => ({
  user: null,
  isLoading: false,
  error: null,
  signIn: jest.fn().mockResolvedValue(undefined),
  signOut: jest.fn().mockResolvedValue(undefined),
  signUp: jest.fn().mockResolvedValue(undefined),
  resetPassword: jest.fn().mockResolvedValue(undefined),
  updateProfile: jest.fn().mockResolvedValue(undefined),
  updatePassword: jest.fn().mockResolvedValue(undefined),
  enableEncryption: jest.fn().mockResolvedValue(undefined),
  upgradeToPremuim: jest.fn().mockResolvedValue(undefined),
  ...overrides,
});

export const mockAuthenticatedUser = {
  id: 'test-user-id',
  email: 'test@snakkaz.no',
  user_metadata: {
    full_name: 'Test User',
    username: 'testuser',
  },
  created_at: '2025-06-08T10:00:00Z',
  updated_at: '2025-06-08T10:00:00Z',
};

export const createAuthenticatedMockContext = (userOverrides = {}) => 
  createMockAuthContext({
    user: { ...mockAuthenticatedUser, ...userOverrides },
    isLoading: false,
  });

export const createUnauthenticatedMockContext = () => 
  createMockAuthContext({
    user: null,
    isLoading: false,
  });

export const createLoadingMockContext = () => 
  createMockAuthContext({
    user: null,
    isLoading: true,
  });
