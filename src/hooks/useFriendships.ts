
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext'; // Changed from @/hooks/useAuth
import { useToast } from '@/components/ui/use-toast';
import { Friend } from '@/components/chat/friends/types';

export const useFriendships = () => {
  const [friends, setFriends] = useState<Friend[]>([]);
  const [friendships, setFriendships] = useState<any[]>([]);
  const [friendsMap, setFriendsMap] = useState<Record<string, Friend>>({});
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth(); // Using the user from AuthContext
  const { toast } = useToast();

  const fetchFriendships = useCallback(async () => {
    if (!user?.id) return;
    
    try {
      setIsLoading(true);
      
      // Fetch accepted friendships where the current user is either user_id or friend_id
      const { data, error } = await supabase
        .from('friendships')
        .select(`
          id, 
          status, 
          created_at,
          user_id, 
          friend_id,
          profiles:friend_id (id, username, avatar_url, full_name)
        `)
        .or(`user_id.eq.${user.id},friend_id.eq.${user.id}`)
        .eq('status', 'accepted');

      if (error) throw error;

      if (data) {
        const processedFriends: Friend[] = data.map(friendship => {
          // Determine if the current user is user_id or friend_id
          const isFriend = friendship.user_id === user.id;
          
          // Get the other user's ID
          const friendUserId = isFriend ? friendship.friend_id : friendship.user_id;
          
          // Get profile data safely - handle case where profiles might be null
          const profile = friendship.profiles || {
            id: friendUserId,
            username: 'Unknown User',
            avatar_url: null,
            full_name: null
          };
          
          return {
            id: friendship.id,
            user_id: friendUserId,
            friend_id: user.id,
            status: friendship.status,
            created_at: friendship.created_at,
            profile: {
              id: profile.id,
              username: profile.username,
              avatar_url: profile.avatar_url,
              full_name: profile.full_name
            }
          };
        });

        setFriends(processedFriends);
        setFriendships(data);
        
        // Create a map for easy access by user ID
        const friendsMapObj: Record<string, Friend> = {};
        processedFriends.forEach(friend => {
          friendsMapObj[friend.user_id] = friend;
        });
        setFriendsMap(friendsMapObj);
      }
    } catch (error) {
      console.error('Error fetching friendships:', error);
      toast({
        title: "Error",
        description: "Failed to load friendships",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [user?.id, toast]);

  useEffect(() => {
    if (user?.id) {
      fetchFriendships();
    }
  }, [user?.id, fetchFriendships]);

  return { friends, friendships, friendsMap, isLoading, fetchFriendships };
};
