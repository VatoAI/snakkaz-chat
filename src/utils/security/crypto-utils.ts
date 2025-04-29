/**
 * Crypto Utilities
 * 
 * Signal and Wickr-inspired cryptographic utilities for enhanced security operations
 * including secure random generation, key derivation, double ratchet message authentication,
 * and secure hashing.
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

/**
 * Signal-inspired Double Ratchet message authentication
 */
export class DoubleRatchet {
  private rootKey: Uint8Array;
  private sendingChainKey: Uint8Array;
  private receivingChainKey: Uint8Array;
  private messageKeys: Map<number, Uint8Array> = new Map();
  private sendingCounter: number = 0;
  private receivingCounter: number = 0;
  private readonly MAX_SKIP = 100; // Maximum number of message keys to store
  
  constructor(rootKey: Uint8Array) {
    this.rootKey = new Uint8Array(rootKey);
    // Derive initial chain keys
    this.sendingChainKey = new Uint8Array(32);
    this.receivingChainKey = new Uint8Array(32);
  }
  
  /**
   * Initialize the ratchet with a shared secret
   */
  async initialize(sharedSecret: Uint8Array): Promise<void> {
    // Derive sending and receiving chains from root key and shared secret
    const keyMaterial = await this.kdf(Buffer.concat([this.rootKey, sharedSecret]), 96);
    
    // Update root key
    this.rootKey = keyMaterial.slice(0, 32);
    
    // Set chain keys
    this.sendingChainKey = keyMaterial.slice(32, 64);
    this.receivingChainKey = keyMaterial.slice(64, 96);
    
    // Reset counters
    this.sendingCounter = 0;
    this.receivingCounter = 0;
  }
  
  /**
   * Get next sending message key and advance the chain
   */
  async nextSendingKey(): Promise<{ messageKey: Uint8Array; counter: number }> {
    // Generate message key from current chain key
    const messageKey = await this.hmacSha256(this.sendingChainKey, new Uint8Array([1]));
    
    // Update chain key
    this.sendingChainKey = await this.hmacSha256(this.sendingChainKey, new Uint8Array([2]));
    
    // Increment counter
    this.sendingCounter++;
    
    return {
      messageKey,
      counter: this.sendingCounter - 1
    };
  }
  
  /**
   * Get receiving message key for a specific counter
   */
  async getReceivingKey(counter: number): Promise<Uint8Array | null> {
    // Check if we have the key in cache
    if (this.messageKeys.has(counter)) {
      const key = this.messageKeys.get(counter)!;
      this.messageKeys.delete(counter);
      return key;
    }
    
    // Check if the counter is older than our current position
    if (counter < this.receivingCounter) {
      return null; // Can't generate keys for old messages
    }
    
    // Check against skipping too many messages (prevents DoS attacks)
    if (counter - this.receivingCounter > this.MAX_SKIP) {
      throw new Error('Too many skipped messages');
    }
    
    // Save current state in case we need to restore
    const currentChainKey = this.receivingChainKey.slice();
    const currentCounter = this.receivingCounter;
    
    // Generate and cache skipped message keys
    while (this.receivingCounter < counter) {
      const messageKey = await this.hmacSha256(this.receivingChainKey, new Uint8Array([1]));
      this.messageKeys.set(this.receivingCounter, messageKey);
      
      // Update chain key
      this.receivingChainKey = await this.hmacSha256(this.receivingChainKey, new Uint8Array([2]));
      this.receivingCounter++;
    }
    
    // Get the requested message key
    const messageKey = await this.hmacSha256(this.receivingChainKey, new Uint8Array([1]));
    
    // Update chain key
    this.receivingChainKey = await this.hmacSha256(this.receivingChainKey, new Uint8Array([2]));
    this.receivingCounter++;
    
    return messageKey;
  }
  
  /**
   * Key derivation function using HKDF
   */
  private async kdf(input: Uint8Array, outputLength: number): Promise<Uint8Array> {
    const salt = new Uint8Array(32).fill(0);
    const info = new TextEncoder().encode("DoubleRatchetKDF");
    
    return await hkdfExpand(await hkdfExtract(salt, input), info, outputLength);
  }
  
