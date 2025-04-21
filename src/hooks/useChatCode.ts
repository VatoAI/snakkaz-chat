
import { useState, useEffect } from "react";

export const useChatCode = () => {
  const [chatCode, setChatCodeState] = useState<string | null>(null);
  const [promptForCode, setPromptForCode] = useState(false);

  // On mount, check for code in localStorage
  useEffect(() => {
    const code = localStorage.getItem("chatCode");
    if (code) setChatCodeState(code);
  }, []);

  // Trigger PIN prompt on mobile on mount if code exists (for fast login)
  const promptCodeIfNeeded = () => {
    const code = localStorage.getItem("chatCode");
    if (code) setPromptForCode(true);
  };

  // Set a new PIN code
  const setChatCode = (code: string) => {
    localStorage.setItem("chatCode", code);
    setChatCodeState(code);
    setPromptForCode(false);
  };

  // Verify the entered code
  const verifyChatCode = (code: string) => {
    const stored = localStorage.getItem("chatCode");
    if (stored === code) {
      setPromptForCode(false);
      return true;
    }
    return false;
  };

  // Remove PIN
  const resetChatCode = () => {
    localStorage.removeItem("chatCode");
    setChatCodeState(null);
    setPromptForCode(false);
  };

  return {
    chatCode,
    setChatCode,
    verifyChatCode,
    resetChatCode,
    promptForCode,
    setPromptForCode,
    promptCodeIfNeeded
  };
};
