/**
 * MessageTTLService
 * 
 * Handles message expiration similar to Wickr's TTL feature,
 * ensuring messages are securely deleted after a specified time.
 */

export interface TTLOptions {
  // Time in seconds until message expires (0 = never)
  expiration: number;
  // Whether to apply TTL to all messages in conversation
  applyToConversation: boolean;
  // Whether to set this TTL as default for future messages
  setAsDefault: boolean;
}

export const DEFAULT_TTL_OPTIONS: TTLOptions = {
  expiration: 0, // Default: no expiration
  applyToConversation: false,
  setAsDefault: false
};

export class MessageTTLService {
  private defaultTTL: number = 0; // 0 means no expiration
  private messageExpirations: Map<string, number> = new Map();
  private conversationDefaults: Map<string, number> = new Map();
  private expirationCallbacks: Map<string, () => void> = new Map();
  private timers: Map<string, NodeJS.Timeout> = new Map();
  
  /**
   * Set TTL for a specific message
   */
  public setMessageTTL(
    messageId: string, 
    expirationSeconds: number,
    onExpire?: () => void
  ): void {
    if (expirationSeconds <= 0) {
      this.clearMessageTTL(messageId);
      return;
    }
    
    const expirationTime = Date.now() + (expirationSeconds * 1000);
    this.messageExpirations.set(messageId, expirationTime);
    
    if (onExpire) {
      this.expirationCallbacks.set(messageId, onExpire);
    }
    
    // Clear any existing timer
    this.clearTimer(messageId);
    
    // Set new timer
    const timer = setTimeout(() => {
      this.handleMessageExpiration(messageId);
    }, expirationSeconds * 1000);
    
    this.timers.set(messageId, timer);
  }
  
  /**
   * Get time remaining for a message in seconds
   */
  public getTimeRemaining(messageId: string): number {
    const expirationTime = this.messageExpirations.get(messageId);
    if (!expirationTime) return 0;
    
    const remaining = expirationTime - Date.now();
    return remaining > 0 ? Math.floor(remaining / 1000) : 0;
  }
  
  /**
   * Set default TTL for a conversation
   */
  public setConversationDefaultTTL(conversationId: string, expirationSeconds: number): void {
    if (expirationSeconds <= 0) {
      this.conversationDefaults.delete(conversationId);
    } else {
      this.conversationDefaults.set(conversationId, expirationSeconds);
    }
  }
  
  /**
   * Get default TTL for a conversation or global default
   */
  public getDefaultTTL(conversationId?: string): number {
    if (conversationId && this.conversationDefaults.has(conversationId)) {
      return this.conversationDefaults.get(conversationId) || 0;
    }
    return this.defaultTTL;
  }
  
  /**
   * Set global default TTL
   */
  public setGlobalDefaultTTL(expirationSeconds: number): void {
    this.defaultTTL = expirationSeconds > 0 ? expirationSeconds : 0;
  }
  
  /**
   * Clear TTL for a specific message
   */
  public clearMessageTTL(messageId: string): void {
    this.messageExpirations.delete(messageId);
    this.expirationCallbacks.delete(messageId);
    this.clearTimer(messageId);
  }
  
  /**
   * Apply TTL settings to all messages in a conversation
   */
  public applyTTLToConversation(conversationId: string, messageIds: string[], expirationSeconds: number): void {
    messageIds.forEach((messageId) => {
      this.setMessageTTL(messageId, expirationSeconds);
    });
    
    // Also set as conversation default
    this.setConversationDefaultTTL(conversationId, expirationSeconds);
  }
  
  /**
   * Handle message expiration
   */
  private handleMessageExpiration(messageId: string): void {
    // Execute callback if available
    const callback = this.expirationCallbacks.get(messageId);
    if (callback) {
      callback();
    }
    
    // Clean up
    this.messageExpirations.delete(messageId);
    this.expirationCallbacks.delete(messageId);
    this.timers.delete(messageId);
  }
  
  /**
   * Clear a timer
   */
  private clearTimer(messageId: string): void {
    const timer = this.timers.get(messageId);
    if (timer) {
      clearTimeout(timer);
      this.timers.delete(messageId);
    }
  }
  
  /**
   * Clean up when destroying service
   */
  public dispose(): void {
    // Clear all timers
    this.timers.forEach((timer) => {
      clearTimeout(timer);
    });
    
    // Clear all maps
    this.timers.clear();
    this.messageExpirations.clear();
    this.expirationCallbacks.clear();
    this.conversationDefaults.clear();
  }
}

// Create singleton instance
const messageTTLService = new MessageTTLService();
export default messageTTLService;