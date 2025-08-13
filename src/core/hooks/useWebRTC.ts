import { useState, useEffect, useCallback, useRef } from "react";
import { PeerJSManager } from "@/utils/webrtc/peerjs-manager";
import { supabase } from "@/integrations/supabase/client";
import { REALTIME_SUBSCRIBE_STATES } from '@supabase/supabase-js';
import { useToast } from "@/components/ui/use-toast";
import { isP2PEnabled } from "@/config/communication-config";

export interface WebRTCConnectionStats {
  [peerId: string]: {
    connected: boolean;
    reliable: boolean;
    latency?: string;
    connectionType?: string;
    bytesReceived?: number;
    bytesSent?: number;
  };
}

export interface WebRTCHookResult {
  isConnected: boolean;
  peers: string[];
  connect: (peerId: string) => Promise<any>;
  sendToPeer: (peerId: string, data: any) => Promise<boolean>;
  broadcastToAllPeers: (data: any) => void;
  connectionStats: WebRTCConnectionStats;
  showMonitor: boolean;
  toggleMonitor: () => void;
  disconnect: (peerId: string) => void;
}

// Export the hook
export const useWebRTC = (userId?: string): WebRTCHookResult => {
  const [manager, setManager] = useState<PeerJSManager | null>(null);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [peers, setPeers] = useState<string[]>([]);
  const [connectionStats, setConnectionStats] = useState<WebRTCConnectionStats>({});
  const [showMonitor, setShowMonitor] = useState(false);
  const { toast } = useToast();
  
  // Initialize PeerJSManager when userId is available
  useEffect(() => {
    if (!userId || !isP2PEnabled()) {
      return;
    }
    
    try {
      console.log("Initializing PeerJS for user:", userId);
      
      // Create the PeerJSManager
      const peerManager = new PeerJSManager(userId, {
        debug: process.env.NODE_ENV === 'development' ? 3 : 0,
        config: {
          iceServers: [
            { urls: 'stun:stun.l.google.com:19302' },
            { 
              urls: 'turn:turn.snakkaz.com:3478',
              username: 'snakkaz', 
              credential: 'turnserver' 
            }
          ],
          sdpSemantics: 'unified-plan'
        }
      });
      
      // Listen for ready event
      peerManager.onReady((id: string) => {
        console.log(`SnakkaZ PeerJS initialized with ID: ${id}`);
        setIsConnected(true);
        
        // Track online users with presence
        setupPresence(userId);
      });
      
      // Set up data handler
      peerManager.onData(({ peerId, data }) => {
        console.log(`SnakkaZ PeerJS received data from ${peerId}:`, data);
        // Data handling will be done by the consumer hooks
      });
      
      // Set up connection state change handler
      peerManager.onConnectionStateChange = (peerId, state) => {
        console.log(`SnakkaZ PeerJS connection state changed for ${peerId}: ${state}`);
        
        // Update peer list when connections change
        const activePeers = peerManager.getPeerIds();
        setPeers(activePeers);
        
        // Update connection stats
        updateConnectionStats(peerManager);
      };
      
      // Save the manager
      setManager(peerManager);
      
      // Cleanup on unmount
      return () => {
        if (peerManager) {
          peerManager.cleanup();
        }
      };
    } catch (error) {
      console.error("Error initializing PeerJS:", error);
      toast({
        title: "WebRTC Setup Error",
        description: "Failed to initialize WebRTC connections. Please try refreshing the page.",
        variant: "destructive",
      });
    }
  }, [userId, toast]);
  
  // Set up presence channel for peer discovery
  const setupPresence = useCallback((currentUserId: string) => {
    const channel = supabase.channel(`presence:${currentUserId}`, {
      config: {
        broadcast: { self: false },
        presence: { key: currentUserId },
      },
    });
    
    channel
      .on('presence', { event: 'sync' }, () => {
        const state = channel.presenceState();
        console.log("Presence state:", state);
        
        // Get list of online users
        const onlineUsers = Object.keys(state).filter(id => id !== currentUserId);
        console.log("Online users:", onlineUsers);
        
        // Initialize connections to online peers if P2P is enabled
        if (isP2PEnabled() && manager) {
          onlineUsers.forEach(async (peerId) => {
            console.log(`Detected peer ${peerId} online`);
            try {
              await manager.connect(peerId);
            } catch (err) {
              console.error(`Failed to connect to peer ${peerId}:`, err);
            }
          });
        }
      })
      .on('presence', { event: 'join' }, ({ key }) => {
        if (key === currentUserId) return;
        
        console.log(`User ${key} joined`);
        
        // Try to connect to the new peer if P2P is enabled
        if (isP2PEnabled() && manager) {
          console.log(`Attempting connection to new peer ${key}`);
          manager.connect(key)
            .catch((err: Error) => console.error(`Failed to connect to peer ${key}:`, err));
        }
      })
      .subscribe((status) => {
        console.log("Presence channel subscription status:", status);
        
        if (status === 'SUBSCRIBED') {
          console.log("Successfully subscribed to presence channel");
          // Announce presence to other peers
          channel.track({
            user_id: currentUserId,
            online_at: new Date().toISOString(),
          });
        }
        
        if (
          status === REALTIME_SUBSCRIBE_STATES.TIMED_OUT ||
          status === REALTIME_SUBSCRIBE_STATES.CLOSED ||
          status === REALTIME_SUBSCRIBE_STATES.CHANNEL_ERROR
        ) {
          console.error("Presence channel subscription failed:", status);
        }
      });
      
    return () => {
      channel.unsubscribe();
    };
  }, [manager]);
  
  // Update connection stats periodically
  useEffect(() => {
    if (!manager || !isP2PEnabled()) return;
    
    const updateStats = () => updateConnectionStats(manager);
    
    // Update stats immediately and then every 5 seconds
    updateStats();
    const interval = setInterval(updateStats, 5000);
    
    return () => clearInterval(interval);
  }, [manager]);
  
  // Convert PeerJS stats to our format
  const updateConnectionStats = useCallback((peerManager: PeerJSManager) => {
    const stats: WebRTCConnectionStats = {};
    const peerIds = peerManager.getPeerIds();
    
    peerIds.forEach(peerId => {
      const peerStats = peerManager.getConnectionStats(peerId);
      if (peerStats) {
        stats[peerId] = {
          connected: peerStats.connected,
          reliable: peerStats.reliable,
          latency: peerStats.latency ? `${peerStats.latency}ms` : undefined,
          connectionType: peerStats.connectionType
        };
      }
    });
    
    setConnectionStats(stats);
  }, []);
  
  // Connect to a peer
  const connect = useCallback(async (peerId: string) => {
    if (!manager) {
      console.error("Cannot connect: PeerJS manager not initialized");
      return null;
    }
    
    try {
      return await manager.connect(peerId);
    } catch (error) {
      console.error(`Failed to connect to peer ${peerId}:`, error);
      return null;
    }
  }, [manager]);
  
  // Send message to a peer
  const sendToPeer = useCallback(async (peerId: string, data: any): Promise<boolean> => {
    if (!manager) {
      console.error("Cannot send message: PeerJS manager not initialized");
      return false;
    }
    
    try {
      return await manager.send(peerId, data);
    } catch (error) {
      console.error(`Failed to send message to peer ${peerId}:`, error);
      return false;
    }
  }, [manager]);
  
  // Broadcast message to all peers
  const broadcastToAllPeers = useCallback((data: any): void => {
    if (!manager) {
      console.error("Cannot broadcast: PeerJS manager not initialized");
      return;
    }
    
    manager.broadcast(data);
  }, [manager]);
  
  // Disconnect from a peer
  const disconnect = useCallback((peerId: string): void => {
    if (!manager) {
      console.error("Cannot disconnect: PeerJS manager not initialized");
      return;
    }
    
    manager.disconnect(peerId);
  }, [manager]);
  
  // Toggle monitor visibility
  const toggleMonitor = useCallback(() => {
    setShowMonitor(prev => !prev);
  }, []);
  
  // Handle communication config changes
  useEffect(() => {
    const handleConfigChange = () => {
      if (!isP2PEnabled() && manager) {
        manager.disconnectAll();
      }
    };
    
    window.addEventListener('communication-config-change', handleConfigChange);
    
    return () => {
      window.removeEventListener('communication-config-change', handleConfigChange);
    };
  }, [manager]);
  
  return {
    isConnected,
    peers,
    connect,
    sendToPeer,
    broadcastToAllPeers,
    connectionStats,
    showMonitor,
    toggleMonitor,
    disconnect
  };
};
