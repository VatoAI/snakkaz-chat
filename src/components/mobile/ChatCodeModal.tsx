
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

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

  const handleCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value.replace(/\D/g, ""); // only digits
    setCode(input.slice(0, 4));
    setError("");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (code.length !== 4) {
      setError("Koden må være 4 siffer");
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
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {isSetMode ? "Velg din 4-sifrede Chat-kode" : "Tast inn din Chat-kode"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Input
            pattern="[0-9]*"
            type="text"
            maxLength={4}
            autoFocus
            value={code}
            onChange={handleCodeChange}
            inputMode="numeric"
            placeholder="0000"
            className="text-center text-2xl tracking-widest"
          />
          {error && <div className="text-sm text-cyberred-400 text-center">{error}</div>}
          <Button type="submit">
            {isSetMode ? "Sett kode" : "Lås opp"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};
