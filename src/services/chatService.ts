import { supabase } from "../lib/supabaseClient";
import { RealtimeChannel } from "@supabase/supabase-js";

export interface Message {
  id: string;
  group_id?: string; // room_id equivalent
  sender_id: string;
  receiver_id?: string;
  encrypted_content: string;
  encryption_key?: string;
  iv?: string;
  media_url?: string;
  media_type?: string;
  media_encryption_key?: string;
  media_iv?: string;
  media_metadata?: any;
  is_edited: boolean;
  edited_at?: string;
  is_deleted: boolean;
  deleted_at?: string;
  read_at?: string;
  is_delivered: boolean;
  ephemeral_ttl?: number;
  created_at: string;
  updated_at: string;
  sender?: {
    id: string;
    username: string;
    full_name: string;
    avatar_url?: string;
  };
}

export interface ChatRoom {
  id: string;
  name: string;
  description?: string;
  type: string;
  created_by: string;
  created_at: string;
  updated_at: string;
  is_active: boolean;
  max_participants: number;
  invite_code?: string;
  metadata?: any;
  participants?: RoomParticipant[];
  last_message?: Message;
  unread_count?: number;
}

export interface RoomParticipant {
  id: string;
  room_id: string;
  user_id: string;
  role: "owner" | "admin" | "member";
  joined_at: string;
  user?: UserProfile;
}

export interface UserProfile {
  id: string;
  username: string;
  full_name: string;
  avatar_url?: string;
  created_at: string;
  updated_at: string;
  pin_preferences?: any;
  is_admin: boolean;
}

class ChatService {
  private channels: Map<string, RealtimeChannel> = new Map();
  private messageCallbacks: Map<string, ((message: Message) => void)[]> =
    new Map();

  // Initialize user profile on first login
  async initializeUserProfile(): Promise<UserProfile | null> {
    try {
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();
      if (authError || !user) throw authError;

      // Check if profile exists in profiles table
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (profileError) {
        // Create profile if it doesn't exist
        const { data: newProfile, error: createError } = await supabase
          .from("profiles")
          .insert({
            id: user.id,
            username:
              user.email?.split("@")[0] || `user_${user.id.slice(0, 8)}`,
            full_name:
              user.user_metadata?.full_name || user.email || "Anonymous User",
            avatar_url: user.user_metadata?.avatar_url,
            is_admin: false,
          })
          .select()
          .single();

        if (createError) throw createError;
        return newProfile;
      }

      return profile;
    } catch (error) {
      console.error("Error initializing user profile:", error);
      return null;
    }
  }

  // Get all chat rooms for the user
  async getChatRooms(): Promise<ChatRoom[]> {
    try {
      const { data: rooms, error } = await supabase
        .from("chat_rooms")
        .select("*")
        .eq("is_active", true)
        .order("updated_at", { ascending: false });

      if (error) throw error;
      return rooms || [];
    } catch (error) {
      console.error("Error fetching chat rooms:", error);
      return [];
    }
  }

  // Get messages for a specific room
  async getMessages(roomId: string, limit: number = 50): Promise<Message[]> {
    try {
      const { data: messages, error } = await supabase
        .from("messages")
        .select(
          `
          *,
          sender:profiles!messages_sender_id_fkey(
            id,
            username,
            full_name,
            avatar_url
          )
        `
        )
        .eq("group_id", roomId)
        .eq("is_deleted", false)
        .order("created_at", { ascending: false })
        .limit(limit);

      if (error) throw error;
      return (messages || []).reverse();
    } catch (error) {
      console.error("Error fetching messages:", error);
      return [];
    }
  }

  // Send a message (simplified for testing)
  async sendMessage(roomId: string, content: string): Promise<boolean> {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated");

      // For now, store content as encrypted_content without actual encryption
      const { error } = await supabase.from("messages").insert({
        group_id: roomId,
        sender_id: user.id,
        encrypted_content: content, // In real app, this would be encrypted
        is_edited: false,
        is_deleted: false,
        is_delivered: true,
        media_type: "text",
      });

      if (error) throw error;
      return true;
    } catch (error) {
      console.error("Error sending message:", error);
      return false;
    }
  }

  // Subscribe to real-time messages for a room
  subscribeToMessages(
    roomId: string,
    callback: (message: Message) => void
  ): () => void {
    if (!this.messageCallbacks.has(roomId)) {
      this.messageCallbacks.set(roomId, []);
    }
    this.messageCallbacks.get(roomId)!.push(callback);

    if (!this.channels.has(roomId)) {
      const channel = supabase
        .channel(`room-${roomId}`)
        .on(
          "postgres_changes",
          {
            event: "INSERT",
            schema: "public",
            table: "messages",
            filter: `group_id=eq.${roomId}`,
          },
          async (payload) => {
            // Fetch the complete message with sender info
            const { data: message } = await supabase
              .from("messages")
              .select(
                `
                *,
                sender:profiles!messages_sender_id_fkey(
                  id,
                  username,
                  full_name,
                  avatar_url
                )
              `
              )
              .eq("id", payload.new.id)
              .single();

            if (message) {
              this.messageCallbacks.get(roomId)?.forEach((cb) => cb(message));
            }
          }
        )
        .subscribe();

      this.channels.set(roomId, channel);
    }

    // Return unsubscribe function
    return () => {
      const callbacks = this.messageCallbacks.get(roomId);
      if (callbacks) {
        const index = callbacks.indexOf(callback);
        if (index > -1) {
          callbacks.splice(index, 1);
        }
        if (callbacks.length === 0) {
          this.channels.get(roomId)?.unsubscribe();
          this.channels.delete(roomId);
          this.messageCallbacks.delete(roomId);
        }
      }
    };
  }

  // Create a new chat room
  async createRoom(
    name: string,
    description?: string,
    type: string = "group"
  ): Promise<ChatRoom | null> {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated");

      const { data: room, error } = await supabase
        .from("chat_rooms")
        .insert({
          name,
          description,
          type,
          created_by: user.id,
          is_active: true,
          max_participants: 1000,
        })
        .select()
        .single();

      if (error) throw error;
      return room;
    } catch (error) {
      console.error("Error creating room:", error);
      return null;
    }
  }

  // Clean up subscriptions
  cleanup(): void {
    this.channels.forEach((channel) => channel.unsubscribe());
    this.channels.clear();
    this.messageCallbacks.clear();
  }
}

export const chatService = new ChatService();
export default chatService;
