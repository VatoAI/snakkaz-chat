import { useState, useEffect, useMemo, useCallback } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { Friend } from '@/components/chat/friends/types';
import { useToast } from "@/components/ui/use-toast";
import { useGlobalPresence } from "@/contexts/PresenceContext";

type FriendRecord = {
  id: string;
  username: string | null;
  full_name: string | null;
  avatar_url: string | null;
  status: 'online' | 'busy' | 'brb' | 'offline';
  last_seen: string | null;
  isPremium?: boolean; // Added premium flag
};

export const useOptimizedFriends = (userId: string | null) => {
  const [friends, setFriends] = useState<FriendRecord[]>([]);
  const [friendsList, setFriendsList] = useState<string[]>([]);
  const [pendingRequests, setPendingRequests] = useState<FriendRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { userStatuses } = useGlobalPresence();
  
  // For cache invalidation
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  // Cache to prevent redundant fetches
  const [profileCache, setProfileCache] = useState<Record<string, any>>({});

  // Fetch friends efficiently with a single query and use caching
  const fetchFriends = useCallback(async () => {
    if (!userId) return;
    
    try {
      setLoading(true);
      
      // Step 1: Get all friendship IDs at once
      const { data: friendships, error: friendshipsError } = await supabase
        .from('friendships')
        .select(`
          id,
          user_id,
          friend_id,
          status
        `)
        .or(`user_id.eq.${userId},friend_id.eq.${userId}`);
        
      if (friendshipsError) throw friendshipsError;
      
      // Step 2: Separate accepted and pending friendships
      const acceptedFriendships = friendships?.filter(f => f.status === 'accepted') || [];
      const incomingPendingFriendships = friendships?.filter(
        f => f.status === 'pending' && f.friend_id === userId
      ) || [];
      
      // Step 3: Extract friend IDs from accepted friendships
      const friendIds = acceptedFriendships.map(f => 
        f.user_id === userId ? f.friend_id : f.user_id
      );
      
      const pendingFriendIds = incomingPendingFriendships.map(f => f.user_id);
      
      setFriendsList(friendIds);
      
      // Determine which profiles we need to fetch (those not in cache or older than 5 minutes)
      const now = new Date();
      const cacheTimeout = 5 * 60 * 1000; // 5 minutes
      const idsToFetch = [...friendIds, ...pendingFriendIds].filter(id => 
        !profileCache[id] || now.getTime() - profileCache[id].timestamp > cacheTimeout
      );
      
      // Step 4: If we need to fetch profiles, do it in batch
      if (idsToFetch.length > 0) {
        const { data: profiles } = await supabase
          .from('profiles')
          .select('id, username, full_name, avatar_url, subscription_type')
          .in('id', idsToFetch);
          
        if (profiles) {
          // Update cache
          const newCache = {...profileCache};
          profiles.forEach(profile => {
            newCache[profile.id] = {
              ...profile,
              isPremium: profile.subscription_type === 'premium',
              timestamp: now.getTime() 
            };
          });
          setProfileCache(newCache);
        }
      }
      
      // Use cached data + newly fetched data
      if (friendIds.length > 0 || pendingFriendIds.length > 0) {
        const allProfiles = [...friendIds, ...pendingFriendIds].map(id => profileCache[id]).filter(Boolean);
        
        // Map to friend records
        const friendRecords: FriendRecord[] = allProfiles
          .filter(profile => friendIds.includes(profile.id))
          .map(profile => ({
            ...profile,
            status: (userStatuses[profile.id] || 'offline'),
            last_seen: null,
            isPremium: profile.isPremium
          }));
          
        const pendingRecords: FriendRecord[] = allProfiles
          .filter(profile => pendingFriendIds.includes(profile.id))
          .map(profile => ({
            ...profile,
            status: (userStatuses[profile.id] || 'offline'),
            last_seen: null,
            isPremium: profile.isPremium
          }));
        
        // Sort by online status first, then by name
        const sortedFriends = friendRecords.sort((a, b) => {
          // First by online status
          const statusPriority = { 'online': 0, 'brb': 1, 'busy': 2, 'offline': 3 };
          const statusDiff = statusPriority[a.status] - statusPriority[b.status];
          if (statusDiff !== 0) return statusDiff;
          
          // Then by name
          return (a.username || a.id).localeCompare(b.username || b.id);
        });
        
        setFriends(sortedFriends);
        setPendingRequests(pendingRecords);
      } else {
        setFriends([]);
        setPendingRequests([]);
      }
      
    } catch (error) {
      console.error('Error fetching friends:', error);
      toast({
        title: "Feil ved lasting av venner",
        description: "Kunne ikke laste inn venner. Prøv å laste siden på nytt.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
      setLastUpdated(new Date());
    }
  }, [userId, userStatuses, toast, profileCache]);
  
  // Initial fetch and refresh interval
  useEffect(() => {
    if (!userId) return;
    
    fetchFriends();
    
    const refreshInterval = setInterval(() => {
      fetchFriends();
    }, 60000); // Reduced from 30s to 60s to lower server load
    
    // Set up subscription for friendship changes
    const friendsChannel = supabase
      .channel('friendships-changes-optimized')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'friendships',
          filter: `or(user_id.eq.${userId},friend_id.eq.${userId})` 
        }, 
        () => {
          fetchFriends();
        }
      )
      .subscribe();
      
    return () => {
      clearInterval(refreshInterval);
      supabase.removeChannel(friendsChannel);
    };
  }, [userId, fetchFriends]);
  
  // Resync when user statuses change
  useEffect(() => {
    if (Object.keys(userStatuses).length > 0 && friends.length > 0) {
      const updatedFriends = friends.map(friend => ({
        ...friend,
        status: (userStatuses[friend.id] || friend.status)
      }));
      
      // Only update if actually changed to prevent unnecessary renders
      if (JSON.stringify(updatedFriends) !== JSON.stringify(friends)) {
        const sortedFriends = [...updatedFriends].sort((a, b) => {
          // First by online status
          const statusPriority = { 'online': 0, 'brb': 1, 'busy': 2, 'offline': 3 };
          const statusDiff = statusPriority[a.status] - statusPriority[b.status];
          if (statusDiff !== 0) return statusDiff;
          
          // Then by name
          return (a.username || a.id).localeCompare(b.username || b.id);
        });
        
        setFriends(sortedFriends);
      }
    }
  }, [userStatuses, friends]);

  // Rest of the methods stay the same
  const handleSendFriendRequest = useCallback(async (friendId: string) => {
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
      
      // Refresh friends list
      fetchFriends();
    } catch (error) {
      console.error('Error sending friend request:', error);
      toast({
        title: "Feil",
        description: "Kunne ikke sende venneforespørsel",
        variant: "destructive",
      });
    }
  }, [userId, fetchFriends, toast]);
  
  const handleAcceptFriendRequest = useCallback(async (friendId: string) => {
    if (!userId) return;
    
    try {
      const { error } = await supabase
        .from('friendships')
        .update({ status: 'accepted' })
        .eq('user_id', friendId)
        .eq('friend_id', userId);

      if (error) throw error;
      
      toast({
        title: "Forespørsel akseptert",
        description: "Dere er nå venner!",
      });
      
      // Refresh friends list
      fetchFriends();
    } catch (error) {
      console.error('Error accepting friend request:', error);
      toast({
        title: "Feil",
        description: "Kunne ikke akseptere venneforespørsel",
        variant: "destructive",
      });
    }
  }, [userId, fetchFriends, toast]);
  
  const handleRejectFriendRequest = useCallback(async (friendId: string) => {
    if (!userId) return;
    
    try {
      const { error } = await supabase
        .from('friendships')
        .delete()
        .eq('user_id', friendId)
        .eq('friend_id', userId);

      if (error) throw error;
      
      toast({
        title: "Forespørsel avslått",
        description: "Venneforespørselen ble avslått",
      });
      
      // Refresh friends list
      fetchFriends();
    } catch (error) {
      console.error('Error rejecting friend request:', error);
      toast({
        title: "Feil",
        description: "Kunne ikke avslå venneforespørsel",
        variant: "destructive",
      });
    }
  }, [userId, fetchFriends, toast]);

  const handleRefresh = useCallback(() => {
    fetchFriends();
  }, [fetchFriends]);

  return { 
    friends,
    pendingRequests, 
    friendsList,
    loading,
    lastUpdated,
    handleSendFriendRequest,
    handleAcceptFriendRequest,
    handleRejectFriendRequest,
    handleRefresh
  };
};
