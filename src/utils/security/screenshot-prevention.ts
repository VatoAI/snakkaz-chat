
import { useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

type ScreenshotPreventionOptions = {
  onScreenshotAttempt?: () => void;
  showToast?: boolean;
  toastTitle?: string;
  toastMessage?: string;
};

export const useScreenshotPrevention = (options: ScreenshotPreventionOptions = {}) => {
  const { toast } = useToast();
  const {
    onScreenshotAttempt,
    showToast = true,
    toastTitle = "Skjermdump deaktivert",
    toastMessage = "Av sikkerhetsgrunner er skjermdump deaktivert"
  } = options;

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Detect common screenshot shortcuts
      const isPrintScreen = e.key === 'PrintScreen';
      const isCtrlShiftS = e.ctrlKey && e.shiftKey && e.key === 's';
      const isCmdShiftS = e.metaKey && e.shiftKey && e.key === 's';
      const isCmdShift3 = e.metaKey && e.shiftKey && e.key === '3';
      const isCmdShift4 = e.metaKey && e.shiftKey && e.key === '4';
      
      if (isPrintScreen || isCtrlShiftS || isCmdShiftS || isCmdShift3 || isCmdShift4) {
        e.preventDefault();
        
        if (showToast) {
          toast({
            title: toastTitle,
            description: toastMessage,
            variant: "destructive",
          });
        }
        
        if (onScreenshotAttempt) {
          onScreenshotAttempt();
        }
        
        return false;
      }
    };
    
    // Listen for visibilitychange to detect tab switching (potential screenshot)
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        if (onScreenshotAttempt) {
          onScreenshotAttempt();
        }
      }
    };
    
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [toast, onScreenshotAttempt, showToast, toastTitle, toastMessage]);
};

// Also export a utility to apply anti-copy protections to elements
export const applyAntiCopyProtection = (element: HTMLElement | null) => {
  if (!element) return;
  
  element.style.userSelect = 'none';
  element.setAttribute('draggable', 'false');
  element.addEventListener('contextmenu', (e) => e.preventDefault());
  element.addEventListener('copy', (e) => e.preventDefault());
  element.addEventListener('cut', (e) => e.preventDefault());
};
