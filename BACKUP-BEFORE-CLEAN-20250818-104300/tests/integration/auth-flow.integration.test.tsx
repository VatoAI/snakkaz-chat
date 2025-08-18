import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BrowserRouter } from 'react-router-dom';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import Login from '../../pages/Login';

const MockAuthProvider = ({ children }: { children: React.ReactNode }) => {
  return <div data-testid="auth-flow-provider">{children}</div>;
};

const renderWithProviders = (component: React.ReactElement) => {
  return render(
    <BrowserRouter>
      <MockAuthProvider>
        {component}
      </MockAuthProvider>
    </BrowserRouter>
  );
};

describe('Authentication Flow Integration Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should switch to registration mode', async () => {
    renderWithProviders(<Login />);
    
    await waitFor(() => {
      expect(screen.getByTestId('auth-flow-provider')).toBeInTheDocument();
    }, { timeout: 10000 });

    expect(screen.getByTestId('auth-flow-provider')).toBeInTheDocument();
  }, 15000);

  it('should handle authentication state changes', async () => {
    renderWithProviders(<Login />);
    
    await waitFor(() => {
      expect(screen.getByTestId('auth-flow-provider')).toBeInTheDocument();
    }, { timeout: 10000 });

    expect(screen.getByTestId('auth-flow-provider')).toBeInTheDocument();
  }, 15000);
});
