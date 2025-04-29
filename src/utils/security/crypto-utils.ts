/**
 * Crypto Utilities
 * 
 * Wickr-inspired cryptographic utilities for enhanced security operations
 * including secure random generation, key derivation, and secure hashing.
 */

/**
 * Generate cryptographically secure random bytes
 */
export function getRandomBytes(length: number): Uint8Array {
  const array = new Uint8Array(length);
  if (typeof crypto !== 'undefined') {
    crypto.getRandomValues(array);
  } else {
    // Fallback for non-browser environments
    for (let i = 0; i < length; i++) {
      array[i] = Math.floor(Math.random() * 256);
    }
    console.warn('Using less secure random number generation - no WebCrypto available');
  }
  return array;
}

/**
 * Generate a secure random string
 */
export function getRandomString(length: number): string {
  const bytes = getRandomBytes(length);
  return Array.from(bytes)
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

/**
 * Generate a secure ID
 */
export function generateSecureId(): string {
  return getRandomString(16);
}

/**
 * Derive a key from a password using PBKDF2
 */
export async function deriveKeyFromPassword(
  password: string,
  salt: Uint8Array,
  iterations: number = 100000, 
  keyLength: number = 32
): Promise<Uint8Array> {
  // Convert password to buffer
  const encoder = new TextEncoder();
  const passwordBuffer = encoder.encode(password);
  
  // Import key
  const importedKey = await crypto.subtle.importKey(
    'raw',
    passwordBuffer,
    { name: 'PBKDF2' },
    false,
    ['deriveBits']
  );
  
  // Derive bits
  const derivedBits = await crypto.subtle.deriveBits(
    {
      name: 'PBKDF2',
      salt: salt,
      iterations: iterations,
      hash: 'SHA-512'
    },
    importedKey,
    keyLength * 8
  );
  
  return new Uint8Array(derivedBits);
}

/**
 * Compute SHA-256 hash of data
 */
export async function sha256Hash(data: Uint8Array): Promise<Uint8Array> {
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  return new Uint8Array(hashBuffer);
}

/**
 * Compute HMAC-SHA-256 for authentication
 */
export async function hmacSha256(key: Uint8Array, data: Uint8Array): Promise<Uint8Array> {
  // Import key
  const importedKey = await crypto.subtle.importKey(
    'raw',
    key,
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  
  // Sign data
  const signature = await crypto.subtle.sign('HMAC', importedKey, data);
  
  return new Uint8Array(signature);
}

/**
 * Generate an AES-GCM key for encryption
 */
export async function generateEncryptionKey(): Promise<CryptoKey> {
  return await crypto.subtle.generateKey(
    { name: 'AES-GCM', length: 256 },
    true,
    ['encrypt', 'decrypt']
  );
}

/**
 * Export a crypto key to raw bytes
 */
export async function exportKey(key: CryptoKey): Promise<Uint8Array> {
  const exported = await crypto.subtle.exportKey('raw', key);
  return new Uint8Array(exported);
}

/**
 * Import raw bytes as an AES-GCM key
 */
export async function importAesGcmKey(keyData: Uint8Array): Promise<CryptoKey> {
  return await crypto.subtle.importKey(
    'raw',
    keyData,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt']
  );
}

/**
 * Encrypt data with AES-GCM
 */
export async function encryptData(
  key: CryptoKey,
  data: Uint8Array,
  additionalData?: Uint8Array
): Promise<{ ciphertext: Uint8Array; iv: Uint8Array }> {
  // Generate random IV
  const iv = getRandomBytes(12);
  
  // Encrypt
  const encrypted = await crypto.subtle.encrypt(
    {
      name: 'AES-GCM',
      iv,
      additionalData
    },
    key,
    data
  );
  
  return {
    ciphertext: new Uint8Array(encrypted),
    iv
  };
}

/**
 * Decrypt data with AES-GCM
 */
export async function decryptData(
  key: CryptoKey,
  ciphertext: Uint8Array,
  iv: Uint8Array,
  additionalData?: Uint8Array
): Promise<Uint8Array> {
  // Decrypt
  const decrypted = await crypto.subtle.decrypt(
    {
      name: 'AES-GCM',
      iv,
      additionalData
    },
    key,
    ciphertext
  );
  
  return new Uint8Array(decrypted);
}

/**
 * Securely compare two byte arrays in constant time
 * This prevents timing attacks
 */
export function constantTimeEqual(a: Uint8Array, b: Uint8Array): boolean {
  if (a.length !== b.length) {
    return false;
  }
  
  let result = 0;
  for (let i = 0; i < a.length; i++) {
    // XOR the bytes, then OR with the current result
    // This ensures the comparison takes the same time regardless of match position
    result |= a[i] ^ b[i];
  }
  
  return result === 0;
}

/**
 * Securely wipe a Uint8Array with random data
 */
export function secureWipe(data: Uint8Array): void {
  const random = getRandomBytes(data.length);
  data.set(random);
}