  /**
   * HMAC-SHA256 wrapper that returns Uint8Array
   */
  private async hmacSha256(key: Uint8Array, data: Uint8Array): Promise<Uint8Array> {
    return await hmacSha256(key, data);
  }
  
  /**
   * Cleanup sensitive key material
   */
  destroy(): void {
    secureWipe(this.rootKey);
    secureWipe(this.sendingChainKey);
    secureWipe(this.receivingChainKey);
    
    // Wipe message keys
    this.messageKeys.forEach((key) => {
      secureWipe(key);
    });
    this.messageKeys.clear();
  }
}

/**
 * HKDF Extract implementation (RFC 5869)
 * Used in Signal's Double Ratchet Algorithm
 */
export async function hkdfExtract(salt: Uint8Array, input: Uint8Array): Promise<Uint8Array> {
  // Import HMAC key
  const key = await crypto.subtle.importKey(
    'raw',
    salt,
    { name: 'HMAC', hash: { name: 'SHA-256' } },
    false,
    ['sign']
  );
  
  // Generate PRK
  const prkBuffer = await crypto.subtle.sign('HMAC', key, input);
  return new Uint8Array(prkBuffer);
}

/**
 * HKDF Expand implementation (RFC 5869)
 * Used in Signal's Double Ratchet Algorithm
 */
export async function hkdfExpand(prk: Uint8Array, info: Uint8Array, outputLength: number): Promise<Uint8Array> {
  // Import HMAC key
  const key = await crypto.subtle.importKey(
    'raw',
    prk,
    { name: 'HMAC', hash: { name: 'SHA-256' } },
    false,
    ['sign']
  );
  
  const hashLen = 32; // SHA-256 hash length
  const n = Math.ceil(outputLength / hashLen);
  const t = new Uint8Array(outputLength);
  
  // T(0) = empty string
  let t0 = new Uint8Array(0);
  
  for (let i = 1; i <= n; i++) {
    // T(i) = HMAC-Hash(PRK, T(i-1) | info | i)
    const data = new Uint8Array(t0.length + info.length + 1);
    data.set(t0, 0);
    data.set(info, t0.length);
    data.set([i], t0.length + info.length);
    
    const result = await crypto.subtle.sign('HMAC', key, data);
    const resultBytes = new Uint8Array(result);
    
    // Copy to output
    const offset = (i - 1) * hashLen;
    const toCopy = Math.min(outputLength - offset, hashLen);
    t.set(resultBytes.slice(0, toCopy), offset);
    
    // Update T(i-1)
    t0 = resultBytes;
  }
  
  return t;
}

/**
 * Signal-inspired safety numbers for contact verification
 */
export function generateSafetyNumber(ourKey: Uint8Array, theirKey: Uint8Array): string {
  // Combine keys in canonical order
  let combinedKeys: Uint8Array;
  if (compareUint8Arrays(ourKey, theirKey) < 0) {
    combinedKeys = concatenateArrays(ourKey, theirKey);
  } else {
    combinedKeys = concatenateArrays(theirKey, ourKey);
  }
  
  // Convert to 6-digit chunks for readability
  const hexString = Array.from(combinedKeys)
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
  
  // Format as 6-digit groups (like Signal's safety numbers)
  let formatted = '';
  for (let i = 0; i < Math.min(hexString.length, 60); i += 5) {
    if (i > 0 && i % 25 === 0) {
      formatted += '\n';
    } else if (i > 0) {
      formatted += ' ';
    }
    formatted += hexString.substr(i, 5);
  }
  
  return formatted;
}

/**
 * Compare two Uint8Arrays lexicographically
 */
function compareUint8Arrays(a: Uint8Array, b: Uint8Array): number {
  const minLen = Math.min(a.length, b.length);
  for (let i = 0; i < minLen; i++) {
    if (a[i] < b[i]) return -1;
    if (a[i] > b[i]) return 1;
  }
  return a.length - b.length;
}

