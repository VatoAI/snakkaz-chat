import React, { ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { MemoryRouter, MemoryRouterProps } from 'react-router-dom';
import { AuthContext } from '@/contexts/AuthContext';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Mock auth context types
interface MockAuthContextType {
  user: any;
  isLoading: boolean;
  error: string | null;
  signIn: jest.Mock;
  signOut: jest.Mock;
  signUp: jest.Mock;
  resetPassword: jest.Mock;
  updateProfile: jest.Mock;
  updatePassword: jest.Mock;
  enableEncryption: jest.Mock;
  upgradeToPremuim: jest.Mock;
}

// Create default mock auth context
export const createMockAuthContext = (overrides: Partial<MockAuthContextType> = {}): MockAuthContextType => ({
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

// Mock authenticated user
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

// Helper functions for different auth states
export const createAuthenticatedMockContext = (userOverrides = {}): MockAuthContextType => 
  createMockAuthContext({
    user: { ...mockAuthenticatedUser, ...userOverrides },
    isLoading: false,
  });

export const createUnauthenticatedMockContext = (): MockAuthContextType => 
  createMockAuthContext({
    user: null,
    isLoading: false,
  });

export const createLoadingMockContext = (): MockAuthContextType => 
  createMockAuthContext({
    user: null,
    isLoading: true,
  });

// Custom render options
interface CustomRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  routerProps?: MemoryRouterProps;
  initialEntries?: string[];
  authContext?: MockAuthContextType;
}

// All providers wrapper
const AllTheProviders: React.FC<{ 
  children: React.ReactNode; 
  routerProps?: MemoryRouterProps;
  authContext?: MockAuthContextType;
}> = ({ 
  children, 
  routerProps = {},
  authContext = createUnauthenticatedMockContext()
}) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  return (
    <MemoryRouter {...routerProps}>
      <QueryClientProvider client={queryClient}>
        <AuthContext.Provider value={authContext}>
          {children}
        </AuthContext.Provider>
      </QueryClientProvider>
    </MemoryRouter>
  );
};

// Custom render function
const customRender = (
  ui: ReactElement,
  options: CustomRenderOptions = {}
) => {
  const { routerProps, authContext, ...renderOptions } = options;
  
  return render(ui, {
    wrapper: ({ children }) => (
      <AllTheProviders 
        routerProps={routerProps}
        authContext={authContext}
      >
        {children}
      </AllTheProviders>
    ),
    ...renderOptions,
  });
};

// Helper functions for common test scenarios
export const renderWithAuth = (ui: ReactElement, userOverrides = {}, options: CustomRenderOptions = {}) => {
  return customRender(ui, {
    ...options,
    authContext: createAuthenticatedMockContext(userOverrides),
  });
};

export const renderWithoutAuth = (ui: ReactElement, options: CustomRenderOptions = {}) => {
  return customRender(ui, {
    ...options,
    authContext: createUnauthenticatedMockContext(),
  });
};

export const renderWithLoading = (ui: ReactElement, options: CustomRenderOptions = {}) => {
  return customRender(ui, {
    ...options,
    authContext: createLoadingMockContext(),
  });
};

// Re-export everything from React Testing Library
export * from '@testing-library/react';

// Override the default render with our custom render
export { customRender as render, AllTheProviders };
