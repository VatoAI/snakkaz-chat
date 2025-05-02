
/**
 * Utility functions for time formatting
 */

// Format seconds into a human-readable duration
export const formatDuration = (seconds: number): string => {
  if (seconds < 60) {
    return `${seconds} seconds`;
  } else if (seconds < 3600) {
    const minutes = Math.floor(seconds / 60);
    return `${minutes} ${minutes === 1 ? 'minute' : 'minutes'}`;
  } else if (seconds < 86400) {
    const hours = Math.floor(seconds / 3600);
    return `${hours} ${hours === 1 ? 'hour' : 'hours'}`;
  } else {
    const days = Math.floor(seconds / 86400);
    return `${days} ${days === 1 ? 'day' : 'days'}`;
  }
};

// Format a date to a relative time string (e.g., "2 hours ago")
export const formatRelativeTime = (date: Date | string): string => {
  const now = new Date();
  const targetDate = typeof date === 'string' ? new Date(date) : date;
  
  const diffInSeconds = Math.floor((now.getTime() - targetDate.getTime()) / 1000);
  
  if (diffInSeconds < 60) {
    return 'just now';
  } else if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60);
    return `${minutes} ${minutes === 1 ? 'minute' : 'minutes'} ago`;
  } else if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600);
    return `${hours} ${hours === 1 ? 'hour' : 'hours'} ago`;
  } else if (diffInSeconds < 604800) { // 7 days
    const days = Math.floor(diffInSeconds / 86400);
    return `${days} ${days === 1 ? 'day' : 'days'} ago`;
  } else {
    // Format as date
    return targetDate.toLocaleDateString();
  }
};

// Format date for chat messages
export const formatMessageTime = (date: Date | string): string => {
  const msgDate = typeof date === 'string' ? new Date(date) : date;
  return msgDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

// Format date for message groups
export const formatMessageDate = (date: Date | string): string => {
  const msgDate = typeof date === 'string' ? new Date(date) : date;
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  
  if (msgDate.toDateString() === today.toDateString()) {
    return 'Today';
  } else if (msgDate.toDateString() === yesterday.toDateString()) {
    return 'Yesterday';
  } else {
    return msgDate.toLocaleDateString(undefined, { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  }
};
