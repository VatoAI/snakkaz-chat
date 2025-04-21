
const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();

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

export const playNotificationSound = async () => {
  try {
    const settings = getNotificationSettings();

    // Check if sound is enabled in settings
    if (!settings.soundEnabled) {
      console.log('Notification sound disabled in settings');
      return;
    }

    // Check quiet hours if enabled
    if (settings.quietHoursEnabled) {
      const now = new Date();
      const currentTime = now.getHours().toString().padStart(2, '0') + ":" +
        now.getMinutes().toString().padStart(2, '0');
      if (settings.quietHoursStart <= currentTime && currentTime <= settings.quietHoursEnd) {
        console.log('Currently in quiet hours, no sound will be played');
        return;
      }
    }

    // Special mobile workaround: unlock context if needed
    const unlock = () => {
      if (audioContext.state !== "running" && audioContext.resume) {
        audioContext.resume();
      }
    };

    if (typeof window !== 'undefined' && 'ontouchstart' in window) {
      // On mobile, call unlock on first user interaction
      window.addEventListener("touchend", unlock, { once: true });
    }

    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.type = 'sine'; // Mobile-friendly, simple beep sound
    oscillator.frequency.value = 1000;
    gainNode.gain.value = settings.soundVolume || 0.1;

    oscillator.start();
    oscillator.stop(audioContext.currentTime + 0.1);

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
  
  if (Notification.permission !== "granted") {
    const permission = await Notification.requestPermission();
    return permission === "granted";
  }
  
  return true;
};

export const showNotification = async (title: string, options?: NotificationOptions) => {
  const hasPermission = await requestNotificationPermission();
  if (!hasPermission) return;
  
  const settings = getNotificationSettings();
  
  // Check quiet hours if enabled
  if (settings.quietHoursEnabled) {
    const now = new Date();
    const currentTime = now.getHours().toString().padStart(2, '0') + ":" + 
                       now.getMinutes().toString().padStart(2, '0');
    
    if (settings.quietHoursStart <= currentTime && currentTime <= settings.quietHoursEnd) {
      console.log('Currently in quiet hours, no notification will be shown');
      return;
    }
  }
  
  try {
    if (settings.soundEnabled) {
      await playNotificationSound();
    }
    
    new Notification(title, options);
  } catch (error) {
    console.error('Error showing notification:', error);
  }
};
