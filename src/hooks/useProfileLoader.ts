
import { useState, useCallback } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

export interface Profile {
  username: string | null;
  avatar_url: string | null;
}

export const useProfileLoader = () => {
  const [profileCache, setProfileCache] = useState<Record<string, Profile>>({});
  const [loading, setLoading] = useState<Record<string, boolean>>({});
  const { toast } = useToast();

  const loadProfile = useCallback(async (userId: string) => {
    if (profileCache[userId] || loading[userId]) return;
    
    setLoading(prev => ({ ...prev, [userId]: true }));
    
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('username, avatar_url')
        .eq('id', userId)
        .maybeSingle();
      
      if (error) throw error;

      // If avatar_url exists, get the public URL
      let publicAvatarUrl = null;
      if (data?.avatar_url) {
        const { data: { publicUrl } } = supabase.storage
          .from('avatars')
          .getPublicUrl(data.avatar_url);
        publicAvatarUrl = publicUrl;
      }
      
      setProfileCache(prev => ({
        ...prev,
        [userId]: {
          username: data?.username || 'Unknown User',
          avatar_url: publicAvatarUrl
        }
      }));
    } catch (error) {
      console.error('Error loading profile:', error);
      setProfileCache(prev => ({
        ...prev,
        [userId]: { username: 'Unknown User', avatar_url: null }
      }));
      
      toast({
        title: "Feil ved lasting av profil",
        description: "Kunne ikke laste brukerens profil",
        variant: "destructive",
      });
    } finally {
      setLoading(prev => ({ ...prev, [userId]: false }));
    }
  }, [toast, profileCache]);

  const getProfile = useCallback((userId: string): Profile => {
    if (!profileCache[userId]) {
      loadProfile(userId);
      return { username: null, avatar_url: null };
    }
    return profileCache[userId];
  }, [profileCache, loadProfile]);

  return {
    getProfile,
    loadProfile,
    profileCache,
    isLoading: loading
  };
};
