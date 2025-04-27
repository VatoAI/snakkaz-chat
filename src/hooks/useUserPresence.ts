
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { UserPresence, UserStatus } from "@/types/presence";
import { useToast } from "@/hooks/use-toast";

export const useUserPresence = (userId: string | null) => {
  const [userPresence, setUserPresence] = useState<Record<string, UserPresence>>({});
  const [currentStatus, setCurrentStatus] = useState<UserStatus>('online');
  const { toast } = useToast();
  
  useEffect(() => {
    if (!userId) return;
    
    // Initial fetch of user presence
    const fetchPresence = async () => {
      try {
        const { data, error } = await supabase
          .from('user_presence')
          .select('*');
          
        if (error) {
          throw error;
        }
        
        // Transform to Record<userId, UserPresence>
        const presenceMap: Record<string, UserPresence> = {};
        data.forEach((presence) => {
          presenceMap[presence.user_id] = {
            id: presence.id,
            user_id: presence.user_id,
            status: presence.status,
            last_seen: presence.last_seen
          };
          
          if (presence.user_id === userId) {
            setCurrentStatus(presence.status);
          }
        });
        
        setUserPresence(presenceMap);
      } catch (error) {
        console.error("Error fetching user presence:", error);
      }
    };
    
    fetchPresence();
    
    // Subscribe to presence changes
    const presenceSubscription = supabase
      .channel('public:user_presence')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'user_presence' },
        (payload) => {
          const { eventType, new: newRecord, old: oldRecord } = payload;
          
          if (eventType === 'INSERT' || eventType === 'UPDATE') {
            setUserPresence((prev) => ({
              ...prev,
              [newRecord.user_id]: {
                id: newRecord.id,
                user_id: newRecord.user_id,
                status: newRecord.status,
                last_seen: newRecord.last_seen
              }
            }));
            
            if (newRecord.user_id === userId) {
              setCurrentStatus(newRecord.status);
            }
          } else if (eventType === 'DELETE') {
            setUserPresence((prev) => {
              const updated = { ...prev };
              delete updated[oldRecord.user_id];
              return updated;
            });
          }
        }
      )
      .subscribe();
      
    // Update user's own presence
    const updateUserPresence = async () => {
      if (!userId) return;
      
      try {
        const { data, error } = await supabase
          .from('user_presence')
          .upsert({ 
            user_id: userId, 
            status: 'online', 
            last_seen: new Date().toISOString() 
          })
          .select()
          .single();
        
        if (error) {
          throw error;
        }
        
        setCurrentStatus(data.status);
      } catch (error) {
        console.error("Error updating user presence:", error);
      }
    };
    
    // Update presence on load
    updateUserPresence();
    
    // Set up interval to update presence
    const interval = setInterval(updateUserPresence, 30000);
    
    // Clean up on unmount
    return () => {
      clearInterval(interval);
      presenceSubscription.unsubscribe();
    };
  }, [userId]);
  
  const handleStatusChange = async (status: UserStatus) => {
    if (!userId) return;
    
    try {
      const { error } = await supabase
        .from('user_presence')
        .upsert({ 
          user_id: userId, 
          status, 
          last_seen: new Date().toISOString() 
        });
      
      if (error) {
        throw error;
      }
      
      setCurrentStatus(status);
    } catch (error) {
      console.error("Error updating user status:", error);
      toast({
        title: "Kunne ikke oppdatere status",
        description: "Det oppstod en feil ved oppdatering av din status",
        variant: "destructive"
      });
    }
  };
  
  return { userPresence, currentStatus, handleStatusChange };
};
