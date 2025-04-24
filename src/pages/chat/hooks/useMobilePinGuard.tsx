
import { useState, useEffect } from "react";
import { useChatCode } from "@/hooks/useChatCode";
import { ChatCodeModal } from "@/components/mobile/ChatCodeModal";
import { useMobilePinSecurity } from "@/hooks/useMobilePinSecurity";
import { useScreenOrientation } from "@/hooks/useScreenOrientation";

export function useMobilePinGuard({ isMobile }: { isMobile: boolean }) {
  const [pinUnlocked, setPinUnlocked] = useState(!isMobile);
  const [showSetCodeModal, setShowSetCodeModal] = useState(false);
  
  // Initialize PIN security system
  const pinSecurity = useMobilePinSecurity({
    lockOnBackground: true,
    lockOnOrientationChange: true,
    lockTimeout: 60000 // 1 minute of inactivity
  });
  
  // Handle screen orientation
  useScreenOrientation(isMobile);
  
  // Determine if we need to show PIN modals
  useEffect(() => {
    if (!isMobile) {
      setPinUnlocked(true);
      return;
    }
    
    if (!pinSecurity.hasPin) {
      setShowSetCodeModal(true);
      setPinUnlocked(false);
    } else if (pinSecurity.isLocked) {
      setPinUnlocked(false);
    } else {
      setPinUnlocked(true);
    }
  }, [isMobile, pinSecurity.hasPin, pinSecurity.isLocked]);
  
  // Handle visibility change to relock when app returns to foreground
  useEffect(() => {
    if (!isMobile) return;
    
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && pinSecurity.hasPin) {
        pinSecurity.lock();
        setPinUnlocked(false);
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [isMobile, pinSecurity]);
  
  // PIN verification modal
  const verifyPinModal = (
    <ChatCodeModal
      open={pinSecurity.hasPin && pinSecurity.isLocked}
      onClose={() => {}}
      onPinSuccess={() => setPinUnlocked(true)}
      verifyPin={(code) => pinSecurity.verifyPin(code)}
      lockoutTimer={pinSecurity.lockoutTimer}
      remainingAttempts={pinSecurity.attemptsRemaining}
      isLocked={pinSecurity.isLockedOut}
    />
  );
  
  // PIN setup modal
  const setPinModal = (
    <ChatCodeModal
      open={showSetCodeModal && !pinSecurity.hasPin}
      onClose={() => {}}
      isSetMode={true}
      onSetPin={(code) => {
        pinSecurity.setPin(code);
        setShowSetCodeModal(false);
        setPinUnlocked(true);
      }}
      onPinSuccess={() => {
        setShowSetCodeModal(false);
        setPinUnlocked(true);
      }}
    />
  );
  
  return {
    pinUnlocked,
    showVerifyPin: pinSecurity.hasPin && pinSecurity.isLocked,
    showSetPin: showSetCodeModal && !pinSecurity.hasPin,
    verifyPinModal,
    setPinModal,
    resetPin: pinSecurity.resetPin,
    lock: pinSecurity.lock
  };
}
