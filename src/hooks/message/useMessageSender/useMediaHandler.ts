
import { useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { encryptMedia } from "@/utils/encryption/media";
import { useToast } from "@/hooks/use-toast";

export const useMediaHandler = () => {
  const handleMediaUpload = useCallback(async (mediaFile: File, toast: any, globalOverride?: { encryptionKey: string, iv: string }) => {
    const toastId = Date.now().toString();
    toast({
      id: toastId,
      title: "Uploading media",
      description: "Encrypting and uploading your file...",
    });

    try {
      console.log("Starting media encryption process for file:", mediaFile.name);

      // Encrypt the media file
      const { encryptedData: encryptedBlob, encryptionKey, iv, mediaType, metadata } = 
        await encryptMedia(mediaFile);

      console.log("Media encryption successful, preparing to upload");
      console.log("Media type:", mediaType);
      console.log("Metadata:", metadata);

      // Upload the encrypted file
      const fileExt = mediaFile.name.split('.').pop();
      const filePath = `${crypto.randomUUID()}.${fileExt}`;

      // Log upload attempt
      console.log("Uploading encrypted file to storage:", filePath);
      console.log("Encrypted blob size:", encryptedBlob.size);

      const { error: uploadError, data } = await supabase.storage
        .from('chat-media')
        .upload(filePath, encryptedBlob);

      if (uploadError) {
        console.error("Upload error:", uploadError);
        throw uploadError;
      }

      console.log("Upload successful:", data?.path || filePath);

      // Update toast with success message
      toast({
        id: toastId,
        title: "Upload successful",
        description: "Your encrypted media is ready to send",
      });

      return {
        mediaUrl: filePath,
        mediaType: mediaFile.type,
        encryptionKey: globalOverride?.encryptionKey || encryptionKey,
        iv: globalOverride?.iv || iv,
        mediaMetadata: metadata,
        toastId
      };
    } catch (error) {
      console.error("Error uploading media:", error);
      toast({
        id: toastId,
        title: "Upload failed",
        description: "Failed to upload media file. Please try again.",
        variant: "destructive",
      });
      throw error;
    }
  }, []);

  return { handleMediaUpload };
};
