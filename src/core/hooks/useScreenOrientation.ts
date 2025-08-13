
import { useEffect, useState } from 'react';

export const useScreenOrientation = (enabled = true) => {
  const [orientation, setOrientation] = useState<OrientationType | null>(
    typeof screen !== 'undefined' && screen.orientation 
      ? screen.orientation.type 
      : null
  );

  useEffect(() => {
    if (!enabled) return;

    // Handle orientation change
    const handleOrientationChange = () => {
      if (typeof screen !== 'undefined' && screen.orientation) {
        setOrientation(screen.orientation.type);
      }
    };

    // Setup orientation change listener
    if (typeof screen !== 'undefined' && screen.orientation) {
      screen.orientation.addEventListener('change', handleOrientationChange);
    } else {
      window.addEventListener('orientationchange', () => {
        // Map window.orientation to OrientationType
        let newType: OrientationType | null = null;
        
        if (typeof window.orientation === 'number') {
          if (window.orientation === 0 || window.orientation === 180) {
            newType = 'portrait-primary';
          } else {
            newType = 'landscape-primary';
          }
        }
        
        setOrientation(newType);
      });
    }

    // Cleanup
    return () => {
      if (typeof screen !== 'undefined' && screen.orientation) {
        screen.orientation.removeEventListener('change', handleOrientationChange);
      } else {
        window.removeEventListener('orientationchange', handleOrientationChange);
      }
    };
  }, [enabled]);

  return orientation;
};
