
import { supabase } from './client';

export const uploadMediaFile = async (file: File, path?: string) => {
  try {
    const fileName = `${Date.now()}_${file.name}`;
    const filePath = path ? `${path}/${fileName}` : fileName;
    
    const { data, error } = await supabase.storage
      .from('chat-media')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (error) {
      console.error('Error uploading file:', error);
      throw error;
    }

    const { data: { publicUrl } } = supabase.storage
      .from('chat-media')
      .getPublicUrl(filePath);

    return {
      mediaUrl: filePath,
      publicUrl
    };
  } catch (error) {
    console.error('Upload error:', error);
    throw error;
  }
};

export const getMediaUrl = (path: string) => {
  return supabase.storage
    .from('chat-media')
    .getPublicUrl(path).data.publicUrl;
};
