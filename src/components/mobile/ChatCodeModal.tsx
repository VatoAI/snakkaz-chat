import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { PinKeypad } from "./pin/PinKeypad";
import { PinInput } from "./pin/PinInput";
import { PinLockoutWarning } from "./pin/PinLockoutWarning";
import { PinIcon } from "./pin/PinIcon";

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
  isLocked: initialLockState = false,
  remainingAttempts = 5
}: ChatCodeModalProps) => {
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [showNumber, setShowNumber] = useState(false);
  const [animateError, setAnimateError] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [isLocked, setIsLocked] = useState(initialLockState);
  const [lockoutTimer, setLockoutTimer] = useState(0);
  const { toast } = useToast();

  useEffect(() => {
    setIsLocked(initialLockState);
  }, [initialLockState]);

  useEffect(() => {
    if (open) {
      setCode("");
      setError("");
      setAnimateError(false);
    }
  }, [open]);

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
        setLockoutTimer(300);
        toast({
          variant: "destructive",
          title: "For mange forsøk",
          description: "Prøv igjen om 5 minutter",
        });
        setAttempts(0);
      }
      return newAttempts;
    });
  };

  const handleCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value.replace(/\D/g, "");
    setCode(input.slice(0, 4));
    setError("");
    
    if (input.length === 4) {
      setTimeout(() => handleSubmit(e as unknown as React.FormEvent), 300);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isLocked) {
      setError(`Låst i ${Math.ceil(lockoutTimer / 60)} minutter`);
      return;
    }

    if (code.length !== 4) {
      setError("Koden må være 4 siffer");
      setAnimateError(true);
      setTimeout(() => setAnimateError(false), 500);
      return;
    }

    if (isSetMode && onSetPin) {
      onSetPin(code);
      setCode("");
      setError("");
      onPinSuccess();
    } else if (verifyPin && verifyPin(code)) {
      setCode("");
      setError("");
      setAttempts(0);
      onPinSuccess();
    } else {
      handleFailedAttempt();
      setError(`Feil kode! ${4 - attempts} forsøk igjen`);
      setAnimateError(true);
      setTimeout(() => setAnimateError(false), 500);
      setCode("");
    }
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
                setError("");
              }
            }}
            onDelete={() => setCode(prev => prev.slice(0, -1))}
          />
          
          <Button 
            type="submit"
            className="mt-2 py-6 text-lg bg-gradient-to-r from-cyberblue-600 to-cyberblue-800 hover:from-cyberblue-500 hover:to-cyberblue-700 shadow-neon-blue"
          >
            {isSetMode ? "Sett kode" : "Lås opp"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};
