import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useChatCode } from "@/hooks/useChatCode";
import { useMobilePinSecurity } from "@/hooks/useMobilePinSecurity";
import { PinInput } from "./PinInput";
import { AlertCircle, Shield } from "lucide-react";

interface PinRemoveModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PinRemoveModal = ({ isOpen, onClose }: PinRemoveModalProps) => {
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");
  const [isRemoving, setIsRemoving] = useState(false);
  const { toast } = useToast();
  const { verifyChatCode, resetChatCode } = useChatCode();
  const { resetPin } = useMobilePinSecurity();
  
  // Clear state when dialog opens/closes
  useEffect(() => {
    if (!isOpen) {
      setPin("");
      setError("");
      setIsRemoving(false);
    }
  }, [isOpen]);

  const handlePinComplete = (value: string) => {
    setPin(value);
    setError(""); // Clear any previous errors
  };

  const handleConfirmRemove = async () => {
    if (isRemoving) return; // Prevent multiple clicks
    
    if (!pin) {
      setError("Vennligst skriv inn PIN-koden");
      return;
    }
    
    if (!verifyChatCode(pin)) {
      setError("Feil PIN-kode. Prøv igjen.");
      setPin("");
      return;
    }

    try {
      setIsRemoving(true);
      
      // Remove the PIN from both chat code and mobile security system
      const chatCodeReset = resetChatCode();
      const pinReset = resetPin();
      
      // Also try direct localStorage removal for extra safety
      localStorage.removeItem('chatCode');
      localStorage.removeItem('pinHash');
      
      // Only show success toast if at least one reset worked
      if (chatCodeReset || pinReset) {
        toast({
          title: "PIN-kode fjernet",
          description: "Din PIN-kode er nå deaktivert."
        });
      } else {
        // Show warning if something might have gone wrong
        toast({
          title: "PIN-kode forsøkt fjernet",
          description: "PIN-koden kan ha blitt delvis fjernet. Kontroller innstillingene dine.",
          variant: "warning"
        });
      }
      
      onClose();
    } catch (error) {
      console.error("Error removing PIN:", error);
      toast({
        title: "Feil ved fjerning av PIN",
        description: "Noe gikk galt. Prøv igjen senere.",
        variant: "destructive"
      });
    } finally {
      setIsRemoving(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px] bg-cyberdark-900 border-cybergold-500/30">
        <DialogHeader>
          <DialogTitle className="text-xl text-center text-cybergold-300 flex items-center justify-center gap-2">
            <Shield className="h-5 w-5 text-cyberred-400" />
            Fjern PIN-kode
          </DialogTitle>
          <DialogDescription className="text-center text-cyberdark-300">
            Skriv inn din nåværende PIN-kode for å bekrefte fjerning.
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
          
          <div className="bg-cyberred-900/20 rounded-md p-3 border border-cyberred-500/20">
            <div className="flex items-start gap-2">
              <AlertCircle className="h-5 w-5 text-cyberred-400 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-cyberdark-300">
                <span className="font-medium text-cyberred-300">Advarsel:</span> Hvis du fjerner PIN-koden, vil appen din være mindre sikker. Dette vil:
                <ul className="list-disc pl-5 mt-1 space-y-1">
                  <li>Deaktivere automatisk låsing på mobile enheter</li>
                  <li>Fjerne PIN-beskyttelse fra sensitive handlinger</li>
                  <li>Redusere sikkerheten for din krypterte data</li>
                </ul>
              </p>
            </div>
          </div>
        </div>

        <DialogFooter className="flex flex-col sm:flex-row gap-2">
          <Button 
            variant="outline" 
            onClick={onClose} 
            className="w-full sm:w-auto border-cybergold-500/30"
            disabled={isRemoving}
          >
            Avbryt
          </Button>
          
          <Button 
            onClick={handleConfirmRemove} 
            variant="destructive"
            className="w-full sm:w-auto bg-cyberred-900 hover:bg-cyberred-800 text-white"
            disabled={isRemoving || pin.length !== 4}
          >
            {isRemoving ? "Fjerner..." : "Bekreft fjerning"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
