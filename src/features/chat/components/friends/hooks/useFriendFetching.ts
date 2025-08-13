
import { useCallback, useState } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { Friend } from '../types';

export const useFriendFetching = (currentUserId: string) => {
  const [friends, setFriends] = useState<Friend[]>([]);
  const [pendingRequests, setPendingRequests] = useState<Friend[]>([]);

  const fetchFriends = useCallback(async () => {
    try {
      // Fetch accepted friendships
      await fetchAcceptedFriends();
      // Fetch pending requests
      await fetchPendingRequests();
    } catch (error) {
      console.error('Error fetching friends:', error);
    }
  }, [currentUserId]);

  const fetchAcceptedFriends = useCallback(async () => {
    try {
      // First query: Find all friendship IDs where the user is involved
      const { data: friendships, error: friendshipsError } = await supabase
        .from('friendships')
        .select(`
          id,
          user_id,
          friend_id,
          status,
          created_at
        `)
        .eq('status', 'accepted')
        .or(`user_id.eq.${currentUserId},friend_id.eq.${currentUserId}`);

      if (friendshipsError) throw friendshipsError;
      if (!friendships || friendships.length === 0) {
        setFriends([]);
        return [];
      }

      // Process each friendship to get the profile of the other user
      const processedFriends: Friend[] = [];
      
      for (const friendship of friendships) {
        // Determine which ID is the other user
        const friendUserId = friendship.user_id === currentUserId 
          ? friendship.friend_id 
          : friendship.user_id;
          
        // Second query: Get that user's profile
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('id, username, full_name, avatar_url')
          .eq('id', friendUserId)
          .single();
          
        if (!profileError && profileData) {
          processedFriends.push({
            ...friendship,
            profile: profileData
          });
        } else {
          console.error(`Error fetching profile for user ${friendUserId}:`, profileError);
        }
      }

      setFriends(processedFriends);
      return processedFriends;
    } catch (error) {
      console.error('Error fetching accepted friends:', error);
      return [];
    }
  }, [currentUserId]);

  const fetchPendingRequests = useCallback(async () => {
    try {
      // Find pending friendship requests where the current user is the receiver
      const { data: pendingFriendships, error: pendingError } = await supabase
        .from('friendships')
        .select(`
          id,
          user_id,
          friend_id,
          status,
          created_at
        `)
        .eq('status', 'pending')
        .eq('friend_id', currentUserId);

      if (pendingError) throw pendingError;
      if (!pendingFriendships || pendingFriendships.length === 0) {
        setPendingRequests([]);
        return [];
      }

      // Process each pending request to get the profile of the requester
      const processedRequests: Friend[] = [];
      
      for (const request of pendingFriendships) {
        // Get the profile of the user who sent the request
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('id, username, full_name, avatar_url')
          .eq('id', request.user_id)
          .single();
          
        if (!profileError && profileData) {
          processedRequests.push({
            ...request,
            profile: profileData
          });
        } else {
          console.error(`Error fetching profile for user ${request.user_id}:`, profileError);
        }
      }

      setPendingRequests(processedRequests);
      return processedRequests;
    } catch (error) {
      console.error('Error fetching pending friend requests:', error);
      return [];
    }
  }, [currentUserId]);

  return { 
    friends, 
    pendingRequests, 
    fetchFriends, 
    fetchAcceptedFriends,
    fetchPendingRequests
  };
};
