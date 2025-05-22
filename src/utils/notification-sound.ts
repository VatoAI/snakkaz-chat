import { showNotification, playNotificationSound } from './sound-manager';
import { isInQuietHours } from './quiet-hours';
import type { NotificationSettings } from '@/types/notification';

// Cached audio elements for better performance
const audioCache: Record<string, HTMLAudioElement> = {};

// Preload notification sounds for instant playback
export function preloadNotificationSounds() {
  const sounds = [
    { id: 'message-received', path: '/sounds/message.mp3' },
    { id: 'message-sent', path: '/sounds/message-sent.mp3' },
    { id: 'mention', path: '/sounds/mention.mp3' },
    { id: 'call-incoming', path: '/sounds/call.mp3' },
    { id: 'notification', path: '/sounds/notification.mp3' }
  ];
  
  sounds.forEach(sound => {
    if (!audioCache[sound.id]) {
      const audio = new Audio(sound.path);
      audio.preload = 'auto';
      audioCache[sound.id] = audio;
      
      // Trigger load but suppress errors
      audio.load();
    }
  });
}

// Get settings from localStorage or use defaults
export function getNotificationSettings(): NotificationSettings {
  const savedSettings = localStorage.getItem('notificationSettings');
  if (savedSettings) {
    try {
      return JSON.parse(savedSettings);
    } catch (e) {
      console.error('Failed to parse notification settings', e);
    }
  }
  
  // Default settings
  return {
    soundEnabled: true,
    soundVolume: 0.5,
    vibrationEnabled: true,
    quietHoursEnabled: false,
    quietHoursStart: "22:00",
    quietHoursEnd: "07:00",
    customSoundId: "soft-chime"
  };
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
