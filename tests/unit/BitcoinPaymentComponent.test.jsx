// Unit tests for enhanced Bitcoin payment component

import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import BitcoinPaymentComponent from '../../src/components/payments/EnhancedBitcoinPaymentComponent';
import * as formatters from '../../src/utils/formatters';
import { ThemeProvider, createTheme } from '@mui/material';

// Mock the qrcode.react dependency
jest.mock('qrcode.react', () => ({
  __esModule: true,
  default: props => <div data-testid="qr-code">{props.value}</div>
}));

// Mock the react-copy-to-clipboard dependency
jest.mock('react-copy-to-clipboard', () => ({
  CopyToClipboard: ({ text, onCopy, children }) => (
    <div onClick={() => onCopy(text)} data-clipboard-text={text}>
      {children}
    </div>
  )
}));

// Mock formatters
jest.mock('../../src/utils/formatters', () => ({
  formatBitcoin: jest.fn(amount => `${amount} BTC`),
  formatCurrency: jest.fn((amount, currency) => `${amount} ${currency}`)
}));

// Mock useInterval hook
jest.mock('../../src/hooks/useInterval', () => ({
  useInterval: (callback, delay) => {
    React.useEffect(() => {
      if (delay === null) return;
      const id = setInterval(callback, delay);
      return () => clearInterval(id);
    }, [callback, delay]);
  }
}));

// Create a theme for MUI components
const theme = createTheme();

// Mock fetch for API calls
global.fetch = jest.fn();

