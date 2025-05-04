/**
 * Message Queue Service for handling offline message sending
 * 
 * This service stores messages when offline and attempts to send them
 * when the connection is restored.
 */
import { v4 as uuidv4 } from 'uuid';
import { MessageContent } from '../types/messages';

export interface QueuedMessage {
  id: string;
  groupId?: string;
  recipientId?: string; // For direct messages
  content: MessageContent;
  timestamp: number;
  sendAttempts: number;
  lastAttempt?: number;
}

// Local storage key for the message queue
const MESSAGE_QUEUE_KEY = 'snakkaz_message_queue';

// Maximum number of send attempts
const MAX_SEND_ATTEMPTS = 5;

/**
 * Message Queue Service
 */
export class MessageQueueService {
  private queue: QueuedMessage[] = [];
  private isOnline: boolean = navigator.onLine;
  private isProcessing: boolean = false;
  private sendCallbacks: Record<string, (message: QueuedMessage) => Promise<boolean>> = {};

  constructor() {
    this.loadQueue();
    this.setupEventListeners();
  }

  /**
   * Setup network status event listeners
   */
  private setupEventListeners() {
    window.addEventListener('online', () => {
      this.isOnline = true;
      console.log('Network connection restored. Processing message queue...');
      this.processQueue();
    });

    window.addEventListener('offline', () => {
      this.isOnline = false;
      console.log('Network connection lost. Messages will be queued.');
    });
  }

  /**
   * Load the message queue from local storage
   */
  private loadQueue() {
    try {
      const queueData = localStorage.getItem(MESSAGE_QUEUE_KEY);
      if (queueData) {
        this.queue = JSON.parse(queueData);
        console.log(`Loaded ${this.queue.length} messages from queue`);
      }
    } catch (error) {
      console.error('Failed to load message queue from storage:', error);
      this.queue = [];
    }
  }

  /**
   * Save the current queue to local storage
   */
  private saveQueue() {
    try {
      localStorage.setItem(MESSAGE_QUEUE_KEY, JSON.stringify(this.queue));
    } catch (error) {
      console.error('Failed to save message queue to storage:', error);
    }
  }

  /**
   * Register a send callback for a specific message type
   * @param type Message type identifier (e.g., 'group', 'direct')
   * @param callback Function to call when attempting to send a message
   */
  registerSendCallback(type: string, callback: (message: QueuedMessage) => Promise<boolean>) {
    this.sendCallbacks[type] = callback;
  }

  /**
   * Add a message to the queue
   * @param messageType Type of message ('group' or 'direct')
   * @param groupId Group ID if it's a group message
   * @param recipientId Recipient ID if it's a direct message
   * @param content Message content
   * @returns The queued message object
   */
  addToQueue(
    messageType: string,
    groupId: string | undefined,
    recipientId: string | undefined,
    content: MessageContent
  ): QueuedMessage {
    const queuedMessage: QueuedMessage = {
      id: uuidv4(),
      groupId,
      recipientId,
      content,
      timestamp: Date.now(),
      sendAttempts: 0
    };

    this.queue.push(queuedMessage);
    this.saveQueue();

    // If we're online, try to send the message immediately
    if (this.isOnline && this.sendCallbacks[messageType]) {
      this.attemptSendMessage(messageType, queuedMessage);
    }

    return queuedMessage;
  }

  /**
   * Process all messages in the queue
   */
  async processQueue() {
    if (this.isProcessing || !this.isOnline || this.queue.length === 0) {
      return;
    }

    this.isProcessing = true;

    try {
      // Create a copy of the queue to avoid modification issues during processing
      const currentQueue = [...this.queue];

      for (const message of currentQueue) {
        const messageType = message.groupId ? 'group' : 'direct';
        
        if (this.sendCallbacks[messageType]) {
          try {
            const success = await this.attemptSendMessage(messageType, message);
            
            if (success) {
              // Remove the message from the queue if sent successfully
              this.queue = this.queue.filter(m => m.id !== message.id);
            } else {
              // Update the message's send attempts
              const updatedMessage = this.queue.find(m => m.id === message.id);
              if (updatedMessage) {
                updatedMessage.sendAttempts += 1;
                updatedMessage.lastAttempt = Date.now();
                
                // If we've tried too many times, remove the message
                if (updatedMessage.sendAttempts >= MAX_SEND_ATTEMPTS) {
                  console.warn(`Message ${message.id} failed to send after ${MAX_SEND_ATTEMPTS} attempts and will be removed`);
                  this.queue = this.queue.filter(m => m.id !== message.id);
                  
                  // Notify the user that the message couldn't be sent
                  this.notifyFailedMessage(message);
                }
              }
            }
          } catch (error) {
            console.error(`Error processing queued message ${message.id}:`, error);
          }
        } else {
          console.warn(`No send callback registered for message type: ${messageType}`);
        }
      }

      // Save the updated queue
      this.saveQueue();
    } finally {
      this.isProcessing = false;
    }
  }

  /**
   * Attempt to send a message
   * @param messageType Type of message
   * @param message The queued message to send
   * @returns True if the message was sent successfully
   */
  private async attemptSendMessage(messageType: string, message: QueuedMessage): Promise<boolean> {
    if (!this.isOnline || !this.sendCallbacks[messageType]) {
      return false;
    }

    try {
      const success = await this.sendCallbacks[messageType](message);
      return success;
    } catch (error) {
      console.error(`Failed to send message ${message.id}:`, error);
      return false;
    }
  }

  /**
   * Notify the user about a failed message
   * @param message The message that failed to send
   */
  private notifyFailedMessage(message: QueuedMessage) {
    // This could show a toast notification or add a system message to the conversation
    const event = new CustomEvent('message-send-failed', {
      detail: {
        messageId: message.id,
        groupId: message.groupId,
        recipientId: message.recipientId,
        content: message.content,
        timestamp: message.timestamp
      }
    });
    
    document.dispatchEvent(event);
  }

  /**
   * Get all queued messages for a specific group
   * @param groupId The group ID
   * @returns Array of queued messages for the group
   */
  getQueuedMessagesForGroup(groupId: string): QueuedMessage[] {
    return this.queue.filter(message => message.groupId === groupId);
  }

  /**
   * Get all queued messages for a direct message conversation
   * @param recipientId The recipient ID
   * @returns Array of queued messages for the conversation
   */
  getQueuedMessagesForDirectChat(recipientId: string): QueuedMessage[] {
    return this.queue.filter(message => message.recipientId === recipientId);
  }

  /**
   * Get the total number of queued messages
   * @returns Number of queued messages
   */
  getQueueSize(): number {
    return this.queue.length;
  }

  /**
   * Clear the message queue
   */
  clearQueue() {
    this.queue = [];
    this.saveQueue();
  }
}

// Export a singleton instance
export const messageQueue = new MessageQueueService();

export default messageQueue;