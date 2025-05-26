
export const RTCConfig = {
  iceServers: [
    { urls: 'stun:stun.l.google.com:19302' },
    { urls: 'stun:stun1.l.google.com:19302' }, // Add fallback STUN servers
    { urls: 'stun:stun2.l.google.com:19302' }
  ],
  dataChannelOptions: {
    ordered: true, // Ensure ordered delivery for chat messages
    maxRetransmits: 3 // Allow retransmissions for reliability
  }
};
