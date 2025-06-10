import React from 'react';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithoutAuth, createMockAuthContext } from '../../../tests/testUtils';
import { EnhancedLoginForm } from '@/features/auth/components/EnhancedLoginForm';

// Mock the useAuth hook from the features/auth directory
const mockSignIn = jest.fn();
const mockSignUp = jest.fn();
const mockCompleteTwoFactorAuth = jest.fn();

jest.mock('@/features/auth/hooks/useAuth', () => ({
  useAuth: () => ({
    user: null,
    signIn: mockSignIn,
    signUp: mockSignUp,
    completeTwoFactorAuth: mockCompleteTwoFactorAuth,
    loading: false,
    error: null,
  }),
}));

// Mock the MathCaptcha component
jest.mock('@/components/auth/MathCaptcha', () => ({
  MathCaptcha: ({ onVerificationChange }: { onVerificationChange: (valid: boolean, token: string) => void }) => {
    // Auto-trigger verification success for tests immediately
    onVerificationChange(true, 'test-token');
    
    return null; // Return a simple element
  }
}));

describe('Authentication Flow Component Tests', () => {
  beforeEach(() => {
    mockSignIn.mockClear();
    mockSignUp.mockClear();
    mockCompleteTwoFactorAuth.mockClear();
    
    // Reset mock implementations
    mockSignIn.mockResolvedValue(undefined);
    mockSignUp.mockResolvedValue(undefined);
    mockCompleteTwoFactorAuth.mockResolvedValue(undefined);
  });

  describe('Registration Flow', () => {
    it('should complete registration process', async () => {
      const user = userEvent.setup();

      const { container } = renderWithoutAuth(<EnhancedLoginForm />);

      // Initially should show login form - check for login title
      expect(screen.getByRole('heading', { name: /logg inn/i })).toBeInTheDocument();

      // Click to switch to registration mode
      const registerButton = screen.getByRole('button', { name: /registrer deg/i });
      await user.click(registerButton);

      // Wait for the form to switch to register mode
      await waitFor(() => {
        expect(screen.getByRole('heading', { name: /registrer deg/i })).toBeInTheDocument();
      });

      // Fill registration form
      const emailInput = screen.getByLabelText(/e-post/i);
      const passwordInput = screen.getByLabelText(/^passord$/i);
      const confirmPasswordInput = screen.getByLabelText(/bekreft passord/i);

      await user.type(emailInput, 'test@snakkaz.no');
      await user.type(passwordInput, 'SecurePass123!');
      await user.type(confirmPasswordInput, 'SecurePass123!');

      // Submit registration - use the main submit button
      const submitButton = screen.getByRole('button', { name: /registrer$/i });
      await user.click(submitButton);

      // Verify registration was called
      await waitFor(() => {
        expect(mockSignUp).toHaveBeenCalledWith(
          'test@snakkaz.no',
          'SecurePass123!',
          expect.objectContaining({
            username: 'test'
          })
        );
      });
    });
  });

  describe('Login Flow', () => {
    it('should complete login process', async () => {
      const user = userEvent.setup();

      renderWithoutAuth(<EnhancedLoginForm />);

      // Fill login form
      const emailInput = screen.getByLabelText(/e-post/i);
      const passwordInput = screen.getByLabelText(/passord/i);

      await user.type(emailInput, 'test@snakkaz.no');
      await user.type(passwordInput, 'SecurePass123!');

      // Submit login - use the main submit button (should say "Logg inn" when in login mode)
      const submitButton = screen.getByRole('button', { name: /^logg inn$/i });
      await user.click(submitButton);

      // Verify login was called
      await waitFor(() => {
        expect(mockSignIn).toHaveBeenCalledWith('test@snakkaz.no', 'SecurePass123!');
      });
    });
  });
});