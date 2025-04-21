
import { arrayBufferToBase64, base64ToArrayBuffer } from '../data-conversion';

export const encryptMediaBuffer = async (
  fileBuffer: ArrayBuffer,
  customKey?: CryptoKey,
  customIv?: Uint8Array
): Promise<{ encryptedBuffer: ArrayBuffer; key: CryptoKey; iv: Uint8Array }> => {
  // Use provided key and IV if available, otherwise generate new ones
  const key = customKey || await window.crypto.subtle.generateKey(
    {
      name: "AES-GCM",
      length: 256,
    },
    true,
    ["encrypt", "decrypt"]
  );

  const iv = customIv || window.crypto.getRandomValues(new Uint8Array(12));
  
  const encryptedBuffer = await window.crypto.subtle.encrypt(
    {
      name: "AES-GCM",
      iv: iv,
    },
    key,
    fileBuffer
  );

  return { encryptedBuffer, key, iv };
};

export const decryptMediaBuffer = async (
  encryptedBuffer: ArrayBuffer,
  key: CryptoKey,
  iv: Uint8Array
): Promise<ArrayBuffer> => {
  return window.crypto.subtle.decrypt(
    {
      name: "AES-GCM",
      iv: iv,
    },
    key,
    encryptedBuffer
  );
};

export const exportEncryptionKey = async (key: CryptoKey): Promise<string> => {
  const exportedKey = await window.crypto.subtle.exportKey("jwk", key);
  return JSON.stringify(exportedKey);
};

export const importEncryptionKey = async (keyString: string): Promise<CryptoKey> => {
  return window.crypto.subtle.importKey(
    "jwk",
    JSON.parse(keyString),
    {
      name: "AES-GCM",
      length: 256,
    },
    false,
    ["decrypt", "encrypt"] // Add encrypt permission to support global encryption
  );
};
