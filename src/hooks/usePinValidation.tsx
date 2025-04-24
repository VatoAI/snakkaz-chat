
import { useState, useEffect } from "react";
import { useMobilePinSecurity } from "./useMobilePinSecurity";
import { useToast } from "@/components/ui/use-toast";

interface UsePinValidationProps {
  onSuccess: () => void;
  onCancel?: () => void;
  isSetMode?: boolean;
  pinRequired?: boolean;
  preventAutoUnlock?: boolean;
}

export const usePinValidation = ({
  onSuccess,
  onCancel,
  isSetMode = false,
  pinRequired = true,
  preventAutoUnlock = false
}: UsePinValidationProps) => {
  const [showPinModal, setShowPinModal] = useState(pinRequired);
  const toast = useToast();
  
  const security = useMobilePinSecurity({
    lockOnBackground: true,
    lockOnOrientationChange: !isSetMode, // Don't lock on orientation when setting PIN
    lockTimeout: 60000 // 1 minute of inactivity
  });
  
  // Auto-unlock if no PIN required
  useEffect(() => {
    if (!pinRequired || (!security.hasPin && !isSetMode)) {
      onSuccess();
    }
  }, [pinRequired, security.hasPin, isSetMode, onSuccess]);
  
  // Auto-unlock if already unlocked (unless preventAutoUnlock is true)
  useEffect(() => {
    if (!security.isLocked && security.hasPin && !preventAutoUnlock) {
      onSuccess();
    }
  }, [security.isLocked, security.hasPin, onSuccess, preventAutoUnlock]);
  
  // Handle PIN setup
  const handleSetPin = (pin: string): boolean => {
    const success = security.setPin(pin);
    if (success) {
      toast.toast({
        title: "PIN Set Successfully",
        description: "Your secure PIN has been set",
        variant: "default"
      });
      setShowPinModal(false);
      onSuccess();
    }
    return success;
  };
  
  // Handle PIN verification
  const handleVerifyPin = (pin: string): boolean => {
    const success = security.verifyPin(pin);
    if (success) {
      setShowPinModal(false);
      onSuccess();
    }
    return success;
  };
  
  // Handle cancel
  const handleCancel = () => {
    setShowPinModal(false);
    if (onCancel) onCancel();
  };
  
  return {
    showPinModal,
    setShowPinModal,
    handleSetPin,
    handleVerifyPin,
    handleCancel,
    isLocked: security.isLocked,
    lockoutTimer: security.lockoutTimer,
    remainingAttempts: security.attemptsRemaining,
    isLockedOut: security.isLockedOut,
    hasPin: security.hasPin,
    lock: security.lock,
    resetPin: security.resetPin
  };
};
