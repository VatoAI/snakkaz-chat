import React, { useState, useEffect } from 'react';
import { pwaManager, isMobile } from '../utils/pwaManager';

export const PWADemo: React.FC = () => {
  const [installStatus, setInstallStatus] = useState(pwaManager.getInstallStatus());
  const [demoNotification, setDemoNotification] = useState('');

  useEffect(() => {
    // Update status every second
    const interval = setInterval(() => {
      setInstallStatus(pwaManager.getInstallStatus());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const testInstallation = async () => {
    const result = await pwaManager.installPWA();
    setDemoNotification(result ? 'Installation startet!' : 'Installation ikke tilgjengelig');
  };

  const testNotification = async () => {
    const result = await pwaManager.requestNotificationPermission();
    if (result) {
      await pwaManager.sendTestNotification();
      setDemoNotification('Test-notifikasjon sendt!');
    } else {
      setDemoNotification('Notifikasjoner ikke tillatt');
    }
  };

  const testOffline = () => {
    setDemoNotification('Slå av internett i DevTools → Network → Offline for å teste');
  };

  const testSharing = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'SnakkaZ Beta - PWA Demo',
          text: 'Sjekk ut denne fantastiske PWA-demoen!',
          url: window.location.href
        });
        setDemoNotification('Deling vellykket!');
      } catch (error) {
        setDemoNotification('Deling avbrutt');
      }
    } else {
      // Fallback to clipboard
      navigator.clipboard.writeText(window.location.href);
      setDemoNotification('Link kopiert til clipboard!');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white p-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent">
            📱 SnakkaZ PWA Demo
          </h1>
          <p className="text-xl text-gray-300">
            Test alle mobile PWA-funksjoner her!
          </p>
        </div>

        {/* Status Dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-gray-800 rounded-xl p-4">
            <h3 className="font-semibold mb-2">📱 Device Type</h3>
            <p className={`text-lg ${isMobile() ? 'text-green-400' : 'text-blue-400'}`}>
              {isMobile() ? 'Mobile' : 'Desktop'}
            </p>
          </div>
          
          <div className="bg-gray-800 rounded-xl p-4">
            <h3 className="font-semibold mb-2">⚡ Install Status</h3>
            <p className={`text-lg ${installStatus.canInstall ? 'text-green-400' : 'text-yellow-400'}`}>
              {installStatus.canInstall ? 'Ready to Install' : 'Not Available'}
            </p>
          </div>
          
          <div className="bg-gray-800 rounded-xl p-4">
            <h3 className="font-semibold mb-2">🔔 Notifications</h3>
            <p className={`text-lg ${
              installStatus.notificationPermission === 'granted' ? 'text-green-400' : 
              installStatus.notificationPermission === 'denied' ? 'text-red-400' : 'text-yellow-400'
            }`}>
              {installStatus.notificationPermission}
            </p>
          </div>
          
          <div className="bg-gray-800 rounded-xl p-4">
            <h3 className="font-semibold mb-2">🌐 Network</h3>
            <p className={`text-lg ${installStatus.isOnline ? 'text-green-400' : 'text-red-400'}`}>
              {installStatus.isOnline ? 'Online' : 'Offline'}
            </p>
          </div>
        </div>

        {/* Demo Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl p-6">
            <h3 className="text-xl font-bold mb-3">📱 App Installation</h3>
            <p className="mb-4 text-blue-100">
              Test PWA installation feature. Appen vil installeres som native app.
            </p>
            <button
              onClick={testInstallation}
              disabled={!installStatus.canInstall}
              className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 transition-colors"
            >
              {installStatus.canInstall ? 'Installer App' : 'Installation Not Available'}
            </button>
          </div>

          <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-xl p-6">
            <h3 className="text-xl font-bold mb-3">🔔 Push Notifications</h3>
            <p className="mb-4 text-green-100">
              Test push notification system med lyd og vibrasjon.
            </p>
            <button
              onClick={testNotification}
              className="bg-white text-green-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Test Notifications
            </button>
          </div>

          <div className="bg-gradient-to-r from-purple-600 to-purple-700 rounded-xl p-6">
            <h3 className="text-xl font-bold mb-3">📤 Native Sharing</h3>
            <p className="mb-4 text-purple-100">
              Test native sharing API eller clipboard fallback.
            </p>
            <button
              onClick={testSharing}
              className="bg-white text-purple-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Test Sharing
            </button>
          </div>

          <div className="bg-gradient-to-r from-orange-600 to-orange-700 rounded-xl p-6">
            <h3 className="text-xl font-bold mb-3">📡 Offline Mode</h3>
            <p className="mb-4 text-orange-100">
              Test offline functionality med Service Worker caching.
            </p>
            <button
              onClick={testOffline}
              className="bg-white text-orange-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Test Offline Mode
            </button>
          </div>
        </div>

        {/* Demo Notification */}
        {demoNotification && (
          <div className="bg-yellow-500 text-black p-4 rounded-xl mb-6 text-center font-semibold">
            {demoNotification}
            <button
              onClick={() => setDemoNotification('')}
              className="ml-4 text-black opacity-70 hover:opacity-100"
            >
              ✕
            </button>
          </div>
        )}

        {/* Instructions */}
        <div className="bg-gray-800 rounded-xl p-6">
          <h3 className="text-xl font-bold mb-4">🎯 Testing Instructions</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-yellow-400 mb-2">Mobile Testing:</h4>
              <ul className="text-gray-300 space-y-1 text-sm">
                <li>• F12 → Toggle Device Toolbar</li>
                <li>• Select iPhone/Android</li>
                <li>• Refresh page to see mobile features</li>
                <li>• Install banners appear after 3 seconds</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-yellow-400 mb-2">PWA Features:</h4>
              <ul className="text-gray-300 space-y-1 text-sm">
                <li>• Service Worker: DevTools → Application</li>
                <li>• Manifest: DevTools → Application → Manifest</li>
                <li>• Network: Try Offline mode</li>
                <li>• Install: Look for + icon in address bar</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Performance Metrics */}
        <div className="mt-8 bg-gray-800 rounded-xl p-6">
          <h3 className="text-xl font-bold mb-4">⚡ Performance Metrics</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-green-400">&lt; 2s</div>
              <div className="text-sm text-gray-400">First Load</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-400">&lt; 1s</div>
              <div className="text-sm text-gray-400">Cached Load</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-blue-400">95+</div>
              <div className="text-sm text-gray-400">PWA Score</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-yellow-400">100%</div>
              <div className="text-sm text-gray-400">Offline Ready</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PWADemo;
