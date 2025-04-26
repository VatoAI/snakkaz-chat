import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { UserStatus } from '@/types/presence';

type PresenceContextType = {
  userStatus: UserStatus;
  setUserStatus: (status: UserStatus) => Promise<void>;
  userStatuses: Record<string, UserStatus>;
};

const PresenceContext = createContext<PresenceContextType>({
  userStatus: 'offline',
  setUserStatus: async () => {},
  userStatuses: {},
});

export const useGlobalPresence = () => useContext(PresenceContext);

interface PresenceProviderProps {
  children: ReactNode;
  userId?: string | null;
}

export const PresenceProvider = ({ children, userId }: PresenceProviderProps) => {
  const [userStatus, setStatus] = useState<UserStatus>('offline');
  const [userStatuses, setUserStatuses] = useState<Record<string, UserStatus>>({});

  // Update the user's status in the database
  const setUserStatus = async (status: UserStatus) => {
    if (!userId) return;

    try {
      // Update the status in the database
      const { error } = await supabase
        .from('user_presence')
        .upsert({ 
          user_id: userId, 
          status,
          last_seen: new Date().toISOString()
        });

      if (error) throw error;
      setStatus(status);
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  // Fetch initial statuses and subscribe to changes
  useEffect(() => {
    if (!userId) return;

    // Set initial status when user logs in
    setUserStatus('online');

    // Fetch all user statuses for initial state
    const fetchUserStatuses = async () => {
      try {
        const { data, error } = await supabase
          .from('user_presence')
          .select('user_id, status');

        if (error) throw error;

        const statuses: Record<string, UserStatus> = {};
        data.forEach(item => {
          statuses[item.user_id] = item.status as UserStatus;
        });
        setUserStatuses(statuses);
      } catch (error) {
        console.error('Error fetching user statuses:', error);
      }
    };

    fetchUserStatuses();

    // Subscribe to changes in the user_presence table
    const presenceChannel = supabase
      .channel('global-presence-changes')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public',
          table: 'user_presence' 
        },
        (payload) => {
          // Update the local state when presence changes
          setUserStatuses(prev => ({
            ...prev,
            [payload.new.user_id]: payload.new.status as UserStatus
          }));
        }
      )
      .subscribe();

    // Set up interval for automatic status refresh
    const refreshInterval = setInterval(() => {
      // Update last_seen timestamp while user is online
      if (userStatus !== 'offline') {
        supabase
          .from('user_presence')
          .update({ last_seen: new Date().toISOString() })
          .eq('user_id', userId)
          .then(() => {})
          .catch(error => console.error('Error updating last seen:', error));
      }
    }, 60000); // Every minute

    // Set offline status when component unmounts
    return () => {
      clearInterval(refreshInterval);
      supabase.removeChannel(presenceChannel);
      
      // Set status to offline when user logs out
      if (userId) {
        supabase
          .from('user_presence')
          .update({ status: 'offline', last_seen: new Date().toISOString() })
          .eq('user_id', userId)
          .then(() => {})
          .catch(error => console.error('Error updating status to offline:', error));
      }
    };
  }, [userId, userStatus]);

  return (
    <PresenceContext.Provider value={{ userStatus, setUserStatus, userStatuses }}>
      {children}
    </PresenceContext.Provider>
  );
};