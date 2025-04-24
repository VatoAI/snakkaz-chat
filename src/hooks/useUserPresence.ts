
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export type UserStatus = 'online' | 'offline' | 'away' | 'busy';

interface PresenceState {
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
        const newState = channel.presenceState<PresenceState>();
        setPresence(newState);
      })
      .on('presence', { event: 'join' }, ({ key, newPresences }) => {
        setPresence(prev => ({
          ...prev,
          [key]: newPresences[0]
        }));
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
            status: 'online',
            lastSeen: new Date().toISOString()
          });
        }
      });

    const interval = setInterval(async () => {
      try {
        await channel.track({
          status: 'online',
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
      const { error } = await supabase
        .from('user_presence')
        .upsert({
          user_id: userId,
          status,
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
