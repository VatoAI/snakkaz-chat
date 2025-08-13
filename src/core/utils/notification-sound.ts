import type { NotificationSettings } from '@/types/notification';
import { DEFAULT_NOTIFICATION_SETTINGS } from '@/services/notification';
import { StorageKeys } from '@/types/storage';

// Sound file paths
const SOUND_FILES = {
  'default': '/sounds/notification.mp3',
  'ping': '/sounds/ping.mp3',
  'pop': '/sounds/pop.mp3',
  'chime': '/sounds/chime.mp3',
  'bell': '/sounds/bell.mp3',
  'message-received': '/sounds/message.mp3',
  'message-sent': '/sounds/message-sent.mp3',
  'mention': '/sounds/mention.mp3',
  'call-incoming': '/sounds/call.mp3',
};

// Cached audio elements for better performance
const audioCache: Record<string, HTMLAudioElement> = {};

/**
 * Preload notification sounds for instant playback
 */
export function preloadNotificationSounds(): void {
  Object.entries(SOUND_FILES).forEach(([id, path]) => {
    if (!audioCache[id]) {
      try {
        const audio = new Audio(path);
        audio.preload = 'auto';
        audioCache[id] = audio;
        
        // Trigger load but suppress errors
        audio.load();
      } catch (error) {
        console.error(`Failed to preload sound: ${id}`, error);
      }
    }
  });
}

/**
 * Get notification settings from localStorage
 */
export function getNotificationSettings(): NotificationSettings {
  const savedSettings = localStorage.getItem(StorageKeys.NOTIFICATION_SETTINGS);
  if (savedSettings) {
    try {
      return { ...DEFAULT_NOTIFICATION_SETTINGS, ...JSON.parse(savedSettings) };
    } catch (e) {
      console.error('Failed to parse notification settings', e);
    }
  }
  
  return DEFAULT_NOTIFICATION_SETTINGS;
}

// Save settings to localStorage
export function saveNotificationSettings(settings: NotificationSettings): void {
  localStorage.setItem('notificationSettings', JSON.stringify(settings));
}

// Play notification sound with specific settings
export function playSound(soundId: string, volumeOverride?: number): Promise<void> {
  return new Promise((resolve, reject) => {
    try {
      const settings = getNotificationSettings();
      
      // Check if sounds are enabled
      if (!settings.soundEnabled) {
        return resolve();
      }
      
      // Check if in quiet hours
      if (isInQuietHours(settings)) {
        return resolve();
      }
      
      // Get the audio element
      let audio = audioCache[soundId];
      if (!audio) {
        // Fallback to using the sound manager if not cached
        playNotificationSound();
        return resolve();
      }
      
      // Set volume
      const volume = volumeOverride !== undefined ? volumeOverride : settings.soundVolume;
      audio.volume = volume;
      
      // Play the sound
      audio.currentTime = 0;
      
      const playPromise = audio.play();
      if (playPromise) {
        playPromise
          .then(() => {
            // Vibrate on mobile if enabled
            if (settings.vibrationEnabled && navigator.vibrate) {
              navigator.vibrate(100);
            }
            resolve();
          })
          .catch(err => {
            console.warn('Error playing notification sound:', err);
            resolve(); // Resolve anyway to not block the flow
          });
      } else {
        resolve();
      }
    } catch (e) {
      console.error('Failed to play notification sound', e);
      resolve(); // Resolve anyway to not block the flow
    }
  });
}

// Show notification with sound
export function notifyUser(title: string, options?: NotificationOptions & { soundId?: string }): void {
  const soundId = options?.soundId || 'notification';
  
  // Play sound first (for immediate feedback)
  playSound(soundId).then(() => {
    // Then show the notification
    showNotification(title, options);
  });
}

// Initialize notification system
export function initializeNotifications(): void {
  preloadNotificationSounds();
}
