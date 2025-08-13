/**
 * SNAKKAZ PWA MANAGER - FASE 6 PWA EXCELLENCE
 * Production-grade PWA management utility
 * Install prompts, offline detection, service worker management, push notifications
 */

import { Workbox } from 'workbox-window';

export interface PWAInstallPrompt {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export interface PWAManagerConfig {
  swPath?: string;
  enableDevtools?: boolean;
  enablePushNotifications?: boolean;
  enableBackgroundSync?: boolean;
  vapidPublicKey?: string;
  analyticsEndpoint?: string;
}

export interface NotificationPermissionState {
  permission: NotificationPermission;
  subscribed: boolean;
  endpoint?: string;
}

export interface OfflineQueueItem {
  id: string;
  type: 'message' | 'analytics' | 'user-action';
  data: any;
  timestamp: number;
  retryCount: number;
}

class PWAManager {
  private wb: Workbox | null = null;
  private installPrompt: PWAInstallPrompt | null = null;
  private isOnline: boolean = navigator.onLine;
  private offlineQueue: OfflineQueueItem[] = [];
  private config: PWAManagerConfig;
  private pushSubscription: PushSubscription | null = null;
  private updateAvailable: boolean = false;

  constructor(config: PWAManagerConfig = {}) {
    this.config = {
      swPath: '/sw.js',
      enableDevtools: process.env.NODE_ENV === 'development',
      enablePushNotifications: true,
      enableBackgroundSync: true,
      ...config
    };

    this.initializePWA();
  }

  /**
   * Initialize PWA functionality
   */
  private async initializePWA(): Promise<void> {
    try {
      console.log('[PWA Manager] Initializing FASE 6 PWA Excellence...');

      // Initialize service worker
      await this.initializeServiceWorker();

      // Set up offline detection
      this.setupOfflineDetection();

      // Set up install prompt handling
      this.setupInstallPromptHandling();

      // Initialize push notifications
      if (this.config.enablePushNotifications) {
        await this.initializePushNotifications();
      }

      // Set up background sync
      if (this.config.enableBackgroundSync) {
        this.setupBackgroundSync();
      }

      // Load offline queue
      await this.loadOfflineQueue();

      console.log('[PWA Manager] FASE 6 PWA Excellence initialized successfully! 🚀');
    } catch (error) {
      console.error('[PWA Manager] Failed to initialize PWA:', error);
    }
  }

  /**
   * Initialize service worker with Workbox
   */
  private async initializeServiceWorker(): Promise<void> {
    if ('serviceWorker' in navigator) {
      this.wb = new Workbox(this.config.swPath!);

      // Service worker update events
      this.wb.addEventListener('waiting', () => {
        console.log('[PWA Manager] New service worker waiting to activate');
        this.updateAvailable = true;
        this.notifyUpdateAvailable();
      });

      this.wb.addEventListener('controlling', () => {
        console.log('[PWA Manager] New service worker controlling the page');
        window.location.reload();
      });

      this.wb.addEventListener('activated', () => {
        console.log('[PWA Manager] Service worker activated');
      });

      // Message handling
      this.wb.addEventListener('message', (event) => {
        this.handleServiceWorkerMessage(event.data);
      });

      // Register service worker
      const registration = await this.wb.register();
      console.log('[PWA Manager] Service worker registered:', registration);
    } else {
      console.warn('[PWA Manager] Service workers not supported');
    }
  }

  /**
   * Handle messages from service worker
   */
  private handleServiceWorkerMessage(data: any): void {
    switch (data.type) {
      case 'NOTIFICATION_CLICKED':
        this.handleNotificationClick(data);
        break;
      case 'SHOW_INSTALL_PROMPT':
        this.showInstallPrompt();
        break;
      case 'QUICK_REPLY_REQUESTED':
        this.handleQuickReplyRequest(data);
        break;
      default:
        console.log('[PWA Manager] Unknown message from SW:', data);
    }
  }

