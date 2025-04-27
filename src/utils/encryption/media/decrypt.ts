
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
    console.log("Beginning media decryption");
    
    // Convert IV string to Uint8Array - handle various formats
    let ivArray: Uint8Array;
    
    if (iv.includes(',')) {
      // Comma-separated numbers
      ivArray = new Uint8Array(iv.split(',').map(Number));
    } else {
      try {
        // Might be base64 encoded
        const arrayBuffer = base64ToArrayBuffer(iv);
        ivArray = new Uint8Array(arrayBuffer);
      } catch (e) {
        // Fallback to direct string conversion
        console.warn("Failed to parse IV as base64, trying direct conversion", e);
        ivArray = new Uint8Array(Array.from(iv).map(c => c.charCodeAt(0)));
      }
    }
    
    console.log("IV parsed successfully, length:", ivArray.length);
    
    // Import the encryption key
    const key = await importEncryptionKey(encryptionKey);
    console.log("Encryption key imported successfully");
    
    // Decrypt the media buffer
    const decryptedBuffer = await decryptMediaBuffer(encryptedData, key, ivArray);
    console.log("Media decryption successful, buffer size:", decryptedBuffer.byteLength);
    
    // Convert back to Blob
    return new Blob([decryptedBuffer], { type: mediaType });
  } catch (error) {
    console.error('Media decryption failed:', error);
    throw new Error('Failed to decrypt media content: ' + (error instanceof Error ? error.message : 'Unknown error'));
  }
};
