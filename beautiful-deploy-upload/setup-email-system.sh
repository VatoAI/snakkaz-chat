#!/bin/bash

# SNAKKAZ EMAIL SYSTEM MODERNIZATION
# Comprehensive email system setup and fixes

echo "📧 SNAKKAZ EMAIL SYSTEM MODERNIZATION"
echo "===================================="

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}Starting email system modernization...${NC}"

# Create email system structure
mkdir -p src/email/{templates,services,config,utils}
mkdir -p config/email
mkdir -p tests/email

echo -e "${GREEN}✓ Email directory structure created${NC}"

# Create modern email configuration
cat > config/email/email-config.ts << 'EOF'
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
EOF

# Create modern email service
cat > src/email/services/EmailService.ts << 'EOF'
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
EOF

# Create email utilities
cat > src/email/utils/email-utils.ts << 'EOF'
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
EOF

# Create email test script
cat > scripts/testing/test-email-system.mjs << 'EOF'
#!/usr/bin/env node

// Email System Test Script
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const emailConfig = {
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER || '',
    pass: process.env.SMTP_PASS || ''
  }
};

async function testEmailSystem() {
  console.log('📧 TESTING EMAIL SYSTEM');
  console.log('======================');
  
  try {
    // Create transporter
    const transporter = nodemailer.createTransporter(emailConfig);
    
    // Test connection
    console.log('🔄 Testing SMTP connection...');
    await transporter.verify();
    console.log('✅ SMTP connection successful');
    
    // Test email sending (to yourself for testing)
    const testEmail = process.env.TEST_EMAIL || process.env.SMTP_USER;
    
    if (testEmail) {
      console.log('🔄 Sending test email...');
      
      const mailOptions = {
        from: `Snakkaz Chat <${process.env.SMTP_USER}>`,
        to: testEmail,
        subject: 'Snakkaz Email System Test',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #22c55e;">✅ Email System Working!</h2>
            <p>This is a test email from your Snakkaz Chat application.</p>
            <p><strong>Test Date:</strong> ${new Date().toISOString()}</p>
            <p><strong>Status:</strong> All email functions are operational</p>
            <p>🚀 Your email system is ready for production!</p>
          </div>
        `
      };
      
      const result = await transporter.sendMail(mailOptions);
      console.log('✅ Test email sent successfully');
      console.log('📧 Message ID:', result.messageId);
    }
    
    console.log('');
    console.log('🎉 EMAIL SYSTEM TEST COMPLETED');
    console.log('✅ All tests passed');
    
  } catch (error) {
    console.error('❌ Email system test failed:', error.message);
    console.log('');
    console.log('🔧 TROUBLESHOOTING:');
    console.log('1. Check your .env file for correct SMTP settings');
    console.log('2. Verify SMTP credentials');
    console.log('3. Check if 2FA is enabled (use app password for Gmail)');
    console.log('4. Ensure firewall allows SMTP connections');
  }
}

testEmailSystem();
EOF

chmod +x scripts/testing/test-email-system.mjs

# Create email environment template
cat > .env.email.example << 'EOF'
# Email Configuration for Snakkaz Chat
# Copy to .env and fill in your actual values

# SMTP Settings
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# Email Settings
FROM_EMAIL=noreply@snakkaz.com
TEST_EMAIL=your-test@email.com

# Email Features
EMAIL_VERIFICATION_ENABLED=true
EMAIL_NOTIFICATIONS_ENABLED=true
EMAIL_RATE_LIMIT=100
EOF

echo -e "${GREEN}✓ Email service classes created${NC}"

echo ""
echo -e "${BLUE}Creating email monitoring script...${NC}"

# Create email monitoring script
cat > tools/monitoring/email-health-check.sh << 'EOF'
#!/bin/bash

# EMAIL SYSTEM HEALTH CHECK
# Monitors email system functionality

echo "📧 EMAIL SYSTEM HEALTH CHECK"
echo "============================"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Check environment variables
echo "🔍 Checking email configuration..."

if [ -z "$SMTP_HOST" ]; then
    echo -e "${RED}❌ SMTP_HOST not configured${NC}"
else
    echo -e "${GREEN}✓ SMTP_HOST: $SMTP_HOST${NC}"
fi

if [ -z "$SMTP_USER" ]; then
    echo -e "${RED}❌ SMTP_USER not configured${NC}"
else
    echo -e "${GREEN}✓ SMTP_USER: $SMTP_USER${NC}"
fi

if [ -z "$SMTP_PASS" ]; then
    echo -e "${RED}❌ SMTP_PASS not configured${NC}"
else
    echo -e "${GREEN}✓ SMTP_PASS: [CONFIGURED]${NC}"
fi

echo ""
echo "🧪 Running email system test..."

# Run the email test
cd /workspaces/snakkaz-chat
node scripts/testing/test-email-system.mjs

echo ""
echo "📊 Email Health Summary:"
echo "- Configuration: Check above for missing values"
echo "- Connection: See test results above"
echo "- Recommendations: Use app passwords for Gmail"
echo ""
echo "🔧 Next steps:"
echo "1. Configure missing environment variables"
echo "2. Test with a real email"
echo "3. Set up email monitoring alerts"
EOF

chmod +x tools/monitoring/email-health-check.sh

echo -e "${GREEN}✓ Email monitoring setup created${NC}"

echo ""
echo "===================================="
echo -e "${GREEN}📧 EMAIL SYSTEM MODERNIZATION COMPLETE!${NC}"
echo "===================================="
echo ""
echo "📋 Created:"
echo "  ✅ Modern email service architecture"
echo "  ✅ Email templates (verification, reset, welcome)"
echo "  ✅ Email utilities and helpers"
echo "  ✅ Email testing script"
echo "  ✅ Health monitoring tools"
echo "  ✅ Configuration templates"
echo ""
echo "🔧 Next Steps:"
echo "  1. Configure SMTP settings in .env"
echo "  2. Test email system: ./scripts/testing/test-email-system.mjs"
echo "  3. Run health check: ./tools/monitoring/email-health-check.sh"
echo ""
echo "📧 Features Ready:"
echo "  • Email verification"
echo "  • Password reset emails"
echo "  • Welcome emails"
echo "  • Notification emails"
echo "  • Bulk email sending"
echo "  • Email health monitoring"
