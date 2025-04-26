/**
 * Utilities for handling group avatar URLs with proper error fallbacks
 */

import { supabase } from '@/integrations/supabase/client';

/**
 * Get a public group avatar URL with proper error handling
 * @param avatarUrl - The avatar URL from the group
 * @returns A public URL to the avatar image or placeholder
 */
export const getGroupAvatarUrl = (avatarUrl: string | null): string => {
  // If no avatar, return empty string (component will use fallback)
  if (!avatarUrl) {
    return '';
  }

  try {
    // Try to construct the URL from Supabase storage
    const { data } = supabase.storage
      .from('group_avatars')
      .getPublicUrl(avatarUrl);
    
    // Add a cache-busting parameter to avoid caching issues
    return `${data.publicUrl}?t=${Date.now()}`;
  } catch (error) {
    console.error('Error generating group avatar URL:', error);
    return '';
  }
};

/**
 * Verify if a group avatar exists in storage
 * @param avatarUrl - The avatar URL to verify
 * @returns Promise resolving to boolean indicating if avatar exists
 */
export const verifyGroupAvatarExists = async (avatarUrl: string | null): Promise<boolean> => {
  if (!avatarUrl) return false;
  
  try {
    // Check if the bucket exists
    const { data: buckets } = await supabase.storage.listBuckets();
    if (!buckets?.some(bucket => bucket.name === 'group_avatars')) {
      console.warn('Group avatars bucket does not exist');
      return false;
    }
    
    // Check avatar file existence
    const { data, error } = await supabase.storage
      .from('group_avatars')
      .list('', {
        search: avatarUrl
      });
      
    if (error) {
      console.error('Error checking group avatar existence:', error);
      return false;
    }
    
    return (data?.length || 0) > 0;
  } catch (error) {
    console.error('Error verifying group avatar:', error);
    return false;
  }
};