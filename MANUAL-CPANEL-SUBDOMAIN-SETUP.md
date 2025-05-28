# 🎯 MANUAL cPANEL SUBDOMAIN CONFIGURATION - May 28, 2025

## ⚠️ API EXTRACTION FAILED - PROCEED WITH MANUAL SETUP

**Status**: All cPanel API methods returned 403 Access Denied
**Solution**: Manual subdomain configuration via cPanel interface

## 🔧 STEP-BY-STEP MANUAL CONFIGURATION

### 1. Access cPanel
- URL: `https://premium123.web-hosting.com:2083`
- Username: `snakqsqe`
- Password: `[from .env file]`

### 2. Navigate to Subdomains Section
1. Log into cPanel
2. Find **"Subdomains"** in the **"Domains"** section
3. Click on **"Subdomains"**

### 3. Configure Each Subdomain Document Root

For **EACH** of these subdomains, set the document root to `/public_html`:

#### ✅ Required Subdomain Configurations:
```
dash.snakkaz.com → Document Root: /public_html
business.snakkaz.com → Document Root: /public_html  
docs.snakkaz.com → Document Root: /public_html
analytics.snakkaz.com → Document Root: /public_html
mcp.snakkaz.com → Document Root: /public_html
help.snakkaz.com → Document Root: /public_html
```

### 4. Manual Configuration Steps (Per Subdomain)
1. In the subdomains list, find the subdomain (e.g., `dash`)
2. Click **"Manage"** or **"Edit"** next to it
3. Change **"Document Root"** from `/public_html/dash` to `/public_html`
4. Click **"Update"** or **"Save"**
5. Repeat for all 6 subdomains

## 🧪 VERIFICATION AFTER CONFIGURATION

Run these commands to verify the setup works:

```bash
# Test main domain
curl -I https://www.snakkaz.com

# Test each subdomain 
curl -I https://dash.snakkaz.com
curl -I https://business.snakkaz.com
curl -I https://docs.snakkaz.com
curl -I https://analytics.snakkaz.com
curl -I https://mcp.snakkaz.com
curl -I https://help.snakkaz.com
```

**Expected Result**: All should return HTTP 200 and load the Snakkaz Chat application

## 🎯 SUCCESS CRITERIA

- ✅ All subdomains load the main Snakkaz application
- ✅ No more Apache/LiteSpeed autoindex pages
- ✅ SSL certificates working (HTTPS)
- ✅ Application routes correctly based on subdomain

## 🔄 ALTERNATIVE: CLIENT-SIDE SUBDOMAIN DETECTION

If manual cPanel configuration is not possible, implement this JavaScript solution:

```javascript
// Add to main application
const subdomain = window.location.hostname.split('.')[0];
switch(subdomain) {
  case 'dash': 
    // Load dashboard interface
    break;
  case 'business':
    // Load business features  
    break;
  case 'docs':
    // Load documentation
    break;
  // ... etc
}
```

## 📞 NEXT STEPS

1. **IMMEDIATE**: Try manual cPanel subdomain configuration
2. **IF SUCCESSFUL**: Verify all subdomain routes work
3. **IF BLOCKED**: Contact hosting support about subdomain document root permissions
4. **FALLBACK**: Implement client-side subdomain detection

The infrastructure is 100% ready - only this hosting configuration step remains!
