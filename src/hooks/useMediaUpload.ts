
// Update imports to include useAuth
import { useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth"; 
import { useToast } from "@/hooks/use-toast";

// Interface for upload state
export interface UploadState {
  isUploading: boolean;
  progress: number;
  error: Error | null;
  url: string | null;
}

// Hook for media uploads
export const useMediaUpload = () => {
  const [uploadState, setUploadState] = useState<UploadState>({
    isUploading: false,
    progress: 0,
    error: null,
    url: null
  });
  const { toast } = useToast();
  const { session } = useAuth();

  // Function to upload a file
  const uploadFile = useCallback(async (
    file: File,
    bucket: string = "media",
    options?: {
      folder?: string;
      isPublic?: boolean;
    }
  ) => {
    if (!file) {
      toast({
        title: "Feil",
        description: "Ingen fil valgt",
        variant: "destructive"
      });
      return null;
    }

    if (!session?.user?.id) {
      toast({
        title: "Feil",
        description: "Du må være logget inn for å laste opp filer",
        variant: "destructive"
      });
      return null;
    }

    // Generate a unique filename
    const timestamp = new Date().getTime();
    const fileExt = file.name.split(".").pop();
    const userId = session.user.id;
    const filePath = options?.folder 
      ? `${options.folder}/${userId}-${timestamp}.${fileExt}`
      : `${userId}-${timestamp}.${fileExt}`;
    
    setUploadState(prev => ({
      ...prev,
      isUploading: true,
      progress: 0,
      error: null
    }));

    try {
      // Upload the file to Supabase Storage
      const { data, error } = await supabase.storage
        .from(bucket)
        .upload(filePath, file, {
          upsert: false,
          contentType: file.type
        });

      if (error) throw error;

      // Get the URL for the uploaded file
      const { data: urlData } = supabase.storage
        .from(bucket)
        .getPublicUrl(data.path);

      setUploadState(prev => ({
        ...prev,
        isUploading: false,
        progress: 100,
        url: urlData.publicUrl
      }));

      return urlData.publicUrl;
    } catch (error) {
      console.error("Upload error:", error);
      setUploadState(prev => ({
        ...prev,
        isUploading: false,
        error: error as Error
      }));

      toast({
        title: "Opplastingsfeil",
        description: (error as Error).message || "Kunne ikke laste opp filen",
        variant: "destructive"
      });

      return null;
    }
  }, [session, toast]);

  // Function to cancel an upload
  const cancelUpload = useCallback(() => {
    // Currently, we can only reset the state as Supabase doesn't provide a way to cancel uploads
    setUploadState({
      isUploading: false,
      progress: 0,
      error: null,
      url: null
    });
  }, []);

  return {
    uploadFile,
    cancelUpload,
    uploadState
  };
};
