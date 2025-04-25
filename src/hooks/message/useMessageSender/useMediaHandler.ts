
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
    
    try {
      console.log("Starting media encryption for:", mediaFile.name);
      const encryptedMedia = await encryptMedia(mediaFile, encryptionOverride);
      
      // Create encrypted file blob with proper metadata
      const encryptedBlob = new Blob([encryptedMedia.encryptedData], { 
        type: 'application/octet-stream' 
      });
      
      const encryptedFile = new File([encryptedBlob], 
        `${Date.now()}_${mediaFile.name.replace(/[^a-zA-Z0-9._-]/g, '_')}_encrypted.bin`,
        { type: 'application/octet-stream' }
      );

      console.log("Uploading encrypted media...");
      const { path } = await upload(encryptedFile);
      
      console.log("Media upload successful:", path);
      return {
        mediaUrl: path,
        mediaType: encryptedMedia.mediaType,
        encryptionKey: encryptedMedia.encryptionKey,
        iv: encryptedMedia.iv,
        mediaMetadata: encryptedMedia.metadata,
        toastId
      };
    } catch (error) {
      console.error("Media upload failed:", error);
      toast({
        title: "Error",
        description: "Could not upload media file. Please try again.",
        variant: "destructive",
      });
      throw error;
    }
  };

  return { handleMediaUpload, isUploading };
};
