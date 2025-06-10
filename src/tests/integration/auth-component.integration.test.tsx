import React from 'react';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { render } from '../../../tests/testUtils';
import { EnhancedLoginForm } from '@/features/auth/components/EnhancedLoginForm';

// Mock the auth hook
const mockSignUp = jest.fn();
const mockSignIn = jest.fn();
const mockCompleteTwoFactorAuth = jest.fn();

jest.mock('@/features/auth/hooks/useAuth', () => ({
  useAuth: () => ({
    signIn: mockSignIn,
    signUp: mockSignUp,
    completeTwoFactorAuth: mockCompleteTwoFactorAuth,
    loading: false,
  }),
}));

describe('Authentication Flow Component Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Registration Flow', () => {
    it('should complete registration process', async () => {
      const user = userEvent.setup();
      
      // Mock successful registration
      mockSignUp.mockResolvedValue(undefined);

      render(<EnhancedLoginForm />);

      // Switch to register mode
      const registerToggle = screen.getByText(/registrer deg/i);
      await user.click(registerToggle);

      // Wait for the form to switch to register mode
      await waitFor(() => {
        expect(screen.getByText(/registrer deg/i, { selector: 'h2' })).toBeInTheDocument();
      });

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

      // Verify registration was called
      await waitFor(() => {
        expect(mockSignUp).toHaveBeenCalledWith(
          'test@snakkaz.no',
          'SecurePass123!',
          { username: 'test' }
        );
      });
    });

    it('should show validation errors', async () => {
      const user = userEvent.setup();
      
      render(<EnhancedLoginForm />);

      // Switch to register mode
      const registerToggle = screen.getByText(/registrer deg/i);
      await user.click(registerToggle);

      // Try to submit without filling form
      const submitButton = screen.getByRole('button', { name: /registrer/i });
      await user.click(submitButton);

      // Should show validation errors
      await waitFor(() => {
        expect(screen.getByText(/e-post er påkrevd/i)).toBeInTheDocument();
      });
    });
  });

  describe('Login Flow', () => {
    it('should complete login process', async () => {
      const user = userEvent.setup();
      
      // Mock successful login
      mockSignIn.mockResolvedValue(undefined);

      render(<EnhancedLoginForm />);

      // Fill out login form
      const emailInput = screen.getByLabelText(/e-post/i);
      const passwordInput = screen.getByLabelText(/passord/i);

      await user.type(emailInput, 'test@snakkaz.no');
      await user.type(passwordInput, 'SecurePass123!');

      // Submit login
      const submitButton = screen.getByRole('button', { name: /logg inn/i });
      await user.click(submitButton);

      // Verify login was called
      await waitFor(() => {
        expect(mockSignIn).toHaveBeenCalledWith('test@snakkaz.no', 'SecurePass123!');
      });
    });
  });
});
