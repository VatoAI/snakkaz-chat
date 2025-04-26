import { useState, useEffect, useCallback, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useGlobalPresence } from '@/contexts/PresenceContext';

/**
 * Optimized hook for managing friends in the application
 * - Uses batch profile fetching instead of individual queries
 * - Implements caching for profile data
 * - Updates friend status in real-time
 * - Provides optimistic UI updates
 */
export const useOptimizedFriends = (
  userId: string | null | undefined,
  selectedFriendId: string | null,
  onChatClosed: () => void,
  setSelectedFriend: (friend: any) => void
) => {
  const [friends, setFriends] = useState<any[]>([]);
  const [friendsList, setFriendsList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastRefreshed, setLastRefreshed] = useState<Date | null>(null);
  const { userStatuses } = useGlobalPresence();

  // Cache for previously fetched profiles to avoid redundant fetches
  const [profileCache, setProfileCache] = useState<Record<string, any>>({});

  // Function to fetch friend requests
  const fetchFriendRequests = useCallback(async () => {
    if (!userId) return [];
    
    try {
      const { data, error } = await supabase
        .from('friend_requests')
        .select('*')
        .eq('receiver_id', userId)
        .eq('status', 'pending');

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching friend requests:', error);
      return [];
    }
  }, [userId]);
  
  // Batch fetch profiles for all friends at once
  const fetchProfiles = useCallback(async (userIds: string[]) => {
    // Filter out IDs we already have cached
    const idsToFetch = userIds.filter(id => !profileCache[id]);
    
    if (idsToFetch.length === 0) return profileCache;

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, username, avatar_url, full_name, role')
        .in('id', idsToFetch);

      if (error) throw error;
      
      // Update cache with new profiles
      const newCache = { ...profileCache };
      data?.forEach(profile => {
        newCache[profile.id] = profile;
      });
      
      setProfileCache(newCache);
      return newCache;
    } catch (error) {
      console.error('Error fetching profiles:', error);
      return profileCache;
    }
  }, [profileCache]);

  // Optimized fetch for friends list
  const fetchFriends = useCallback(async () => {
    if (!userId) return;
    
    setLoading(true);
    
    try {
      // Fetch accepted friend relationships
      const { data: friendData, error: friendError } = await supabase
        .from('friends')
        .select(`
          id,
          user_id,
          friend_id,
          created_at,
          updated_at
        `)
        .or(`user_id.eq.${userId},friend_id.eq.${userId}`);
        
      if (friendError) throw friendError;
      
      if (!friendData || friendData.length === 0) {
        setFriends([]);
        setFriendsList([]);
        setLoading(false);
        setLastRefreshed(new Date());
        return;
      }
      
      // Extract friend IDs to fetch their profiles in batch
      const friendIds = friendData.map(friend => 
        friend.user_id === userId ? friend.friend_id : friend.user_id
      );
      
      // Fetch all profiles in a single query
      const updatedProfileCache = await fetchProfiles(friendIds);
      
      // Now map the profiles to the friends
      const friendsWithProfiles = friendData.map(friend => {
        const friendId = friend.user_id === userId ? friend.friend_id : friend.user_id;
        const profile = updatedProfileCache[friendId] || null;
        
        return {
          ...friend,
          profile,
          // Add online status from global presence context
          status: userStatuses[friendId] || 'offline'
        };
      });

      setFriends(friendsWithProfiles);
      setFriendsList(friendsWithProfiles);
      setLastRefreshed(new Date());
    } catch (error) {
      console.error('Error fetching friends:', error);
    } finally {
      setLoading(false);
    }
  }, [userId, fetchProfiles, userStatuses]);

  // Handle sending friend request
  const handleSendFriendRequest = useCallback(async (friendId: string) => {
    if (!userId || !friendId) return;
    
    try {
      const { error } = await supabase
        .from('friend_requests')
        .insert({
          sender_id: userId,
          receiver_id: friendId,
          status: 'pending'
        });
        
      if (error) throw error;
      
      // No need to refresh the whole list just for this
    } catch (error) {
      console.error('Error sending friend request:', error);
    }
  }, [userId]);

  // Handle accepting friend request
  const handleAcceptFriendRequest = useCallback(async (requestId: string) => {
    if (!userId) return;
    
    try {
      // First get the request details
      const { data: requestData, error: requestError } = await supabase
        .from('friend_requests')
        .select('*')
        .eq('id', requestId)
        .single();
        
      if (requestError) throw requestError;
      
      // Update the request status
      const { error: updateError } = await supabase
        .from('friend_requests')
        .update({ status: 'accepted' })
        .eq('id', requestId);
        
      if (updateError) throw updateError;
      
      // Add to friends table
      const { error: friendError } = await supabase
        .from('friends')
        .insert({
          user_id: userId,
          friend_id: requestData.sender_id
        });
        
      if (friendError) throw friendError;
      
      // Optimistically update the UI instead of fetching again
      const friendProfile = profileCache[requestData.sender_id];
      if (friendProfile) {
        setFriends(prev => [
          ...prev, 
          {
            id: `temp-${Date.now()}`, // Temporary ID that will be replaced on next fetch
            user_id: userId,
            friend_id: requestData.sender_id,
            profile: friendProfile,
            status: userStatuses[requestData.sender_id] || 'offline',
            created_at: new Date().toISOString()
          }
        ]);
      }
      
    } catch (error) {
      console.error('Error accepting friend request:', error);
    }
  }, [userId, profileCache, userStatuses]);

  // Handle starting chat with a friend
  const handleStartChat = useCallback((friendId: string) => {
    // Find the friend in our list
    const friend = friends.find(f => 
      (f.user_id === userId && f.friend_id === friendId) || 
      (f.friend_id === userId && f.user_id === friendId)
    );
    
    if (friend) {
      setSelectedFriend(friend);
    }
  }, [friends, userId, setSelectedFriend]);

  // Handle unfriending a user
  const handleUnfriend = useCallback(async (friendId: string) => {
    if (!userId || !friendId) return;
    
    try {
      // Delete from friends table in both directions
      const { error } = await supabase
        .from('friends')
        .delete()
        .or(`and(user_id.eq.${userId},friend_id.eq.${friendId}),and(user_id.eq.${friendId},friend_id.eq.${userId})`);
        
      if (error) throw error;
      
      // Optimistically update UI
      setFriends(prev => prev.filter(friend => 
        !(friend.user_id === userId && friend.friend_id === friendId) && 
        !(friend.user_id === friendId && friend.friend_id === userId)
      ));
      
      // If we are chatting with this friend, close the chat
      if (selectedFriendId === friendId) {
        onChatClosed();
      }
    } catch (error) {
      console.error('Error unfriending user:', error);
    }
  }, [userId, selectedFriendId, onChatClosed]);
  
  // Initial fetch of friends
  useEffect(() => {
    if (userId) {
      fetchFriends();
      
      // Subscribe to friend changes
      const friendsChannel = supabase
        .channel('friends-changes')
        .on('postgres_changes', 
          { 
            event: '*', 
            schema: 'public', 
            table: 'friends',
            filter: `or(user_id=eq.${userId},friend_id=eq.${userId})`
          }, 
          () => {
            // Just refresh the whole list when there's a change
            fetchFriends();
          }
        )
        .subscribe();
        
      return () => {
        supabase.removeChannel(friendsChannel);
      };
    }
  }, [userId, fetchFriends]);
  
  // Refresh function that can be called manually
  const refreshFriends = useCallback(() => {
    fetchFriends();
  }, [fetchFriends]);

  return {
    friends,
    friendsList,
    loading,
    lastRefreshed,
    refreshFriends,
    handleSendFriendRequest,
    handleAcceptFriendRequest,
    handleStartChat,
    handleUnfriend,
  };
};
