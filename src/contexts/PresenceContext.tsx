import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { UserStatus } from '@/types/presence';

interface PresenceContextType {
  currentStatus: UserStatus;
  setCurrentStatus: (status: UserStatus) => Promise<void>;
  isRefreshing: boolean;
  lastUpdated: Date;
  refresh: () => Promise<void>;
  userStatuses: Record<string, UserStatus>;
}

const PresenceContext = createContext<PresenceContextType | undefined>(undefined);

export const PresenceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentStatus, setStatus] = useState<UserStatus>('online');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [userStatuses, setUserStatuses] = useState<Record<string, UserStatus>>({});

  // Update status in database and local state
  const setCurrentStatus = async (status: UserStatus) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;
      
      const userId = session.user.id;
      
      // Update presence in database
      await supabase
        .from('presence')
        .upsert({
          user_id: userId,
          status,
          last_seen: new Date().toISOString(),
        });
      
      // Update local state
      setStatus(status);
      setUserStatuses(prev => ({
        ...prev,
        [userId]: status
      }));
      
      // Broadcast status change event
      document.dispatchEvent(new CustomEvent('status-updated', {
        detail: { userId, status }
      }));
      
      setLastUpdated(new Date());
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  // Refresh status data
  const refresh = async () => {
    try {
      setIsRefreshing(true);
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;
      
      // Fetch all presence data
      const { data: presenceData } = await supabase
        .from('presence')
        .select('user_id, status, last_seen')
        .order('last_seen', { ascending: false });
      
      if (presenceData) {
        const statusMap: Record<string, UserStatus> = {};
        presenceData.forEach(presence => {
          statusMap[presence.user_id] = presence.status as UserStatus;
        });
        
        setUserStatuses(statusMap);
      }
      
      setLastUpdated(new Date());
    } catch (error) {
      console.error('Error refreshing status data:', error);
    } finally {
      setIsRefreshing(false);
    }
  };
  
  // Initialize user status on mount
  useEffect(() => {
    const initializeStatus = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;
      
      // Try to get existing status
      const { data } = await supabase
        .from('presence')
        .select('status')
        .eq('user_id', session.user.id)
        .single();
      
      if (data) {
        setStatus(data.status as UserStatus);
      } else {
        // Set default status if none exists
        await setCurrentStatus('online');
      }
      
      // Get status of all users
      await refresh();
    };

    initializeStatus();
    
    // Set up subscription to presence changes
    const presenceSubscription = supabase
      .channel('presence-changes')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'presence' 
      }, payload => {
        if (payload.new) {
          const { user_id, status } = payload.new as any;
          setUserStatuses(prev => ({
            ...prev,
            [user_id]: status as UserStatus
          }));
        }
      })
      .subscribe();
      
    // Clean up subscription
    return () => {
      supabase.removeChannel(presenceSubscription);
    };
  }, []);

  // Set to offline when user leaves the site
  useEffect(() => {
    const handleBeforeUnload = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        await supabase
          .from('presence')
          .upsert({
            user_id: session.user.id,
            status: 'offline',
            last_seen: new Date().toISOString(),
          });
      }
    };
    
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  return (
    <PresenceContext.Provider value={{
      currentStatus,
      setCurrentStatus,
      isRefreshing,
      lastUpdated,
      refresh,
      userStatuses
    }}>
      {children}
    </PresenceContext.Provider>
  );
};

// Hook to use presence context
export const useGlobalPresence = () => {
  const context = useContext(PresenceContext);
  if (context === undefined) {
    throw new Error('useGlobalPresence must be used within a PresenceProvider');
  }
  return context;
};