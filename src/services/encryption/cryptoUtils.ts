/**
 * Cryptographic Utilities for Snakkaz Chat
 *
 * Provides low-level cryptographic functions using the Web Crypto API
 * for secure end-to-end encryption.
 */

// Key types supported by the application
export enum KeyType {
  AES_GCM = 'AES-GCM',     // For symmetric encryption
  RSA_OAEP = 'RSA-OAEP',   // For asymmetric encryption
  ECDH = 'ECDH',           // For key exchange
  ECDSA = 'ECDSA'          // For digital signatures
}

// Key usage purposes
export enum KeyUsage {
  ENCRYPT = 'encrypt',
  DECRYPT = 'decrypt',
  SIGN = 'sign',
  VERIFY = 'verify',
  DERIVE_KEY = 'deriveKey',
  DERIVE_BITS = 'deriveBits',
  WRAP_KEY = 'wrapKey',
  UNWRAP_KEY = 'unwrapKey'
}

// Algorithm specifications
export interface AlgorithmSpecs {
  name: string;
  length?: number;
  hash?: string;
  namedCurve?: string;
  modulusLength?: number;
  publicExponent?: Uint8Array;
  iterations?: number;
  salt?: Uint8Array;
}

// Convert from string to ArrayBuffer and vice versa
export const stringToArrayBuffer = (str: string): ArrayBuffer => {
  return new TextEncoder().encode(str);
};

export const arrayBufferToString = (buffer: ArrayBuffer): string => {
  return new TextDecoder().decode(buffer);
};

// Convert from ArrayBuffer to Base64 string and vice versa
export const arrayBufferToBase64 = (buffer: ArrayBuffer): string => {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
};

export const base64ToArrayBuffer = (base64: string): ArrayBuffer => {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes.buffer;
};

/**
 * Generate a random encryption key using the Web Crypto API
 */
