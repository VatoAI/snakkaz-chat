
import { useState, useCallback } from 'react';
import { Friend } from '../types';
import { supabase } from '@/integrations/supabase/client';

export const useFriendFetching = (currentUserId: string) => {
  const [friends, setFriends] = useState<Friend[]>([]);
  const [pendingRequests, setPendingRequests] = useState<Friend[]>([]);

  const fetchFriends = useCallback(async () => {
    if (!currentUserId) return;

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
          .single();
          
        if (!profileError && profileData) {
          formattedFriends.push({
            id: friendship.id,
            user_id: friendship.user_id,
            friend_id: friendship.friend_id,
            status: friendship.status,
            created_at: friendship.created_at,
            profile: profileData
          });
        }
      }
      
      setFriends(formattedFriends);
      
      const { data: pendingData, error: pendingError } = await supabase
        .from('friendships')
        .select(`
          id,
          user_id,
          friend_id,
          status,
          created_at
        `)
        .eq('friend_id', currentUserId)
        .eq('status', 'pending');
        
      if (pendingError) throw pendingError;
      
      const formattedRequests: Friend[] = [];
      
      for (const request of pendingData || []) {
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('id, username, full_name, avatar_url')
          .eq('id', request.user_id)
          .single();
          
        if (!profileError && profileData) {
          formattedRequests.push({
            id: request.id,
            user_id: request.user_id,
            friend_id: request.friend_id,
            status: request.status,
            created_at: request.created_at,
            profile: profileData
          });
        }
      }
      
      setPendingRequests(formattedRequests);
    } catch (error) {
      console.error('Error fetching friends or requests:', error);
    }
  }, [currentUserId]);

  return { friends, pendingRequests, fetchFriends };
};