  /**
   * Set up offline detection
   */
  private setupOfflineDetection(): void {
    const updateOnlineStatus = () => {
      const wasOffline = !this.isOnline;
      this.isOnline = navigator.onLine;

      if (wasOffline && this.isOnline) {
        console.log('[PWA Manager] Connection restored, syncing offline data...');
        this.syncOfflineQueue();
        this.notifyConnectionRestored();
      } else if (!this.isOnline) {
        console.log('[PWA Manager] Connection lost, entering offline mode...');
        this.notifyOfflineMode();
      }
    };

    window.addEventListener('online', updateOnlineStatus);
    window.addEventListener('offline', updateOnlineStatus);
  }

  /**
   * Set up install prompt handling
   */
  private setupInstallPromptHandling(): void {
    window.addEventListener('beforeinstallprompt', (e) => {
      console.log('[PWA Manager] Install prompt available');
      e.preventDefault();
      this.installPrompt = e as any;
      this.notifyInstallAvailable();
    });

    window.addEventListener('appinstalled', () => {
      console.log('[PWA Manager] PWA installed successfully');
      this.installPrompt = null;
      this.trackInstallEvent();
    });
  }

  /**
   * Initialize push notifications
   */
  private async initializePushNotifications(): Promise<void> {
    if (!('PushManager' in window)) {
      console.warn('[PWA Manager] Push notifications not supported');
      return;
    }

    try {
      const permission = await Notification.requestPermission();
      console.log('[PWA Manager] Notification permission:', permission);

      if (permission === 'granted' && this.wb) {
        const registration = await this.wb.register();
        if (registration) {
          await this.subscribeToPushNotifications(registration);
        }
      }
    } catch (error) {
      console.error('[PWA Manager] Failed to initialize push notifications:', error);
    }
  }

  /**
   * Subscribe to push notifications
   */
  private async subscribeToPushNotifications(registration: ServiceWorkerRegistration): Promise<void> {
    try {
      if (!this.config.vapidPublicKey) {
        console.warn('[PWA Manager] VAPID public key not configured');
        return;
      }

      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: this.config.vapidPublicKey
      });

      this.pushSubscription = subscription;
      console.log('[PWA Manager] Push subscription created:', subscription);

