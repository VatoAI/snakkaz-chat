
export interface P2PMessage {
  id: string;
  content: string;
  senderId: string;
  receiverId: string;
  timestamp: number;
  type: 'text' | 'file' | 'signal';
}

export interface SignalingMessage {
  type: 'offer' | 'answer' | 'ice-candidate';
  payload: any;
  senderId: string;
  receiverId: string;
}
