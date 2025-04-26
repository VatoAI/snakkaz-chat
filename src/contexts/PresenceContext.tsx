import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';

type PresenceContextType = {
  userStatuses: Record<string, 'online' | 'offline' | 'busy' | 'brb'>;
  setUserStatus: (userId: string, status: 'online' | 'offline' | 'busy' | 'brb') => void;
  updateCurrentUserStatus: (status: 'online' | 'offline' | 'busy' | 'brb') => Promise<void>;
};

const PresenceContext = createContext<PresenceContextType>({
  userStatuses: {},
  setUserStatus: () => {},
  updateCurrentUserStatus: async () => {},
});

export const PresenceProvider = ({ children }: { children: ReactNode }) => {
  const [userStatuses, setUserStatuses] = useState<Record<string, 'online' | 'offline' | 'busy' | 'brb'>>({});
  
  useEffect(() => {
    // Safely create a presence channel with error handling
    try {
      let channel;
      
      try {
        channel = supabase.channel('presence-channel');
        if (!channel) throw new Error('Failed to create presence channel');
      } catch (err) {
        console.error('Error creating presence channel:', err);
        return;
      }
      
      // Safely subscribe to presence events
      try {
        channel
          .on('presence', { event: 'sync' }, () => {
            try {
              // Safe access to presenceState
              const presences = channel.presenceState ? channel.presenceState() : {};
              
              // Map presence data to user statuses
              const newStatuses: Record<string, 'online' | 'offline' | 'busy' | 'brb'> = {};
              
              Object.keys(presences).forEach(key => {
                if (Array.isArray(presences[key]) && presences[key].length > 0) {
                  const presence = presences[key][0];
                  if (presence && presence.user_id && presence.status) {
                    newStatuses[presence.user_id] = presence.status as 'online' | 'offline' | 'busy' | 'brb';
                  }
                }
              });
              
              setUserStatuses(prevStatuses => ({
                ...prevStatuses,
                ...newStatuses
              }));
            } catch (error) {
              console.error('Error in presence sync handler:', error);
            }
          })
          .on('presence', { event: 'join' }, (payload) => {
            try {
              const { newPresences } = payload || {};
              if (Array.isArray(newPresences) && newPresences.length > 0) {
                if (newPresences[0]?.user_id && newPresences[0]?.status) {
                  const { user_id, status } = newPresences[0];
                  setUserStatuses(prevStatuses => ({
                    ...prevStatuses,
                    [user_id]: status as 'online' | 'offline' | 'busy' | 'brb'
                  }));
                }
              }
            } catch (error) {
              console.error('Error in presence join handler:', error);
            }
          })
          .on('presence', { event: 'leave' }, (payload) => {
            try {
              const { leftPresences } = payload || {};
              if (Array.isArray(leftPresences) && leftPresences.length > 0) {
                if (leftPresences[0]?.user_id) {
                  const { user_id } = leftPresences[0];
                  setUserStatuses(prevStatuses => ({
                    ...prevStatuses,
                    [user_id]: 'offline'
                  }));
                }
              }
            } catch (error) {
              console.error('Error in presence leave handler:', error);
            }
          });
        
        // Try to subscribe with error handling
        channel.subscribe((status) => {
          if (status !== 'SUBSCRIBED') {
            console.error('Failed to subscribe to presence channel:', status);
          }
        });
      } catch (err) {
        console.error('Error setting up presence listeners:', err);
      }
      
      // Cleanup function
      return () => {
        try {
          if (channel && typeof supabase.removeChannel === 'function') {
            supabase.removeChannel(channel);
          }
        } catch (err) {
          console.error('Error removing channel:', err);
        }
      };
    } catch (error) {
      console.error('Error in presence effect:', error);
      return () => {}; // Empty cleanup if setup failed
    }
  }, []);
  
  const setUserStatus = (userId: string, status: 'online' | 'offline' | 'busy' | 'brb') => {
    setUserStatuses(prevStatuses => ({
      ...prevStatuses,
      [userId]: status
    }));
  };
  
  const updateCurrentUserStatus = async (status: 'online' | 'offline' | 'busy' | 'brb') => {
    try {
      const { data: session } = await supabase.auth.getSession();
      const userId = session?.session?.user?.id;
      
      if (userId) {
        try {
          // Update user status in database
          await supabase.from('profiles')
            .update({ status })
            .eq('id', userId);
          
          // Update local state
          setUserStatus(userId, status);
          
          // Try to update presence
          try {
            const channel = supabase.channel('presence-channel');
            if (channel && typeof channel.track === 'function') {
              await channel.track({ user_id: userId, status });
            }
          } catch (err) {
            console.error('Failed to track presence:', err);
          }
        } catch (error) {
          console.error('Failed to update status:', error);
        }
      }
    } catch (error) {
      console.error('Error in updateCurrentUserStatus:', error);
    }
  };
  
  return (
    <PresenceContext.Provider value={{ userStatuses, setUserStatus, updateCurrentUserStatus }}>
      {children}
    </PresenceContext.Provider>
  );
};

export const useGlobalPresence = () => useContext(PresenceContext);