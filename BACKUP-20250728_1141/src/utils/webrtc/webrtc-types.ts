
import { PeerConnection } from './types';

export interface IWebRTCManager {
  connectToPeer(peerId: string, peerPublicKey: JsonWebKey): Promise<PeerConnection | null>;
  sendMessage(peerId: string, message: string, isDirect?: boolean): Promise<boolean>;
  onMessage(callback: (message: string, peerId: string) => void): void;
  sendDirectMessage(peerId: string, message: string): Promise<boolean>;
  getPublicKey(): JsonWebKey | null;
  disconnect(peerId: string): void;
  disconnectAll(): void;
  getConnectionState(peerId: string): string;
  getDataChannelState(peerId: string): string;
  attemptReconnect(peerId: string): Promise<PeerConnection | null>;
  isPeerReady(peerId: string): boolean;
  ensurePeerReady(peerId: string): Promise<boolean>;
}

export interface WebRTCOptions {
  maxReconnectAttempts?: number;
  reconnectTimeout?: number;
}
