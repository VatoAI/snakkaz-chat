
import { generateKeyPair } from '../encryption';
import { PeerManager } from './peer-manager';
import { ConnectionManager } from './connection-manager';
import { MessageHandler } from './message-handler';
import { ReconnectionManager } from './reconnection-manager';
import { ConnectionStateManager } from './connection-state-manager';
import { IWebRTCManager, WebRTCOptions } from './webrtc-types';

export class WebRTCManager implements IWebRTCManager {
  private peerManager: PeerManager;
  private connectionManager: ConnectionManager;
  private messageHandler: MessageHandler;
  private reconnectionManager: ReconnectionManager;
  private connectionStateManager: ConnectionStateManager;
  private localKeyPair: { publicKey: JsonWebKey; privateKey: JsonWebKey } | null = null;
  private onMessageCallback: ((message: string, peerId: string) => void) | null = null;
  private secureConnections: Map<string, CryptoKey> = new Map();
  private signalingCleanup: (() => void) | null = null;
  
  // Event handlers
  public onConnectionStateChange: ((peerId: string, state: RTCPeerConnectionState) => void) | null = null;
  public onDataChannelStateChange: ((peerId: string, state: RTCDataChannelState) => void) | null = null;

  constructor(
    private userId: string,
    options: WebRTCOptions = {}
  ) {
    const { maxReconnectAttempts = 5 } = options; // Increased from 3 to 5
    
    this.peerManager = new PeerManager(userId);
    this.connectionManager = new ConnectionManager(this.peerManager, this.secureConnections, this.localKeyPair);
    this.messageHandler = new MessageHandler(this.peerManager, this.secureConnections);
    this.reconnectionManager = new ReconnectionManager(this.connectionManager, maxReconnectAttempts);
    this.connectionStateManager = new ConnectionStateManager(this.connectionManager);
    
    this.initializeKeyPair();
    this.setupSignalingListener();
  }

  private async initializeKeyPair() {
    try {
      this.localKeyPair = await generateKeyPair();
      console.log('Local key pair generated');
      // Update connectionManager with the new keyPair
      this.connectionManager = new ConnectionManager(this.peerManager, this.secureConnections, this.localKeyPair);
    } catch (error) {
      console.error('Failed to generate key pair:', error);
    }
  }

  private setupSignalingListener() {
    if (this.signalingCleanup) {
      this.signalingCleanup();
    }
    
    this.signalingCleanup = this.peerManager.signalingService.setupSignalingListener(
      async (signal) => {
        const result = await this.peerManager.handleIncomingSignal(signal);
        
        // Update connection state handlers
        if (signal.sender_id && this.onConnectionStateChange) {
          const state = this.getConnectionState(signal.sender_id);
          if (state) {
            this.onConnectionStateChange(signal.sender_id, state as RTCPeerConnectionState);
          }
        }
        
        return result;
      }
    );
    
    return this.signalingCleanup;
  }

  public async connectToPeer(peerId: string, peerPublicKey: JsonWebKey) {
    try {
      const connection = await this.connectionManager.connectToPeer(peerId, peerPublicKey);
      
      // Notify of connection state change if handler exists
      if (connection && this.onConnectionStateChange) {
        this.onConnectionStateChange(peerId, connection.connectionState as RTCPeerConnectionState);
      }
      
      return connection;
    } catch (error) {
      console.error(`Error connecting to peer ${peerId}:`, error);
      throw error;
    }
  }

  public async sendMessage(peerId: string, message: string, isDirect: boolean = false) {
    try {
      return await this.messageHandler.sendMessage(peerId, message, isDirect);
    } catch (error) {
      console.error(`Error sending message to peer ${peerId}:`, error);
      
      // Try to auto-reconnect and retry once
      if (this.localKeyPair?.publicKey) {
        try {
          await this.attemptReconnect(peerId);
          // If reconnection worked, try sending again
          return await this.messageHandler.sendMessage(peerId, message, isDirect);
        } catch (reconnectError) {
          console.error(`Auto-reconnect failed for peer ${peerId}:`, reconnectError);
          throw error; // Throw the original error
        }
      } else {
        throw error;
      }
    }
  }