      // Send subscription to server
      await this.sendSubscriptionToServer(subscription);
    } catch (error) {
      console.error('[PWA Manager] Failed to subscribe to push notifications:', error);
    }
  }

  /**
   * Send subscription to server
   */
  private async sendSubscriptionToServer(subscription: PushSubscription): Promise<void> {
    try {
      const response = await fetch('/api/push/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          subscription: subscription.toJSON(),
          userAgent: navigator.userAgent,
          timestamp: Date.now()
        })
      });

      if (!response.ok) {
        throw new Error(`Failed to send subscription: ${response.status}`);
      }

      console.log('[PWA Manager] Subscription sent to server successfully');
    } catch (error) {
      console.error('[PWA Manager] Failed to send subscription to server:', error);
    }
  }

  /**
   * Set up background sync
   */
  private setupBackgroundSync(): void {
    if ('serviceWorker' in navigator && 'sync' in window.ServiceWorkerRegistration.prototype) {
      console.log('[PWA Manager] Background sync available');
    } else {
      console.warn('[PWA Manager] Background sync not supported');
    }
  }

  /**
   * Public API Methods
   */

  /**
   * Check if PWA is installed
   */
  public isPWAInstalled(): boolean {
    return window.matchMedia('(display-mode: standalone)').matches ||
           (window.navigator as any).standalone === true;
  }

  /**
   * Show install prompt
   */
  public async showInstallPrompt(): Promise<boolean> {
    if (!this.installPrompt) {
      console.warn('[PWA Manager] Install prompt not available');
      return false;
    }

    try {
      await this.installPrompt.prompt();
      const choiceResult = await this.installPrompt.userChoice;
      
      console.log('[PWA Manager] Install prompt result:', choiceResult.outcome);
      
      if (choiceResult.outcome === 'accepted') {
        this.trackInstallEvent('prompt_accepted');
        return true;
      } else {
        this.trackInstallEvent('prompt_dismissed');
        return false;
      }
    } catch (error) {
      console.error('[PWA Manager] Install prompt failed:', error);
      return false;
    }
  }

  /**
   * Check if install prompt is available
   */
  public isInstallPromptAvailable(): boolean {
    return this.installPrompt !== null;
  }

  /**
   * Get notification permission state
   */
  public getNotificationPermissionState(): NotificationPermissionState {
    return {
      permission: Notification.permission,
      subscribed: this.pushSubscription !== null,
      endpoint: this.pushSubscription?.endpoint
    };
  }

  /**
   * Request notification permission
   */
  public async requestNotificationPermission(): Promise<NotificationPermission> {
    if (!('Notification' in window)) {
      console.warn('[PWA Manager] Notifications not supported');
      return 'denied';
    }

    const permission = await Notification.requestPermission();
    
    if (permission === 'granted' && this.wb) {
      const registration = await this.wb.register();
      if (registration) {
        await this.subscribeToPushNotifications(registration);
      }
    }

    return permission;
  }

  /**
   * Add item to offline queue
   */
  public addToOfflineQueue(type: OfflineQueueItem['type'], data: any): void {
    const item: OfflineQueueItem = {
      id: this.generateId(),
      type,
      data,
      timestamp: Date.now(),
      retryCount: 0
    };

    this.offlineQueue.push(item);
    this.saveOfflineQueue();

    console.log('[PWA Manager] Added to offline queue:', item);

    // Try to sync if online
    if (this.isOnline) {
      this.syncOfflineQueue();
    }
  }

  /**
   * Force update service worker
   */
  public async forceUpdate(): Promise<void> {
    if (this.wb && this.updateAvailable) {
      console.log('[PWA Manager] Forcing service worker update...');
      this.wb.messageSkipWaiting();
    }
  }

  /**
   * Get PWA status
   */
  public getPWAStatus(): {
    isInstalled: boolean;
    isOnline: boolean;
    updateAvailable: boolean;
    notificationsEnabled: boolean;
    serviceWorkerActive: boolean;
  } {
    return {
      isInstalled: this.isPWAInstalled(),
      isOnline: this.isOnline,
      updateAvailable: this.updateAvailable,
      notificationsEnabled: Notification.permission === 'granted',
      serviceWorkerActive: this.wb !== null
    };
  }

  /**
   * Private helper methods
   */

  private async loadOfflineQueue(): Promise<void> {
    try {
      const stored = localStorage.getItem('pwa_offline_queue');
      if (stored) {
        this.offlineQueue = JSON.parse(stored);
        console.log('[PWA Manager] Loaded offline queue:', this.offlineQueue.length, 'items');
      }
    } catch (error) {
      console.error('[PWA Manager] Failed to load offline queue:', error);
    }
  }

  private saveOfflineQueue(): void {
    try {
      localStorage.setItem('pwa_offline_queue', JSON.stringify(this.offlineQueue));
    } catch (error) {
      console.error('[PWA Manager] Failed to save offline queue:', error);
    }
  }

  private async syncOfflineQueue(): Promise<void> {
    if (!this.isOnline || this.offlineQueue.length === 0) {
      return;
    }

    console.log('[PWA Manager] Syncing offline queue:', this.offlineQueue.length, 'items');

    const itemsToRetry: OfflineQueueItem[] = [];

    for (const item of this.offlineQueue) {
      try {
        await this.processOfflineItem(item);
        console.log('[PWA Manager] Successfully synced offline item:', item.id);
      } catch (error) {
        console.error('[PWA Manager] Failed to sync offline item:', item.id, error);
        
        item.retryCount++;
        if (item.retryCount < 3) {
          itemsToRetry.push(item);
        }
      }
    }

    this.offlineQueue = itemsToRetry;
    this.saveOfflineQueue();

    // Trigger background sync for remaining items
    if (this.offlineQueue.length > 0 && 'serviceWorker' in navigator) {
      try {
        const registration = await navigator.serviceWorker.ready;
        // Check if background sync is supported
        if ('sync' in registration) {
          await (registration as any).sync.register('snakkaz-background-sync-v2');
        }
      } catch (error) {
        console.error('[PWA Manager] Failed to register background sync:', error);
      }
    }
  }

  private async processOfflineItem(item: OfflineQueueItem): Promise<void> {
    switch (item.type) {
      case 'message':
        await this.syncMessage(item.data);
        break;
      case 'analytics':
        await this.syncAnalytics(item.data);
        break;
      case 'user-action':
        await this.syncUserAction(item.data);
        break;
      default:
        console.warn('[PWA Manager] Unknown offline item type:', item.type);
    }
  }

  private async syncMessage(messageData: any): Promise<void> {
    const response = await fetch('/api/chat/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${messageData.token}`
      },
      body: JSON.stringify(messageData)
    });

    if (!response.ok) {
      throw new Error(`Failed to sync message: ${response.status}`);
    }
  }

  private async syncAnalytics(analyticsData: any): Promise<void> {
    if (!this.config.analyticsEndpoint) {
      return;
    }

    const response = await fetch(this.config.analyticsEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(analyticsData)
    });

    if (!response.ok) {
      throw new Error(`Failed to sync analytics: ${response.status}`);
    }
  }

  private async syncUserAction(actionData: any): Promise<void> {
    const response = await fetch('/api/user-actions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(actionData)
    });

    if (!response.ok) {
      throw new Error(`Failed to sync user action: ${response.status}`);
    }
  }

  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  private trackInstallEvent(outcome?: string): void {
    console.log('[PWA Manager] Tracking install event:', outcome);
    
    // Track install analytics
    this.addToOfflineQueue('analytics', {
      event: 'pwa_install',
      outcome,
      timestamp: Date.now(),
      userAgent: navigator.userAgent
    });
  }

  /**
   * Notification handlers
   */

  private notifyUpdateAvailable(): void {
    console.log('[PWA Manager] Notifying update available');
    
    // Dispatch custom event
    window.dispatchEvent(new CustomEvent('pwa-update-available', {
      detail: { manager: this }
    }));
  }

  private notifyInstallAvailable(): void {
    console.log('[PWA Manager] Notifying install available');
    
    // Dispatch custom event
    window.dispatchEvent(new CustomEvent('pwa-install-available', {
      detail: { manager: this }
    }));
  }

  private notifyConnectionRestored(): void {
    console.log('[PWA Manager] Notifying connection restored');
    
    // Dispatch custom event
    window.dispatchEvent(new CustomEvent('pwa-online', {
      detail: { manager: this }
    }));
  }

  private notifyOfflineMode(): void {
    console.log('[PWA Manager] Notifying offline mode');
    
    // Dispatch custom event
    window.dispatchEvent(new CustomEvent('pwa-offline', {
      detail: { manager: this }
    }));
  }

  private handleNotificationClick(data: any): void {
    console.log('[PWA Manager] Handling notification click:', data);
    
    // Dispatch custom event
    window.dispatchEvent(new CustomEvent('pwa-notification-click', {
      detail: data
    }));
  }

  private handleQuickReplyRequest(data: any): void {
    console.log('[PWA Manager] Handling quick reply request:', data);
    
    // Dispatch custom event
    window.dispatchEvent(new CustomEvent('pwa-quick-reply', {
      detail: data
    }));
  }
}

// Export singleton instance
export const pwaManager = new PWAManager();

// Export class for custom configurations
export { PWAManager };

console.log('[PWA Manager] FASE 6 PWA Excellence module loaded! 🚀');
