/**
 * useIsMobile Hook
 * 
 * A simple hook that detects if the current device is a mobile device
 * based on screen width and touch capabilities.
 */

import { useState, useEffect } from 'react';

export const useIsMobile = (): boolean => {
  const [isMobile, setIsMobile] = useState(false);
  
  useEffect(() => {
    const checkMobile = () => {
      // Check screen width (common mobile breakpoint is 768px)
      const isMobileWidth = window.innerWidth < 768;
      
      // Check touch capability as an additional signal
      const hasTouchCapability = 'ontouchstart' in window || 
        navigator.maxTouchPoints > 0 || 
        (navigator as any).msMaxTouchPoints > 0;
      
      // Consider it mobile if it has a small screen AND touch capability
      setIsMobile(isMobileWidth && hasTouchCapability);
    };
    
    // Check on mount
    checkMobile();
    
    // Check on resize
    window.addEventListener('resize', checkMobile);
    
    // Cleanup
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  
  return isMobile;
};

export default useIsMobile;
