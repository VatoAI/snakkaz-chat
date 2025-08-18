/**
 * TOTP Utility Functions
 * 
 * Pure utility functions for TOTP operations without React dependencies
 */

import * as OTPAuth from 'otpauth';

/**
 * Generate a new TOTP secret
 */
export function generateTOTPSecret(): string {
  const secret = OTPAuth.Secret.fromHex(Array.from(
    { length: 32 }, 
    () => Math.floor(Math.random() * 16).toString(16)
  ).join(''));
  
  return secret.base32;
}

/**
 * Generate a TOTP token for testing
 */
export function generateTOTPToken(secret: string): string {
  const totp = new OTPAuth.TOTP({
    issuer: 'Snakkaz Chat',
    label: 'user',
    algorithm: 'SHA1',
    digits: 6,
    period: 30,
    secret: OTPAuth.Secret.fromBase32(secret)
  });
  
  return totp.generate();
}

/**
 * Verify a TOTP token
 */
export function verifyTOTPToken(secret: string, token: string): boolean {
  try {
    const totp = new OTPAuth.TOTP({
      issuer: 'Snakkaz Chat',
      label: 'user',
      algorithm: 'SHA1',
      digits: 6,
      period: 30,
      secret: OTPAuth.Secret.fromBase32(secret)
    });
    
    const cleanToken = token.replace(/\s/g, '');
    return totp.validate({ token: cleanToken, timestamp: Date.now(), window: 1 }) !== null;
  } catch (err) {
    console.error('TOTP verification error:', err);
    return false;
  }
}

/**
 * Generate QR code URL for TOTP setup
 */
export function generateQRCodeURL(secret: string, userEmail: string, issuer: string): string {
  const totp = new OTPAuth.TOTP({
    issuer,
    label: userEmail,
    algorithm: 'SHA1',
    digits: 6,
    period: 30,
    secret: OTPAuth.Secret.fromBase32(secret)
  });
  
  return totp.toString();
}
