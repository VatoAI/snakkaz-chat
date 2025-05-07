
/**
 * Formats a date for message timestamps in a user-friendly way
 * @param date The date to format
 * @param includeDay Whether to include the day information (Today, Yesterday, or date)
 * @returns Formatted date string
 */
export function formatMessageTimestamp(date: Date, includeDay: boolean = false): string {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  
  const isToday = date.getTime() >= today.getTime();
  const isYesterday = date.getTime() >= yesterday.getTime() && date.getTime() < today.getTime();
  
  // Time formatting options
  const timeOptions: Intl.DateTimeFormatOptions = {
    hour: '2-digit',
    minute: '2-digit'
  };
  
  // Date formatting options
  const dateOptions: Intl.DateTimeFormatOptions = {
    day: 'numeric',
    month: 'short',
    year: now.getFullYear() !== date.getFullYear() ? 'numeric' : undefined
  };
  
  const timeString = date.toLocaleTimeString([], timeOptions);
  
  if (!includeDay) {
    return timeString;
  }
  
  if (isToday) {
    return `I dag, ${timeString}`;
  } else if (isYesterday) {
    return `I går, ${timeString}`;
  } else {
    return `${date.toLocaleDateString([], dateOptions)}, ${timeString}`;
  }
}
