
import React, { createContext, useContext } from 'react';
import { useToast } from "@/hooks/use-toast";
import { showNotification, playNotificationSound } from "@/utils/sound-manager";
import { useNotificationSettings } from "@/hooks/use-notification-settings";
import { isInQuietHours } from "@/utils/quiet-hours";
import type { NotificationContextType } from "@/types/notification";

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider = ({ children }: { children: React.ReactNode }) => {
  const { settings, updateSettings } = useNotificationSettings();
  const { toast } = useToast();

  const notify = async (title: string, options?: NotificationOptions) => {
    if (isInQuietHours(settings)) return;

    // Show toast notification
    toast({
      title,
      description: options?.body,
      duration: 5000,
    });

    // Play sound if enabled
    if (settings.soundEnabled) {
      const audioContext = new AudioContext();
      const gainNode = audioContext.createGain();
      gainNode.gain.value = settings.soundVolume;
      gainNode.connect(audioContext.destination);
      await playNotificationSound();
    }

    // Trigger vibration on mobile if enabled
    if (settings.vibrationEnabled && navigator.vibrate) {
      navigator.vibrate(200);
    }

    // Show system notification
    await showNotification(title, options);
  };

  return (
    <NotificationContext.Provider value={{ settings, updateSettings, notify }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};

