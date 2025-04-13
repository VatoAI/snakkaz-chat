/**
 * Media encryption utilities for handling images and audio
 */

import { arrayBufferToBase64, base64ToArrayBuffer } from './data-conversion';

export interface EncryptedMedia {
  encryptedData: string;
  encryptionKey: string;
  iv: string;
  mediaType: string;
  metadata?: {
    width?: number;
    height?: number;
    duration?: number;
    size: number;
  };
}

// Krypter mediefil (bilde eller lyd)
export const encryptMedia = async (
  file: File
): Promise<EncryptedMedia> => {
  try {
    // Generer krypteringsnøkkel
    const key = await window.crypto.subtle.generateKey(
      {
        name: "AES-GCM",
        length: 256,
      },
      true,
      ["encrypt", "decrypt"]
    );

    // Generer IV
    const iv = window.crypto.getRandomValues(new Uint8Array(12));

    // Les filen som ArrayBuffer
    const fileBuffer = await file.arrayBuffer();
    
    // Krypter data
    const encryptedBuffer = await window.crypto.subtle.encrypt(
      {
        name: "AES-GCM",
        iv: iv,
      },
      key,
      fileBuffer
    );

    // Eksporter nøkkelen
    const exportedKey = await window.crypto.subtle.exportKey("jwk", key);

    // Hent metadata hvis det er et bilde
    let metadata = { size: file.size };
    if (file.type.startsWith('image/')) {
      const img = new Image();
      await new Promise((resolve, reject) => {
        img.onload = () => {
          metadata = {
            ...metadata,
            width: img.width,
            height: img.height
          };
          resolve(null);
        };
        img.onerror = reject;
        img.src = URL.createObjectURL(file);
      });
    }
    // For lyd, hent varighet
    else if (file.type.startsWith('audio/')) {
      const audio = new Audio();
      await new Promise((resolve, reject) => {
        audio.onloadedmetadata = () => {
          metadata = {
            ...metadata,
            duration: audio.duration
          };
          resolve(null);
        };
        audio.onerror = reject;
        audio.src = URL.createObjectURL(file);
      });
    }

    return {
      encryptedData: arrayBufferToBase64(encryptedBuffer),
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

// Dekrypter mediefil
export const decryptMedia = async (
  encryptedMedia: EncryptedMedia
): Promise<Blob> => {
  try {
    // Importer krypteringsnøkkel
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

    // Dekrypter data
    const decryptedBuffer = await window.crypto.subtle.decrypt(
      {
        name: "AES-GCM",
        iv: base64ToArrayBuffer(encryptedMedia.iv),
      },
      key,
      base64ToArrayBuffer(encryptedMedia.encryptedData)
    );

    // Returner som Blob med original mediatype
    return new Blob([decryptedBuffer], { type: encryptedMedia.mediaType });
  } catch (error) {
    console.error("Media decryption failed:", error);
    throw new Error("Failed to decrypt media file");
  }
};