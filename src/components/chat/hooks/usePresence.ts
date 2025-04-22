
import { useEffect, useState, useCallback, useRef } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { UserStatus } from '@/types/presence';
import { useToast } from "@/components/ui/use-toast";

export const usePresence = (
  userId: string | null, 
  initialStatus: UserStatus = 'online',
  onPresenceChange?: (presence: Record<string, any>) => void,
  hidden: boolean = false
) => {
  const { toast } = useToast();
  const [currentStatus, setCurrentStatus] = useState<UserStatus>(initialStatus);
  const [userPresence, setUserPresence] = useState<Record<string, any>>({});
  const [presenceChannel, setPresenceChannel] = useState<any>(null);
  const heartbeatInterval = useRef<NodeJS.Timeout | null>(null);
  const initialLoad = useRef(true);
  
  // Handle status changes
  const handleStatusChange = useCallback(async (newStatus: UserStatus) => {
    if (!userId || hidden) return;
    
    setCurrentStatus(newStatus);

    try {
      // Only allow using statuses that are valid in the database
      const validStatus = (newStatus === 'offline') ? 'online' : newStatus;
      
      const { error } = await supabase
        .from('user_presence')
        .upsert({
          user_id: userId,
          status: validStatus,
          last_seen: new Date().toISOString()
        }, { onConflict: 'user_id' });

      if (error) {
        console.error("Error updating status:", error);
        toast({
          title: "Feil",
          description: "Kunne ikke oppdatere status",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error in handleStatusChange:", error);
    }
  }, [userId, hidden, toast]);

  // Function to update presence
  const updatePresence = useCallback(async (isHidden: boolean) => {
    if (!userId) return;
    
    try {
      if (isHidden) {
        // Delete presence when hidden
        const { error } = await supabase
          .from('user_presence')
          .delete()
          .eq('user_id', userId);
          
        if (error && error.code !== 'PGRST116') { // Ignore not found error
          console.error("Error removing presence when hiding:", error);
        }
      } else {
        // Only allow using statuses that are valid in the database
        const validStatus = (currentStatus === 'offline') ? 'online' : currentStatus;
        
        // Update presence when visible
        const { error } = await supabase
          .from('user_presence')
          .upsert({
            user_id: userId,
            status: validStatus,
            last_seen: new Date().toISOString()
          }, { onConflict: 'user_id' });

        if (error) {
          console.error("Error updating presence:", error);
        }
      }
    } catch (error) {
      console.error("Error toggling presence visibility:", error);
    }
  }, [userId, currentStatus]);

  // Function to fetch all presence data
  const fetchAllPresence = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('user_presence')
        .select('*');
        
      if (error) {
        console.error("Error fetching presence data:", error);
        return;
      }
      
      if (data) {
        const presenceMap = data.reduce((acc, presence) => ({
          ...acc,
          [presence.user_id]: presence
        }), {});
        
        setUserPresence(presenceMap);
        if (onPresenceChange) onPresenceChange(presenceMap);
      }
    } catch (error) {
      console.error("Error fetching presence data:", error);
    }
  }, [onPresenceChange]);

  // Set up heartbeat and visibility handling
  useEffect(() => {
    if (!userId) return;
    
    // Set up heartbeat to update presence regularly
    if (heartbeatInterval.current) {
      clearInterval(heartbeatInterval.current);
    }
    
    // Only set up heartbeat if not hidden
    if (!hidden) {
      heartbeatInterval.current = setInterval(async () => {
        await updatePresence(false);
      }, 20000); // Every 20 seconds
    }
    
    // Update presence on visibility change
    updatePresence(hidden);

    return () => {
      if (heartbeatInterval.current) {
        clearInterval(heartbeatInterval.current);
      }
    };
  }, [userId, hidden, updatePresence]);

  // Set up presence channel subscription
  useEffect(() => {
    if (!userId) return;

    // Initial presence fetch
    fetchAllPresence();
    
    // Set up real-time subscription for presence changes
    const channel = supabase
      .channel('presence-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'user_presence' },
        async () => {
          await fetchAllPresence();
        }
      )
      .subscribe();
    
    setPresenceChannel(channel);
    
    return () => {
      if (channel) {
        supabase.removeChannel(channel);
      }
      
      // Clean up user's presence when component unmounts
      if (userId && !hidden) {
        supabase
          .from('user_presence')
          .delete()
          .eq('user_id', userId)
          .then(({ error }) => {
            if (error) {
              console.error("Error cleaning up presence on unmount:", error);
            }
          });
      }
    };
  }, [userId, fetchAllPresence, hidden]);

  // Status change effect when initialStatus changes
  useEffect(() => {
    if (!userId || hidden) return;
    
    // Skip first render to avoid duplicate updates
    if (initialLoad.current) {
      initialLoad.current = false;
      return;
    }
    
    if (initialStatus !== currentStatus) {
      setCurrentStatus(initialStatus);
      handleStatusChange(initialStatus);
    }
  }, [userId, initialStatus, hidden, handleStatusChange, currentStatus]);

  // Handle page visibility changes for better presence accuracy
  useEffect(() => {
    if (!userId) return;
    
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && !hidden) {
        // Update presence when tab becomes visible
        updatePresence(false);
      } else if (document.visibilityState === 'hidden') {
        // Consider marking as away when tab is hidden
        // Commented out as this would be a UX decision
        // handleStatusChange('brb');
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [userId, hidden, updatePresence]);

  // Handle beforeunload to ensure presence is cleaned up
  useEffect(() => {
    if (!userId) return;
    
    const handleBeforeUnload = () => {
      if (userId && !hidden) {
        try {
          navigator.sendBeacon(
            `${import.meta.env.VITE_SUPABASE_URL}/rest/v1/user_presence?user_id=eq.${userId}`,
            JSON.stringify({ method: 'DELETE' })
          );
        } catch (e) {
          // Can't log during unload
        }
      }
    };
    
    window.addEventListener('beforeunload', handleBeforeUnload);
    
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [userId, hidden]);

  // Fetch current status from database on load
  useEffect(() => {
    if (!userId) return;
    
    const fetchCurrentStatus = async () => {
      try {
        const { data, error } = await supabase
          .from('user_presence')
          .select('status')
          .eq('user_id', userId)
          .maybeSingle();
          
        if (error) {
          console.error("Error fetching current status:", error);
          return;
        }
        
        if (data?.status && data.status !== currentStatus) {
          setCurrentStatus(data.status as UserStatus);
        }
      } catch (error) {
        console.error("Error fetching current status:", error);
      }
    };
    
    fetchCurrentStatus();
  }, [userId, currentStatus]);

  return { 
    currentStatus, 
    handleStatusChange, 
    userPresence
  };
};
