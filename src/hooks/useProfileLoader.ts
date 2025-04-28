import { useState, useCallback, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "./use-toast";
import { useAppEncryption } from '@/contexts/AppEncryptionContext';

export interface Profile {
  username: string | null;
  display_name: string | null;
  avatar_url: string | null;
  email: string | null;
  bio: string | null;
  website: string | null;
  social_links: Record<string, string> | null;
}

export const useProfileLoader = (userId: string | undefined = undefined) => {
  const [profileCache, setProfileCache] = useState<Record<string, Profile>>({});
  const [loading, setLoading] = useState<Record<string, boolean>>({});
  const [profileData, setProfileData] = useState<Profile | null>(null);
  const [isProfileLoading, setIsProfileLoading] = useState<boolean>(false);
  const { toast } = useToast();
  const { isEncryptionEnabled, encryptData, decryptData } = useAppEncryption();

  const loadProfile = useCallback(async (profileUserId: string) => {
    if (loading[profileUserId]) return;

    setLoading(prev => ({ ...prev, [profileUserId]: true }));
    if (profileUserId === userId) {
      setIsProfileLoading(true);
    }

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('username, display_name, avatar_url, email, bio, website, social_links')
        .eq('id', profileUserId)
        .maybeSingle();

      if (error) throw error;

      // Hvis avatar_url eksisterer, hent den offentlige URL
      let publicAvatarUrl = null;
      if (data?.avatar_url) {
        const { data: { publicUrl } } = supabase.storage
          .from('avatars')
          .getPublicUrl(data.avatar_url);
        publicAvatarUrl = publicUrl;
      }

      const profileData: Profile = {
        username: data?.username || 'Unknown User',
        display_name: data?.display_name || data?.username || 'Unknown User',
        avatar_url: publicAvatarUrl,
        email: data?.email || null,
        bio: data?.bio || null,
        website: data?.website || null,
        social_links: data?.social_links || null
      };

      // Dekrypter data hvis kryptering er aktivert og vi har kryptert innhold
      if (isEncryptionEnabled && data?.bio && typeof data.bio === 'string' && data.bio.startsWith('ENC:')) {
        try {
          const decryptedBio = await decryptData<string>(data.bio.substring(4));
          if (decryptedBio) {
            profileData.bio = decryptedBio;
          }
        } catch (err) {
          console.error('Error decrypting profile bio:', err);
        }
      }

      setProfileCache(prev => ({
        ...prev,
        [profileUserId]: profileData
      }));

      if (profileUserId === userId) {
        setProfileData(profileData);
      }
    } catch (error) {
      console.error('Error loading profile:', error);
      const defaultProfile: Profile = {
        username: 'Unknown User',
        display_name: 'Unknown User',
        avatar_url: null,
        email: null,
        bio: null,
        website: null,
        social_links: null
      };

      setProfileCache(prev => ({
        ...prev,
        [profileUserId]: defaultProfile
      }));

      if (profileUserId === userId) {
        setProfileData(defaultProfile);
      }

      toast({
        title: "Feil ved lasting av profil",
        description: "Kunne ikke laste brukerens profil",
        variant: "destructive",
      });
    } finally {
      setLoading(prev => ({ ...prev, [profileUserId]: false }));
      if (profileUserId === userId) {
        setIsProfileLoading(false);
      }
    }
  }, [toast, userId, isEncryptionEnabled, decryptData]);

  const refreshProfile = useCallback(async () => {
    if (!userId) return false;
    await loadProfile(userId);
    return true;
  }, [userId, loadProfile]);

  const getProfile = useCallback((profileUserId: string): Profile => {
    if (!profileCache[profileUserId]) {
      loadProfile(profileUserId);
      return {
        username: null,
        display_name: null,
        avatar_url: null,
        email: null,
        bio: null,
        website: null,
        social_links: null
      };
    }
    return profileCache[profileUserId];
  }, [profileCache, loadProfile]);

  // Last profilen automatisk hvis userId er angitt
  useEffect(() => {
    if (userId) {
      loadProfile(userId);
    }
  }, [userId, loadProfile]);

  return {
    getProfile,
    loadProfile,
    profileCache,
    isLoading: loading,
    profileData,
    isProfileLoading,
    refreshProfile
  };
};
