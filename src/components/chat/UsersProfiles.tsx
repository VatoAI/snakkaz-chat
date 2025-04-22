
import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useProfileLoader } from '@/hooks/useProfileLoader';

interface UsersProfilesProps {
  setUserProfiles: (updater: React.SetStateAction<Record<string, {username: string | null, avatar_url: string | null}>>) => void;
}

export const UsersProfiles = ({ setUserProfiles }: UsersProfilesProps) => {
  const { getProfile, loadProfile } = useProfileLoader();

  useEffect(() => {
    const loadUserProfiles = async () => {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('id');
          
        if (error) throw error;
        
        const profileMap: Record<string, {username: string | null, avatar_url: string | null}> = {};
        data?.forEach(profile => {
          const userProfile = getProfile(profile.id);
          profileMap[profile.id] = userProfile;
          loadProfile(profile.id);
        });
        
        setUserProfiles(profileMap);
      } catch (error) {
        console.error('Error loading user profiles:', error);
      }
    };
    
    loadUserProfiles();
    
    // Set up subscription for profile changes
    const profilesChannel = supabase
      .channel('profiles-changes')
      .on('postgres_changes', 
        { 
          event: 'UPDATE', 
          schema: 'public', 
          table: 'profiles'
        }, 
        async (payload) => {
          if (payload.new) {
            const newProfile = payload.new as any;
            setUserProfiles(prev => ({
              ...prev,
              [newProfile.id]: {
                username: newProfile.username,
                avatar_url: newProfile.avatar_url
              }
            }));
          }
        }
      )
      .subscribe();
    
    return () => {
      supabase.removeChannel(profilesChannel);
    };
  }, [getProfile, loadProfile, setUserProfiles]);

  return null;
};
