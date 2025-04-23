
import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";

interface PinSecurityState {
  attempts: number;
  lockoutTimer: number;
  isLocked: boolean;
}

export function usePinSecurity() {
  const [securityState, setSecurityState] = useState<PinSecurityState>({
    attempts: 0,
    lockoutTimer: 0,
    isLocked: false
  });
  const { toast } = useToast();

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (securityState.isLocked && securityState.lockoutTimer > 0) {
      interval = setInterval(() => {
        setSecurityState(prev => ({
          ...prev,
          lockoutTimer: prev.lockoutTimer <= 1 ? 0 : prev.lockoutTimer - 1,
          isLocked: prev.lockoutTimer <= 1 ? false : prev.isLocked
        }));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [securityState.isLocked, securityState.lockoutTimer]);

  const handleFailedAttempt = () => {
    setSecurityState(prev => {
      const newAttempts = prev.attempts + 1;
      if (newAttempts >= 5) {
        toast({
          variant: "destructive",
          title: "For mange forsøk",
          description: "Prøv igjen om 5 minutter"
        });
        return {
          attempts: 0,
          isLocked: true,
          lockoutTimer: 300 // 5 minutes
        };
      }
      return {
        ...prev,
        attempts: newAttempts
      };
    });
  };

  const resetSecurity = () => {
    setSecurityState({
      attempts: 0,
      lockoutTimer: 0,
      isLocked: false
    });
  };

  return {
    ...securityState,
    handleFailedAttempt,
    resetSecurity,
    remainingAttempts: 5 - securityState.attempts
  };
}
