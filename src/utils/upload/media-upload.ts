
import { supabase } from "@/integrations/supabase/client";

export const uploadMedia = async (
  file: File,
  onProgress?: (progress: number) => void
): Promise<{ path: string; publicUrl: string }> => {
  try {
    // Validate file
    if (!file) throw new Error("No file provided");
    if (file.size > 10 * 1024 * 1024) throw new Error("File too large (max 10MB)");

    // Create unique file path
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}_${Math.random().toString(36).substring(2)}.${fileExt}`;
    const filePath = `${fileName}`;

    console.log("Starting upload:", { fileName, size: file.size, type: file.type });

    // Upload with progress tracking
    const { data, error } = await supabase.storage
      .from('chat-media')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (error) {
      console.error("Upload error:", error);
      throw error;
    }

    console.log("Upload successful:", data);

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('chat-media')
      .getPublicUrl(filePath);

    return {
      path: filePath,
      publicUrl
    };
  } catch (error) {
    console.error("Upload failed:", error);
    throw error;
  }
};
