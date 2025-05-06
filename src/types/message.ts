import { UserStatus } from './presence';
import { SecurityLevel } from './security';

/**
 * Base message content that can be sent in a chat
 */
export interface MessageContent {
  text?: string;
  mediaUrl?: string;
  mediaType?: string; 
  thumbnailUrl?: string;
  ttl?: number;
  isEncrypted?: boolean;
}

/**
 * Reaction to a message
 */
export interface MessageReaction {
  id: string;
  messageId: string;
  userId: string;
  emoji: string;
  createdAt: string | Date;
  count?: number; // Number of reactions of this type
}

/**
 * Main standardized message interface using camelCase
 */
export interface ChatMessage {
  id: string;
  content?: string;         // Message text content
  senderId: string;         // User ID of sender
  groupId?: string;         // Group ID if group message
  createdAt: string | Date; // Creation timestamp
  updatedAt?: string | Date; // Last update timestamp
  isEdited?: boolean;       // Whether message has been edited
  isDeleted?: boolean;      // Soft delete flag
  isPinned?: boolean;       // Pinned message flag
  mediaUrl?: string;        // URL to media content
  mediaType?: string;       // Type of media (image, video, etc)
  thumbnailUrl?: string;    // Thumbnail for media
  ttl?: number;             // Time-to-live in seconds for disappearing messages
  readBy?: string[];        // Array of user IDs who read the message
  replyToId?: string;       // ID of message being replied to
  isEncrypted?: boolean;    // Whether message content is encrypted
  isPending?: boolean;      // Whether the message is pending delivery
  hasError?: boolean;       // Whether there was an error sending the message
  
  // Properties used in MessageList.tsx and AppMessage.tsx
  timestamp?: string | Date; // Time reference (used for sorting and grouping)
  isRead?: boolean;         // Whether the message is read
  senderName?: string;      // Sender's name
  ephemeral?: boolean;      // Whether the message is temporary
  expiresAt?: string | Date; // When the message expires
  reactions?: MessageReaction[]; // Reactions to the message
  replyToPreview?: string;  // Preview of the reply
  replyToSenderName?: string; // Name of the person being replied to
  fileUrl?: string;         // URL to file
  fileName?: string;        // File name
  text?: string;            // Alias for content
  
  // Optional fields for database compatibility
  sender_id?: string;       // Snake case alias for compatibility
  group_id?: string;
  created_at?: string;
  updated_at?: string;
  is_edited?: boolean;
  is_deleted?: boolean;
  is_pinned?: boolean;
  media_url?: string;
  media_type?: string;
  thumbnail_url?: string;
  read_by?: string[];
  reply_to_id?: string;
  is_encrypted?: boolean;
  
  // Optional sender information
  sender?: {
    id: string;
    displayName?: string;
    username?: string;
    full_name?: string | null;
    avatar?: string;
    avatar_url?: string | null;
  };
}

export interface User {
  id: string;
  username?: string;
  avatar_url?: string;
}

export interface Message {
  id: string;
  sender_id: string;
  content?: string;
  media_url?: string;
  created_at: string;
  updated_at?: string;
  is_edited?: boolean;
  ttl?: number;
  expires_at?: string;
  sender?: User;
}

export interface DecryptedMessage {
  id: string;
  sender: User;
  content?: string;
  media_url?: string;
  timestamp?: string;
  created_at?: string;
  is_edited?: boolean;
  ttl?: number;
  is_encrypted?: boolean;
}
