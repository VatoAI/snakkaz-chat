
import type { Database } from '@/integrations/supabase/types';

export interface PeerConnection {
  peer: any | null;
  connection: RTCPeerConnection;
  dataChannel: RTCDataChannel | null;
}

export type SignalingInsert = Database['public']['Tables']['signaling']['Insert'];

export type WebRTCTypes = {
  RTCPeerConnection: typeof RTCPeerConnection;
  RTCSessionDescription: typeof RTCSessionDescription;
  RTCIceCandidate: typeof RTCIceCandidate;
};
