
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
    
    try {
      const response = await fetch(storageUrl);
      if (!response.ok) throw new Error('Failed to fetch media');
      
      const encryptedData = await response.arrayBuffer();
      
      if (!message.encryption_key || !message.iv) {
        throw new Error('Missing encryption metadata');
      }
      
      const decryptedBlob = await decryptMedia({
        encryptedData: encryptedData,
        encryptionKey: message.encryption_key,
        iv: message.iv,
        mediaType: message.media_type || 'application/octet-stream'
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
