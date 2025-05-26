
import { supabase } from './client';
import { useToast } from '@/components/ui/use-toast';

// Utility function to check if the storage bucket exists
export const checkStorageBucket = async (bucketName: string) => {
  try {
    const { data, error } = await supabase.storage
      .getBucket(bucketName);
    
    if (error) {
      console.error(`Storage bucket ${bucketName} check failed:`, error);
      return false;
    }
    
    return !!data;
  } catch (e) {
    console.error(`Error checking storage bucket ${bucketName}:`, e);
    return false;
  }
};

// Enhanced upload function with retries and better error handling
export const uploadMediaFile = async (file: File, path?: string) => {
  const MAX_RETRIES = 3;
  let attempt = 0;
  let lastError: any = null;
  
  // Validate input
  if (!file) {
    throw new Error('No file provided for upload');
  }
  
  if (file.size > 20 * 1024 * 1024) {
    throw new Error('File too large. Maximum size is 20MB');
  }

  // Check if bucket exists
  const bucketExists = await checkStorageBucket('chat-media');
  if (!bucketExists) {
    console.log('Storage bucket "chat-media" does not exist, attempting to create it');
    
    try {
      const { error } = await supabase.storage.createBucket('chat-media', {
        public: true,
        fileSizeLimit: 20971520, // 20MB
        allowedMimeTypes: ['image/*', 'video/*', 'audio/*', 'application/pdf', 'application/msword', 'text/plain']
      });
      
      if (error) {
        throw error;
      }
      
      console.log('Created "chat-media" bucket successfully');
    } catch (e) {
      console.error('Error creating bucket:', e);
      throw new Error('Storage bucket "chat-media" does not exist and could not be created');
    }
  }
  
  // Try with retries
  while (attempt < MAX_RETRIES) {
    try {
      const fileName = path ? path : `${Date.now()}_${file.name.replace(/[^a-zA-Z0-9._-]/g, '_')}`;
      const filePath = fileName;
      
      console.log(`Upload attempt ${attempt + 1}/${MAX_RETRIES}: ${filePath}`);
      
      const { data, error } = await supabase.storage
        .from('chat-media')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false,
          contentType: file.type
        });

      if (error) {
        throw error;
      }

      const { data: { publicUrl } } = supabase.storage
        .from('chat-media')
        .getPublicUrl(filePath);

      return {
        mediaUrl: filePath,
        publicUrl,
        fileName
      };
    } catch (error) {
      lastError = error;
      console.error(`Upload attempt ${attempt + 1} failed:`, error);
      
      // Backoff retry
      const backoffTime = Math.pow(2, attempt) * 1000; // Exponential backoff
      await new Promise(resolve => setTimeout(resolve, backoffTime));
      
      attempt++;
    }
  }
  
  // All attempts failed
  console.error(`All ${MAX_RETRIES} upload attempts failed`);
  throw lastError || new Error('Failed to upload media after multiple attempts');
};

// Get media URL with error handling
export const getMediaUrl = (path: string) => {
  try {
    if (!path) {
      console.error('Invalid media path provided');
      return '';
    }
    
    const { data } = supabase.storage
      .from('chat-media')
      .getPublicUrl(path);
      
    return data.publicUrl;
  } catch (error) {
    console.error('Error getting media URL:', error);
    return '';
  }
};

// Check if media exists
export const checkMediaExists = async (path: string): Promise<boolean> => {
  try {
    if (!path) return false;
    
    // Try to get file metadata - this will fail if it doesn't exist
    const { data, error } = await supabase.storage
      .from('chat-media')
      .list(path.split('/').slice(0, -1).join('/') || '', {
        search: path.split('/').pop() || ''
      });
      
    if (error) {
      console.error('Error checking media existence:', error);
      return false;
    }
    
    return (data?.length || 0) > 0;
  } catch (error) {
    console.error('Error checking media existence:', error);
    return false;
  }
};

// Delete media with verification
export const deleteMediaFile = async (path: string): Promise<boolean> => {
  try {
    const { error } = await supabase.storage
      .from('chat-media')
      .remove([path]);
      
    if (error) {
      console.error('Error deleting media:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error deleting media:', error);
    return false;
  }
};
