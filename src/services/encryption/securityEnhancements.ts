/**
 * Security Enhancements for Cloudflare Integration
 * 
 * This module adds additional security features to our Cloudflare integration:
 * 1. Session timeout for automatic security termination
 * 2. Enhanced encryption with additional entropy
 * 3. Rate limiting for authentication attempts
 */

import { SECURE_KEYS, endSecureAccess, isSecureAccessVerified } from './secureCredentials';
import { encrypt as baseEncrypt, decrypt as baseDecrypt } from './simpleEncryption';

// Default session timeout (10 minutes)
const DEFAULT_TIMEOUT_MS = 10 * 60 * 1000;

// Maximum failed authentication attempts before lockout
const MAX_AUTH_ATTEMPTS = 5;

// Duration of lockout in milliseconds (15 minutes)
const LOCKOUT_DURATION_MS = 15 * 60 * 1000;

// Track authentication attempts
const authAttempts = {
  count: 0,
  lastFailTime: 0,
  lockedUntil: 0
};

// Storage key for session expiration
const SESSION_EXPIRY_KEY = 'snkkz_sess_exp';

// Additional entropy sources for enhanced security
const ADDITIONAL_ENTROPY = {
  // Browser fingerprinting components
  userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'node',
  language: typeof navigator !== 'undefined' ? navigator.language : 'en-US',
  timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  // Application-specific salt that changes each month
  monthlyKey: `snakkaz-cf-${new Date().getFullYear()}-${new Date().getMonth()}`
};

/**
 * Enhanced encryption function with additional entropy for even stronger security
 * @param data Data to encrypt
 * @param password User password
 * @param salt Base salt value
 * @returns Encrypted string
 */
export async function enhancedEncrypt(data: string, password: string, salt: string): Promise<string> {
  // Generate enhanced entropy string
  const enhancedSalt = `${salt}-${ADDITIONAL_ENTROPY.monthlyKey}-${ADDITIONAL_ENTROPY.timeZone}`;
  
  // Use the base encryption with enhanced salt
  return baseEncrypt(data, password, enhancedSalt);
}

/**
 * Enhanced decryption function with additional entropy
 * @param encryptedData Data to decrypt
 * @param password User password
 * @param salt Base salt value
 * @returns Decrypted string
 */
export async function enhancedDecrypt(encryptedData: string, password: string, salt: string): Promise<string> {
  // Generate enhanced entropy string - must match what was used during encryption
  const enhancedSalt = `${salt}-${ADDITIONAL_ENTROPY.monthlyKey}-${ADDITIONAL_ENTROPY.timeZone}`;
  
  // Use the base decryption with enhanced salt
  return baseDecrypt(encryptedData, password, enhancedSalt);
}

/**
 * Set up a session timeout that will automatically end secure access
 * @param timeoutMs Timeout in milliseconds (default: 10 minutes)
 */
export function setupSessionTimeout(timeoutMs: number = DEFAULT_TIMEOUT_MS): void {
  if (typeof window === 'undefined') return; // Only works in browser
  
  // Calculate expiry timestamp
  const expiryTime = Date.now() + timeoutMs;
  
  // Store expiry time in sessionStorage
  sessionStorage.setItem(SESSION_EXPIRY_KEY, expiryTime.toString());
  
  console.log(`Session timeout set for ${timeoutMs / 60000} minutes`);
}

/**
 * Check if the current secure session has timed out
 * @returns True if the session is still valid, false if timed out
 */
export function checkSessionTimeout(): boolean {
  if (typeof window === 'undefined') return false; // Only works in browser
  
  // If not verified, no need to check timeout
  if (!isSecureAccessVerified()) return false;
  
  // Get expiry timestamp
  const expiryTimeStr = sessionStorage.getItem(SESSION_EXPIRY_KEY);
  if (!expiryTimeStr) return false;
  
  const expiryTime = parseInt(expiryTimeStr, 10);
  const now = Date.now();
  
  // Check if expired
  if (now > expiryTime) {
    // Session expired, end it
    console.log('Security session timed out');
    endSecureAccess();
    return false;
  }
  
  return true;
}

/**
 * Reset the session timeout (call this when the user performs an action)
 * @param timeoutMs New timeout duration (default: use the default)
 */
export function resetSessionTimeout(timeoutMs?: number): void {
  if (isSecureAccessVerified()) {
    setupSessionTimeout(timeoutMs);
  }
}

/**
 * Record a failed authentication attempt and check if we've reached the limit
 * @returns True if the account is now locked, false otherwise
 */
export function recordFailedAuthAttempt(): boolean {
  const now = Date.now();
  
  // Check if we're in a lockout period
  if (now < authAttempts.lockedUntil) {
    return true; // Still locked out
  }
  
  // Check if the last failure was more than 1 hour ago - reset counter if so
  if (now - authAttempts.lastFailTime > 60 * 60 * 1000) {
    authAttempts.count = 0;
  }
  
  // Update tracking
  authAttempts.count++;
  authAttempts.lastFailTime = now;
  
  // Check if we've reached the limit
  if (authAttempts.count >= MAX_AUTH_ATTEMPTS) {
    // Lock the account
    authAttempts.lockedUntil = now + LOCKOUT_DURATION_MS;
    console.log('Security lockout activated due to too many failed attempts');
    return true;
  }
  
  return false;
}

/**
 * Reset the failed authentication counter (call after successful auth)
 */
export function resetAuthAttempts(): void {
  authAttempts.count = 0;
  authAttempts.lastFailTime = 0;
  authAttempts.lockedUntil = 0;
}

/**
 * Check if authentication is currently locked out
 * @returns True if locked out, false otherwise
 */
export function isAuthLocked(): boolean {
  return Date.now() < authAttempts.lockedUntil;
}

/**
 * Get remaining lockout time in minutes
 * @returns Minutes remaining in lockout, or 0 if not locked
 */
export function getLockoutRemainingMinutes(): number {
  const remaining = Math.max(0, authAttempts.lockedUntil - Date.now());
  return Math.ceil(remaining / 60000); // Convert to minutes and round up
}
