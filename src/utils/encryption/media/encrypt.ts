
import { encryptMediaBuffer, exportEncryptionKey } from './crypto-operations';
import { extractMediaMetadata } from './metadata-extractor';

export const encryptMedia = async (file: File) => {
  try {
    console.log(`Starting encryption for file: ${file.name} (${file.type})`);
    
    // Read file as ArrayBuffer
    const fileBuffer = await file.arrayBuffer();
    console.log(`File read successfully, size: ${fileBuffer.byteLength} bytes`);

    // Encrypt the media file
    console.log("Beginning media encryption");
    const { encryptedBuffer, key, iv } = await encryptMediaBuffer(fileBuffer);
    console.log(`Media encryption successful, result size: ${encryptedBuffer.byteLength} bytes`);

    // Convert encrypted buffer back to Blob
    const encryptedBlob = new Blob([encryptedBuffer], { type: file.type });

    // Export encryption key as a string
    const encryptionKey = await exportEncryptionKey(key);
    
    // Convert IV to string format
    const ivString = Array.from(iv).join(',');
    console.log("IV prepared:", ivString.substring(0, 20) + "...");

    // Extract media metadata
    console.log("Extracting media metadata");
    const metadata = await extractMediaMetadata(file);
    console.log("Metadata extraction complete");

    return {
      encryptedData: encryptedBlob,
      encryptionKey,
      iv: ivString,
      mediaType: file.type,
      metadata
    };
  } catch (error) {
    console.error("Media encryption failed:", error);
    throw new Error("Failed to encrypt media: " + (error instanceof Error ? error.message : "Unknown error"));
  }
};
