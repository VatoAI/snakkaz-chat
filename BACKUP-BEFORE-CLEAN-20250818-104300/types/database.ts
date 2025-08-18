// 🚀 SNAKKAZ CHAT DATABASE TYPES
// TypeScript interfaces for Supabase database

export interface Database {
  public: {
    Tables: {
      chat_rooms: {
        Row: ChatRoom;
        Insert: Omit<ChatRoom, "id" | "created_at" | "updated_at">;
        Update: Partial<Omit<ChatRoom, "id" | "created_at">>;
      };
      messages: {
        Row: Message;
        Insert: Omit<Message, "id" | "created_at" | "updated_at">;
        Update: Partial<Omit<Message, "id" | "created_at">>;
      };
      room_participants: {
        Row: RoomParticipant;
        Insert: Omit<RoomParticipant, "id" | "joined_at" | "last_seen_at">;
        Update: Partial<Omit<RoomParticipant, "id" | "joined_at">>;
      };
      user_profiles: {
        Row: UserProfile;
        Insert: Omit<UserProfile, "created_at" | "updated_at" | "last_seen_at">;
        Update: Partial<Omit<UserProfile, "id" | "created_at">>;
      };
    };
  };
}

// ============================================================================
// CORE TYPES
// ============================================================================

export interface ChatRoom {
  id: string;
  name: string;
  description?: string;
  type: "public" | "private" | "group";
  created_by?: string;
  created_at: string;
  updated_at: string;
  is_active: boolean;
  max_participants: number;
  metadata: Record<string, any>;
}

export interface Message {
  id: string;
  room_id: string;
  user_id: string;
  content: string;
  message_type: "text" | "image" | "file" | "system";
  created_at: string;
  updated_at: string;
  is_edited: boolean;
  reply_to_id?: string;
  metadata: Record<string, any>;
  // Joined data from other tables
  user_profile?: UserProfile;
  reply_to?: Message;
}

export interface RoomParticipant {
  id: string;
  room_id: string;
  user_id: string;
  role: "owner" | "admin" | "member";
  joined_at: string;
  last_seen_at: string;
  is_active: boolean;
  // Joined data
  user_profile?: UserProfile;
}

export interface UserProfile {
  id: string;
  username?: string;
  display_name?: string;
  bio?: string;
  avatar_url?: string;
  status: "online" | "away" | "busy" | "offline";
  last_seen_at: string;
  created_at: string;
  updated_at: string;
  metadata: Record<string, any>;
}

// ============================================================================
// EXTENDED TYPES FOR UI
// ============================================================================

export interface MessageWithProfile extends Message {
  user_profile: UserProfile;
}

export interface ChatRoomWithParticipants extends ChatRoom {
  participants: RoomParticipant[];
  participant_count: number;
  user_role?: "owner" | "admin" | "member";
  last_message?: MessageWithProfile;
}

export interface TypingUser {
  user_id: string;
  display_name: string;
  avatar_url?: string;
}

// ============================================================================
// API RESPONSE TYPES
// ============================================================================

export interface ChatAPIResponse<T> {
  data: T | null;
  error: string | null;
  count?: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  count: number;
  has_more: boolean;
  next_cursor?: string;
}

// ============================================================================
// REAL-TIME SUBSCRIPTION TYPES
// ============================================================================

export type RealtimePayload<T> = {
  eventType: "INSERT" | "UPDATE" | "DELETE";
  new: T;
  old: T;
  errors: string[] | null;
};

export interface MessageSubscription {
  room_id: string;
  callback: (payload: RealtimePayload<Message>) => void;
}

export interface TypingSubscription {
  room_id: string;
  callback: (typing_users: TypingUser[]) => void;
}

// ============================================================================
// HOOK CONFIGURATION TYPES
// ============================================================================

export interface UseMessagesOptions {
  room_id: string;
  limit?: number;
  realtime?: boolean;
  auto_subscribe?: boolean;
}

export interface UseChatRoomsOptions {
  user_id?: string;
  room_type?: "public" | "private" | "group";
  include_participants?: boolean;
  realtime?: boolean;
}

// ============================================================================
// MESSAGE ATTACHMENT TYPES (for future file sharing)
// ============================================================================

export interface MessageAttachment {
  id: string;
  message_id: string;
  file_name: string;
  file_url: string;
  file_type: "image" | "video" | "audio" | "document";
  file_size: number;
  mime_type: string;
  thumbnail_url?: string;
  metadata: Record<string, any>;
  uploaded_by: string;
  created_at: string;
}

// ============================================================================
// UTILITY TYPES
// ============================================================================

export type MessageStatus = "sending" | "sent" | "failed" | "delivered";

export interface OptimisticMessage extends Omit<Message, "id" | "created_at"> {
  id: string; // Temporary UUID
  status: MessageStatus;
  created_at: string; // Temporary timestamp
}

// ============================================================================
// EXPORT MAIN DATABASE TYPE
// ============================================================================

export type SupabaseDatabase = Database;
