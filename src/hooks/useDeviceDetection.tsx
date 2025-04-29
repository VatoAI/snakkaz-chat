
import { useState, useEffect } from "react";

export type DeviceType = "mobile" | "tablet" | "desktop";

export function useDeviceDetection() {
  const [deviceType, setDeviceType] = useState<DeviceType>("desktop");
  const [isIOS, setIsIOS] = useState(false);
  const [isAndroid, setIsAndroid] = useState(false);
  const [isMac, setIsMac] = useState(false);
  const [isWindows, setIsWindows] = useState(false);
  const [isLinux, setIsLinux] = useState(false);

  useEffect(() => {
    const detectDevice = () => {
      const userAgent = navigator.userAgent.toLowerCase();
      
      // Set operating system flags
      setIsIOS(/iphone|ipad|ipod/.test(userAgent));
      setIsAndroid(/android/.test(userAgent));
      setIsMac(/macintosh|mac os x/.test(userAgent) && !(/iphone|ipad|ipod/.test(userAgent)));
      setIsWindows(/windows/.test(userAgent) && !(/phone/.test(userAgent)));
      setIsLinux(/linux/.test(userAgent) && !(/android/.test(userAgent)));
      
      // Check for tablet
      const isTablet = /(ipad|tablet|(android(?!.*mobile))|(windows(?!.*phone)(.*touch))|silk)/.test(userAgent);
      
      if (isTablet) {
        setDeviceType("tablet");
        return;
      }
      
      // Check for mobile
      const isMobile = /android|webos|iphone|ipod|blackberry|iemobile|opera mini/.test(userAgent);
      
      if (isMobile) {
        setDeviceType("mobile");
        return;
      }
      
      // Default to desktop
      setDeviceType("desktop");
    };
    
    detectDevice();
    
    // Update on resize for responsive layouts
    const handleResize = () => {
      // For responsive handling - might be useful for tablet/desktop hybrid devices
      if (window.innerWidth <= 768) {
        setDeviceType("mobile");
      } else if (window.innerWidth <= 1024) {
        setDeviceType("tablet");
      } else {
        setDeviceType("desktop");
      }
    };
    
    window.addEventListener("resize", handleResize);
    
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  
  const getRecommendedPlatform = () => {
    if (deviceType === "mobile") {
      return isIOS ? "iOS" : isAndroid ? "Android" : "Mobile";
    } 
    else if (deviceType === "tablet") {
      return isIOS ? "iPad" : isAndroid ? "Android Tablet" : "Tablet";
    }
    else {
      return isMac ? "macOS" : isWindows ? "Windows" : isLinux ? "Linux" : "Desktop";
    }
  };
  
  return {
    deviceType,
    isIOS,
    isAndroid,
    isMac,
    isWindows, 
    isLinux,
    isMobile: deviceType === "mobile",
    isTablet: deviceType === "tablet",
    isDesktop: deviceType === "desktop",
    getRecommendedPlatform
  };
}
