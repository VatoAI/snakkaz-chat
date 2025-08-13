
// Fix type errors in useUserPresence
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { UserStatus, UserPresence } from '@/types/presence';

export const useUserPresence = (userId: string | null) => {
  const [userStatus, setUserStatus] = useState<UserStatus>('offline');
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Fetch the current user's presence
  const fetchUserPresence = useCallback(async () => {
    if (!userId) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('presence')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error) {
        console.error('Error fetching user presence:', error);
      } else if (data) {
        setUserStatus(data.status as UserStatus);
      }
    } catch (err) {
      console.error('Error in fetchUserPresence:', err);
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  // Update the user's presence
  const updateUserPresence = useCallback(async (status: UserStatus) => {
    if (!userId) return;

    try {
      const presenceData: UserPresence = {
        user_id: userId,
        status,
        last_seen: new Date().toISOString()
      };

      const { error } = await supabase
        .from('presence')
        .upsert(presenceData)
        .select();

      if (error) {
        console.error('Error updating user presence:', error);
      } else {
        setUserStatus(status);
      }
    } catch (err) {
      console.error('Error in updateUserPresence:', err);
    }
  }, [userId]);

  // Set up real-time subscription
  useEffect(() => {
    if (!userId) return;

    fetchUserPresence();

    // Subscribe to changes in the user's presence
    const presenceSubscription = supabase
      .channel('presence-changes')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'presence',
          filter: `user_id=eq.${userId}`
        },
        (payload) => {
          const newStatus = payload.new.status as UserStatus;
          setUserStatus(newStatus);
        }
      )
      .subscribe();

    return () => {
      presenceSubscription.unsubscribe();
    };
  }, [userId, fetchUserPresence]);

  return {
    userStatus,
    isLoading,
    updateUserPresence
  };
};
