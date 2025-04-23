
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { WebRTCManager } from "@/utils/webrtc";

interface UseChatInitializationProps {
  user: any;
  loading: boolean;
  isReady: boolean;
  setupWebRTC: (userId: string, cb: () => void) => void;
}

export const useChatInitialization = ({
  user,
  loading,
  isReady,
  setupWebRTC
}: UseChatInitializationProps) => {
  const navigate = useNavigate();

  useEffect(() => {
    if (loading) return;
    if (!user) {
      navigate('/login');
      return;
    }
    if (!isReady && user) {
      setupWebRTC(user.id, () => {
        // Intentionally empty, handled in isReady flag in hook
      });
    }
  }, [user, loading, navigate, setupWebRTC, isReady]);

  return { isInitialized: !loading && user && isReady };
};
