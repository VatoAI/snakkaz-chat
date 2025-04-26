import { useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { useProfileLoader } from '@/hooks/useProfileLoader';

interface UsersProfilesProps {
  setUserProfiles: (updater: React.SetStateAction<Record<string, {username: string | null, avatar_url: string | null}>>) => void;
}

export const UsersProfiles = ({ setUserProfiles }: UsersProfilesProps) => {
  const { getProfile, loadProfile, profileCache, errors } = useProfileLoader();

  // Load all user profiles initially
  useEffect(() => {
    const loadUserProfiles = async () => {
      try {
        console.log('Initializing user profiles...');
        
        // Use more resilient fetch strategy with retries and error handling
        const maxRetries = 3;
        let attempts = 0;
        let success = false;
        
        while (attempts < maxRetries && !success) {
          attempts++;
          try {
            // Get user IDs from profiles table
            const { data, error } = await supabase
              .from('profiles')
              .select('id')
              .limit(100); // Limit to prevent large queries
            
            if (error) {
              console.error(`Profiles fetch attempt ${attempts} failed:`, error);
              // Add exponential backoff between retries
              if (attempts < maxRetries) {
                const delay = Math.pow(2, attempts - 1) * 1000;
                await new Promise(resolve => setTimeout(resolve, delay));
              }
              continue;
            }
            
            success = true;
            
            // Map profiles to cache and trigger loading for each
            const profileMap: Record<string, {username: string | null, avatar_url: string | null}> = {};
            
            if (data && data.length > 0) {
              console.log(`Processing ${data.length} user profiles`);
              data.forEach(profile => {
                const userProfile = getProfile(profile.id);
                profileMap[profile.id] = userProfile;
                loadProfile(profile.id);
              });
              
              setUserProfiles(profileMap);
            } else {
              console.log('No profiles found or empty data returned');
            }
          } catch (retryError) {
            console.error(`Unexpected error in profile fetch attempt ${attempts}:`, retryError);
            // Add delay before retry
            if (attempts < maxRetries) {
              const delay = Math.pow(2, attempts - 1) * 1000;
              await new Promise(resolve => setTimeout(resolve, delay));
            }
          }
        }
        
        if (!success) {
          console.error(`Failed to load profiles after ${maxRetries} attempts`);
        }
      } catch (error) {
        console.error('Error in user profile initialization:', error);
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
  }, [getProfile, loadProfile, setUserProfiles]);
  
  // Watch for profile cache updates and sync to user profiles
  useEffect(() => {
    // When profileCache updates, update userProfiles
    setUserProfiles(prevProfiles => {
      const updatedProfiles = { ...prevProfiles };
      let hasChanges = false;
      
      Object.entries(profileCache).forEach(([userId, profile]) => {
        // Check if profile exists and has changed
        if (!prevProfiles[userId] || 
            prevProfiles[userId].username !== profile.username || 
            prevProfiles[userId].avatar_url !== profile.avatar_url) {
          
          updatedProfiles[userId] = profile;
          hasChanges = true;
        }
      });
      
      // Only trigger update if there are changes
      return hasChanges ? updatedProfiles : prevProfiles;
    });
  }, [profileCache, setUserProfiles]);

  return null;
};
