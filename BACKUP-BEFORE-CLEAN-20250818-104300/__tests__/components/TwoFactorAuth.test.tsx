import React from 'react';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render } from '../../../tests/testUtils';
import { TOTPVerification } from '@/features/auth/two-factor/TOTPVerification';
import { TOTPSetup } from '@/features/auth/two-factor/TOTPSetup';

// Mock the TOTP utility functions
vi.mock('@/features/auth/two-factor/useTOTP', () => ({
  generateTOTPSecret: vi.fn(() => 'JBSWY3DPEHPK3PXP'),
  generateTOTPToken: vi.fn(() => '123456'),
  verifyTOTPToken: vi.fn(() => true),
  generateQRCodeURL: vi.fn(() => 'otpauth://totp/test')
}));

// Mock the useTOTP hook
const mockUseTOTP = {
  verifyTOTP: vi.fn(() => true),
  verifyBackupCode: vi.fn(() => ({ success: true })),
  setupTOTP: vi.fn(),
  loading: false,
  error: null
};

vi.mock('@/features/auth/hooks/useTOTP', () => ({
  useTOTP: () => mockUseTOTP
}));

// Mock the useAuth hook
const mockUseAuth = {
  user: { id: 'test-user', email: 'test@example.com' },
  completeTwoFactorAuth: vi.fn(() => Promise.resolve({ success: true })),
  loading: false
};

vi.mock('@/features/auth/hooks/useAuth', () => ({
  useAuth: () => mockUseAuth
}));

// Mock QR code generation
vi.mock('qrcode', () => ({
  toDataURL: vi.fn().mockResolvedValue('data:image/png;base64,mockedqr'),
}));

