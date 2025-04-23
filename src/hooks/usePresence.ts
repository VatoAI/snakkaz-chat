
import { useEffect, useState, useCallback, useRef } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { UserStatus } from '@/types/presence';

export const usePresence = (
  userId: string | null, 
  initialStatus: UserStatus = 'online',
  onPresenceChange?: (presence: Record<string, any>) => void,
  hidden: boolean = false
) => {
  const [currentStatus, setCurrentStatus] = useState<UserStatus>(initialStatus);
  const [userPresence, setUserPresence] = useState<Record<string, any>>({});
  const heartbeatInterval = useRef<NodeJS.Timeout | null>(null);

  // Handle status changes
  const handleStatusChange = useCallback(async (newStatus: UserStatus) => {
    if (!userId || hidden) return;
    
    try {
      // Ensure the status is one of the allowed values
      const validStatus: UserStatus = 
        ['online', 'busy', 'brb', 'offline'].includes(newStatus as UserStatus) 
          ? newStatus 
          : 'online';
      
      const { error } = await supabase
        .from('user_presence')
        .upsert({
          user_id: userId,
          status: validStatus,
          last_seen: new Date().toISOString()
        }, { 
          onConflict: 'user_id'
        });

      if (error) throw error;
      
      setCurrentStatus(validStatus);
    } catch (error) {
      console.error("Error updating status:", error);
    }
  }, [userId, hidden]);

  // Fetch all presence data
  const fetchAllPresence = useCallback(async () => {
    if (!userId) return;
    
    try {
      const { data: presenceData, error } = await supabase
        .from('user_presence')
        .select('*');
        
      if (error) throw error;
      
      if (presenceData) {
        const presenceMap = presenceData.reduce((acc, presence) => ({
          ...acc,
          [presence.user_id]: presence
        }), {});
        
        setUserPresence(presenceMap);
        if (onPresenceChange) onPresenceChange(presenceMap);
      }
    } catch (error) {
      console.error("Error fetching presence data:", error);
    }
  }, [userId, onPresenceChange]);

  // Setup realtime subscription and heartbeat
  useEffect(() => {
    if (!userId) return;
    
    // Initial presence fetch
    fetchAllPresence();
    
    // Set up realtime subscription
    const channel = supabase
      .channel('presence-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'user_presence' },
        fetchAllPresence
      )
      .subscribe();
    
    // Set up heartbeat
    if (!hidden && !heartbeatInterval.current) {
      heartbeatInterval.current = setInterval(() => {
        handleStatusChange(currentStatus);
      }, 20000); // Every 20 seconds
    }
    
    // Cleanup
    return () => {
      if (heartbeatInterval.current) {
        clearInterval(heartbeatInterval.current);
        heartbeatInterval.current = null;
      }
      
      supabase.removeChannel(channel);
      
      // Clean up presence on unmount if not hidden
      if (!hidden) {
        supabase
          .from('user_presence')
          .delete()
          .eq('user_id', userId)
          .then(({ error }) => {
            if (error) {
              console.error("Error cleaning up presence:", error);
            }
          });
      }
    };
  }, [userId, currentStatus, hidden, handleStatusChange, fetchAllPresence]);

  return { 
    currentStatus, 
    handleStatusChange, 
    userPresence
  };
};
