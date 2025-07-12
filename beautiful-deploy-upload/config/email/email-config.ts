// Modern Email Configuration for Snakkaz Chat

export interface EmailConfig {
  smtp: {
    host: string;
    port: number;
    secure: boolean;
    auth: {
      user: string;
      pass: string;
    };
  };
  from: {
    name: string;
    address: string;
  };
  templates: {
    verification: string;
    passwordReset: string;
    welcome: string;
    notification: string;
  };
}

export const emailConfig: EmailConfig = {
  smtp: {
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: process.env.SMTP_USER || '',
      pass: process.env.SMTP_PASS || ''
    }
  },
  from: {
    name: 'Snakkaz Chat',
    address: process.env.FROM_EMAIL || 'noreply@snakkaz.com'
  },
  templates: {
    verification: 'email-verification',
    passwordReset: 'password-reset', 
    welcome: 'welcome',
    notification: 'notification'
  }
};

// Email validation utilities
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const sanitizeEmailContent = (content: string): string => {
  // Remove potentially dangerous HTML/scripts
  return content
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
    .replace(/javascript:/gi, '');
};
