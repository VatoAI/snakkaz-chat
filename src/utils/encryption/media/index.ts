
import { extractMediaMetadata } from './metadata-extractor';
import { encryptMediaBuffer, decryptMediaBuffer, exportEncryptionKey, importEncryptionKey } from './crypto-operations';
import { arrayBufferToBase64, base64ToArrayBuffer } from '../data-conversion';

/**
 * Extend options to allow supplying key/iv for global E2EE room
 */
export interface EncryptedMedia {
  encryptedData: string | ArrayBuffer;
  encryptionKey: string;
  iv: string;
  mediaType: string;
  metadata?: {
    width?: number;
    height?: number;
    duration?: number;
    size: number;
    originalName?: string;
    expires?: number;
    isEncrypted: boolean;
  };
}

// Update encryptMedia to allow passing key/iv for global use
export const encryptMedia = async (
  file: File,
  globalOverride?: { encryptionKey: string; iv: string }
): Promise<EncryptedMedia> => {
  try {
    console.log('Starting media encryption process for:', file.name);
    const fileBuffer = await file.arrayBuffer();
    console.log(`File read to buffer, size: ${fileBuffer.byteLength} bytes`);
    
    let encryptResult;
    
    if (globalOverride?.encryptionKey && globalOverride.iv) {
      // Import the global key for encryption
      const key = await importEncryptionKey(globalOverride.encryptionKey);
      const iv = new Uint8Array(atob(globalOverride.iv).split("").map(c => c.charCodeAt(0)));
      
      // Encrypt with global key/iv
      encryptResult = await encryptMediaBuffer(fileBuffer, key, iv);
      
      const metadata = await extractMediaMetadata(file);
      return {
        encryptedData: encryptResult.encryptedBuffer,
        encryptionKey: globalOverride.encryptionKey,
        iv: globalOverride.iv,
        mediaType: file.type,
        metadata
      };
    }
    
    // Default behavior (generate new key/iv)
    encryptResult = await encryptMediaBuffer(fileBuffer);
    const exportedKey = await exportEncryptionKey(encryptResult.key);
    const metadata = await extractMediaMetadata(file);
    
    return {
      encryptedData: encryptResult.encryptedBuffer,
      encryptionKey: exportedKey,
      iv: arrayBufferToBase64(encryptResult.iv),
      mediaType: file.type,
      metadata
    };
  } catch (error) {
    console.error("Media encryption failed:", error);
    throw new Error("Failed to encrypt media file");
  }
};

export const decryptMedia = async (
  encryptedMedia: {
    encryptedData: ArrayBuffer | string;
    encryptionKey: string;
    iv: string;
    mediaType: string;
  }
): Promise<Blob> => {
  try {
    console.log('Starting media decryption process');
    const encryptedBuffer = typeof encryptedMedia.encryptedData === 'string' 
      ? base64ToArrayBuffer(encryptedMedia.encryptedData)
      : encryptedMedia.encryptedData;
    const key = await importEncryptionKey(encryptedMedia.encryptionKey);
    const iv = new Uint8Array(atob(encryptedMedia.iv).split("").map(c => c.charCodeAt(0)));
    const decryptedBuffer = await decryptMediaBuffer(encryptedBuffer, key, iv);
    console.log('Media decryption completed successfully');
    return new Blob([decryptedBuffer], { type: encryptedMedia.mediaType });
  } catch (error) {
    console.error("Media decryption failed:", error);
    throw new Error("Failed to decrypt media file");
  }
};

// Helper function to check if media is expired based on TTL
export const isMediaExpired = (
  createdAt: string,
  ttl: number | null
): boolean => {
  if (!ttl) return false;
  const creationTime = new Date(createdAt).getTime();
  const expirationTime = creationTime + (ttl * 1000);
  const currentTime = new Date().getTime();
  return currentTime > expirationTime;
};
