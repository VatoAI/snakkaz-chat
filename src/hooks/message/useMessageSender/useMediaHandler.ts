
import { useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { encryptMedia } from "@/utils/encryption/media";

export const useMediaHandler = () => {
  const handleMediaUpload = useCallback(async (mediaFile: File, toast: any) => {
    const toastId = Date.now().toString();
    toast({
      id: toastId,
      title: "Uploading media",
      description: "Encrypting and uploading your file...",
    });

    try {
      // Encrypt the media file
      const { encryptedData: encryptedBlob, encryptionKey, iv, mediaType, metadata } = 
        await encryptMedia(mediaFile);

      // Upload the encrypted file
      const fileExt = mediaFile.name.split('.').pop();
      const filePath = `${crypto.randomUUID()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('chat-media')
        .upload(filePath, encryptedBlob);

      if (uploadError) throw uploadError;

      return {
        mediaUrl: filePath,
        mediaType: mediaFile.type,
        encryptionKey,
        iv,
        mediaMetadata: metadata,
        toastId
      };
    } catch (error) {
      console.error("Error uploading media:", error);
      toast({
        id: toastId,
        title: "Upload failed",
        description: "Failed to upload media file",
        variant: "destructive",
      });
      throw error;
    }
  }, []);

  return { handleMediaUpload };
};
