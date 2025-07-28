import nodemailer from 'nodemailer';
import { emailConfig, validateEmail, sanitizeEmailContent } from '../../../config/email/email-config';

export interface EmailData {
  to: string | string[];
  subject: string;
  template: string;
  data: Record<string, any>;
  attachments?: Array<{
    filename: string;
    content: Buffer | string;
    contentType?: string;
  }>;
}

export class EmailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransporter({
      host: emailConfig.smtp.host,
      port: emailConfig.smtp.port,
      secure: emailConfig.smtp.secure,
      auth: emailConfig.smtp.auth
    });
  }

  async sendEmail(emailData: EmailData): Promise<boolean> {
    try {
      // Validate email addresses
      const recipients = Array.isArray(emailData.to) ? emailData.to : [emailData.to];
      const validRecipients = recipients.filter(validateEmail);
      
      if (validRecipients.length === 0) {
        throw new Error('No valid email addresses provided');
      }

      // Load and render template
      const htmlContent = await this.renderTemplate(emailData.template, emailData.data);
      
      // Sanitize content
      const sanitizedContent = sanitizeEmailContent(htmlContent);

      const mailOptions = {
        from: `${emailConfig.from.name} <${emailConfig.from.address}>`,
        to: validRecipients.join(', '),
        subject: emailData.subject,
        html: sanitizedContent,
        attachments: emailData.attachments || []
      };

      const result = await this.transporter.sendMail(mailOptions);
      console.log('✅ Email sent successfully:', result.messageId);
      return true;

    } catch (error) {
      console.error('❌ Email sending failed:', error);
      return false;
    }
  }

  private async renderTemplate(templateName: string, data: Record<string, any>): Promise<string> {
    // Simple template rendering - can be replaced with more sophisticated system
    const templates = {
      'email-verification': `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #3b82f6;">Verify Your Email - Snakkaz Chat</h2>
          <p>Hi ${data.userName || 'User'},</p>
          <p>Please verify your email address by clicking the button below:</p>
          <a href="${data.verificationUrl}" style="background: #3b82f6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
            Verify Email
          </a>
          <p>If you didn't create an account, you can safely ignore this email.</p>
          <p>Best regards,<br>Snakkaz Chat Team</p>
        </div>
      `,
      'password-reset': `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #ef4444;">Password Reset - Snakkaz Chat</h2>
          <p>Hi ${data.userName || 'User'},</p>
          <p>You requested a password reset for your Snakkaz Chat account.</p>
          <a href="${data.resetUrl}" style="background: #ef4444; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
            Reset Password
          </a>
          <p>This link will expire in 1 hour.</p>
          <p>If you didn't request this reset, please ignore this email.</p>
          <p>Best regards,<br>Snakkaz Chat Team</p>
        </div>
      `,
      'welcome': `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #22c55e;">Welcome to Snakkaz Chat!</h2>
          <p>Hi ${data.userName || 'User'},</p>
          <p>Welcome to Snakkaz Chat! We're excited to have you join our community.</p>
          <p>Here's what you can do next:</p>
          <ul>
            <li>Complete your profile</li>
            <li>Join interesting conversations</li>
            <li>Connect with other users</li>
          </ul>
          <a href="${data.loginUrl || 'https://snakkaz.com'}" style="background: #22c55e; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
            Start Chatting
          </a>
          <p>Best regards,<br>Snakkaz Chat Team</p>
        </div>
      `,
      'notification': `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #3b82f6;">New Notification - Snakkaz Chat</h2>
          <p>Hi ${data.userName || 'User'},</p>
          <p>${data.message || 'You have a new notification.'}</p>
          <a href="${data.actionUrl || 'https://snakkaz.com'}" style="background: #3b82f6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
            View Details
          </a>
          <p>Best regards,<br>Snakkaz Chat Team</p>
        </div>
      `
    };

    return templates[templateName as keyof typeof templates] || '<p>Template not found</p>';
  }

  async testConnection(): Promise<boolean> {
    try {
      await this.transporter.verify();
      console.log('✅ Email connection verified');
      return true;
    } catch (error) {
      console.error('❌ Email connection failed:', error);
      return false;
    }
  }
}

// Export singleton instance
export const emailService = new EmailService();
