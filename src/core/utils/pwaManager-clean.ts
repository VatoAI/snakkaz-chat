// PWA Installation and Mobile Features Manager
import { useState, useEffect } from 'react';

export class PWAManager {
  private deferredPrompt: any = null;
  private isInstalled = false;
  private swRegistration: ServiceWorkerRegistration | null = null;

  constructor() {
    this.init();
  }

  private async init() {
    // Register Service Worker
    if ('serviceWorker' in navigator) {
      try {
        this.swRegistration = await navigator.serviceWorker.register('/sw.js');
        console.log('✅ Service Worker registered successfully');
        
        // Listen for updates
        this.swRegistration.addEventListener('updatefound', () => {
          const newWorker = this.swRegistration?.installing;
          if (newWorker) {
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed') {
                if (navigator.serviceWorker.controller) {
                  this.showUpdateAvailable();
                }
              }
            });
          }
        });
      } catch (error) {
        console.error('❌ Service Worker registration failed:', error);
      }
    }

    // Listen for install prompt
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      this.deferredPrompt = e;
      this.showInstallButton();
    });

    // Check if already installed
    window.addEventListener('appinstalled', () => {
      this.isInstalled = true;
      this.hideInstallButton();
      this.showToast('🎉 SnakkaZ Beta installert! Åpne fra hjemskjermen.', 'success');
    });

    // Handle incoming push messages
    navigator.serviceWorker?.addEventListener('message', this.handleServiceWorkerMessage);
  }

  // Simple toast implementation
  private showToast(message: string, type: 'success' | 'error' | 'info' = 'info') {
    const colors = {
      success: 'bg-green-500',
      error: 'bg-red-500',
      info: 'bg-blue-500'
    };
    
    const toast = document.createElement('div');
    toast.className = `fixed top-4 right-4 ${colors[type]} text-white p-3 rounded-lg shadow-lg z-50 max-w-sm`;
    toast.textContent = message;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 4000);
  }

  // Install PWA
  async installPWA(): Promise<boolean> {
    if (!this.deferredPrompt) {
      this.showToast('Installasjonen er ikke tilgjengelig i denne nettleseren', 'error');
      return false;
    }

    try {
      this.deferredPrompt.prompt();
      const { outcome } = await this.deferredPrompt.userChoice;
      
      if (outcome === 'accepted') {
        this.showToast('📱 Installerer SnakkaZ Beta...', 'success');
        this.deferredPrompt = null;
        return true;
      } else {
        this.showToast('Du kan installere SnakkaZ senere fra nettlesermenyen', 'info');
        return false;
      }
    } catch (error) {
      console.error('Installation failed:', error);
      this.showToast('Installasjonen feilet. Prøv igjen.', 'error');
      return false;
    }
  }

  // Request notification permission
  async requestNotificationPermission(): Promise<boolean> {
    if (!('Notification' in window)) {
      this.showToast('Denne nettleseren støtter ikke push-notifikasjoner', 'error');
      return false;
    }

    if (Notification.permission === 'granted') {
      return true;
    }

    if (Notification.permission === 'denied') {
      this.showToast('Notifikasjoner er blokkert. Aktiver i nettleserinnstillinger.', 'error');
      return false;
    }

    try {
      const permission = await Notification.requestPermission();
      
      if (permission === 'granted') {
        this.showToast('🔔 Notifikasjoner aktivert!', 'success');
        await this.subscribeToNotifications();
        return true;
      } else {
        this.showToast('Du kan aktivere notifikasjoner senere i innstillinger', 'info');
        return false;
      }
    } catch (error) {
      console.error('Failed to request notification permission:', error);
      return false;
    }
  }

  // Subscribe to push notifications
  private async subscribeToNotifications() {
    if (!this.swRegistration) {
      console.error('Service Worker not registered');
      return;
    }

    try {
      // Use a dummy key for demo purposes
      const dummyKey = 'BMqS9KzJRPVLhUxOFTh5MnAzGr8VQJ6JvXb3zPn8F3kQ7CqT9nJ5P7p6Vw1zR3s5Q7L4';
      
      const subscription = await this.swRegistration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: this.urlBase64ToUint8Array(dummyKey)
      });

      console.log('✅ Push notification subscription successful');
    } catch (error) {
      console.error('Failed to subscribe to push notifications:', error);
    }
  }

  // Utility function for VAPID key conversion
  private urlBase64ToUint8Array(base64String: string): Uint8Array {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
      .replace(/-/g, '+')
      .replace(/_/g, '/');

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  }

  // Show install button/banner
  private showInstallButton() {
    // Remove existing banner if any
    const existingBanner = document.getElementById('pwa-install-banner');
    if (existingBanner) {
      existingBanner.remove();
    }

    const installBanner = document.createElement('div');
    installBanner.id = 'pwa-install-banner';
    installBanner.className = 'fixed bottom-4 left-4 right-4 bg-gradient-to-r from-yellow-400 to-yellow-600 text-black p-4 rounded-xl shadow-lg z-50 transform transition-transform duration-300';
    installBanner.innerHTML = `
      <div class="flex items-center justify-between">
        <div class="flex items-center space-x-3">
          <div class="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
            📱
          </div>
          <div>
            <p class="font-semibold">Installer SnakkaZ Beta</p>
            <p class="text-sm opacity-80">For best opplevelse på mobil</p>
          </div>
        </div>
        <div class="flex space-x-2">
          <button id="pwa-install-btn" class="bg-black text-white px-4 py-2 rounded-lg font-medium">
            Installer
          </button>
          <button id="pwa-dismiss-btn" class="text-black opacity-70 px-2">
            ✕
          </button>
        </div>
      </div>
    `;

    document.body.appendChild(installBanner);

    // Add event listeners
    document.getElementById('pwa-install-btn')?.addEventListener('click', () => {
      this.installPWA();
    });

    document.getElementById('pwa-dismiss-btn')?.addEventListener('click', () => {
      this.hideInstallButton();
    });

    // Auto-hide after 15 seconds
    setTimeout(() => {
      this.hideInstallButton();
    }, 15000);
  }

  private hideInstallButton() {
    const banner = document.getElementById('pwa-install-banner');
    if (banner) {
      banner.remove();
    }
  }

  // Show update available notification
  private showUpdateAvailable() {
    const updateToast = document.createElement('div');
    updateToast.className = 'fixed top-4 left-4 right-4 bg-blue-500 text-white p-4 rounded-xl shadow-lg z-50';
    updateToast.innerHTML = `
      <div class="flex items-center justify-between">
        <span>🔄 Ny versjon tilgjengelig!</span>
        <button id="update-btn" class="bg-white text-blue-500 px-3 py-1 rounded text-sm font-medium">
          Oppdater
        </button>
      </div>
    `;
    
    document.body.appendChild(updateToast);
    
    document.getElementById('update-btn')?.addEventListener('click', () => {
      window.location.reload();
    });
    
    // Auto-hide after 10 seconds
    setTimeout(() => {
      updateToast.remove();
    }, 10000);
  }

  // Handle messages from service worker
  private handleServiceWorkerMessage = (event: MessageEvent) => {
    if (event.data && event.data.type === 'NOTIFICATION_CLICKED') {
      // Handle notification click
      window.location.href = event.data.url;
    }
  };

  // Send test notification
  async sendTestNotification() {
    if (Notification.permission === 'granted') {
      new Notification('SnakkaZ Beta Test', {
        body: 'Push-notifikasjoner fungerer perfekt! 🎉',
        icon: '/icons/icon-192x192.png',
        badge: '/icons/icon-192x192.png',
      });
      this.showToast('Test-notifikasjon sendt!', 'success');
    } else {
      this.showToast('Aktiver notifikasjoner først', 'error');
    }
  }

  // Get install status
  getInstallStatus() {
    return {
      isInstalled: this.isInstalled,
      canInstall: !!this.deferredPrompt,
      notificationPermission: Notification.permission,
      isOnline: navigator.onLine
    };
  }

  // Force update service worker
  async updateServiceWorker() {
    if (this.swRegistration) {
      await this.swRegistration.update();
    }
  }
}

// Create singleton instance
export const pwaManager = new PWAManager();

// Mobile detection utility
export const isMobile = () => {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
         (window.innerWidth <= 768);
};

// Network status monitoring hook
export const useNetworkStatus = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      // Simple toast for online status
      const toast = document.createElement('div');
      toast.className = 'fixed top-4 right-4 bg-green-500 text-white p-3 rounded-lg shadow-lg z-50';
      toast.textContent = '🌐 Tilkoblet internett';
      document.body.appendChild(toast);
      setTimeout(() => toast.remove(), 3000);
    };

    const handleOffline = () => {
      setIsOnline(false);
      // Simple toast for offline status
      const toast = document.createElement('div');
      toast.className = 'fixed top-4 right-4 bg-red-500 text-white p-3 rounded-lg shadow-lg z-50';
      toast.textContent = '📡 Ingen internettforbindelse';
      document.body.appendChild(toast);
      setTimeout(() => toast.remove(), 3000);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return isOnline;
};
