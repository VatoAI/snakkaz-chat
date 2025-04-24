
import { useState } from "react";
import { uploadMedia } from "@/utils/upload/media-upload";
import { useToast } from "@/components/ui/use-toast";

export const useMediaUpload = () => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const { toast } = useToast();

  const upload = async (file: File) => {
    setIsUploading(true);
    setUploadProgress(0);

    try {
      // Remove the id property and use the toast return directly
      const uploadToast = toast({
        title: "Uploading file...",
        description: "Starting upload",
      });

      const result = await uploadMedia(file, (progress) => {
        setUploadProgress(progress);
        // Update the existing toast instead of creating a new one
        uploadToast.update({
          title: "Uploading file...",
          description: `${Math.round(progress)}% complete`,
        });
      });

      // Replace the upload toast with a success toast
      uploadToast.update({
        title: "Upload complete",
        description: "File uploaded successfully",
      });

      return result;
    } catch (error) {
      console.error("Upload failed:", error);
      toast({
        title: "Upload failed",
        description: error instanceof Error ? error.message : "Could not upload file",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  return {
    upload,
    isUploading,
    uploadProgress
  };
};
