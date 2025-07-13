
import { useState } from "react";
import { useWebRTC } from "@/hooks/useWebRTC";

// Returns { manager, isReady, setupWebRTC, status }
export function useWebRTCSetup() {
  const { manager, setupWebRTC, status } = useWebRTC();
  const [isReady, setIsReady] = useState(false);

  // Patch setup so we also set our isReady state
  const wrappedSetupWebRTC = (userId: string, cb: () => void) => {
    setupWebRTC(userId, () => {
      setIsReady(true);
      if (cb) cb();
    });
  };

  return {
    manager,
    isReady,
    setupWebRTC: wrappedSetupWebRTC,
    status
  };
}
