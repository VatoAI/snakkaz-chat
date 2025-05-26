
import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useFriendSubscription = (currentUserId: string, onFriendsChange: () => void) => {
  useEffect(() => {
    if (!currentUserId) return;
    
    const friendsChannel = supabase
      .channel('friends-changes')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'friendships',
          filter: `friend_id=eq.${currentUserId}` 
        }, 
        () => {
          onFriendsChange();
        }
      )
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'friendships',
          filter: `user_id=eq.${currentUserId}` 
        }, 
        () => {
          onFriendsChange();
        }
      )
      .subscribe();
      
    return () => {
      supabase.removeChannel(friendsChannel);
    };
  }, [currentUserId, onFriendsChange]);
};

