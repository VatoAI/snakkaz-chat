
import { encryptMedia } from "@/utils/encryption/media";
import { base64ToArrayBuffer } from "@/utils/encryption/data-conversion";
import { showUploadToast, uploadMediaFile } from "../utils/message-db-utils";

export const useMediaHandler = () => {
  const handleMediaUpload = async (mediaFile: File, toast: any, encryptionOverride?: { encryptionKey: string, iv: string }) => {
    let toastId = null;
    let mediaUrl = null, mediaType = null, encryptionKey = null, iv = null, mediaMetadata = null;

    try {
      toastId = showUploadToast(toast, 'uploading');
      
      // Validate the file before proceeding
      if (!mediaFile) {
        throw new Error('Ingen fil valgt');
      }
      
      if (mediaFile.size > 10 * 1024 * 1024) {
        throw new Error('Filen er for stor. Maksimal størrelse er 10 MB.');
      }

      console.log('Starting media encryption for file:', mediaFile.name, 'size:', mediaFile.size);
      
      // Try with retries for network issues
      let retries = 0;
      const maxRetries = 3;
      
      while (retries < maxRetries) {
        try {
          // Encrypt media file
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
          
          console.log('Encrypted file created, size:', encryptedFile.size);
          console.log('Uploading to Supabase storage...');
          
          const mediaData = await uploadMediaFile(encryptedFile);
          
          console.log('Upload successful:', mediaData);
          
          mediaUrl = mediaData.mediaUrl;
          mediaType = encryptedMedia.mediaType;
          encryptionKey = encryptedMedia.encryptionKey;
          iv = encryptedMedia.iv;
          mediaMetadata = encryptedMedia.metadata;
          
          showUploadToast(toast, 'success', "Sender melding med kryptert vedlegg...");
          break; // Exit the retry loop if successful
        } catch (uploadError: any) {
          retries++;
          console.error(`Upload attempt ${retries} failed:`, uploadError);
          
          if (retries >= maxRetries) {
            throw new Error(`Kunne ikke laste opp filen etter ${maxRetries} forsøk: ${uploadError.message}`);
          }
          
          // Wait before retrying
          await new Promise(resolve => setTimeout(resolve, 1000 * retries));
          showUploadToast(toast, 'uploading', `Forsøker igjen (${retries}/${maxRetries})...`);
        }
      }
    } catch (error: any) {
      showUploadToast(toast, 'error', error instanceof Error ? error.message : "Kunne ikke laste opp filen");
      throw error;
    }

    return { mediaUrl, mediaType, encryptionKey, iv, mediaMetadata, toastId };
  };

  return { handleMediaUpload };
};
