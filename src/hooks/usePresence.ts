import { useEffect, useState, useCallback, useRef } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { UserStatus } from '@/types/presence';

export const usePresence = (
  userId: string | null,
  initialStatus: UserStatus = 'online',
  onPresenceChange?: (presence: Record<string, any>) => void,
  hidden: boolean = false
) => {
  const [currentStatus, setCurrentStatus] = useState<UserStatus>(initialStatus);
  const [userPresence, setUserPresence] = useState<Record<string, any>>({});
  const [isConnected, setIsConnected] = useState(true);
  const heartbeatInterval = useRef<NodeJS.Timeout | null>(null);
  const reconnectTimeout = useRef<NodeJS.Timeout | null>(null);
  const channelRef = useRef<any>(null);

  // Håndterer statusendringer
  const handleStatusChange = useCallback(async (newStatus: UserStatus) => {
    if (!userId || hidden) return;

    try {
      // Sikrer at statusen er en av de tillatte verdiene
      const validStatus: UserStatus =
        ['online', 'busy', 'brb', 'offline'].includes(newStatus as UserStatus)
          ? newStatus
          : 'online';

      const { error } = await supabase
        .from('user_presence')
        .upsert({
          user_id: userId,
          status: validStatus,
          last_seen: new Date().toISOString(),
          client_info: {
            browser: navigator.userAgent,
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
            window_width: window.innerWidth,
            is_mobile: window.innerWidth < 768
          }
        }, {
          onConflict: 'user_id'
        });

      if (error) throw error;

      setCurrentStatus(validStatus);
      setIsConnected(true);
    } catch (error) {
      console.error("Error updating status:", error);
      setIsConnected(false);

      // Forsøk å koble til på nytt
      scheduleReconnect();
    }
  }, [userId, hidden]);

  // Funksjon for å planlegge en ny tilkoblingsforsøk
  const scheduleReconnect = useCallback(() => {
    if (reconnectTimeout.current) {
      clearTimeout(reconnectTimeout.current);
    }

    reconnectTimeout.current = setTimeout(() => {
      handleStatusChange(currentStatus);
      setupRealtimeSubscription();
    }, 5000); // Prøv på nytt etter 5 sekunder
  }, [currentStatus, handleStatusChange]);

  // Henter all tilstedeværelsesdata
  const fetchAllPresence = useCallback(async () => {
    if (!userId) return;

    try {
      const { data: presenceData, error } = await supabase
        .from('user_presence')
        .select('*')
        .gt('last_seen', new Date(Date.now() - 5 * 60 * 1000).toISOString()); // Bare hent aktive brukere fra de siste 5 minuttene

      if (error) throw error;

      if (presenceData) {
        const presenceMap = presenceData.reduce((acc, presence) => ({
          ...acc,
          [presence.user_id]: presence
        }), {});

        setUserPresence(presenceMap);
        if (onPresenceChange) onPresenceChange(presenceMap);
      }
      setIsConnected(true);
    } catch (error) {
      console.error("Error fetching presence data:", error);
      setIsConnected(false);
      scheduleReconnect();
    }
  }, [userId, onPresenceChange, scheduleReconnect]);

  // Sett opp sanntidsabonnement
  const setupRealtimeSubscription = useCallback(() => {
    if (!userId || channelRef.current) return;

    try {
      // Oppsett av sanntidsabonnement
      const channel = supabase
        .channel('presence-changes')
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'user_presence' },
          (payload) => {
            console.log('Presence change detected:', payload);
            fetchAllPresence();
          }
        )
        .subscribe((status: string) => {
          console.log(`Realtime subscription status: ${status}`);
          if (status === 'SUBSCRIBED') {
            setIsConnected(true);
          } else if (status === 'CHANNEL_ERROR' || status === 'TIMED_OUT') {
            setIsConnected(false);
            scheduleReconnect();
          }
        });

      channelRef.current = channel;
    } catch (error) {
      console.error("Error setting up realtime subscription:", error);
      setIsConnected(false);
      scheduleReconnect();
    }
  }, [userId, fetchAllPresence, scheduleReconnect]);

  // Sett opp sanntidsabonnement og heartbeat
  useEffect(() => {
    if (!userId) return;

    // Opprinnelig henting av tilstedeværelse
    fetchAllPresence();

    // Sett opp sanntidsabonnement
    setupRealtimeSubscription();

    // Sett opp heartbeat
    if (!hidden && !heartbeatInterval.current) {
      // Umiddelbar første status oppdatering
      handleStatusChange(currentStatus);

      heartbeatInterval.current = setInterval(() => {
        handleStatusChange(currentStatus);
      }, 20000); // Hvert 20. sekund
    }

    // Oppdater status når fanen får fokus igjen
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        handleStatusChange('online');
        fetchAllPresence();
      } else {
        handleStatusChange('brb');
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Ryddeopp
    return () => {
      if (heartbeatInterval.current) {
        clearInterval(heartbeatInterval.current);
        heartbeatInterval.current = null;
      }

      if (reconnectTimeout.current) {
        clearTimeout(reconnectTimeout.current);
        reconnectTimeout.current = null;
      }

      document.removeEventListener('visibilitychange', handleVisibilityChange);

      // Fjern kanalen
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
        channelRef.current = null;
      }

      // Rydd opp tilstedeværelse ved avmontering hvis ikke skjult
      if (!hidden) {
        supabase
          .from('user_presence')
          .update({ status: 'offline', last_seen: new Date().toISOString() })
          .eq('user_id', userId)
          .then(({ error }) => {
            if (error) {
              console.error("Error updating presence to offline:", error);
            }
          });
      }
    };
  }, [userId, currentStatus, hidden, handleStatusChange, fetchAllPresence, setupRealtimeSubscription]);

  return {
    currentStatus,
    handleStatusChange,
    userPresence,
    isConnected
  };
};
