
import { encryptMedia } from "@/utils/encryption/media";
import { base64ToArrayBuffer } from "@/utils/encryption/data-conversion";
import { showUploadToast, uploadMediaFile } from "../utils/message-db-utils";

// Function to check if storage bucket exists
const checkStorageBucket = async (bucketName: string) => {
  try {
    const { data, error } = await fetch(`https://wqpoozpbceucynsojmbk.supabase.co/storage/v1/bucket/${bucketName}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndxcG9venBiY2V1Y3luc29qbWJrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzk1NjgzMDUsImV4cCI6MjA1NTE0NDMwNX0.vu1s86gQKEPXFleOZ1U2uOjW-kj4k4RAiKTbOuXPUD8'
      }
    }).then(res => res.json());
    
    if (error) {
      console.error(`Storage bucket ${bucketName} check failed:`, error);
      return false;
    }
    
    return !!data;
  } catch (e) {
    console.error(`Error checking storage bucket ${bucketName}:`, e);
    return false;
  }
};

export const useMediaHandler = () => {
  const handleMediaUpload = async (mediaFile: File, toast: any, encryptionOverride?: { encryptionKey: string, iv: string }) => {
    let toastId = null;
    let mediaUrl = null, mediaType = null, encryptionKey = null, iv = null, mediaMetadata = null;

    try {
      toastId = showUploadToast(toast, 'uploading');
      
      // Check internet connection
      if (!navigator.onLine) {
        throw new Error('Du er ikke tilkoblet internett. Sjekk din internettforbindelse og prøv igjen.');
      }
      
      // Validate the file before proceeding
      if (!mediaFile) {
        throw new Error('Ingen fil valgt');
      }
      
      if (mediaFile.size > 10 * 1024 * 1024) {
        throw new Error('Filen er for stor. Maksimal størrelse er 10 MB.');
      }

      // Check if required storage bucket exists
      const bucketExists = await checkStorageBucket('chat-media');
      if (!bucketExists) {
        console.error('Storage bucket "chat-media" does not exist');
        throw new Error('Lagringsbøtte for media finnes ikke. Vennligst kontakt en administrator.');
      }

      console.log('Starting media encryption for file:', mediaFile.name, 'size:', mediaFile.size, 'type:', mediaFile.type);
      
      // Try with retries for network issues
      let retries = 0;
      const maxRetries = 3;
      let lastError = null;
      
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
          lastError = uploadError;
          console.error(`Upload attempt ${retries} failed:`, uploadError);
          
          if (retries >= maxRetries) {
            const errorMessage = uploadError?.message || 'Kunne ikke laste opp filen';
            console.error('All upload attempts failed:', errorMessage);
            throw new Error(`Kunne ikke laste opp filen etter ${maxRetries} forsøk: ${errorMessage}`);
          }
          
          // Wait before retrying with exponential backoff
          const backoffTime = 1000 * Math.pow(2, retries - 1);
          console.log(`Waiting ${backoffTime}ms before retry ${retries}/${maxRetries}...`);
          await new Promise(resolve => setTimeout(resolve, backoffTime));
          showUploadToast(toast, 'uploading', `Forsøker igjen (${retries}/${maxRetries})...`);
        }
      }
    } catch (error: any) {
      const errorMessage = error instanceof Error ? error.message : "Kunne ikke laste opp filen";
      console.error('Media upload failed:', errorMessage, error);
      showUploadToast(toast, 'error', errorMessage);
      throw error;
    }

    return { mediaUrl, mediaType, encryptionKey, iv, mediaMetadata, toastId };
  };

  return { handleMediaUpload };
};
