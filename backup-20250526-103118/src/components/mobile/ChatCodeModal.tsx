
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { PinInput } from "./pin/PinInput";
import { PinKeypad } from "./pin/PinKeypad";
import { PinIcon } from "./pin/PinIcon";
import { PinLockoutWarning } from "./pin/PinLockoutWarning";

interface ChatCodeModalProps {
  open: boolean;
  onClose: () => void;
  onPinSuccess: () => void;
  onSetPin?: (code: string) => void;
  verifyPin?: (code: string) => boolean;
  isSetMode?: boolean;
  lockoutTimer?: number;
  remainingAttempts?: number;
  isLocked?: boolean;
}

export const ChatCodeModal = ({
  open,
  onClose,
  onPinSuccess,
  onSetPin,
  verifyPin,
  isSetMode = false,
  lockoutTimer = 0,
  remainingAttempts = 5,
  isLocked = false
}: ChatCodeModalProps) => {
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [showNumber, setShowNumber] = useState(false);
  const [animateError, setAnimateError] = useState(false);
  
  // Clear state when dialog opens/closes
  useEffect(() => {
    if (open) {
      setCode("");
      setError("");
      setAnimateError(false);
      setShowNumber(false);
    }
  }, [open]);
  
  // Handle code submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    validatePin();
  };
  
  // Handle PIN validation
  const validatePin = () => {
    // Don't allow submission during lockout
    if (isLocked || lockoutTimer > 0) {
      setError(`Locked for ${Math.ceil(lockoutTimer / 60)} minutes`);
      return;
    }
    
    // Validate PIN length
    if (code.length !== 4) {
      setError("PIN must be 4 digits");
      showErrorAnimation();
      return;
    }
    
    // Handle set mode vs verify mode
    if (isSetMode && onSetPin) {
      onSetPin(code);
      onPinSuccess();
    } else if (verifyPin) {
      if (verifyPin(code)) {
        onPinSuccess();
      } else {
        showErrorAnimation();
        setError(`Incorrect PIN! ${remainingAttempts} attempts remaining`);
      }
    }
  };
  
  // Show error animation
  const showErrorAnimation = () => {
    setAnimateError(true);
    setTimeout(() => setAnimateError(false), 500);
  };
  
  // Auto-submit when code reaches 4 digits
  useEffect(() => {
    if (code.length === 4) {
      const timer = setTimeout(() => validatePin(), 300);
      return () => clearTimeout(timer);
    }
  }, [code]);
  
  // Handle keypad input
  const handleNumberPress = (num: number) => {
    if (code.length < 4) {
      setCode(prev => prev + num);
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] rounded-lg border-cybergold-500/30 bg-cyberdark-900 backdrop-blur-md">
        <DialogHeader>
          <DialogTitle className="text-center text-lg text-cybergold-200">
            {isSetMode ? "Set 4-digit PIN code" : "Enter your PIN code"}
          </DialogTitle>
        </DialogHeader>

        <PinIcon isSetMode={isSetMode} animateError={animateError} />
        
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <PinInput
            code={code}
            showNumber={showNumber}
            animateError={animateError}
            onChange={(e) => {
              const input = e.target.value.replace(/\D/g, "");
              setCode(input.slice(0, 4));
            }}
            onToggleVisibility={() => setShowNumber(!showNumber)}
          />
          
          {error && (
            <div className={`text-sm text-cyberred-400 text-center ${animateError ? 'animate-pulse' : ''}`}>
              {error}
            </div>
          )}
          
          {(isLocked || lockoutTimer > 0) && <PinLockoutWarning lockoutTimer={lockoutTimer} />}
          
          <PinKeypad
            onNumberPress={handleNumberPress}
            onDelete={() => setCode(prev => prev.slice(0, -1))}
          />
          
          <button 
            type="submit"
            disabled={isLocked || lockoutTimer > 0}
            className={`mt-2 py-6 text-lg bg-gradient-to-r ${
              isLocked || lockoutTimer > 0 
                ? 'from-cybergold-800/30 to-cybergold-900/30 cursor-not-allowed' 
                : 'from-cyberblue-600 to-cyberblue-800 hover:from-cyberblue-500 hover:to-cyberblue-700 shadow-neon-blue'
            }`}
          >
            {isSetMode ? "Set PIN" : "Unlock"}
          </button>
        </form>
      </DialogContent>
    </Dialog>
  );
};
