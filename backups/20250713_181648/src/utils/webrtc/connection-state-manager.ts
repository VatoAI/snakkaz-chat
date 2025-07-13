
import { ConnectionManager } from './connection-manager';

export class ConnectionStateManager {
  constructor(private connectionManager: ConnectionManager) {}
  
  public isPeerReady(peerId: string): boolean {
    const connState = this.connectionManager.getConnectionState(peerId);
    const dataState = this.connectionManager.getDataChannelState(peerId);
    
    return connState === 'connected' && dataState === 'open';
  }
  
  public async ensurePeerReady(peerId: string, 
                               attemptReconnect: (peerId: string) => Promise<any>): Promise<boolean> {
    if (this.isPeerReady(peerId)) {
      return true;
    }
    
    try {
      await attemptReconnect(peerId);
      return this.isPeerReady(peerId);
    } catch (error) {
      console.error(`Failed to ensure peer ${peerId} is ready:`, error);
      return false;
    }
  }
}
