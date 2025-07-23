/**
 * Enhanced Supabase Realtime Service
 * 
 * Provides comprehensive realtime functionality for:
 * - Chat messages and group messaging
 * - User presence and status updates
 * - E2EE key distribution and management
 * - Group management and permissions
 * - Performance metrics and monitoring
 */

import { RealtimeChannel, RealtimeChannelSendResponse } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import * as E2EE from '@/utils/crypto/e2ee';

// Types for realtime events
export interface RealtimeMessage {
  id: string;
  type: 'message' | 'group_message' | 'key_exchange' | 'presence' | 'group_update';
  payload: any;
  metadata?: {
    encrypted?: boolean;
    transmission_type?: 'webrtc' | 'mcp' | 'supabase';
    timestamp: string;
    sender_id: string;
  };
}

export interface PresenceState {
  user_id: string;
  status: 'online' | 'away' | 'busy' | 'offline';
  last_seen: string;
  activity?: string;
}

export interface GroupKeyExchange {
  group_id: string;
  sender_id: string;
  recipient_id: string;
  encrypted_key: string;
  key_version: number;
}

export interface GroupUpdate {
  group_id: string;
  update_type: 'member_added' | 'member_removed' | 'settings_changed' | 'encryption_enabled';
  data: any;
  updated_by: string;
}

export class RealtimeService {
  private channels: Map<string, RealtimeChannel> = new Map();
  private currentUserId: string | null = null;
  private connectionStatus: 'connected' | 'connecting' | 'disconnected' = 'disconnected';
  private heartbeatInterval: NodeJS.Timeout | null = null;

  // Event handlers
  private onMessageHandler?: (message: RealtimeMessage) => void;
  private onPresenceUpdateHandler?: (presence: PresenceState) => void;
  private onGroupUpdateHandler?: (update: GroupUpdate) => void;
  private onConnectionStatusHandler?: (status: string) => void;

  constructor(userId?: string) {
    this.currentUserId = userId || null;
    this.initializeConnection();
  }

  /**
   * Initialize Supabase realtime connection with enhanced monitoring
   */
  private async initializeConnection() {
    try {
      this.connectionStatus = 'connecting';
      this.onConnectionStatusHandler?.(this.connectionStatus);

      // Setup global channel for presence and system events
      const globalChannel = supabase.channel('snakkaz-global');
      this.channels.set('global', globalChannel);

      // Subscribe to connection state changes
      globalChannel.on('system', {}, (payload) => {
        console.log('System event:', payload);
        if (payload.event === 'system-status') {
          this.connectionStatus = payload.status;
          this.onConnectionStatusHandler?.(this.connectionStatus);
        }
      });

      // Start heartbeat for connection monitoring
      this.startHeartbeat();

      this.connectionStatus = 'connected';
      this.onConnectionStatusHandler?.(this.connectionStatus);

    } catch (error) {
      console.error('Failed to initialize realtime connection:', error);
      this.connectionStatus = 'disconnected';
      this.onConnectionStatusHandler?.(this.connectionStatus);
    }
  }

  /**
   * Subscribe to user presence updates across the application
   */
  public async subscribeToPresence(userId: string) {
    this.currentUserId = userId;
    
    const channel = supabase.channel('user-presence');
    
    // Track presence
    const presenceState: PresenceState = {
      user_id: userId,
      status: 'online',
      last_seen: new Date().toISOString(),
      activity: 'active'
    };

    channel.on('presence', { event: 'sync' }, () => {
      const newState = channel.presenceState();
      console.log('Presence sync:', newState);
      
      // Process presence updates
      Object.values(newState).forEach(presences => {
        if (Array.isArray(presences)) {
          presences.forEach(presence => {
            if (presence && typeof presence === 'object') {
              this.onPresenceUpdateHandler?.(presence as unknown as PresenceState);
            }
          });
        }
      });
    });

    channel.on('presence', { event: 'join' }, ({ key, newPresences }) => {
      console.log('User joined:', key, newPresences);
      newPresences.forEach(presence => {
        if (presence && typeof presence === 'object') {
          this.onPresenceUpdateHandler?.(presence as unknown as PresenceState);
        }
      });
    });

    channel.on('presence', { event: 'leave' }, ({ key, leftPresences }) => {
      console.log('User left:', key, leftPresences);
      leftPresences.forEach(presence => {
        if (presence && typeof presence === 'object') {
          this.onPresenceUpdateHandler?.({
            ...(presence as unknown as PresenceState),
            status: 'offline'
          });
        }
      });
    });

    channel.subscribe(async (status) => {
      if (status === 'SUBSCRIBED') {
        console.log('Subscribed to presence');
        // Track this user's presence
        const trackResponse = await channel.track(presenceState);
        console.log('Presence tracking response:', trackResponse);
      }
    });

    this.channels.set('presence', channel);
  }

