
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
    
    const onConnectionStateChange = (peerId: string, state: RTCPeerConnectionState) => {
      if (peerId === friendId) {
        setConnectionState(state);
      }
    };
    
    const onDataChannelStateChange = (peerId: string, state: RTCDataChannelState) => {
      if (peerId === friendId) {
        setDataChannelState(state);
      }
    };
    
    webRTCManager.on('connectionStateChange', onConnectionStateChange);
    webRTCManager.on('dataChannelStateChange', onDataChannelStateChange);
    
    // Initial state
    const initialConnection = webRTCManager.getPeerConnection(friendId);
    if (initialConnection) {
      setConnectionState(initialConnection.connection.connectionState);
      if (initialConnection.dataChannel) {
        setDataChannelState(initialConnection.dataChannel.readyState);
      }
    }
    
    return () => {
      webRTCManager.off('connectionStateChange', onConnectionStateChange);
      webRTCManager.off('dataChannelStateChange', onDataChannelStateChange);
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
    
    setConnectionAttempts(prev => prev + 1);
    
    // Attempt to establish P2P connection
    webRTCManager.connect(friendId);
    
    // Set a timeout for fallback to server
    setTimeout(() => {
      const connection = webRTCManager.getPeerConnection(friendId);
      if (!connection || connection.connection.connectionState !== 'connected') {
        setUsingServerFallback(true);
      }
    }, 10000); // 10 seconds timeout
  }, [webRTCManager, friendId, setConnectionAttempts, setUsingServerFallback]);
  
  return {
    handleReconnect
  };
};
