
import { useState, useEffect, useCallback } from 'react';
// Fix the import to use the correct path
import { decryptFile } from '@/utils/encryption/media/decrypt';

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
      
      const decrypted = await decryptFile(
        new Uint8Array(arrayBuffer),
        encryptionKey,
        iv
      );
      
      // Create a new blob from the decrypted data
      const blob = new Blob([decrypted], { type: mimeType });
      
      // Create a URL for the blob
      const objectURL = URL.createObjectURL(blob);

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
