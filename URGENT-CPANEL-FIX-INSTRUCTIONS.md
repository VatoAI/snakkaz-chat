# 🚨 URGENT: MANUAL CPANEL SUBDOMAIN FIX

## ⚡ IMMEDIATE ACTION REQUIRED

**Status**: CONFIRMED - All subdomains showing autoindex instead of Snakkaz app
**Solution**: Manual cPanel document root configuration (5 minutes)

## 🔧 EXACT STEPS TO FIX

### 1. Access cPanel
```
URL: https://premium123.web-hosting.com:2083
Username: snakqsqe
Password: [check your .env file]
```

### 2. Navigate to Subdomains
1. Login to cPanel
2. Find **"Subdomains"** in the **"Domains"** section  
3. Click **"Subdomains"**

### 3. Fix Each Subdomain (6 total)
For **EACH** subdomain, change the document root:

#### Current (BROKEN) Configuration:
```
dash.snakkaz.com → /public_html/dash
business.snakkaz.com → /public_html/business  
docs.snakkaz.com → /public_html/docs
analytics.snakkaz.com → /public_html/analytics
mcp.snakkaz.com → /public_html/mcp
help.snakkaz.com → /public_html/help
```

#### Required (WORKING) Configuration:
```
dash.snakkaz.com → /public_html
business.snakkaz.com → /public_html  
docs.snakkaz.com → /public_html
analytics.snakkaz.com → /public_html
mcp.snakkaz.com → /public_html
help.snakkaz.com → /public_html
```

### 4. Configuration Steps (Per Subdomain)
1. In the subdomains list, find the subdomain (e.g., `dash`)
2. Click **"Manage"** or **"Edit"** next to it
3. Change **"Document Root"** from `/public_html/dash` to `/public_html`
4. Click **"Update"** or **"Save"**
5. **Repeat for all 6 subdomains**

## ✅ VERIFICATION COMMANDS

After making the changes, run these to verify:

```bash
# Test each subdomain - should show Snakkaz app
curl -s https://dash.snakkaz.com | head -5
curl -s https://business.snakkaz.com | head -5
curl -s https://docs.snakkaz.com | head -5
curl -s https://analytics.snakkaz.com | head -5
curl -s https://mcp.snakkaz.com | head -5
curl -s https://help.snakkaz.com | head -5
```

**Expected Result**: All should show:
```html
<!DOCTYPE html>
<html lang="no">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/icons/snakkaz-icon-192.png" />
```

## 🎯 SUCCESS CRITERIA

- ✅ No more LiteSpeed autoindex pages
- ✅ All subdomains load Snakkaz Chat application
- ✅ Same content as main domain (snakkaz.com)
- ✅ SSL certificates working (HTTPS)

## ⏱️ TIME ESTIMATE: 5 MINUTES

This is a simple configuration change that will immediately fix the production issue.

## 📞 NEXT STEP

**After completing the cPanel changes**, run the verification script to confirm everything works:

```bash
./check-subdomain-status.sh
```

The infrastructure is 100% ready - only this manual hosting configuration step remains!
