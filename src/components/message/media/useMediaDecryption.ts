import { useState, useEffect, useCallback } from "react";
import { DecryptedMessage } from "@/types/message";
import { decryptMedia } from "@/utils/encryption/media";
import { GLOBAL_E2EE_KEY, GLOBAL_E2EE_IV } from "@/utils/encryption/global-e2ee";
import { useToast } from "@/components/ui/use-toast";
import { arrayBufferToBase64 } from "@/utils/encryption/data-conversion";

export const useMediaDecryption = (message: DecryptedMessage) => {
  const [decryptedUrl, setDecryptedUrl] = useState<string | null>(null);
  const [isDecrypting, setIsDecrypting] = useState(false);
  const [decryptError, setDecryptError] = useState<string | null>(null);
  const [decryptAttempts, setDecryptAttempts] = useState(0);
  const { toast } = useToast();

  // Memory leak prevention
  useEffect(() => {
    const urls: string[] = [];

    return () => {
      // Clean up all created object URLs on unmount
      urls.forEach(url => URL.revokeObjectURL(url));
    };
  }, []);

  const handleDecryptMedia = useCallback(async (storageUrl: string) => {
    if (!storageUrl) {
      console.error("No storage URL provided for decryption");
      setDecryptError("Ugyldig media-URL");
      return;
    }
    
    // Clear previous decryption errors
    setDecryptError(null);
    
    // Already decrypting
    if (isDecrypting) {
      return;
    }
    
    // Clear previous decryption if any
    if (decryptedUrl) {
      URL.revokeObjectURL(decryptedUrl);
      setDecryptedUrl(null);
    }
    
    setIsDecrypting(true);
    setDecryptAttempts(prev => prev + 1);

    try {
      // Check if we're online
      if (!navigator.onLine) {
        throw new Error("Ingen nettverkstilkobling. Koble til og prøv igjen.");
      }

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

      // Handle media metadata if available
      const mediaMetadata = message.media_metadata ? 
        (typeof message.media_metadata === 'string' ? 
          JSON.parse(message.media_metadata) : message.media_metadata) : null;
      
      if (mediaMetadata?.originalType) {
        mediaType = mediaMetadata.originalType;
      }

      // If a "global message" (no receiver_id and no group_id), try global key/iv
      if (!message.receiver_id && !message.group_id && !encryptionKey && !iv) {
        console.log("Using global E2EE key for public message media");
        encryptionKey = GLOBAL_E2EE_KEY;
        
        // Convert ArrayBuffer to Base64 string for iv
        if (GLOBAL_E2EE_IV instanceof ArrayBuffer) {
          iv = arrayBufferToBase64(GLOBAL_E2EE_IV);
        } else if (GLOBAL_E2EE_IV instanceof Uint8Array) {
          iv = arrayBufferToBase64(GLOBAL_E2EE_IV.buffer);
        } else {
          try {
            iv = btoa(String.fromCharCode.apply(null, new Uint8Array(GLOBAL_E2EE_IV)));
          } catch (e) {
            console.error('Error converting IV:', e);
            iv = undefined;
          }
        }
      }

      if (!encryptionKey || !iv) {
        throw new Error("Mangler krypteringsinformasjon for media");
      }

      // Fetch with timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000);
      
      const response = await fetch(storageUrl, { 
        signal: controller.signal,
        cache: 'no-store' // Always get fresh content
      });
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        throw new Error(`Kunne ikke hente media: ${response.status} ${response.statusText}`);
      }
      
      const encryptedData = await response.arrayBuffer();
      console.log("Media data fetched, size:", encryptedData.byteLength, "bytes");
      
      if (encryptedData.byteLength === 0) {
        throw new Error("Tom mediafil");
      }

      // Decrypt the media with proper error handling
      try {
        const decryptedBlob = await decryptMedia({
          encryptedData,
          encryptionKey,
          iv,
          mediaType,
        });
        
        console.log("Media successfully decrypted, creating object URL");
        const localUrl = URL.createObjectURL(decryptedBlob);
        setDecryptedUrl(localUrl);
      } catch (decryptError) {
        console.error("Decryption error:", decryptError);
        throw new Error("Kunne ikke dekryptere media. Feil nøkkel eller korrupt fil.");
      }
    } catch (error) {
      console.error('Media decryption failed:', error);
      const errorMessage = error instanceof Error ? error.message : 'Ukjent feil';
      setDecryptError(errorMessage);
      
      // Provide more helpful error messages
      let userFriendlyMessage = "Det oppstod en feil ved visning av media. Prøv igjen senere.";
      
      if (errorMessage.includes("network") || errorMessage.includes("fetch") || 
          errorMessage.includes("abort") || !navigator.onLine) {
        userFriendlyMessage = "Nettverksfeil ved lasting av media. Sjekk tilkoblingen din.";
      } else if (errorMessage.includes("decrypt") || errorMessage.includes("crypto")) {
        userFriendlyMessage = "Kunne ikke dekryptere mediafilen. Den kan være skadet eller utilgjengelig.";
      }
      
      // Show toast only on first attempt
      if (decryptAttempts === 0) {
        toast({
          title: "Media kunne ikke vises",
          description: userFriendlyMessage,
          variant: "destructive",
        });
      }
    } finally {
      setIsDecrypting(false);
    }
  }, [message, decryptedUrl, isDecrypting, decryptAttempts, toast]);

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
