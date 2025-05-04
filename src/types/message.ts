// Consolidated Message Types for SnakkaZ Chat

// Message reaction interface
export interface MessageReaction {
  userId: string;
  user_id?: string; // For backward compatibility
  emoji: string;
  createdAt: string | Date;
  created_at?: string | Date; // For backward compatibility
}

// Media message interface
export interface MediaMessage {
  url: string;
  type: 'image' | 'video' | 'audio' | 'file';
  name?: string;
  size?: number;
  thumbnailUrl?: string;
  thumbnail_url?: string; // For backward compatibility
  duration?: number; // For audio/video
  isEncrypted?: boolean;
  is_encrypted?: boolean; // For backward compatibility
  decryptionKey?: string;
  decryption_key?: string; // For backward compatibility
}

// MessageContent interface for rendering
export interface MessageContent {
  text?: string;
  media?: MediaMessage;
  attachments?: MediaMessage[];
  replyTo?: {
    id: string;
    content: string;
    sender: string;
  };
  isCiphered?: boolean;
}

// Base message type with all common fields
export interface Message {
  id: string;
  content: string;
  text?: string; // For backward compatibility
  senderId: string;
  sender_id?: string; // For backward compatibility
  createdAt: string;
  created_at?: string; // For backward compatibility
  updatedAt?: string;
  updated_at?: string; // For backward compatibility
  isEdited?: boolean;
  is_edited?: boolean; // For backward compatibility
  isDeleted?: boolean;
  is_deleted?: boolean; // For backward compatibility
  mediaUrl?: string;
  media_url?: string; // For backward compatibility
  mediaType?: 'image' | 'video' | 'audio' | 'file';
  media_type?: string; // For backward compatibility
  media?: MediaMessage;
  thumbnailUrl?: string;
  thumbnail_url?: string; // For backward compatibility
  replyToId?: string;
  reply_to_id?: string; // For backward compatibility
  replyTo?: string;
  replyToMessage?: {
    content: string;
    sender_id: string;
  };
  ttl?: number;
  ephemeral_ttl?: number; // For backward compatibility
  isEncrypted?: boolean;
  is_encrypted?: boolean; // For backward compatibility
  encryption_key?: string;
  iv?: string;
  reactions?: MessageReaction[];
  metadata?: Record<string, any>;
  status?: 'sent' | 'delivered' | 'read' | 'failed';
  isDelivered?: boolean;
  is_delivered?: boolean; // For backward compatibility
  readAt?: string;
  read_at?: string; // For backward compatibility
  readBy?: string[];
  read_by?: string[]; // For backward compatibility
  editedAt?: string;
  edited_at?: string; // For backward compatibility
  deletedAt?: string;
  deleted_at?: string; // For backward compatibility
  isPending?: boolean;
  hasError?: boolean;
}

// Direct message type extending base message
export interface DirectMessage extends Message {
  receiverId: string;
  receiver_id?: string; // For backward compatibility
  chatId?: string;
  chat_id?: string; // For backward compatibility
  room_id?: string;
  groupId?: undefined; // Explicitly undefined for direct messages
  group_id?: undefined; // For backward compatibility
}

// Group message type extending base message
export interface GroupMessage extends Message {
  groupId: string;
  group_id?: string; // For backward compatibility
  room_id?: string;
  receiverId?: undefined; // Explicitly undefined for group messages
  receiver_id?: undefined; // For backward compatibility
}

// Pending message waiting to be sent
export interface PendingMessage {
  id: string;
  content: string;
  senderId: string;
  createdAt: Date | string;
  mediaUrl?: string;
  mediaType?: 'image' | 'video' | 'audio' | 'file';
  thumbnailUrl?: string;
  receiverId?: string; // For direct messages
  groupId?: string; // For group messages
  replyToId?: string;
  ttl?: number;
  isEncrypted?: boolean;
  isPending: boolean;
}

// Comprehensive decrypted message type with all needed fields
export interface DecryptedMessage {
  id: string;
  content: string;
  sender: {
    id: string;
    username: string | null;
    full_name: string | null;
    avatar_url: string | null;
  };
  created_at: string;
  createdAt?: string; // For backward compatibility
  updated_at?: string;
  updatedAt?: string; // For backward compatibility
  encryption_key?: string;
  iv?: string;
  ttl?: number;
  ephemeral_ttl?: number; // For backward compatibility
  media_url?: string;
  mediaUrl?: string; // For backward compatibility
  media_type?: string;
  mediaType?: string; // For backward compatibility
  media?: {
    url: string;
    type: string;
  };
  is_edited?: boolean;
  isEdited?: boolean; // For backward compatibility
  edited_at?: string | null;
  editedAt?: string | null; // For backward compatibility
  is_deleted?: boolean;
  isDeleted?: boolean; // For backward compatibility
  deleted_at?: string | null;
  deletedAt?: string | null; // For backward compatibility
  receiver_id?: string | null;
  receiverId?: string | null; // For backward compatibility
  group_id?: string | null;
  groupId?: string | null; // For backward compatibility
  read_at?: string | null;
  readAt?: string | null; // For backward compatibility
  is_delivered?: boolean;
  isDelivered?: boolean; // For backward compatibility
  is_encrypted?: boolean;
  isEncrypted?: boolean; // For backward compatibility
  replyTo?: string;
  replyToId?: string; // For backward compatibility
  replyToMessage?: {
    content: string;
    sender_id: string;
  };
  status?: string;
  readBy?: string[];
  read_by?: string[]; // For backward compatibility
  room_id?: string | null;
  roomId?: string | null; // For backward compatibility
  isPending?: boolean;
  hasError?: boolean;
}

// Message type enum
export type MessageType = 'text' | 'image' | 'video' | 'audio' | 'file' | 'location' | 'contact' | 'system';

// Utility functions
export const formatMessageDate = (date: Date | string): string => {
  const messageDate = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  
  // Same day, just show time
  if (messageDate.toDateString() === now.toDateString()) {
    return messageDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }
  
  // Yesterday
  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);
  if (messageDate.toDateString() === yesterday.toDateString()) {
    return `I går ${messageDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
  }
  
  // Within a week
  const oneWeekAgo = new Date(now);
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
  if (messageDate > oneWeekAgo) {
    const options: Intl.DateTimeFormatOptions = { weekday: 'long', hour: '2-digit', minute: '2-digit' };
    return messageDate.toLocaleDateString('no-NO', options);
  }
  
  // Older than a week
  const options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' };
  return messageDate.toLocaleDateString('no-NO', options);
};
