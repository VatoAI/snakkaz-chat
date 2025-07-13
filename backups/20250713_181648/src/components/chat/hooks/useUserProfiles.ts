
import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { useProfileLoader } from '@/hooks/useProfileLoader';

export const useUserProfiles = () => {
  const [userProfiles, setUserProfiles] = useState<Record<string, {username: string | null, avatar_url: string | null}>>({});
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
    
    // Listen for username updates
    const handleUsernameUpdate = (event: Event) => {
      const customEvent = event as CustomEvent;
      if (customEvent.detail) {
        const { userId, username } = customEvent.detail;
        setUserProfiles(prev => ({
          ...prev,
          [userId]: {
            ...prev[userId],
            username
          }
        }));
      }
    };
    
    // Listen for avatar updates
    const handleAvatarUpdate = (event: Event) => {
      const customEvent = event as CustomEvent;
      if (customEvent.detail) {
        const { userId, avatarUrl } = customEvent.detail;
        setUserProfiles(prev => ({
          ...prev,
          [userId]: {
            ...prev[userId],
            avatar_url: avatarUrl
          }
        }));
      }
    };
    
    document.addEventListener('username-updated', handleUsernameUpdate);
    document.addEventListener('avatar-updated', handleAvatarUpdate);
    
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
                username: newProfile.username || 'Unknown User',
                avatar_url: newProfile.avatar_url
              }
            }));
          }
        }
      )
      .subscribe();
    
    return () => {
      document.removeEventListener('username-updated', handleUsernameUpdate);
      document.removeEventListener('avatar-updated', handleAvatarUpdate);
      supabase.removeChannel(profilesChannel);
    };
  }, [getProfile, loadProfile]);

  return { userProfiles, setUserProfiles };
};
