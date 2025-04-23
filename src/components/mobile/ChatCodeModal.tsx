
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { usePinValidation } from "@/hooks/usePinValidation";
import { PinKeypad } from "./pin/PinKeypad";
import { PinInput } from "./pin/PinInput";
import { PinIcon } from "./pin/PinIcon";
import { PinLockoutWarning } from "./pin/PinLockoutWarning";

interface ChatCodeModalProps {
  open: boolean;
  onClose: () => void;
  onPinSuccess: () => void;
  onSetPin?: (code: string) => void;
  verifyPin?: (code: string) => boolean;
  isSetMode?: boolean;
  isLocked?: boolean;
  remainingAttempts?: number;
}

export const ChatCodeModal = ({
  open,
  onClose,
  onPinSuccess,
  onSetPin,
  verifyPin,
  isSetMode = false,
  remainingAttempts = 5
}: ChatCodeModalProps) => {
  const [showNumber, setShowNumber] = useState(false);
  
  const {
    code,
    setCode,
    error,
    isLocked,
    lockoutTimer,
    animateError,
    validatePin,
    resetState
  } = usePinValidation({
    onSuccess: onPinSuccess,
    verifyPin,
    isSetMode,
    onSetPin
  });

  useEffect(() => {
    if (open) {
      resetState();
    }
  }, [open, resetState]);

  const handleCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value.replace(/\D/g, "");
    setCode(input.slice(0, 4));
    
    if (input.length === 4) {
      setTimeout(() => validatePin(input), 300);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    validatePin(code);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] rounded-lg border-cybergold-500/30 bg-cyberdark-900 backdrop-blur-md">
        <DialogHeader>
          <DialogTitle className="text-center text-lg text-cybergold-200">
            {isSetMode ? "Velg din 4-sifrede Chat-kode" : "Tast inn din Chat-kode"}
          </DialogTitle>
        </DialogHeader>

        <PinIcon isSetMode={isSetMode} animateError={animateError} />
        
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <PinInput
            code={code}
            showNumber={showNumber}
            animateError={animateError}
            onChange={handleCodeChange}
            onToggleVisibility={() => setShowNumber(!showNumber)}
          />
          
          {error && (
            <div className={`text-sm text-cyberred-400 text-center ${animateError ? 'animate-pulse' : ''}`}>
              {error}
            </div>
          )}
          
          {isLocked && <PinLockoutWarning lockoutTimer={lockoutTimer} />}
          
          <PinKeypad
            onNumberPress={(num) => {
              if (code.length < 4) {
                setCode(prev => prev + num);
              }
            }}
            onDelete={() => setCode(prev => prev.slice(0, -1))}
          />
          
          <button 
            type="submit"
            className="mt-2 py-6 text-lg bg-gradient-to-r from-cyberblue-600 to-cyberblue-800 hover:from-cyberblue-500 hover:to-cyberblue-700 shadow-neon-blue"
          >
            {isSetMode ? "Sett kode" : "Lås opp"}
          </button>
        </form>
      </DialogContent>
    </Dialog>
  );
};
