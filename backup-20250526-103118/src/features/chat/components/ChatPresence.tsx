
import { useEffect, useRef } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { UserPresence, UserStatus } from '@/types/presence';
import { useToast } from '@/components/ui/use-toast';

interface ChatPresenceProps {
  userId: string | null;
  setUserPresence: (updater: React.SetStateAction<Record<string, UserPresence>>) => void;
  currentStatus: UserStatus;
  hidden: boolean;
}

export const ChatPresence = ({
  userId,
  setUserPresence,
  currentStatus,
  hidden
}: ChatPresenceProps) => {
  const { toast } = useToast();
  const presenceChannel = useRef<any>(null);
  const heartbeatInterval = useRef<NodeJS.Timeout | null>(null);

  // Setup presence channel and heartbeat
  useEffect(() => {
    if (!userId) return;

    const setupPresence = async () => {
      // Clear any existing subscription
      if (presenceChannel.current) {
        supabase.removeChannel(presenceChannel.current);
      }
      
      // Clear any existing heartbeat
      if (heartbeatInterval.current) {
        clearInterval(heartbeatInterval.current);
        heartbeatInterval.current = null;
      }
      
      // Handle initial presence state
      if (!hidden) {
        try {
          // Ensure valid status
          const validStatus: UserStatus = 
            ['online', 'busy', 'brb', 'offline'].includes(currentStatus) 
              ? currentStatus 
              : 'online';
          
          const { error } = await supabase
            .from('user_presence')
            .upsert({
              user_id: userId,
              status: validStatus,
              last_seen: new Date().toISOString()
            }, { 
              onConflict: 'user_id'
            });

          if (error) {
            console.error("Error setting initial presence:", error);
          }
        } catch (err) {
          console.error("Failed to set initial presence:", err);
        }
      } else {
        // Delete user's presence if they want to be hidden
        try {
          const { error } = await supabase
            .from('user_presence')
            .delete()
            .eq('user_id', userId);
            
          if (error && error.code !== 'PGRST116') { // Ignore not found error
            console.error("Error deleting presence:", error);
          }
        } catch (err) {
          console.error("Failed to delete presence:", err);
        }
      }

      // Start new presence subscription
      presenceChannel.current = supabase
        .channel('presence-changes')
        .on('postgres_changes', 
          { 
            event: '*', 
            schema: 'public', 
            table: 'user_presence'
          }, 
          async () => {
            try {
              // When we detect changes, fetch all presence data again
              const { data: presenceData, error } = await supabase
                .from('user_presence')
                .select('*');

              if (error) {
                console.error("Error fetching presence data:", error);
                return;
              }

              if (presenceData) {
                const presenceMap = presenceData.reduce((acc, presence) => ({
                  ...acc,
                  [presence.user_id]: presence as UserPresence
                }), {} as Record<string, UserPresence>);
                
                setUserPresence(presenceMap);
              }
            } catch (err) {
              console.error("Error processing presence change:", err);
            }
          }
        )
        .subscribe();

      // Fetch presence data immediately at startup
      try {
        const { data: initialPresenceData, error: initialError } = await supabase
          .from('user_presence')
          .select('*');
          
        if (initialError) {
          console.error("Error fetching initial presence data:", initialError);
        } else if (initialPresenceData) {
          const presenceMap = initialPresenceData.reduce((acc, presence) => ({
            ...acc,
            [presence.user_id]: presence as UserPresence
          }), {} as Record<string, UserPresence>);
          
          setUserPresence(presenceMap);
        }
      } catch (err) {
        console.error("Error fetching initial presence data:", err);
      }

      // Setup heartbeat for presence updates
      if (!hidden) {
        heartbeatInterval.current = setInterval(async () => {
          try {
            const { error } = await supabase
              .from('user_presence')
              .upsert({
                user_id: userId,
                status: currentStatus,
                last_seen: new Date().toISOString()
              }, { 
                onConflict: 'user_id'
              });
              
            if (error) {
              console.error("Error updating presence heartbeat:", error);
            }
          } catch (err) {
            console.error("Failed to update presence heartbeat:", err);
          }
        }, 30000); // 30 seconds
      }
    };

    setupPresence();

    // Cleanup
    return () => {
      if (presenceChannel.current) {
        supabase.removeChannel(presenceChannel.current);
      }
      
      if (heartbeatInterval.current) {
        clearInterval(heartbeatInterval.current);
      }
      
      // Clean up presence on component unmount if not hidden
      if (userId && !hidden) {
        supabase
          .from('user_presence')
          .update({ status: 'offline', last_seen: new Date().toISOString() })
          .eq('user_id', userId)
          .then(({ error }) => {
            if (error) {
              console.error("Error setting offline status:", error);
            }
          });
      }
    };
  }, [userId, currentStatus, hidden, setUserPresence]);

  return null; // This is a utility component, no UI
};
