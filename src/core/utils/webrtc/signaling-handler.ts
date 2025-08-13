
import { PeerConnection } from './types';
import { DataChannelHandler } from './data-channel-handler';
import { SignalingService } from './signaling';

export class SignalingHandler {
  constructor(
    private userId: string,
    private signalingService: SignalingService
  ) {}

  public async handleIncomingSignal(
    signal: any, 
    connections: Map<string, PeerConnection>,
    createConnection: (peerId: string) => PeerConnection,
    setupConnectionEventHandlers: (connection: PeerConnection, peerId: string) => void
  ): Promise<void> {
    const { sender_id, signal_data } = signal;
    
    let connection = connections.get(sender_id);
    if (!connection) {
      console.log('Creating new peer connection for incoming signal from:', sender_id);
      connection = createConnection(sender_id);
      
      connections.set(sender_id, connection);
      setupConnectionEventHandlers(connection, sender_id);
    }

    try {
      if (signal_data.candidate) {
        const iceCandidate = new RTCIceCandidate(signal_data.candidate);
        await connection.connection.addIceCandidate(iceCandidate);
      } else if (signal_data.sdp) {
        const sessionDescription = new RTCSessionDescription({
          type: signal_data.type,
          sdp: signal_data.sdp
        });

        // Check signaling state before setting remote description
        if (signal_data.type === 'offer') {
          // For offer, we should be in stable state or have-remote-offer state
          const validStates = ['stable', 'have-remote-offer'];
          if (validStates.includes(connection.connection.signalingState)) {
            await connection.connection.setRemoteDescription(sessionDescription);
            
            // Only create answer if we're in have-remote-offer state
            if (connection.connection.signalingState === 'have-remote-offer') {
              try {
                const answer = await connection.connection.createAnswer();
                await connection.connection.setLocalDescription(answer);
                
                await this.signalingService.sendSignal({
                  sender_id: this.userId,
                  receiver_id: sender_id,
                  signal_data: {
                    type: answer.type,
                    sdp: answer.sdp
                  }
                });
              } catch (error) {
                console.error(`Error creating answer for peer ${sender_id}:`, error);
              }
            }
          } else {
            console.log(`Cannot process offer in current signaling state: ${connection.connection.signalingState}`);
          }
        } else if (signal_data.type === 'answer') {
          // For answer, we should be in have-local-offer state
          if (connection.connection.signalingState === 'have-local-offer') {
            await connection.connection.setRemoteDescription(sessionDescription);
          } else {
            console.log(`Cannot process answer in current signaling state: ${connection.connection.signalingState}`);
          }
        }
      }
    } catch (error) {
      console.error('Error handling signal:', error);
      // Don't delete the connection on error, let the connection state change handler manage that
    }
  }
}
