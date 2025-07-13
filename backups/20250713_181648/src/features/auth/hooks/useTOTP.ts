import { useState, useCallback } from 'react';
import * as OTPAuth from 'otpauth';
import QRCode from 'qrcode';
import { supabase } from '@/lib/supabaseClient';
import { useAuth } from '../hooks/useAuth';

interface TOTPSecret {
  secret: string;
  qrCodeUrl: string;
  manualEntryKey: string;
  backupCodes: string[];
}

interface TOTPHookReturn {
  setupTOTP: () => Promise<TOTPSecret>;
  verifyTOTP: (token: string, secret: string) => boolean;
  enableTOTP: (secret: string, token: string) => Promise<{ success: boolean; error?: string }>;
  disableTOTP: () => Promise<{ success: boolean; error?: string }>;
  generateBackupCodes: () => string[];
  verifyBackupCode: (code: string) => Promise<{ success: boolean; error?: string }>;
  loading: boolean;
  error: string | null;
}

export const useTOTP = (): TOTPHookReturn => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Helper function to generate backup codes - defined first to avoid dependency issues
  const generateBackupCodes = useCallback((): string[] => {
    const codes: string[] = [];
    for (let i = 0; i < 8; i++) {
      // Generate 8-character alphanumeric backup codes
      const code = Math.random().toString(36).substring(2, 10).toUpperCase();
      codes.push(code);
    }
    return codes;
  }, []);

  const setupTOTP = useCallback(async (): Promise<TOTPSecret> => {
    if (!user) throw new Error('Bruker ikke logget inn');

    // Generate a random secret key
    const secret = OTPAuth.Secret.fromHex(Array.from(
      { length: 32 }, 
      () => Math.floor(Math.random() * 16).toString(16)
    ).join(''));
    
    // Create a TOTP object
    const totp = new OTPAuth.TOTP({
      issuer: 'Snakkaz Chat',
      label: user.email || 'user',
      algorithm: 'SHA1',
      digits: 6,
      period: 30,
      secret: secret
    });
    
    // Generate URI for QR code
    const uri = totp.toString();
    
    // Generate QR code
    const qrCodeUrl = await QRCode.toDataURL(uri);
    const backupCodes = generateBackupCodes();

    return {
      secret: secret.base32,
      qrCodeUrl,
      manualEntryKey: secret.base32.match(/.{1,4}/g)?.join(' ') || secret.base32,
      backupCodes,
    };
  }, [user, generateBackupCodes]);

  const verifyTOTP = useCallback((token: string, secret: string): boolean => {
    try {
      // Create a new TOTP object with the stored secret
      const totp = new OTPAuth.TOTP({
        issuer: 'Snakkaz Chat',
        label: 'user',
        algorithm: 'SHA1',
        digits: 6,
        period: 30,
        secret: OTPAuth.Secret.fromBase32(secret)
      });
      
      // Clean up the token and verify
      const cleanToken = token.replace(/\s/g, '');
      
      // Window = 1 means check one step before and after 
      return totp.validate({ token: cleanToken, timestamp: Date.now(), window: 1 }) !== null;
    } catch (err) {
      console.error('TOTP verification error:', err);
      return false;
    }
  }, []);

  const enableTOTP = useCallback(async (secret: string, token: string) => {
    if (!user) return { success: false, error: 'Bruker ikke logget inn' };

    setLoading(true);
    setError(null);

    try {
      // Verify the token first
      if (!verifyTOTP(token, secret)) {
        return { success: false, error: 'Ugyldig verifiseringskode' };
      }

      // Store the encrypted secret and backup codes in user metadata
      const backupCodes = generateBackupCodes();
      const { error: updateError } = await supabase.auth.updateUser({
        data: {
          totp_secret: secret,
          totp_enabled: true,
          backup_codes: backupCodes,
          totp_enabled_at: new Date().toISOString(),
        }
      });

      if (updateError) {
        return { success: false, error: updateError.message };
      }

      return { success: true };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Ukjent feil';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, [user, verifyTOTP, generateBackupCodes]);

  const disableTOTP = useCallback(async () => {
    if (!user) return { success: false, error: 'Bruker ikke logget inn' };

    setLoading(true);
    setError(null);

    try {
      const { error: updateError } = await supabase.auth.updateUser({
        data: {
          totp_secret: null,
          totp_enabled: false,
          backup_codes: null,
          totp_enabled_at: null,
        }
      });

      if (updateError) {
        return { success: false, error: updateError.message };
      }

      return { success: true };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Ukjent feil';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, [user]);

  const verifyBackupCode = useCallback(async (code: string) => {
    if (!user) return { success: false, error: 'Bruker ikke logget inn' };

    setLoading(true);
    setError(null);

    try {
      // Get current backup codes from user metadata
      const { data: userData, error: fetchError } = await supabase.auth.getUser();
      
      if (fetchError || !userData.user) {
        return { success: false, error: 'Kunne ikke hente brukerdata' };
      }

      const backupCodes = userData.user.user_metadata?.backup_codes || [];
      const codeIndex = backupCodes.indexOf(code.toUpperCase());

      if (codeIndex === -1) {
        return { success: false, error: 'Ugyldig backup-kode' };
      }

      // Remove the used backup code
      const updatedCodes = backupCodes.filter((_: string, index: number) => index !== codeIndex);
      
      const { error: updateError } = await supabase.auth.updateUser({
        data: {
          backup_codes: updatedCodes,
        }
      });

      if (updateError) {
        return { success: false, error: updateError.message };
      }

      return { success: true };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Ukjent feil';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, [user]);

  return {
    setupTOTP,
    verifyTOTP,
    enableTOTP,
    disableTOTP,
    generateBackupCodes,
    verifyBackupCode,
    loading,
    error,
  };
};
