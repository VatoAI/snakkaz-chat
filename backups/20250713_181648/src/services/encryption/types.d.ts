
// Type definitions for the encryption services

// Private Chat component props
export interface PrivateChatProps {
  currentUserId: string;
  receiverId: string;
  receiverName?: string;
  initialMessages?: Message[];
  onMessageSent?: (message: Message) => void;
  onMessageRead?: (messageId: string) => void;
}

// Message object for the UI
export interface Message {
  id: string;
  content: string;
  senderId: string;
  timestamp: Date;
  isRead: boolean;
  mediaUrl?: string;
  mediaType?: string;
}

// Encrypted message from the database
export interface EncryptedMessage {
  id: string;
  encrypted_content: string;
  iv: string;
  sender_id: string;
  receiver_id: string;
  created_at: string;
  is_read: boolean;
  read_at?: string;
  media_url?: string;
  media_type?: string;
  media_encryption_key?: string;
  media_iv?: string;
}

// Group Chat interfaces
export interface GroupChatProps {
  currentUserId: string;
  groupId: string;
  groupName?: string;
  initialMessages?: Message[];
  onMessageSent?: (message: Message) => void;
  onMessageRead?: (messageId: string) => void;
}

export interface GroupMember {
  id: string;
  userId: string;
  groupId: string;
  joinedAt: Date;
  isAdmin: boolean;
  displayName?: string;
  avatarUrl?: string;
}

// Encryption key interfaces
export interface EncryptionKeyPair {
  publicKey: JsonWebKey;
  privateKey: JsonWebKey;
}

export interface EncryptedSessionKey {
  encryptedKey: string;
  iv: string;
  ephemeralPublicKey: JsonWebKey;
}
