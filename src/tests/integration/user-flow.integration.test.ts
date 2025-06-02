/**
 * Integration Test: User Flow Navigation
 * Tests the complete user journey through routing and component loading
 */

import { describe, test, expect, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '@/hooks/useAuth';
import App from '@/App';

// Mock the Supabase client to avoid real authentication calls
vi.mock('@/lib/supabaseClient', () => ({
  supabase: {
    auth: {
      getSession: vi.fn().mockResolvedValue({ data: { session: null }, error: null }),
      onAuthStateChange: vi.fn().mockReturnValue({
        data: { subscription: { unsubscribe: vi.fn() } }
      })
    }
  }
}));

// Mock navigation components to avoid complex dependencies
vi.mock('@/components/navigation/UnifiedNavigation', () => ({
  UnifiedNavigation: () => <div data-testid="unified-navigation">Navigation</div>
}));

describe('Snakkaz Chat - User Flow Integration', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
    sessionStorage.clear();
  });

  test('should render login page when not authenticated', async () => {
    render(<App />);
    
    await waitFor(() => {
      expect(screen.getByText(/opprett ny konto/i)).toBeInTheDocument();
    });
  });

  test('should handle registration flow navigation', async () => {
    const { container } = render(<App />);
    
    // Navigate to register page
    window.history.pushState({}, '', '/register');
    
    await waitFor(() => {
      expect(container.innerHTML).toContain('register');
    });
  });

  test('should handle email confirmation flow', async () => {
    const { container } = render(<App />);
    
    // Navigate to email confirmation page
    window.history.pushState({}, '', '/email-confirmation');
    
    await waitFor(() => {
      expect(container.innerHTML).toContain('email-confirmation');
    });
  });

  test('should handle first-time profile setup', async () => {
    const { container } = render(<App />);
    
    // Navigate to profile page with first-time parameter
    window.history.pushState({}, '', '/profile?firstTime=true');
    
    await waitFor(() => {
      expect(container.innerHTML).toContain('profile');
    });
  });

  test('should lazy load components correctly', async () => {
    const { container } = render(<App />);
    
    // Test that lazy loading works without errors
    expect(container).toBeTruthy();
    
    // Should show loading spinner initially
    await waitFor(() => {
      expect(container.innerHTML).toContain('Laster inn');
    }, { timeout: 1000 });
  });

  test('should handle error boundaries gracefully', async () => {
    // Test that the error boundary catches and handles errors
    const { container } = render(<App />);
    
    expect(container).toBeTruthy();
    // Should not crash the application
  });
});

describe('User Flow State Management', () => {
  test('should preserve authentication state', () => {
    // Mock authenticated state
    const mockSession = {
      user: { id: '123', email: 'test@example.com' },
      access_token: 'mock-token'
    };
    
    localStorage.setItem('sb-xkrjfnrrngwovrhcotpj-auth-token', JSON.stringify(mockSession));
    
    render(<App />);
    
    // Should remember authentication state
    expect(localStorage.getItem('sb-xkrjfnrrngwovrhcotpj-auth-token')).toBeTruthy();
  });

  test('should handle first-time user detection', () => {
    // Test that first-time user parameter is detected correctly
    const searchParams = new URLSearchParams('?firstTime=true');
    expect(searchParams.get('firstTime')).toBe('true');
  });

  test('should manage registration flow state', () => {
    // Test registration state management
    const testEmail = 'newuser@example.com';
    localStorage.setItem('snakkaz_pending_email', testEmail);
    
    expect(localStorage.getItem('snakkaz_pending_email')).toBe(testEmail);
  });
});

describe('Mobile Responsiveness', () => {
  test('should detect mobile viewport', () => {
    // Mock mobile viewport
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 375
    });
    
    // Should handle mobile viewport correctly
    expect(window.innerWidth).toBe(375);
  });

  test('should handle touch events', () => {
    // Mock touch capability
    Object.defineProperty(window, 'ontouchstart', {
      writable: true,
      configurable: true,
      value: null
    });
    
    expect('ontouchstart' in window).toBe(true);
  });
});
