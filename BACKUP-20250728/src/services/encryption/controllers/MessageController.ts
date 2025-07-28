/**
 * Message Controller
 * 
 * Handles business logic for message operations in the Snakkaz chat application.
 * Manages message creation, encryption, delivery, and storage.
 */

import { Message, MessageAttachment } from '../models/Message';
import { User } from '../models/User';
import { encryptAesGcm, decryptAesGcm, importKeyFromJwk, encryptRsaOaep } from '../cryptoUtils';
import { keyStorageService } from '../keyStorageService';

export class MessageController {
  /**
   * Create a new message
   * 
   * @param content - The message content
   * @param sender - The sending user
   * @param isEncrypted - Whether to encrypt the message
   * @param recipients - Array of recipient user IDs (for encrypted messages)
   * @param attachments - Optional attachments
   * @returns The created message
   */
  async createMessage(
    content: string, 
    sender: User, 
    isEncrypted: boolean = true,
    recipients: string[] = [],
    attachments: MessageAttachment[] = []
  ): Promise<Message> {
    // Generate a unique ID
    const messageId = `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // Create message with initial content
    let finalContent = content;
    let encryptionKeyId: string | undefined = undefined;
    
    // Handle encryption if required
    if (isEncrypted && recipients.length > 0) {
      // Generate a symmetric key for this message
      encryptionKeyId = `msg_key_${messageId}`;
      
      // Encrypt the message content
      finalContent = await this.encryptMessageContent(content, encryptionKeyId, recipients);
      
      // Encrypt attachments if present
      if (attachments.length > 0) {
        for (const attachment of attachments) {
          attachment.isEncrypted = true;
          attachment.encryptionKeyId = encryptionKeyId;
        }
      }
    }
    
    // Create the message object
    const message = new Message(
      messageId,
      finalContent,
      sender.id,
      sender.displayName,
      new Date(),
      isEncrypted,
      encryptionKeyId,
      recipients,
      attachments
    );
    
    return message;
  }
  
  /**
   * Encrypt message content for recipients
   * 
   * @param content - Message content to encrypt
   * @param keyId - ID for the encryption key
   * @param recipients - User IDs to encrypt for
   * @returns Encrypted content
   */
  private async encryptMessageContent(
    content: string,
    keyId: string,
    recipients: string[]
  ): Promise<string> {
    try {
      // Generate a random AES key for this message
      const encoder = new TextEncoder();
      const contentBuffer = encoder.encode(content);
      
      // Create a random symmetric key for the message
      const messageKey = await window.crypto.subtle.generateKey(
        { name: 'AES-GCM', length: 256 },
        true,
        ['encrypt', 'decrypt']
      );
      
      // Encrypt the message content with this key
      const iv = window.crypto.getRandomValues(new Uint8Array(12));
      const encryptedContent = await window.crypto.subtle.encrypt(
        { name: 'AES-GCM', iv },
        messageKey,
        contentBuffer
      );
      
      // Export the message key to encrypt it for each recipient
      const exportedKey = await window.crypto.subtle.exportKey('raw', messageKey);
      
      // Store message key in the key storage service
      await keyStorageService.storeKey(
        keyId,
        JSON.stringify({
          key: Array.from(new Uint8Array(exportedKey)),
          iv: Array.from(iv)
        }),
        true
      );
      
      // Convert encrypted content to base64
      const encryptedBase64 = btoa(String.fromCharCode(...new Uint8Array(encryptedContent)));
      
      return encryptedBase64;
    } catch (error) {
      console.error("Error encrypting message:", error);
      throw new Error("Failed to encrypt message");
    }
  }
  
  /**
   * Decrypt message content
   * 
   * @param message - The message to decrypt
   * @param currentUserId - ID of the current user
   * @returns Decrypted message content
   */
  async decryptMessage(message: Message, currentUserId: string): Promise<string> {
    if (!message.isEncrypted || !message.encryptionKeyId) {
      return message.content; // Already plaintext
    }
    
    try {
      // Check if the current user is authorized to decrypt
      if (message.recipients && !message.recipients.includes(currentUserId)) {
        throw new Error("User is not authorized to decrypt this message");
      }
      
      // Retrieve the message key
      const storedKey = await keyStorageService.retrieveKey(message.encryptionKeyId);
      
      if (!storedKey) {
        throw new Error("Message key not found");
      }
      
      // Parse the stored key data
      const keyData = JSON.parse(storedKey);
      const keyArray = new Uint8Array(keyData.key);
      const iv = new Uint8Array(keyData.iv);
      
      // Import the message key
      const messageKey = await window.crypto.subtle.importKey(
        'raw',
        keyArray,
        { name: 'AES-GCM', length: 256 },
        false,
        ['decrypt']
      );
      
      // Decode the base64 content
      const encryptedBytes = Uint8Array.from(atob(message.content), c => c.charCodeAt(0));
      
      // Decrypt the content
      const decryptedBuffer = await window.crypto.subtle.decrypt(
        { name: 'AES-GCM', iv },
        messageKey,
        encryptedBytes
      );
      
      // Convert to string
      const decoder = new TextDecoder();
      return decoder.decode(decryptedBuffer);
    } catch (error) {
      console.error("Error decrypting message:", error);
      return "[Encrypted Message]"; // Fallback for UI
    }
  }
  
  /**
   * Create a message attachment
   * 
   * @param file - The file to attach
   * @param isEncrypted - Whether to encrypt the attachment
   * @returns The created attachment
   */
  async createAttachment(
    file: File,
    isEncrypted: boolean = true
  ): Promise<MessageAttachment> {
    // Generate a unique ID
    const attachmentId = `att_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // Determine attachment type
    let type: 'image' | 'file' | 'audio' | 'video' = 'file';
    if (file.type.startsWith('image/')) type = 'image';
    else if (file.type.startsWith('audio/')) type = 'audio';
    else if (file.type.startsWith('video/')) type = 'video';
    
    // In a real app, this would upload the file to storage and get a URL
    // For this example, we'll use a placeholder URL
    const url = `https://example.com/attachments/${attachmentId}`;
    
    // Create the attachment
    const attachment = new MessageAttachment(
      attachmentId,
      type,
      url,
      file.name,
      file.size,
      isEncrypted
    );
    
    return attachment;
  }
}
