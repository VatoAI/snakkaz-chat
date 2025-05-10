
/**
 * Types for encryption functionality
 */

export interface EncryptedContent {
  encryptedContent: string;
  key: string;
  iv: string;
}

export interface EncryptedMedia {
  encryptedData: string;
  key: string;
  iv: string;
  mimeType?: string;
}

export interface DecryptedMedia {
  mediaBlob: Blob;
  mimeType: string;
  url: string;
}

export interface GroupEncryptionKey {
  id: string;
  groupId: string;
  sessionKey: string;
  createdBy: string;
  createdAt: string;
}
