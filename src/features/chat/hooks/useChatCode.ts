import { useState, useEffect, useCallback } from "react";
import { useToast } from "@/components/ui/use-toast";

export const useChatCode = () => {
  const [chatCode, setChatCodeState] = useState<string | null>(null);
  const [promptForCode, setPromptForCode] = useState(false);
  const { toast } = useToast();

  // On mount, check for code in localStorage
  useEffect(() => {
    try {
      const code = localStorage.getItem("chatCode");
      if (code) setChatCodeState(code);
    } catch (error) {
      console.error("Error reading chat code from localStorage:", error);
    }
  }, []);

  // Trigger PIN prompt on mobile on mount if code exists (for fast login)
  const promptCodeIfNeeded = useCallback(() => {
    try {
      const code = localStorage.getItem("chatCode");
      if (code) setPromptForCode(true);
    } catch (error) {
      console.error("Error checking for chat code:", error);
    }
  }, []);

  // Set a new PIN code
  const setChatCode = useCallback((code: string) => {
    if (!code || code.length !== 4 || !/^\d{4}$/.test(code)) {
      toast({
        title: "Ugyldig PIN",
        description: "PIN-koden må være nøyaktig 4 siffer",
        variant: "destructive"
      });
      return false;
    }
    
    try {
      localStorage.setItem("chatCode", code);
      setChatCodeState(code);
      setPromptForCode(false);
      
      // Also set the pinHash for mobile security
      localStorage.setItem('pinHash', btoa(code));
      
      return true;
    } catch (error) {
      console.error("Error setting chat code:", error);
      toast({
        title: "Feil",
        description: "Kunne ikke lagre PIN-koden",
        variant: "destructive"
      });
      return false;
    }
  }, [toast]);

  // Verify the entered code
  const verifyChatCode = useCallback((code: string) => {
    try {
      const stored = localStorage.getItem("chatCode");
      if (stored === code) {
        setPromptForCode(false);
        return true;
      }
      return false;
    } catch (error) {
      console.error("Error verifying chat code:", error);
      return false;
    }
  }, []);

  // Remove PIN
  const resetChatCode = useCallback(() => {
    try {
      localStorage.removeItem("chatCode");
      localStorage.removeItem("pinHash");
      setChatCodeState(null);
      setPromptForCode(false);
      return true;
    } catch (error) {
      console.error("Error resetting chat code:", error);
      toast({
        title: "Feil",
        description: "Kunne ikke fjerne PIN-koden",
        variant: "destructive"
      });
      return false;
    }
  }, [toast]);

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
