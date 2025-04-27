import { useState, useEffect, useCallback, useRef } from "react";
import { DecryptedMessage } from "@/types/message";
import { decryptMedia } from "@/utils/encryption/media";
import { GLOBAL_E2EE_KEY, GLOBAL_E2EE_IV } from "@/utils/encryption/global-e2ee";
import { useToast } from "@/hooks/use-toast";
import { arrayBufferToBase64 } from "@/utils/encryption/data-conversion";

// Cache to avoid decrypting the same media multiple times
const decryptionCache = new Map<string, string>();

export const useMediaDecryption = (message: DecryptedMessage) => {
  const [decryptedUrl, setDecryptedUrl] = useState<string | null>(null);
  const [isDecrypting, setIsDecrypting] = useState(false);
  const [decryptError, setDecryptError] = useState<string | null>(null);
  const [decryptAttempts, setDecryptAttempts] = useState(0);
  const { toast } = useToast();
  const abortControllerRef = useRef<AbortController | null>(null);
  const timeoutIdRef = useRef<number | null>(null);
  const createdObjectUrls = useRef<string[]>([]);

  // Initialize from cache if available
  useEffect(() => {
    if (message.media_url) {
      const cachedUrl = decryptionCache.get(message.media_url);
      if (cachedUrl) {
        console.log("Using cached decrypted media URL for", message.media_url);
        setDecryptedUrl(cachedUrl);
      }
    }
  }, [message.media_url]);

  // Clean up active requests when component unmounts or message changes
  useEffect(() => {
    return () => {
      // Abort any in-flight network requests
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
        abortControllerRef.current = null;
      }

      // Clear any timeouts
      if (timeoutIdRef.current !== null) {
        clearTimeout(timeoutIdRef.current);
        timeoutIdRef.current = null;
      }
      
      // Clean up created object URLs
      createdObjectUrls.current.forEach(url => {
        try {
          URL.revokeObjectURL(url);
        } catch (e) {
          console.error("Error revoking URL:", e);
        }
      });
      createdObjectUrls.current = [];
    };
  }, [message.id]);

  const handleDecryptMedia = useCallback(async (storageUrl: string) => {
    if (!storageUrl) {
      console.error("No storage URL provided for decryption");
      setDecryptError("Ugyldig media-URL");
      return;
    }
    
    // Return cached URL if already decrypted
    if (decryptedUrl) {
      return;
    }
    
    // Check if we have a cached version
    const cachedUrl = decryptionCache.get(message.media_url);
    if (cachedUrl) {
      setDecryptedUrl(cachedUrl);
      return;
    }
    
    // Clear previous decryption errors
    setDecryptError(null);
    
    // Already decrypting
    if (isDecrypting) {
      return;
    }
    
    setIsDecrypting(true);
    setDecryptAttempts(prev => prev + 1);

    // Cancel any previous requests
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    if (timeoutIdRef.current !== null) {
      clearTimeout(timeoutIdRef.current);
    }

    // Create new abort controller for this request
    abortControllerRef.current = new AbortController();

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
        messageType: message.receiver_id ? "private" : message.group_id ? "group" : "public"
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
        
        // Convert ArrayBuffer to Base64 string for iv using a safer approach
        if (typeof GLOBAL_E2EE_IV === 'object') {
          if (GLOBAL_E2EE_IV instanceof ArrayBuffer) {
            iv = arrayBufferToBase64(GLOBAL_E2EE_IV);
          } else if (GLOBAL_E2EE_IV instanceof Uint8Array) {
            // Convert Uint8Array to ArrayBuffer safely
            const arrayBuffer = GLOBAL_E2EE_IV.buffer.slice(
              GLOBAL_E2EE_IV.byteOffset, 
              GLOBAL_E2EE_IV.byteOffset + GLOBAL_E2EE_IV.byteLength
            );
            iv = arrayBufferToBase64(arrayBuffer);
          } else {
            // Handle other binary types
            try {
              const uint8Array = new Uint8Array(GLOBAL_E2EE_IV as any);
              iv = arrayBufferToBase64(uint8Array.buffer);
            } catch (e) {
              console.error('Error converting IV:', e);
              iv = undefined;
            }
          }
        } else {
          iv = GLOBAL_E2EE_IV as string;
        }
      }

      if (!encryptionKey || !iv) {
        throw new Error("Mangler krypteringsinformasjon for media");
      }

      // Set up request timeout
      timeoutIdRef.current = window.setTimeout(() => {
        if (abortControllerRef.current) {
          abortControllerRef.current.abort();
          setDecryptError("Tidsavbrudd ved nedlasting av media");
          setIsDecrypting(false);
        }
      }, 30000);
      
      // Add cache-busting query param to avoid caching issues
      const urlWithNoCaching = `${storageUrl}?t=${Date.now()}`;
      
      // Fetch with abort controller
      const response = await fetch(urlWithNoCaching, { 
        signal: abortControllerRef.current.signal,
        cache: 'no-store', // Always get fresh content
        credentials: 'omit' // Don't send cookies
      });
      
      // Clear timeout since request completed
      if (timeoutIdRef.current !== null) {
        clearTimeout(timeoutIdRef.current);
        timeoutIdRef.current = null;
      }
      
      if (!response.ok) {
        throw new Error(`Kunne ikke hente media: ${response.status} ${response.statusText}`);
      }
      
      const encryptedData = await response.arrayBuffer();
      console.log("Media data fetched, size:", encryptedData.byteLength, "bytes");
      
      if (encryptedData.byteLength === 0) {
        throw new Error("Tom mediafil");
      }

      // Try decryption with progressively more fallbacks
      try {
        // Attempt 1: Try with provided keys
        const decryptedBlob = await decryptMedia({
          encryptedData,
          encryptionKey,
          iv,
          mediaType,
        });
        
        console.log("Media successfully decrypted, creating object URL");
        const localUrl = URL.createObjectURL(decryptedBlob);
        
        // Store in our list for cleanup
        createdObjectUrls.current.push(localUrl);
        
        // Cache the URL for future use
        if (message.media_url) {
          decryptionCache.set(message.media_url, localUrl);
        }
        
        setDecryptedUrl(localUrl);
      } catch (decryptError) {
        console.error("Primary decryption failed:", decryptError);
        
        // If it's not a content message (for which we are sure about the keys)
        // try with global keys as fallback
        if ((message.receiver_id || message.group_id) && (GLOBAL_E2EE_KEY && GLOBAL_E2EE_IV)) {
          try {
            console.log("Attempting fallback decryption with global keys");
            
            // Convert global IV to proper format more safely
            let fallbackIv: string;
            if (typeof GLOBAL_E2EE_IV === 'object') {
              if (GLOBAL_E2EE_IV instanceof ArrayBuffer) {
                fallbackIv = arrayBufferToBase64(GLOBAL_E2EE_IV);
              } else if (GLOBAL_E2EE_IV instanceof Uint8Array) {
                // Convert Uint8Array to ArrayBuffer safely
                const arrayBuffer = GLOBAL_E2EE_IV.buffer.slice(
                  GLOBAL_E2EE_IV.byteOffset, 
                  GLOBAL_E2EE_IV.byteOffset + GLOBAL_E2EE_IV.byteLength
                );
                fallbackIv = arrayBufferToBase64(arrayBuffer);
              } else {
                // Fallback
                const uint8Array = new Uint8Array(GLOBAL_E2EE_IV as any);
                fallbackIv = arrayBufferToBase64(uint8Array.buffer);
              }
            } else {
              fallbackIv = GLOBAL_E2EE_IV as string;
            }
            
            const fallbackBlob = await decryptMedia({
              encryptedData,
              encryptionKey: GLOBAL_E2EE_KEY,
              iv: fallbackIv,
              mediaType,
            });
            
            console.log("Fallback decryption succeeded");
            const fallbackUrl = URL.createObjectURL(fallbackBlob);
            
            // Store for cleanup
            createdObjectUrls.current.push(fallbackUrl);
            
            // Cache the fallback URL
            if (message.media_url) {
              decryptionCache.set(message.media_url, fallbackUrl);
            }
            
            setDecryptedUrl(fallbackUrl);
          } catch (fallbackError) {
            console.error("Fallback decryption also failed:", fallbackError);
            throw new Error("Kunne ikke dekryptere media med noen nøkler. Filen kan være skadet.");
          }
        } else {
          throw new Error("Kunne ikke dekryptere media. Feil nøkkel eller korrupt fil.");
        }
      }
    } catch (error) {
      console.error('Media decryption failed:', error);
      
      // Only set error if request wasn't aborted (aborted requests are intentional)
      if (!abortControllerRef.current?.signal.aborted) {
        const errorMessage = error instanceof Error ? error.message : 'Ukjent feil';
        setDecryptError(errorMessage);
        
        // Provide more helpful error messages
        let userFriendlyMessage = "Det oppstod en feil ved visning av media. Prøv igjen senere.";
        
        if (errorMessage.includes("network") || errorMessage.includes("fetch") || 
            errorMessage.includes("abort") || !navigator.onLine) {
          userFriendlyMessage = "Nettverksfeil ved lasting av media. Sjekk tilkoblingen din.";
        } else if (errorMessage.includes("decrypt") || errorMessage.includes("crypto")) {
          userFriendlyMessage = "Kunne ikke dekryptere mediafilen. Den kan være skadet eller utilgjengelig.";
        } else if (errorMessage.includes("timeout") || errorMessage.includes("timed out")) {
          userFriendlyMessage = "Tidsavbrudd ved nedlasting av media. Nettverksforbindelsen kan være ustabil.";
        }
        
        // Show toast only on first attempt to avoid spamming
        if (decryptAttempts === 0) {
          toast({
            title: "Media kunne ikke vises",
            description: userFriendlyMessage,
            variant: "destructive",
          });
        }
      }
    } finally {
      setIsDecrypting(false);
      
      // Clear abort controller reference
      abortControllerRef.current = null;
    }
  }, [message, decryptedUrl, isDecrypting, decryptAttempts, toast]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      // We don't revoke the URL here if it's cached, as other components might be using it
      if (decryptedUrl && !decryptionCache.has(message.media_url)) {
        try {
          URL.revokeObjectURL(decryptedUrl);
        } catch (e) {
          console.error("Error revoking URL on unmount:", e);
        }
      }
    };
  }, [decryptedUrl, message.media_url]);

  return {
    decryptedUrl,
    isDecrypting,
    decryptError,
    handleDecryptMedia,
    setDecryptError,
    decryptAttempts
  };
};
