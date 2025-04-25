
import { decryptMediaBuffer, importEncryptionKey } from './crypto-operations';
import { base64ToArrayBuffer } from '../data-conversion';

interface DecryptMediaParams {
  encryptedData: ArrayBuffer;
  encryptionKey: string;
  iv: string;
  mediaType: string;
}

export const decryptMedia = async ({ 
  encryptedData, 
  encryptionKey, 
  iv, 
  mediaType 
}: DecryptMediaParams): Promise<Blob> => {
  try {
    // Convert IV string back to Uint8Array
    const ivArray = new Uint8Array(iv.split(',').map(Number));
    
    // Import the encryption key
    const key = await importEncryptionKey(encryptionKey);
    
    // Decrypt the media buffer
    const decryptedBuffer = await decryptMediaBuffer(encryptedData, key, ivArray);
    
    // Convert back to Blob
    return new Blob([decryptedBuffer], { type: mediaType });
  } catch (error) {
    console.error('Media decryption failed:', error);
    throw new Error('Failed to decrypt media content');
  }
};
