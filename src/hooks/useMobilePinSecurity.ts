
import { useState, useEffect, useCallback } from 'react';
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
  const [isLocked, setIsLocked] = useState(true);
  const [attempts, setAttempts] = useState(0);
  const [lockoutTimer, setLockoutTimer] = useState(0);
  const [lastActive, setLastActive] = useState<number>(Date.now());
  const { toast } = useToast();

  // Handle lockout timer
  useEffect(() => {
    let interval: NodeJS.Timeout | undefined;
    
    if (lockoutTimer > 0) {
      interval = setInterval(() => {
        setLockoutTimer(prev => prev - 1);
      }, 1000);
    } else if (lockoutTimer === 0 && attempts >= mergedOptions.maxAttempts) {
      setAttempts(0); // Reset attempts after lockout
    }
    
    return () => {
      if (interval) clearInterval(interval);
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
    if (!pinHash || mergedOptions.lockTimeout === 0) return;
    
    const handleUserActivity = () => {
      setLastActive(Date.now());
    };
    
    // User activity events
    window.addEventListener('touchstart', handleUserActivity);
    window.addEventListener('touchmove', handleUserActivity);
    window.addEventListener('mousemove', handleUserActivity);
    window.addEventListener('keypress', handleUserActivity);
    
    // Setup inactivity timer
    const inactivityTimer = setInterval(() => {
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
      clearInterval(inactivityTimer);
    };
  }, [pinHash, lastActive, isLocked, mergedOptions.lockTimeout]);

  // Create a new PIN (hashed)
  const setPin = useCallback((pin: string) => {
    if (pin.length !== 4) {
      toast({
        title: "Invalid PIN",
        description: "PIN must be exactly 4 digits",
        variant: "destructive"
      });
      return false;
    }
    
    // Simple hash (in real app, use a proper crypto library)
    const hash = btoa(pin);
    setPinHash(hash);
    setIsLocked(false);
    return true;
  }, [setPinHash, toast]);

  // Verify PIN
  const verifyPin = useCallback((pin: string): boolean => {
    if (lockoutTimer > 0) {
      toast({
        title: "Account Locked",
        description: `Try again in ${Math.ceil(lockoutTimer / 60)} minutes`,
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
          title: "Too Many Failed Attempts",
          description: `Try again in ${Math.ceil(mergedOptions.lockoutDuration / 60)} minutes`,
          variant: "destructive"
        });
      } else {
        toast({
          title: "Incorrect PIN",
          description: `${mergedOptions.maxAttempts - newAttempts} attempts remaining`,
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
    setPinHash(null);
    setIsLocked(false);
    setAttempts(0);
    setLockoutTimer(0);
  }, [setPinHash]);

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
