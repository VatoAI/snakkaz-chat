
import { useState, useEffect, useCallback } from "react";
import { DecryptedMessage } from "@/types/message";
import { decryptMedia } from "@/utils/encryption/media";
import { GLOBAL_E2EE_KEY, GLOBAL_E2EE_IV } from "@/utils/encryption/global-e2ee";
import { useToast } from "@/hooks/use-toast";
import { arrayBufferToBase64 } from "@/utils/encryption/data-conversion";

export const useMediaDecryption = (message: DecryptedMessage) => {
  const [decryptedUrl, setDecryptedUrl] = useState<string | null>(null);
  const [isDecrypting, setIsDecrypting] = useState(false);
  const [decryptError, setDecryptError] = useState<string | null>(null);
  const [decryptAttempts, setDecryptAttempts] = useState(0);
  const { toast } = useToast();

  const cleanup = useCallback(() => {
    // Cleanup previous URL to prevent memory leaks
    if (decryptedUrl) {
      URL.revokeObjectURL(decryptedUrl);
    }
  }, [decryptedUrl]);

  const handleDecryptMedia = useCallback(async (storageUrl: string) => {
    if (!storageUrl) {
      console.error("No storage URL provided for decryption");
      setDecryptError("Invalid media URL");
      return;
    }
    
    // Clear previous decryption
    cleanup();
    setDecryptedUrl(null);
    
    setIsDecrypting(true);
    setDecryptError(null);
    setDecryptAttempts(prev => prev + 1);

    try {
      console.log(`Decryption attempt ${decryptAttempts + 1} for ${message.media_url}`);
      
      // Determine which keys to use
      let encryptionKey: string | undefined = message.media_encryption_key || message.encryption_key;
      let iv: string | undefined = message.media_iv || message.iv;
      let mediaType: string = message.media_type || 'application/octet-stream';

      // For global messages, try global key/iv if no message-specific keys
      const isGlobalMessage = !message.receiver_id && !message.group_id;
      if (isGlobalMessage && !encryptionKey && !iv) {
        console.log("Using global E2EE key for public message media");
        encryptionKey = GLOBAL_E2EE_KEY;
        
        // Convert ArrayBuffer to Base64 string for iv
        if (GLOBAL_E2EE_IV instanceof ArrayBuffer) {
          iv = arrayBufferToBase64(GLOBAL_E2EE_IV);
        } else if (GLOBAL_E2EE_IV) {
          iv = btoa(String.fromCharCode.apply(null, new Uint8Array(GLOBAL_E2EE_IV)));
        }
      }

      if (!encryptionKey || !iv) {
        throw new Error("Missing encryption keys");
      }

      // Fetch the encrypted media
      const response = await fetch(storageUrl);
      if (!response.ok) {
        throw new Error(`Failed to fetch media: ${response.status}`);
      }
      
      const encryptedData = await response.arrayBuffer();
      
      if (encryptedData.byteLength === 0) {
        throw new Error("Empty media file");
      }

      console.log(`Successfully fetched ${encryptedData.byteLength} bytes, attempting decryption`);

      // Decrypt the media
      const decryptedBlob = await decryptMedia({
        encryptedData,
        encryptionKey,
        iv,
        mediaType,
      });
      
      const localUrl = URL.createObjectURL(decryptedBlob);
      setDecryptedUrl(localUrl);
      console.log("Media successfully decrypted");
    } catch (error) {
      console.error('Media decryption failed:', error);
      setDecryptError(error instanceof Error ? error.message : 'Unknown error');
      
      // Show toast only on first attempt to avoid spam
      if (decryptAttempts === 0) {
        toast({
          title: "Media decryption failed",
          description: "There was an issue displaying the media",
          variant: "destructive",
        });
      }
    } finally {
      setIsDecrypting(false);
    }
  }, [message, decryptAttempts, cleanup, toast]);

  // Clean up the object URL when component unmounts
  useEffect(() => {
    return cleanup;
  }, [cleanup]);

  return {
    decryptedUrl,
    isDecrypting,
    decryptError,
    handleDecryptMedia,
    setDecryptError,
    decryptAttempts
  };
};
