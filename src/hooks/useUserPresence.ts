
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { UserStatus } from '@/types/presence';
import { useToast } from '@/hooks/use-toast';

export type PresenceState = {
  status: UserStatus;
  lastSeen: string;
}

export const useUserPresence = (userId: string | null) => {
  const [presence, setPresence] = useState<Record<string, PresenceState>>({});
  const { toast } = useToast();

  useEffect(() => {
    if (!userId) return;

    const channel = supabase.channel('online-users')
      .on('presence', { event: 'sync' }, () => {
        const state = channel.presenceState<PresenceState>();
        const typedState: Record<string, PresenceState> = {};
        
        // Convert to properly typed state
        Object.keys(state).forEach(key => {
          if (Array.isArray(state[key]) && state[key].length > 0) {
            typedState[key] = {
              status: state[key][0].status,
              lastSeen: state[key][0].lastSeen
            };
          }
        });
        
        setPresence(typedState);
      })
      .on('presence', { event: 'join' }, ({ key, newPresences }) => {
        if (newPresences.length > 0) {
          setPresence(prev => ({
            ...prev,
            [key]: {
              status: newPresences[0].status,
              lastSeen: newPresences[0].lastSeen
            }
          }));
        }
      })
      .on('presence', { event: 'leave' }, ({ key }) => {
        setPresence(prev => {
          const newState = { ...prev };
          delete newState[key];
          return newState;
        });
      })
      .subscribe(async (status) => {
        if (status === 'SUBSCRIBED') {
          await channel.track({
            status: 'online' as UserStatus,
            lastSeen: new Date().toISOString()
          });
        }
      });

    const interval = setInterval(async () => {
      try {
        await channel.track({
          status: 'online' as UserStatus,
          lastSeen: new Date().toISOString()
        });
      } catch (error) {
        console.error('Error updating presence:', error);
      }
    }, 30000);

    return () => {
      clearInterval(interval);
      channel.unsubscribe();
    };
  }, [userId]);

  const updateStatus = async (status: UserStatus) => {
    try {
      // Ensure status is a valid value
      const validStatus: UserStatus = 
        ['online', 'offline', 'busy', 'brb'].includes(status) 
          ? status as UserStatus 
          : 'online';
          
      const { error } = await supabase
        .from('user_presence')
        .upsert({
          user_id: userId,
          status: validStatus,
          last_seen: new Date().toISOString()
        });

      if (error) throw error;
    } catch (error) {
      console.error('Error updating status:', error);
      toast({
        title: "Error",
        description: "Failed to update status",
        variant: "destructive"
      });
    }
  };

  return {
    presence,
    updateStatus,
    isOnline: (uid: string) => !!presence[uid]
  };
};
