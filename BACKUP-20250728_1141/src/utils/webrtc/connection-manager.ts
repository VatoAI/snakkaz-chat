
import { PeerManager } from './peer-manager';
import { ConnectionRetryManager } from './connection-retry-manager';
import { ConnectionTimeoutManager } from './connection-timeout-manager';
import { SecureConnectionManager } from './secure-connection-manager';

export class ConnectionManager {
  private retryManager: ConnectionRetryManager;
  private timeoutManager: ConnectionTimeoutManager;
  private secureConnectionManager: SecureConnectionManager;

  constructor(
    private peerManager: PeerManager,
    private secureConnections: Map<string, CryptoKey>,
    private localKeyPair: { publicKey: JsonWebKey; privateKey: JsonWebKey } | null
  ) {
    // Use more conservative retry settings
    this.retryManager = new ConnectionRetryManager(3, 5000); // Max 3 attempts, 5 second reset
    this.timeoutManager = new ConnectionTimeoutManager();
    this.secureConnectionManager = new SecureConnectionManager(secureConnections);
  }

  public async connectToPeer(peerId: string, peerPublicKey: JsonWebKey) {
    if (!this.localKeyPair) {
      throw new Error('Local key pair not initialized');
    }

    try {
      if (this.retryManager.hasReachedMaxAttempts(peerId)) {
        console.log(`Max connection attempts reached for peer ${peerId}, using server fallback`);
        return null;
      }
      
      this.retryManager.incrementAttempts(peerId);

      const isConnected = this.peerManager.isConnected(peerId);
      if (isConnected) {
        console.log(`Already connected to peer ${peerId}`);
        // Reset attempt counter on successful connection
        this.retryManager.resetAttempts(peerId);
        return this.peerManager.getPeerConnection(peerId);
      }

      let connection = this.peerManager.getPeerConnection(peerId);
      const needsNewConnection = !connection || 
          connection.connection.connectionState === 'failed' || 
          connection.connection.connectionState === 'closed' || 
          connection.connection.connectionState === 'disconnected';
          
      if (needsNewConnection) {
        console.log(`Creating new connection to peer ${peerId}`);
        try {
          connection = await this.peerManager.createPeer(peerId);
          
          // Very fast timeout - 2s for quicker fallback
          this.timeoutManager.setTimeout(peerId, () => {
            const currentConnection = this.peerManager.getPeerConnection(peerId);
            if (currentConnection && 
                (currentConnection.connection.connectionState === 'failed' || 
                 currentConnection.connection.connectionState === 'closed' || 
                 currentConnection.connection.connectionState === 'disconnected' ||
                 currentConnection.connection.connectionState === 'new')) {
              console.log(`Connection to peer ${peerId} failed, attempting reconnect`);
              this.connectToPeer(peerId, peerPublicKey);
            }
          }, 2000);
        } catch (createError) {
          console.error(`Error creating peer connection to ${peerId}:`, createError);
          throw createError;
        }
      }

      if (this.localKeyPair) {
        await this.secureConnectionManager.establishSecureConnection(
          peerId,
          this.localKeyPair.publicKey,
          this.localKeyPair.privateKey,
          peerPublicKey
        );
      }

      // Schedule retry reset after a successful connection
      if (connection && connection.connection.connectionState === 'connected') {
        this.retryManager.resetAttempts(peerId);
      } else {
        // Only schedule reset if connection not already established
        this.retryManager.scheduleRetryReset(peerId);
      }

      return connection;
    } catch (error) {
      console.error('Error connecting to peer:', error);
      throw error;
    }
  }

  public disconnect(peerId: string) {
    console.log(`Disconnecting from peer ${peerId}`);
    
    // Clear any pending timeouts
    this.timeoutManager.clearTimeout(peerId);
    
    // Disconnect peer and clean up
    this.peerManager.disconnect(peerId);
    this.secureConnectionManager.removeSecureConnection(peerId);
    this.retryManager.resetAttempts(peerId);
  }

  public disconnectAll() {
    console.log('Disconnecting from all peers');
    
    // Clear all timeouts
    this.timeoutManager.clearAllTimeouts();
    
    // Disconnect all peers and clean up
    this.peerManager.disconnectAll();
    this.secureConnectionManager.clearAllSecureConnections();
    this.retryManager.resetAllAttempts();
  }

  public getConnectionState(peerId: string): string {
    const connection = this.peerManager.getPeerConnection(peerId);
    if (!connection) return 'disconnected';
    
    return connection.connection.connectionState || 'unknown';
  }
  
  public getDataChannelState(peerId: string): string {
    const connection = this.peerManager.getPeerConnection(peerId);
    if (!connection || !connection.dataChannel) return 'closed';
    
    return connection.dataChannel.readyState || 'unknown';
  }
  
  public async attemptReconnect(peerId: string, publicKey: JsonWebKey) {
    console.log(`Attempting to reconnect with peer ${peerId}`);
    
    // Reset connection attempts for this peer
    this.retryManager.resetAttempts(peerId);
    
    // Clean up existing connection
    this.peerManager.disconnect(peerId);
    
    // Attempt new connection with reduced retries
    let attempt = 0;
    const maxRetries = 2; // Reduced max retries for faster feedback
    let success = false;
    
    while (attempt < maxRetries && !success) {
      try {
        const connection = await this.connectToPeer(peerId, publicKey);
        
        // Wait for the connection to establish, but with shorter timeout
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const connectionState = this.getConnectionState(peerId);
        const dataChannelState = this.getDataChannelState(peerId);
        
        if (connectionState === 'connected' && dataChannelState === 'open') {
          success = true;
          console.log(`Successfully reconnected to peer ${peerId}`);
          return connection;
        }
        
        console.log(`Connection attempt ${attempt + 1} for peer ${peerId} not yet successful, retrying...`);
      } catch (error) {
        console.error(`Reconnection attempt ${attempt + 1} to peer ${peerId} failed:`, error);
      }
      
      attempt++;
      // Short fixed backoff instead of exponential
      if (attempt < maxRetries) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }
    
    if (!success) {
      console.log(`All reconnection attempts to peer ${peerId} failed, falling back to server`);
      throw new Error(`Failed to reconnect to peer ${peerId}`);
    }
    
    return this.peerManager.getPeerConnection(peerId);
  }
}
