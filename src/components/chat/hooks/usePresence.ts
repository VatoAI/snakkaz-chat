import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { UserStatus, isValidStatus, getDefaultStatus } from '@/types/presence';

export const usePresence = (userId: string | null) => {
  const [userStatus, setUserStatus] = useState<UserStatus>(getDefaultStatus());
  const [lastActive, setLastActive] = useState<string | null>(null);
  
  // Update user presence
  useEffect(() => {
    if (!userId) return;
    
    // Initial status setup
    const updateStatus = async () => {
      try {
        const status = getDefaultStatus();
        
        await supabase
          .from('user_presence')
          .upsert({
            user_id: userId,
            status,
            last_seen: new Date().toISOString(),
          }, { onConflict: 'user_id' });
          
        setUserStatus(status);
      } catch (error) {
        console.error('Error updating presence:', error);
      }
    };
    
    updateStatus();
    
    // Set up interval to update presence
    const interval = setInterval(updateStatus, 30000); // Update every 30 seconds
    
    // Subscribe to presence changes
    const channel = supabase.channel(`presence:${userId}`);
    
    channel
      .on('presence', { event: 'sync' }, () => {
        // Handle presence sync
      })
      .on('presence', { event: 'join' }, ({ key, newPresences }) => {
        // Handle user joining
      })
      .on('presence', { event: 'leave' }, ({ key, leftPresences }) => {
        // Handle user leaving
      })
      .subscribe(async (status) => {
        if (status !== 'SUBSCRIBED') return;
        
        try {
          await channel.track({
            user_id: userId,
            online: true,
            last_active: new Date().toISOString(),
          });
        } catch (error) {
          console.error('Error tracking presence:', error);
        }
      });
      
    return () => {
      clearInterval(interval);
      channel.unsubscribe();
    };
  }, [userId]);
  
  // Update status
  const updateStatus = async (newStatus: UserStatus) => {
    if (!userId) return;
    
    if (!isValidStatus(newStatus)) {
      console.error('Invalid status:', newStatus);
      return;
    }
    
    try {
      await supabase
        .from('user_presence')
        .upsert({
          user_id: userId,
          status: newStatus,
          last_seen: new Date().toISOString(),
        }, { onConflict: 'user_id' });
        
      setUserStatus(newStatus);
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };
  
  return {
    userStatus,
    updateStatus,
    lastActive,
  };
};
