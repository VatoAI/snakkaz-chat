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
