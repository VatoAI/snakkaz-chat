
import { useEffect, useState } from "react";
import { useChatCode } from "@/hooks/useChatCode";
import { ChatCodeModal } from "@/components/mobile/ChatCodeModal";
import { useToast } from "@/components/ui/use-toast";

export function useMobilePinGuard({ isMobile }: { isMobile: boolean }) {
  const chatCodeHook = useChatCode();
  const [showSetCodeModal, setShowSetCodeModal] = useState(false);
  const [pinUnlocked, setPinUnlocked] = useState(!isMobile);
  const { toast } = useToast();

  // Lock orientation for mobile devices
  useEffect(() => {
    if (isMobile) {
      try {
        // Lock to portrait
        if (screen.orientation && screen.orientation.lock) {
          screen.orientation.lock('portrait').catch(console.error);
        }
      } catch (error) {
        console.error('Could not lock screen orientation:', error);
      }
    }
  }, [isMobile]);

  // Handle visibility change to relock when app returns to foreground
  useEffect(() => {
    if (isMobile) {
      const handleVisibilityChange = () => {
        if (document.visibilityState === 'visible' && chatCodeHook.chatCode) {
          setPinUnlocked(false);
          chatCodeHook.promptCodeIfNeeded();
        }
      };

      document.addEventListener('visibilitychange', handleVisibilityChange);
      return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
    }
  }, [isMobile, chatCodeHook]);

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
  
  const mobilePinModal = (
    <ChatCodeModal
      open={chatCodeHook.promptForCode}
      onClose={() => {}}
      onPinSuccess={() => setPinUnlocked(true)}
      verifyPin={chatCodeHook.verifyChatCode}
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
