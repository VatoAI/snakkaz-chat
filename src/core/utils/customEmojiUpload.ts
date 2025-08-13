// Enhanced custom emoji file upload utility
import { supabase } from '@/integrations/supabase/client';

export interface EmojiUploadOptions {
  file: File;
  shortcode: string;
  userId: string;
  category?: string;
  isPublic?: boolean;
}

export interface EmojiUploadResult {
  success: boolean;
  url?: string;
  error?: string;
  fileSize?: number;
  dimensions?: { width: number; height: number };
}

/**
 * Upload custom emoji file to Supabase storage
 */
export const uploadCustomEmoji = async (options: EmojiUploadOptions): Promise<EmojiUploadResult> => {
  const { file, shortcode, userId, category = 'custom', isPublic = false } = options;

  try {
    // Validate file type
    if (!file.type.startsWith('image/')) {
      return {
        success: false,
        error: 'File must be an image'
      };
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      return {
        success: false,
        error: 'File size must be less than 5MB'
      };
    }

    // Validate shortcode
    if (!/^[a-z0-9_]+$/.test(shortcode) || shortcode.length < 2 || shortcode.length > 50) {
      return {
        success: false,
        error: 'Shortcode must be 2-50 characters and contain only lowercase letters, numbers, and underscores'
      };
    }

    // Get image dimensions
    const dimensions = await getImageDimensions(file);

    // Generate unique filename
    const fileExt = file.name.split('.').pop();
    const fileName = `${userId}/${shortcode}_${Date.now()}.${fileExt}`;

    // Upload to Supabase storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('custom-emojis')
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (uploadError) {
      console.error('Upload error:', uploadError);
      return {
        success: false,
        error: `Upload failed: ${uploadError.message}`
      };
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('custom-emojis')
      .getPublicUrl(uploadData.path);

    return {
      success: true,
      url: publicUrl,
      fileSize: file.size,
      dimensions
    };

  } catch (error) {
    console.error('Error uploading custom emoji:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown upload error'
    };
  }
};

/**
 * Get image dimensions from file
 */
const getImageDimensions = (file: File): Promise<{ width: number; height: number }> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve({
        width: img.naturalWidth,
        height: img.naturalHeight
      });
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Failed to load image'));
    };

    img.src = url;
  });
};

/**
 * Delete custom emoji file from storage
 */
export const deleteCustomEmojiFile = async (url: string): Promise<boolean> => {
  try {
    // Extract file path from URL
    const urlParts = url.split('/');
    const bucketIndex = urlParts.findIndex(part => part === 'custom-emojis');
    
    if (bucketIndex === -1 || bucketIndex >= urlParts.length - 1) {
      console.error('Invalid emoji URL format');
      return false;
    }

    const filePath = urlParts.slice(bucketIndex + 1).join('/');

    const { error } = await supabase.storage
      .from('custom-emojis')
      .remove([filePath]);

    if (error) {
      console.error('Error deleting emoji file:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error deleting custom emoji file:', error);
    return false;
  }
};

/**
 * Validate emoji shortcode availability
 */
export const validateShortcode = async (shortcode: string): Promise<{ available: boolean; error?: string }> => {
  try {
    // Check format
    if (!/^[a-z0-9_]+$/.test(shortcode) || shortcode.length < 2 || shortcode.length > 50) {
      return {
        available: false,
        error: 'Shortcode must be 2-50 characters and contain only lowercase letters, numbers, and underscores'
      };
    }

    // Check if already exists
    const { data, error } = await supabase
      .from('custom_emojis')
      .select('id')
      .eq('shortcode', shortcode)
      .single();

    if (error && error.code !== 'PGRST116') {
      // PGRST116 means no rows returned (shortcode available)
      return {
        available: false,
        error: 'Error checking shortcode availability'
      };
    }

    if (data) {
      return {
        available: false,
        error: 'Shortcode already exists'
      };
    }

    return { available: true };

  } catch (error) {
    return {
      available: false,
      error: 'Error validating shortcode'
    };
  }
};
