
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useToast } from "@/hooks/use-toast";
import { showNotification, playNotificationSound } from "@/utils/sound-manager";

interface NotificationSettings {
  soundEnabled: boolean;
  soundVolume: number;
  vibrationEnabled: boolean;
  quietHoursEnabled: boolean;
  quietHoursStart: string;
  quietHoursEnd: string;
}

interface NotificationContextType {
  settings: NotificationSettings;
  updateSettings: (newSettings: Partial<NotificationSettings>) => void;
  notify: (title: string, options?: NotificationOptions) => void;
}

const defaultSettings: NotificationSettings = {
  soundEnabled: true,
  soundVolume: 0.5,
  vibrationEnabled: true,
  quietHoursEnabled: false,
  quietHoursStart: "22:00",
  quietHoursEnd: "07:00",
};

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider = ({ children }: { children: React.ReactNode }) => {
  const [settings, setSettings] = useState<NotificationSettings>(defaultSettings);
  const { toast } = useToast();

  // Load saved settings from localStorage
  useEffect(() => {
    const savedSettings = localStorage.getItem('notificationSettings');
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }
  }, []);

  // Save settings to localStorage when they change
  useEffect(() => {
    localStorage.setItem('notificationSettings', JSON.stringify(settings));
  }, [settings]);

  const updateSettings = (newSettings: Partial<NotificationSettings>) => {
    setSettings(prev => {
      const updated = { ...prev, ...newSettings };
      return updated;
    });
  };

  const isInQuietHours = () => {
    if (!settings.quietHoursEnabled) return false;

    const now = new Date();
    const currentTime = now.getHours() * 100 + now.getMinutes();
    const [startHour, startMinute] = settings.quietHoursStart.split(':').map(Number);
    const [endHour, endMinute] = settings.quietHoursEnd.split(':').map(Number);
    const start = startHour * 100 + startMinute;
    const end = endHour * 100 + endMinute;

    return currentTime >= start || currentTime <= end;
  };

  const notify = async (title: string, options?: NotificationOptions) => {
    if (isInQuietHours()) return;

    // Show toast notification
    toast({
      title,
      description: options?.body,
      duration: 5000,
    });

    // Play sound if enabled
    if (settings.soundEnabled) {
      const audioContext = new AudioContext();
      audioContext.gain.value = settings.soundVolume;
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
