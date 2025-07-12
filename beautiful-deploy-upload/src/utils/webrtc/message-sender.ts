
import { encryptMessage } from '../encryption';

export class MessageSender {
  private retryAttempts: Map<string, number> = new Map();
  private maxRetries: number = 3;
  
  constructor(private secureConnections: Map<string, CryptoKey>) {}

  public async sendMessage(
    connection: RTCDataChannel, 
    peerId: string, 
    message: string, 
    isDirect: boolean = false
  ) {
    if (connection.readyState !== 'open') {
      throw new Error(`Data channel for peer ${peerId} is not open. Current state: ${connection.readyState}`);
    }

    try {
      let messageToSend = message;
      
      if (isDirect) {
        // Use E2EE for direct messages
        const secureConnection = this.secureConnections.get(peerId);
        if (!secureConnection) {
          throw new Error(`No secure connection established with peer ${peerId}`);
        }
        
        const { encryptedContent, key, iv } = await encryptMessage(message);
        messageToSend = JSON.stringify({
          type: 'direct',
          content: encryptedContent,
          key: key,
          iv: iv,
          timestamp: new Date().toISOString(),
          messageId: `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
        });
      } else {
        // For regular messages, just wrap with type
        messageToSend = JSON.stringify({
          type: 'regular',
          content: message,
          timestamp: new Date().toISOString(),
          messageId: `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
        });
      }
      
      console.log(`Sending ${isDirect ? 'direct' : 'regular'} message to ${peerId}`);
      connection.send(messageToSend);
      return true;
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  }

  // Get retry count for a peer
  public getRetryCount(peerId: string): number {
    return this.retryAttempts.get(peerId) || 0;
  }

  // Increment retry count for a peer
  public incrementRetryCount(peerId: string): void {
    const retryCount = this.getRetryCount(peerId);
    this.retryAttempts.set(peerId, retryCount + 1);
  }

  // Reset retry count for a peer
  public resetRetryCount(peerId: string): void {
    this.retryAttempts.delete(peerId);
  }

  // Check if max retries exceeded
  public hasExceededMaxRetries(peerId: string): boolean {
    return this.getRetryCount(peerId) >= this.maxRetries;
  }
}
