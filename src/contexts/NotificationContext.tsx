import React, { createContext, useContext, useState, useEffect } from 'react';
import { useToast } from "@/hooks/use-toast";
import { showNotification, playNotificationSound } from "@/utils/sound-manager";
import { isInQuietHours } from "@/utils/quiet-hours";
import type { NotificationContextType, NotificationSettings } from "@/types/notification";

// Define default settings here instead of relying on the hook
const defaultSettings: NotificationSettings = {
  soundEnabled: true,
  soundVolume: 0.5,
  vibrationEnabled: true,
  quietHoursEnabled: false,
  quietHoursStart: "22:00",
  quietHoursEnd: "07:00",
  customSoundId: "soft-chime",
};

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider = ({ children }: { children: React.ReactNode }) => {
  const [settings, setSettings] = useState<NotificationSettings>(defaultSettings);
  const { toast } = useToast();

  // Load saved settings from localStorage on mount
  useEffect(() => {
    const savedSettings = localStorage.getItem('notificationSettings');
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings);
        setSettings({
          ...defaultSettings,
          ...parsed
        });
      } catch (error) {
        console.error('Error parsing notification settings:', error);
        setSettings(defaultSettings);
      }
    }
  }, []);

  // Save settings to localStorage when they change
  useEffect(() => {
    localStorage.setItem('notificationSettings', JSON.stringify(settings));
  }, [settings]);

  const updateSettings = (newSettings: Partial<NotificationSettings>) => {
    setSettings(prev => ({
      ...prev,
      ...newSettings
    }));
  };

  const notify = async (title: string, options?: NotificationOptions) => {
    // Skip notifications during quiet hours if enabled
    if (isInQuietHours(settings)) {
      console.log("In quiet hours, skipping notification");
      return;
    }

    // Show toast notification
    toast({
      title,
      description: options?.body,
      duration: 5000,
    });

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
