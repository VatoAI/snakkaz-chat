
export class MessageRetryManager {
  constructor(
    private messageSender: any,
    private getPeerConnection: (peerId: string) => { dataChannel: RTCDataChannel | null } | undefined
  ) {}
  
  public async retryMessage(peerId: string, message: string, isDirect: boolean = true): Promise<boolean> {
    const retryCount = this.messageSender.getRetryCount(peerId);
    
    if (this.messageSender.hasExceededMaxRetries(peerId)) {
      console.log(`Max retry attempts exceeded for peer ${peerId}`);
      return false;
    }
    
    try {
      console.log(`Retrying message to peer ${peerId} (attempt ${retryCount + 1})`);
      
      // Wait with exponential backoff
      await new Promise(resolve => setTimeout(resolve, Math.pow(2, retryCount) * 1000));
      
      // Get connection
      const connection = this.getPeerConnection(peerId);
      if (!connection || !connection.dataChannel) {
        throw new Error(`No data channel found for peer ${peerId}`);
      }
      
      // Try sending again
      await this.messageSender.sendMessage(connection.dataChannel, peerId, message, isDirect);
      
      // Reset retry count on success
      this.messageSender.resetRetryCount(peerId);
      
      return true;
    } catch (error) {
      console.error(`Retry attempt ${retryCount + 1} failed:`, error);
      
      // Increment retry count
      this.messageSender.incrementRetryCount(peerId);
      
      return false;
    }
  }
}
