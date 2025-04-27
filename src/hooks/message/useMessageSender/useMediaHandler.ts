
import { useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { encryptMedia } from "@/utils/encryption/media";

export const useMediaHandler = () => {
  const handleMediaUpload = useCallback(async (
    mediaFile: File, 
    toast: any, 
    globalOverride?: { encryptionKey: string, iv: string }
  ) => {
    if (!mediaFile) {
      throw new Error("No file provided");
    }
    
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
      console.log("IV format:", iv.substring(0, 20) + "...");
      console.log("Key length:", encryptionKey.length);

      // Upload the encrypted file
      const fileExt = mediaFile.name.split('.').pop();
      const filePath = `${crypto.randomUUID()}.${fileExt}`;

      // Log upload attempt
      console.log("Uploading encrypted file to storage:", filePath);
      console.log("Encrypted blob size:", encryptedBlob.size);

      // Check if the bucket exists, create if needed
      try {
        const { data: bucketData } = await supabase.storage.getBucket('chat-media');
        if (!bucketData) {
          console.log("Creating 'chat-media' bucket");
          await supabase.storage.createBucket('chat-media', {
            public: true,
            fileSizeLimit: 52428800, // 50MB
          });
        }
      } catch (bucketError) {
        console.log("Bucket may not exist, attempting to create:", bucketError);
        try {
          await supabase.storage.createBucket('chat-media', {
            public: true,
            fileSizeLimit: 52428800, // 50MB
          });
        } catch (createError) {
          console.error("Failed to create bucket:", createError);
          // Continue anyway, the bucket might exist already
        }
      }

      const { error: uploadError, data } = await supabase.storage
        .from('chat-media')
        .upload(filePath, encryptedBlob, {
          contentType: 'application/octet-stream', // Use generic content type for encrypted data
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) {
        console.error("Upload error:", uploadError);
        throw new Error(`Failed to upload: ${uploadError.message}`);
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
        description: `Failed to upload media: ${error instanceof Error ? error.message : "Unknown error"}`,
        variant: "destructive",
      });
      throw error;
    }
  }, []);

  return { handleMediaUpload };
};
