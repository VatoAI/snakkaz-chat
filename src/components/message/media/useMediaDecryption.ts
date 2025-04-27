
import { useState, useEffect, useCallback } from 'react';
import { decryptMedia } from '@/utils/encryption/media';
import { supabase } from '@/integrations/supabase/client';

export interface MediaDecryptionResult {
  decryptedURL: string | null;
  isLoading: boolean;
  error: Error | null;
  retry: () => void;
}

// This hook handles decryption of media files
export const useMediaDecryption = (
  mediaUrl: string | null,
  encryptionKey: string | null,
  iv: string | null,
  mimeType: string = 'image/jpeg'
): MediaDecryptionResult => {
  const [decryptedURL, setDecryptedURL] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  const decryptData = useCallback(async (url: string, encryptionKey: string, iv: string) => {
    // Clear previous state
    if (decryptedURL) {
      URL.revokeObjectURL(decryptedURL);
      setDecryptedURL(null);
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      console.log(`Attempting to decrypt media: ${url.substring(0, 50)}... with key length ${encryptionKey.length} and iv ${iv.substring(0, 10)}...`);
      
      // Get the full URL from storage if it's a path
      let fullUrl = url;
      if (!url.startsWith('http')) {
        console.log("Media URL is a path, getting from storage:", url);
        const { data } = supabase.storage
          .from('chat-media')
          .getPublicUrl(url);
          
        fullUrl = data.publicUrl;
      }
      
      // Fetch the encrypted data
      const response = await fetch(fullUrl);
      if (!response.ok) {
        throw new Error(`HTTP error fetching media! Status: ${response.status}`);
      }
      
      const arrayBuffer = await response.arrayBuffer();
      console.log(`Fetched encrypted data: ${arrayBuffer.byteLength} bytes`);
      
      // Decrypt the media
      const decrypted = await decryptMedia({
        encryptedData: arrayBuffer,
        encryptionKey: encryptionKey,
        iv: iv,
        mediaType: mimeType
      });
      
      console.log(`Decryption successful, blob size: ${decrypted.size} bytes, type: ${decrypted.type}`);
      
      // Create a URL for the blob
      const objectURL = URL.createObjectURL(decrypted);
      setDecryptedURL(objectURL);
      
    } catch (error: any) {
      console.error("Media decryption failed:", error);
      setError(error);
    } finally {
      setIsLoading(false);
    }
  }, [mimeType]);

  // Handle decryption
  useEffect(() => {
    if (mediaUrl && encryptionKey && iv) {
      decryptData(mediaUrl, encryptionKey, iv);
    }
    
    return () => {
      if (decryptedURL) {
        URL.revokeObjectURL(decryptedURL);
      }
    };
  }, [mediaUrl, encryptionKey, iv, retryCount, decryptData, decryptedURL]);

  // Function to retry decryption
  const retry = useCallback(() => {
    console.log("Retrying media decryption...");
    setRetryCount(prev => prev + 1);
  }, []);

  return { 
    decryptedURL, 
    isLoading, 
    error, 
    retry 
  };
};
