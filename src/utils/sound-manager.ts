// Create AudioContext for sound handling
let audioContext: AudioContext | null = null;

// Create audio context lazily on user interaction to handle mobile restrictions
const getAudioContext = () => {
  if (!audioContext) {
    try {
      audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      // Unlock audio context on mobile
      if (audioContext.state === "suspended" && 'ontouchstart' in window) {
        const unlock = () => {
          if (audioContext && audioContext.state !== "running") {
            audioContext.resume();
          }
          
          // Create and play a silent sound to unlock audio on iOS
          const silentSound = audioContext.createOscillator();
          const gainNode = audioContext.createGain();
          gainNode.gain.value = 0.001; // Nearly silent
          silentSound.connect(gainNode);
          gainNode.connect(audioContext.destination);
          silentSound.start(0);
          silentSound.stop(0.001);
          
          document.removeEventListener('touchstart', unlock);
          document.removeEventListener('touchend', unlock);
          document.removeEventListener('click', unlock);
        };
        
        document.addEventListener('touchstart', unlock, { once: true });
        document.addEventListener('touchend', unlock, { once: true });
        document.addEventListener('click', unlock, { once: true });
      }
    } catch (error) {
      console.error('Failed to create AudioContext:', error);
    }
  }
  return audioContext;
};

// Get notification settings from localStorage
const getNotificationSettings = () => {
  const savedSettings = localStorage.getItem('notificationSettings');
  if (savedSettings) {
    return JSON.parse(savedSettings);
  }
  return {
    soundEnabled: true,
    soundVolume: 0.5,
    vibrationEnabled: true,
    quietHoursEnabled: false,
    quietHoursStart: "22:00",
    quietHoursEnd: "07:00",
  };
};

// Check if device is in quiet hours
const isInQuietHours = (settings: any) => {
  if (!settings.quietHoursEnabled) return false;
  
  const now = new Date();
  const currentTime = now.getHours().toString().padStart(2, '0') + ":" +
    now.getMinutes().toString().padStart(2, '0');
  
  // Handle case where quiet hours span across midnight
  if (settings.quietHoursStart > settings.quietHoursEnd) {
    return currentTime >= settings.quietHoursStart || currentTime <= settings.quietHoursEnd;
  }
  
  return currentTime >= settings.quietHoursStart && currentTime <= settings.quietHoursEnd;
};

// Play a notification sound with better mobile support
export const playNotificationSound = async () => {
  try {
    const settings = getNotificationSettings();

    // Check if sound is enabled in settings
    if (!settings.soundEnabled) {
      console.log('Notification sound disabled in settings');
      return;
    }

    // Check quiet hours if enabled
    if (isInQuietHours(settings)) {
      console.log('Currently in quiet hours, no sound will be played');
      return;
    }

    const context = getAudioContext();
    if (!context) {
      console.error('AudioContext not available');
      return;
    }

    // Create simple beep sound (mobile friendly)
    const oscillator = context.createOscillator();
    const gainNode = context.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(context.destination);

    oscillator.type = 'sine';
    oscillator.frequency.value = 1000; // 1kHz tone
    gainNode.gain.value = settings.soundVolume;

    oscillator.start();
    oscillator.stop(context.currentTime + 0.1);

    // Vibrate on mobile devices if enabled in settings
    if (settings.vibrationEnabled && navigator.vibrate) {
      navigator.vibrate(200);
    }
  } catch (error) {
    console.error('Error playing notification sound:', error);
  }
};

export const requestNotificationPermission = async () => {
  if (!("Notification" in window)) {
    console.log("This browser does not support notifications");
    return;
  }
  
  try {
    if (Notification.permission !== "granted") {
      const permission = await Notification.requestPermission();
      return permission === "granted";
    }
    return true;
  } catch (error) {
    console.error('Error requesting notification permission:', error);
    return false;
  }
};

export const showNotification = async (title: string, options?: NotificationOptions) => {
  const settings = getNotificationSettings();
  
  // Don't show notifications during quiet hours
  if (isInQuietHours(settings)) {
    console.log('Currently in quiet hours, no notification will be shown');
    return;
  }
  
  // Try to get permission if needed
  const hasPermission = await requestNotificationPermission();
  if (!hasPermission) return;
  
  try {
    // Play sound if enabled
    if (settings.soundEnabled) {
      await playNotificationSound();
    }
    
    // Create notification with icon and badge for better mobile experience
    const finalOptions: NotificationOptions = {
      icon: '/snakkaz-logo.png',
      badge: '/icons/snakkaz-icon-192.png',
      vibrate: settings.vibrationEnabled ? [200, 100, 200] : undefined,
      ...options
    };
    
    // Show notifications if supported
    if (window.Notification && Notification.permission === "granted") {
      new Notification("Ny melding", {
        body: "Du har fått en ny melding",
        // timestamp: Date.now(), // Removed: Not a valid property in NotificationOptions
        // vibrate: [100, 50, 100], // Removed: Not a valid property
        // Add more valid NotificationOptions properties if needed
      });
    }
  } catch (error) {
    console.error('Error showing notification:', error);
  }
};
