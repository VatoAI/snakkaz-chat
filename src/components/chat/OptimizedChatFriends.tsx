import { useMemo, useEffect } from 'react';
import { useSupabaseQuery, useSupabaseTable } from '@/hooks/useApiCache';
import { Friend } from "./friends/types";
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface ChatFriendsProps {
  userId: string | null;
  setFriends: (updater: React.SetStateAction<Friend[]>) => void;
  setFriendsList: (updater: React.SetStateAction<string[]>) => void;
  activeChat: string | null;
  setActiveChat: (chatId: string | null) => void;
  setSelectedFriend: (friend: Friend | null) => void;
}

export const OptimizedChatFriends = ({
  userId,
  setFriends,
  setFriendsList,
  activeChat,
  setActiveChat,
  setSelectedFriend
}: ChatFriendsProps) => {
  const { toast } = useToast();

  // Fetch friendships with caching (5 minute cache)
  const { data: friendships, isLoading: friendshipsLoading, refetch: refreshFriends } = useSupabaseQuery(
    'friendships',
    async (supabase) => {
      if (!userId) return { data: null, error: new Error('No user ID') };
      
      return await supabase
        .from('friendships')
        .select(`
          id,
          user_id,
          friend_id,
          status
        `)
        .or(`user_id.eq.${userId},friend_id.eq.${userId}`)
        .eq('status', 'accepted');
    },
    {
      maxAge: 5 * 60 * 1000, // 5 minutes cache
      staleWhileRevalidate: true,
      disableCache: !userId // Only cache if we have a user ID
    }
  );

  // Generate friend IDs from friendships
  const friendIds = useMemo(() => {
    if (!friendships || !userId) return [];
    return friendships.map(f => 
      f.user_id === userId ? f.friend_id : f.user_id
    );
  }, [friendships, userId]);

  // Update friends list whenever friend IDs change
  useEffect(() => {
    if (friendIds.length > 0) {
      setFriendsList(friendIds);
    }
  }, [friendIds, setFriendsList]);

  // Fetch profiles for all friends in a batched query (more efficient than individual queries)
  const { data: profiles } = useSupabaseQuery(
    'profiles',
    async (supabase) => {
      if (!friendIds.length) return { data: [], error: null };
      
      return await supabase
        .from('profiles')
        .select('id, username, full_name, avatar_url')
        .in('id', friendIds);
    },
    {
      maxAge: 5 * 60 * 1000, // 5 minutes cache
      staleWhileRevalidate: true,
      disableCache: friendIds.length === 0
    }
  );

  // Combine friendships with profiles
  useEffect(() => {
    if (friendships && profiles && userId) {
      const friendsWithProfiles: Friend[] = friendships.map(friendship => {
        const profileId = friendship.user_id === userId ? friendship.friend_id : friendship.user_id;
        const profile = profiles.find(p => p.id === profileId);
        
        return {
          ...friendship,
          profile: profile || undefined
        };
      });
      
      setFriends(friendsWithProfiles);

      // If we have an active chat with a friend, update it
      if (activeChat && !friendIds.includes(activeChat)) {
        setActiveChat(null);
        setSelectedFriend(null);
      }
    }
  }, [friendships, profiles, userId, setFriends, activeChat, friendIds, setActiveChat, setSelectedFriend]);

  // Set up subscription for friendships changes
  useEffect(() => {
    if (!userId) return;
    
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
          refreshFriends();
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
          refreshFriends();
        }
      )
      .subscribe();
    
    return () => {
      supabase.removeChannel(friendsChannel);
    };
  }, [userId, refreshFriends]);

  // Loading state
  if (friendshipsLoading && (!friendships || friendships.length === 0)) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-center">
          <div className="spinner animate-spin h-10 w-10 border-4 border-primary border-t-transparent rounded-full inline-block"></div>
          <p className="mt-2 text-sm text-muted-foreground">Laster inn venner...</p>
        </div>
      </div>
    );
  }

  // Empty state
  if (!friendshipsLoading && (!friendships || friendships.length === 0)) {
    return (
      <div className="flex h-full items-center justify-center px-4">
        <div className="text-center">
          <h3 className="text-lg font-medium">Ingen venner funnet</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Du har ingen venner enda. Legg til venner for å starte chatter.
          </p>
          <button 
            className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-md"
            onClick={() => toast({
              title: "Venneforespørsler",
              description: "Funksjonen for å legge til venner er under utvikling.",
            })}
          >
            Legg til venn
          </button>
        </div>
      </div>
    );
  }

  // Component doesn't render UI directly, just handles data fetching
  return null;
};
