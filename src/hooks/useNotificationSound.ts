
import { useState, useEffect, useCallback } from 'react';

type SoundType = 'message' | 'mention' | 'call' | 'notification';

interface NotificationSoundOptions {
  enabled?: boolean;
  volume?: number;
}

export function useNotificationSound(options: NotificationSoundOptions = {}) {
  const { enabled = true, volume = 0.5 } = options;
  const [audioElements, setAudioElements] = useState<Record<SoundType, HTMLAudioElement | null>>({
    message: null,
    mention: null,
    call: null,
    notification: null
  });
  const [isLoaded, setIsLoaded] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  // Initialize audio elements
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const messageAudio = new Audio('/sounds/message.mp3');
    const mentionAudio = new Audio('/sounds/mention.mp3');
    const callAudio = new Audio('/sounds/call.mp3');
    const notificationAudio = new Audio('/sounds/notification.mp3');
    
    const audios = {
      message: messageAudio,
      mention: mentionAudio,
      call: callAudio,
      notification: notificationAudio
    };
    
    // Set volume for all audio elements
    Object.values(audios).forEach(audio => {
      if (audio) {
        audio.volume = volume;
        
        // Preload audio for faster playback
        audio.load();
      }
    });
    
    setAudioElements(audios);
    setIsLoaded(true);
    
    // Clean up
    return () => {
      Object.values(audios).forEach(audio => {
        if (audio) {
          audio.pause();
          audio.src = '';
        }
      });
    };
  }, [volume]);

  // Handle user preference for muting
  useEffect(() => {
    const savedMutePreference = localStorage.getItem('notification-sound-muted');
    if (savedMutePreference !== null) {
      setIsMuted(savedMutePreference === 'true');
    }
  }, []);

  // Save mute preference when it changes
  useEffect(() => {
    localStorage.setItem('notification-sound-muted', isMuted.toString());
  }, [isMuted]);

  // Function to play notification sound
  const playSound = useCallback((type: SoundType = 'message') => {
    if (!isLoaded || !enabled || isMuted) return;
    
    const audio = audioElements[type];
    if (audio) {
      // Reset the audio to the beginning if it's already playing
      audio.pause();
      audio.currentTime = 0;
      
      // Play the sound
      const playPromise = audio.play();
      
      if (playPromise !== undefined) {
        playPromise.catch(error => {
          console.error('Error playing notification sound:', error);
        });
      }
    }
  }, [audioElements, enabled, isMuted, isLoaded]);

  // Toggle mute function
  const toggleMute = useCallback(() => {
    setIsMuted(prev => !prev);
  }, []);

  return { playSound, isMuted, toggleMute };
}

export default useNotificationSound;
