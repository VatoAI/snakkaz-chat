import React, { ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { MemoryRouter, MemoryRouterProps } from 'react-router-dom';
import { AuthContext } from '@/contexts/AuthContext';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Mock auth context creator
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

// Create a custom render function that includes providers
interface CustomRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  routerProps?: MemoryRouterProps;
  initialEntries?: string[];
  authContext?: any;
}

const AllTheProviders: React.FC<{ 
  children: React.ReactNode; 
  routerProps?: MemoryRouterProps;
  authContext?: any;
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
  const authContext = options.authContext || createUnauthenticatedMockContext();
  return customRender(ui, {
    ...options,
    authContext,
  });
};

// Re-export everything from React Testing Library
export * from '@testing-library/react';

// Override the default render with our custom render
export { customRender as render, AllTheProviders };