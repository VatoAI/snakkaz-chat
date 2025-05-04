/**
 * Formatting utilities for tidshåndtering
 */

/**
 * Formatter en dato til en lesbar string
 * @param date Dato som skal formateres
 * @param includeTime Om klokkeslett skal inkluderes
 * @returns Formatert dato string
 */
export const formatDate = (date: Date, includeTime: boolean = false): string => {
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  };

  if (includeTime) {
    options.hour = '2-digit';
    options.minute = '2-digit';
  }

  return new Intl.DateTimeFormat('nb-NO', options).format(date);
};

/**
 * Formatter et timestamp til relativ tid (f.eks. "for 5 minutter siden")
 * @param timestamp Timestamp som skal formateres
 * @returns Formatert relativ tid string
 */
export const formatRelativeTime = (timestamp: number | Date): string => {
  const date = timestamp instanceof Date ? timestamp : new Date(timestamp);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  if (diffInSeconds < 60) {
    return 'Nettopp';
  }
  
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes} ${diffInMinutes === 1 ? 'minutt' : 'minutter'} siden`;
  }
  
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours} ${diffInHours === 1 ? 'time' : 'timer'} siden`;
  }
  
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) {
    return `${diffInDays} ${diffInDays === 1 ? 'dag' : 'dager'} siden`;
  }
  
  return formatDate(date, false);
};

/**
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
