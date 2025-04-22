
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
      
      setProfileCache(prev => ({
        ...prev,
        [userId]: data || { username: null, avatar_url: null }
      }));
    } catch (error) {
      console.error('Error loading profile:', error);
      toast({
        title: "Feil ved lasting av profil",
        description: "Kunne ikke laste brukerens profil",
        variant: "destructive",
      });
    } finally {
      setLoading(prev => ({ ...prev, [userId]: false }));
    }
  }, [toast]);

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
