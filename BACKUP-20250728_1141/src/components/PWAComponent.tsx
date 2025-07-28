/**
 * SNAKKAZ PWA COMPONENT - FASE 6 PWA EXCELLENCE
 * React component that integrates PWA functionality into the app
 * Handles install prompts, offline notifications, update management
 */

import React, { useEffect, useState } from 'react';
import { pwaManager } from '../utils/pwa-manager';

interface PWAStatus {
  isInstalled: boolean;
  isOnline: boolean;
  updateAvailable: boolean;
  notificationsEnabled: boolean;
  serviceWorkerActive: boolean;
}

interface PWAComponentProps {
  showInstallPrompt?: boolean;
  showOfflineIndicator?: boolean;
  showUpdateNotification?: boolean;
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
}

const PWAComponent: React.FC<PWAComponentProps> = ({
  showInstallPrompt = true,
  showOfflineIndicator = true,
  showUpdateNotification = true,
  position = 'top-right'
}) => {
  const [pwaStatus, setPwaStatus] = useState<PWAStatus>({
    isInstalled: false,
    isOnline: true,
    updateAvailable: false,
    notificationsEnabled: false,
    serviceWorkerActive: false
  });

  const [showInstallBanner, setShowInstallBanner] = useState(false);
  const [showUpdateBanner, setShowUpdateBanner] = useState(false);
  const [showOfflineBanner, setShowOfflineBanner] = useState(false);

  useEffect(() => {
    // Initialize PWA status
    const updatePWAStatus = () => {
      const status = pwaManager.getPWAStatus();
      setPwaStatus(status);
    };

    updatePWAStatus();

    // Set up event listeners for PWA events
    const handleInstallAvailable = () => {
      console.log('[PWA Component] Install prompt available');
      if (showInstallPrompt && !pwaStatus.isInstalled) {
        setShowInstallBanner(true);
      }
    };

    const handleUpdateAvailable = () => {
      console.log('[PWA Component] Update available');
      if (showUpdateNotification) {
        setShowUpdateBanner(true);
      }
    };

    const handleOffline = () => {
      console.log('[PWA Component] App went offline');
      if (showOfflineIndicator) {
        setShowOfflineBanner(true);
      }
      updatePWAStatus();
    };

    const handleOnline = () => {
      console.log('[PWA Component] App came online');
      setShowOfflineBanner(false);
      updatePWAStatus();
    };

    // Add event listeners
    window.addEventListener('pwa-install-available', handleInstallAvailable);
    window.addEventListener('pwa-update-available', handleUpdateAvailable);
    window.addEventListener('pwa-offline', handleOffline);
    window.addEventListener('pwa-online', handleOnline);

    // Cleanup
    return () => {
      window.removeEventListener('pwa-install-available', handleInstallAvailable);
      window.removeEventListener('pwa-update-available', handleUpdateAvailable);
      window.removeEventListener('pwa-offline', handleOffline);
      window.removeEventListener('pwa-online', handleOnline);
    };
  }, [showInstallPrompt, showUpdateNotification, showOfflineIndicator, pwaStatus.isInstalled]);

  const handleInstallApp = async () => {
    const success = await pwaManager.showInstallPrompt();
    if (success) {
      setShowInstallBanner(false);
    }
  };

  const handleUpdateApp = async () => {
    await pwaManager.forceUpdate();
    setShowUpdateBanner(false);
  };

  const handleEnableNotifications = async () => {
    await pwaManager.requestNotificationPermission();
    const status = pwaManager.getPWAStatus();
    setPwaStatus(status);
  };

  const getPositionClasses = () => {
    const baseClasses = 'fixed z-50';
    switch (position) {
      case 'top-left':
        return `${baseClasses} top-4 left-4`;
      case 'bottom-left':
        return `${baseClasses} bottom-4 left-4`;
      case 'bottom-right':
        return `${baseClasses} bottom-4 right-4`;
      default:
        return `${baseClasses} top-4 right-4`;
    }
  };

  return (
    <div className={getPositionClasses()}>
      {/* Install Banner */}
      {showInstallBanner && !pwaStatus.isInstalled && (
        <div className="mb-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl p-4 shadow-lg max-w-sm border border-white/20 backdrop-blur-sm">
          <div className="flex items-start space-x-3">
            <div className="text-2xl">📱</div>
            <div className="flex-1">
              <h3 className="font-semibold text-sm mb-1">Installer SnakkaZ</h3>
              <p className="text-xs opacity-90 mb-3">
                Få bedre ytelse og offline-tilgang ved å installere appen
              </p>
              <div className="flex space-x-2">
                <button
                  onClick={handleInstallApp}
                  className="px-3 py-1.5 bg-white/20 rounded-lg text-xs font-medium hover:bg-white/30 transition-colors"
                >
                  Installer
                </button>
                <button
                  onClick={() => setShowInstallBanner(false)}
                  className="px-3 py-1.5 bg-white/10 rounded-lg text-xs font-medium hover:bg-white/20 transition-colors"
                >
                  Senere
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Update Banner */}
      {showUpdateBanner && (
        <div className="mb-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl p-4 shadow-lg max-w-sm border border-white/20 backdrop-blur-sm">
          <div className="flex items-start space-x-3">
            <div className="text-2xl">⬆️</div>
            <div className="flex-1">
              <h3 className="font-semibold text-sm mb-1">Oppdatering tilgjengelig</h3>
              <p className="text-xs opacity-90 mb-3">
                En ny versjon av SnakkaZ er klar for installasjon
              </p>
              <div className="flex space-x-2">
                <button
                  onClick={handleUpdateApp}
                  className="px-3 py-1.5 bg-white/20 rounded-lg text-xs font-medium hover:bg-white/30 transition-colors"
                >
                  Oppdater nå
                </button>
                <button
                  onClick={() => setShowUpdateBanner(false)}
                  className="px-3 py-1.5 bg-white/10 rounded-lg text-xs font-medium hover:bg-white/20 transition-colors"
                >
                  Senere
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Offline Banner */}
      {showOfflineBanner && (
        <div className="mb-4 bg-gradient-to-r from-orange-600 to-red-600 text-white rounded-xl p-4 shadow-lg max-w-sm border border-white/20 backdrop-blur-sm">
          <div className="flex items-start space-x-3">
            <div className="text-2xl animate-pulse">📡</div>
            <div className="flex-1">
              <h3 className="font-semibold text-sm mb-1">Offline-modus</h3>
              <p className="text-xs opacity-90 mb-3">
                Du er offline. Meldinger synkroniseres når forbindelsen er tilbake.
              </p>
              <button
                onClick={() => setShowOfflineBanner(false)}
                className="px-3 py-1.5 bg-white/20 rounded-lg text-xs font-medium hover:bg-white/30 transition-colors"
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}

      {/* PWA Status Indicator */}
      <div className="bg-black/20 backdrop-blur-sm rounded-full p-2 border border-white/10">
        <div className="flex items-center space-x-2">
          {/* Online/Offline indicator */}
          <div 
            className={`w-3 h-3 rounded-full ${
              pwaStatus.isOnline ? 'bg-green-400' : 'bg-red-400 animate-pulse'
            }`}
            title={pwaStatus.isOnline ? 'Online' : 'Offline'}
          />
          
          {/* Service Worker indicator */}
          {pwaStatus.serviceWorkerActive && (
            <div 
              className="w-3 h-3 rounded-full bg-blue-400"
              title="Service Worker Active"
            />
          )}

          {/* PWA installed indicator */}
          {pwaStatus.isInstalled && (
            <div 
              className="w-3 h-3 rounded-full bg-purple-400"
              title="PWA Installed"
            />
          )}

          {/* Notifications enabled indicator */}
          {pwaStatus.notificationsEnabled ? (
            <div 
              className="w-3 h-3 rounded-full bg-yellow-400"
              title="Notifications Enabled"
            />
          ) : (
            <button
              onClick={handleEnableNotifications}
              className="w-3 h-3 rounded-full bg-gray-400 hover:bg-yellow-400 transition-colors cursor-pointer"
              title="Enable Notifications"
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default PWAComponent;
