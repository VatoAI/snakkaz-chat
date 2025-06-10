import React, { ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { MemoryRouter, MemoryRouterProps } from 'react-router-dom';
import { AuthProvider } from '@/contexts/AuthContext';
import { ToastProvider } from '@/components/ui/toast';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Create a custom render function that includes providers
interface CustomRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  routerProps?: MemoryRouterProps;
  initialEntries?: string[];
}

const AllTheProviders: React.FC<{ children: React.ReactNode; routerProps?: MemoryRouterProps }> = ({ 
  children, 
  routerProps = {} 
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
        <ToastProvider>
          <AuthProvider>
            {children}
          </AuthProvider>
        </ToastProvider>
      </QueryClientProvider>
    </MemoryRouter>
  );
};

const customRender = (
  ui: ReactElement,
  options: CustomRenderOptions = {}
) => {
  const { routerProps, ...renderOptions } = options;
  
  return render(ui, {
    wrapper: ({ children }) => (
      <AllTheProviders routerProps={routerProps}>
        {children}
      </AllTheProviders>
    ),
    ...renderOptions,
  });
};

// Mock data generators
export const createMockUser = (overrides = {}) => ({
  id: 'user-123',
  email: 'test@snakkaz.no',
  username: 'testuser',
  full_name: 'Test User',
  avatar_url: null,
  created_at: '2025-06-08T10:00:00Z',
  last_seen: '2025-06-08T12:00:00Z',
  ...overrides,
});

export const createMockMessage = (overrides = {}) => ({
  id: 'msg-123',
  content: 'Test message',
  sender_id: 'user-123',
  chat_id: 'chat-456',
  message_type: 'text',
  is_encrypted: false,
  created_at: '2025-06-08T10:00:00Z',
  updated_at: '2025-06-08T10:00:00Z',
  ...overrides,
});

export const createMockChat = (overrides = {}) => ({
  id: 'chat-456',
  name: 'Test Chat',
  is_group: false,
  created_by: 'user-123',
  created_at: '2025-06-08T10:00:00Z',
  last_message_at: '2025-06-08T12:00:00Z',
  ...overrides,
});

// Mock Supabase responses
export const mockSupabaseSuccess = (data: any) => ({
  data,
  error: null,
});

export const mockSupabaseError = (message: string) => ({
  data: null,
  error: { message },
});

// Common test assertions
export const expectToastMessage = async (message: string) => {
  const { findByText } = await import('@testing-library/react');
  const toast = await findByText(new RegExp(message, 'i'));
  expect(toast).toBeInTheDocument();
};

export const expectLoadingState = (container: HTMLElement) => {
  const loadingElement = container.querySelector('[data-testid="loading"]') || 
                        container.querySelector('.loading') ||
                        container.querySelector('[aria-label*="loading"]');
  expect(loadingElement).toBeInTheDocument();
};

export const expectErrorState = (container: HTMLElement, errorMessage?: string) => {
  const errorElement = container.querySelector('[data-testid="error"]') || 
                      container.querySelector('.error') ||
                      container.querySelector('[role="alert"]');
  expect(errorElement).toBeInTheDocument();
  
  if (errorMessage) {
    expect(errorElement).toHaveTextContent(new RegExp(errorMessage, 'i'));
  }
};

// Utility for testing async operations
export const waitForAsyncOperation = async (operation: () => Promise<any>) => {
  const { waitFor } = await import('@testing-library/react');
  await waitFor(async () => {
    await operation();
  });
};

// Mock localStorage for testing
export const mockLocalStorage = () => {
  const store: { [key: string]: string } = {};
  
  return {
    getItem: jest.fn((key: string) => store[key] || null),
    setItem: jest.fn((key: string, value: string) => {
      store[key] = value.toString();
    }),
    removeItem: jest.fn((key: string) => {
      delete store[key];
    }),
    clear: jest.fn(() => {
      Object.keys(store).forEach(key => delete store[key]);
    }),
  };
};

// Mock intersection observer for testing
export const mockIntersectionObserver = () => {
  const observe = jest.fn();
  const unobserve = jest.fn();
  const disconnect = jest.fn();

  beforeEach(() => {
    window.IntersectionObserver = jest.fn(() => ({
      observe,
      unobserve,
      disconnect,
    })) as any;
  });

  return { observe, unobserve, disconnect };
};

// Mock crypto for encryption tests
export const mockCryptoAPI = () => {
  const mockCrypto = {
    getRandomValues: jest.fn((arr: Uint8Array) => {
      for (let i = 0; i < arr.length; i++) {
        arr[i] = Math.floor(Math.random() * 256);
      }
      return arr;
    }),
    subtle: {
      generateKey: jest.fn().mockResolvedValue({
        publicKey: { type: 'public' },
        privateKey: { type: 'private' },
      }),
      encrypt: jest.fn().mockResolvedValue(new ArrayBuffer(32)),
      decrypt: jest.fn().mockResolvedValue(new ArrayBuffer(32)),
      exportKey: jest.fn().mockResolvedValue(new ArrayBuffer(32)),
      importKey: jest.fn().mockResolvedValue({ type: 'public' }),
    },
  };

  Object.defineProperty(window, 'crypto', { value: mockCrypto });
  Object.defineProperty(global, 'crypto', { value: mockCrypto });

  return mockCrypto;
};

// Re-export everything from React Testing Library
export * from '@testing-library/react';

// Override the default render with our custom render
export { customRender as render, AllTheProviders };
