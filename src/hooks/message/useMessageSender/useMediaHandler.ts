import { supabase } from "@/integrations/supabase/client";
import { encryptFile } from "@/utils/encryption";

export const useMediaHandler = () => {
  const handleMediaUpload = async (
    mediaFile: File, 
    toast: any,
    globalEncryptionOverride?: { encryptionKey: string, iv: string },
    onProgress?: (progress: number) => void
  ) => {
    let toastId = null;
    
    try {
      // Display upload toast
      toastId = toast({
        title: 'Sender fil...',
        description: 'Forbereder opplasting',
        duration: 30000,
      }).id;
      
      // Show initial progress
      if (onProgress) onProgress(5);
      
      // Encrypt file if needed
      let encryptedFile = mediaFile;
      let encryptionKey = null;
      let iv = null;
      let mediaMetadata = null;
      
      // Use override keys or generate new ones
      if (globalEncryptionOverride) {
        // Use global encryption key/iv
        const { encryptedData, key, iv: fileIv, metadata } = await encryptFile(
          mediaFile, 
          globalEncryptionOverride.encryptionKey,
          globalEncryptionOverride.iv
        );
        
        encryptedFile = new File([encryptedData], mediaFile.name, { type: mediaFile.type });
        encryptionKey = key;
        iv = fileIv;
        mediaMetadata = metadata;
      } else {
        // Generate new encryption keys
        const { encryptedData, key, iv: fileIv, metadata } = await encryptFile(mediaFile);
        
        encryptedFile = new File([encryptedData], mediaFile.name, { type: mediaFile.type });
        encryptionKey = key;
        iv = fileIv;
        mediaMetadata = metadata;
      }

      // Update toast and progress
      toast({
        id: toastId,
        title: 'Sender fil...',
        description: 'Kryptering fullført, laster opp',
      });
      
      if (onProgress) onProgress(25);
      
      // Generate secure filename
      const fileExt = mediaFile.name.split('.').pop();
      const filePath = `${crypto.randomUUID()}.${fileExt}`;

      // Upload to Supabase storage
      const { error: uploadError, data } = await supabase.storage
        .from('chat-media')
        .upload(filePath, encryptedFile, {
          onUploadProgress: (progress) => {
            const percentage = Math.round((progress.loaded / progress.total) * 75) + 25;
            if (onProgress) onProgress(percentage);
            
            toast({
              id: toastId,
              title: 'Sender fil...',
              description: `${percentage}% lastet opp`,
            });
          },
        });

      if (uploadError) {
        console.error("Upload error:", uploadError);
        throw new Error(`Feil ved opplasting av fil: ${uploadError.message}`);
      }

      // Update toast with success status
      toast({
        id: toastId,
        title: 'Opplasting fullført',
        description: 'Filen blir vedlagt meldingen',
      });
      
      if (onProgress) onProgress(100);

      return {
        mediaUrl: filePath,
        mediaType: mediaFile.type,
        encryptionKey,
        iv,
        mediaMetadata,
        toastId
      };
    } catch (mediaError: any) {
      console.error("Media upload error:", mediaError);
      
      // Update toast with error
      if (toastId) {
        toast({
          id: toastId,
          title: 'Opplastingsfeil',
          description: mediaError.message || 'Kunne ikke laste opp filen',
          variant: 'destructive',
        });
      }
      
      throw new Error(`Mediafeil: ${mediaError.message}`);
    }
  };

  return { handleMediaUpload };
};
