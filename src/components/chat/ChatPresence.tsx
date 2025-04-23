
import { useEffect } from 'react';
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

  useEffect(() => {
    if (!userId) return;

    const setupPresence = async () => {
      // Skip updating presence if user is hidden
      if (!hidden) {
        // Ensure valid status
        const validStatus: 'online' | 'busy' | 'brb' | 'offline' = 
          ['online', 'busy', 'brb', 'offline'].includes(currentStatus) 
            ? currentStatus 
            : 'online';
        
        const { error: upsertError } = await supabase
          .from('user_presence')
          .upsert({
            id: undefined, // let Supabase generate
            user_id: userId,
            status: validStatus,
            last_seen: new Date().toISOString()
          }, { 
            onConflict: 'user_id',
            defaultToNull: false 
          });

        if (upsertError) {
          console.error("Error setting initial presence:", upsertError);
        }
      } else {
        // Delete user's presence if they want to be hidden
        const { error: deleteError } = await supabase
          .from('user_presence')
          .delete()
          .eq('user_id', userId);
          
        if (deleteError && deleteError.code !== 'PGRST116') { // Ignore not found error
          console.error("Error deleting presence:", deleteError);
        }
      }

      // Set up listening for presence changes
      const channel = supabase
        .channel('presence-changes')
        .on('postgres_changes', 
          { 
            event: '*', 
            schema: 'public', 
            table: 'user_presence'
          }, 
          async () => {
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
                [presence.user_id]: presence
              }), {});
              setUserPresence(presenceMap);
            }
          }
        )
        .subscribe();

      // Fetch presence data immediately at startup
      const { data: initialPresenceData, error: initialError } = await supabase
        .from('user_presence')
        .select('*');
        
      if (initialError) {
        console.error("Error fetching initial presence data:", initialError);
      } else if (initialPresenceData) {
        const presenceMap = initialPresenceData.reduce((acc, presence) => ({
          ...acc,
          [presence.user_id]: presence
        }), {});
        setUserPresence(presenceMap);
      }

      return () => {
        supabase.removeChannel(channel);
      };
    };

    const cleanup = setupPresence();
    return () => {
      cleanup.then(cleanupFn => cleanupFn?.());
    };
  }, [userId, currentStatus, hidden, setUserPresence]);

  return null;
};
