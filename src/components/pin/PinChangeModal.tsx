
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useChatCode } from "@/hooks/useChatCode";
import { PinInput } from "./PinInput";
import { Shield, AlertCircle } from "lucide-react";

interface PinChangeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PinChangeModal = ({ isOpen, onClose }: PinChangeModalProps) => {
  const [step, setStep] = useState(1);
  const [currentPin, setCurrentPin] = useState("");
  const [newPin, setNewPin] = useState("");
  const [confirmPin, setConfirmPin] = useState("");
  const [error, setError] = useState("");
  const { toast } = useToast();
  const { verifyChatCode, setChatCode } = useChatCode();

  useEffect(() => {
    if (isOpen) {
      setStep(1);
      setCurrentPin("");
      setNewPin("");
      setConfirmPin("");
      setError("");
    }
  }, [isOpen]);

  const handlePinComplete = (value: string) => {
    if (step === 1) {
      if (verifyChatCode(value)) {
        setCurrentPin(value);
        setStep(2);
        setError("");
      } else {
        setError("Feil PIN-kode. Prøv igjen.");
      }
    } else if (step === 2) {
      setNewPin(value);
      setStep(3);
    } else {
      setConfirmPin(value);
    }
  };

  const handleConfirm = () => {
    if (newPin !== confirmPin) {
      setError("De nye PIN-kodene matcher ikke. Prøv igjen.");
      setStep(2);
      setNewPin("");
      setConfirmPin("");
      return;
    }

    if (newPin === currentPin) {
      setError("Den nye PIN-koden kan ikke være den samme som den nåværende.");
      setStep(2);
      setNewPin("");
      setConfirmPin("");
      return;
    }

    // Update the PIN
    setChatCode(newPin);
    
    toast({
      title: "PIN-kode oppdatert",
      description: "Din nye sikre PIN-kode er nå aktivert."
    });
    
    onClose();
  };

  const getStepTitle = () => {
    switch (step) {
      case 1: return "Angi nåværende PIN-kode";
      case 2: return "Velg ny PIN-kode";
      case 3: return "Bekreft ny PIN-kode";
      default: return "";
    }
  };

  const getStepDescription = () => {
    switch (step) {
      case 1: return "Skriv inn din nåværende PIN-kode for å fortsette.";
      case 2: return "Velg en ny 4-sifret PIN-kode som er lett å huske, men vanskelig å gjette.";
      case 3: return "Skriv inn den nye PIN-koden igjen for å bekrefte.";
      default: return "";
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px] bg-cyberdark-900 border-cybergold-500/30">
        <DialogHeader>
          <DialogTitle className="text-xl text-center text-cybergold-300 flex items-center justify-center gap-2">
            <Shield className="h-5 w-5 text-cybergold-400" />
            {getStepTitle()}
          </DialogTitle>
          <DialogDescription className="text-center text-cyberdark-300">
            {getStepDescription()}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {error && (
            <div className="text-cyberred-400 text-center text-sm bg-cyberred-900/20 py-2 px-3 rounded-md border border-cyberred-500/20 flex items-center justify-center gap-2">
              <AlertCircle className="h-4 w-4" />
              {error}
            </div>
          )}
          
          <div className="flex items-center justify-center mb-6">
            <PinInput 
              onComplete={handlePinComplete} 
              length={4}
              placeholder="●"
            />
          </div>
        </div>

        <DialogFooter className="flex flex-col sm:flex-row gap-2">
          <Button variant="outline" onClick={onClose} className="w-full sm:w-auto border-cybergold-500/30">
            Avbryt
          </Button>
          
          {step === 3 && (
            <Button 
              onClick={handleConfirm} 
              className="w-full sm:w-auto bg-gradient-to-r from-cybergold-600 to-cybergold-500 text-cyberdark-950 hover:from-cybergold-500 hover:to-cybergold-400"
            >
              Oppdater PIN-kode
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
