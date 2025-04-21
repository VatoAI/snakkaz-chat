
import { useState } from "react";
import { DecryptedMessage } from "@/types/message";
import { decryptMedia } from "@/utils/encryption/media";
import { GLOBAL_E2EE_KEY, GLOBAL_E2EE_IV } from "@/utils/encryption/global-e2ee";

export const useMediaDecryption = (message: DecryptedMessage) => {
  const [decryptedUrl, setDecryptedUrl] = useState<string | null>(null);
  const [isDecrypting, setIsDecrypting] = useState(false);
  const [decryptError, setDecryptError] = useState<string | null>(null);

  const handleDecryptMedia = async (storageUrl: string) => {
    if (decryptedUrl) return;
    setIsDecrypting(true);
    setDecryptError(null);

    // --- PREFER GLOBAL E2EE KEY/IV for PUBLIC room
    let encryptionKey: string | undefined =
      ((message as any).media_encryption_key as string) || message.encryption_key;
    let iv: string | undefined =
      ((message as any).media_iv as string) || message.iv;
    let mediaType: string = message.media_type || 'application/octet-stream';

    // If a "global message" (no receiver_id and no group_id), force global key/iv
    if (!message.receiver_id && !message.group_id) {
      encryptionKey = GLOBAL_E2EE_KEY;
      iv = btoa(GLOBAL_E2EE_IV);
    }

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
