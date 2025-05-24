# Mail Server Connection Fix Guide

This document provides steps to fix the connection issue to the mail.snakkaz.com service and ensure proper deployment of our USB wallet integration.

## 1. Email Connection Issues - "Tilkobling til IMAP-tjener mislyktes"

Based on the error message seen in the screenshots ("Tilkobling til IMAP-tjener mislyktes" - Connection to IMAP server failed), here are the steps to fix the issue:

### A. DNS Configuration Check

1. Log in to your domain registrar or DNS provider (likely Namecheap based on configuration)
2. Check that mail.snakkaz.com has proper MX and A records:
   - A record: mail.snakkaz.com should point to the IP address of premium123.web-hosting.com
   - MX record: snakkaz.com should have an MX record pointing to mail.snakkaz.com

### B. cPanel Mail Server Settings

1. Log in to cPanel at https://premium123.web-hosting.com:2083/
2. Navigate to "Email Accounts"
3. Check that the email accounts are active
4. Verify IMAP is enabled for the accounts:
   - Click on "Connect Devices" next to the email account
   - Ensure IMAP is enabled and note the settings:
     - IMAP Server: mail.snakkaz.com
     - IMAP Port: 993
     - SSL: Required

### C. Direct Login Test

1. Try accessing webmail directly via cPanel: https://premium123.web-hosting.com:2096/
2. Login with your email credentials (help@snakkaz.com and password)
3. If this works, but mail.snakkaz.com doesn't, it's likely a DNS issue

### D. Updated Environment Variables

We've updated the environment variables in the application:
- Changed CPANEL_USERNAME to "snakqsqe" 
- Set proper API tokens for cPanel connection
- Updated EMAIL_API_URL to point to premium123.web-hosting.com

## 2. Building and Deployment Issues

### A. Fixed the Build Error

The build was failing with "Rollup failed to resolve import 'check-password-strength'". We've fixed this by:

1. Installing the missing dependency: `npm install check-password-strength --save`
2. Committing this change to the repository

### B. Deployment Process Check

To ensure changes are properly deployed to www.snakkaz.com:

1. Use the GitHub Actions workflow for deployment:
   - Push changes to the main branch
   - Or manually trigger the workflow from GitHub Actions tab

2. Make sure all GitHub secrets are properly set for deployment:
   - SUPABASE_URL
   - SUPABASE_ANON_KEY
   - CPANEL_USERNAME
   - CPANEL_PASSWORD
   - CPANEL_URL

## Testing Steps

1. Run the provided mail configuration check script:
   ```
   ./check-mail-config.sh
   ```

2. Use the mail server diagnostic tool to test connections:
   ```
   node mail-server-check.js
   ```

3. Verify the USB wallet integration by:
   - Logging into a premium account on www.snakkaz.com
   - Navigating to the Bitcoin wallet section
   - Checking the "Electrum & USB" tab
   - Ensuring the USB wallet integration component is visible

## Additional Resources

If mail server issues persist:

1. Contact the hosting provider (premium123.web-hosting.com)
2. Have them check:
   - IMAP service status
   - Firewall settings for mail ports (993, 587, 465)
   - SSL certificate validity for mail.snakkaz.com

For deployment verification:
1. Check GitHub Actions execution logs
2. Verify file timestamps on the server after deployment
3. Clear browser cache to ensure you're seeing the latest changes
