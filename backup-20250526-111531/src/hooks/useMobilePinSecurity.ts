import { useState, useEffect, useCallback, useRef } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useLocalStorage } from '@/hooks/useLocalStorage';

interface PinSecurityOptions {
  lockOnBackground: boolean;
  lockOnOrientationChange: boolean;
  lockTimeout: number; // in milliseconds, 0 means never auto-lock
  maxAttempts: number;
  lockoutDuration: number; // in seconds
}

const DEFAULT_OPTIONS: PinSecurityOptions = {
  lockOnBackground: true,
  lockOnOrientationChange: true,
  lockTimeout: 60000, // 1 minute
  maxAttempts: 5,
  lockoutDuration: 300 // 5 minutes
};

export function useMobilePinSecurity(options: Partial<PinSecurityOptions> = {}) {
  const mergedOptions = { ...DEFAULT_OPTIONS, ...options };
  
  const [pinHash, setPinHash] = useLocalStorage<string | null>('pinHash', null);
  const [isLocked, setIsLocked] = useState<boolean>(!!pinHash);
  const [attempts, setAttempts] = useState(0);
  const [lockoutTimer, setLockoutTimer] = useState(0);
  const [lastActive, setLastActive] = useState<number>(Date.now());
  const { toast } = useToast();
  const inactivityTimerRef = useRef<NodeJS.Timeout | null>(null);
  const lockoutTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Ensure initial state is correct based on PIN existence
  useEffect(() => {
    // If PIN exists, we start locked; if no PIN, we start unlocked
    setIsLocked(!!pinHash);
  }, []);

  // Handle lockout timer
  useEffect(() => {
    if (lockoutTimerRef.current) {
      clearInterval(lockoutTimerRef.current);
      lockoutTimerRef.current = null;
    }
    
    if (lockoutTimer > 0) {
      lockoutTimerRef.current = setInterval(() => {
        setLockoutTimer(prev => {
          if (prev <= 1) {
            if (lockoutTimerRef.current) {
              clearInterval(lockoutTimerRef.current);
              lockoutTimerRef.current = null;
            }
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else if (lockoutTimer === 0 && attempts >= mergedOptions.maxAttempts) {
      setAttempts(0); // Reset attempts after lockout
    }
    
    return () => {
      if (lockoutTimerRef.current) {
        clearInterval(lockoutTimerRef.current);
        lockoutTimerRef.current = null;
      }
    };
  }, [lockoutTimer, attempts, mergedOptions.maxAttempts]);

  // Auto-lock when app goes to background
  useEffect(() => {
    if (!pinHash) return; // No PIN set, no need to lock
    
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        // App returned to foreground
        const now = Date.now();
        if (mergedOptions.lockOnBackground || (now - lastActive > mergedOptions.lockTimeout && mergedOptions.lockTimeout > 0)) {
          setIsLocked(true);
        }
        setLastActive(now);
      } else {
        // App went to background
        setLastActive(Date.now());
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [pinHash, lastActive, mergedOptions.lockOnBackground, mergedOptions.lockTimeout]);

  // Handle orientation changes
  useEffect(() => {
    if (!pinHash || !mergedOptions.lockOnOrientationChange) return;
    
    const handleOrientationChange = () => {
      if (pinHash) setIsLocked(true);
    };
    
    window.addEventListener('orientationchange', handleOrientationChange);
    return () => window.removeEventListener('orientationchange', handleOrientationChange);
  }, [pinHash, mergedOptions.lockOnOrientationChange]);

  // Auto-lock after inactivity
  useEffect(() => {
    if (!pinHash || mergedOptions.lockTimeout === 0) {
      // Clean up any existing timer if PIN is removed
      if (inactivityTimerRef.current) {
        clearInterval(inactivityTimerRef.current);
        inactivityTimerRef.current = null;
      }
      return;
    }
    
    const handleUserActivity = () => {
      setLastActive(Date.now());
    };
    
    // User activity events
    window.addEventListener('touchstart', handleUserActivity);
    window.addEventListener('touchmove', handleUserActivity);
    window.addEventListener('mousemove', handleUserActivity);
    window.addEventListener('keypress', handleUserActivity);
    
    // Setup inactivity timer
    if (inactivityTimerRef.current) {
      clearInterval(inactivityTimerRef.current);
    }
    
    inactivityTimerRef.current = setInterval(() => {
      const now = Date.now();
      if (now - lastActive > mergedOptions.lockTimeout && !isLocked) {
        setIsLocked(true);
      }
    }, 10000); // Check every 10 seconds
    
    return () => {
      window.removeEventListener('touchstart', handleUserActivity);
      window.removeEventListener('touchmove', handleUserActivity);
      window.removeEventListener('mousemove', handleUserActivity);
      window.removeEventListener('keypress', handleUserActivity);
      
      if (inactivityTimerRef.current) {
        clearInterval(inactivityTimerRef.current);
        inactivityTimerRef.current = null;
      }
    };
  }, [pinHash, lastActive, isLocked, mergedOptions.lockTimeout]);

  // Create a new PIN (hashed)
  const setPin = useCallback((pin: string): boolean => {
    if (!pin || pin.length !== 4 || !/^\d{4}$/.test(pin)) {
      toast({
        title: "Ugyldig PIN",
        description: "PIN-koden må være nøyaktig 4 siffer",
        variant: "destructive"
      });
      return false;
    }
    
    try {
      // Simple hash (in real app, use a proper crypto library)
      const hash = btoa(pin);
      setPinHash(hash);
      setIsLocked(false);
      
      // Sync with localStorage directly as well to ensure it's saved
      localStorage.setItem('pinHash', hash);
      
      toast({
        title: "PIN aktivert",
        description: "Din sikre PIN-kode er nå satt opp",
      });
      
      return true;
    } catch (error) {
      console.error("Error setting PIN:", error);
      toast({
        title: "Feil ved oppretting av PIN",
        description: "Kunne ikke opprette PIN-kode. Prøv igjen.",
        variant: "destructive"
      });
      return false;
    }
  }, [setPinHash, toast]);

  // Verify PIN
  const verifyPin = useCallback((pin: string): boolean => {
    if (!pin || !pinHash) {
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
    
    // Simple hash compare (in real app, use a proper crypto library)
    const hash = btoa(pin);
    const isValid = hash === pinHash;
    
    if (!isValid) {
      const newAttempts = attempts + 1;
      setAttempts(newAttempts);
      
      if (newAttempts >= mergedOptions.maxAttempts) {
        setLockoutTimer(mergedOptions.lockoutDuration);
        toast({
          title: "For mange mislykkede forsøk",
          description: `Prøv igjen om ${Math.ceil(mergedOptions.lockoutDuration / 60)} minutter`,
          variant: "destructive"
        });
      } else {
        toast({
          title: "Feil PIN",
          description: `${mergedOptions.maxAttempts - newAttempts} forsøk gjenstår`,
          variant: "destructive"
        });
      }
    } else {
      setIsLocked(false);
      setAttempts(0);
    }
    
    return isValid;
  }, [pinHash, attempts, lockoutTimer, mergedOptions.maxAttempts, mergedOptions.lockoutDuration, toast]);

  // Reset PIN
  const resetPin = useCallback(() => {
    try {
      setPinHash(null);
      setIsLocked(false);
      setAttempts(0);
      setLockoutTimer(0);
      
      // Ensure we also remove from localStorage directly
      localStorage.removeItem('pinHash');
      
      // Also clean up any related data
      localStorage.removeItem('chatCode'); 
      
      // Clean up any existing timers
      if (inactivityTimerRef.current) {
        clearInterval(inactivityTimerRef.current);
        inactivityTimerRef.current = null;
      }
      
      if (lockoutTimerRef.current) {
        clearInterval(lockoutTimerRef.current);
        lockoutTimerRef.current = null;
      }
      
      return true;
    } catch (error) {
      console.error("Error resetting PIN:", error);
      toast({
        title: "Feil ved fjerning av PIN",
        description: "Kunne ikke fjerne PIN-kode. Prøv igjen.",
        variant: "destructive"
      });
      return false;
    }
  }, [setPinHash, toast]);

  // Force lock
  const lock = useCallback(() => {
    if (pinHash) {
      setIsLocked(true);
    }
  }, [pinHash]);

  return {
    hasPin: !!pinHash,
    isLocked,
    lockoutTimer,
    attemptsRemaining: mergedOptions.maxAttempts - attempts,
    isLockedOut: lockoutTimer > 0,
    setPin,
    verifyPin,
    resetPin,
    lock
  };
}
