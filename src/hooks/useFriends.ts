
import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { Friend } from '@/components/chat/friends/types';
import { useToast } from "@/components/ui/use-toast";

export const useFriends = (userId: string | null, activeChat: string | null, onCloseChatFn: () => void, setSelectedFriend: (friend: Friend | null) => void) => {
  const [friends, setFriends] = useState<Friend[]>([]);
  const [friendsList, setFriendsList] = useState<string[]>([]);
  const { toast } = useToast();

  // Fetch friends when userId changes
  useEffect(() => {
    if (!userId) return;
    
    const fetchFriends = async () => {
      try {
        const { data: friendships, error: friendshipsError } = await supabase
          .from('friendships')
          .select(`
            id,
            user_id,
            friend_id,
            status
          `)
          .or(`user_id.eq.${userId},friend_id.eq.${userId}`)
          .eq('status', 'accepted');
          
        if (friendshipsError) throw friendshipsError;
        
        const friendIds = (friendships || []).map(f => 
          f.user_id === userId ? f.friend_id : f.user_id
        );
        
        setFriendsList(friendIds);
        
        // Fetch user profiles for friends
        const friendsWithProfiles: Friend[] = [];
        for (const friendship of friendships || []) {
          const profileId = friendship.user_id === userId ? friendship.friend_id : friendship.user_id;
          
          const { data: profileData } = await supabase
            .from('profiles')
            .select('id, username, full_name, avatar_url')
            .eq('id', profileId)
            .single();
            
          friendsWithProfiles.push({
            ...friendship,
            profile: profileData || undefined
          });
        }
        
        setFriends(friendsWithProfiles);

        // If we have an active chat with a friend, update it
        if (activeChat && !friendIds.includes(activeChat)) {
          onCloseChatFn();
          setSelectedFriend(null);
        }
        
      } catch (error) {
        console.error('Error fetching friends:', error);
      }
    };
    
    fetchFriends();
    
    // Set up subscription for friendship changes
    const friendsChannel = supabase
      .channel('friendships-changes')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'friendships',
          filter: `user_id=eq.${userId}` 
        }, 
        () => {
          fetchFriends();
        }
      )
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'friendships',
          filter: `friend_id=eq.${userId}` 
        }, 
        () => {
          fetchFriends();
        }
      )
      .subscribe();
      
    return () => {
      supabase.removeChannel(friendsChannel);
    };
  }, [userId, activeChat, onCloseChatFn, setSelectedFriend]);

  const handleSendFriendRequest = async (friendId: string) => {
    if (!userId) return;
    
    try {
      const { error } = await supabase
        .from('friendships')
        .insert({
          user_id: userId,
          friend_id: friendId,
          status: 'pending'
        });

      if (error) {
        if (error.code === '23505') { // Unique violation
          toast({
            title: "Forespørsel eksisterer",
            description: "Du har allerede sendt eller mottatt en venneforespørsel fra denne brukeren",
          });
        } else {
          throw error;
        }
      } else {
        toast({
          title: "Forespørsel sendt",
          description: "Venneforespørsel sendt!",
        });
      }
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
    // Find the friend in the friends list
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

  return { 
    friends, 
    friendsList, 
    handleSendFriendRequest, 
    handleStartChat 
  };
};
