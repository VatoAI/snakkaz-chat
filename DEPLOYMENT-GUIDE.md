# 🚀 Snakkaz Chat Subdomain Deployment Guide

## Current Status ✅
- **Main domain**: ✅ www.snakkaz.com - Snakkaz Chat app running perfectly
- **All subdomains**: 📁 Showing directory listing (need file deployment)

## What We've Prepared 📦

All deployment packages are ready in `/workspaces/snakkaz-chat/deployment-packages/`:

```
✅ dash-snakkaz-deployment.zip (12MB)
✅ business-snakkaz-deployment.zip (12MB) 
✅ docs-snakkaz-deployment.zip (12MB)
✅ analytics-snakkaz-deployment.zip (12MB)
✅ mcp-snakkaz-deployment.zip (12MB)
✅ help-snakkaz-deployment.zip (12MB)
```

Each package contains:
- Complete React app (18 files)
- Subdomain-specific .htaccess for SPA routing
- All assets, images, and JavaScript bundles
- Service workers and manifest files

## Deployment Methods 🛠️

### Method 1: cPanel File Manager (Recommended)
1. **Login to cPanel** at your hosting provider
2. **Open File Manager**
3. **Navigate to each subdomain directory**:
   - `/public_html/dash/`
   - `/public_html/business/`
   - `/public_html/docs/`
   - `/public_html/analytics/`
   - `/public_html/mcp/`
   - `/public_html/help/`

4. **For each subdomain**:
   - Delete all existing files (keep cgi-bin folder if present)
   - Upload the corresponding ZIP file
   - Extract the ZIP file
   - Move all files from the extracted folder to the subdomain root
   - Ensure `.htaccess` file is present and visible

### Method 2: FTP Client (FileZilla, WinSCP, etc.)
```
Host: ftp.snakkaz.com
Username: @snakkaz.com
Password: [Your FTP password]
```

Upload to directories:
- `/public_html/dash/` ← dash-snakkaz-deployment.zip contents
- `/public_html/business/` ← business-snakkaz-deployment.zip contents
- `/public_html/docs/` ← docs-snakkaz-deployment.zip contents
- `/public_html/analytics/` ← analytics-snakkaz-deployment.zip contents
- `/public_html/mcp/` ← mcp-snakkaz-deployment.zip contents
- `/public_html/help/` ← help-snakkaz-deployment.zip contents

### Method 3: Automated Script (If FTP works)
```bash
./deploy-via-ftp.sh
```

## Critical Files to Verify 🔍

After deployment, ensure each subdomain directory contains:

```
📁 subdomain-directory/
├── 📄 index.html (2.6KB - React app entry point)
├── 📄 .htaccess (893 bytes - SPA routing rules)
├── 📁 assets/ (Contains CSS/JS bundles)
│   └── 📄 index-[hash].js (Main React bundle)
├── 📄 manifest.json (PWA configuration)
├── 📄 service-worker.js (Offline functionality)
├── 📁 icons/ (App icons)
├── 📁 images/ (Static images)
└── ... (other React app files)
```

## Expected Result 🎯

After successful deployment:

```
🏠 www.snakkaz.com → Snakkaz Chat (main app)
🌐 dash.snakkaz.com → Snakkaz Chat (dashboard mode)
🌐 business.snakkaz.com → Snakkaz Chat (business mode)
🌐 docs.snakkaz.com → Snakkaz Chat (docs mode)
🌐 analytics.snakkaz.com → Snakkaz Chat (analytics mode)
🌐 mcp.snakkaz.com → Snakkaz Chat (MCP mode)
🌐 help.snakkaz.com → Snakkaz Chat (help mode)
```

## Verification 🧪

Run this command to check status:
```bash
node quick-test.cjs
```

Expected output:
```
📊 Summary:
   Responding: 6/6
   With Snakkaz app: 6/6

🎉 ALL PERFECT! All subdomains serving Snakkaz app!
```

## Subdomain Features 🎨

Once deployed, each subdomain will:
- Show the complete Snakkaz Chat app
- Display subdomain-specific page titles
- Log subdomain detection in browser console
- Store subdomain context in sessionStorage
- Handle React Router navigation properly

## Troubleshooting 🔧

If subdomains still show directory listing:
1. ✅ Verify `.htaccess` file exists and has correct content
2. ✅ Check `index.html` is in subdomain root (not in subfolder)
3. ✅ Ensure file permissions are correct (644 for files, 755 for folders)
4. ✅ Clear browser cache and test in incognito mode

## Next Steps After Deployment 🚀

1. **Test subdomain functionality** - Visit each subdomain and verify app loads
2. **Check browser console** - Should see subdomain detection messages
3. **Verify document titles** - Each subdomain should show specific titles
4. **Test SPA routing** - Navigation should work without page refreshes

## Files Ready for Download 📥

All deployment packages are located in:
`/workspaces/snakkaz-chat/deployment-packages/`

Download these 6 ZIP files and deploy them to your hosting provider! 🚀

---

**Status**: ✅ Code complete, packages ready, deployment pending
**Next**: Upload ZIP files to hosting provider subdomain directories
