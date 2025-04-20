
import { extractMediaMetadata } from './metadata-extractor';
import { encryptMediaBuffer, decryptMediaBuffer, exportEncryptionKey, importEncryptionKey } from './crypto-operations';
import { arrayBufferToBase64, base64ToArrayBuffer } from '../data-conversion';

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

export const encryptMedia = async (file: File): Promise<EncryptedMedia> => {
  try {
    console.log('Starting media encryption process for:', file.name);
    
    // Read file as ArrayBuffer
    const fileBuffer = await file.arrayBuffer();
    console.log(`File read to buffer, size: ${fileBuffer.byteLength} bytes`);
    
    // Encrypt the file
    const { encryptedBuffer, key, iv } = await encryptMediaBuffer(fileBuffer);
    
    // Export the key for storage
    const exportedKey = await exportEncryptionKey(key);
    
    // Extract metadata based on file type
    const metadata = await extractMediaMetadata(file);
    
    console.log('Media encryption completed successfully');

    return {
      encryptedData: encryptedBuffer,
      encryptionKey: exportedKey,
      iv: arrayBufferToBase64(iv),
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
    
    // Convert data to ArrayBuffer if needed
    const encryptedBuffer = typeof encryptedMedia.encryptedData === 'string' 
      ? base64ToArrayBuffer(encryptedMedia.encryptedData)
      : encryptedMedia.encryptedData;
    
    // Import the encryption key
    const key = await importEncryptionKey(encryptedMedia.encryptionKey);

    // Get IV as Uint8Array
    const iv = new Uint8Array(base64ToArrayBuffer(encryptedMedia.iv));

    // Decrypt the data
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
