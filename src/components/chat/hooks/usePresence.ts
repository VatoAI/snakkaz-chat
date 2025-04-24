
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
  const presenceChannel = useRef<any>(null);

  // Handle status changes
  const handleStatusChange = useCallback(async (newStatus: UserStatus) => {
    if (!userId || hidden) return;
    
    try {
      // Ensure the status is one of the allowed values
      const validStatus: UserStatus = 
        ['online', 'busy', 'brb', 'offline'].includes(newStatus) 
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
      
      setCurrentStatus(newStatus);
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
        const presenceMap = presenceData.reduce((acc, presence: any) => ({
          ...acc,
          [presence.user_id]: presence
        }), {} as Record<string, any>);
        
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
    
    // Clear any existing channel
    if (presenceChannel.current) {
      supabase.removeChannel(presenceChannel.current);
    }
    
    // Initial presence fetch
    fetchAllPresence();
    
    // Set up realtime subscription
    presenceChannel.current = supabase
      .channel('presence-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'user_presence' },
        fetchAllPresence
      )
      .subscribe();
    
    // Set up heartbeat
    if (!hidden && !heartbeatInterval.current) {
      // First update immediately
      handleStatusChange(currentStatus);
      
      // Then set up interval
      heartbeatInterval.current = setInterval(() => {
        handleStatusChange(currentStatus);
      }, 30000); // Every 30 seconds
    }
    
    // Cleanup
    return () => {
      if (heartbeatInterval.current) {
        clearInterval(heartbeatInterval.current);
        heartbeatInterval.current = null;
      }
      
      if (presenceChannel.current) {
        supabase.removeChannel(presenceChannel.current);
        presenceChannel.current = null;
      }
      
      // Set offline status on unmount if not hidden
      if (!hidden) {
        supabase
          .from('user_presence')
          .update({ 
            status: 'offline', 
            last_seen: new Date().toISOString() 
          })
          .eq('user_id', userId)
          .then(({ error }) => {
            if (error) {
              console.error("Error setting offline status:", error);
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
