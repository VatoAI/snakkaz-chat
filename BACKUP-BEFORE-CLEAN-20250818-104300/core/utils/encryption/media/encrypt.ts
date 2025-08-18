import { extractMediaMetadata } from './metadata-extractor';

/**
 * Encrypts a media file with AES-GCM encryption
 * @param file The file to encrypt
 * @param keyOverride Optional encryption key to use (if provided)
 * @param ivOverride Optional IV to use (if provided)
 * @returns Object containing encrypted data, key, IV and metadata
 */
export const encryptFile = async (
  file: File,
  keyOverride?: string,
  ivOverride?: string
) => {
  try {
    console.log(`Starting encryption for file: ${file.name} (${file.type})`);
    
    // Read file as ArrayBuffer
    const fileBuffer = await file.arrayBuffer();
    console.log(`File read successfully, size: ${fileBuffer.byteLength} bytes`);

    // Generate or use provided encryption key
    let key, iv;
    
    if (keyOverride && ivOverride) {
      // Use provided key and IV
      key = await importEncryptionKey(keyOverride);
      iv = new Uint8Array(atob(ivOverride).split("").map(c => c.charCodeAt(0)));
    } else {
      // Generate new key and IV
      key = await window.crypto.subtle.generateKey(
        { name: "AES-GCM", length: 256 },
        true,
        ["encrypt", "decrypt"]
      );
      iv = window.crypto.getRandomValues(new Uint8Array(12));
    }
    
    // Encrypt the file
    console.log("Beginning file encryption");
    const encryptedBuffer = await window.crypto.subtle.encrypt(
      { name: "AES-GCM", iv },
      key,
      fileBuffer
    );
    console.log(`File encryption successful, result size: ${encryptedBuffer.byteLength} bytes`);

    // Export encryption key as a string
    const exportedKey = await window.crypto.subtle.exportKey("jwk", key);
    const encryptionKey = JSON.stringify(exportedKey);
    
    // Convert IV to base64 string format for storage
    const ivBase64 = btoa(String.fromCharCode.apply(null, Array.from(iv)));

    // Extract media metadata
    console.log("Extracting media metadata");
    const metadata = await extractMediaMetadata(file);
    console.log("Metadata extraction complete");

    return {
      encryptedData: new Blob([encryptedBuffer]),
      key: encryptionKey,
      iv: ivBase64,
      metadata
    };
  } catch (error) {
    console.error("File encryption failed:", error);
    throw new Error("Failed to encrypt file: " + (error instanceof Error ? error.message : "Unknown error"));
  }
};

/**
 * Import encryption key from string format
 */
export const importEncryptionKey = async (keyString: string): Promise<CryptoKey> => {
  return window.crypto.subtle.importKey(
    "jwk",
    JSON.parse(keyString),
    {
      name: "AES-GCM",
      length: 256,
    },
    false,
    ["encrypt", "decrypt"]
  );
};

/**
 * Encrypt a Blob/media content with AES-GCM encryption
 * Legacy function for backward compatibility
 * @param blob The blob data to encrypt
 * @returns Object containing encrypted data, key, IV and metadata
 */
export const encryptMedia = async (blob: Blob) => {
  try {
    // Generate encryption key
    const key = await window.crypto.subtle.generateKey(
      { name: "AES-GCM", length: 256 },
      true,
      ["encrypt", "decrypt"]
    );
    
    // Generate random IV
    const iv = window.crypto.getRandomValues(new Uint8Array(12));
    
    // Read blob as ArrayBuffer
    const fileBuffer = await blob.arrayBuffer();
    
    // Encrypt the blob
    const encryptedBuffer = await window.crypto.subtle.encrypt(
      { name: "AES-GCM", iv },
      key,
      fileBuffer
    );
    
    // Export encryption key as a string
    const exportedKey = await window.crypto.subtle.exportKey("jwk", key);
    const encryptionKey = JSON.stringify(exportedKey);
    
    // Convert IV to base64 string format for storage
    const ivBase64 = btoa(String.fromCharCode.apply(null, Array.from(iv)));
    
    // Extract basic metadata
    const metadata = {
      size: blob.size,
      type: blob.type
    };
    
    return {
      encryptedData: new Blob([encryptedBuffer]),
      key: encryptionKey,
      iv: ivBase64,
      metadata
    };
  } catch (error) {
    console.error("Blob encryption failed:", error);
    throw new Error("Failed to encrypt media: " + (error instanceof Error ? error.message : "Unknown error"));
  }
};