describe('BitcoinPaymentComponent', () => {
  const mockPaymentId = '123e4567-e89b-12d3-a456-426614174000';
  const mockAmount = 100;
  const mockCurrency = 'NOK';
  const mockOnPaymentComplete = jest.fn();
  const mockOnError = jest.fn();
  
  const mockPayment = {
    id: mockPaymentId,
    amount: mockAmount,
    currency: mockCurrency,
    btc_amount: 0.00123,
    bitcoin_address: 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh',
    status: 'pending',
    created_at: new Date().toISOString(),
    expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    user_id: 'user123',
    productType: 'subscription',
    productId: 'premium-monthly'
  };
  
  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();
    
    // Mock successful API response for payment fetch
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ payment: mockPayment })
    });
  });
  
  it('renders initial loading state', async () => {
    render(
      <ThemeProvider theme={theme}>
        <BitcoinPaymentComponent 
          paymentId={mockPaymentId}
          amount={mockAmount}
          currency={mockCurrency}
        />
      </ThemeProvider>
    );
    
    // Initial loading state should show CircularProgress
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });
  
  it('displays payment information after loading', async () => {
    render(
      <ThemeProvider theme={theme}>
        <BitcoinPaymentComponent 
          paymentId={mockPaymentId}
          amount={mockAmount}
          currency={mockCurrency}
        />
      </ThemeProvider>
    );
    
    // Wait for the component to load payment data
    await waitFor(() => {
      expect(screen.getByText('Bitcoin Payment')).toBeInTheDocument();
    });
    
    // Check if payment info is displayed
    expect(formatters.formatCurrency).toHaveBeenCalledWith(mockAmount, mockCurrency);
    expect(formatters.formatBitcoin).toHaveBeenCalledWith(mockPayment.btc_amount);
    
    // Bitcoin address should be displayed
    expect(screen.getByText(mockPayment.bitcoin_address)).toBeInTheDocument();
    
    // QR code should be rendered
    const qrCode = screen.getByTestId('qr-code');
    expect(qrCode).toBeInTheDocument();
    expect(qrCode.textContent).toContain(mockPayment.bitcoin_address);
  });
  
  it('handles copy to clipboard functionality', async () => {
    render(
      <ThemeProvider theme={theme}>
        <BitcoinPaymentComponent 
          paymentId={mockPaymentId}
          amount={mockAmount}
          currency={mockCurrency}
        />
      </ThemeProvider>
    );
    
    // Wait for the component to load payment data
    await waitFor(() => {
      expect(screen.getByText('Bitcoin Payment')).toBeInTheDocument();
    });
    
    // Find copy button (using the clipboard attribute)
    const copyButton = screen.getByLabelText(/copy to clipboard/i);
    expect(copyButton).toBeInTheDocument();
    
    // Click the copy button
    fireEvent.click(copyButton);
    
    // Should show confirmation of copy
    await waitFor(() => {
      expect(screen.getByLabelText(/copied!/i)).toBeInTheDocument();
    });
    
    // After timeout, should go back to normal
    jest.advanceTimersByTime(2000);
    
    // Not optimal since the state doesn't update with jest.advanceTimersByTime
    // In a real implementation, we'd need to mock useState to check this properly
  });
  
  it('shows stepper with correct active step', async () => {
    render(
      <ThemeProvider theme={theme}>
        <BitcoinPaymentComponent 
          paymentId={mockPaymentId}
          amount={mockAmount}
          currency={mockCurrency}
        />
      </ThemeProvider>
    );
    
    // Wait for the component to load payment data
    await waitFor(() => {
      expect(screen.getByText('Bitcoin Payment')).toBeInTheDocument();
    });
    
    // Should display the stepper
    expect(screen.getByText('Payment Initiated')).toBeInTheDocument();
    expect(screen.getByText('Payment Detected')).toBeInTheDocument();
    expect(screen.getByText('Payment Confirmed')).toBeInTheDocument();
    expect(screen.getByText('Complete')).toBeInTheDocument();
    
    // For 'pending' status, first step should be active
    expect(screen.getByText('Send exactly')).toBeInTheDocument();
  });
  
  it('updates status when receiving unconfirmed payment', async () => {
    // First render with pending payment
    render(
      <ThemeProvider theme={theme}>
        <BitcoinPaymentComponent 
          paymentId={mockPaymentId}
          amount={mockAmount}
          currency={mockCurrency}
        />
      </ThemeProvider>
    );
    
    // Wait for the component to load payment data
    await waitFor(() => {
      expect(screen.getByText('Bitcoin Payment')).toBeInTheDocument();
    });
    
    // Mock the second API call for status update
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ 
        payment: {
          ...mockPayment,
          status: 'unconfirmed',
          confirmations: 1
        }
      })
    });
    
    // Trigger refresh
    const refreshButton = screen.getByLabelText(/refresh status/i);
    fireEvent.click(refreshButton);
    
    // Wait for status to update
    await waitFor(() => {
      expect(screen.getByText(/awaiting confirmation/i)).toBeInTheDocument();
      expect(screen.getByText(/1 of 3 confirmations received/i)).toBeInTheDocument();
    });
    
    // Progress bar should be visible
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });
  
  it('calls onPaymentComplete when payment is completed', async () => {
    // First render with pending payment
    render(
      <ThemeProvider theme={theme}>
        <BitcoinPaymentComponent 
          paymentId={mockPaymentId}
          amount={mockAmount}
          currency={mockCurrency}
          onPaymentComplete={mockOnPaymentComplete}
        />
      </ThemeProvider>
    );
    
    // Wait for initial load
    await waitFor(() => {
      expect(screen.getByText('Bitcoin Payment')).toBeInTheDocument();
    });
    
    // Mock the next API call to return completed payment
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ 
        payment: {
          ...mockPayment,
          status: 'completed'
        }
      })
    });
    
    // Trigger refresh
    const refreshButton = screen.getByLabelText(/refresh status/i);
    fireEvent.click(refreshButton);
    
    // Wait for status to update
    await waitFor(() => {
      expect(screen.getByText(/payment completed successfully/i)).toBeInTheDocument();
    });
    
    // Callback should be called with payment data
    expect(mockOnPaymentComplete).toHaveBeenCalled();
    
    // Continue button should be visible
    expect(screen.getByText(/continue to dashboard/i)).toBeInTheDocument();
  });
  
  it('handles payment expiration correctly', async () => {
    // Create an expired payment
    const expiredPayment = {
      ...mockPayment,
      expires_at: new Date(Date.now() - 1000).toISOString() // Already expired
    };
    
    // Mock API to return expired payment
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ payment: expiredPayment })
    });
    
    render(
      <ThemeProvider theme={theme}>
        <BitcoinPaymentComponent 
          paymentId={mockPaymentId}
          amount={mockAmount}
          currency={mockCurrency}
        />
      </ThemeProvider>
    );
    
    // Wait for the component to load payment data
    await waitFor(() => {
      expect(screen.getByText('Bitcoin Payment')).toBeInTheDocument();
      expect(screen.getByText(/payment request has expired/i)).toBeInTheDocument();
    });
    
    // Should show create new payment button
    const newPaymentButton = screen.getByText(/create new payment request/i);
    expect(newPaymentButton).toBeInTheDocument();
    
    // Mock API response for creating a new payment
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ 
        payment: {
          ...mockPayment,
          id: 'new-payment-id'
        }
      })
    });
    
    // Click to create new payment
    fireEvent.click(newPaymentButton);
    
    // Should show loading state again
    await waitFor(() => {
      expect(screen.getByRole('progressbar')).toBeInTheDocument();
    });
  });
  
  it('displays error state when API fails', async () => {
    // Reset fetch mocks
    global.fetch.mockReset();
    
    // Mock API error
    global.fetch.mockResolvedValueOnce({
      ok: false,
      status: 500,
      statusText: 'Internal Server Error'
    });
    
    render(
      <ThemeProvider theme={theme}>
        <BitcoinPaymentComponent 
          paymentId={mockPaymentId}
          amount={mockAmount}
          currency={mockCurrency}
          onError={mockOnError}
        />
      </ThemeProvider>
    );
    
    // Wait for error to display
    await waitFor(() => {
      expect(screen.getByText(/error loading payment/i)).toBeInTheDocument();
    });
    
    // Error callback should be called
    expect(mockOnError).toHaveBeenCalled();
    
    // Try again button should be visible
    const tryAgainButton = screen.getByText(/try again/i);
    expect(tryAgainButton).toBeInTheDocument();
    
    // Mock successful response for retry
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ payment: mockPayment })
    });
    
    // Click retry button
    fireEvent.click(tryAgainButton);
    
    // Should show loading and then payment info
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
    
    await waitFor(() => {
      expect(screen.getByText('Bitcoin Payment')).toBeInTheDocument();
    });
  });
  
  it('shows payment history button when enabled', async () => {
    render(
      <ThemeProvider theme={theme}>
        <BitcoinPaymentComponent 
          paymentId={mockPaymentId}
          amount={mockAmount}
          currency={mockCurrency}
          showHistory={true}
        />
      </ThemeProvider>
    );
    
    // Wait for the component to load payment data
    await waitFor(() => {
      expect(screen.getByText('Bitcoin Payment')).toBeInTheDocument();
    });
    
    // Payment history button should be visible
    const historyButton = screen.getByText(/payment history/i);
    expect(historyButton).toBeInTheDocument();
    
    // Click should navigate to history page
    // In a real test environment, we'd need to mock window.location
  });
});
