
import { useState, useEffect, useCallback } from "react";
import { DecryptedMessage } from "@/types/message";
import { decryptMedia } from "@/utils/encryption/media";
import { GLOBAL_E2EE_KEY, GLOBAL_E2EE_IV } from "@/utils/encryption/global-e2ee";
import { useToast } from "@/components/ui/use-toast";
import { arrayBufferToBase64 } from "@/utils/encryption/data-conversion";

export const useMediaDecryption = (mediaUrl: string, encryptionKey?: string) => {
  const [decryptedDataUrl, setDecryptedDataUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [decryptAttempts, setDecryptAttempts] = useState(0);
  const { toast } = useToast();

  const cleanup = useCallback(() => {
    // Cleanup previous URL to prevent memory leaks
    if (decryptedDataUrl) {
      URL.revokeObjectURL(decryptedDataUrl);
    }
  }, [decryptedDataUrl]);

  const retry = useCallback(() => {
    setDecryptAttempts(prev => prev + 1);
    setError(null);
    // This will trigger the useEffect below
  }, []);

  const decrypt = useCallback(async () => {
    if (!mediaUrl) {
      setError("No media URL provided");
      return;
    }
    
    // Clear previous decryption
    cleanup();
    setDecryptedDataUrl(null);
    
    setIsLoading(true);
    setError(null);

    try {
      console.log(`Decryption attempt ${decryptAttempts + 1} for ${mediaUrl}`);
      
      // Use provided encryption key or try to get one from global
      let key = encryptionKey;
      let iv: string | undefined;
      
      // For global messages, try global key/iv if no message-specific keys
      if (!key) {
        console.log("Using global E2EE key for media");
        key = GLOBAL_E2EE_KEY;
        
        // Convert ArrayBuffer to Base64 string for iv
        if (GLOBAL_E2EE_IV instanceof ArrayBuffer) {
          iv = arrayBufferToBase64(GLOBAL_E2EE_IV);
        } else if (GLOBAL_E2EE_IV) {
          iv = btoa(String.fromCharCode.apply(null, new Uint8Array(GLOBAL_E2EE_IV)));
        }
      }

      if (!key) {
        throw new Error("Missing encryption key");
      }

      // Fetch the encrypted media
      const response = await fetch(mediaUrl);
      if (!response.ok) {
        throw new Error(`Failed to fetch media: ${response.status}`);
      }
      
      const encryptedData = await response.arrayBuffer();
      
      if (encryptedData.byteLength === 0) {
        throw new Error("Empty media file");
      }

      console.log(`Successfully fetched ${encryptedData.byteLength} bytes, attempting decryption`);

      // Determine media type from URL or default to octet-stream
      const mediaType = mediaUrl.endsWith('.webp') ? 'image/webp' : 
                       mediaUrl.endsWith('.mp4') ? 'video/mp4' : 
                       'application/octet-stream';

      // Decrypt the media
      const decryptedBlob = await decryptMedia({
        encryptedData,
        encryptionKey: key,
        iv: iv || '',
        mediaType,
      });
      
      const localUrl = URL.createObjectURL(decryptedBlob);
      setDecryptedDataUrl(localUrl);
      console.log("Media successfully decrypted");
    } catch (error) {
      console.error('Media decryption failed:', error);
      setError(error instanceof Error ? error.message : 'Unknown error');
      
      // Show toast only on first attempt to avoid spam
      if (decryptAttempts === 0) {
        toast({
          title: "Media decryption failed",
          description: "There was an issue displaying the media",
          variant: "destructive",
        });
      }
    } finally {
      setIsLoading(false);
    }
  }, [mediaUrl, encryptionKey, decryptAttempts, cleanup, toast]);

  // Run decryption when URL or key changes or retry is called
  useEffect(() => {
    if (mediaUrl) {
      decrypt();
    }
  }, [mediaUrl, encryptionKey, decryptAttempts, decrypt]);

  // Clean up the object URL when component unmounts
  useEffect(() => {
    return cleanup;
  }, [cleanup]);

  return {
    decryptedDataUrl,
    isLoading,
    error,
    retry,
    setError
  };
};
