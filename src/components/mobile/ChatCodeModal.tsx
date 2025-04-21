
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Lock, Unlock, X } from "lucide-react";

interface ChatCodeModalProps {
  open: boolean;
  onClose: () => void;
  onPinSuccess: () => void;
  onSetPin?: (code: string) => void;
  verifyPin?: (code: string) => boolean;
  isSetMode?: boolean;
}

export const ChatCodeModal = ({
  open,
  onClose,
  onPinSuccess,
  onSetPin,
  verifyPin,
  isSetMode = false
}: ChatCodeModalProps) => {
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [showNumber, setShowNumber] = useState(false);
  const [animateError, setAnimateError] = useState(false);

  useEffect(() => {
    if (open) {
      // Reset state when dialog opens
      setCode("");
      setError("");
      setAnimateError(false);
    }
  }, [open]);

  const handleCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value.replace(/\D/g, ""); // only digits
    setCode(input.slice(0, 4));
    setError("");
    
    // Auto-submit when 4 digits entered
    if (input.length === 4) {
      setTimeout(() => {
        handleSubmit(e as unknown as React.FormEvent);
      }, 300);
    }
  };

  const toggleShowNumber = () => {
    setShowNumber(!showNumber);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
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
      onPinSuccess();
    } else {
      setError("Feil kode!");
      setAnimateError(true);
      setTimeout(() => setAnimateError(false), 500);
      // Clear code on error for better UX
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
        
        <div className="mt-4 mb-2 flex justify-center">
          <div className={`p-4 rounded-full bg-cyberdark-800 border border-cybergold-500/30 
                        ${animateError ? 'animate-shake border-cyberred-500' : ''}`}>
            {isSetMode ? (
              <Lock className="h-8 w-8 text-cybergold-400" />
            ) : (
              <Unlock className="h-8 w-8 text-cybergold-400" />
            )}
          </div>
        </div>
        
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="relative">
            <Input
              pattern="[0-9]*"
              type={showNumber ? "text" : "password"}
              maxLength={4}
              autoFocus
              value={code}
              onChange={handleCodeChange}
              inputMode="numeric"
              placeholder="0000"
              className={`text-center text-2xl tracking-widest py-6 bg-cyberdark-800 border-cybergold-500/30
                        ${animateError ? 'border-cyberred-500 animate-shake' : ''}`}
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={toggleShowNumber}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-cyberblue-400"
            >
              {showNumber ? (
                <X className="h-4 w-4" />
              ) : (
                <span className="text-xs">Vis</span>
              )}
            </Button>
          </div>
          
          {error && (
            <div className={`text-sm text-cyberred-400 text-center ${animateError ? 'animate-pulse' : ''}`}>
              {error}
            </div>
          )}
          
          <div className="grid grid-cols-3 gap-2 mt-2">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 0].map((num, index) => (
              <Button
                key={num}
                type="button"
                onClick={() => {
                  if (code.length < 4) {
                    setCode(prev => prev + num);
                    setError("");
                  }
                }}
                className={`py-4 text-xl font-medium bg-cyberdark-800 hover:bg-cyberdark-700 border border-cybergold-500/20
                          ${index === 9 ? 'col-start-2' : ''}`}
              >
                {num}
              </Button>
            ))}
            <Button
              type="button"
              onClick={() => setCode(prev => prev.slice(0, -1))}
              className="py-4 text-xl font-medium bg-cyberdark-800 hover:bg-cyberred-900/50 text-cyberred-400 border border-cybergold-500/20"
            >
              ←
            </Button>
          </div>
          
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
