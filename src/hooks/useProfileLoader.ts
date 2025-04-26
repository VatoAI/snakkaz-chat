import { useState, useCallback } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { ensureAvatarsBucket } from '@/utils/avatar-utils';

export interface Profile {
  username: string | null;
  avatar_url: string | null;
}

export const useProfileLoader = () => {
  const [profileCache, setProfileCache] = useState<Record<string, Profile>>({});
  const [loading, setLoading] = useState<Record<string, boolean>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { toast } = useToast();

  const loadProfile = useCallback(async (userId: string) => {
    if (profileCache[userId] && !errors[userId]) return;
    
    setLoading(prev => ({ ...prev, [userId]: true }));
    
    try {
      // Ensure the avatars bucket exists
      await ensureAvatarsBucket();
      
      // Use select() instead of raw HTTP requests when working with Supabase
      const { data, error } = await supabase
        .from('profiles')
        .select('username, avatar_url')
        .eq('id', userId)
        .maybeSingle(); // Use maybeSingle instead of single
      
      if (error) {
        console.error(`Error loading profile for ${userId}:`, error);
        
        // Remove this user from errors if it was previously there
        setErrors(prev => {
          const newErrors = { ...prev };
          delete newErrors[userId];
          return newErrors;
        });
        
        throw error;
      }
      
      setProfileCache(prev => ({
        ...prev,
        [userId]: data || { username: 'Unknown User', avatar_url: null }
      }));
      
      // Clear any previous error for this user
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[userId];
        return newErrors;
      });
      
    } catch (error) {
      console.error('Error loading profile:', error);
      
      // Record the error for this user
      setErrors(prev => ({
        ...prev,
        [userId]: error instanceof Error ? error.message : 'Unknown error'
      }));
      
      // Cache fallback profile data even on error
      setProfileCache(prev => ({
        ...prev,
        [userId]: { username: 'Unknown User', avatar_url: null }
      }));
      
      // Only show the toast for non-network errors or first load
      if (!(error instanceof Error) || !error.message.includes('fetch')) {
        toast({
          title: "Feil ved lasting av profil",
          description: "Kunne ikke laste brukerens profil",
          variant: "destructive",
        });
      }
    } finally {
      setLoading(prev => ({ ...prev, [userId]: false }));
    }
  }, [toast, profileCache, errors]);

  const getProfile = useCallback((userId: string): Profile => {
    if (!profileCache[userId]) {
      loadProfile(userId);
      return { username: null, avatar_url: null };
    }
    return profileCache[userId];
  }, [profileCache, loadProfile]);

  // Method to retry loading a profile that previously had an error
  const retryLoadProfile = useCallback(async (userId: string) => {
    setErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[userId];
      return newErrors;
    });
    return loadProfile(userId);
  }, [loadProfile]);

  return {
    getProfile,
    loadProfile,
    retryLoadProfile,
    profileCache,
    isLoading: loading,
    errors
  };
};