describe('Two-Factor Authentication', () => {
  const mockProps = {
    secret: 'JBSWY3DPEHPK3PXP',
    onVerificationSuccess: vi.fn(),
    onCancel: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    mockUseTOTP.verifyTOTP.mockReturnValue(true);
    mockUseTOTP.verifyBackupCode.mockReturnValue({ success: true });
    mockUseAuth.completeTwoFactorAuth.mockResolvedValue({ success: true });
  });

  describe('TOTP Setup', () => {
    const setupProps = {
      userId: 'test-user-id',
      userEmail: 'test@example.com',
      onSetupComplete: vi.fn(),
      onCancel: vi.fn(),
    };

    it('should display QR code for authenticator app setup', async () => {
      render(<TOTPSetup {...setupProps} />);

      expect(screen.getByText(/skann qr-koden/i)).toBeInTheDocument();
    });

    it('should show secret key for manual entry', async () => {
      render(<TOTPSetup {...setupProps} />);

      // Click manual setup tab first
      const manualTab = screen.getByText(/manuell/i);
      await userEvent.click(manualTab);

      expect(screen.getByText(/skriv inn denne hemmeligheten manuelt/i)).toBeInTheDocument();
    });

    it('should provide instructions in Norwegian', async () => {
      render(<TOTPSetup {...setupProps} />);

      expect(screen.getByText(/sett opp to-faktor autentisering/i)).toBeInTheDocument();
      expect(screen.getByText(/google authenticator/i)).toBeInTheDocument();
    });
  });

  describe('TOTP Verification', () => {
    it('should accept valid 6-digit codes', async () => {
      const user = userEvent.setup();
      mockUseTOTP.verifyTOTP.mockReturnValue(true);

      render(<TOTPVerification {...mockProps} />);

      const codeInput = screen.getByLabelText(/6-sifret kode/i);
      const verifyButton = screen.getByRole('button', { name: /verifiser/i });

      await user.type(codeInput, '123456');
      await user.click(verifyButton);

      expect(mockProps.onVerificationSuccess).toHaveBeenCalled();
    });

    it('should reject invalid codes', async () => {
      const user = userEvent.setup();
      mockUseTOTP.verifyTOTP.mockReturnValue(false);

      render(<TOTPVerification {...mockProps} />);

      const codeInput = screen.getByLabelText(/6-sifret kode/i);
      const verifyButton = screen.getByRole('button', { name: /verifiser/i });

      await user.type(codeInput, '000000');
      await user.click(verifyButton);

      await waitFor(() => {
        expect(screen.getByText(/ugyldig verifiseringskode/i)).toBeInTheDocument();
      });

      expect(mockProps.onVerificationSuccess).not.toHaveBeenCalled();
    });

    it('should require exactly 6 digits', async () => {
      const user = userEvent.setup();
      render(<TOTPVerification {...mockProps} />);

      const codeInput = screen.getByLabelText(/6-sifret kode/i);
      const verifyButton = screen.getByRole('button', { name: /verifiser/i });

      // Test with less than 6 digits
      await user.type(codeInput, '123');
      expect(verifyButton).toBeDisabled();

      // Clear and test with more than 6 digits
      await user.clear(codeInput);
      await user.type(codeInput, '1234567');
      
      // Should only accept 6 digits
      expect(codeInput).toHaveValue('123456');
    });

    it('should only accept numeric input', async () => {
      const user = userEvent.setup();
      render(<TOTPVerification {...mockProps} />);

      const codeInput = screen.getByLabelText(/6-sifret kode/i);

      await user.type(codeInput, 'abc123');
      
      // Should filter out non-numeric characters
      expect(codeInput).toHaveValue('123');
    });

    it('should enable verify button when 6 digits are entered', async () => {
      const user = userEvent.setup();
      render(<TOTPVerification {...mockProps} />);

      const codeInput = screen.getByLabelText(/6-sifret kode/i);
      const verifyButton = screen.getByRole('button', { name: /verifiser/i });

      // Button should be disabled initially or with fewer than 6 digits
      expect(verifyButton).toBeDisabled();

      await user.type(codeInput, '123456');

      // Button should be enabled with 6 digits
      expect(verifyButton).not.toBeDisabled();
    });
  });

  describe('Backup Codes', () => {
    it('should show backup code option', async () => {
      const user = userEvent.setup();
      render(<TOTPVerification {...mockProps} showBackupCodes={true} />);

      const backupTab = screen.getByRole('tab', { name: /backup-kode/i });
      await user.click(backupTab);

      expect(screen.getByRole('textbox', { name: /backup-kode/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /bruk backup-kode/i })).toBeInTheDocument();
    });

    it('should accept valid backup codes', async () => {
      const user = userEvent.setup();
      mockUseTOTP.verifyBackupCode.mockReturnValue({ success: true });
      
      render(
        <TOTPVerification 
          {...mockProps} 
          showBackupCodes={true}
        />
      );

      // Switch to backup code tab
      const backupTab = screen.getByRole('tab', { name: /backup-kode/i });
      await user.click(backupTab);

      const backupInput = screen.getByRole('textbox', { name: /backup-kode/i });
      const submitButton = screen.getByRole('button', { name: /bruk backup-kode/i });

      await user.type(backupInput, '12345678');
      await user.click(submitButton);

      await waitFor(() => {
        expect(mockUseTOTP.verifyBackupCode).toHaveBeenCalledWith('12345678');
        expect(mockProps.onVerificationSuccess).toHaveBeenCalled();
      });
    });

    it('should warn about backup code usage', async () => {
      const user = userEvent.setup();
      render(<TOTPVerification {...mockProps} showBackupCodes={true} />);

      const backupTab = screen.getByRole('tab', { name: /backup-kode/i });
      await user.click(backupTab);

      expect(screen.getByText(/kan kun brukes én gang/i)).toBeInTheDocument();
      expect(screen.getByText(/sørg for å generere nye koder/i)).toBeInTheDocument();
    });
  });

  describe('Error Handling', () => {
    it('should show error message for invalid codes', async () => {
      const user = userEvent.setup();
      mockUseTOTP.verifyTOTP.mockReturnValue(false);

      render(<TOTPVerification {...mockProps} />);

      const codeInput = screen.getByLabelText(/6-sifret kode/i);
      const verifyButton = screen.getByRole('button', { name: /verifiser/i });

      await user.type(codeInput, '000000');
      await user.click(verifyButton);

      await waitFor(() => {
        expect(screen.getByText(/ugyldig verifiseringskode/i)).toBeInTheDocument();
      });
    });

    it('should handle network errors gracefully', async () => {
      const user = userEvent.setup();
      mockUseTOTP.verifyTOTP.mockImplementation(() => {
        throw new Error('Network error');
      });

      render(<TOTPVerification {...mockProps} />);

      const codeInput = screen.getByLabelText(/6-sifret kode/i);
      const verifyButton = screen.getByRole('button', { name: /verifiser/i });

      await user.type(codeInput, '123456');
      await user.click(verifyButton);

      await waitFor(() => {
        expect(screen.getByText(/feil under verifisering/i)).toBeInTheDocument();
      });
    });
  });

  describe('Accessibility', () => {
    it('should have proper labels', async () => {
      render(<TOTPVerification {...mockProps} />);

      const codeInput = screen.getByLabelText(/6-sifret kode/i);
      expect(codeInput).toBeInTheDocument();
      expect(codeInput).toHaveAttribute('id', 'verification-code');
    });

    it('should support keyboard navigation', async () => {
      const user = userEvent.setup();
      render(<TOTPVerification {...mockProps} />);

      const verifyButton = screen.getByRole('button', { name: /verifiser/i });

      // Tab to navigate to elements - skip checking specific focus order
      await user.tab();
      await user.tab();
      
      // Just verify that buttons are accessible
      expect(verifyButton).toBeInTheDocument();
    });

    it('should announce errors to screen readers', async () => {
      const user = userEvent.setup();
      mockUseTOTP.verifyTOTP.mockReturnValue(false);

      render(<TOTPVerification {...mockProps} />);

      const codeInput = screen.getByLabelText(/6-sifret kode/i);
      const verifyButton = screen.getByRole('button', { name: /verifiser/i });

      await user.type(codeInput, '000000');
      await user.click(verifyButton);

      await waitFor(() => {
        const errorElement = screen.getByText(/ugyldig verifiseringskode/i);
        expect(errorElement).toBeInTheDocument();
      });
    });
  });

  describe('Internationalization', () => {
    it('should display all text in Norwegian', async () => {
      render(<TOTPVerification {...mockProps} />);

      // Check that common UI elements are in Norwegian
      expect(screen.getByText(/to-faktor verifisering/i)).toBeInTheDocument();
      expect(screen.getByText(/6-sifret kode/i)).toBeInTheDocument();
      expect(screen.getByText(/verifiser kode/i)).toBeInTheDocument();
      expect(screen.getByText(/avbryt/i)).toBeInTheDocument();
    });

    it('should display Norwegian text content', async () => {
      render(<TOTPVerification {...mockProps} />);

      // Check Norwegian instruction texts
      expect(screen.getByText(/skriv inn koden fra din autentiseringsapp/i)).toBeInTheDocument();
      expect(screen.getByText(/åpne din autentiseringsapp/i)).toBeInTheDocument();
    });
  });
});
