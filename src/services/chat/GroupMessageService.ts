import { supabase } from "@/integrations/supabase/client";
import { encryptGroupMessage, decryptGroupMessage } from "@/services/encryption/groupMessageEncryption";
import { toast } from "@/components/ui/use-toast";

/**
 * Enhanced Group Message Service
 * Provides secure message handling for group chats with automatic recovery
 */
export class GroupMessageService {
  private groupId: string;
  private userId: string;
  private memberIds: string[];
  private pendingMessages: Array<{
    content: string;
    attempts: number;
    timestamp: number;
  }> = [];
  private readonly MAX_RETRIES = 3;
  private retryTimer: NodeJS.Timeout | null = null;
  
  constructor(groupId: string, userId: string, memberIds: string[]) {
    this.groupId = groupId;
    this.userId = userId;
    this.memberIds = memberIds;
    
    // Load any pending messages from localStorage
    this.loadPendingMessages();
    
    // Try to send any pending messages
    this.processPendingMessages();
  }
  
  /**
   * Send a message to the group
   * @param content The message content
   * @returns A promise that resolves when the message is sent
   */
  async sendMessage(content: string): Promise<boolean> {
    try {
      if (!content.trim()) return false;
      
      // Try to encrypt and send the message
      const encryptedMessage = await encryptGroupMessage(this.groupId, content);
      
      // Send to Supabase
      const { error } = await supabase
        .from('messages')
        .insert({
          sender_id: this.userId,
          group_id: this.groupId,
          encrypted_content: encryptedMessage.ciphertext,
          encryption_iv: encryptedMessage.iv,
          encryption_key_id: encryptedMessage.keyId,
          is_encrypted: true,
          is_group_message: true
        });
      
      if (error) {
        console.error('Failed to send group message:', error);
        
        // Save to pending messages for retry
        this.addPendingMessage(content);
        return false;
      }
      
      return true;
    } catch (error) {
      console.error('Error in group message sending:', error);
      
      // Add to pending messages for retry
      this.addPendingMessage(content);
      
      // Show error to user
      toast({
        title: 'Message not sent',
        description: 'Your message will be sent when connection is restored',
        variant: 'destructive',
      });
      
      return false;
    }
  }
  
  /**
   * Add a message to the pending queue
   */
  private addPendingMessage(content: string): void {
    this.pendingMessages.push({
      content,
      attempts: 0,
      timestamp: Date.now()
    });
    
    // Save to localStorage
    this.savePendingMessages();
    
    // Start retry process if not already running
    if (!this.retryTimer) {
      this.startRetryProcess();
    }
  }
  
  /**
   * Save pending messages to localStorage
   */
  private savePendingMessages(): void {
    try {
      localStorage.setItem(
        `pending_group_messages_${this.groupId}`, 
        JSON.stringify(this.pendingMessages)
      );
    } catch (error) {
      console.error('Failed to save pending messages:', error);
    }
  }
  
  /**
   * Load pending messages from localStorage
   */
  private loadPendingMessages(): void {
    try {
      const saved = localStorage.getItem(`pending_group_messages_${this.groupId}`);
      if (saved) {
        this.pendingMessages = JSON.parse(saved);
      }
    } catch (error) {
      console.error('Failed to load pending messages:', error);
    }
  }
  
  /**
   * Start the retry process for pending messages
   */
  private startRetryProcess(): void {
    this.retryTimer = setInterval(() => {
      this.processPendingMessages();
    }, 10000); // Try every 10 seconds
  }
  
  /**
   * Process pending messages
   */
  private async processPendingMessages(): Promise<void> {
    if (this.pendingMessages.length === 0) {
      if (this.retryTimer) {
        clearInterval(this.retryTimer);
        this.retryTimer = null;
      }
      return;
    }
    
    // Try to send the first pending message
    const message = this.pendingMessages[0];
    message.attempts++;
    
    try {
      const encryptedMessage = await encryptGroupMessage(this.groupId, message.content);
      
      const { error } = await supabase
        .from('messages')
        .insert({
          sender_id: this.userId,
          group_id: this.groupId,
          encrypted_content: encryptedMessage.ciphertext,
          encryption_iv: encryptedMessage.iv,
          encryption_key_id: encryptedMessage.keyId,
          is_encrypted: true,
          is_group_message: true,
          created_at: new Date(message.timestamp).toISOString()
        });
      
      if (!error) {
        // Success, remove from pending
        this.pendingMessages.shift();
        this.savePendingMessages();
        
        // Show success message if this was a retry
        if (message.attempts > 1) {
          toast({
            title: 'Message sent',
            description: 'Your message has been delivered',
            duration: 3000,
          });
        }
      } else if (message.attempts >= this.MAX_RETRIES) {
        // Too many failures, remove from queue
        this.pendingMessages.shift();
        this.savePendingMessages();
        
        toast({
          title: 'Message failed',
          description: 'Could not send your message after multiple attempts',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Error processing pending message:', error);
      
      // If max attempts reached, remove from queue
      if (message.attempts >= this.MAX_RETRIES) {
        this.pendingMessages.shift();
        this.savePendingMessages();
      }
    }
  }
  
  /**
   * Clean up resources
   */
  cleanup(): void {
    if (this.retryTimer) {
      clearInterval(this.retryTimer);
      this.retryTimer = null;
    }
  }
}
