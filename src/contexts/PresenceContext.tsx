import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

// Types for our context
type PresenceContextType = {
  userStatuses: Record<string, string>;
  updateUserStatus: (userId: string, status: string) => void;
};

// Create the context with default values
const PresenceContext = createContext<PresenceContextType>({
  userStatuses: {},
  updateUserStatus: () => {},
});

// Custom hook to use the presence context
export const useGlobalPresence = () => useContext(PresenceContext);

export const PresenceProvider: React.FC<{
  children: React.ReactNode;
  userId?: string | null;
}> = ({ children, userId }) => {
  // Track all user statuses in the system
  const [userStatuses, setUserStatuses] = useState<Record<string, string>>({});

  // Update a single user's status
  const updateUserStatus = (userId: string, status: string) => {
    setUserStatuses((prev) => ({
      ...prev,
      [userId]: status,
    }));
  };

  // Initialize presence tracking
  useEffect(() => {
    if (!userId) return;

    // Initial fetch of all online users
    const fetchOnlineUsers = async () => {
      try {
        const { data, error } = await supabase
          .from('user_presence')
          .select('user_id, status')
          .not('status', 'eq', 'offline');

        if (error) throw error;

        if (data) {
          const statusMap: Record<string, string> = {};
          data.forEach((presence) => {
            statusMap[presence.user_id] = presence.status;
          });
          setUserStatuses(statusMap);
        }
      } catch (error) {
        console.error('Error fetching online users:', error);
      }
    };

    fetchOnlineUsers();

    // Subscribe to all presence changes
    const presenceChannel = supabase
      .channel('global-presence')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'user_presence' }, 
        (payload) => {
          const { new: newPresence } = payload;
          if (newPresence) {
            updateUserStatus(newPresence.user_id, newPresence.status);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(presenceChannel);
    };
  }, [userId]);

  return (
    <PresenceContext.Provider value={{ userStatuses, updateUserStatus }}>
      {children}
    </PresenceContext.Provider>
  );
};