  /**
   * Subscribe to private chat messages with E2EE support
   */
  public async subscribeToPrivateChat(chatId: string, otherUserId: string) {
    const channelName = `private-chat-${chatId}`;
    const channel = supabase.channel(channelName);

    // Listen for new messages
    channel.on('postgres_changes', {
      event: 'INSERT',
      schema: 'public',
      table: 'direct_messages',
      filter: `chat_id=eq.${chatId}`
    }, async (payload) => {
      console.log('New private message:', payload);
      
      const message: RealtimeMessage = {
        id: payload.new.id,
        type: 'message',
        payload: payload.new,
        metadata: {
          encrypted: payload.new.encrypted || false,
          transmission_type: payload.new.transmission_type || 'supabase',
          timestamp: payload.new.created_at,
          sender_id: payload.new.sender_id
        }
      };

      // Decrypt if encrypted
      if (message.metadata?.encrypted && this.currentUserId) {
        try {
          // Use E2EE functions directly
          const decryptedContent = await E2EE.decryptMessage(
            payload.new.content,
            this.currentUserId,
            otherUserId
          );
          message.payload = { ...message.payload, content: decryptedContent };
        } catch (error) {
          console.error('Failed to decrypt message:', error);
        }
      }

      this.onMessageHandler?.(message);
    });

    // Listen for message updates (edits)
    channel.on('postgres_changes', {
      event: 'UPDATE',
      schema: 'public',
      table: 'direct_messages',
      filter: `chat_id=eq.${chatId}`
    }, (payload) => {
      console.log('Message updated:', payload);
      // Handle message updates
    });

    channel.subscribe((status) => {
      console.log(`Private chat ${chatId} subscription status:`, status);
    });

    this.channels.set(channelName, channel);
  }

  /**
   * Subscribe to group chat messages with enhanced E2EE support
   */
  public async subscribeToGroupChat(groupId: string) {
    const channelName = `group-chat-${groupId}`;
    const channel = supabase.channel(channelName);

    // Listen for new group messages
    channel.on('postgres_changes', {
      event: 'INSERT',
      schema: 'public',
      table: 'group_messages',
      filter: `group_id=eq.${groupId}`
    }, async (payload) => {
      console.log('New group message:', payload);
      
      const message: RealtimeMessage = {
        id: payload.new.id,
        type: 'group_message',
        payload: payload.new,
        metadata: {
          encrypted: payload.new.encrypted || false,
          transmission_type: payload.new.transmission_type || 'supabase',
          timestamp: payload.new.created_at,
          sender_id: payload.new.sender_id
        }
      };

      // Decrypt group message if encrypted
      if (message.metadata?.encrypted && this.currentUserId) {
        try {
          const decryptedContent = await E2EE.decryptGroupMessage(
            payload.new.content,
            groupId,
            this.currentUserId
          );
          message.payload = { ...message.payload, content: decryptedContent };
        } catch (error) {
          console.error('Failed to decrypt group message:', error);
        }
      }

      this.onMessageHandler?.(message);
    });

    // Listen for group key exchanges
    channel.on('postgres_changes', {
      event: 'INSERT',
      schema: 'public',
      table: 'group_key_exchanges'
    }, async (payload) => {
      console.log('New group key exchange:', payload);
      
      if (payload.new.recipient_id === this.currentUserId) {
        // Handle incoming key exchange
        await this.handleGroupKeyExchange(payload.new as GroupKeyExchange);
      }
    });

    // Listen for group updates
    channel.on('postgres_changes', {
      event: 'UPDATE',
      schema: 'public',
      table: 'group_chats',
      filter: `id=eq.${groupId}`
    }, (payload) => {
      console.log('Group updated:', payload);
      
      const update: GroupUpdate = {
        group_id: groupId,
        update_type: 'settings_changed',
        data: payload.new,
        updated_by: payload.new.updated_by || 'system'
      };

      this.onGroupUpdateHandler?.(update);
    });

    channel.subscribe((status) => {
      console.log(`Group chat ${groupId} subscription status:`, status);
    });

    this.channels.set(channelName, channel);
  }

