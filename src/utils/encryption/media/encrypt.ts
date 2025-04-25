
import { encryptMediaBuffer, exportEncryptionKey } from '../crypto-operations';
import { extractMediaMetadata } from './metadata-extractor';

export const encryptMedia = async (file: File) => {
  // Read file as ArrayBuffer
  const fileBuffer = await file.arrayBuffer();

  // Encrypt the media file
  const { encryptedBuffer, key, iv } = await encryptMediaBuffer(fileBuffer);

  // Convert encrypted buffer back to Blob
  const encryptedBlob = new Blob([encryptedBuffer], { type: file.type });

  // Export encryption key as a string
  const encryptionKey = await exportEncryptionKey(key);

  // Extract media metadata
  const metadata = extractMediaMetadata(file);

  return {
    encryptedData: encryptedBlob,
    encryptionKey,
    iv: iv.toString(),
    mediaType: file.type,
    metadata
  };
};

