
import type { NotificationSettings } from '@/types/notification';

export const isInQuietHours = (settings: NotificationSettings): boolean => {
  if (!settings.quietHoursEnabled) return false;

  const now = new Date();
  const currentTime = now.getHours() * 100 + now.getMinutes();
  const [startHour, startMinute] = settings.quietHoursStart.split(':').map(Number);
  const [endHour, endMinute] = settings.quietHoursEnd.split(':').map(Number);
  const start = startHour * 100 + startMinute;
  const end = endHour * 100 + endMinute;

  return currentTime >= start || currentTime <= end;
};
