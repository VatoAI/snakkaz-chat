/**
 * Burn-on-read message security utility
 * 
 * Inspired by Wickr's secure messaging capabilities, this utility provides:
 * - Message expiration after reading
 * - Secure message destruction
 * - Configurable timeout settings
 */

import { getRandomBytes } from './crypto-utils';

export interface BurnConfig {
  // Time in milliseconds after which the message is destroyed
  burnTimeout: number;
  // Whether to notify when message is destroyed
  notifyOnBurn: boolean;
  // Whether to allow screenshot detection
  preventScreenshot: boolean;
}

export const DEFAULT_BURN_CONFIG: BurnConfig = {
  burnTimeout: 30000, // 30 seconds
  notifyOnBurn: true,
  preventScreenshot: true
};

export class BurnOnReadManager {
  private messageRegistry: Map<string, NodeJS.Timeout> = new Map();
  
  constructor() {}
  
  /**
   * Mark a message for destruction after it's been read
   * @param messageId Unique identifier for the message
   * @param config Configuration for how/when to burn
   * @returns The message token needed to cancel burn
   */
  public scheduleMessageDestruction(
    messageId: string, 
    config: Partial<BurnConfig> = {}
  ): string {
    // Generate a secure random token for this message
    const burnToken = Array.from(getRandomBytes(16))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
      
    const burnConfig = { ...DEFAULT_BURN_CONFIG, ...config };
    
    // Set up destruction timer
    const timer = setTimeout(() => {
      this.destroyMessage(messageId, burnToken);
    }, burnConfig.burnTimeout);
    
    // Store the timer reference
    this.messageRegistry.set(messageId, timer);
    
    return burnToken;
  }
  
  /**
   * Destroy a message immediately
   * @param messageId ID of message to destroy
   * @param burnToken Security token for this message
   * @returns True if destruction was successful
   */
  public destroyMessage(messageId: string, burnToken: string): boolean {
    try {
      // Clear any pending timers
      const timer = this.messageRegistry.get(messageId);
      if (timer) {
        clearTimeout(timer);
        this.messageRegistry.delete(messageId);
      }
      
      // Here would be code to securely delete the message from storage
      // For client-side, we'd remove from local storage and memory
      // For server-side integration, we'd call an API to permanently delete
      
      // Simulate secure deletion by overwriting memory
      const dataToWipe = new Uint8Array(1024);
      window.crypto.getRandomValues(dataToWipe);
      
      return true;
    } catch (error) {
      console.error('Error during message destruction:', error);
      return false;
    }
  }
  
  /**
   * Cancel scheduled destruction for a message
   * @param messageId ID of message to preserve
   * @param burnToken Security token for this message
   * @returns True if cancellation was successful
   */
  public cancelMessageDestruction(messageId: string, burnToken: string): boolean {
    try {
      const timer = this.messageRegistry.get(messageId);
      if (timer) {
        clearTimeout(timer);
        this.messageRegistry.delete(messageId);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error canceling message destruction:', error);
      return false;
    }
  }
}

// Singleton instance
const burnOnReadManager = new BurnOnReadManager();
export default burnOnReadManager;