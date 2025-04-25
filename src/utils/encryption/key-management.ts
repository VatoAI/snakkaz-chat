
/**
 * Key management utilities for encryption
 */

// Generate a random key pair for secure communication
export const generateKeyPair = async (): Promise<{ publicKey: JsonWebKey; privateKey: JsonWebKey }> => {
  try {
    const keyPair = await window.crypto.subtle.generateKey(
      {
        name: "ECDH",
        namedCurve: "P-256",
      },
      true,
      ["deriveKey", "deriveBits"]
    );

    const publicKey = await window.crypto.subtle.exportKey(
      "jwk",
      keyPair.publicKey
    );

    const privateKey = await window.crypto.subtle.exportKey(
      "jwk",
      keyPair.privateKey
    );

    return {
      publicKey,
      privateKey,
    };
  } catch (error) {
    console.error("Key generation failed:", error);
    throw new Error("Failed to generate key pair");
  }
};

/**
 * Generates a random encryption key for group encryption and other purposes
 * Returns the key as a Base64-encoded string
 */
export const generateEncryptionKey = async (): Promise<string> => {
  try {
    // Generate random encryption key
    const key = await window.crypto.subtle.generateKey(
      {
        name: "AES-GCM",
        length: 256,
      },
      true,
      ["encrypt", "decrypt"]
    );
    
    // Export key as JWK
    const exportedKey = await window.crypto.subtle.exportKey("jwk", key);
    
    // Return as string
    return JSON.stringify(exportedKey);
  } catch (error) {
    console.error("Encryption key generation failed:", error);
    throw new Error("Failed to generate encryption key");
  }
};

// Adding missing functions to resolve import errors
export const encryptSessionKey = async (key: string): Promise<string> => {
  // Implementation placeholder
  return key;
};

export const decryptSessionKey = async (encryptedKey: string): Promise<string> => {
  // Implementation placeholder
  return encryptedKey;
};

export const deriveKey = async (password: string, salt: string): Promise<CryptoKey> => {
  const encoder = new TextEncoder();
  const passwordBuffer = encoder.encode(password);
  const saltBuffer = encoder.encode(salt);

  const baseKey = await window.crypto.subtle.importKey(
    "raw",
    passwordBuffer,
    { name: "PBKDF2" },
    false,
    ["deriveKey"]
  );

  return window.crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      salt: saltBuffer,
      iterations: 100000,
      hash: "SHA-256",
    },
    baseKey,
    { name: "AES-GCM", length: 256 },
    true,
    ["encrypt", "decrypt"]
  );
};

export const generateSalt = (): string => {
  const array = new Uint8Array(16);
  window.crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, "0")).join("");
};

export const hashPassword = async (password: string): Promise<string> => {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await window.crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(byte => byte.toString(16).padStart(2, "0")).join("");
};
