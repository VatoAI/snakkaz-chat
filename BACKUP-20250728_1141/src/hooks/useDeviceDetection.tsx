import { useState, useEffect } from 'react';

type DeviceType = 'mobile' | 'tablet' | 'desktop';
type OrientationType = 'portrait' | 'landscape';
type BrowserType = 'chrome' | 'safari' | 'firefox' | 'edge' | 'opera' | 'samsung' | 'other';

export interface DeviceInfo {
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  isIOS: boolean;
  isAndroid: boolean;
  isWindows: boolean;
  isMacOS: boolean;
  isLinux: boolean;
  deviceType: DeviceType;
  orientation: OrientationType;
  screenWidth: number;
  screenHeight: number;
  pixelRatio: number;
  browserName: BrowserType;
  isTouchDevice: boolean;
  hasBiometricSupport: boolean;
  isLowPowerDevice: boolean;
  isFullScreen: boolean;
  hasInternetConnection: boolean;
}

export function useDeviceDetection(): DeviceInfo {
  const [deviceInfo, setDeviceInfo] = useState<DeviceInfo>({
    isMobile: false,
    isTablet: false,
    isDesktop: true,
    isIOS: false,
    isAndroid: false,
    isWindows: false,
    isMacOS: false,
    isLinux: false,
    deviceType: 'desktop',
    orientation: 'landscape',
    screenWidth: typeof window !== 'undefined' ? window.innerWidth : 1920,
    screenHeight: typeof window !== 'undefined' ? window.innerHeight : 1080,
    pixelRatio: typeof window !== 'undefined' ? window.devicePixelRatio : 1,
    browserName: 'other',
    isTouchDevice: false,
    hasBiometricSupport: false,
    isLowPowerDevice: false,
    isFullScreen: false,
    hasInternetConnection: true,
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Device detection functions
    const detectDeviceType = (): DeviceType => {
      const width = window.innerWidth;
      if (width < 768) return 'mobile';
      if (width < 1200) return 'tablet';
      return 'desktop';
    };

    const detectBrowser = (): BrowserType => {
      const userAgent = navigator.userAgent.toLowerCase();
      if (userAgent.includes('chrome') && !userAgent.includes('edg')) return 'chrome';
      if (userAgent.includes('safari') && !userAgent.includes('chrome')) return 'safari';
      if (userAgent.includes('firefox')) return 'firefox';
      if (userAgent.includes('edg')) return 'edge';
      if (userAgent.includes('opr') || userAgent.includes('opera')) return 'opera';
      if (userAgent.includes('samsungbrowser')) return 'samsung';
      return 'other';
    };

    const detectOrientation = (): OrientationType => {
      if (typeof window.orientation === 'undefined') {
        return window.innerHeight > window.innerWidth ? 'portrait' : 'landscape';
      }
      return (window.orientation === 0 || window.orientation === 180) ? 'portrait' : 'landscape';
    };

    // Detect low power device (estimated)
    const isLowPowerDevice = (): boolean => {
      if (navigator.hardwareConcurrency) {
        return navigator.hardwareConcurrency < 4;
      }
      // Estimate based on user agent and screen size
      const isOlderDevice = /android 4|android 5|iphone os 9|iphone os 10/i.test(navigator.userAgent);
      const isLowRes = window.screen.width * window.screen.height < 1000000;
      return isOlderDevice || isLowRes;
    };

    // Detect biometric support (very rough estimation - would need actual device API checks)
    const hasBiometricSupport = (): boolean => {
      // Check if device is likely to have biometrics
      const modernAppleDevice = /iphone|ipad/.test(navigator.userAgent.toLowerCase()) && 
                               !(/iphone os [5-9]|iphone os 10|iphone os 11/i.test(navigator.userAgent));
      const modernAndroid = /android [7-9]|android 1[0-9]/i.test(navigator.userAgent);
      return modernAppleDevice || modernAndroid;
    };

    // Function to update all device info
    const updateDeviceInfo = () => {
      const deviceType = detectDeviceType();
      const isOnline = navigator.onLine;

      setDeviceInfo({
        isMobile: deviceType === 'mobile',
        isTablet: deviceType === 'tablet',
        isDesktop: deviceType === 'desktop',
        isIOS: /iphone|ipad|ipod/i.test(navigator.userAgent),
        isAndroid: /android/i.test(navigator.userAgent),
        isWindows: /win/i.test(navigator.userAgent),
        isMacOS: /mac/i.test(navigator.userAgent) && !/iphone|ipad|ipod/i.test(navigator.userAgent),
        isLinux: /linux/i.test(navigator.userAgent) && !/android/i.test(navigator.userAgent),
        deviceType,
        orientation: detectOrientation(),
        screenWidth: window.innerWidth,
        screenHeight: window.innerHeight,
        pixelRatio: window.devicePixelRatio || 1,
        browserName: detectBrowser(),
        isTouchDevice: 'ontouchstart' in window || navigator.maxTouchPoints > 0,
        hasBiometricSupport: hasBiometricSupport(),
        isLowPowerDevice: isLowPowerDevice(),
        isFullScreen: !!(document.fullscreenElement || 
                        (document as any).webkitFullscreenElement || 
                        (document as any).mozFullScreenElement),
        hasInternetConnection: isOnline,
      });
    };

    // Initial detection
    updateDeviceInfo();

    // Event listeners for changes
    window.addEventListener('resize', updateDeviceInfo);
    window.addEventListener('orientationchange', updateDeviceInfo);
    window.addEventListener('online', updateDeviceInfo);
    window.addEventListener('offline', updateDeviceInfo);
    document.addEventListener('fullscreenchange', updateDeviceInfo);

    // Cleanup
    return () => {
      window.removeEventListener('resize', updateDeviceInfo);
      window.removeEventListener('orientationchange', updateDeviceInfo);
      window.removeEventListener('online', updateDeviceInfo);
      window.removeEventListener('offline', updateDeviceInfo);
      document.removeEventListener('fullscreenchange', updateDeviceInfo);
    };
  }, []);

  return deviceInfo;
}

export default useDeviceDetection;
