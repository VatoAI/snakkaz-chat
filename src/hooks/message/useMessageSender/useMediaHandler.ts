
import { encryptMedia } from "@/utils/encryption/media";
import { useMediaUpload } from "@/hooks/useMediaUpload";

export const useMediaHandler = () => {
  const { upload, isUploading } = useMediaUpload();

  const handleMediaUpload = async (
    mediaFile: File,
    toast: any,
    encryptionOverride?: { encryptionKey: string, iv: string }
  ) => {
    let toastId = null;
    let mediaUrl = null, mediaType = null, encryptionKey = null, iv = null, mediaMetadata = null;

    try {
      // First encrypt the media
      console.log("Encrypting media file:", mediaFile.name);
      const encryptedMedia = await encryptMedia(mediaFile, encryptionOverride);
      
      // Create encrypted file blob
      const encryptedBlob = new Blob([encryptedMedia.encryptedData], { 
        type: 'application/octet-stream' 
      });
      const encryptedFile = new File([encryptedBlob], 
        `${Date.now()}_encrypted.bin`, 
        { type: 'application/octet-stream' }
      );

      // Upload the encrypted file
      const { path } = await upload(encryptedFile);
      
      mediaUrl = path;
      mediaType = encryptedMedia.mediaType;
      encryptionKey = encryptedMedia.encryptionKey;
      iv = encryptedMedia.iv;
      mediaMetadata = encryptedMedia.metadata;

      return { mediaUrl, mediaType, encryptionKey, iv, mediaMetadata, toastId };
    } catch (error) {
      console.error("Media upload failed:", error);
      throw error;
    }
  };

  return { handleMediaUpload, isUploading };
};
