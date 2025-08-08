/**
 * NotificationService
 * Handles push notifications, browser notifications, and real-time alerts for SnakkaZ
 */

interface NotificationConfig {
  title: string;
  body: string;
  icon?: string;
  badge?: string;
  tag?: string;
  data?: any;
  requireInteraction?: boolean;
  silent?: boolean;
  timestamp?: number;
}

interface PushSubscription {
  endpoint: string;
  keys: {
    p256dh: string;
    auth: string;
  };
}

export class NotificationService {
  private static instance: NotificationService;
  private isSupported: boolean = false;
  private permission: NotificationPermission = "default";
  private serviceWorkerRegistration: ServiceWorkerRegistration | null = null;
  private subscription: PushSubscription | null = null;

  private constructor() {
    this.initializeService();
  }

  public static getInstance(): NotificationService {
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService();
    }
    return NotificationService.instance;
  }

  private async initializeService(): Promise<void> {
    // Check if notifications are supported
    this.isSupported = "Notification" in window && "serviceWorker" in navigator;

    if (!this.isSupported) {
      console.warn("[NotificationService] Browser notifications not supported");
      return;
    }

    this.permission = Notification.permission;

    // Register service worker for push notifications
    if ("serviceWorker" in navigator) {
      try {
        this.serviceWorkerRegistration = await navigator.serviceWorker.register(
          "/sw.js",
          {
            scope: "/",
          }
        );
        console.log(
          "[NotificationService] Service worker registered successfully"
        );

        // Initialize push subscription
        await this.initializePushSubscription();
      } catch (error) {
        console.error(
          "[NotificationService] Service worker registration failed:",
          error
        );
      }
    }
  }

  public async requestPermission(): Promise<NotificationPermission> {
    if (!this.isSupported) {
      throw new Error("Notifications not supported in this browser");
    }

    if (this.permission === "default") {
      this.permission = await Notification.requestPermission();
    }

    return this.permission;
  }

  public async showNotification(config: NotificationConfig): Promise<void> {
    if (!this.isSupported) {
      console.warn(
        "[NotificationService] Cannot show notification - not supported"
      );
      return;
    }

    if (this.permission !== "granted") {
      const permission = await this.requestPermission();
      if (permission !== "granted") {
        throw new Error("Notification permission denied");
      }
    }

    const options: NotificationOptions = {
      body: config.body,
      icon: config.icon || "/icons/snakkaz-icon-192.png",
      badge: config.badge || "/icons/snakkaz-icon-192.png",
      tag: config.tag || "snakkaz-notification",
      data: config.data,
      requireInteraction: config.requireInteraction || false,
      silent: config.silent || false,
      timestamp: config.timestamp || Date.now(),
      actions: [
        {
          action: "view",
          title: "View",
        },
        {
          action: "dismiss",
          title: "Dismiss",
        },
      ],
    };

    if (this.serviceWorkerRegistration) {
      // Use service worker for persistent notifications
      await this.serviceWorkerRegistration.showNotification(
        config.title,
        options
      );
    } else {
      // Fallback to basic notification
      const notification = new Notification(config.title, options);

      notification.onclick = (event) => {
        event.preventDefault();
        window.focus();
        if (config.data?.url) {
          window.location.href = config.data.url;
        }
        notification.close();
      };

      // Auto-close after 5 seconds if not requiring interaction
      if (!config.requireInteraction) {
        setTimeout(() => {
          notification.close();
        }, 5000);
      }
    }
  }

  public async showChatMessage(
    sender: string,
    message: string,
    avatar?: string
  ): Promise<void> {
    await this.showNotification({
      title: `New message from ${sender}`,
      body: message,
      icon: avatar || "/icons/snakkaz-icon-192.png",
      tag: `chat-${sender}`,
      data: {
        type: "chat_message",
        sender: sender,
        url: "/chat",
      },
      requireInteraction: true,
    });
  }

  public async showVideoCallNotification(
    caller: string,
    isVideo: boolean = true
  ): Promise<void> {
    await this.showNotification({
      title: `Incoming ${isVideo ? "video" : "audio"} call`,
      body: `${caller} is calling you`,
      icon: "/icons/snakkaz-icon-192.png",
      tag: `call-${caller}`,
      data: {
        type: "video_call",
        caller: caller,
        isVideo: isVideo,
        url: "/call",
      },
      requireInteraction: true,
    });
  }

  public async showSystemNotification(
    message: string,
    type: "info" | "warning" | "error" = "info"
  ): Promise<void> {
    const icons = {
      info: "/icons/snakkaz-icon-192.png",
      warning: "/icons/warning-icon.png",
      error: "/icons/error-icon.png",
    };

    await this.showNotification({
      title: "SnakkaZ System",
      body: message,
      icon: icons[type],
      tag: `system-${type}`,
      data: {
        type: "system",
        level: type,
      },
      requireInteraction: type === "error",
    });
  }

  private async initializePushSubscription(): Promise<void> {
    if (!this.serviceWorkerRegistration) {
      return;
    }

    try {
      // Check if already subscribed
      const existingSubscription =
        await this.serviceWorkerRegistration.pushManager.getSubscription();

      if (existingSubscription) {
        this.subscription = existingSubscription as any;
        console.log("[NotificationService] Existing push subscription found");
        return;
      }

      // Create new subscription
      const vapidPublicKey = process.env.VITE_VAPID_PUBLIC_KEY || "defaultKey";

      const subscription =
        await this.serviceWorkerRegistration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: this.urlBase64ToUint8Array(vapidPublicKey),
        });

      this.subscription = subscription as any;
      console.log("[NotificationService] New push subscription created");

      // Send subscription to server
      await this.sendSubscriptionToServer(subscription);
    } catch (error) {
      console.error(
        "[NotificationService] Failed to initialize push subscription:",
        error
      );
    }
  }

  private urlBase64ToUint8Array(base64String: string): Uint8Array {
    const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding)
      .replace(/-/g, "+")
      .replace(/_/g, "/");

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  }

  private async sendSubscriptionToServer(subscription: any): Promise<void> {
    try {
      const response = await fetch("/api/push/subscribe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          subscription: subscription,
          userAgent: navigator.userAgent,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to send subscription to server");
      }

      console.log(
        "[NotificationService] Subscription sent to server successfully"
      );
    } catch (error) {
      console.error(
        "[NotificationService] Failed to send subscription to server:",
        error
      );
    }
  }

  public async clearNotifications(tag?: string): Promise<void> {
    if (!this.serviceWorkerRegistration) {
      return;
    }

    const notifications = await this.serviceWorkerRegistration.getNotifications(
      {
        tag: tag,
      }
    );

    notifications.forEach((notification) => notification.close());
  }

  public getPermissionStatus(): NotificationPermission {
    return this.permission;
  }

  public isNotificationSupported(): boolean {
    return this.isSupported;
  }

  public getSubscription(): PushSubscription | null {
    return this.subscription;
  }

  // In-app notification banner for fallback
  public showInAppNotification(config: NotificationConfig): void {
    const notificationElement = document.createElement("div");
    notificationElement.className = "snakkaz-in-app-notification";
    notificationElement.innerHTML = `
      <div class="notification-content">
        <div class="notification-icon">
          <img src="${
            config.icon || "/icons/snakkaz-icon-192.png"
          }" alt="notification" />
        </div>
        <div class="notification-text">
          <div class="notification-title">${config.title}</div>
          <div class="notification-body">${config.body}</div>
        </div>
        <button class="notification-close">&times;</button>
      </div>
    `;

    // Add styles
    const style = document.createElement("style");
    style.textContent = `
      .snakkaz-in-app-notification {
        position: fixed;
        top: 20px;
        right: 20px;
        background: var(--cyberpunk-primary);
        border: 1px solid var(--cyberpunk-accent);
        border-radius: 8px;
        padding: 16px;
        max-width: 300px;
        box-shadow: 0 4px 12px rgba(0, 255, 255, 0.3);
        z-index: 10000;
        animation: slideIn 0.3s ease-out;
      }
      
      .notification-content {
        display: flex;
        align-items: center;
        gap: 12px;
      }
      
      .notification-icon img {
        width: 32px;
        height: 32px;
        border-radius: 50%;
      }
      
      .notification-text {
        flex: 1;
      }
      
      .notification-title {
        font-weight: bold;
        color: var(--cyberpunk-text);
        font-size: 14px;
      }
      
      .notification-body {
        color: var(--cyberpunk-text-secondary);
        font-size: 12px;
        margin-top: 4px;
      }
      
      .notification-close {
        background: none;
        border: none;
        color: var(--cyberpunk-text);
        font-size: 18px;
        cursor: pointer;
        padding: 0;
        width: 24px;
        height: 24px;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      
      @keyframes slideIn {
        from {
          transform: translateX(100%);
          opacity: 0;
        }
        to {
          transform: translateX(0);
          opacity: 1;
        }
      }
    `;

    document.head.appendChild(style);
    document.body.appendChild(notificationElement);

    // Handle close button
    const closeButton = notificationElement.querySelector(
      ".notification-close"
    );
    closeButton?.addEventListener("click", () => {
      notificationElement.remove();
      style.remove();
    });

    // Auto-remove after 5 seconds
    setTimeout(() => {
      if (notificationElement.parentNode) {
        notificationElement.remove();
        style.remove();
      }
    }, 5000);

    // Handle click on notification
    notificationElement.addEventListener("click", (event) => {
      if (event.target === closeButton) return;

      if (config.data?.url) {
        window.location.href = config.data.url;
      }
      notificationElement.remove();
      style.remove();
    });
  }
}

export default NotificationService;
