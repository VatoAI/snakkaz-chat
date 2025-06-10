import React from 'react';
import { screen, fireEvent, waitFor } from '@testing-library/react';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import App from '@/App';

// Mock Supabase client with jest.fn() functions defined inline
jest.mock('@/lib/supabaseClient', () => ({
  supabase: {
    auth: {
      signInWithPassword: jest.fn(),
      signUp: jest.fn(),
      signOut: jest.fn(),
      getUser: jest.fn(),
      getSession: jest.fn(),
      onAuthStateChange: jest.fn(() => ({
        data: { subscription: { unsubscribe: jest.fn() } },
      })),
    },
    from: jest.fn(() => ({
      select: jest.fn().mockReturnThis(),
      insert: jest.fn().mockReturnThis(),
      update: jest.fn().mockReturnThis(),
      delete: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      single: jest.fn().mockResolvedValue({ data: null, error: null }),
    })),
  },
}));

const renderApp = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  return render(
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  );
};

describe('Authentication Flow Integration Tests', () => {
  let mockSignUp: jest.Mock;
  let mockSignInWithPassword: jest.Mock;
  let mockGetUser: jest.Mock;
  let mockSignOut: jest.Mock;
  let mockGetSession: jest.Mock;

  beforeEach(() => {
    // Get references to the mocked functions
    const { supabase } = require('@/lib/supabaseClient');
    mockSignUp = supabase.auth.signUp;
    mockSignInWithPassword = supabase.auth.signInWithPassword;
    mockGetUser = supabase.auth.getUser;
    mockSignOut = supabase.auth.signOut;
    mockGetSession = supabase.auth.getSession;

    jest.clearAllMocks();
    localStorage.clear();
    sessionStorage.clear();
    
    // Set up default mock returns
    mockGetSession.mockResolvedValue({ data: { session: null }, error: null });
    mockSignUp.mockResolvedValue({
      data: { 
        user: { 
          id: 'user-123', 
          email: 'test@snakkaz.no',
          email_confirmed_at: null 
        } 
      },
      error: null,
    });
  });

  describe('User Registration Flow', () => {
    it('should complete full registration process', async () => {
      const user = userEvent.setup();
      
      renderApp();

      // Wait for the app to finish loading
      await waitFor(() => {
        expect(screen.queryByText(/laster inn/i)).not.toBeInTheDocument();
      }, { timeout: 10000 });

      // Debug: Log what's actually rendered
      console.log("Page content after loading:", document.body.textContent?.substring(0, 500));

      // Navigate to registration by clicking the toggle link
      const registerToggle = screen.getByText(/registrer deg/i);
      await user.click(registerToggle);

      // Fill out registration form
      const emailInput = screen.getByLabelText(/^e-post$/i);
      const passwordInput = screen.getByLabelText(/^passord$/i);
      const confirmPasswordInput = screen.getByLabelText(/bekreft passord/i);

      await user.type(emailInput, 'test@snakkaz.no');
      await user.type(passwordInput, 'SecurePass123!');
      await user.type(confirmPasswordInput, 'SecurePass123!');

      // Submit registration
      const submitButton = screen.getByRole('button', { name: /registrer/i });
      await user.click(submitButton);

      // Verify registration was called with correct data
      expect(mockSignUp).toHaveBeenCalledWith({
        email: 'test@snakkaz.no',
        password: 'SecurePass123!',
        options: {
          data: { username: 'test' }, // The form might include username from email prefix
        },
      });

      // Should show email confirmation message
      await waitFor(() => {
        expect(screen.getByText(/sjekk e-posten din/i)).toBeInTheDocument();
      });
    });

    it('should handle registration errors', async () => {
      const user = userEvent.setup();
      
      // Mock registration error
      mockSignUp.mockResolvedValue({
        data: null,
        error: { message: 'Email already exists' },
      });

      renderApp();

      // Navigate to registration and fill form
      const registerLink = screen.getByText(/registrer deg/i);
      await user.click(registerLink);

      const emailInput = screen.getByLabelText(/e-post/i);
      const passwordInput = screen.getByLabelText(/passord/i);
      const confirmPasswordInput = screen.getByLabelText(/bekreft passord/i);

      await user.type(emailInput, 'existing@snakkaz.no');
      await user.type(passwordInput, 'SecurePass123!');
      await user.type(confirmPasswordInput, 'SecurePass123!');

      const submitButton = screen.getByRole('button', { name: /registrer/i });
      await user.click(submitButton);

      // Should show error message
      await waitFor(() => {
        expect(screen.getByText(/email already exists/i)).toBeInTheDocument();
      });
    });
  });

  describe('User Login Flow', () => {
    it('should complete successful login process', async () => {
      const user = userEvent.setup();
      
      // Mock successful login
      mockSignInWithPassword.mockResolvedValue({
        data: { 
          user: { 
            id: 'user-123', 
            email: 'test@snakkaz.no',
            email_confirmed_at: '2025-06-08T10:00:00Z'
          } 
        },
        error: null,
      });

      mockGetUser.mockResolvedValue({
        data: { 
          user: { 
            id: 'user-123', 
            email: 'test@snakkaz.no' 
          } 
        },
        error: null,
      });

      renderApp();

      // Fill login form
      const emailInput = screen.getByLabelText(/e-post/i);
      const passwordInput = screen.getByLabelText(/passord/i);

      await user.type(emailInput, 'test@snakkaz.no');
      await user.type(passwordInput, 'SecurePass123!');

      // Submit login
      const loginButton = screen.getByRole('button', { name: /logg inn/i });
      await user.click(loginButton);

      // Verify login was called
      expect(mockSignInWithPassword).toHaveBeenCalledWith({
        email: 'test@snakkaz.no',
        password: 'SecurePass123!',
      });

      // Should redirect to dashboard or show success
      await waitFor(() => {
        expect(window.location.pathname).toBe('/dashboard');
      }, { timeout: 3000 });
    });

    it('should handle login errors', async () => {
      const user = userEvent.setup();
      
      // Mock login error
      mockSignInWithPassword.mockResolvedValue({
        data: null,
        error: { message: 'Invalid credentials' },
      });

      renderApp();

      // Fill login form with invalid credentials
      const emailInput = screen.getByLabelText(/e-post/i);
      const passwordInput = screen.getByLabelText(/passord/i);

      await user.type(emailInput, 'wrong@snakkaz.no');
      await user.type(passwordInput, 'wrongpassword');

      const loginButton = screen.getByRole('button', { name: /logg inn/i });
      await user.click(loginButton);

      // Should show error message
      await waitFor(() => {
        expect(screen.getByText(/invalid credentials/i)).toBeInTheDocument();
      });
    });
  });

  describe('Two-Factor Authentication Flow', () => {
    it('should prompt for 2FA after login', async () => {
      const user = userEvent.setup();
      
      // Mock login that requires 2FA
      mockSignInWithPassword.mockResolvedValue({
        data: { 
          user: { 
            id: 'user-123', 
            email: 'test@snakkaz.no',
            user_metadata: { requires_2fa: true }
          } 
        },
        error: null,
      });

      renderApp();

      // Login with valid credentials
      const emailInput = screen.getByLabelText(/e-post/i);
      const passwordInput = screen.getByLabelText(/passord/i);

      await user.type(emailInput, 'test@snakkaz.no');
      await user.type(passwordInput, 'SecurePass123!');

      const loginButton = screen.getByRole('button', { name: /logg inn/i });
      await user.click(loginButton);

      // Should show 2FA verification screen
      await waitFor(() => {
        expect(screen.getByText(/tofaktor autentisering/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/6-sifret kode/i)).toBeInTheDocument();
      });
    });
  });

  describe('Session Management', () => {
    it('should handle session expiration', async () => {
      // Mock expired session
      mockGetUser.mockResolvedValue({
        data: { user: null },
        error: { message: 'Session expired' },
      });

      renderApp();

      // Should redirect to login
      await waitFor(() => {
        expect(screen.getByLabelText(/e-post/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/passord/i)).toBeInTheDocument();
      });
    });

    it('should handle logout properly', async () => {
      const user = userEvent.setup();
      
      // Mock authenticated user
      mockGetUser.mockResolvedValue({
        data: { 
          user: { 
            id: 'user-123', 
            email: 'test@snakkaz.no' 
          } 
        },
        error: null,
      });

      mockSignOut.mockResolvedValue({
        error: null,
      });

      renderApp();

      // Assume user is logged in and logout button is visible
      const logoutButton = screen.getByRole('button', { name: /logg ut/i });
      await user.click(logoutButton);

      // Should call signOut and redirect to login
      expect(mockSignOut).toHaveBeenCalled();
      
      await waitFor(() => {
        expect(screen.getByLabelText(/e-post/i)).toBeInTheDocument();
      });
    });
  });
});
