
/**
 * Date formatting utilities for the chat application
 */

import { formatDistanceToNow, format } from 'date-fns';
import { nb } from 'date-fns/locale';

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

/**
 * Format a date for display in date separators
 * 
 * @param date - The date to format
 * @returns A user-friendly date string
 */
export function formatDateSeparator(date: Date): string {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  
  if (date >= today) {
    return 'I dag';
  } else if (date >= yesterday) {
    return 'I går';
  } else {
    return format(date, 'dd. MMMM yyyy', { locale: nb });
  }
}

/**
 * Format a date as a relative time (e.g., "5 minutes ago")
 * 
 * @param date - The date to format
 * @returns A relative time string
 */
export function formatRelativeTime(date: Date): string {
  return formatDistanceToNow(date, { addSuffix: true, locale: nb });
}

/**
 * Format a date for display in message timestamps
 * 
 * @param dateString - The date string to format
 * @returns A formatted time string (HH:MM)
 */
export function formatMessageTime(dateString: string): string {
  const date = new Date(dateString);
  return format(date, 'HH:mm');
}

/**
 * Get date key for message grouping
 * 
 * @param date - The date to get the key for
 * @returns A string key in the format YYYY-MM-DD
 */
export function getDateKey(date: Date): string {
  return format(date, 'yyyy-MM-dd');
}
