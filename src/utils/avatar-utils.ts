/**
 * Utilities for handling avatar URLs with proper error fallbacks
 */

import { supabase } from '@/integrations/supabase/client';

/**
 * Get a public avatar URL with proper error handling
 * @param avatarUrl - The avatar URL from the profile
 * @returns A public URL to the avatar image or placeholder
 */
export const getAvatarUrl = (avatarUrl: string | null): string => {
  // If no avatar, return empty string (component will use fallback)
  if (!avatarUrl) {
    return '';
  }

  try {
    // Try to construct the URL from Supabase storage
    const { data } = supabase.storage
      .from('avatars')
      .getPublicUrl(avatarUrl);
    
    // Add a cache-busting parameter to avoid caching issues
    return `${data.publicUrl}?t=${Date.now()}`;
  } catch (error) {
    console.error('Error generating avatar URL:', error);
    return '';
  }
};

/**
 * Verify if an avatar exists in storage
 * @param avatarUrl - The avatar URL to verify
 * @returns Promise resolving to boolean indicating if avatar exists
 */
export const verifyAvatarExists = async (avatarUrl: string | null): Promise<boolean> => {
  if (!avatarUrl) return false;
  
  try {
    // Check if the bucket exists
    const { data: buckets } = await supabase.storage.listBuckets();
    if (!buckets?.some(bucket => bucket.name === 'avatars')) {
      console.warn('Avatars bucket does not exist');
      return false;
    }
    
    // Check avatar file existence
    const { data, error } = await supabase.storage
      .from('avatars')
      .list('', {
        search: avatarUrl
      });
      
    if (error) {
      console.error('Error checking avatar existence:', error);
      return false;
    }
    
    return (data?.length || 0) > 0;
  } catch (error) {
    console.error('Error verifying avatar:', error);
    return false;
  }
};

/**
 * Ensure the avatars bucket exists
 */
export const ensureAvatarsBucket = async (): Promise<boolean> => {
  try {
    // Check if bucket exists
    const { data: buckets, error: listError } = await supabase.storage.listBuckets();
    
    if (listError) {
      console.error('Error listing buckets:', listError);
      return false;
    }
    
    const bucketExists = buckets.some(bucket => bucket.name === 'avatars');
    
    if (bucketExists) {
      return true;
    }
    
    // Create bucket if it doesn't exist
    const { error: createError } = await supabase.storage.createBucket('avatars', {
      public: true,
      fileSizeLimit: 5242880, // 5MB
      allowedMimeTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
    });
    
    if (createError) {
      console.error('Error creating avatars bucket:', createError);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error ensuring avatars bucket:', error);
    return false;
  }
};