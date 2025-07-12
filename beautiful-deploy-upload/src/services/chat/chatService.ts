/**
 * SnakkaZ Chat Service - Real-time Chat Management
 * Production-ready service for chat functionality
 */

import { supabase } from '@/lib/supabaseClient';

export interface ChatRoom {
  id: string;
  name: string;
  description?: string;
  type: 'public' | 'private' | 'group';
  created_by?: string;
  created_at: string;
  is_active: boolean;
  max_participants: number;
  participant_count?: number;
}

export interface Message {
  id: string;
  room_id: string;
  user_id: string;
  content: string;
  message_type: 'text' | 'image' | 'file' | 'system';
  created_at: string;
  updated_at: string;
  is_edited: boolean;
  reply_to_id?: string;
  user_profile?: {
    username: string;
    display_name: string;
    avatar_url?: string;
  };
}

export interface UserProfile {
  id: string;
  username: string;
  display_name: string;
  bio?: string;
  avatar_url?: string;
  status: 'online' | 'away' | 'busy' | 'offline';
  last_seen_at: string;
}

class ChatService {
  private static instance: ChatService;
  private subscriptions: Map<string, any> = new Map();

  static getInstance(): ChatService {
    if (!ChatService.instance) {
      ChatService.instance = new ChatService();
    }
    return ChatService.instance;
  }

  /**
   * Get all public chat rooms with participant counts
   */
  async getChatRooms(): Promise<ChatRoom[]> {
    try {
      const { data, error } = await supabase
        .from('chat_rooms')
        .select(`
          *,
          participant_count:room_participants(count)
        `)
        .eq('is_active', true)
        .order('created_at', { ascending: true });

      if (error) throw error;

      return data?.map(room => ({
        ...room,
        participant_count: room.participant_count?.[0]?.count || 0
      })) || [];
    } catch (error) {
      console.error('Error fetching chat rooms:', error);
      throw error;
    }
  }

  /**
   * Get messages for a specific room with user profiles
   */
  async getMessages(roomId: string, limit: number = 50): Promise<Message[]> {
    try {
      const { data, error } = await supabase
        .from('messages')
        .select(`
          *,
          user_profile:user_profiles(username, display_name, avatar_url)
        `)
        .eq('room_id', roomId)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) throw error;

      return (data || []).reverse();
    } catch (error) {
      console.error('Error fetching messages:', error);
      throw error;
    }
  }

  /**
   * Send a message to a room
   */
  async sendMessage(roomId: string, content: string, messageType: 'text' | 'image' | 'file' = 'text'): Promise<Message> {
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('messages')
        .insert({
          room_id: roomId,
          user_id: user.user.id,
          content,
          message_type: messageType
        })
        .select(`
          *,
          user_profile:user_profiles(username, display_name, avatar_url)
        `)
        .single();

      if (error) throw error;

      return data;
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  }

  /**
   * Subscribe to real-time messages for a room
   */
  subscribeToMessages(roomId: string, onMessage: (message: Message) => void): () => void {
    const channel = supabase
      .channel(`messages:${roomId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `room_id=eq.${roomId}`
        },
        async (payload) => {
          // Fetch the complete message with user profile
          const { data } = await supabase
            .from('messages')
            .select(`
              *,
              user_profile:user_profiles(username, display_name, avatar_url)
            `)
            .eq('id', payload.new.id)
            .single();

          if (data) {
            onMessage(data);
          }
        }
      )
      .subscribe();

    // Store subscription for cleanup
    this.subscriptions.set(`messages:${roomId}`, channel);

    // Return unsubscribe function
    return () => {
      channel.unsubscribe();
      this.subscriptions.delete(`messages:${roomId}`);
    };
  }

  /**
   * Subscribe to user presence (online/offline status)
   */
  subscribeToPresence(roomId: string, onPresenceChange: (users: UserProfile[]) => void): () => void {
    const channel = supabase
      .channel(`presence:${roomId}`)
      .on('presence', { event: 'sync' }, () => {
        const state = channel.presenceState();
        const users = Object.values(state).flat().map((presence: any) => ({
          id: presence.user_id || '',
          username: presence.username || '',
          display_name: presence.display_name || '',
          status: 'online' as const,
          last_seen_at: presence.joined_at || new Date().toISOString(),
        })) as UserProfile[];
        onPresenceChange(users);
      })
      .on('presence', { event: 'join' }, ({ key, newPresences }) => {
        console.log('User joined:', key, newPresences);
      })
      .on('presence', { event: 'leave' }, ({ key, leftPresences }) => {
        console.log('User left:', key, leftPresences);
      })
      .subscribe();

    // Store subscription for cleanup
    this.subscriptions.set(`presence:${roomId}`, channel);

    return () => {
      channel.unsubscribe();
      this.subscriptions.delete(`presence:${roomId}`);
    };
  }

  /**
   * Join a room's presence
   */
  async joinRoomPresence(roomId: string): Promise<void> {
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) return;

      const { data: profile } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', user.user.id)
        .single();

      if (profile) {
        const channel = this.subscriptions.get(`presence:${roomId}`);
        if (channel) {
          await channel.track({
            user_id: profile.id,
            username: profile.username,
            display_name: profile.display_name,
            status: 'online',
            joined_at: new Date().toISOString()
          });
        }
      }
    } catch (error) {
      console.error('Error joining room presence:', error);
    }
  }

  /**
   * Leave a room's presence
   */
  async leaveRoomPresence(roomId: string): Promise<void> {
    const channel = this.subscriptions.get(`presence:${roomId}`);
    if (channel) {
      await channel.untrack();
    }
  }

  /**
   * Get online users in a room
   */
  async getOnlineUsers(_roomId?: string): Promise<UserProfile[]> {
    try {
      const { data } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('status', 'online')
        .limit(10);

      return data || [];
    } catch (error) {
      console.error('Error fetching online users:', error);
      return [];
    }
  }

  /**
   * Update user status
   */
  async updateUserStatus(status: 'online' | 'away' | 'busy' | 'offline'): Promise<void> {
    try {
      const { error } = await supabase.rpc('update_user_status', {
        new_status: status
      });

      if (error) throw error;
    } catch (error) {
      console.error('Error updating user status:', error);
      throw error;
    }
  }

  /**
   * Create a new group chat
   */
  async createGroup(name: string, description?: string): Promise<ChatRoom> {
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('chat_rooms')
        .insert({
          name,
          description,
          type: 'group',
          created_by: user.user.id
        })
        .select()
        .single();

      if (error) throw error;

      // Add creator as owner
      await supabase
        .from('room_participants')
        .insert({
          room_id: data.id,
          user_id: user.user.id,
          role: 'owner'
        });

      return data;
    } catch (error) {
      console.error('Error creating group:', error);
      throw error;
    }
  }

  /**
   * Update user presence status
   */
  async updatePresence(isOnline: boolean): Promise<void> {
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) return;

      await supabase
        .from('user_profiles')
        .upsert({
          id: user.user.id,
          status: isOnline ? 'online' : 'offline',
          last_seen_at: new Date().toISOString()
        });
    } catch (error) {
      console.error('Error updating presence:', error);
    }
  }

  /**
   * Clean up all subscriptions
   */
  cleanup(): void {
    this.subscriptions.forEach((channel) => {
      channel.unsubscribe();
    });
    this.subscriptions.clear();
  }
}

// Export singleton instance
export const chatService = ChatService.getInstance();

// Hook for easy usage in React components
export const useChatService = () => {
  return chatService;
};
