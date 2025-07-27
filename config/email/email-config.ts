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
    host: process.env.SMTP_HOST || 'snakkaz.com',
    port: parseInt(process.env.SMTP_PORT || '465'),
    secure: process.env.SMTP_SECURE === 'true' || true, // SSL/TLS enabled by default
    auth: {
      user: process.env.SMTP_USER || 'help@snakkaz.com',
      pass: process.env.SMTP_PASS || ''
    }
  },
  from: {
    name: 'SnakkaZ Chat',
    address: process.env.FROM_EMAIL || 'help@snakkaz.com'
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
