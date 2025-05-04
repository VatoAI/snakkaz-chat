
export interface Message {
  id: string;
  senderId: string;
  content: string;
  createdAt: string | Date;
  isEdited?: boolean;
  isDeleted?: boolean;
  mediaUrl?: string;
  mediaType?: 'image' | 'video' | 'audio' | 'file';
  thumbnailUrl?: string;
  replyToId?: string;
  ttl?: number; // time-to-live in seconds for disappearing messages
  isEncrypted?: boolean;
  reactions?: MessageReaction[];
  metadata?: Record<string, any>;
  status?: 'sent' | 'delivered' | 'read' | 'failed';
  
  // Compatibility properties for API responses with snake_case
  sender_id?: string;
  text?: string;
  created_at?: string | Date;
  is_edited?: boolean;
  is_deleted?: boolean;
  media_url?: string;
  media_type?: 'image' | 'video' | 'audio' | 'file';
  thumbnail_url?: string;
  reply_to_id?: string;
  is_encrypted?: boolean;
}

export interface MessageReaction {
  userId: string;
  emoji: string;
  createdAt: string | Date;
}

export interface DirectMessage extends Message {
  receiverId: string;
  receiver_id?: string; // Compatibility property
  chatId?: string;
  chat_id?: string; // Compatibility property
}

export interface GroupMessage extends Message {
  groupId: string;
  group_id?: string; // Compatibility property
}

export interface PendingMessage {
  id: string;
  content: string;
  senderId: string;
  createdAt: Date;
  mediaUrl?: string;
  mediaType?: 'image' | 'video' | 'audio' | 'file';
  thumbnailUrl?: string;
  receiverId?: string; // for direct messages
  groupId?: string; // for group messages
  replyToId?: string;
  ttl?: number;
  isEncrypted?: boolean;
}

export type MessageType = 'text' | 'image' | 'video' | 'audio' | 'file' | 'location' | 'contact' | 'system';

export interface MediaMessage {
  url: string;
  type: 'image' | 'video' | 'audio' | 'file';
  name?: string;
  size?: number;
  thumbnailUrl?: string;
  duration?: number; // For audio/video
  isEncrypted?: boolean;
  decryptionKey?: string;
}

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

// Add the missing DecryptedMessage export for backwards compatibility
export type { DecryptedMessage } from './message.d';
