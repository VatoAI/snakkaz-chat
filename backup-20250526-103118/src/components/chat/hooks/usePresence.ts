
import { useState, useEffect } from 'react';
import { UserStatus, isValidStatus, getDefaultStatus, UserPresence } from '@/types/presence';
import { supabase } from '@/integrations/supabase/client';

export const usePresence = (userId: string | null) => {
  const [userPresence, setUserPresence] = useState<Record<string, UserPresence>>({});
  const [currentStatus, setCurrentStatus] = useState<UserStatus>(UserStatus.ONLINE);
  
  // Set initial presence
  useEffect(() => {
    if (!userId) return;
    
    // Get initial presence data
    const fetchPresence = async () => {
      try {
        const { data, error } = await supabase
          .from('presence')
          .select('*');
        
        if (error) {
          console.error('Error fetching presence:', error);
          return;
        }
        
        if (data) {
          const presenceData: Record<string, UserPresence> = {};
          
          data.forEach((item) => {
            presenceData[item.user_id] = {
              user_id: item.user_id,
              status: isValidStatus(item.status) ? item.status : getDefaultStatus(),
              last_seen: item.last_seen,
              online: item.status === UserStatus.ONLINE
            };
          });
          
          setUserPresence(presenceData);
        }
      } catch (error) {
        console.error('Error in fetchPresence:', error);
      }
    };
    
    fetchPresence();
    
    // Setup presence channel
    const channel = supabase.channel('presence');
    
    // Subscribe to presence changes
    channel
      .on('presence', { event: 'sync' }, () => {
        const state = channel.presenceState();
        console.log('Presence state:', state);
        
        // Update presence state
        const newPresence: Record<string, UserPresence> = {};
        
        Object.keys(state).forEach((presenceKey) => {
          const presenceData = state[presenceKey][0];
          
          if (presenceData?.user_id) {
            newPresence[presenceData.user_id] = {
              user_id: presenceData.user_id,
              status: isValidStatus(presenceData.status) ? presenceData.status : getDefaultStatus(),
              last_seen: presenceData.last_seen || new Date().toISOString(),
              online: presenceData.status === UserStatus.ONLINE
            };
          }
        });
        
        setUserPresence((prev) => ({
          ...prev,
          ...newPresence
        }));
      })
      .subscribe();
    
    // Track current user's status
    if (userId) {
      channel.track({
        user_id: userId,
        status: currentStatus,
        last_seen: new Date().toISOString()
      });
    }
    
    // Cleanup
    return () => {
      channel.unsubscribe();
    };
  }, [userId, currentStatus]);
  
  // Handle status changes
  const handleStatusChange = (status: UserStatus) => {
    if (!userId) return;
    
    setCurrentStatus(status);
    
    // Update presence in database
    supabase
      .from('presence')
      .upsert([
        {
          user_id: userId,
          status,
          last_seen: new Date().toISOString()
        }
      ])
      .then(({ error }) => {
        if (error) {
          console.error('Error updating presence:', error);
        }
      });
  };
  
  return {
    userPresence,
    currentStatus,
    handleStatusChange
  };
};
