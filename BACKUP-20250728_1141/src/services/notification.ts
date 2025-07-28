/**
 * Notification Service for Snakkaz Chat
 * 
 * This service centralizes notification functionality and default settings
 * for the Snakkaz Chat application. It provides:
 * 
 * 1. Default notification settings
 * 2. Functions for sending notifications
 * 3. Permission handling
 * 4. Integration with the sound manager
 */

import type { NotificationSettings } from '@/types/notification';
import { playSound } from '@/utils/notification-sound';
import { isInQuietHours } from '@/utils/quiet-hours';
import { StorageKeys } from '@/types/storage';

// Default notification settings used throughout the app
export const DEFAULT_NOTIFICATION_SETTINGS: NotificationSettings = {
  soundEnabled: true,
  soundVolume: 0.5,
  vibrationEnabled: true,
  quietHoursEnabled: false,
  quietHoursStart: "22:00",
  quietHoursEnd: "07:00",
  customSoundId: "soft-chime",
};

/**
 * Retrieves notification settings from localStorage with fallback to defaults
 */
export function getNotificationSettings(): NotificationSettings {
  try {
    const savedSettings = localStorage.getItem(StorageKeys.NOTIFICATION_SETTINGS);
    if (savedSettings) {
      return { ...DEFAULT_NOTIFICATION_SETTINGS, ...JSON.parse(savedSettings) };
    }
  } catch (error) {
    console.error('Failed to load notification settings:', error);
  }
  return DEFAULT_NOTIFICATION_SETTINGS;
}

/**
 * Saves notification settings to localStorage
 */
export function saveNotificationSettings(settings: NotificationSettings): void {
  try {
    localStorage.setItem(StorageKeys.NOTIFICATION_SETTINGS, JSON.stringify(settings));
  } catch (error) {
    console.error('Failed to save notification settings:', error);
  }
}

/**
 * Request permission to show browser notifications
 * @returns Promise resolving to a boolean indicating if permission was granted
 */
export async function requestNotificationPermission(): Promise<boolean> {
  if (!('Notification' in window)) {
    console.log('This browser does not support desktop notification');
    return false;
  }

  if (Notification.permission === 'granted') {
    return true;
  }

  try {
    const permission = await Notification.requestPermission();
    return permission === 'granted';
  } catch (error) {
    console.error('Error requesting notification permission:', error);
    return false;
  }
}

/**
 * Check if notifications are currently permitted
 */
export function areNotificationsEnabled(): boolean {
  // Check browser support
  if (!('Notification' in window)) {
    return false;
  }
  
  // Check permission
  if (Notification.permission !== 'granted') {
    return false;
  }
  
  // Check user settings
  const settings = getNotificationSettings();
  return settings.soundEnabled;
}

/**
 * Show a system notification with sound
 * @param title Notification title
 * @param options Notification options
 */
export async function showNotification(
  title: string, 
  options?: NotificationOptions & { soundId?: string, skipQuietHours?: boolean }
): Promise<void> {
  const settings = getNotificationSettings();
  
  // Don't show notifications during quiet hours unless explicitly overridden
  if (!options?.skipQuietHours && settings.quietHoursEnabled && isInQuietHours(settings)) {
    console.log('Currently in quiet hours, notification skipped');
    return;
  }
  
  // Ensure we have permission
  const hasPermission = await requestNotificationPermission();
  if (!hasPermission) {
    console.log('Notification permission not granted');
    return;
  }
  
  try {
    // Play notification sound if enabled
    if (settings.soundEnabled) {
      const soundId = options?.soundId || settings.customSoundId || 'default';
      await playSound(soundId);
    }
    
    // Vibrate on mobile if enabled
    if (settings.vibrationEnabled && 'vibrate' in navigator) {
      navigator.vibrate(200);
    }
    
    // Show browser notification
    const notification = new Notification(title, {
      icon: '/snakkaz-logo.png',
      badge: '/icons/notification-badge.png',
      ...options
    });
    
    // Handle notification click
    notification.onclick = () => {
      window.focus();
      notification.close();
    };
  } catch (error) {
    console.error('Error showing notification:', error);
  }
}

/**
 * Initialize notification system
 * - Preload sounds
 * - Request permissions if needed
 */
export function initializeNotifications(): void {
  // Import and run sound preloading
  import('@/utils/notification-sound').then(module => {
    module.preloadNotificationSounds();
  });
  
  // Check if we should request permission on initialization
  if (Notification.permission === 'default') {
    // Wait for user interaction before requesting
    const requestOnInteraction = () => {
      requestNotificationPermission();
      document.removeEventListener('click', requestOnInteraction);
    };
    document.addEventListener('click', requestOnInteraction, { once: true });
  }
}