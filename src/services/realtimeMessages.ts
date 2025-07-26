/**
 * Real-time Messaging Service for SnakkaZ
 * Handles all real-time message operations with Supabase
 */
import { supabase } from '@/lib/supabaseClient';
import { RealtimeChannel } from '@supabase/supabase-js';

export interface Message {
  id: string;
  room_id: string;
  profile_id: string;
  content: string;
  message_type: 'text' | 'file' | 'image' | 'system' | 'webrtc';
  reply_to?: string;
  is_encrypted: boolean;
  metadata?: any;
  created_at: string;
  profile?: {
    id: string;
    username: string;
    display_name?: string;
    avatar_url?: string;
  };
}

export interface Room {
  id: string;
  name: string;
  description?: string;
  room_type: 'public' | 'private' | 'direct';
  created_by?: string;
  is_active: boolean;
  created_at: string;
}

export class RealtimeMessageService {
  private channels: Map<string, RealtimeChannel> = new Map();
  private messageHandlers: Map<string, (message: Message) => void> = new Map();
  private roomHandlers: Map<string, (room: Room) => void> = new Map();

  /**
   * Subscribe to real-time messages for a specific room
   */
  subscribeToRoom(roomId: string, onMessage: (message: Message) => void): () => void {
    const channelKey = `room-${roomId}`;
    
    // Unsubscribe if already subscribed
    this.unsubscribeFromRoom(roomId);

    const channel = supabase
      .channel(channelKey)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `room_id=eq.${roomId}`
        },
        async (payload) => {
          console.log('New message received:', payload);
          
          // Fetch complete message with profile data
          const { data: message, error } = await supabase
            .from('messages')
            .select(`
              *,
              profile:profiles(id, username, display_name, avatar_url)
            `)
            .eq('id', payload.new.id)
            .single();

          if (!error && message) {
            onMessage(message as Message);
          }
        }
      )
      .subscribe();

    this.channels.set(channelKey, channel);
    this.messageHandlers.set(roomId, onMessage);

    // Return unsubscribe function
    return () => this.unsubscribeFromRoom(roomId);
  }

  /**
   * Unsubscribe from room messages
   */
  unsubscribeFromRoom(roomId: string): void {
    const channelKey = `room-${roomId}`;
    const channel = this.channels.get(channelKey);
    
    if (channel) {
      supabase.removeChannel(channel);
      this.channels.delete(channelKey);
      this.messageHandlers.delete(roomId);
    }
  }

  /**
   * Subscribe to all public rooms for global chat
   */
  subscribeToGlobalChat(onMessage: (message: Message) => void): () => void {
    const channelKey = 'global-chat';
    
    // Unsubscribe if already subscribed
    const existingChannel = this.channels.get(channelKey);
    if (existingChannel) {
      supabase.removeChannel(existingChannel);
    }

    const channel = supabase
      .channel(channelKey)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages'
        },
        async (payload) => {
          console.log('Global message received:', payload);
          
          // Fetch complete message with profile and room data
          const { data: message, error } = await supabase
            .from('messages')
            .select(`
              *,
              profile:profiles(id, username, display_name, avatar_url),
              room:rooms(id, name, room_type)
            `)
            .eq('id', payload.new.id)
            .single();

          if (!error && message) {
            onMessage(message as Message);
          }
        }
      )
      .subscribe();

    this.channels.set(channelKey, channel);

    return () => {
      const ch = this.channels.get(channelKey);
      if (ch) {
        supabase.removeChannel(ch);
        this.channels.delete(channelKey);
      }
    };
  }

  /**
   * Send a message to a room
   */
  async sendMessage(roomId: string, content: string, profileId: string, messageType: Message['message_type'] = 'text'): Promise<Message | null> {
    try {
      const { data: message, error } = await supabase
        .from('messages')
        .insert({
          room_id: roomId,
          profile_id: profileId,
          content,
          message_type: messageType,
          is_encrypted: false // For now, we'll implement E2EE later
        })
        .select(`
          *,
          profile:profiles(id, username, display_name, avatar_url)
        `)
        .single();

      if (error) {
        console.error('Error sending message:', error);
        return null;
      }

      return message as Message;
    } catch (error) {
      console.error('Failed to send message:', error);
      return null;
    }
  }

  /**
   * Get messages for a room with pagination
   */
  async getMessages(roomId: string, limit: number = 50, offset: number = 0): Promise<Message[]> {
    try {
      const { data: messages, error } = await supabase
        .from('messages')
        .select(`
          *,
          profile:profiles(id, username, display_name, avatar_url)
        `)
        .eq('room_id', roomId)
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);

      if (error) {
        console.error('Error fetching messages:', error);
        return [];
      }

      return (messages as Message[]).reverse(); // Reverse to show oldest first
    } catch (error) {
      console.error('Failed to fetch messages:', error);
      return [];
    }
  }

  /**
   * Create or get the global chat room
   */
  async getGlobalRoom(): Promise<Room | null> {
    try {
      // Try to get existing global room
      let { data: room, error } = await supabase
        .from('rooms')
        .select('*')
        .eq('name', 'Global Chat')
        .eq('room_type', 'public')
        .single();

      // If no global room exists, create one
      if (error && error.code === 'PGRST116') {
        const { data: newRoom, error: createError } = await supabase
          .from('rooms')
          .insert({
            name: 'Global Chat',
            description: 'Welcome to SnakkaZ Global Chat! Connect with the Norwegian tech community.',
            room_type: 'public',
            is_active: true,
            webrtc_enabled: true,
            e2ee_enabled: false
          })
          .select()
          .single();

        if (createError) {
          console.error('Error creating global room:', createError);
          return null;
        }

        room = newRoom;
      } else if (error) {
        console.error('Error fetching global room:', error);
        return null;
      }

      return room as Room;
    } catch (error) {
      console.error('Failed to get global room:', error);
      return null;
    }
  }

  /**
   * Join a user to a room
   */
  async joinRoom(roomId: string, profileId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('room_participants')
        .upsert({
          room_id: roomId,
          profile_id: profileId,
          role: 'member',
          last_activity: new Date().toISOString()
        });

      if (error) {
        console.error('Error joining room:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Failed to join room:', error);
      return false;
    }
  }

  /**
   * Clean up all subscriptions
   */
  cleanup(): void {
    for (const [key, channel] of this.channels) {
      supabase.removeChannel(channel);
    }
    this.channels.clear();
    this.messageHandlers.clear();
    this.roomHandlers.clear();
  }
}

// Export singleton instance
export const realtimeMessageService = new RealtimeMessageService();
