
import { decryptMessage } from '../encryption';

export class MessageReceiver {
  constructor() {}

  public setupMessageCallback(callback: (message: string, peerId: string) => void) {
    return async (messageData: string, peerId: string) => {
      try {
        console.log(`Received message from ${peerId}:`, messageData.substring(0, 30) + '...');
        
        // Parse the incoming message
        const parsedMessage = JSON.parse(messageData);
        
        if (parsedMessage.type === 'direct') {
          // Handle direct encrypted message
          console.log('Processing encrypted direct message');
          const decryptedMessage = await decryptMessage(
            parsedMessage.content,
            parsedMessage.key,
            parsedMessage.iv
          );
          callback(`${decryptedMessage}`, peerId);
        } else {
          // Handle regular message
          callback(parsedMessage.content, peerId);
        }
      } catch (error) {
        console.error('Error processing message:', error);
        callback(messageData, peerId); // Fallback to raw message
      }
    };
  }
}
