
import { useEffect } from "react";

export function useScreenOrientation(enabled: boolean) {
  useEffect(() => {
    if (enabled) {
      try {
        const lockOrientation = async () => {
          if (screen.orientation?.lock) {
            try {
              await screen.orientation.lock('portrait');
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
