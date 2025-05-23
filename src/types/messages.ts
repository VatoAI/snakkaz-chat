/**
 * Re-export av message-typer (for bakoverkompatibilitet)
 * Dette løser problemet med feilaktig flertallsreferanse i importeringssetninger
 */

export * from './message';
export type { DecryptedMessage } from './message.d';

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
  count?: number; // Antall reaksjoner av denne typen
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
  
  // Egenskaper som brukes i MessageList.tsx og AppMessage.tsx
  timestamp?: string | Date; // Tidsangivelse (brukt for sortering og groupering)
  isRead?: boolean;         // Om meldingen er lest
  senderName?: string;      // Avsenderens navn
  ephemeral?: boolean;      // Om meldingen er midlertidig
  expiresAt?: string | Date; // Når meldingen utløper
  reactions?: MessageReaction[]; // Reaksjoner på meldingen
  replyToPreview?: string;  // Forhåndsvisning av svaret
  replyToSenderName?: string; // Navnet på den som ble svart til
  fileUrl?: string;         // URL til fil
  fileName?: string;        // Filnavn
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

/**
 * Utility type for message with required sender information
 */
export type ChatMessageWithSender = ChatMessage & {
  sender: {
    id: string;
    displayName: string;
    username?: string;
    avatar?: string;
  };
};

/**
 * Input type for the normalizeMessage function that accepts both camelCase and snake_case properties
 */
export type MessageInput = Partial<ChatMessage> & {
  [key: string]: unknown; // Allow for unknown properties from external APIs
};

/**
 * Helper function to normalize message properties to camelCase
 * Use this when receiving messages from the API to ensure consistent property access
 */
export function normalizeMessage(message: MessageInput): ChatMessage {
  return {
    id: message.id,
    content: message.content || message.text || '',
    senderId: message.senderId || message.sender_id || '',
    groupId: message.groupId || message.group_id,
    createdAt: message.createdAt || message.created_at || new Date(),
    updatedAt: message.updatedAt || message.updated_at,
    isEdited: message.isEdited || message.is_edited || false,
    isDeleted: message.isDeleted || message.is_deleted || false,
    isPinned: message.isPinned || message.is_pinned || false,
    mediaUrl: message.mediaUrl || message.media_url,
    mediaType: message.mediaType || message.media_type,
    thumbnailUrl: message.thumbnailUrl || message.thumbnail_url,
    ttl: message.ttl,
    readBy: message.readBy || message.read_by || [],
    replyToId: message.replyToId || message.reply_to_id,
    isEncrypted: message.isEncrypted || message.is_encrypted || false,
    isPending: message.isPending || false,
    hasError: message.hasError || false,
    sender: message.sender,
    
    // Nye egenskaper
    timestamp: message.timestamp || message.createdAt || message.created_at || new Date(),
    isRead: message.isRead || false,
    senderName: message.senderName || message.sender?.username || message.sender?.displayName || '',
    ephemeral: message.ephemeral || false,
    expiresAt: message.expiresAt || null,
    reactions: message.reactions || [],
    replyToPreview: message.replyToPreview || '',
    replyToSenderName: message.replyToSenderName || '',
    fileUrl: message.fileUrl || message.mediaUrl || message.media_url || '',
    fileName: message.fileName || '',
    
    // Preserve original fields for backward compatibility
    text: message.content || message.text,
    sender_id: message.senderId || message.sender_id,
    group_id: message.groupId || message.group_id,
    created_at: typeof message.createdAt === 'string' ? message.createdAt : 
                typeof message.created_at === 'string' ? message.created_at : 
                new Date().toISOString(),
    is_edited: message.isEdited || message.is_edited || false,
  };
}
