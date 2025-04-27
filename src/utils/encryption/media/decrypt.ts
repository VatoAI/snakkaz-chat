
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
    
    // Convert IV string to Uint8Array - standardize on Base64 format
    let ivArray: Uint8Array;
    
    try {
      // Try Base64 decode first (our standard format)
      const ivString = atob(iv);
      ivArray = new Uint8Array(ivString.split('').map(c => c.charCodeAt(0)));
      console.log("IV parsed as Base64 successfully, length:", ivArray.length);
    } catch (e) {
      console.warn("Failed to parse IV as Base64, trying comma-separated format", e);
      
      if (iv.includes(',')) {
        // Fallback to comma-separated numbers for backward compatibility
        ivArray = new Uint8Array(iv.split(',').map(Number));
        console.log("IV parsed as comma-separated values, length:", ivArray.length);
      } else {
        // Last resort: direct string conversion
        console.warn("Trying direct string conversion for IV");
        ivArray = new Uint8Array(Array.from(iv).map(c => c.charCodeAt(0)));
      }
    }
    
    if (ivArray.length !== 12) {
      console.warn(`IV length is ${ivArray.length}, expected 12. This might cause decryption to fail.`);
    }
    
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
