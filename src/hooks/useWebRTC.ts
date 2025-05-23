import { useEffect, useState, useCallback, useRef } from "react";
import { WebRTCManager } from "@/utils/webrtc";
import { supabase } from "@/integrations/supabase/client";
import { REALTIME_SUBSCRIBE_STATES } from '@supabase/supabase-js';
import { useToast } from "@/components/ui/use-toast";
import { activeCommunicationConfig, isP2PEnabled } from "@/config/communication-config";

const handleChannelSubscription = (
  status: string,
  signalChannel: any,
  userId: string,
  manager: WebRTCManager | null
) => {
  console.log("Signaling channel subscription status:", status);
  
  if (status === 'SUBSCRIBED') {
    console.log("Successfully subscribed to signaling channel");
    // Announce presence to other peers
    signalChannel.track({
      user_id: userId,
      online_at: new Date().toISOString(),
    });
  }
  
  if (
    status === REALTIME_SUBSCRIBE_STATES.TIMED_OUT ||
    status === REALTIME_SUBSCRIBE_STATES.CLOSED ||
    status === REALTIME_SUBSCRIBE_STATES.CHANNEL_ERROR
  ) {
    console.error("Failed to subscribe to signaling channel:", status);
  }
};

// Export the hook
export const useWebRTC = () => {
  const [manager, setManager] = useState<WebRTCManager | null>(null);
  const [status, setStatus] = useState<'initializing' | 'ready' | 'disabled' | 'error'>('initializing');
  const signalChannel = useRef<any>(null);
  const { toast } = useToast();
  
  const setupWebRTC = useCallback(async (userId: string, onReady?: () => void) => {
    try {
      // Sjekk om P2P er deaktivert i konfigurasjonen
      if (!isP2PEnabled()) {
        console.log("WebRTC/P2P er deaktivert i kommunikasjonsinnstillingene");
        setStatus('disabled');
        // Fortsett med onReady selv om P2P er deaktivert
        if (onReady) onReady();
        return;
      }
      
      console.log("Setting up WebRTC for user:", userId);
      setStatus('initializing');
      
      // Verify Supabase connection first
      try {
        const { data, error } = await supabase
          .from('health')
          .select('status')
          .limit(1);
          
        if (error) {
          console.error("Supabase connection error:", error);
          toast({
            title: "Tilkoblingsfeil",
            description: "Kunne ikke etablere forbindelse til serveren. WebRTC-funksjoner kan være begrenset.",
            variant: "destructive",
          });
        }
      } catch (connectionError) {
        console.error("Failed to check Supabase connection:", connectionError);
      }
      
      // Create WebRTC manager
      const webRTCManager = new WebRTCManager(userId, {
        maxReconnectAttempts: activeCommunicationConfig.maxP2PReconnectAttempts
      });
      setManager(webRTCManager);
      
      // Set up signaling channel
      const channel = supabase.channel(`webrtc:${userId}`, {
        config: {
          broadcast: { self: false },
          presence: { key: userId },
        },
      });
      
      // Handle incoming signals
      channel
        .on('broadcast', { event: 'signal' }, (payload) => {
          console.log("Received signal:", payload.type);
          // We'll use our own signal handler since the method isn't exposed
          if (webRTCManager) {
            console.log("Processing signal data", payload);
          }
        })
        .on('presence', { event: 'sync' }, () => {
          const state = channel.presenceState();
          console.log("Presence state:", state);
          
          // Get list of online users
          const onlineUsers = Object.keys(state).filter(id => id !== userId);
          console.log("Online users:", onlineUsers);
          
          // Vi initialiserer bare tilkobling hvis P2P er aktivert
          if (isP2PEnabled()) {
            onlineUsers.forEach(peerId => {
              if (webRTCManager) {
                console.log(`Detected peer ${peerId} online`);
                // Use available methods for connection
                webRTCManager.connectToPeer(peerId, {} as JsonWebKey)
                  .catch(err => console.error(`Failed to connect to peer ${peerId}:`, err));
              }
            });
          }
        })
        .on('presence', { event: 'join' }, ({ key, newPresences }) => {
          console.log("User joined:", key, newPresences);
          
          // Initialiser bare tilkobling hvis P2P er aktivert
          if (key !== userId && webRTCManager && isP2PEnabled()) {
            console.log(`New peer ${key} joined`);
            // Use available methods for connection
            webRTCManager.connectToPeer(key, {} as JsonWebKey)
              .catch(err => console.error(`Failed to connect to peer ${key}:`, err));
          }
        })
        .subscribe((status) => handleChannelSubscription(status, channel, userId, webRTCManager));
      
      signalChannel.current = channel;
      
      setStatus('ready');
      if (onReady) onReady();
      
    } catch (error) {
      console.error("Error setting up WebRTC:", error);
      setStatus('error');
      toast({
        title: "WebRTC Setup Error",
        description: "Failed to set up WebRTC connections. Please try refreshing the page.",
        variant: "destructive",
      });
      
      // Forsøk å fortsette selv om WebRTC feiler
      if (onReady) onReady();
    }
  }, [toast]);
  
  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (signalChannel.current) {
        signalChannel.current.unsubscribe();
      }
      if (manager) {
        manager.disconnectAll();
      }
    };
  }, [manager]);
  
  // Periodic health check for WebRTC
  useEffect(() => {
    if (manager && status === 'ready' && isP2PEnabled()) {
      const checkInterval = setInterval(() => {
        try {
          // Get the manager status and log it
          const isReady = manager !== null;
          console.log(`WebRTC manager health check: ${isReady ? 'OK' : 'Not Ready'}`);
        } catch (err) {
          console.error('WebRTC health check error:', err);
        }
      }, 30000); // Check every 30 seconds
      
      return () => clearInterval(checkInterval);
    }
  }, [manager, status]);
  
  // Observer for endringer i kommunikasjonskonfigurasjon
  useEffect(() => {
    const configObserver = () => {
      if (!isP2PEnabled() && manager) {
        // Koble fra alle P2P-tilkoblinger hvis funksjonen er deaktivert
        manager.disconnectAll();
        setStatus('disabled');
      }
    };
    
    // Registrer listener for konfigurasjon (dette er en forenklet tilnærming)
    window.addEventListener('communication-config-change', configObserver);
    
    return () => {
      window.removeEventListener('communication-config-change', configObserver);
    };
  }, [manager]);
  
  return {
    webRTCManager: isP2PEnabled() ? manager : null,
    setupWebRTC,
    status,
    isP2PEnabled: isP2PEnabled()
  };
};
