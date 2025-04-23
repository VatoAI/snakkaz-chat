
import { useCallback, useEffect } from 'react';
import { WebRTCManager } from "@/utils/webrtc";

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
    
    // Add event listeners
    if ('addEventListener' in webRTCManager) {
      webRTCManager.addEventListener('connectionStateChange', onConnectionStateChangeHandler);
      webRTCManager.addEventListener('dataChannelStateChange', onDataChannelStateChangeHandler);
    }
    
    // Initial state
    if ('getConnectionState' in webRTCManager) {
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
      // Remove event listeners
      if ('removeEventListener' in webRTCManager) {
        webRTCManager.removeEventListener('connectionStateChange', onConnectionStateChangeHandler);
        webRTCManager.removeEventListener('dataChannelStateChange', onDataChannelStateChangeHandler);
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
    
    setConnectionAttempts(connectionAttempts + 1);
    
    // Attempt to establish P2P connection
    if ('connectToPeer' in webRTCManager) {
      webRTCManager.connectToPeer(friendId, {} as JsonWebKey);
      
      // Set a timeout for fallback to server
      setTimeout(() => {
        if ('getConnectionState' in webRTCManager) {
          const conn = webRTCManager.getConnectionState(friendId);
          if (!conn || conn !== 'connected') {
            setUsingServerFallback(true);
          }
        }
      }, 10000); // 10 seconds timeout
    }
  }, [webRTCManager, friendId, connectionAttempts, setConnectionAttempts, setUsingServerFallback]);
  
  return {
    handleReconnect
  };
};