  /**
   * Send encrypted message through Supabase realtime
   */
  public async sendRealtimeMessage(
    channelName: string,
    message: any,
    encrypted: boolean = false
  ): Promise<RealtimeChannelSendResponse> {
    const channel = this.channels.get(channelName);
    if (!channel) {
      throw new Error(`Channel ${channelName} not found`);
    }

    const realtimeMessage: RealtimeMessage = {
      id: crypto.randomUUID(),
      type: 'message',
      payload: message,
      metadata: {
        encrypted,
        transmission_type: 'supabase',
        timestamp: new Date().toISOString(),
        sender_id: this.currentUserId || 'anonymous'
      }
    };

    return channel.send({
      type: 'broadcast',
      event: 'message',
      payload: realtimeMessage
    });
  }

  /**
   * Handle incoming group key exchanges
   */
  private async handleGroupKeyExchange(keyExchange: GroupKeyExchange) {
    try {
      await E2EE.importGroupKey(
        keyExchange.group_id,
        keyExchange.encrypted_key
      );
      console.log(`Group key imported for group ${keyExchange.group_id}`);
    } catch (error) {
      console.error('Failed to import group key:', error);
    }
  }

  /**
   * Start heartbeat for connection monitoring
   */
  private startHeartbeat() {
    this.heartbeatInterval = setInterval(() => {
      const globalChannel = this.channels.get('global');
      if (globalChannel) {
        globalChannel.send({
          type: 'broadcast',
          event: 'heartbeat',
          payload: { timestamp: Date.now(), user_id: this.currentUserId }
        });
      }
    }, 30000); // Every 30 seconds
  }

  /**
   * Enhanced Supabase database operations
   */
  public async getEnhancedUserStats(userId: string) {
    const { data, error } = await supabase.rpc('get_user_analytics', {
      user_id: userId
    });

    if (error) {
      console.error('Error fetching user stats:', error);
      return null;
    }

    return {
      totalMessages: data?.total_messages || 0,
      totalGroups: data?.total_groups || 0,
      totalFriends: data?.total_friends || 0,
      encryptedChats: data?.encrypted_chats || 0,
      lastActive: data?.last_active || null,
      responseTime: data?.avg_response_time || null
    };
  }

  /**
   * Enhanced group management with Supabase
   */
  public async createEnhancedGroup(name: string, description: string, isEncrypted: boolean = false) {
    const { data, error } = await supabase.rpc('create_enhanced_group', {
      group_name: name,
      group_description: description,
      created_by: this.currentUserId,
      enable_encryption: isEncrypted
    });

    if (error) {
      console.error('Error creating enhanced group:', error);
      return null;
    }

    // If encrypted, generate and distribute group keys
    if (isEncrypted && data?.id) {
      await E2EE.getGroupKey(data.id);
    }

    return data;
  }

  /**
   * Set event handlers
   */
  public setMessageHandler(handler: (message: RealtimeMessage) => void) {
    this.onMessageHandler = handler;
  }

  public setPresenceHandler(handler: (presence: PresenceState) => void) {
    this.onPresenceUpdateHandler = handler;
  }

  public setGroupUpdateHandler(handler: (update: GroupUpdate) => void) {
    this.onGroupUpdateHandler = handler;
  }

  public setConnectionStatusHandler(handler: (status: string) => void) {
    this.onConnectionStatusHandler = handler;
  }

  /**
   * Update user activity for better presence tracking
   */
  public async updateActivity(activity: string) {
    if (!this.currentUserId) return;

    const presenceChannel = this.channels.get('presence');
    if (presenceChannel) {
      await presenceChannel.track({
        user_id: this.currentUserId,
        status: 'online',
        last_seen: new Date().toISOString(),
        activity
      });
    }

    // Also update in database for persistent storage
    await supabase
      .from('presence')
      .upsert({
        user_id: this.currentUserId,
        status: 'online',
        last_seen: new Date().toISOString(),
        activity
      });
  }

  /**
   * Cleanup and disconnect
   */
  public async disconnect() {
    console.log('Disconnecting from Supabase realtime...');

    // Clear heartbeat
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
      this.heartbeatInterval = null;
    }

    // Unsubscribe from all channels
    for (const [name, channel] of this.channels) {
      console.log(`Unsubscribing from ${name}`);
      await channel.unsubscribe();
    }

    this.channels.clear();
    this.connectionStatus = 'disconnected';
    this.onConnectionStatusHandler?.(this.connectionStatus);
  }

  /**
   * Get current connection status and health metrics
   */
  public getConnectionHealth() {
    return {
      status: this.connectionStatus,
      activeChannels: this.channels.size,
      userId: this.currentUserId,
      uptime: Date.now() // Could track actual uptime
    };
  }
}

// Export singleton instance
export const realtimeService = new RealtimeService();
