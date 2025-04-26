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
    // Subscribe to presence changes in Supabase
    const channel = supabase.channel('presence-channel')
      .on('presence', { event: 'sync' }, () => {
        const presences = channel.presenceState();
        
        // Map presence data to user statuses
        const newStatuses: Record<string, 'online' | 'offline' | 'busy' | 'brb'> = {};
        
        Object.keys(presences).forEach(key => {
          const presence = presences[key][0];
          if (presence.user_id && presence.status) {
            newStatuses[presence.user_id] = presence.status as 'online' | 'offline' | 'busy' | 'brb';
          }
        });
        
        setUserStatuses(prevStatuses => ({
          ...prevStatuses,
          ...newStatuses
        }));
      })
      .on('presence', { event: 'join' }, ({ key, newPresences }) => {
        // Handle user joining
        if (newPresences && newPresences[0]?.user_id && newPresences[0]?.status) {
          const { user_id, status } = newPresences[0];
          setUserStatuses(prevStatuses => ({
            ...prevStatuses,
            [user_id]: status as 'online' | 'offline' | 'busy' | 'brb'
          }));
        }
      })
      .on('presence', { event: 'leave' }, ({ key, leftPresences }) => {
        // Handle user leaving
        if (leftPresences && leftPresences[0]?.user_id) {
          const { user_id } = leftPresences[0];
          setUserStatuses(prevStatuses => ({
            ...prevStatuses,
            [user_id]: 'offline'
          }));
        }
      })
      .subscribe();
    
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);
  
  const setUserStatus = (userId: string, status: 'online' | 'offline' | 'busy' | 'brb') => {
    setUserStatuses(prevStatuses => ({
      ...prevStatuses,
      [userId]: status
    }));
  };
  
  const updateCurrentUserStatus = async (status: 'online' | 'offline' | 'busy' | 'brb') => {
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
        
        // Update presence
        const channel = supabase.channel('presence-channel');
        await channel.track({ user_id: userId, status });
      } catch (error) {
        console.error('Failed to update status:', error);
      }
    }
  };
  
  return (
    <PresenceContext.Provider value={{ userStatuses, setUserStatus, updateCurrentUserStatus }}>
      {children}
    </PresenceContext.Provider>
  );
};

export const useGlobalPresence = () => useContext(PresenceContext);