# Snakkaz Chat Deployment Troubleshooting Guide

This guide contains solutions for common issues that may occur during or after deployment of the Snakkaz Chat application.

## Connection Issues

### FTP Upload Fails

**Symptoms:**
- FTP connection timeout
- Permission denied errors
- Incomplete file transfers

**Solutions:**
1. **Check IP restrictions**
   ```bash
   # Run this script to test for IP restrictions
   ./find-ftp-ip-restrictions.sh
   ```

2. **Try alternative upload methods**
   ```bash
   # Try the cPanel API token method
   ./deploy-with-cpanel-api-token.sh
   ```

3. **Use passive mode for FTP**
   ```bash
   # In your FTP client or script, enable passive mode
   lftp -e "set ftp:passive-mode on" -u username,password ftp.example.com
   ```

### cPanel API Connection Issues

**Symptoms:**
- "Authentication failed" errors
- API errors about invalid tokens

**Solutions:**
1. **Verify the API token is still valid**
   - Check expiration date in cPanel > Security > Manage API Tokens
   - Regenerate if necessary

2. **Ensure the API token has sufficient permissions**
   - Should have at least File Manager access

3. **Check hostname is correct**
   - Use the full hostname (e.g. `premium123.web-hosting.com`)

## Application Loading Issues

### Blank Page After Deployment

**Symptoms:**
- Browser shows a blank page
- No visible errors on screen

**Solutions:**
1. **Check browser console for errors (F12 > Console)**
   - Look for 404 errors indicating missing files
   - Check for JavaScript errors preventing app initialization

2. **Verify .htaccess configuration**
   ```apache
   # Minimum required htaccess for SPA routing
   <IfModule mod_rewrite.c>
     RewriteEngine On
     RewriteBase /
     RewriteRule ^index\.html$ - [L]
     RewriteCond %{REQUEST_FILENAME} !-f
     RewriteCond %{REQUEST_FILENAME} !-d
     RewriteRule . /index.html [L]
   </IfModule>
   ```

3. **Check file permissions**
   ```bash
   # Files should be 644
   find /path/to/public_html -type f -exec chmod 644 {} \;
   
   # Directories should be 755
   find /path/to/public_html -type d -exec chmod 755 {} \;
   ```

### MIME Type Issues

**Symptoms:**
- Console errors about incorrect MIME types
- JavaScript or WebAssembly files not loading

**Solutions:**
1. **Add explicit MIME types in .htaccess**
   ```apache
   # Set proper MIME types
   AddType application/javascript .js
   AddType application/json .json
   AddType text/css .css
   AddType application/wasm .wasm
   ```

2. **Run the MIME type fix script**
   ```bash
   ./add-mime-type-fixes-to-all-in-one.sh
   ```

## Service Worker Issues

### Service Worker Not Registering

**Symptoms:**
- Console errors about service worker registration
- Offline functionality not working

**Solutions:**
1. **Verify service worker is in the correct location**
   - Should be in the root directory (public_html)
   
2. **Check scope issues**
   ```javascript
   // In browser console, run:
   navigator.serviceWorker.getRegistrations()
     .then(registrations => console.log(registrations));
   ```

3. **Manually unregister and re-register**
   ```javascript
   // In browser console, run:
   navigator.serviceWorker.getRegistrations()
     .then(registrations => {
       for(let registration of registrations) {
         registration.unregister();
       }
     });
   ```

### Service Worker Caching Issues

**Symptoms:**
- Old content being served after updates
- Changes not appearing after deployment

**Solutions:**
1. **Force update in browser**
   ```javascript
   // In browser console, run:
   navigator.serviceWorker.getRegistrations()
     .then(registrations => {
       for(let registration of registrations) {
         registration.update();
       }
     });
   ```

2. **Clear browser cache**
   - Chrome: Settings > Privacy and Security > Clear Browsing Data
   - Firefox: Settings > Privacy & Security > Cookies and Site Data > Clear Data

## Authentication Issues

### Supabase Connection Problems

**Symptoms:**
- "Failed to connect to Supabase" errors
- Authentication fails even with correct credentials

**Solutions:**
1. **Verify Supabase URL and API key**
   - Check environment variables are correctly set
   - Look for typos in the URL or API key

2. **Check for CORS issues**
   - Ensure your domain is allowed in Supabase dashboard
   - Add appropriate CORS headers in Supabase settings

3. **Test direct API connection**
   ```javascript
   // In browser console, run:
   fetch('YOUR_SUPABASE_URL/auth/v1/user', {
     headers: {
       'apikey': 'YOUR_SUPABASE_KEY',
       'Authorization': 'Bearer TOKEN_IF_AVAILABLE'
     }
   }).then(r => r.json()).then(console.log);
   ```

## Content Security Policy Issues

### CSP Blocking Resources

**Symptoms:**
- Console errors about blocked resources due to CSP
- Images, scripts, or styles not loading

**Solutions:**
1. **Review current CSP headers**
   ```bash
   curl -I https://your-site.com | grep -i content-security-policy
   ```

2. **Add missing directives to CSP**
   - Update the `simplifiedCspConfig.ts` file
   - Redeploy with the updated configuration

3. **Use the emergency CSP fix**
   ```bash
   ./fix-csp-warnings.sh
   ```

## General Troubleshooting Steps

1. **Enable verbose logging**
   - Temporarily modify code to increase logging
   - Use browser developer tools to monitor requests and responses

2. **Check server logs**
   - Access cPanel > Logs > Error Log
   - Look for 500 server errors or PHP errors

3. **Validate application build**
   - Rebuild locally and test before deploying
   - Use different browsers to identify browser-specific issues

4. **Revert to known working version**
   - Keep a backup of the previous working version
   - Be ready to quickly revert if critical issues arise

## Getting Additional Help

If you continue experiencing issues after trying these troubleshooting steps:

1. Submit detailed error information to support
2. Include browser console logs and network request data
3. Specify the exact steps to reproduce the issue
4. Note your hosting environment details (provider, platform version)
