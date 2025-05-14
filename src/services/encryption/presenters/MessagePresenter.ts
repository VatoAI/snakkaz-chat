/**
 * Message Presenter
 * 
 * Presents message data to the UI and handles message-related user interactions.
 * Manages formatting, rendering, and security aspects of message display.
 */

import { BasePresenter, View } from './BasePresenter';
import { Message, MessageAttachment } from '../models/Message';
import { MessageController } from '../controllers/MessageController';
import { User } from '../models/User';

export interface MessageView extends View {
  renderMessage(message: Message, content: string): void;
  renderAttachment(attachment: MessageAttachment, messageId: string): void;
  showMessageStatus(status: 'sending' | 'sent' | 'failed', messageId?: string): void;
  showError(message: string): void;
}

export class MessagePresenter extends BasePresenter<MessageView> {
  constructor(private messageController: MessageController) {
    super();
  }
  
  /**
   * Handle displaying a message
   * 
   * @param message - Message to display
   * @param currentUser - Currently logged in user
   */
  async displayMessage(message: Message, currentUser: User): Promise<void> {
    try {
      // Determine if we need to decrypt
      let messageContent = message.content;
      
      if (message.isEncrypted) {
        try {
          messageContent = await this.messageController.decryptMessage(
            message,
            currentUser.id
          );
        } catch (error) {
          console.error("Failed to decrypt message:", error);
          messageContent = "[Encrypted Message]";
        }
      }
      
      // Display the message
      if (this.view) {
        this.view.renderMessage(message, messageContent);
        
        // Display attachments if present
        if (message.attachments && message.attachments.length > 0) {
          for (const attachment of message.attachments) {
            this.view.renderAttachment(attachment, message.id);
          }
        }
      }
    } catch (error) {
      console.error("Error displaying message:", error);
      if (this.view) {
        this.view.showError("Failed to display message: " + (error as Error).message);
      }
    }
  }
  
  /**
   * Handle creating a new message
   * 
   * @param content - Message content
   * @param sender - User sending the message
   * @param isEncrypted - Whether to encrypt the message
   * @param recipients - User IDs to encrypt for
   * @param files - File attachments
   * @returns The created message
   */
  async createMessage(
    content: string,
    sender: User,
    isEncrypted: boolean = true,
    recipients: string[] = [],
    files: File[] = []
  ): Promise<Message> {
    if (this.view) {
      this.view.showMessageStatus('sending');
    }
    
    try {
      // Process attachments
      const attachments: MessageAttachment[] = [];
      
      if (files.length > 0) {
        for (const file of files) {
          const attachment = await this.messageController.createAttachment(file, isEncrypted);
          attachments.push(attachment);
        }
      }
      
      // Create the message
      const message = await this.messageController.createMessage(
        content,
        sender,
        isEncrypted,
        recipients,
        attachments
      );
      
      if (this.view) {
        this.view.showMessageStatus('sent', message.id);
      }
      
      return message;
    } catch (error) {
      console.error("Error creating message:", error);
      if (this.view) {
        this.view.showMessageStatus('failed');
        this.view.showError("Failed to create message: " + (error as Error).message);
      }
      throw error;
    }
  }
  
  /**
   * Format message timestamps for display
   * 
   * @param message - Message to format timestamp for
   * @returns Formatted timestamp string
   */
  formatMessageTimestamp(message: Message): string {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    const messageDate = new Date(message.timestamp);
    const messageDay = new Date(messageDate.getFullYear(), messageDate.getMonth(), messageDate.getDate());
    
    if (messageDay.getTime() === today.getTime()) {
      return `Today at ${messageDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    } else if (messageDay.getTime() === yesterday.getTime()) {
      return `Yesterday at ${messageDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    } else {
      return messageDate.toLocaleString([], {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    }
  }
  
  /**
   * Get attachment display information
   * 
   * @param attachment - The attachment to get info for
   * @returns Object with display properties
   */
  getAttachmentDisplayInfo(attachment: MessageAttachment): any {
    const info: any = {
      name: attachment.name,
      size: this.formatFileSize(attachment.size),
      url: attachment.url,
      isEncrypted: attachment.isEncrypted
    };
    
    // Add type-specific properties
    switch (attachment.type) {
      case 'image':
        info.icon = 'image';
        info.canPreview = true;
        break;
      case 'audio':
        info.icon = 'music_note';
        info.canPreview = true;
        break;
      case 'video':
        info.icon = 'videocam';
        info.canPreview = true;
        break;
      case 'file':
      default:
        info.icon = 'description';
        info.canPreview = false;
        break;
    }
    
    return info;
  }
  
  /**
   * Format file size for display
   * 
   * @param bytes - File size in bytes
   * @returns Formatted size string
   */
  private formatFileSize(bytes: number): string {
    if (bytes < 1024) {
      return `${bytes} B`;
    } else if (bytes < 1024 * 1024) {
      return `${(bytes / 1024).toFixed(1)} KB`;
    } else if (bytes < 1024 * 1024 * 1024) {
      return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    } else {
      return `${(bytes / (1024 * 1024 * 1024)).toFixed(1)} GB`;
    }
  }
}
