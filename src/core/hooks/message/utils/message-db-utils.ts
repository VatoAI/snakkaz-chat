
import { supabase } from "@/integrations/supabase/client";

/**
 * Ensures that all required columns exist in the messages table
 * for storing media encryption details
 */
export const ensureMessageColumnsExist = async () => {
  try {
    const { error } = await supabase.rpc('add_media_encryption_columns');
    if (error) console.error('Error ensuring media columns exist:', error);
  } catch (err) {
    console.error('Error calling add_media_encryption_columns:', err);
  }
};

/**
 * Handles showing upload toasts with different states
 */
export const showUploadToast = (toast: any, state: 'uploading' | 'success' | 'error', message?: string) => {
  if (state === 'uploading') {
    return toast({
      title: "Laster opp vedlegg...",
      description: "Vennligst vent mens filen krypteres og lastes opp",
    });
  } else if (state === 'success') {
    return toast({
      title: "Opplasting fullført",
      description: message || "Filen ble lastet opp",
    });
  } else {
    return toast({
      title: "Feil ved opplasting",
      description: message || "Kunne ikke laste opp filen",
      variant: "destructive",
    });
  }
};

/**
 * Uploads a media file to Supabase storage
 */
export const uploadMediaFile = async (file: File) => {
  console.log("Starting file upload to Supabase storage");
  
  try {
    // Create a unique file path
    const filePath = `${Date.now()}_${Math.random().toString(36).substring(2)}.bin`;
    
    // Upload the file
    console.log("Uploading file to path:", filePath);
    const { error: uploadError, data } = await supabase.storage
      .from('chat-media')
      .upload(filePath, file, {
        contentType: 'application/octet-stream',
        cacheControl: '3600'
      });

    if (uploadError) {
      console.error("Error uploading file:", uploadError);
      throw uploadError;
    }
    
    console.log("File uploaded successfully:", data?.path);
    
    return {
      mediaUrl: filePath,
      mediaPath: data?.path
    };
  } catch (error) {
    console.error("Error in uploadMediaFile:", error);
    throw error;
  }
};
