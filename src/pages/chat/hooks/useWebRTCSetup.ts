
import { useState, useEffect } from "react";
import { useWebRTC } from "@/hooks/webrtc-hooks";

// Adapter hook to ensure backward compatibility with existing code
export function useWebRTCSetup() {
  const webrtc = useWebRTC();
  const [isReady, setIsReady] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  // Initialize WebRTC when userId is set
  useEffect(() => {
    if (userId && webrtc.peers) {
      setIsReady(true);
    }
  }, [userId, webrtc.peers]);

  // Method to initialize WebRTC with new PeerJS system
  const setupWebRTC = (newUserId: string, cb?: () => void) => {
    setUserId(newUserId);
    // PeerJS initialization happens automatically in the hook
    if (webrtc.peers && cb) {
      cb();
    }
  };

  return {
    manager: null, // For backward compatibility
    isReady,
    setupWebRTC,
    status: webrtc.peers?.length ? 'connected' : 'disconnected'
  };
}
