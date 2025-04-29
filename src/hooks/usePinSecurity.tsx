import { useState, useCallback, useEffect } from 'react';
import { useToast } from './use-toast';
import { useLocalStorage } from './useLocalStorage';
import { 
  generateSalt, 
  hashPin, 
  verifyPin, 
  deriveKeyFromPin 
} from '@/utils/security/secure-pin';

export interface PinSecurityOptions {
  maxAttempts: number;
  lockoutTime: number; // i sekunder
  pinDigits: number;
  enforceComplexity: boolean;
  requireBiometric: boolean;
}

const DEFAULT_OPTIONS: PinSecurityOptions = {
  maxAttempts: 5,
  lockoutTime: 300, // 5 minutter
  pinDigits: 6,
  enforceComplexity: true,
  requireBiometric: false
};

export function usePinSecurity(options?: Partial<PinSecurityOptions>) {
  const { toast } = useToast();
  const mergedOptions = { ...DEFAULT_OPTIONS, ...options };
  
  // Lagre PIN-hash og salt i localStorage
  const [pinHash, setPinHash] = useLocalStorage<string | null>('secure-pin-hash', null);
  const [pinSalt, setPinSalt] = useLocalStorage<string | null>('secure-pin-salt', null);
  
  // State for PIN-beskyttelse
  const [isLocked, setIsLocked] = useState<boolean>(!!pinHash);
  const [attempts, setAttempts] = useState<number>(0);
  const [lockoutTimer, setLockoutTimer] = useState<number>(0);
  
  // Sjekk om PIN er komplisert nok
  const isPinComplex = useCallback((pin: string): boolean => {
    if (!mergedOptions.enforceComplexity) return true;
    
    // PIN må ha riktig antall siffer
    if (pin.length !== mergedOptions.pinDigits) return false;
    
    // Sjekk at alle tegn er tall
    if (!/^\d+$/.test(pin)) return false;
    
    // For 6-sifrede PINs, kontroller repeterende tall eller sekvenser
    if (pin.length >= 6) {
      // Ikke tillat samme tall 3 ganger på rad (f.eks. 111)
      if (/(\d)\1{2,}/.test(pin)) return false;
      
      // Ikke tillat oppadgående sekvenser (f.eks. 123)
      for (let i = 0; i < pin.length - 2; i++) {
        const first = parseInt(pin[i]);
        const second = parseInt(pin[i + 1]);
        const third = parseInt(pin[i + 2]);
        if (second === first + 1 && third === second + 1) return false;
      }
      
      // Ikke tillat nedadgående sekvenser (f.eks. 321)
      for (let i = 0; i < pin.length - 2; i++) {
        const first = parseInt(pin[i]);
        const second = parseInt(pin[i + 1]);
        const third = parseInt(pin[i + 2]);
        if (second === first - 1 && third === second - 1) return false;
      }
    }
    
    return true;
  }, [mergedOptions.enforceComplexity, mergedOptions.pinDigits]);
  
  // Håndter lockout timer
  useEffect(() => {
    if (lockoutTimer <= 0) return;
    
    const interval = setInterval(() => {
      setLockoutTimer(prev => Math.max(0, prev - 1));
    }, 1000);
    
    return () => clearInterval(interval);
  }, [lockoutTimer]);
  
  // Opprett en ny PIN
  const setupPin = useCallback(async (pin: string): Promise<boolean> => {
    if (!isPinComplex(pin)) {
      toast({
        title: "Ugyldig PIN",
        description: `PIN må være ${mergedOptions.pinDigits} siffer og ikke inneholde repeterende tall eller enkle sekvenser.`,
        variant: "destructive"
      });
      return false;
    }
    
    try {
      // Generer ny salt
      const salt = await generateSalt();
      
      // Hash PIN med Argon2
      const hashedPin = await hashPin(pin, salt);
      
      // Lagre hash og salt
      setPinHash(hashedPin);
      setPinSalt(salt);
      
      // Lås opp appen
      setIsLocked(false);
      setAttempts(0);
      
      toast({
        title: "PIN opprettet",
        description: "Din sikre PIN-kode er nå satt opp og lagret sikkert.",
      });
      
      return true;
    } catch (error) {
      console.error("Feil ved oppretting av PIN:", error);
      toast({
        title: "Feil ved oppretting av PIN",
        description: "Kunne ikke opprette PIN-kode. Prøv igjen.",
        variant: "destructive"
      });
      return false;
    }
  }, [isPinComplex, toast, setPinHash, setPinSalt]);
  
  // Verifiser PIN
  const checkPin = useCallback(async (pin: string): Promise<boolean> => {
    if (!pin || !pinHash || !pinSalt) {
      return false;
    }
    
    if (lockoutTimer > 0) {
      toast({
        title: "Konto låst",
        description: `Prøv igjen om ${Math.ceil(lockoutTimer / 60)} minutter`,
        variant: "destructive"
      });
      return false;
    }
    
    try {
      // Verifiser PIN med Argon2
      const isValid = await verifyPin(pin, pinHash);
      
      if (!isValid) {
        const newAttempts = attempts + 1;
        setAttempts(newAttempts);
        
        if (newAttempts >= mergedOptions.maxAttempts) {
          setLockoutTimer(mergedOptions.lockoutTime);
          toast({
            title: "For mange forsøk",
            description: `Appen er låst i ${mergedOptions.lockoutTime / 60} minutter av sikkerhetshensyn.`,
            variant: "destructive"
          });
          return false;
        }
        
        toast({
          title: "Feil PIN",
          description: `Feil PIN-kode. ${mergedOptions.maxAttempts - newAttempts} forsøk gjenstår.`,
          variant: "destructive"
        });
        return false;
      }
      
      // Riktig PIN
      setAttempts(0);
      setIsLocked(false);
      return true;
    } catch (error) {
      console.error("Feil ved verifisering av PIN:", error);
      toast({
        title: "Feil ved verifisering",
        description: "Det oppstod en feil ved verifisering av PIN-koden.",
        variant: "destructive"
      });
      return false;
    }
  }, [pinHash, pinSalt, lockoutTimer, attempts, mergedOptions.maxAttempts, mergedOptions.lockoutTime, toast]);
  
  // Slett PIN
  const deletePin = useCallback(() => {
    setPinHash(null);
    setPinSalt(null);
    setIsLocked(false);
    setAttempts(0);
    setLockoutTimer(0);
  }, [setPinHash, setPinSalt]);
  
  // Lås appen
  const lockApp = useCallback(() => {
    if (pinHash) {
      setIsLocked(true);
    }
  }, [pinHash]);
  
  // Generer en krypteringsnøkkel basert på PIN
  const generateEncryptionKey = useCallback(async (pin: string): Promise<CryptoKey | null> => {
    if (!pin || !pinSalt) {
      return null;
    }
    
    try {
      return await deriveKeyFromPin(pin, pinSalt);
    } catch (error) {
      console.error("Feil ved generering av krypteringsnøkkel:", error);
      return null;
    }
  }, [pinSalt]);
  
  return {
    isLocked,
    hasPin: !!pinHash,
    setupPin,
    checkPin,
    deletePin,
    lockApp,
    attempts,
    lockoutTimer,
    generateEncryptionKey
  };
}
