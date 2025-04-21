
/**
 * Message encryption and decryption utilities
 */

import { EncryptedMessage } from './types';
import { str2ab, ab2str, arrayBufferToBase64, base64ToArrayBuffer } from './data-conversion';

// Krypter melding
export const encryptMessage = async (message: string): Promise<{ encryptedContent: string, key: string, iv: string }> => {
  try {
    // Generer tilfeldig krypteringsnøkkel
    const key = await window.crypto.subtle.generateKey(
      {
        name: "AES-GCM",
        length: 256,
      },
      true,
      ["encrypt", "decrypt"]
    );

    // Generer tilfeldig IV
    const iv = window.crypto.getRandomValues(new Uint8Array(12));
    
    // Krypter meldingen
    const encryptedBuffer = await window.crypto.subtle.encrypt(
      {
        name: "AES-GCM",
        iv: iv,
      },
      key,
      str2ab(message)
    );
    
    // Eksporter nøkkelen for lagring
    const exportedKey = await window.crypto.subtle.exportKey("jwk", key);
    
    return {
      encryptedContent: arrayBufferToBase64(encryptedBuffer),
      key: JSON.stringify(exportedKey),
      iv: arrayBufferToBase64(iv)
    };
  } catch (error) {
    console.error("Message encryption failed:", error);
    throw new Error("Failed to encrypt message");
  }
};

// Dekrypter melding
export const decryptMessage = async (
  encryptedContent: string | EncryptedMessage,
  encryptionKey?: string,
  ivValue?: string
): Promise<string> => {
  try {
    // Case 1: Når vi får et EncryptedMessage-objekt
    if (typeof encryptedContent !== 'string') {
      const { encrypted_content, encryption_key, iv } = encryptedContent;
      return await innerDecrypt(encrypted_content, encryption_key, iv);
    } 
    // Case 2: Når vi får separate parametre
    else if (encryptionKey && ivValue) {
      return await innerDecrypt(encryptedContent, encryptionKey, ivValue);
    } 
    // Ugyldig argumentkombinasjon
    else {
      throw new Error("Invalid arguments for decryptMessage");
    }
  } catch (error) {
    console.error("Message decryption failed:", error);
    throw new Error("Failed to decrypt message");
  }
};

// Intern hjelpefunksjon for dekryptering
const innerDecrypt = async (
  encryptedContent: string,
  encryptionKey: string,
  iv: string
): Promise<string> => {
  // Konverter base64 til ArrayBuffer
  const encryptedBuffer = base64ToArrayBuffer(encryptedContent);
  const ivBuffer = base64ToArrayBuffer(iv);
  
  // Importer krypteringsnøkkel
  const key = await importEncryptionKey(encryptionKey);
  
  // Dekrypter meldingen
  const decryptedBuffer = await window.crypto.subtle.decrypt(
    {
      name: "AES-GCM",
      iv: new Uint8Array(ivBuffer),
    },
    key,
    encryptedBuffer
  );
  
  return ab2str(decryptedBuffer);
};

// Export the importEncryptionKey function so it can be used elsewhere
export const importEncryptionKey = async (keyString: string): Promise<CryptoKey> => {
  return window.crypto.subtle.importKey(
    "jwk",
    JSON.parse(keyString),
    {
      name: "AES-GCM",
      length: 256,
    },
    false,
    ["decrypt", "encrypt"] // Add encrypt permission to be safe
  );
};
