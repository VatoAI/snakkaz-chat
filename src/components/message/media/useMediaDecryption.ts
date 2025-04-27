
import { useState, useEffect, useCallback } from 'react';
import { decryptMedia } from '@/utils/encryption/media';

export interface MediaDecryptionResult {
  decryptedURL: string | null;
  isLoading: boolean;
  error: Error | null;
}

// This hook handles decryption of media files
export const useMediaDecryption = (
  url: string | null,
  encryptionKey: string | null,
  iv: string | null,
  mimeType: string
): MediaDecryptionResult => {
  const [decryptedURL, setDecryptedURL] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  const decryptData = useCallback(async (url: string, encryptionKey: string, iv: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const arrayBuffer = await response.arrayBuffer();
      
      // Convert IV string to an array
      const ivArray = new Uint8Array(iv.split(',').map(Number));
      
      const decrypted = await decryptMedia({
        encryptedData: arrayBuffer,
        encryptionKey,
        iv,
        mediaType: mimeType
      });
      
      // Create a URL for the blob
      const objectURL = URL.createObjectURL(decrypted);

      setDecryptedURL(objectURL);
      setIsLoading(false);
    } catch (error: any) {
      setError(error);
      setIsLoading(false);
    }
  }, [mimeType]);

  useEffect(() => {
    if (url && encryptionKey && iv) {
      decryptData(url, encryptionKey, iv);
    }
    return () => {
      if (decryptedURL) {
        URL.revokeObjectURL(decryptedURL);
      }
    };
  }, [url, encryptionKey, iv, decryptData, decryptedURL]);

  return { decryptedURL, isLoading, error };
};