  public onMessage(callback: (message: string, peerId: string) => void) {
    this.onMessageCallback = callback;
    
    // Create a new message handler callback
    const messageCallback = this.messageHandler.setupMessageCallback(callback);
    
    // Create a new PeerManager with the callback
    this.peerManager = new PeerManager(this.userId, messageCallback);
    
    // Recreate dependent objects with the new PeerManager
    this.connectionManager = new ConnectionManager(this.peerManager, this.secureConnections, this.localKeyPair);
    this.messageHandler = new MessageHandler(this.peerManager, this.secureConnections);
    
    // Re-initialize the signaling listener with the new peer manager
    this.setupSignalingListener();
  }

  public async sendDirectMessage(peerId: string, message: string) {
    try {
      // Check connection state before sending
      if (!this.connectionStateManager.isPeerReady(peerId)) {
        console.log(`Connection to peer ${peerId} is not ready, attempting to reconnect`);
        
        // Try to reconnect if we have the peer's public key
        if (this.localKeyPair?.publicKey) {
          try {
            await this.connectToPeer(peerId, this.localKeyPair.publicKey);
            
            // Wait for connection to establish with shorter timeouts
            let connectionEstablished = false;
            let attempts = 0;
            const maxAttempts = 3; // Reduced from 5 to 3
            
            while (!connectionEstablished && attempts < maxAttempts) {
              if (this.connectionStateManager.isPeerReady(peerId)) {
                connectionEstablished = true;
                break;
              }
              
              // Use shorter wait times for faster connection
              const waitTime = Math.min(500 * Math.pow(1.5, attempts), 2000); // Reduced from 1000ms to 500ms base
              await new Promise(resolve => setTimeout(resolve, waitTime));
              attempts++;
            }
            
            if (!connectionEstablished) {
              throw new Error(`Could not establish connection with peer ${peerId} after ${maxAttempts} attempts`);
            }
          } catch (reconnectError) {
            console.error(`Reconnection to peer ${peerId} failed:`, reconnectError);
            throw new Error(`Failed to establish connection with peer ${peerId}`);
          }
        } else {
          throw new Error('Cannot reconnect: no local public key available');
        }
      }
      
      return await this.messageHandler.sendDirectMessage(peerId, message);
    } catch (error) {
      console.error(`Failed to send direct message to ${peerId}:`, error);
      throw error;
    }
  }

  public getPublicKey(): JsonWebKey | null {
    return this.localKeyPair?.publicKey || null;
  }

  public disconnect(peerId: string) {
    this.connectionManager.disconnect(peerId);
  }

  public disconnectAll() {
    this.connectionManager.disconnectAll();
  }
  
  public getConnectionState(peerId: string): string {
    return this.connectionManager.getConnectionState(peerId);
  }
  
  public getDataChannelState(peerId: string): string {
    return this.connectionManager.getDataChannelState(peerId);
  }
  
  // Method to try reconnecting with a peer with improved error handling
  public async attemptReconnect(peerId: string) {
    if (!this.localKeyPair?.publicKey) {
      throw new Error('Cannot reconnect: no local public key available');
    }
    
    return await this.reconnectionManager.attemptReconnect(peerId, this.localKeyPair.publicKey);
  }
  
  // Method to check if a peer is connected and ready for messaging
  public isPeerReady(peerId: string): boolean {
    return this.connectionStateManager.isPeerReady(peerId);
  }
  
  // Try to ensure a peer is ready, reconnecting if necessary
  public async ensurePeerReady(peerId: string): Promise<boolean> {
    return await this.connectionStateManager.ensurePeerReady(peerId, this.attemptReconnect.bind(this));
  }
}
