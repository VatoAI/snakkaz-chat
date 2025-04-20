
const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();

export const playNotificationSound = async () => {
  try {
    // Simple beep sound
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.type = 'sine';
    oscillator.frequency.value = 1000;
    gainNode.gain.value = 0.1;
    
    oscillator.start();
    oscillator.stop(audioContext.currentTime + 0.1);
    
    // Vibrate on mobile devices
    if (navigator.vibrate) {
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
  
  try {
    await playNotificationSound();
    new Notification(title, options);
  } catch (error) {
    console.error('Error showing notification:', error);
  }
};

