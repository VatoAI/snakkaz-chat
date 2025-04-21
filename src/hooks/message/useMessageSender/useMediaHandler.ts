
import { encryptMedia } from "@/utils/encryption/media";
import { base64ToArrayBuffer } from "@/utils/encryption/data-conversion";
import { showUploadToast, uploadMediaFile } from "../utils/message-db-utils";

export const useMediaHandler = () => {
  const handleMediaUpload = async (mediaFile: File, toast: any, encryptionOverride?: { encryptionKey: string, iv: string }) => {
    let toastId = null;
    let mediaUrl = null, mediaType = null, encryptionKey = null, iv = null, mediaMetadata = null;

    try {
      toastId = showUploadToast(toast, 'uploading');
      const encryptedMedia = await encryptMedia(mediaFile, encryptionOverride);

      const encryptedData = encryptedMedia.encryptedData;
      const encryptedBlob = new Blob(
        [encryptedData instanceof ArrayBuffer 
          ? encryptedData 
          : base64ToArrayBuffer(encryptedData as string)
        ], 
        { type: 'application/octet-stream' }
      );
      const encryptedFile = new File(
        [encryptedBlob], 
        `${Date.now()}_encrypted.bin`, 
        { type: 'application/octet-stream' }
      );
      const mediaData = await uploadMediaFile(encryptedFile);

      mediaUrl = mediaData.mediaUrl;
      mediaType = encryptedMedia.mediaType;
      encryptionKey = encryptedMedia.encryptionKey;
      iv = encryptedMedia.iv;
      mediaMetadata = encryptedMedia.metadata;

      showUploadToast(toast, 'success', "Sender melding med kryptert vedlegg...");
    } catch (error: any) {
      showUploadToast(toast, 'error', error instanceof Error ? error.message : "Kunne ikke laste opp filen");
      throw error;
    }

    return { mediaUrl, mediaType, encryptionKey, iv, mediaMetadata, toastId };
  };

  return { handleMediaUpload };
};
