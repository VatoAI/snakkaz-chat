
import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";

interface UsePinValidationProps {
  onSuccess: () => void;
  verifyPin?: (code: string) => boolean;
  isSetMode?: boolean;
  onSetPin?: (code: string) => void;
  initialIsLocked?: boolean;
}

export const usePinValidation = ({
  onSuccess,
  verifyPin,
  isSetMode = false,
  onSetPin,
  initialIsLocked = false
}: UsePinValidationProps) => {
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [animateError, setAnimateError] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [isLocked, setIsLocked] = useState(initialIsLocked);
  const [lockoutTimer, setLockoutTimer] = useState(0);
  const { toast } = useToast();

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isLocked && lockoutTimer > 0) {
      interval = setInterval(() => {
        setLockoutTimer(prev => {
          if (prev <= 1) {
            setIsLocked(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isLocked, lockoutTimer]);

  const handleFailedAttempt = () => {
    setAttempts(prev => {
      const newAttempts = prev + 1;
      if (newAttempts >= 5) {
        setIsLocked(true);
        setLockoutTimer(300); // 5 minutes
        toast({
          variant: "destructive",
          title: "For mange forsøk",
          description: "Prøv igjen om 5 minutter",
        });
        return 0;
      }
      return newAttempts;
    });
  };

  const validatePin = (pinCode: string) => {
    if (isLocked) {
      setError(`Låst i ${Math.ceil(lockoutTimer / 60)} minutter`);
      return false;
    }

    if (pinCode.length !== 4) {
      setError("Koden må være 4 siffer");
      setAnimateError(true);
      setTimeout(() => setAnimateError(false), 500);
      return false;
    }

    if (isSetMode && onSetPin) {
      onSetPin(pinCode);
      resetState();
      onSuccess();
      return true;
    } 
    
    if (verifyPin && verifyPin(pinCode)) {
      resetState();
      onSuccess();
      return true;
    }

    handleFailedAttempt();
    setError(`Feil kode! ${4 - attempts} forsøk igjen`);
    setAnimateError(true);
    setTimeout(() => setAnimateError(false), 500);
    return false;
  };

  const resetState = () => {
    setCode("");
    setError("");
    setAnimateError(false);
  };

  return {
    code,
    setCode,
    error,
    isLocked,
    lockoutTimer,
    animateError,
    validatePin,
    resetState
  };
};
