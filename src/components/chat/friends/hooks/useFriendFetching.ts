
import { useCallback } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { Friend } from '../types';

export const useFriendFetching = (currentUserId: string) => {
  const fetchAcceptedFriends = useCallback(async () => {
    try {
      const { data: friendships, error: friendshipsError } = await supabase
        .from('friendships')
        .select(`
          id,
          user_id,
          friend_id,
          status,
          created_at,
          profiles:friend_id (
            id,
            username,
            full_name,
            avatar_url
          )
        `)
        .eq('status', 'accepted')
        .or(`user_id.eq.${currentUserId},friend_id.eq.${currentUserId}`);

      if (friendshipsError) throw friendshipsError;

      if (!friendships) return [];

      // Process and return friends with their profiles
      const processedFriends: Friend[] = friendships.map(friendship => ({
        ...friendship,
        profile: friendship.profiles
      }));

      return processedFriends;
    } catch (error) {
      console.error('Error fetching accepted friends:', error);
      return [];
    }
  }, [currentUserId]);

  return { fetchAcceptedFriends };
};
