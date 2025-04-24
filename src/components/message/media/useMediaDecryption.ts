
import { useState, useEffect } from "react";
import { DecryptedMessage } from "@/types/message";
import { decryptMedia } from "@/utils/encryption/media";
import { GLOBAL_E2EE_KEY, GLOBAL_E2EE_IV } from "@/utils/encryption/global-e2ee";
import { useToast } from "@/components/ui/use-toast";

export const useMediaDecryption = (message: DecryptedMessage) => {
  const [decryptedUrl, setDecryptedUrl] = useState<string | null>(null);
  const [isDecrypting, setIsDecrypting] = useState(false);
  const [decryptError, setDecryptError] = useState<string | null>(null);
  const [decryptAttempts, setDecryptAttempts] = useState(0);
  const { toast } = useToast();

  const handleDecryptMedia = async (storageUrl: string) => {
    if (!storageUrl) {
      console.error("No storage URL provided for decryption");
      setDecryptError("Invalid media URL");
      return;
    }
    
    // Clear previous decryption if any
    if (decryptedUrl) {
      URL.revokeObjectURL(decryptedUrl);
      setDecryptedUrl(null);
    }
    
    setIsDecrypting(true);
    setDecryptError(null);
    setDecryptAttempts(prev => prev + 1);

    try {
      // Log decryption attempt with details
      console.log("Decryption attempt", decryptAttempts + 1, "for", message.media_url);
      console.log("Media info:", {
        hasMediaEncryptionKey: !!message.media_encryption_key,
        hasMediaIv: !!message.media_iv,
        mediaType: message.media_type,
        isGlobalRoom: !message.receiver_id && !message.group_id,
      });

      // Determine encryption keys to use - prioritize media-specific keys,
      // then message keys, then global keys for public messages
      let encryptionKey: string | undefined = message.media_encryption_key || message.encryption_key;
      let iv: string | undefined = message.media_iv || message.iv;
      let mediaType: string = message.media_type || 'application/octet-stream';

      // If a "global message" (no receiver_id and no group_id), try global key/iv
      if (!message.receiver_id && !message.group_id && !encryptionKey && !iv) {
        console.log("Using global E2EE key for public message media");
        encryptionKey = GLOBAL_E2EE_KEY;
        iv = btoa(GLOBAL_E2EE_IV);
      }

      if (!encryptionKey || !iv) {
        throw new Error("Missing encryption data for media");
      }

      const response = await fetch(storageUrl);
      if (!response.ok) {
        throw new Error(`Failed to fetch media: ${response.status} ${response.statusText}`);
      }
      
      const encryptedData = await response.arrayBuffer();
      console.log("Media data fetched, size:", encryptedData.byteLength, "bytes");
      
      if (encryptedData.byteLength === 0) {
        throw new Error("Empty media file");
      }

      // Decrypt the media
      const decryptedBlob = await decryptMedia({
        encryptedData,
        encryptionKey,
        iv,
        mediaType,
      });
      
      console.log("Media successfully decrypted, creating object URL");
      const localUrl = URL.createObjectURL(decryptedBlob);
      setDecryptedUrl(localUrl);
    } catch (error) {
      console.error('Media decryption failed:', error);
      setDecryptError(error instanceof Error ? error.message : 'Unknown error');
      
      // Show toast only on first attempt
      if (decryptAttempts === 0) {
        toast({
          title: "Media decryption failed",
          description: "There was an issue displaying the media. Try again later.",
          variant: "destructive",
        });
      }
    } finally {
      setIsDecrypting(false);
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (decryptedUrl) {
        URL.revokeObjectURL(decryptedUrl);
      }
    };
  }, [decryptedUrl]);

  return {
    decryptedUrl,
    isDecrypting,
    decryptError,
    handleDecryptMedia,
    setDecryptError,
    decryptAttempts
  };
};
