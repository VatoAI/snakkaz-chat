
import { useState, useCallback } from 'react';
import { Friend } from '../types';
import { supabase } from '@/integrations/supabase/client';

export const useAcceptedFriendsFetching = (currentUserId: string) => {
  const [friends, setFriends] = useState<Friend[]>([]);

  const fetchAcceptedFriends = useCallback(async () => {
    if (!currentUserId) return [];

    try {
      const { data: friendships, error: friendshipsError } = await supabase
        .from('friendships')
        .select(`
          id,
          user_id,
          friend_id,
          status,
          created_at
        `)
        .or(`user_id.eq.${currentUserId},friend_id.eq.${currentUserId}`)
        .eq('status', 'accepted');
        
      if (friendshipsError) throw friendshipsError;
      
      const formattedFriends: Friend[] = [];
      
      for (const friendship of friendships || []) {
        const profileId = friendship.user_id === currentUserId ? friendship.friend_id : friendship.user_id;
        
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('id, username, full_name, avatar_url')
          .eq('id', profileId)
          .maybeSingle(); // Use maybeSingle instead of single
          
        if (!profileError && profileData) {
          formattedFriends.push({
            id: friendship.id,
            user_id: friendship.user_id,
            friend_id: friendship.friend_id,
            status: friendship.status,
            created_at: friendship.created_at,
            profile: profileData
          });
        } else {
          // Include basic profile info even if profile doesn't exist
          formattedFriends.push({
            id: friendship.id,
            user_id: friendship.user_id,
            friend_id: friendship.friend_id,
            status: friendship.status,
            created_at: friendship.created_at,
            profile: {
              id: profileId,
              username: 'Unknown User',
              full_name: null,
              avatar_url: null
            }
          });
        }
      }
      
      setFriends(formattedFriends);
      return formattedFriends;
    } catch (error) {
      console.error('Error fetching accepted friends:', error);
      return [];
    }
  }, [currentUserId]);

  return { friends, fetchAcceptedFriends };
};
