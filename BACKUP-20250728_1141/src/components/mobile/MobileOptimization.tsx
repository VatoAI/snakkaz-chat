import React, { useEffect, useState } from 'react';
import { pwaManager, isMobile, useNetworkStatus } from '../../utils/pwaManager';

interface MobileOptimizationProps {
  children: React.ReactNode;
}

export const MobileOptimization: React.FC<MobileOptimizationProps> = ({ children }) => {
  const [installPromptShown, setInstallPromptShown] = useState(false);
  const [notificationPermission, setNotificationPermission] = useState(Notification.permission);
  const isOnline = useNetworkStatus();
  
  // Simple toast function
  const showToast = (message: string, duration = 5000) => {
    const toast = document.createElement('div');
    toast.className = 'fixed bottom-20 left-4 right-4 bg-blue-500 text-white p-4 rounded-xl shadow-lg z-50';
    toast.innerHTML = `
      <div class="flex flex-col space-y-2">
        <p class="font-medium">${message}</p>
        <div class="flex space-x-2">
          <button class="bg-white text-blue-500 px-3 py-1 rounded text-sm" onclick="this.parentElement.parentElement.parentElement.remove()">
            OK
          </button>
        </div>
      </div>
    `;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), duration);
  };
  
  useEffect(() => {
    // Auto-show install prompt on mobile after 30 seconds
    if (isMobile() && !installPromptShown) {
      const timer = setTimeout(() => {
        showInstallPrompt();
        setInstallPromptShown(true);
      }, 30000);

      return () => clearTimeout(timer);
    }
  }, [installPromptShown]);

  useEffect(() => {
    // Request notification permission on first visit
    if (notificationPermission === 'default' && isMobile()) {
      const timer = setTimeout(() => {
        showNotificationPrompt();
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [notificationPermission]);

  const showInstallPrompt = () => {
    if (!installPromptShown) {
      const toast = document.createElement('div');
      toast.className = 'fixed bottom-20 left-4 right-4 bg-gradient-to-r from-yellow-400 to-yellow-600 text-black p-4 rounded-xl shadow-lg z-50';
      toast.innerHTML = `
        <div class="flex flex-col space-y-2">
          <div class="flex items-center space-x-2">
            <span class="text-2xl">📱</span>
            <div>
              <p class="font-semibold">Installer SnakkaZ Beta</p>
              <p class="text-sm opacity-80">Få app-opplevelse på hjemskjermen</p>
            </div>
          </div>
          <div class="flex space-x-2">
            <button id="install-now-btn" class="bg-black text-white px-4 py-2 rounded-lg font-medium text-sm">
              Installer nå
            </button>
            <button id="install-later-btn" class="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg text-sm">
              Senere
            </button>
          </div>
        </div>
      `;
      
      document.body.appendChild(toast);
      
      document.getElementById('install-now-btn')?.addEventListener('click', () => {
        pwaManager.installPWA();
        toast.remove();
      });
      
      document.getElementById('install-later-btn')?.addEventListener('click', () => {
        toast.remove();
      });
      
      setTimeout(() => toast.remove(), 15000);
    }
  };

  const showNotificationPrompt = () => {
    const toast = document.createElement('div');
    toast.className = 'fixed bottom-20 left-4 right-4 bg-gradient-to-r from-blue-400 to-blue-600 text-white p-4 rounded-xl shadow-lg z-50';
    toast.innerHTML = `
      <div class="flex flex-col space-y-2">
        <div class="flex items-center space-x-2">
          <span class="text-2xl">🔔</span>
          <div>
            <p class="font-semibold">Aktiver notifikasjoner</p>
            <p class="text-sm opacity-80">Få varsler om nye meldinger</p>
          </div>
        </div>
        <div class="flex space-x-2">
          <button id="enable-notifications-btn" class="bg-white text-blue-500 px-4 py-2 rounded-lg font-medium text-sm">
            Aktiver
          </button>
          <button id="notifications-later-btn" class="bg-blue-300 text-blue-700 px-4 py-2 rounded-lg text-sm">
            Ikke nå
          </button>
        </div>
      </div>
    `;
    
    document.body.appendChild(toast);
    
    document.getElementById('enable-notifications-btn')?.addEventListener('click', async () => {
      const granted = await pwaManager.requestNotificationPermission();
      if (granted) {
        setNotificationPermission('granted');
      }
      toast.remove();
    });
    
    document.getElementById('notifications-later-btn')?.addEventListener('click', () => {
      toast.remove();
    });
    
    setTimeout(() => toast.remove(), 12000);
  };

  return (
    <>
      {children}
      
      {/* Mobile-specific optimizations */}
      {isMobile() && (
        <>
          {/* Offline indicator */}
          {!isOnline && (
            <div className="fixed top-0 left-0 right-0 bg-red-500 text-white text-center py-2 text-sm z-50">
              📡 Ingen internettforbindelse - Noen funksjoner kan være begrenset
            </div>
          )}

          {/* Quick action buttons for mobile */}
          <div className="fixed bottom-20 right-4 flex flex-col space-y-2 z-40">
            {/* Install button */}
            {pwaManager.getInstallStatus().canInstall && (
              <button
                onClick={() => pwaManager.installPWA()}
                className="bg-yellow-500 text-black p-3 rounded-full shadow-lg hover:bg-yellow-600 transition-colors"
                title="Installer app"
              >
                <span className="text-xl">📱</span>
              </button>
            )}

            {/* Notification test button */}
            {notificationPermission === 'granted' && (
              <button
                onClick={() => pwaManager.sendTestNotification()}
                className="bg-blue-500 text-white p-3 rounded-full shadow-lg hover:bg-blue-600 transition-colors"
                title="Test notifikasjon"
              >
                <span className="text-xl">🔔</span>
              </button>
            )}
          </div>

          {/* Mobile navigation hint */}
          <div className="fixed bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-center py-1 text-xs">
            💡 Tips: Installer appen for best opplevelse
          </div>
        </>
      )}
    </>
  );
};

export default MobileOptimization;
