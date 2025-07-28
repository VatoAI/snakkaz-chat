// Norwegian Date/Time Formatting Utilities
import { format, formatDistanceToNow, parseISO } from 'date-fns';
import { nb } from 'date-fns/locale';

// Norwegian date formats
export const NORWEGIAN_DATE_FORMATS = {
  short: 'dd.MM.yyyy',
  medium: 'd. MMM yyyy',
  long: 'd. MMMM yyyy',
  full: 'EEEE d. MMMM yyyy',
  time: 'HH:mm',
  dateTime: 'dd.MM.yyyy HH:mm',
  timeWithSeconds: 'HH:mm:ss'
};

// Format date in Norwegian style
export const formatNorwegianDate = (date, formatType = 'short') => {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return format(dateObj, NORWEGIAN_DATE_FORMATS[formatType], { locale: nb });
};

// Format time ago in Norwegian
export const formatNorwegianTimeAgo = (date) => {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return formatDistanceToNow(dateObj, { 
    addSuffix: true, 
    locale: nb 
  });
};

// Norwegian specific time formatting for chat
export const formatChatTime = (date) => {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  const now = new Date();
  const diffInDays = Math.floor((now - dateObj) / (1000 * 60 * 60 * 24));
  
  if (diffInDays === 0) {
    // Today - show time only
    return format(dateObj, 'HH:mm', { locale: nb });
  } else if (diffInDays === 1) {
    // Yesterday
    return `i går ${format(dateObj, 'HH:mm', { locale: nb })}`;
  } else if (diffInDays < 7) {
    // This week - show day and time
    return format(dateObj, 'EEEE HH:mm', { locale: nb });
  } else {
    // Older - show date and time
    return format(dateObj, 'dd.MM.yyyy HH:mm', { locale: nb });
  }
};

// Norwegian number formatting
export const formatNorwegianNumber = (number) => {
  return new Intl.NumberFormat('nb-NO').format(number);
};

// Norwegian currency formatting (NOK)
export const formatNorwegianCurrency = (amount) => {
  return new Intl.NumberFormat('nb-NO', {
    style: 'currency',
    currency: 'NOK'
  }).format(amount);
};

// Norwegian file size formatting
export const formatNorwegianFileSize = (bytes) => {
  const sizes = ['bytes', 'KB', 'MB', 'GB', 'TB'];
  if (bytes === 0) return '0 bytes';
  
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  const size = (bytes / Math.pow(1024, i)).toFixed(1);
  
  return `${size.replace('.', ',')} ${sizes[i]}`;
};

export default {
  formatNorwegianDate,
  formatNorwegianTimeAgo,
  formatChatTime,
  formatNorwegianNumber,
  formatNorwegianCurrency,
  formatNorwegianFileSize,
  NORWEGIAN_DATE_FORMATS
};
