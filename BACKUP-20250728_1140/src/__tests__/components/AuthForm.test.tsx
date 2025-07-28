import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { AuthProvider } from '@/contexts/AuthContext';
import { ToastProvider } from '@/components/ui/toast';
import { EnhancedLoginForm } from '@/features/auth/components/EnhancedLoginForm';

// Mock the useAuth hook
const mockUseAuth = jest.fn();

jest.mock('@/contexts/AuthContext', () => ({
  ...jest.requireActual('@/contexts/AuthContext'),
  useAuth: () => mockUseAuth(),
}));

// Also mock the features auth hook
jest.mock('@/features/auth/hooks/useAuth', () => ({
  useAuth: () => mockUseAuth(),
}));

const renderWithProviders = (component: React.ReactElement) => {
  return render(
    <MemoryRouter>
      <ToastProvider>
        <AuthProvider>
          {component}
        </AuthProvider>
      </ToastProvider>
    </MemoryRouter>
  );
};

describe('AuthForm Component', () => {
  beforeEach(() => {
    // Set default mock return value
    mockUseAuth.mockReturnValue({
      signIn: jest.fn(),
      signUp: jest.fn(),
      completeTwoFactorAuth: jest.fn(),
      loading: false,
      user: null,
    });
  });
  it('renders login form by default', () => {
    renderWithProviders(<EnhancedLoginForm />);
    
    expect(screen.getByLabelText(/e-post/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/passord/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /logg inn/i })).toBeInTheDocument();
  });

  it('toggles between login and register modes', async () => {
    renderWithProviders(<EnhancedLoginForm />);
    
    // Initially in login mode
    expect(screen.getByRole('button', { name: /logg inn/i })).toBeInTheDocument();
    
    // Click register link
    const registerLink = screen.getByText(/registrer deg/i);
    fireEvent.click(registerLink);
    
    // Should switch to register mode
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /registrer/i })).toBeInTheDocument();
    });
  });

  it('validates required fields', async () => {
    renderWithProviders(<EnhancedLoginForm />);
    
    // First solve the CAPTCHA to get past that validation
    const captchaInput = screen.getByPlaceholderText('?');
    const mathElements = screen.getAllByText(/\d+/);
    const number1 = parseInt(mathElements[0].textContent || '0');
    const number2 = parseInt(mathElements[1].textContent || '0');
    const answer = number1 + number2;
    fireEvent.change(captchaInput, { target: { value: answer.toString() } });
    
    const submitButton = screen.getByRole('button', { name: /logg inn/i });
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText(/e-post er påkrevd/i)).toBeInTheDocument();
      expect(screen.getByText(/passord er påkrevd/i)).toBeInTheDocument();
    });
  });

  it('validates email format', async () => {
    renderWithProviders(<EnhancedLoginForm />);
    
    const emailInput = screen.getByLabelText(/e-post/i);
    fireEvent.change(emailInput, { target: { value: 'invalid-email' } });
    fireEvent.blur(emailInput);
    
    await waitFor(() => {
      expect(screen.getByText(/ugyldig e-post format/i)).toBeInTheDocument();
    });
  });

  it('shows password requirements in register mode', async () => {
    renderWithProviders(<EnhancedLoginForm />);
    
    // Switch to register mode
    const registerLink = screen.getByText(/registrer deg/i);
    fireEvent.click(registerLink);
    
    await waitFor(() => {
      // Wait for register mode to be active
      expect(screen.getByText(/registrer deg/i)).toBeInTheDocument();
    });
    
    // Focus on the main password input (not confirm password)
    const passwordInput = document.getElementById('password');
    if (passwordInput) {
      fireEvent.focus(passwordInput);
    }
    
    await waitFor(() => {
      expect(screen.getByText(/minst 8 tegn/i)).toBeInTheDocument();
      expect(screen.getByText(/minst en stor bokstav/i)).toBeInTheDocument();
      expect(screen.getByText(/minst ett tall/i)).toBeInTheDocument();
    });
  });

  it('disables submit button when loading', () => {
    // Mock loading state
    mockUseAuth.mockReturnValue({
      signIn: jest.fn(),
      signUp: jest.fn(),
      completeTwoFactorAuth: jest.fn(),
      loading: true,
      user: null,
    });
    
    renderWithProviders(<EnhancedLoginForm />);
    
    const submitButton = screen.getByRole('button', { name: /logger inn/i });
    expect(submitButton).toBeDisabled();
  });
});
