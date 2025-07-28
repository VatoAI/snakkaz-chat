
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Shield, EyeIcon, EyeOffIcon } from "lucide-react";
import { useAuth } from '@/hooks/useAuth';

interface PinVerifyProps {
  onSuccess?: () => void;
}

export function PinVerify({ onSuccess }: PinVerifyProps) {
  const { pinLocked, setPinLocked, hasPinSetup, setHasPinSetup } = useAuth();
  const [open, setOpen] = useState(false);
  const [pin, setPin] = useState("");
  const [confirmPin, setConfirmPin] = useState("");
  const [showPin, setShowPin] = useState(false);
  const [error, setError] = useState("");
  const [isSettingUp, setIsSettingUp] = useState(false);
  const [attempts, setAttempts] = useState(0);

  // Show dialog when PIN is locked
  useEffect(() => {
    if (pinLocked && hasPinSetup) {
      setOpen(true);
      setIsSettingUp(false);
    } else if (!hasPinSetup) {
      setIsSettingUp(true);
    }
  }, [pinLocked, hasPinSetup]);

  const handleVerifyPin = () => {
    // In a real app, this would verify against a securely stored PIN
    const savedPin = localStorage.getItem('snakkaz_pin') || "1234";
    
    if (pin === savedPin) {
      setPinLocked(false);
      setOpen(false);
      setPin("");
      setError("");
      setAttempts(0);
      if (onSuccess) onSuccess();
    } else {
      const newAttempts = attempts + 1;
      setAttempts(newAttempts);
      setError(`Feil PIN-kode. ${newAttempts >= 3 ? 'For mange forsøk, vent litt.' : ''}`);
      setPin("");
      
      // Lock out after 3 attempts
      if (newAttempts >= 3) {
        setTimeout(() => {
          setAttempts(0);
        }, 30000); // 30 second cooldown
      }
    }
  };

  const handleSetupPin = () => {
    if (pin.length !== 4) {
      setError("PIN-kode må være 4 siffer");
      return;
    }
    
    if (pin !== confirmPin) {
      setError("PIN-kodene må være like");
      return;
    }
    
    // Save PIN
    localStorage.setItem('snakkaz_pin', pin);
    localStorage.setItem('snakkaz_pin_setup', 'true');
    
    setHasPinSetup(true);
    setPinLocked(false);
    setOpen(false);
    setPin("");
    setConfirmPin("");
    setError("");
    if (onSuccess) onSuccess();
  };

  const togglePinVisibility = () => {
    setShowPin(!showPin);
  };

  if (!open && !isSettingUp) return null;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[425px] bg-cyberdark-900 border-cyberdark-700">
        <DialogHeader>
          <DialogTitle className="text-center flex justify-center items-center gap-2">
            <Shield className="h-5 w-5 text-cyberblue-400" />
            <span>{isSettingUp ? "Opprett PIN-kode" : "Verifiser PIN-kode"}</span>
          </DialogTitle>
        </DialogHeader>
        <div className="py-4 flex flex-col gap-4">
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <Shield className="h-16 w-16 text-cyberblue-400 opacity-50" />
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              {isSettingUp 
                ? "Opprett en 4-sifret PIN-kode for å sikre appen din" 
                : "Skriv inn din 4-sifret PIN-kode for å fortsette"}
            </p>
          </div>

          <div className="relative">
            <Input
              type={showPin ? "text" : "password"}
              placeholder="1234"
              value={pin}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, "").substring(0, 4);
                setPin(value);
              }}
              className="text-center text-xl"
              maxLength={4}
              pattern="[0-9]*"
              inputMode="numeric"
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="absolute right-2 top-1/2 transform -translate-y-1/2"
              onClick={togglePinVisibility}
            >
              {showPin ? <EyeOffIcon className="h-4 w-4" /> : <EyeIcon className="h-4 w-4" />}
            </Button>
          </div>

          {isSettingUp && (
            <div className="relative">
              <Input
                type={showPin ? "text" : "password"}
                placeholder="Bekreft PIN"
                value={confirmPin}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, "").substring(0, 4);
                  setConfirmPin(value);
                }}
                className="text-center text-xl"
                maxLength={4}
                pattern="[0-9]*"
                inputMode="numeric"
              />
            </div>
          )}

          {error && (
            <div className="text-sm text-red-500 text-center">
              {error}
            </div>
          )}

          <Button 
            onClick={isSettingUp ? handleSetupPin : handleVerifyPin}
            disabled={isSettingUp ? pin.length !== 4 || confirmPin.length !== 4 : pin.length !== 4 || attempts >= 3}
            className="w-full mt-2"
          >
            {isSettingUp ? "Opprett PIN" : "Verifiser"}
          </Button>
          
          {!isSettingUp && (
            <Button 
              variant="link" 
              className="text-xs text-muted-foreground"
              onClick={() => {
                // This would trigger a reset flow in a real app
                alert("PIN-kode gjenopprettingsfunksjon ville starte her");
              }}
            >
              Glemt PIN-koden?
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
