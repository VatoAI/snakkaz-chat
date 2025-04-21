
import { useState } from "react";
import { DecryptedMessage } from "@/types/message";
import { decryptMedia } from "@/utils/encryption/media";

export const useMediaDecryption = (message: DecryptedMessage) => {
  const [decryptedUrl, setDecryptedUrl] = useState<string | null>(null);
  const [isDecrypting, setIsDecrypting] = useState(false);
  const [decryptError, setDecryptError] = useState<string | null>(null);

  const handleDecryptMedia = async (storageUrl: string) => {
    if (decryptedUrl) return;
    
    setIsDecrypting(true);
    setDecryptError(null);

    // Prefer media_encryption_key and media_iv if present, else fall back
    const encryptionKey: string | undefined =
      ((message as any).media_encryption_key as string) || message.encryption_key;
    const iv: string | undefined =
      ((message as any).media_iv as string) || message.iv;
    const mediaType: string = message.media_type || 'application/octet-stream';

    if (!encryptionKey || !iv) {
      setDecryptError("Mangler krypteringsdata for mediet");
      setIsDecrypting(false);
      return;
    }
    
    try {
      const response = await fetch(storageUrl);
      if (!response.ok) throw new Error('Failed to fetch media');
      
      const encryptedData = await response.arrayBuffer();
      
      const decryptedBlob = await decryptMedia({
        encryptedData: encryptedData,
        encryptionKey: encryptionKey,
        iv: iv,
        mediaType: mediaType,
      });
      
      const localUrl = URL.createObjectURL(decryptedBlob);
      setDecryptedUrl(localUrl);
    } catch (error) {
      console.error('Failed to decrypt media:', error);
      setDecryptError('Failed to decrypt media');
    } finally {
      setIsDecrypting(false);
    }
  };

  return {
    decryptedUrl,
    isDecrypting,
    decryptError,
    handleDecryptMedia,
    setDecryptError
  };
};
