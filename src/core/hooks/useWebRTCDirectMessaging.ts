import { useState, useEffect, useCallback } from 'react';
import { useWebRTC } from './useWebRTC.new';
import { useToast } from '@/components/ui/use-toast';
import pRetry from 'p-retry';
import pTimeout from 'p-timeout';

export type ConnectionType = 'p2p' | 'server' | 'connecting' | 'disconnected' | 'error';

// Define message structure with encryption support
export interface DirectMessage {
  id: string;
  senderId: string;
  recipientId: string;
  content: string;
  timestamp: string;
  isEncrypted?: boolean;
}

/**
 * useWebRTCDirectMessaging - Hook for handling direct messaging via WebRTC (PeerJS)
 * 
 * This hook connects WebRTC functionality to the chat system for direct messaging between users.
 * It handles establishing connections, sending messages, and fallback to server when necessary.
 */
export const useWebRTCDirectMessaging = (
  currentUserId: string | undefined,
  peerId: string | undefined
) => {
  const { 
    isConnected,
    peers,
    connect: connectPeer,
    sendToPeer,
    connectionStats,
  } = useWebRTC(currentUserId);
  
  const { toast } = useToast();

  const [connectionState, setConnectionState] = useState<ConnectionType>('disconnected');
  const [isEncrypted, setIsEncrypted] = useState<boolean>(false);
  const [latency, setLatency] = useState<number | null>(null);
  const [reconnectAttempts, setReconnectAttempts] = useState<number>(0);
  const [messageQueue, setMessageQueue] = useState<{ message: string; timestamp: number }[]>([]);

  // Monitor WebRTC connection state
  useEffect(() => {
    if (!isConnected || !peerId || !currentUserId) {
      setConnectionState('disconnected');
      return;
    }

    // Check if the peer is in the list of connected peers
    if (peers.includes(peerId)) {
      setConnectionState('p2p');
      setIsEncrypted(true); // PeerJS connections are encrypted by default
      
      // Get latency from stats
      if (connectionStats[peerId]?.latency) {
        const latencyStr = connectionStats[peerId].latency || '';
        setLatency(parseInt(latencyStr.replace('ms', ''), 10) || null);
      }
    } else {
      // Not connected directly, check if we're trying to connect
      if (connectionState === 'connecting') {
        // Keep the connecting state
      } else if (reconnectAttempts > 2) {
        // If multiple reconnect attempts have failed, switch to server mode
        setConnectionState('server');
        setIsEncrypted(false);
      } else {
        setConnectionState('disconnected');
        setIsEncrypted(false);
      }
    }
  }, [isConnected, peers, peerId, currentUserId, connectionStats, reconnectAttempts, connectionState]);

  // Connect/reconnect to peer
  const connect = useCallback(async () => {
    if (!currentUserId || !peerId) {
      console.error('Cannot connect: Missing required parameters');
      return false;
    }
    
    try {
      setConnectionState('connecting');
      
      // Increment reconnect attempts
      setReconnectAttempts(prev => prev + 1);
      
      // Attempt to connect to peer with retries and timeout
      const connection = await pRetry(
        async () => {
          const conn = await pTimeout(
            connectPeer(peerId),
            10000, // 10 seconds timeout
            `Connection to peer ${peerId} timed out`
          );
          
          if (!conn) {
            throw new Error(`Failed to connect to peer ${peerId}`);
          }
          
          return conn;
        },
        { retries: 2 }
      );
      
      if (connection) {
        // Reset reconnect attempts on successful connection
        setReconnectAttempts(0);
        setConnectionState('p2p');
        setIsEncrypted(true);
        return true;
      }
      
      // If still no connection after retries, fall back to server
      if (reconnectAttempts > 2) {
        setConnectionState('server');
        return true; // Return true for server fallback
      }
      
      setConnectionState('error');
      return false;
    } catch (error) {
      console.error(`Failed to connect to peer ${peerId}:`, error);
      
      // If multiple reconnect attempts have failed, switch to server mode
      if (reconnectAttempts > 2) {
        setConnectionState('server');
        return true; // Return true for server fallback
      }
      
      setConnectionState('error');
      return false;
    }
  }, [currentUserId, peerId, connectPeer, reconnectAttempts]);

  // Send message to peer
  const sendMessage = useCallback(async (message: string) => {
    if (!currentUserId || !peerId) {
      console.error('Cannot send message: Missing required parameters');
      return false;
    }
    
    // Try to send via WebRTC if connected
    if (connectionState === 'p2p') {
      try {
        // Wrap message in our format
        const messageData: DirectMessage = {
          id: `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
          senderId: currentUserId,
          recipientId: peerId,
          content: message,
          timestamp: new Date().toISOString(),
          isEncrypted: true
        };
        
        return await sendToPeer(peerId, messageData);
      } catch (error) {
        console.error(`Failed to send message via WebRTC to ${peerId}:`, error);
        
        // Queue message for retry
        setMessageQueue(prev => [...prev, { message, timestamp: Date.now() }]);
        
        // Try to reconnect
        connect().catch(err => {
          console.error(`Failed to reconnect to ${peerId}:`, err);
        });
        
        return false;
      }
    } 
    // Use server fallback
    else if (connectionState === 'server') {
      try {
        // In a real implementation, this would call a server-based messaging API
        console.log(`Sending message via server fallback to ${peerId}:`, message);
        
        // Simulate successful server send
        return true;
      } catch (error) {
        console.error(`Failed to send message via server to ${peerId}:`, error);
        return false;
      }
    }
    // Not connected
    else {
      // Queue message and try to connect
      setMessageQueue(prev => [...prev, { message, timestamp: Date.now() }]);
      
      // Try to connect
      const connected = await connect().catch(() => false);
      
      if (connected) {
        // If connection succeeded, try to send queued messages
        processMessageQueue();
      }
      
      return false;
    }
  }, [currentUserId, peerId, connectionState, connect, sendToPeer]);

  // Process queued messages
  const processMessageQueue = useCallback(async () => {
    if (messageQueue.length === 0 || !peerId) return;
    
    // If connected, try to send queued messages
    if (connectionState === 'p2p' || connectionState === 'server') {
      const currentQueue = [...messageQueue];
      setMessageQueue([]);
      
      for (const item of currentQueue) {
        try {
          if (connectionState === 'p2p') {
            // Wrap message in our format
            const messageData: DirectMessage = {
              id: `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
              senderId: currentUserId || '',
              recipientId: peerId,
              content: item.message,
              timestamp: new Date().toISOString(),
              isEncrypted: true
            };
            
            await sendToPeer(peerId, messageData);
          } else {
            // Use server fallback in a real implementation
            console.log(`Sending queued message via server to ${peerId}:`, item.message);
          }
        } catch (error) {
          console.error(`Failed to send queued message to ${peerId}:`, error);
          
          // Re-queue failed message if it's not too old (< 5 minutes)
          if (Date.now() - item.timestamp < 5 * 60 * 1000) {
            setMessageQueue(prev => [...prev, item]);
          }
        }
      }
    }
  }, [currentUserId, peerId, messageQueue, connectionState, sendToPeer]);

  // Process message queue when connection state changes
  useEffect(() => {
    if (connectionState === 'p2p' || connectionState === 'server') {
      processMessageQueue();
    }
  }, [connectionState, processMessageQueue]);

  // Status info for WebRTC connection
  const statusInfo = useCallback(() => {
    return {
      connectionStatus: connectionState,
      isEncrypted,
      latency
    };
  }, [connectionState, isEncrypted, latency]);

  return {
    connectionState,
    isEncrypted,
    latency,
    connect,
    sendMessage,
    reconnectAttempts,
    messageQueue: messageQueue.length,
    statusInfo
  };
};
