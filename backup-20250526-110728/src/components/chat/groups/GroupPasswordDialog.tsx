
import React, { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Lock, Eye, EyeOff } from "lucide-react";
import { Group } from "@/types/group";

interface GroupPasswordDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (password: string) => Promise<boolean>;
  group: Group | null;
}

export const GroupPasswordDialog = ({
  isOpen,
  onClose,
  onSubmit,
  group
}: GroupPasswordDialogProps) => {
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      const success = await onSubmit(password);
      if (success) {
        setPassword("");
        onClose();
      } else {
        setError("Feil passord");
      }
    } catch (err) {
      setError("Kunne ikke bekrefte passord");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="bg-cyberdark-900 border border-cybergold-500/30 text-cybergold-200 sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Lock className="h-5 w-5 text-cybergold-500" />
            <span>Passordbeskyttet gruppe</span>
          </DialogTitle>
          <DialogDescription className="text-cybergold-400">
            Skriv inn passord for å bli med i "{group?.name || 'gruppe'}"
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-2">
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="Skriv inn passord..."
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-cyberdark-800 border-cybergold-500/30 pr-10"
                autoFocus
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-cybergold-400"
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>

            {error && (
              <div className="text-sm text-red-500">{error}</div>
            )}
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="ghost"
              onClick={onClose}
              className="text-cybergold-400 hover:text-cybergold-300"
            >
              Avbryt
            </Button>
            <Button
              type="submit"
              disabled={!password.trim() || loading}
              className="bg-cybergold-600 hover:bg-cybergold-700 text-black"
            >
              {loading ? "Verifiserer..." : "Bli med"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
