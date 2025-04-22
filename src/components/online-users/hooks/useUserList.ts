
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { UserStatus } from "@/types/presence";
import { filterUsers } from "../UserListFilters";

interface UseUserListProps {
  userPresence: Record<string, { status: UserStatus }>;
  currentUserId: string | null;
  friends: string[];
  userProfiles?: Record<string, {username: string | null, avatar_url: string | null}>;
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

  const usersToDisplay = filterUsers({
    users: allUsers,
    userPresence,
    currentUserId,
    friends,
    pendingRequests,
    showAllUsers,
    userProfiles
  });

  const onlineCount = Object.keys(userPresence).length - (userPresence[currentUserId || ''] ? 1 : 0);

  return {
    showAllUsers,
    setShowAllUsers,
    isLoading,
    usersToDisplay,
    onlineCount
  };
};
