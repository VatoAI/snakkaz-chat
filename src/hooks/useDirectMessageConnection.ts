import { useCallback, useEffect } from 'react';
import { WebRTCManager } from "@/utils/webrtc";
import { useToast } from '@/components/ui/use-toast';

/**
 * Hook for managing WebRTC direct message connections
 */
export const useDirectMessageConnection = (
  webRTCManager: WebRTCManager | null,
  friendId: string | undefined,
  connectionState: string,
  setConnectionState: (state: string) => void,
  dataChannelState: string,
  setDataChannelState: (state: string) => void,
  usingServerFallback: boolean,
  setUsingServerFallback: (fallback: boolean) => void,
  connectionAttempts: number,
  setConnectionAttempts: (attempts: number) => void
) => {
  const { toast } = useToast();

  // Monitor connection state
  useEffect(() => {
    if (!webRTCManager || !friendId) return;
    
    const onConnectionStateChangeHandler = (peerId: string, state: RTCPeerConnectionState) => {
      if (peerId === friendId) {
        setConnectionState(state);
      }
    };
    
    const onDataChannelStateChangeHandler = (peerId: string, state: RTCDataChannelState) => {
      if (peerId === friendId) {
        setDataChannelState(state);
      }
    };
    
    // Set up event handlers
    webRTCManager.onConnectionStateChange = onConnectionStateChangeHandler;
    webRTCManager.onDataChannelStateChange = onDataChannelStateChangeHandler;
    
    // Initial state
    if (webRTCManager.getConnectionState) {
      const initialConnectionState = webRTCManager.getConnectionState(friendId);
      if (initialConnectionState) {
        setConnectionState(initialConnectionState);
      }
      
      const initialDataChannelState = webRTCManager.getDataChannelState(friendId);
      if (initialDataChannelState) {
        setDataChannelState(initialDataChannelState);
      }
    }
    
    return () => {
      // Clean up event handlers
      if (webRTCManager) {
        webRTCManager.onConnectionStateChange = null;
        webRTCManager.onDataChannelStateChange = null;
      }
    };
  }, [webRTCManager, friendId, setConnectionState, setDataChannelState]);

  // Automatic fallback to server if P2P connection fails
  useEffect(() => {
    if (connectionAttempts > 2 && connectionState !== 'connected') {
      setUsingServerFallback(true);
    }
  }, [connectionAttempts, connectionState, setUsingServerFallback]);
  
  // Connection management
  const handleReconnect = useCallback(() => {
    if (!webRTCManager || !friendId) return;
    
    // Increment connection attempts
    setConnectionAttempts(connectionAttempts + 1);
    
    // Attempt to establish P2P connection
    if (webRTCManager.connectToPeer) {
      webRTCManager.connectToPeer(friendId, {} as JsonWebKey)
        .then(() => {
          console.log('Connection to peer attempted');
        })
        .catch(err => {
          console.error('Failed to connect to peer:', err);
        });
      
      // Set a timeout for fallback to server
      setTimeout(() => {
        if (webRTCManager.getConnectionState) {
          const conn = webRTCManager.getConnectionState(friendId);
          if (!conn || conn !== 'connected') {
            setUsingServerFallback(true);
            toast({
              title: "Server modus",
              description: "Bruker kryptert server-modus for meldinger",
              variant: "default"
            });
          }
        }
      }, 10000); // 10 seconds timeout
    }
  }, [webRTCManager, friendId, connectionAttempts, setConnectionAttempts, setUsingServerFallback, toast]);
  
  return {
    handleReconnect
  };
};