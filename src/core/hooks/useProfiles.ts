
import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

export const useProfiles = () => {
  const [userProfiles, setUserProfiles] = useState<Record<string, {username: string | null, avatar_url: string | null}>>({});
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  
  const fetchProfiles = useCallback(async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase.from('profiles').select('id, username, avatar_url');
      
      if (error) throw error;
      
      const profileMap: Record<string, {username: string | null, avatar_url: string | null}> = {};
      
      // Process each profile
      data.forEach(profile => {
        // Get the public URL for avatar if it exists
        let publicAvatarUrl = null;
        if (profile.avatar_url) {
          const { data: { publicUrl } } = supabase.storage
            .from('avatars')
            .getPublicUrl(profile.avatar_url);
          publicAvatarUrl = publicUrl;
        }
        
        profileMap[profile.id] = {
          username: profile.username || 'Unknown User',
          avatar_url: publicAvatarUrl
        };
      });
      
      setUserProfiles(profileMap);
    } catch (error) {
      console.error('Error fetching profiles:', error);
      toast({
        title: "Error",
        description: "Failed to load user profiles",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  return { userProfiles, fetchProfiles, isLoading };
};
