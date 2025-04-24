// Lydmanager for SnakkaZ-applikasjonen
import { isInQuietHours } from "./quiet-hours";
import type { NotificationSettings } from '@/types/notification';

let audioContext: AudioContext | null = null;

// Hent AudioContext og sikre at den er ulåst for mobil
const getAudioContext = (): AudioContext | null => {
  if (!audioContext) {
    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioContextClass) {
        audioContext = new AudioContextClass();
        
        // Lås opp AudioContext for iOS/Safari ved første brukerinteraksjon
        if (audioContext.state === 'suspended') {
          const unlock = () => {
            audioContext?.resume();
            document.removeEventListener('touchstart', unlock);
            document.removeEventListener('touchend', unlock);
            document.removeEventListener('click', unlock);
          };
          
          document.addEventListener('touchstart', unlock, { once: true });
          document.addEventListener('touchend', unlock, { once: true });
          document.addEventListener('click', unlock, { once: true });
        }
      }
    } catch (error) {
      console.error('Failed to create AudioContext:', error);
    }
  }
  return audioContext;
};

// Hent varslingsinnstillinger fra localStorage
const getNotificationSettings = (): NotificationSettings => {
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
    customSoundId: "soft-chime" // Standard lydvalg
  };
};

// Tilgjengelige meldingslyder
export const notificationSounds = {
  "soft-chime": {
    name: "Myk klang",
    play: (volume: number) => playMelody(volume, [
      { note: 'E5', duration: 0.1 },
      { note: 'G5', duration: 0.1 },
      { note: 'B5', duration: 0.2 }
    ])
  },
  "subtle-bell": {
    name: "Subtil bjelle",
    play: (volume: number) => playMelody(volume, [
      { note: 'C5', duration: 0.1 },
      { note: 'G5', duration: 0.2 }
    ])
  },
  "water-drop": {
    name: "Vanndråpe",
    play: (volume: number) => {
      const ctx = getAudioContext();
      if (!ctx) return;
      
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      osc.frequency.value = 1800;
      gain.gain.value = 0;
      gain.gain.setValueAtTime(0, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(volume * 0.3, ctx.currentTime + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);
      
      osc.frequency.setValueAtTime(1800, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(300, ctx.currentTime + 0.5);
      
      osc.start();
      osc.stop(ctx.currentTime + 0.5);
    }
  },
  "chat-notification": {
    name: "Chat-varsel",
    play: (volume: number) => playMelody(volume, [
      { note: 'B4', duration: 0.07 },
      { note: 'E5', duration: 0.14 }
    ])
  }
};

// Frekvenser for noter (for enkel melodigenerasjon)
const noteFrequency: {[key: string]: number} = {
  'C4': 261.63, 'C#4': 277.18, 'D4': 293.66, 'D#4': 311.13, 'E4': 329.63,
  'F4': 349.23, 'F#4': 369.99, 'G4': 392.00, 'G#4': 415.30, 'A4': 440.00,
  'A#4': 466.16, 'B4': 493.88, 'C5': 523.25, 'C#5': 554.37, 'D5': 587.33,
  'D#5': 622.25, 'E5': 659.25, 'F5': 698.46, 'F#5': 739.99, 'G5': 783.99,
  'G#5': 830.61, 'A5': 880.00, 'A#5': 932.33, 'B5': 987.77
};

// Spill en enkel melodi med gitte noter
const playMelody = (volume: number, notes: { note: string, duration: number }[]) => {
  const ctx = getAudioContext();
  if (!ctx) return;

  let currentTime = ctx.currentTime;
  
  notes.forEach(({ note, duration }) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.type = 'sine';
    osc.frequency.value = noteFrequency[note] || 440;
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    
    gain.gain.value = 0;
    gain.gain.setValueAtTime(0, currentTime);
    gain.gain.linearRampToValueAtTime(volume * 0.3, currentTime + 0.02);
    gain.gain.linearRampToValueAtTime(0, currentTime + duration);
    
    osc.start(currentTime);
    osc.stop(currentTime + duration);
    
    currentTime += duration;
  });
};

// Spill varsellyd for ny melding
export const playNotificationSound = async () => {
  try {
    const settings = getNotificationSettings();

    // Sjekk om lyd er aktivert i innstillingene
    if (!settings.soundEnabled) {
      console.log('Notification sound disabled in settings');
      return;
    }

    // Sjekk om vi er i stilletid
    if (isInQuietHours(settings)) {
      console.log('Currently in quiet hours, no sound will be played');
      return;
    }

    const context = getAudioContext();
    if (!context) {
      console.error('AudioContext not available');
      return;
    }
    
    // Bestem hvilken lyd som skal spilles
    const soundId = settings.customSoundId || "soft-chime";
    const sound = notificationSounds[soundId] || notificationSounds["soft-chime"];
    
    // Spill valgt lyd
    await sound.play(settings.soundVolume);

    // Vibrer på mobile enheter hvis aktivert i innstillingene
    if (settings.vibrationEnabled && navigator.vibrate) {
      navigator.vibrate(200);
    }
  } catch (error) {
    console.error('Error playing notification sound:', error);
  }
};

// Be om tillatelse til å vise varsler
export const requestNotificationPermission = async () => {
  if (!("Notification" in window)) {
    console.log("This browser does not support notifications");
    return false;
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

// Vis et varslingselement
export const showNotification = async (title: string, options?: NotificationOptions) => {
  const settings = getNotificationSettings();
  
  // Ikke vis varsler i stilletid
  if (isInQuietHours(settings)) {
    console.log('Currently in quiet hours, no notification will be shown');
    return;
  }
  
  // Prøv å få tillatelse hvis nødvendig
  const hasPermission = await requestNotificationPermission();
  if (!hasPermission) return;
  
  try {
    // Spill lyd hvis aktivert
    if (settings.soundEnabled) {
      await playNotificationSound();
    }
    
    // Opprett varsling med ikon og merke for bedre mobilopplevelse
    const finalOptions: NotificationOptions = {
      icon: '/snakkaz-logo.png',
      badge: '/icons/snakkaz-icon-192.png',
      ...options
    };
    
    // Vis varsler hvis støttet
    if (window.Notification && Notification.permission === "granted") {
      new Notification(title, finalOptions);
    }
  } catch (error) {
    console.error('Error showing notification:', error);
  }
};
