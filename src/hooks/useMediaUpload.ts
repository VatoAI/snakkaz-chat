
import { useState } from "react";
import { uploadMedia } from "@/utils/upload/media-upload";
import { useToast } from "@/components/ui/use-toast";

export const useMediaUpload = () => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const { toast } = useToast();

  const upload = async (file: File) => {
    // Validate file before upload
    if (!file) {
      toast({
        title: "Error",
        description: "No file selected",
        variant: "destructive",
      });
      throw new Error("No file provided");
    }
    
    // Check file size (10MB max)
    const MAX_SIZE = 10 * 1024 * 1024; // 10MB
    if (file.size > MAX_SIZE) {
      toast({
        title: "Error",
        description: "File too large (max 10MB)",
        variant: "destructive",
      });
      throw new Error("File too large (max 10MB)");
    }
    
    setIsUploading(true);
    setUploadProgress(0);

    try {
      // Create toast to show progress
      const { id, update, dismiss } = toast({
        title: "Uploading file...",
        description: "Starting upload",
        duration: 5000,
      });

      const result = await uploadMedia(file, (progress) => {
        setUploadProgress(progress);
        // Update toast with progress
        update({
          id,
          title: "Uploading file...",
          description: `${Math.round(progress)}% complete`,
          duration: 5000,
        });
      });

      // Update toast to show success
      update({
        id,
        title: "Upload complete",
        description: "File was uploaded successfully",
        duration: 3000,
      });

      return result;
    } catch (error) {
      console.error("Upload error:", error);
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
