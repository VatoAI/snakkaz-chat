
/**
 * Type definitions for encryption modules
 */

export interface EncryptedMessage {
  encrypted_content: string;
  encryption_key: string;
  iv: string;
  created_at: string;
  sender_id: string;
  receiver_id?: string;
  group_id?: string;
}

export interface MediaEncryptionMetadata {
  name?: string;
  type?: string;
  size?: number;
  lastModified?: number;
  thumbnail?: string;
}

export interface EncryptedMedia {
  url: string;
  encryption_key: string;
  iv: string;
  metadata?: MediaEncryptionMetadata | string;
}
