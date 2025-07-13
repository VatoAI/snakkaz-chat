import { emailService } from '../services/EmailService';

export interface QuickEmailOptions {
  to: string;
  subject: string;
  message: string;
  userName?: string;
  actionUrl?: string;
}

export const sendVerificationEmail = async (
  email: string, 
  userName: string, 
  verificationUrl: string
): Promise<boolean> => {
  return await emailService.sendEmail({
    to: email,
    subject: 'Verify Your Snakkaz Chat Account',
    template: 'email-verification',
    data: { userName, verificationUrl }
  });
};

export const sendPasswordResetEmail = async (
  email: string,
  userName: string,
  resetUrl: string
): Promise<boolean> => {
  return await emailService.sendEmail({
    to: email,
    subject: 'Reset Your Snakkaz Chat Password',
    template: 'password-reset',
    data: { userName, resetUrl }
  });
};

export const sendWelcomeEmail = async (
  email: string,
  userName: string,
  loginUrl: string = 'https://snakkaz.com'
): Promise<boolean> => {
  return await emailService.sendEmail({
    to: email,
    subject: 'Welcome to Snakkaz Chat!',
    template: 'welcome',
    data: { userName, loginUrl }
  });
};

export const sendNotificationEmail = async (
  options: QuickEmailOptions
): Promise<boolean> => {
  return await emailService.sendEmail({
    to: options.to,
    subject: options.subject,
    template: 'notification',
    data: {
      userName: options.userName,
      message: options.message,
      actionUrl: options.actionUrl
    }
  });
};

// Bulk email functionality
export const sendBulkEmails = async (
  emails: string[],
  subject: string,
  template: string,
  data: Record<string, any>
): Promise<{ sent: number; failed: number }> => {
  let sent = 0;
  let failed = 0;

  for (const email of emails) {
    try {
      const success = await emailService.sendEmail({
        to: email,
        subject,
        template,
        data
      });
      
      if (success) sent++;
      else failed++;
      
      // Rate limiting - wait 100ms between emails
      await new Promise(resolve => setTimeout(resolve, 100));
    } catch (error) {
      failed++;
      console.error(`Failed to send email to ${email}:`, error);
    }
  }

  return { sent, failed };
};