export const generateKey = async (
  keyType: KeyType,
  keyUsages: KeyUsage[],
  algorithm: AlgorithmSpecs,
  extractable: boolean = false
): Promise<CryptoKey> => {
  try {
    return await window.crypto.subtle.generateKey(
      algorithm as AesKeyGenParams | RsaHashedKeyGenParams | EcKeyGenParams,
      extractable,
      keyUsages as KeyUsage[]
    );
  } catch (error) {
    console.error('Key generation failed:', error);
    throw new Error(`Failed to generate key: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

/**
 * Generate a random AES key for symmetric encryption
 */
export const generateAesKey = async (
  length: 256 | 192 | 128 = 256,
  extractable: boolean = false
): Promise<CryptoKey> => {
  return generateKey(
    KeyType.AES_GCM,
    [KeyUsage.ENCRYPT, KeyUsage.DECRYPT],
    { name: KeyType.AES_GCM, length },
    extractable
  );
};

/**
 * Generate an RSA key pair for asymmetric encryption
 */
export const generateRsaKeyPair = async (
  modulusLength: 2048 | 4096 = 4096,
  hashAlgorithm: 'SHA-256' | 'SHA-384' | 'SHA-512' = 'SHA-256',
  extractable: boolean = false
): Promise<CryptoKeyPair> => {
  return await window.crypto.subtle.generateKey(
    {
      name: KeyType.RSA_OAEP,
      modulusLength,
      publicExponent: new Uint8Array([1, 0, 1]), // 65537
      hash: { name: hashAlgorithm }
    },
    extractable,
    [KeyUsage.ENCRYPT, KeyUsage.DECRYPT]
  ) as CryptoKeyPair;
};

/**
 * Generate an ECDH key pair for key exchange
 */
export const generateEcdhKeyPair = async (
  curve: 'P-256' | 'P-384' | 'P-521' = 'P-256',
  extractable: boolean = false
): Promise<CryptoKeyPair> => {
  return await window.crypto.subtle.generateKey(
    {
      name: KeyType.ECDH,
      namedCurve: curve
    },
    extractable,
    [KeyUsage.DERIVE_KEY, KeyUsage.DERIVE_BITS]
  ) as CryptoKeyPair;
};

/**
 * Generate an ECDSA key pair for digital signatures
 */
export const generateEcdsaKeyPair = async (
  curve: 'P-256' | 'P-384' | 'P-521' = 'P-256',
  hashAlgorithm: 'SHA-256' | 'SHA-384' | 'SHA-512' = 'SHA-256',
  extractable: boolean = false
): Promise<CryptoKeyPair> => {
  return await window.crypto.subtle.generateKey(
    {
      name: KeyType.ECDSA,
      namedCurve: curve,
      hash: { name: hashAlgorithm }
    },
    extractable,
    [KeyUsage.SIGN, KeyUsage.VERIFY]
  ) as CryptoKeyPair;
};

/**
 * Encrypt data using AES-GCM
 */
export const encryptAesGcm = async (
  data: string | ArrayBuffer,
  key: CryptoKey,
  iv?: ArrayBuffer
): Promise<{
  encryptedData: ArrayBuffer;
  iv: ArrayBuffer;
}> => {
  // Generate a random IV if not provided
  const ivToUse = iv || window.crypto.getRandomValues(new Uint8Array(12));
  
  // Convert string to ArrayBuffer if needed
  const dataBuffer = typeof data === 'string' ? stringToArrayBuffer(data) : data;
  
  // Encrypt the data
  const encryptedData = await window.crypto.subtle.encrypt(
    {
      name: KeyType.AES_GCM,
      iv: ivToUse
    },
    key,
    dataBuffer
  );
  
  return {
    encryptedData,
    iv: ivToUse
  };
};

/**
 * Decrypt data using AES-GCM
 */
export const decryptAesGcm = async (
  encryptedData: ArrayBuffer,
  key: CryptoKey,
  iv: ArrayBuffer
): Promise<ArrayBuffer> => {
  return await window.crypto.subtle.decrypt(
    {
      name: KeyType.AES_GCM,
      iv
    },
    key,
    encryptedData
  );
};

/**
 * Encrypt data using RSA-OAEP
 */
export const encryptRsaOaep = async (
  data: string | ArrayBuffer,
  publicKey: CryptoKey
): Promise<ArrayBuffer> => {
  // Convert string to ArrayBuffer if needed
  const dataBuffer = typeof data === 'string' ? stringToArrayBuffer(data) : data;
  
  return await window.crypto.subtle.encrypt(
    {
      name: KeyType.RSA_OAEP
    },
    publicKey,
    dataBuffer
  );
};

/**
 * Decrypt data using RSA-OAEP
 */
export const decryptRsaOaep = async (
  encryptedData: ArrayBuffer,
  privateKey: CryptoKey
): Promise<ArrayBuffer> => {
  return await window.crypto.subtle.decrypt(
    {
      name: KeyType.RSA_OAEP
    },
    privateKey,
    encryptedData
  );
};

/**
 * Derive a shared secret using ECDH
 */
export const deriveSharedSecret = async (
  privateKey: CryptoKey,
  publicKey: CryptoKey
): Promise<ArrayBuffer> => {
  return await window.crypto.subtle.deriveBits(
    {
      name: KeyType.ECDH,
      public: publicKey
    },
    privateKey,
    256 // Output bits
  );
};

/**
 * Sign data using ECDSA
 */
export const signData = async (
  data: string | ArrayBuffer,
  privateKey: CryptoKey
): Promise<ArrayBuffer> => {
  // Convert string to ArrayBuffer if needed
  const dataBuffer = typeof data === 'string' ? stringToArrayBuffer(data) : data;
  
  return await window.crypto.subtle.sign(
    {
      name: KeyType.ECDSA,
      hash: { name: 'SHA-256' }
    },
    privateKey,
    dataBuffer
  );
};

/**
 * Verify a signature using ECDSA
 */
export const verifySignature = async (
  signature: ArrayBuffer,
  data: string | ArrayBuffer,
  publicKey: CryptoKey
): Promise<boolean> => {
  // Convert string to ArrayBuffer if needed
  const dataBuffer = typeof data === 'string' ? stringToArrayBuffer(data) : data;
  
  return await window.crypto.subtle.verify(
    {
      name: KeyType.ECDSA,
      hash: { name: 'SHA-256' }
    },
    publicKey,
    signature,
    dataBuffer
  );
};

/**
 * Export a CryptoKey to a JWK (JSON Web Key)
 */
export const exportKeyToJwk = async (key: CryptoKey): Promise<JsonWebKey> => {
  return await window.crypto.subtle.exportKey('jwk', key);
};

/**
 * Import a JWK (JSON Web Key) as a CryptoKey
 */
export const importKeyFromJwk = async (
  jwk: JsonWebKey,
  keyType: KeyType,
  keyUsages: KeyUsage[],
  extractable: boolean = false
): Promise<CryptoKey> => {
  const algorithm = getAlgorithmForKeyType(keyType, jwk);
  
  return await window.crypto.subtle.importKey(
    'jwk',
    jwk,
    algorithm,
    extractable,
    keyUsages as KeyUsage[]
  );
};

/**
 * Helper function to get the algorithm parameters for a key type
 */
const getAlgorithmForKeyType = (keyType: KeyType, jwk: JsonWebKey): AlgorithmIdentifier => {
  switch (keyType) {
    case KeyType.AES_GCM:
      return {
        name: KeyType.AES_GCM
      };
    case KeyType.RSA_OAEP:
      return {
        name: KeyType.RSA_OAEP,
        hash: { name: 'SHA-256' }
      };
    case KeyType.ECDH:
      return {
        name: KeyType.ECDH,
        namedCurve: jwk.crv || 'P-256'
      };
    case KeyType.ECDSA:
      return {
        name: KeyType.ECDSA,
        namedCurve: jwk.crv || 'P-256'
      };
    default:
      throw new Error(`Unsupported key type: ${keyType}`);
  }
};

/**
 * Derive a key from a password using PBKDF2
 */
export const deriveKeyFromPassword = async (
  password: string,
  salt: ArrayBuffer | Uint8Array,
  iterations: number = 100000,
  keyUsages: KeyUsage[] = [KeyUsage.ENCRYPT, KeyUsage.DECRYPT],
  extractable: boolean = false
): Promise<CryptoKey> => {
  // Convert password to key material
  const encoder = new TextEncoder();
  const passwordKey = await window.crypto.subtle.importKey(
    'raw',
    encoder.encode(password),
    'PBKDF2',
    false,
    ['deriveBits', 'deriveKey']
  );
  
  // Derive a key using PBKDF2
  return await window.crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: salt instanceof Uint8Array ? salt : new Uint8Array(salt),
      iterations,
      hash: 'SHA-256'
    },
    passwordKey,
    {
      name: KeyType.AES_GCM,
      length: 256
    },
    extractable,
    keyUsages as KeyUsage[]
  );
};

/**
 * Generate a cryptographically secure random string
 */
export const generateRandomString = (length: number = 32): string => {
  const array = new Uint8Array(length);
  window.crypto.getRandomValues(array);
  return Array.from(array).map(b => b.toString(16).padStart(2, '0')).join('');
};

/**
 * Generate a secure random salt for key derivation
 */
export const generateSalt = (length: number = 16): Uint8Array => {
  const salt = new Uint8Array(length);
  window.crypto.getRandomValues(salt);
  return salt;
};
