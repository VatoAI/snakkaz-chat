
/**
 * Media encryption utilities for handling images, video, audio and documents
 */

import { arrayBufferToBase64, base64ToArrayBuffer } from './data-conversion';

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
    expires?: number; // Timestamp for when media should expire
    isEncrypted: boolean;
  };
}

// Encrypt a media file (image, video, audio, document)
export const encryptMedia = async (
  file: File
): Promise<EncryptedMedia> => {
  try {
    console.log('Starting media encryption process for:', file.name);
    
    // Generate encryption key
    const key = await window.crypto.subtle.generateKey(
      {
        name: "AES-GCM",
        length: 256,
      },
      true,
      ["encrypt", "decrypt"]
    );

    // Generate IV
    const iv = window.crypto.getRandomValues(new Uint8Array(12));

    // Read file as ArrayBuffer
    const fileBuffer = await file.arrayBuffer();
    
    console.log(`File read to buffer, size: ${fileBuffer.byteLength} bytes`);
    
    // Encrypt data
    const encryptedBuffer = await window.crypto.subtle.encrypt(
      {
        name: "AES-GCM",
        iv: iv,
      },
      key,
      fileBuffer
    );

    // Export key for storage
    const exportedKey = await window.crypto.subtle.exportKey("jwk", key);

    // Initialize metadata with size and original filename
    const metadata: EncryptedMedia['metadata'] = { 
      size: file.size, 
      originalName: file.name,
      isEncrypted: true
    };
    
    // Collect metadata based on file type
    if (file.type.startsWith('image/')) {
      const img = new Image();
      await new Promise((resolve, reject) => {
        img.onload = () => {
          if (metadata) {
            metadata.width = img.width;
            metadata.height = img.height;
          }
          resolve(null);
        };
        img.onerror = reject;
        img.src = URL.createObjectURL(file);
      });
      
      // Revoke object URL to prevent memory leaks
      URL.revokeObjectURL(img.src);
    }
    else if (file.type.startsWith('video/')) {
      const video = document.createElement('video');
      await new Promise((resolve, reject) => {
        video.onloadedmetadata = () => {
          if (metadata) {
            metadata.width = video.videoWidth;
            metadata.height = video.videoHeight;
            metadata.duration = video.duration;
          }
          resolve(null);
        };
        video.onerror = reject;
        video.src = URL.createObjectURL(file);
      });
      
      // Revoke object URL to prevent memory leaks
      URL.revokeObjectURL(video.src);
    }
    else if (file.type.startsWith('audio/')) {
      const audio = new Audio();
      await new Promise((resolve, reject) => {
        audio.onloadedmetadata = () => {
          if (metadata) {
            metadata.duration = audio.duration;
          }
          resolve(null);
        };
        audio.onerror = reject;
        audio.src = URL.createObjectURL(file);
      });
      
      // Revoke object URL to prevent memory leaks
      URL.revokeObjectURL(audio.src);
    }
    
    console.log('Media encryption completed successfully');

    return {
      encryptedData: encryptedBuffer,
      encryptionKey: JSON.stringify(exportedKey),
      iv: arrayBufferToBase64(iv),
      mediaType: file.type,
      metadata
    };
  } catch (error) {
    console.error("Media encryption failed:", error);
    throw new Error("Failed to encrypt media file");
  }
};

// Decrypt a media file
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
    
    // If encryptedData is a string, convert it to ArrayBuffer
    const encryptedBuffer = typeof encryptedMedia.encryptedData === 'string' 
      ? base64ToArrayBuffer(encryptedMedia.encryptedData)
      : encryptedMedia.encryptedData;
    
    // Import encryption key
    const key = await window.crypto.subtle.importKey(
      "jwk",
      JSON.parse(encryptedMedia.encryptionKey),
      {
        name: "AES-GCM",
        length: 256,
      },
      false,
      ["decrypt"]
    );

    // Get IV as ArrayBuffer
    const iv = typeof encryptedMedia.iv === 'string'
      ? base64ToArrayBuffer(encryptedMedia.iv)
      : encryptedMedia.iv;

    // Decrypt data
    const decryptedBuffer = await window.crypto.subtle.decrypt(
      {
        name: "AES-GCM",
        iv: iv instanceof ArrayBuffer ? new Uint8Array(iv) : iv,
      },
      key,
      encryptedBuffer
    );
    
    console.log('Media decryption completed successfully');

    // Return as Blob with original media type
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
  const expirationTime = creationTime + (ttl * 1000); // Convert TTL to milliseconds
  const currentTime = new Date().getTime();
  
  return currentTime > expirationTime;
};
