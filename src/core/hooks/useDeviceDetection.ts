import { useState, useEffect } from "react";

export interface DeviceInfo {
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  screenWidth: number;
  screenHeight: number;
  userAgent: string;
  touchDevice: boolean;
}

export function useDeviceDetection(): DeviceInfo {
  const [deviceInfo, setDeviceInfo] = useState<DeviceInfo>({
    isMobile: false,
    isTablet: false,
    isDesktop: true,
    screenWidth: 0,
    screenHeight: 0,
    userAgent: "",
    touchDevice: false,
  });

  useEffect(() => {
    const detectDevice = () => {
      const userAgent = navigator.userAgent;
      const screenWidth = window.innerWidth;
      const screenHeight = window.innerHeight;

      // Touch detection
      const touchDevice =
        "ontouchstart" in window ||
        navigator.maxTouchPoints > 0 ||
        (navigator as any).msMaxTouchPoints > 0;

      // Mobile detection (more accurate)
      const isMobile =
        screenWidth <= 768 ||
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
          userAgent
        ) ||
        touchDevice;

      // Tablet detection
      const isTablet = screenWidth > 768 && screenWidth <= 1024 && touchDevice;

      // Desktop detection
      const isDesktop = !isMobile && !isTablet;

      setDeviceInfo({
        isMobile,
        isTablet,
        isDesktop,
        screenWidth,
        screenHeight,
        userAgent,
        touchDevice,
      });
    };

    // Initial detection
    detectDevice();

    // Listen for resize events
    window.addEventListener("resize", detectDevice);
    window.addEventListener("orientationchange", detectDevice);

    return () => {
      window.removeEventListener("resize", detectDevice);
      window.removeEventListener("orientationchange", detectDevice);
    };
  }, []);

  return deviceInfo;
}

// Mobile-first responsive hook
export function useResponsive() {
  const device = useDeviceDetection();

  return {
    ...device,
    breakpoint: device.isMobile
      ? "mobile"
      : device.isTablet
      ? "tablet"
      : "desktop",
    isSmallScreen: device.screenWidth < 640,
    isMediumScreen: device.screenWidth >= 640 && device.screenWidth < 1024,
    isLargeScreen: device.screenWidth >= 1024,
  };
}
