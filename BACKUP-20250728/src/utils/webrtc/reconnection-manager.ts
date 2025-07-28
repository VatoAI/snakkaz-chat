
import { ConnectionManager } from './connection-manager';

export class ReconnectionManager {
  private reconnectAttempts: Map<string, number> = new Map();
  private reconnectTimers: Map<string, NodeJS.Timeout> = new Map();
  private lastReconnectTime: Map<string, number> = new Map();
  
  constructor(
    private connectionManager: ConnectionManager,
    private maxReconnectAttempts: number = 3,
    private minReconnectInterval: number = 10000 // 10 seconds minimum between attempts
  ) {}

  public async attemptReconnect(peerId: string, publicKey: JsonWebKey): Promise<any> {
    // Check if we've attempted reconnect too recently
    const now = Date.now();
    const lastTime = this.lastReconnectTime.get(peerId) || 0;
    const timeSinceLastAttempt = now - lastTime;

    if (timeSinceLastAttempt < this.minReconnectInterval) {
      console.log(`Reconnection attempt to ${peerId} rejected: too soon since last attempt (${timeSinceLastAttempt}ms)`);
      return Promise.resolve(false); // Don't attempt reconnect too frequently
    }

    const attempts = this.reconnectAttempts.get(peerId) || 0;
    
    if (attempts >= this.maxReconnectAttempts) {
      console.log(`Max reconnection attempts (${this.maxReconnectAttempts}) reached for peer ${peerId}`);
      return Promise.reject(new Error(`Max reconnection attempts reached for peer ${peerId}`));
    }
    
    // Clear any existing reconnect timer for this peer
    if (this.reconnectTimers.has(peerId)) {
      clearTimeout(this.reconnectTimers.get(peerId)!);
      this.reconnectTimers.delete(peerId);
    }
    
    try {
      console.log(`Attempting to reconnect with peer ${peerId} (attempt ${attempts + 1}/${this.maxReconnectAttempts})`);
      this.lastReconnectTime.set(peerId, now);
      
      const result = await this.connectionManager.attemptReconnect(peerId, publicKey);
      
      // Reset reconnect attempts on success
      this.reconnectAttempts.delete(peerId);
      
      return result;
    } catch (error) {
      // Increment reconnect attempts
      this.reconnectAttempts.set(peerId, attempts + 1);
      console.error(`Reconnection attempt ${attempts + 1} to peer ${peerId} failed:`, error);
      
      // If we haven't reached max attempts, schedule another attempt with exponential backoff
      if (attempts + 1 < this.maxReconnectAttempts) {
        const backoffTime = Math.min(30000, 2000 * Math.pow(2, attempts)); // Max 30 seconds
        console.log(`Scheduling next reconnection attempt in ${backoffTime}ms`);
        
        const timer = setTimeout(() => {
          this.attemptReconnect(peerId, publicKey)
            .catch(e => console.error('Scheduled reconnection failed:', e));
        }, backoffTime);
        
        this.reconnectTimers.set(peerId, timer);
      }
      
      throw error;
    }
  }
  
  public resetAttempts(peerId: string): void {
    this.reconnectAttempts.delete(peerId);
    if (this.reconnectTimers.has(peerId)) {
      clearTimeout(this.reconnectTimers.get(peerId)!);
      this.reconnectTimers.delete(peerId);
    }
    this.lastReconnectTime.delete(peerId);
  }
  
  public getAttempts(peerId: string): number {
    return this.reconnectAttempts.get(peerId) || 0;
  }
  
  // Clean up all timers
  public cleanup(): void {
    for (const timer of this.reconnectTimers.values()) {
      clearTimeout(timer);
    }
    this.reconnectTimers.clear();
    this.reconnectAttempts.clear();
    this.lastReconnectTime.clear();
  }
}
