
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { useState, useEffect } from "react";
import { useChatCode } from "@/hooks/useChatCode";
import { useIsMobile } from "@/hooks/use-mobile";
import { PinInput } from "@/components/pin/PinInput";
import { AlertCircle, Loader2 } from "lucide-react";
import { usePinPreferences } from "@/hooks/usePinPreferences";
import { useAuth } from "@/contexts/AuthContext";

interface DeleteMessageDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isDeleting?: boolean;
}

export const DeleteMessageDialog = ({ isOpen, onClose, onConfirm, isDeleting = false }: DeleteMessageDialogProps) => {
  const { chatCode, verifyChatCode } = useChatCode();
  const [showPin, setShowPin] = useState(false);
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");
  const { user } = useAuth();
  const { preferences } = usePinPreferences(user?.id || null);
  const isMobile = useIsMobile();
  
  // Only require PIN verification if enabled in preferences
  const requirePin = chatCode && ((isMobile && preferences.requirePinForSensitive) || preferences.requirePinForDelete);
  
  useEffect(() => {
    if (!isOpen) {
      // Reset state when dialog closes
      setShowPin(false);
      setPin("");
      setError("");
    }
  }, [isOpen]);

  const handlePinComplete = (value: string) => {
    setPin(value);
  };

  const handleConfirm = () => {
    if (isDeleting) return; // Prevent multiple clicks
    
    if (requirePin && !showPin) {
      setShowPin(true);
      return;
    }
    
    if (requirePin && showPin) {
      if (verifyChatCode(pin)) {
        setShowPin(false);
        setPin("");
        setError("");
        onConfirm();
      } else {
        setError("Feil PIN-kode. Prøv igjen.");
        setPin("");
      }
      return;
    }
    
    // No PIN required
    onConfirm();
  };

  return (
    <Dialog 
      open={isOpen} 
      onOpenChange={(open) => !open && !isDeleting && onClose()}
    >
      <DialogContent className="bg-cyberdark-900 border-cybergold-500/30">
        <DialogHeader>
          <DialogTitle className="text-cybergold-300">
            {showPin ? "Bekreft med PIN-kode" : "Slett melding"}
          </DialogTitle>
          <DialogDescription className="text-cyberdark-300">
            {showPin 
              ? "Skriv inn din PIN-kode for å bekrefte sletting."
              : "Er du sikker på at du vil slette denne meldingen? Dette kan ikke angres."}
          </DialogDescription>
        </DialogHeader>
        
        {showPin && (
          <div className="py-4 space-y-4">
            {error && (
              <div className="text-cyberred-400 text-center text-sm bg-cyberred-900/20 py-2 px-3 rounded-md border border-cyberred-500/20 flex items-center justify-center gap-2">
                <AlertCircle className="h-4 w-4" />
                {error}
              </div>
            )}
            
            <div className="flex items-center justify-center">
              <PinInput 
                onComplete={handlePinComplete}
                length={4}
                placeholder="●"
              />
            </div>
          </div>
        )}
        
        <DialogFooter>
          <Button
            variant="outline"
            onClick={onClose}
            className="border-cybergold-500/30 text-cybergold-300"
            disabled={isDeleting}
          >
            Avbryt
          </Button>
          <Button
            variant="destructive"
            onClick={handleConfirm}
            className="bg-red-900 hover:bg-red-800 text-white border-none"
            disabled={(showPin && !pin) || isDeleting}
          >
            {isDeleting ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Sletter...
              </>
            ) : (
              showPin ? "Bekreft" : "Slett"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
