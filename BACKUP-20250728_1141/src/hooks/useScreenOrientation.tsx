
import { useEffect } from "react";

export function useScreenOrientation(enabled: boolean) {
  useEffect(() => {
    if (enabled) {
      try {
        const lockOrientation = async () => {
          // Check if the API exists and has the lock method
          if (screen.orientation && 'lock' in screen.orientation) {
            try {
              // Use type assertion to handle the TypeScript error
              await (screen.orientation as any).lock('portrait');
            } catch (error) {
              console.error('Could not lock screen orientation:', error);
            }
          }
        };
        
        lockOrientation();
      } catch (error) {
        console.error('Screen orientation API not supported:', error);
      }
    }
  }, [enabled]);
}
