import { useState, useEffect } from 'react';
import type { NotificationSettings } from '@/types/notification';

const defaultSettings: NotificationSettings = {
  soundEnabled: true,
  soundVolume: 0.5,
  vibrationEnabled: true,
  quietHoursEnabled: false,
  quietHoursStart: "22:00",
  quietHoursEnd: "07:00",
  customSoundId: "soft-chime", // Standard meldingslyd
};

export const useNotificationSettings = () => {
  const [settings, setSettings] = useState<NotificationSettings>(defaultSettings);

  // Last inn lagrede innstillinger fra localStorage
  useEffect(() => {
    const savedSettings = localStorage.getItem('notificationSettings');
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings);
        // Sikre at standardverdier er på plass for eventuelt manglende felter
        setSettings({
          ...defaultSettings,
          ...parsed
        });
      } catch (error) {
        console.error('Feil ved parsing av varslingsinnstillinger:', error);
        setSettings(defaultSettings);
      }
    }
  }, []);

  // Lagre innstillinger til localStorage når de endres
  useEffect(() => {
    localStorage.setItem('notificationSettings', JSON.stringify(settings));
  }, [settings]);

  const updateSettings = (newSettings: Partial<NotificationSettings>) => {
    setSettings(prev => ({
      ...prev,
      ...newSettings
    }));
  };

  return { settings, updateSettings };
};

