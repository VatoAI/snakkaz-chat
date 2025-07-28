import { useEffect, useState } from 'react';
import { useWebRTCDirectMessaging } from '../../hooks/useWebRTCDirectMessaging.new';
import { useIntegratedChat } from '../../hooks/useIntegratedChat.new';
import { useSignaling } from '../../hooks/useSignaling.new';
import { useWebRTC } from '../../hooks/useWebRTC.new';
import { useWebRTCMonitoring } from '../../hooks/useWebRTCMonitoring.new';

/**
 * Integrates WebRTC functionality into SnakkaZ Chat UI components
 * 
 * This utility provides helper functions to wire up WebRTC status, monitoring
 * and direct messaging with chat UI components.
 */

export interface ChatIntegrationConfig {
  enableEncryption: boolean;
  fallbackToServer: boolean;
  autoReconnect: boolean;
  monitorConnection: boolean;
  preferredConnectionType?: 'p2p' | 'server';
  signalTimeout?: number;
}

const DEFAULT_CONFIG: ChatIntegrationConfig = {
  enableEncryption: true,
  fallbackToServer: true,
  autoReconnect: true,
  monitorConnection: true,
  preferredConnectionType: 'p2p',
  signalTimeout: 20000
};

/**
 * Initialize WebRTC components for a chat conversation
 * Handles peer connections, signaling, and direct messaging setup
 */
export function initializeWebRTCChat(
  userId: string,
  peerId: string,
  config: Partial<ChatIntegrationConfig> = {}
) {
  // Merge with default config
  const fullConfig = { ...DEFAULT_CONFIG, ...config };
  
  // Initialize WebRTC core
  const webrtc = useWebRTC();
  
  // Initialize signaling for WebRTC (pass current user ID)
  const signaling = useSignaling(userId);
  
  // Initialize direct messaging
  const messaging = useWebRTCDirectMessaging(userId, peerId);
  
  // Initialize monitoring
  const monitoring = useWebRTCMonitoring();
  
  // Initialize integrated chat with both WebRTC and server capabilities
  const chatIntegration = useIntegratedChat(userId, peerId);
  
  useEffect(() => {
    // Attempt to connect with the peer using direct messaging
    if (fullConfig.preferredConnectionType === 'p2p') {
      messaging.connect().catch(err => {
        console.warn('P2P connection failed, falling back to server:', err);
        // Fallback to server happens automatically in the hook
      });
    }
    
    return () => {
      // Cleanup happens automatically in hooks
    };
  }, [userId, peerId, messaging, fullConfig]);
  
  return {
    webrtc,
    signaling,
    messaging,
    monitoring,
    chatIntegration
  };
}

/**
 * Helper for status display and connection monitoring in chat
 */
export function useWebRTCChatStatus(userId: string, peerId: string) {
  const messaging = useWebRTCDirectMessaging(userId, peerId);
  const monitoring = useWebRTCMonitoring();
  const [showDetailedStats, setShowDetailedStats] = useState(false);
  
  // Get connection info
  const { connectionState, isEncrypted, latency } = messaging;
  const { connectionSummary } = monitoring;
  
  const toggleDetailedStats = () => {
    setShowDetailedStats(!showDetailedStats);
  };
  
  const reconnect = async () => {
    try {
      await monitoring.initiateReconnect();
      return true;
    } catch (err) {
      console.error('Failed to reconnect:', err);
      return false;
    }
  };
  
  return {
    connectionState,
    isEncrypted,
    latency,
    showDetailedStats,
    toggleDetailedStats,
    connectionSummary,
    reconnect
  };
}

/**
 * Wrapper for integrated chat functionality combining WebRTC and server messaging
 */
export function useIntegratedChatWrapper(userId: string, peerId: string) {
  const integratedChat = useIntegratedChat(userId, peerId);
  const messaging = useWebRTCDirectMessaging(userId, peerId);
  
  const sendMessage = async (message: string) => {
    const result = await integratedChat.sendMessage(message);
    
    // Log message statistics
    if (result) {
      console.debug('Message sent via:', messaging.connectionState);
    }
    
    return result;
  };
  
  const statusInfo = integratedChat.statusInfo ? integratedChat.statusInfo() : {};
  
  return {
    ...integratedChat,
    sendMessage,
    connectionInfo: {
      isP2PActive: messaging.connectionState === 'p2p',
      isEncrypted: messaging.isEncrypted,
      latency: messaging.latency,
      statusInfo
    }
  };
}
