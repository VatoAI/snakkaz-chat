
import { PeerConnection } from './types';
import { DataChannelHandler } from './data-channel-handler';
import { SignalingService } from './signaling';

export class ConnectionEventHandler {
  constructor(
    private userId: string,
    private signalingService: SignalingService,
    private dataChannelHandler: DataChannelHandler
  ) {}

  public setupConnectionEventHandlers(connection: PeerConnection, peerId: string): void {
    // Handler for ICE candidates
    connection.connection.onicecandidate = async (event) => {
      if (event.candidate) {
        const candidateJson = {
          candidate: event.candidate.candidate,
          sdpMLineIndex: event.candidate.sdpMLineIndex,
          sdpMid: event.candidate.sdpMid,
          usernameFragment: event.candidate.usernameFragment
        };

        try {
          await this.signalingService.sendSignal({
            sender_id: this.userId,
            receiver_id: peerId,
            signal_data: { candidate: candidateJson }
          });
        } catch (error) {
          console.error(`Error sending ICE candidate to peer ${peerId}:`, error);
        }
      }
    };
    
    // Handler for ICE connection state changes
    connection.connection.oniceconnectionstatechange = () => {
      console.log(`ICE connection state with ${peerId}: ${connection.connection.iceConnectionState}`);
      
      if (connection.connection.iceConnectionState === 'failed') {
        console.log(`ICE connection failed with peer ${peerId}, attempting to restart ICE`);
        connection.connection.restartIce();
      }
    };

    // Handler for datachannel creation by the peer
    connection.connection.ondatachannel = (event) => {
      this.dataChannelHandler.handleIncomingDataChannel(connection, event, peerId);
    };

    // Handler for connection state changes
    connection.connection.onconnectionstatechange = () => {
      console.log(`Connection state with ${peerId}:`, connection.connection.connectionState);
      if (connection.connection.connectionState === 'connected') {
        this.dataChannelHandler.setupDataChannel(connection, peerId);
      } else if (connection.connection.connectionState === 'failed' || 
                connection.connection.connectionState === 'closed') {
        console.log(`Connection with ${peerId} is ${connection.connection.connectionState}`);
      }
    };
    
    // Handler for signaling state changes
    connection.connection.onsignalingstatechange = () => {
      console.log(`Signaling state with ${peerId}:`, connection.connection.signalingState);
    };
  }
}
