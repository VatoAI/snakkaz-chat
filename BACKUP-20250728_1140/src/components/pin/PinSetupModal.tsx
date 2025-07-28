
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { useChatCode } from "@/hooks/useChatCode";
import { PinInput } from "./PinInput";
import { Shield, Info } from "lucide-react";

interface PinSetupModalProps {
  isOpen: boolean;
  onClose: () => void;
  isRegistration?: boolean;
}

export const PinSetupModal = ({ isOpen, onClose, isRegistration = false }: PinSetupModalProps) => {
  const [step, setStep] = useState(1);
  const [pin, setPin] = useState("");
  const [confirmPin, setConfirmPin] = useState("");
  const [error, setError] = useState("");
  const { toast } = useToast();
  const navigate = useNavigate();
  const { setChatCode } = useChatCode();

  useEffect(() => {
    if (isOpen) {
      setStep(1);
      setPin("");
      setConfirmPin("");
      setError("");
    }
  }, [isOpen]);

  const handlePinComplete = (value: string) => {
    if (step === 1) {
      setPin(value);
      setStep(2);
    } else {
      setConfirmPin(value);
    }
  };

  const handleConfirm = () => {
    if (pin !== confirmPin) {
      setError("PIN-kodene matcher ikke. Prøv igjen.");
      setStep(1);
      setPin("");
      setConfirmPin("");
      return;
    }

    // Store the PIN
    setChatCode(pin);
    
    toast({
      title: "PIN-kode opprettet",
      description: "Din sikre PIN-kode er nå aktivert."
    });
    
    onClose();
    
    // If this is part of registration, navigate to the chat
    if (isRegistration) {
      navigate("/chat");
    }
  };

  const handleSkip = () => {
    toast({
      title: "PIN-kode hopper over",
      description: "Du kan aktivere PIN-kode senere fra profilinnstillingene."
    });
    onClose();
    
    if (isRegistration) {
      navigate("/chat");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px] bg-cyberdark-900 border-cybergold-500/30">
        <DialogHeader>
          <DialogTitle className="text-xl text-center text-cybergold-300 flex items-center justify-center gap-2">
            <Shield className="h-5 w-5 text-cybergold-400" />
            {step === 1 ? "Opprett sikker PIN-kode" : "Bekreft din PIN-kode"}
          </DialogTitle>
          <DialogDescription className="text-center text-cyberdark-300">
            {step === 1 ? (
              "Denne 4-sifrede PIN-koden vil beskytte appen på mobilenheter og sikre sensitive handlinger."
            ) : (
              "Bekreft PIN-koden din for å sikre at du husker den riktig."
            )}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {error && (
            <div className="text-cyberred-400 text-center text-sm bg-cyberred-900/20 py-2 px-3 rounded-md border border-cyberred-500/20">
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
          
          <div className="bg-cyberdark-800/60 rounded-md p-3 border border-cybergold-500/20">
            <div className="flex items-start gap-2">
              <Info className="h-5 w-5 text-cybergold-400 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-cyberdark-300">
                Din PIN-kode vil brukes til å:
                <ul className="list-disc pl-5 mt-1 space-y-1">
                  <li>Låse opp appen på mobile enheter</li>
                  <li>Bekrefte viktige handlinger som å slette meldinger</li>
                  <li>Beskytte din krypterte data</li>
                </ul>
              </p>
            </div>
          </div>
        </div>

        <DialogFooter className="flex flex-col sm:flex-row gap-2">
          {!isRegistration && (
            <Button variant="outline" onClick={onClose} className="w-full sm:w-auto border-cybergold-500/30">
              Avbryt
            </Button>
          )}
          
          <Button variant="outline" onClick={handleSkip} className="w-full sm:w-auto text-cyberdark-300 border-cybergold-500/30">
            Hopp over
          </Button>
          
          {step === 2 && (
            <Button 
              onClick={handleConfirm} 
              className="w-full sm:w-auto bg-gradient-to-r from-cybergold-600 to-cybergold-500 text-cyberdark-950 hover:from-cybergold-500 hover:to-cybergold-400"
            >
              Bekreft PIN-kode
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
