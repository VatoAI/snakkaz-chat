import { useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";

/**
 * Hook for å synkronisere profildata på tvers av hele applikasjonen
 * 
 * Denne hooken lytter på profiloppdateringer og sørger for at alle komponenter
 * blir oppdatert når en brukers profil endres.
 */
export const useProfileSync = () => {
  useEffect(() => {
    // Sett opp lytting på profildata-endringer fra Supabase
    const profilesChannel = supabase
      .channel('global-profile-sync')
      .on('postgres_changes', 
        { 
          event: 'UPDATE', 
          schema: 'public', 
          table: 'profiles'
        }, 
        async (payload) => {
          if (payload.new) {
            const newProfile = payload.new as any;
            
            // Utløs hendelse for å informere alle komponenter om oppdatert brukernavn
            if (newProfile.username) {
              document.dispatchEvent(new CustomEvent('username-updated', {
                detail: { userId: newProfile.id, username: newProfile.username }
              }));
            }
            
            // Utløs hendelse for å informere alle komponenter om oppdatert avatar
            if (newProfile.avatar_url) {
              document.dispatchEvent(new CustomEvent('avatar-updated', {
                detail: { userId: newProfile.id, avatarUrl: newProfile.avatar_url }
              }));
            }
            
            // Utløs en generell profiloppdaterings-hendelse for andre komponenter
            document.dispatchEvent(new CustomEvent('profile-updated', {
              detail: { userId: newProfile.id, profile: newProfile }
            }));
          }
        }
      )
      .subscribe();
    
    return () => {
      supabase.removeChannel(profilesChannel);
    };
  }, []);
};