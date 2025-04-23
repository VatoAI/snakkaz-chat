
import { useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { Friend } from "./friends/types";
import { useToast } from '@/components/ui/use-toast';

interface ChatFriendsProps {
  userId: string | null;
  setFriends: (updater: React.SetStateAction<Friend[]>) => void;
  setFriendsList: (updater: React.SetStateAction<string[]>) => void;
  activeChat: string | null;
  setActiveChat: (chatId: string | null) => void;
  setSelectedFriend: (friend: Friend | null) => void;
}

export const ChatFriends = ({
  userId,
  setFriends,
  setFriendsList,
  activeChat,
  setActiveChat,
  setSelectedFriend
}: ChatFriendsProps) => {
  const { toast } = useToast();

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
        
        // Hent brukerprofilene for venner
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

        // Hvis vi har en aktiv chat med en venn, oppdater den
        if (activeChat && !friendIds.includes(activeChat)) {
          setActiveChat(null);
          setSelectedFriend(null);
        }
        
      } catch (error) {
        console.error('Error fetching friends:', error);
      }
    };
    
    fetchFriends();
    
    // Sett opp subscription for vennskap
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
  }, [userId, activeChat, setActiveChat, setFriends, setFriendsList, setSelectedFriend]);

  return null;
};
