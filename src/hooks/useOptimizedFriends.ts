import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { Friend } from '@/components/chat/friends/types';
import { useToast } from "@/components/ui/use-toast";
import { useGlobalPresence } from "@/contexts/PresenceContext";

export const useOptimizedFriends = (
  userId: string | null, 
  activeChat: string | null, 
  onCloseChatFn: () => void, 
  setSelectedFriend: (friend: Friend | null) => void
) => {
  const [friends, setFriends] = useState<Friend[]>([]);
  const [friendsList, setFriendsList] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [lastRefreshed, setLastRefreshed] = useState(new Date());
  const cachedFriendsRef = useRef<Record<string, Friend>>({});
  const { toast } = useToast();
  const { userStatuses } = useGlobalPresence();

  // Efficient fetch friends function with a single JOIN query
  const fetchFriends = useCallback(async () => {
    if (!userId) return;
    
    setLoading(true);
    
    try {
      // Use a single JOIN query to get friendships and profiles in one go
      const { data: friendshipsWithProfiles, error } = await supabase
        .from('friendships')
        .select(`
          id,
          user_id,
          friend_id,
          status,
          profiles:friend_id(id, username, full_name, avatar_url)
        `)
        .or(`user_id.eq.${userId},friend_id.eq.${userId}`)
        .eq('status', 'accepted');
      
      if (error) throw error;
      
      // Process the joined data
      const processedFriends: Friend[] = [];
      const friendIds: string[] = [];
      
      friendshipsWithProfiles?.forEach(friendship => {
        const isFriendReceiver = friendship.user_id === userId;
        const friendId = isFriendReceiver ? friendship.friend_id : friendship.user_id;
        const profileData = isFriendReceiver ? friendship.profiles : null;
        
        friendIds.push(friendId);
        
        // If we don't have profile data from the join, check if we have it in cache
        let profile = profileData;
        if (!profile && cachedFriendsRef.current[friendId]) {
          profile = cachedFriendsRef.current[friendId].profile;
        }
        
        const friend: Friend = {
          ...friendship,
          profile: profile as any || undefined
        };
        
        // Cache this friend data
        cachedFriendsRef.current[friendId] = friend;
        
        processedFriends.push(friend);
      });
      
      // If we're missing any profile data, fetch it separately
      const missingProfiles = processedFriends.filter(f => !f.profile);
      if (missingProfiles.length > 0) {
        const missingIds = missingProfiles.map(f => 
          f.user_id === userId ? f.friend_id : f.user_id
        );
        
        const { data: profilesData } = await supabase
          .from('profiles')
          .select('id, username, full_name, avatar_url')
          .in('id', missingIds);
          
        if (profilesData) {
          // Add profile data to our friends
          processedFriends.forEach(friend => {
            const friendId = friend.user_id === userId ? friend.friend_id : friend.user_id;
            const profile = profilesData.find(p => p.id === friendId);
            
            if (profile && !friend.profile) {
              friend.profile = profile;
              cachedFriendsRef.current[friendId] = friend;
            }
          });
        }
      }
      
      setFriends(processedFriends);
      setFriendsList(friendIds);
      setLastRefreshed(new Date());
      
      // Handle active chat that no longer exists in friend list
      if (activeChat && !friendIds.includes(activeChat)) {
        onCloseChatFn();
        setSelectedFriend(null);
      }
      
    } catch (error) {
      console.error('Error fetching friends:', error);
      toast({
        title: "Feil",
        description: "Kunne ikke laste vennelisten din",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [userId, activeChat, onCloseChatFn, setSelectedFriend, toast]);

  // Manual refresh function
  const refreshFriends = useCallback(() => {
    return fetchFriends();
  }, [fetchFriends]);

  // Fetch friends when userId changes
  useEffect(() => {
    if (!userId) return;
    
    fetchFriends();
    
    // Set up subscription for friendship changes - with debounce
    let timeoutId: NodeJS.Timeout;
    
    const friendsChannel = supabase
      .channel('optimized-friendships')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'friendships',
          filter: `or(user_id.eq.${userId},friend_id.eq.${userId})` 
        }, 
        () => {
          // Debounce the refresh to avoid multiple rapid updates
          clearTimeout(timeoutId);
          timeoutId = setTimeout(() => {
            fetchFriends();
          }, 300);
        }
      )
      .subscribe();
      
    return () => {
      clearTimeout(timeoutId);
      supabase.removeChannel(friendsChannel);
    };
  }, [userId, fetchFriends]);

  const handleSendFriendRequest = async (friendId: string) => {
    if (!userId) return;
    
    try {
      // Check if a friendship already exists
      const { data: existingFriendship } = await supabase
        .from('friendships')
        .select('id, status')
        .or(`and(user_id.eq.${userId},friend_id.eq.${friendId}),and(user_id.eq.${friendId},friend_id.eq.${userId})`)
        .single();
        
      if (existingFriendship) {
        toast({
          title: "Forespørsel eksisterer",
          description: existingFriendship.status === 'accepted' 
            ? "Dere er allerede venner" 
            : "En venneforespørsel eksisterer allerede",
        });
        return;
      }
      
      const { error } = await supabase
        .from('friendships')
        .insert({
          user_id: userId,
          friend_id: friendId,
          status: 'pending'
        });

      if (error) {
        throw error;
      }
      
      toast({
        title: "Forespørsel sendt",
        description: "Venneforespørsel sendt!",
      });
    } catch (error) {
      console.error('Error sending friend request:', error);
      toast({
        title: "Feil",
        description: "Kunne ikke sende venneforespørsel",
        variant: "destructive",
      });
    }
  };

  const handleStartChat = (friendId: string) => {
    // Try to find the friend in cache first for instant response
    const cachedFriend = cachedFriendsRef.current[friendId];
    if (cachedFriend) {
      setSelectedFriend(cachedFriend);
      return;
    }
    
    // Otherwise check the friends list
    const friend = friends.find(f => 
      (f.user_id === userId && f.friend_id === friendId) || 
      (f.friend_id === userId && f.user_id === friendId)
    );
    
    if (friend) {
      setSelectedFriend(friend);
    } else {
      toast({
        title: "Finner ikke venn",
        description: "Kunne ikke finne vennskap med denne brukeren",
        variant: "destructive",
      });
    }
  };

  // Get enhanced friends with status
  const friendsWithStatus = friends.map(friend => {
    const friendId = friend.user_id === userId ? friend.friend_id : friend.user_id;
    return {
      ...friend,
      status: userStatuses[friendId] || 'offline'
    };
  });

  return { 
    friends: friendsWithStatus,
    friendsList, 
    loading,
    lastRefreshed,
    refreshFriends,
    handleSendFriendRequest, 
    handleStartChat 
  };
};
