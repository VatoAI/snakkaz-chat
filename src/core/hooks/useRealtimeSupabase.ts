/**
 * Enhanced Supabase Realtime Hook
 * 
 * React hook for seamless integration with the RealtimeService
 * Provides realtime messaging, presence, and group functionality
 * with built-in E2EE support and performance monitoring
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { RealtimeService, RealtimeMessage, PresenceState, GroupUpdate } from '@/services/supabase/RealtimeService';

interface UseRealtimeOptions {
  autoConnect?: boolean;
  enablePresence?: boolean;
  enableMetrics?: boolean;
  onError?: (error: Error) => void;
}

export interface RealtimeHookState {
  isConnected: boolean;
  isConnecting: boolean;
  connectionHealth: any;
  messages: RealtimeMessage[];
  presence: Record<string, PresenceState>;
  error: Error | null;
  metrics: {
    messagesReceived: number;
    messagesSent: number;
    averageLatency: number;
    connectionUptime: number;
  };
}

export const useRealtimeSupabase = (options: UseRealtimeOptions = {}) => {
  const { user } = useAuth();
  const { autoConnect = true, enablePresence = true, enableMetrics = true, onError } = options;
  
  const [state, setState] = useState<RealtimeHookState>({
    isConnected: false,
    isConnecting: false,
    connectionHealth: null,
    messages: [],
    presence: {},
    error: null,
    metrics: {
      messagesReceived: 0,
      messagesSent: 0,
      averageLatency: 0,
      connectionUptime: 0
    }
  });

  const realtimeServiceRef = useRef<RealtimeService | null>(null);
  const metricsIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const latencyTrackingRef = useRef<Map<string, number>>(new Map());

  /**
   * Initialize RealtimeService
   */
  const initializeService = useCallback(async () => {
    if (!user?.id || realtimeServiceRef.current) return;

    try {
      setState(prev => ({ ...prev, isConnecting: true, error: null }));

      const service = new RealtimeService(user.id);
      realtimeServiceRef.current = service;

      // Set up event handlers
      service.setMessageHandler((message: RealtimeMessage) => {
        // Track latency if we have timing data
        const messageId = message.id;
        const sentTime = latencyTrackingRef.current.get(messageId);
        if (sentTime) {
          const latency = Date.now() - sentTime;
          setState(prev => ({
            ...prev,
            metrics: {
              ...prev.metrics,
              messagesReceived: prev.metrics.messagesReceived + 1,
              averageLatency: (prev.metrics.averageLatency + latency) / 2
            }
          }));
          latencyTrackingRef.current.delete(messageId);
        }

        setState(prev => ({
          ...prev,
          messages: [message, ...prev.messages.slice(0, 99)] // Keep last 100 messages
        }));
      });

      service.setPresenceHandler((presence: PresenceState) => {
        setState(prev => ({
          ...prev,
          presence: {
            ...prev.presence,
            [presence.user_id]: presence
          }
        }));
      });

      service.setGroupUpdateHandler((update: GroupUpdate) => {
        console.log('Group update received:', update);
        // Handle group updates as needed
      });

      service.setConnectionStatusHandler((status: string) => {
        setState(prev => ({
          ...prev,
          isConnected: status === 'connected',
          isConnecting: status === 'connecting',
          connectionHealth: service.getConnectionHealth()
        }));
      });

      // Subscribe to presence if enabled
      if (enablePresence) {
        await service.subscribeToPresence(user.id);
      }

      // Start metrics tracking if enabled
      if (enableMetrics) {
        startMetricsTracking(service);
      }

      setState(prev => ({
        ...prev,
        isConnecting: false,
        isConnected: true
      }));

    } catch (error) {
      const err = error as Error;
      setState(prev => ({
        ...prev,
        isConnecting: false,
        isConnected: false,
        error: err
      }));
      onError?.(err);
    }
  }, [user?.id, enablePresence, enableMetrics, onError]);

  /**
   * Start metrics tracking
   */
  const startMetricsTracking = useCallback((service: RealtimeService) => {
    metricsIntervalRef.current = setInterval(() => {
      const health = service.getConnectionHealth();
      setState(prev => ({
        ...prev,
        connectionHealth: health,
        metrics: {
          ...prev.metrics,
          connectionUptime: health.uptime
        }
      }));
    }, 5000); // Update every 5 seconds
  }, []);

  /**
   * Subscribe to private chat
   */
  const subscribeToPrivateChat = useCallback(async (chatId: string, otherUserId: string) => {
    if (!realtimeServiceRef.current) {
      throw new Error('RealtimeService not initialized');
    }

    await realtimeServiceRef.current.subscribeToPrivateChat(chatId, otherUserId);
  }, []);

  /**
   * Subscribe to group chat
   */
  const subscribeToGroupChat = useCallback(async (groupId: string) => {
    if (!realtimeServiceRef.current) {
      throw new Error('RealtimeService not initialized');
    }

    await realtimeServiceRef.current.subscribeToGroupChat(groupId);
  }, []);

  /**
   * Send realtime message with latency tracking
   */
  const sendMessage = useCallback(async (
    channelName: string,
    message: any,
    encrypted: boolean = false
  ) => {
    if (!realtimeServiceRef.current) {
      throw new Error('RealtimeService not initialized');
    }

    const messageId = crypto.randomUUID();
    const timestamp = Date.now();
    
    // Track message for latency calculation
    latencyTrackingRef.current.set(messageId, timestamp);
    
    try {
      const result = await realtimeServiceRef.current.sendRealtimeMessage(
        channelName,
        { ...message, id: messageId },
        encrypted
      );

      setState(prev => ({
        ...prev,
        metrics: {
          ...prev.metrics,
          messagesSent: prev.metrics.messagesSent + 1
        }
      }));

      return result;
    } catch (error) {
      latencyTrackingRef.current.delete(messageId);
      throw error;
    }
  }, []);

  /**
   * Update user activity
   */
  const updateActivity = useCallback(async (activity: string) => {
    if (!realtimeServiceRef.current) return;
    await realtimeServiceRef.current.updateActivity(activity);
  }, []);

  /**
   * Get enhanced user stats
   */
  const getUserStats = useCallback(async (userId?: string) => {
    if (!realtimeServiceRef.current) return null;
    return realtimeServiceRef.current.getEnhancedUserStats(userId || user?.id || '');
  }, [user?.id]);

  /**
   * Create enhanced group
   */
  const createGroup = useCallback(async (
    name: string,
    description: string,
    isEncrypted: boolean = false
  ) => {
    if (!realtimeServiceRef.current) {
      throw new Error('RealtimeService not initialized');
    }
    return realtimeServiceRef.current.createEnhancedGroup(name, description, isEncrypted);
  }, []);

  /**
   * Clear messages (useful for chat switching)
   */
  const clearMessages = useCallback(() => {
    setState(prev => ({
      ...prev,
      messages: []
    }));
  }, []);

  /**
   * Disconnect and cleanup
   */
  const disconnect = useCallback(async () => {
    if (realtimeServiceRef.current) {
      await realtimeServiceRef.current.disconnect();
      realtimeServiceRef.current = null;
    }

    if (metricsIntervalRef.current) {
      clearInterval(metricsIntervalRef.current);
      metricsIntervalRef.current = null;
    }

    latencyTrackingRef.current.clear();

    setState({
      isConnected: false,
      isConnecting: false,
      connectionHealth: null,
      messages: [],
      presence: {},
      error: null,
      metrics: {
        messagesReceived: 0,
        messagesSent: 0,
        averageLatency: 0,
        connectionUptime: 0
      }
    });
  }, []);

  /**
   * Get online users count
   */
  const getOnlineUsersCount = useCallback(() => {
    return Object.values(state.presence).filter(p => p.status === 'online').length;
  }, [state.presence]);

  /**
   * Get user presence by ID
   */
  const getUserPresence = useCallback((userId: string): PresenceState | null => {
    return state.presence[userId] || null;
  }, [state.presence]);

  // Auto-connect when user is available
  useEffect(() => {
    if (autoConnect && user?.id && !realtimeServiceRef.current) {
      initializeService();
    }
  }, [autoConnect, user?.id, initializeService]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      disconnect();
    };
  }, [disconnect]);

  return {
    // State
    ...state,
    
    // Actions
    subscribeToPrivateChat,
    subscribeToGroupChat,
    sendMessage,
    updateActivity,
    getUserStats,
    createGroup,
    clearMessages,
    disconnect,
    
    // Utilities
    getOnlineUsersCount,
    getUserPresence,
    
    // Direct service access for advanced use cases
    service: realtimeServiceRef.current
  };
};

export default useRealtimeSupabase;
