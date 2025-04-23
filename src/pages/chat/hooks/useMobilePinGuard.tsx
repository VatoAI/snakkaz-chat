
import { useState, useEffect } from "react";
import { useChatCode } from "@/hooks/useChatCode";
import { ChatCodeModal } from "@/components/mobile/ChatCodeModal";
import { usePinSecurity } from "@/hooks/usePinSecurity";
import { useScreenOrientation } from "@/hooks/useScreenOrientation";

export function useMobilePinGuard({ isMobile }: { isMobile: boolean }) {
  const chatCodeHook = useChatCode();
  const [showSetCodeModal, setShowSetCodeModal] = useState(false);
  const [pinUnlocked, setPinUnlocked] = useState(!isMobile);
  const { isLocked, handleFailedAttempt, resetSecurity, remainingAttempts } = usePinSecurity();

  // Handle screen orientation
  useScreenOrientation(isMobile);

  // Handle visibility change to relock when app returns to foreground
  useEffect(() => {
    if (isMobile) {
      const handleVisibilityChange = () => {
        if (document.visibilityState === 'visible' && chatCodeHook.chatCode) {
          setPinUnlocked(false);
          chatCodeHook.promptCodeIfNeeded();
          resetSecurity();
        }
      };

      document.addEventListener('visibilitychange', handleVisibilityChange);
      return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
    }
  }, [isMobile, chatCodeHook, resetSecurity]);

  // Prompt PIN setup or entry on mobile if needed
  useEffect(() => {
    if (isMobile) {
      if (!chatCodeHook.chatCode) {
        setShowSetCodeModal(true);
      } else {
        chatCodeHook.promptCodeIfNeeded();
      }
    } else {
      setPinUnlocked(true);
    }
  }, [isMobile, chatCodeHook.chatCode]);

  // Lock/unlock handling
  useEffect(() => {
    if (!isMobile) setPinUnlocked(true);
    else if (chatCodeHook.promptForCode) setPinUnlocked(false);
    else setPinUnlocked(true);
  }, [chatCodeHook.promptForCode, isMobile]);

  const showMobilePinModal = isMobile && !pinUnlocked;

  const handlePinFailure = () => {
    handleFailedAttempt();
  };
  
  const mobilePinModal = (
    <ChatCodeModal
      open={chatCodeHook.promptForCode}
      onClose={() => {}}
      onPinSuccess={() => setPinUnlocked(true)}
      verifyPin={(code) => {
        const isValid = chatCodeHook.verifyChatCode(code);
        if (!isValid && !isLocked) {
          handlePinFailure();
        }
        return isValid;
      }}
      remainingAttempts={remainingAttempts}
    />
  );

  const setPinModal = (
    <ChatCodeModal
      open={showSetCodeModal && !chatCodeHook.chatCode}
      onClose={() => {}}
      isSetMode
      onSetPin={(code) => {
        chatCodeHook.setChatCode(code);
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
    showSetCodeModal,
    setShowSetCodeModal,
    pinUnlocked,
    chatCodeHook,
    showMobilePinModal,
    mobilePinModal,
    setPinModal
  };
}
