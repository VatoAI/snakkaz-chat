# Snakkaz Chat Migration: Final Steps

This document provides the final steps needed to complete the Snakkaz Chat migration from Cloudflare to Namecheap hosting. These steps should be performed in the specific order listed to ensure a smooth transition.

## Completed Fixes

### SSL Configuration
✅ Ran `configure-ssl-namecheap.sh` script on May 18, 2025
✅ Selected Namecheap AutoSSL as the SSL solution
✅ Added HTTPS redirection rules to .htaccess
✅ Created SSL configuration documentation in `docs/SSL-CONFIGURATION.md`

### Multiple Supabase Client Fix
✅ Ran `fix-multiple-supabase-client.sh` script on May 18, 2025
✅ Implemented Singleton pattern in `src/lib/supabaseClient.ts`
✅ Updated 7 files that were creating their own client instances
✅ Updated `supabasePatch.ts` to use the singleton client
✅ Created documentation in `docs/SUPABASE-SINGLETON-PATTERN.md`
✅ Built the application successfully with the changes

## 1. Verify File Upload

All files have been uploaded to the Namecheap server, but there are a few steps needed to complete the process:

### 1.1 Extract assets.zip

1. Log in to Namecheap cPanel
2. Open the File Manager
3. Navigate to `public_html`
4. Find the `assets.zip` file
5. Right-click on it and select "Extract"
6. Make sure it extracts to `public_html/assets/`
7. After extraction, you can delete the zip file to save space

### 1.2 Verify Subdomain Directories

Ensure all subdomain directories exist on the server with proper files:
- `public_html/dash/`
- `public_html/business/`
- `public_html/docs/`
- `public_html/analytics/`
- `public_html/mcp/`
- `public_html/help/`

Each subdomain should have:
- An `index.html` file
- A `.htaccess` file

## 2. Install SSL Certificates

SSL certificates are essential for security and proper functioning of the chat application.

### 2.1 Using Namecheap's AutoSSL (Recommended)

1. Log in to Namecheap cPanel
2. Navigate to `SSL/TLS` → `SSL/TLS Status`
3. Click on "Run AutoSSL" to automatically install certificates for all domains
4. Wait for the process to complete (this may take a few minutes)
5. Verify that all domains show "Valid" status

### 2.2 Using Let's Encrypt (Alternative)

If AutoSSL doesn't work correctly, you can use Let's Encrypt:

1. In cPanel, go to `SSL/TLS` → `Let's Encrypt SSL`
2. Select all domains and subdomains
3. Click "Issue" to generate certificates
4. Wait for the process to complete
5. Verify installation

### 2.3 Enable HTTPS Redirect

After SSL certificates are installed:

1. Open File Manager in cPanel
2. Navigate to `public_html`
3. Edit the `.htaccess` file
4. Uncomment the HTTPS redirect lines:
   ```
   # Redirect HTTP to HTTPS
   RewriteCond %{HTTPS} off
   RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]
   ```
5. Save the file

## 3. Test Application Functionality

Thorough testing is required to ensure the application works correctly.

### 3.1 Basic Access Testing

1. Visit the main site: `https://www.snakkaz.com`
2. Check that the site loads without errors
3. Visit each subdomain to ensure they load properly:
   - `https://dash.snakkaz.com`
   - `https://business.snakkaz.com`
   - `https://docs.snakkaz.com`
   - `https://analytics.snakkaz.com`
   - `https://mcp.snakkaz.com`
   - `https://help.snakkaz.com`

### 3.2 Authentication Testing

1. Create a new test account
2. Log out and log back in
3. Test password reset functionality
4. Verify that session persistence works correctly

### 3.3 Chat Functionality Testing

1. Create a new chat conversation
2. Send and receive messages
3. Test file uploading and sharing
4. Create a group chat
5. Test end-to-end encryption by verifying message storage

### 3.4 Technical Testing

1. Open browser developer tools
2. Check for any console errors
3. Verify that SSL is properly configured (no mixed content warnings)
4. Check network requests to ensure they're going to the correct domains

### 3.5 Supabase Client Issue

1. Open browser developer tools
2. Check for any "Multiple GoTrueClient instances" warnings in the console
3. Verify Supabase authentication works correctly
4. Test all Supabase-dependent features (chat, profiles, groups)
5. If issues persist, check `docs/SUPABASE-SINGLETON-PATTERN.md` for troubleshooting

### 3.6 SSL Certificate Verification

1. Check that all pages load with HTTPS
2. Verify there are no mixed content warnings
3. Check the SSL certificate details in the browser
4. Test that HTTPS redirect works properly
5. If issues persist, check `docs/SSL-CONFIGURATION.md` for troubleshooting

## 4. Implement Security Recommendations

Based on the security evaluation, implement these improvements:

1. Ensure all security headers are properly set in `.htaccess`
2. Configure rate limiting to prevent abuse
3. Set up brute force protection for login pages
4. Implement IP blocking for suspicious activity

## 5. Update DNS TTL Settings

After confirming everything works:

1. Log in to Namecheap domain management
2. Set DNS TTL values to 3600 (1 hour) or lower
3. This ensures faster propagation if any DNS changes are needed

## 6. Monitor Application Performance

Set up monitoring to track application performance:

1. Configure uptime monitoring with a service like UptimeRobot
2. Set up performance monitoring with tools like New Relic or Pingdom
3. Create alerts for any downtime or performance issues

## 7. Update Documentation

After all steps are completed:

1. Update `MIGRATION-FINAL-STATUS.md` to mark all items as completed
2. Create a final migration report documenting what was done
3. Update the internal documentation with the new server information

## 8. Backup Configuration

Create backups of all critical configuration:

1. Export DNS settings from Namecheap
2. Backup all `.htaccess` files
3. Export SSL certificates and keep them in a secure location
4. Document all server settings and configurations

## Support Contacts

If you encounter any issues during these final steps:

- Technical Support: support@snakkaz.com
- Namecheap Support: https://www.namecheap.com/support/
- Supabase Support: https://supabase.com/support

Remember to follow these steps in order to ensure a smooth transition. Good luck with the final migration steps!
