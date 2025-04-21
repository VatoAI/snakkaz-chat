
import { useEffect, useState } from "react";
import { useChatCode } from "@/hooks/useChatCode";
import { useIsMobile } from "@/hooks/use-mobile";
import { ChatCodeModal } from "@/components/mobile/ChatCodeModal";

export function useMobilePinGuard({ isMobile }: { isMobile: boolean }) {
  const chatCodeHook = useChatCode();
  const [showSetCodeModal, setShowSetCodeModal] = useState(false);
  const [pinUnlocked, setPinUnlocked] = useState(!isMobile);

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

  // Locking
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
