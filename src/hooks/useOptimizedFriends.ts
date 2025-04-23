
import { useState, useCallback, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { Friend } from '@/components/chat/friends/types';
import { useToast } from "@/components/ui/use-toast";

export const useOptimizedFriends = (userId: string | null) => {
  const [friends, setFriends] = useState<Friend[]>([]);
  const [friendsList, setFriendsList] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const fetchFriendsWithProfiles = useCallback(async () => {
    if (!userId) return;
    setLoading(true);

    try {
      // Fetch friendships and profiles in a single query using joins
      const { data: friendships, error: friendshipsError } = await supabase
        .from('friendships')
        .select(`
          *,
          profiles:friend_id(id, username, full_name, avatar_url)
        `)
        .eq('status', 'accepted')
        .or(`user_id.eq.${userId},friend_id.eq.${userId}`);

      if (friendshipsError) throw friendshipsError;

      const processedFriends = friendships.map(friendship => {
        const isFriendReceiver = friendship.user_id === userId;
        const profile = isFriendReceiver ? friendship.profiles : 
          friendship.profiles; // profile of the other user

        return {
          id: friendship.id,
          user_id: friendship.user_id,
          friend_id: friendship.friend_id,
          status: friendship.status,
          created_at: friendship.created_at,
          profile: profile || {
            id: isFriendReceiver ? friendship.friend_id : friendship.user_id,
            username: 'Unknown User',
            full_name: null,
            avatar_url: null
          }
        };
      });

      setFriends(processedFriends);
      setFriendsList(processedFriends.map(f => 
        f.user_id === userId ? f.friend_id : f.user_id
      ));
    } catch (error) {
      console.error('Error fetching friends:', error);
      toast({
        title: "Error fetching friends",
        description: "Could not load friend list. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [userId, toast]);

  useEffect(() => {
    if (userId) {
      fetchFriendsWithProfiles();

      // Set up real-time subscription
      const channel = supabase
        .channel('friends-changes')
        .on('postgres_changes', 
          { 
            event: '*', 
            schema: 'public', 
            table: 'friendships',
            filter: `user_id=eq.${userId}` 
          },
          () => fetchFriendsWithProfiles()
        )
        .on('postgres_changes', 
          { 
            event: '*', 
            schema: 'public', 
            table: 'friendships',
            filter: `friend_id=eq.${userId}` 
          },
          () => fetchFriendsWithProfiles()
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [userId, fetchFriendsWithProfiles]);

  return { friends, friendsList, loading };
};