/**
 * Concatenate multiple Uint8Arrays
 */
function concatenateArrays(...arrays: Uint8Array[]): Uint8Array {
  let totalLength = 0;
  for (const arr of arrays) {
    totalLength += arr.length;
  }
  
  const result = new Uint8Array(totalLength);
  let offset = 0;
  for (const arr of arrays) {
    result.set(arr, offset);
    offset += arr.length;
  }
  
  return result;
}

/**
 * Enhanced key derivation with X3DH-inspired technique
 * (Signal's Extended Triple Diffie-Hellman)
 */
export async function deriveSharedSecretX3DH(
  ourIdentityKey: CryptoKeyPair,
  ourEphemeralKey: CryptoKeyPair,
  theirIdentityKey: CryptoKey,
  theirSignedPreKey: CryptoKey
): Promise<Uint8Array> {
  // DH1 = DH(our_identity_key, their_signed_prekey)
  const dh1 = await deriveSharedSecret(ourIdentityKey.privateKey, theirSignedPreKey);
  
  // DH2 = DH(our_ephemeral_key, their_identity_key)
  const dh2 = await deriveSharedSecret(ourEphemeralKey.privateKey, theirIdentityKey);
  
  // DH3 = DH(our_ephemeral_key, their_signed_prekey)
  const dh3 = await deriveSharedSecret(ourEphemeralKey.privateKey, theirSignedPreKey);
  
  // SK = KDF(DH1 || DH2 || DH3)
  const concatenated = concatenateArrays(dh1, dh2, dh3);
  
  // Use HKDF to derive final shared secret
  const salt = new Uint8Array(32).fill(0);
  const info = new TextEncoder().encode("X3DH");
  const prk = await hkdfExtract(salt, concatenated);
  return await hkdfExpand(prk, info, 32);
}

/**
 * Derive shared secret using ECDH
 */
async function deriveSharedSecret(privateKey: CryptoKey, publicKey: CryptoKey): Promise<Uint8Array> {
  const shared = await crypto.subtle.deriveBits(
    { name: "ECDH", public: publicKey },
    privateKey,
    256 // For a 32-byte output
  );
  
  return new Uint8Array(shared);
}

/**
 * Generate an ECDH key pair for X3DH
 */
export async function generateECDHKeyPair(): Promise<CryptoKeyPair> {
  return await crypto.subtle.generateKey(
    { name: "ECDH", namedCurve: "P-256" },
    true,
    ["deriveKey", "deriveBits"]
  );
}

/**
 * Signal fingerprint identification
 */
export async function generateFingerprint(publicKey: Uint8Array): Promise<string> {
  // Hash the public key
  const hash = await sha256Hash(publicKey);
  
  // Convert to hexadecimal
  return Array.from(hash.slice(0, 16))
    .map(b => b.toString(16).padStart(2, '0'))
    .join(':');
}

/**
 * Key verification phrases (Signal-inspired)
 */
export function generateVerificationPhrase(fingerprint: string): string[] {
  // Use fingerprint to seed a deterministic set of words
  // This example uses a simplified version for demonstration
  const wordList = [
    "alpha", "bravo", "charlie", "delta", "echo",
    "foxtrot", "golf", "hotel", "india", "juliet",
    "kilo", "lima", "mike", "november", "oscar",
    "papa", "quebec", "romeo", "sierra", "tango",
    "uniform", "victor", "whiskey", "x-ray", "yankee", "zulu"
  ];
  
  const phrases: string[] = [];
  const fingerprintBytes = fingerprint.split(':').map(hex => parseInt(hex, 16));
  
  // Generate 5 words from the fingerprint
  for (let i = 0; i < 5; i++) {
    if (i < fingerprintBytes.length) {
      const wordIndex = fingerprintBytes[i] % wordList.length;
      phrases.push(wordList[wordIndex]);
    }
  }
  
  return phrases;
}