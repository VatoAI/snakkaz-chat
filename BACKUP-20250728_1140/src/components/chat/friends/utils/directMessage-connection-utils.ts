
import { WebRTCManager } from "@/utils/webrtc";
import { useCallback } from "react";

export const useConnectionState = (
  webRTCManager: WebRTCManager | null,
  friendId: string | undefined,
  toast: any
) => {
  const updateConnectionStatus = useCallback(() => {
    if (!webRTCManager || !friendId) {
      return { connState: 'disconnected', dataState: 'closed' };
    }

    const connState = webRTCManager.getConnectionState(friendId);
    const dataState = webRTCManager.getDataChannelState(friendId);

    return { connState, dataState };
  }, [webRTCManager, friendId]);

  const attemptReconnect = useCallback(async (
    usingServerFallback: boolean,
    setUsingServerFallback: (value: boolean) => void
  ) => {
    if (!webRTCManager || !friendId) return false;

    try {
      console.log(`Attempting to reconnect to ${friendId}`);
      
      // If we're already using server fallback, don't attempt to reconnect via WebRTC again
      if (usingServerFallback) {
        return false;
      }
      
      await webRTCManager.attemptReconnect(friendId);
      
      // Check if connection was successful
      const connState = webRTCManager.getConnectionState(friendId);
      const dataState = webRTCManager.getDataChannelState(friendId);
      
      if (connState === 'connected' && dataState === 'open') {
        toast({
          title: "Tilkoblet",
          description: "Direkte tilkobling gjenopprettet",
        });
        return true;
      } else {
        console.log(`Reconnection attempt failed, falling back to server: ${connState}, ${dataState}`);
        // Fall back to server
        setUsingServerFallback(true);
        toast({
          title: "Server modus",
          description: "Bruker nå kryptert servermodus for meldinger",
        });
        return false;
      }
    } catch (error) {
      console.error(`Reconnection error:`, error);
      // Fall back to server
      setUsingServerFallback(true);
      toast({
        title: "Server modus",
        description: "Bruker nå kryptert servermodus for meldinger",
      });
      return false;
    }
  }, [webRTCManager, friendId, toast]);

  return {
    updateConnectionStatus,
    attemptReconnect
  };
};

export const setupConnectionTimeout = (
  webRTCManager: WebRTCManager | null,
  friendId: string | undefined,
  setUsingServerFallback: (value: boolean) => void,
  toast: any,
  timeout: number = 3000 // Reduced from 5000ms to 3000ms
) => {
  return setTimeout(() => {
    if (!webRTCManager || !friendId) return;
    
    const connState = webRTCManager.getConnectionState(friendId);
    const dataState = webRTCManager.getDataChannelState(friendId);
    
    // If still not connected after timeout, fall back to server mode
    if (connState !== 'connected' || dataState !== 'open') {
      console.log(`Connection timed out after ${timeout}ms, falling back to server`);
      setUsingServerFallback(true);
      toast({
        title: "Server modus",
        description: "Bruker nå kryptert servermodus for meldinger",
        variant: "default",
      });
    }
  }, timeout);
};
