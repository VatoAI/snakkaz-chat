
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { UserPresence } from "@/types/presence";

interface UseUserListProps {
  userPresence: Record<string, UserPresence>;
  currentUserId: string | null;
  friends: string[];
  userProfiles?: Record<string, {username: string | null, avatar_url: string | null}>;
}

interface UserListItem {
  id: string;
  username: string;
  status: any;
  isOnline: boolean;
  isFriend: boolean;
  isPending: boolean;
}

export const useUserList = ({ 
  userPresence, 
  currentUserId, 
  friends,
  userProfiles = {}
}: UseUserListProps) => {
  const [showAllUsers, setShowAllUsers] = useState(false);
  const [allUsers, setAllUsers] = useState<{id: string, username: string | null}[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [pendingRequests, setPendingRequests] = useState<string[]>([]);
  const { toast } = useToast();

  // Fetch all users and pending friendship requests
  useEffect(() => {
    const fetchAllUsers = async () => {
      if (!showAllUsers) return;
      
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('id, username')
          .neq('id', currentUserId || '');
          
        if (error) throw error;
        setAllUsers(data || []);

        if (currentUserId) {
          const { data: friendshipData, error: friendshipError } = await supabase
            .from('friendships')
            .select('friend_id, user_id')
            .eq('status', 'pending')
            .or(`user_id.eq.${currentUserId},friend_id.eq.${currentUserId}`);

          if (!friendshipError && friendshipData) {
            const pendingIds = friendshipData.map(fr => 
              fr.user_id === currentUserId ? fr.friend_id : fr.user_id
            );
            setPendingRequests(pendingIds);
          }
        }
      } catch (error) {
        console.error('Error fetching profiles:', error);
        toast({
          title: "Feil ved henting av brukere",
          description: "Kunne ikke hente brukerlisten",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchAllUsers();
  }, [showAllUsers, currentUserId, toast]);

  // Transform data for display
  const getUsersToDisplay = (): UserListItem[] => {
    if (showAllUsers) {
      return allUsers.map(user => {
        const isOnline = Boolean(userPresence[user.id]);
        const status = isOnline ? userPresence[user.id].status : null;
        const isFriend = friends.includes(user.id);
        const isPending = pendingRequests.includes(user.id);
        const displayName = userProfiles[user.id]?.username || user.username || user.id.substring(0, 8);
        
        return {
          id: user.id,
          username: displayName,
          status,
          isOnline,
          isFriend,
          isPending
        };
      });
    } else {
      return Object.entries(userPresence)
        .filter(([userId]) => userId !== currentUserId)
        .map(([userId, presence]) => {
          const isFriend = friends.includes(userId);
          const isPending = pendingRequests.includes(userId);
          const displayName = userProfiles[userId]?.username || 
                            allUsers.find(u => u.id === userId)?.username || 
                            userId.substring(0, 8);
          
          return {
            id: userId,
            username: displayName,
            status: presence.status,
            isOnline: true,
            isFriend,
            isPending
          };
        });
    }
  };

  const onlineCount = Object.keys(userPresence).length - (userPresence[currentUserId || ''] ? 1 : 0);

  return {
    showAllUsers,
    setShowAllUsers,
    isLoading,
    usersToDisplay: getUsersToDisplay(),
    onlineCount
  };
};
