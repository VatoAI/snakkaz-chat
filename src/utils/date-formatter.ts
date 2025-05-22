/**
 * Date formatting utilities for the chat application
 */

/**
 * Format a date relative to now (e.g., "5 min ago", "Yesterday")
 * @param dateString ISO date string or Date object
 * @returns Formatted relative time string
 */
export function formatRelativeTime(dateString: string | Date | null): string {
  if (!dateString) return '';
  
  const date = typeof dateString === 'string' ? new Date(dateString) : dateString;
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSeconds = Math.floor(diffMs / 1000);
  
  // Less than a minute
  if (diffSeconds < 60) {
    return 'nå nettopp';
  }
  
  // Less than an hour
  const diffMinutes = Math.floor(diffSeconds / 60);
  if (diffMinutes < 60) {
    return `${diffMinutes} min siden`;
  }
  
  // Less than a day
  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) {
    return `${diffHours} t siden`;
  }
  
  // Check if it was yesterday
  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  if (date.getDate() === yesterday.getDate() && 
      date.getMonth() === yesterday.getMonth() && 
      date.getFullYear() === yesterday.getFullYear()) {
    return 'i går ' + formatTime(date);
  }
  
  // Less than 7 days
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 7) {
    return `${diffDays} d siden`;
  }
  
  // More than 7 days, show date
  return formatDate(date);
}

/**
 * Format a date in a standard format
 * @param date Date to format
 * @returns Formatted date string
 */
export function formatDate(date: Date): string {
  return date.toLocaleDateString('nb-NO', { 
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
}

/**
 * Format time in 24-hour format
 * @param date Date to extract time from
 * @returns Formatted time string
 */
export function formatTime(date: Date): string {
  return date.toLocaleTimeString('nb-NO', { 
    hour: '2-digit',
    minute: '2-digit'
  });
}

/**
 * Format date and time together
 * @param date Date to format
 * @returns Formatted date and time string
 */
export function formatDateTime(date: Date): string {
  return `${formatDate(date)} ${formatTime(date)}`;
}

/**
 * Get a friendly day name for a date
 * @param date Date to get day name for
 * @returns Day name (e.g., "i dag", "i går", "mandag")
 */
export function getDayName(date: Date): string {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const dateDay = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  
  // Check if it's today
  if (dateDay.getTime() === today.getTime()) {
    return 'i dag';
  }
  
  // Check if it's yesterday
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);
  if (dateDay.getTime() === yesterday.getTime()) {
    return 'i går';
  }
  
  // Check if it's within the last week
  const lastWeek = new Date(today);
  lastWeek.setDate(today.getDate() - 6);
  if (dateDay >= lastWeek) {
    return date.toLocaleDateString('nb-NO', { weekday: 'long' });
  }
  
  // Otherwise return the date
  return formatDate(date);
}
