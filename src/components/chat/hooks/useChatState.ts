
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { UserStatus } from '@/types/presence';

export function useChatState(userId: string | null) {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userStatus, setUserStatus] = useState<Record<string, UserStatus>>({});
  
  useEffect(() => {
    if (!userId) return;
    
    setIsLoading(true);
    setError(null);
    
    // Get initial user statuses
    const fetchUserStatus = async () => {
      try {
        const { data, error } = await supabase
          .from('user_presence')
          .select('user_id, status, last_seen')
          .order('last_seen', { ascending: false });
          
        if (error) throw error;
        
        const statusMap: Record<string, UserStatus> = {};
        data.forEach(item => {
          if (typeof item.status === 'string' && ['online', 'offline', 'away', 'busy', 'brb'].includes(item.status)) {
            statusMap[item.user_id] = item.status as UserStatus;
          } else {
            statusMap[item.user_id] = 'offline';
          }
        });
        
        setUserStatus(statusMap);
      } catch (err) {
        console.error('Error fetching user status:', err);
        setError('Kunne ikke laste inn brukerstatuser');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchUserStatus();
    
    // Subscribe to status changes
    const statusSubscription = supabase
      .channel('user_presence_changes')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'user_presence' 
      }, (payload) => {
        if (payload.new) {
          const { user_id, status } = payload.new;
          
          if (typeof status === 'string' && ['online', 'offline', 'away', 'busy', 'brb'].includes(status)) {
            setUserStatus(prev => ({
              ...prev,
              [user_id]: status as UserStatus
            }));
          }
        }
      })
      .subscribe();
      
    return () => {
      statusSubscription.unsubscribe();
    };
  }, [userId]);
  
  return {
    isLoading,
    error,
    userStatus,
  };
}
