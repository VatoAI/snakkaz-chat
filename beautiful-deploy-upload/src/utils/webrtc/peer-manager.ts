
import { PeerConnection } from './types';
import { SignalingService } from './signaling';
import { RTCConfig } from './config';
import { DataChannelHandler } from './data-channel-handler';
import { ConnectionEventHandler } from './connection-event-handler';
import { SignalingHandler } from './signaling-handler';

export class PeerManager {
  private connections: Map<string, PeerConnection> = new Map();
  public signalingService: SignalingService;
  private dataChannelHandler: DataChannelHandler;
  private connectionEventHandler: ConnectionEventHandler;
  private signalingHandler: SignalingHandler;

  constructor(
    private userId: string,
    private onMessageCallback: ((message: string, peerId: string) => void) | null = null
  ) {
    this.signalingService = new SignalingService(userId);
    this.dataChannelHandler = new DataChannelHandler(onMessageCallback);
    this.connectionEventHandler = new ConnectionEventHandler(userId, this.signalingService, this.dataChannelHandler);
    this.signalingHandler = new SignalingHandler(userId, this.signalingService);
  }

  private createPeerConnection(peerId: string): PeerConnection {
    const peerConnection = new RTCPeerConnection(RTCConfig);
    
    return {
      peer: null,
      connection: peerConnection,
      dataChannel: null
    };
  }

  public async handleIncomingSignal(signal: any): Promise<void> {
    await this.signalingHandler.handleIncomingSignal(
      signal, 
      this.connections, 
      this.createPeerConnection.bind(this), 
      this.connectionEventHandler.setupConnectionEventHandlers.bind(this.connectionEventHandler)
    );
  }

  public async createPeer(peerId: string): Promise<PeerConnection> {
    console.log('Creating new peer connection to:', peerId);
    const peerConnection = new RTCPeerConnection(RTCConfig);

    const connection: PeerConnection = {
      peer: null,
      connection: peerConnection,
      dataChannel: null
    };

    this.connectionEventHandler.setupConnectionEventHandlers(connection, peerId);
    
    try {
      // Store the connection first in case we need to access it during signaling
      this.connections.set(peerId, connection);
      
      // Check if the signaling state is stable before creating an offer
      if (peerConnection.signalingState === 'stable') {
        const offer = await peerConnection.createOffer({
          offerToReceiveAudio: false,
          offerToReceiveVideo: false,
          iceRestart: true // Enable ICE restart for better connection recovery
        });
        await peerConnection.setLocalDescription(offer);
        
        await this.signalingService.sendSignal({
          sender_id: this.userId,
          receiver_id: peerId,
          signal_data: {
            type: offer.type,
            sdp: offer.sdp
          }
        });
      } else {
        console.log(`Cannot create offer in current signaling state: ${peerConnection.signalingState}`);
      }

      return connection;
    } catch (error) {
      console.error('Error creating peer:', error);
      this.connections.delete(peerId);
      throw error;
    }
  }

  getPeerConnection(peerId: string): PeerConnection | undefined {
    return this.connections.get(peerId);
  }

  isConnected(peerId: string): boolean {
    const connection = this.connections.get(peerId);
    return !!connection && 
           !!connection.dataChannel && 
           connection.dataChannel.readyState === 'open' &&
           connection.connection.connectionState === 'connected';
  }

  disconnect(peerId: string): void {
    const connection = this.connections.get(peerId);
    if (connection) {
      if (connection.dataChannel) {
        try {
          connection.dataChannel.close();
        } catch (e) {
          console.error(`Error closing data channel for peer ${peerId}:`, e);
        }
      }
      
      try {
        connection.connection.close();
      } catch (e) {
        console.error(`Error closing connection for peer ${peerId}:`, e);
      }
      
      this.connections.delete(peerId);
    }
  }

  disconnectAll(): void {
    this.connections.forEach((connection, peerId) => {
      this.disconnect(peerId);
    });
  }
}
