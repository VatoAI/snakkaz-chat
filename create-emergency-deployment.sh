#!/bin/bash
# Emergency Production Deployment Package for SnakkaZ.com
# Fixes: CSP violations, database errors, MCP localhost issues
# Created: $(date)

echo "🚨 CREATING EMERGENCY PRODUCTION DEPLOYMENT PACKAGE"
echo "==================================================="

# Create deployment directory
DEPLOY_DIR="snakkaz-emergency-fix-$(date +%Y%m%d_%H%M%S)"
mkdir -p "$DEPLOY_DIR"

# Copy production files
echo "📦 Copying production files..."
cp -r dist/* "$DEPLOY_DIR/"

# Create deployment documentation
cat > "$DEPLOY_DIR/EMERGENCY-FIX-README.md" << 'EOF'
# SnakkaZ Emergency Production Fix

## Issues Fixed

### 🔒 Content Security Policy (CSP) Violations
- **Problem**: Production site was trying to connect to `localhost:3001` causing CSP violations
- **Fix**: Added environment-aware configuration that disables MCP connections in production
- **Impact**: Eliminates CSP errors, allows app to load properly

### 🗄️ Database Table Errors
- **Problem**: `mcp_connections` table missing causing 404 errors
- **Fix**: Added graceful error handling for missing database tables
- **Impact**: App continues to function even if optional tables are missing

### 📊 Room Query Errors
- **Problem**: Complex room queries with joins causing 400 errors in Supabase
- **Fix**: Simplified room queries with fallback mechanisms  
- **Impact**: Rooms load properly, chat functionality restored

### 🌐 Environment Detection
- **New Feature**: Automatic production/development environment detection
- **Benefit**: Different configurations for different environments
- **Result**: Robust deployment that works in any environment

## Deployment Instructions

### Method 1: cPanel File Manager
1. Go to cPanel → File Manager
2. Navigate to public_html (or your domain folder)
3. Delete all existing files
4. Upload all files from this deployment package
5. Extract if uploaded as zip

### Method 2: FTP/SFTP
1. Connect to your hosting server
2. Navigate to the web root directory
3. Delete existing files (backup first!)
4. Upload all files from this deployment package

### Method 3: Command Line (if available)
```bash
# Backup existing files
cp -r /path/to/webroot /path/to/backup

# Deploy new files
cp -r * /path/to/webroot/

# Set correct permissions
find /path/to/webroot -type f -exec chmod 644 {} \;
find /path/to/webroot -type d -exec chmod 755 {} \;
```

## Verification Steps

After deployment, verify the fix by:

1. **Check Console**: Open browser dev tools, should see no CSP errors
2. **Test Navigation**: Click around the app, no JavaScript errors
3. **Check Network**: All resources should load with 200 status
4. **Test Chat**: Room loading should work without database errors

## Emergency Contact

If issues persist:
- Check browser console for new errors
- Verify all files uploaded correctly
- Ensure .htaccess rules are in place
- Test with different browsers

## Technical Details

- **Build**: Production optimized with Vite
- **Environment**: Automatic detection (production/development)
- **Fallbacks**: Graceful error handling for missing features
- **CSP Compliant**: No localhost connections in production
- **Database Safe**: Handles missing tables gracefully

---
Generated: $(date)
Build: Emergency CSP/Database Fix
Status: Ready for Production Deployment
EOF

# Create .htaccess for proper SPA routing
cat > "$DEPLOY_DIR/.htaccess" << 'EOF'
# SnakkaZ SPA Configuration
RewriteEngine On

# Security Headers
Header always set X-Content-Type-Options nosniff
Header always set X-Frame-Options DENY
Header always set X-XSS-Protection "1; mode=block"
Header always set Referrer-Policy "strict-origin-when-cross-origin"

# Content Security Policy - Updated for production
Header always set Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https://wqpoozpbceucynsojmbk.supabase.co wss://wqpoozpbceucynsojmbk.supabase.co; frame-src 'none'; object-src 'none'; base-uri 'self';"

# Cache Control
<filesMatch "\.(css|jpg|jpeg|png|gif|js|ico|svg)$">
Header set Cache-Control "max-age=31536000, public, immutable"
</filesMatch>

<filesMatch "\.(html)$">
Header set Cache-Control "no-cache, no-store, must-revalidate"
</filesMatch>

# SPA Routing - Handle all routes through index.html
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteCond %{REQUEST_URI} !^/api/
RewriteRule ^(.*)$ /index.html [QSA,L]

# Compression
<IfModule mod_deflate.c>
    AddOutputFilterByType DEFLATE text/plain
    AddOutputFilterByType DEFLATE text/html
    AddOutputFilterByType DEFLATE text/xml
    AddOutputFilterByType DEFLATE text/css
    AddOutputFilterByType DEFLATE application/xml
    AddOutputFilterByType DEFLATE application/xhtml+xml
    AddOutputFilterByType DEFLATE application/rss+xml
    AddOutputFilterByType DEFLATE application/javascript
    AddOutputFilterByType DEFLATE application/x-javascript
</IfModule>

# Error Pages
ErrorDocument 404 /index.html
EOF

# Create deployment summary
cat > "$DEPLOY_DIR/DEPLOYMENT-SUMMARY.txt" << EOF
SNAKKAZ EMERGENCY PRODUCTION FIX
===============================
Date: $(date)
Build: $(ls -la dist/assets/js/index-*.js | head -1 | awk '{print $9}' | sed 's/.*index-\(.*\)\.js/\1/')

CRITICAL FIXES APPLIED:
✅ CSP Violations Fixed (localhost:3001 disabled in production)
✅ Database Errors Handled (graceful fallbacks for missing tables)
✅ Room Query Errors Fixed (simplified database queries)
✅ Environment Detection Added (automatic prod/dev switching)
✅ Updated Security Headers (.htaccess)

FILES INCLUDED:
$(find "$DEPLOY_DIR" -type f | wc -l) files total
- index.html (main app entry point)
- assets/css/ (stylesheets with professional design)
- assets/js/ (JavaScript bundles)
- icons/ (PWA icons)
- .htaccess (server configuration)
- Documentation and deployment guides

DEPLOYMENT STATUS: READY FOR PRODUCTION
URGENCY: HIGH (Live site currently broken)

DEPLOYMENT CHECKLIST:
□ Backup existing production files
□ Upload all files from this package
□ Verify .htaccess is in place
□ Test site loading and console errors
□ Verify chat functionality works
□ Check mobile responsiveness

EXPECTED RESULT:
- Site loads without CSP errors
- Professional design displays correctly  
- Chat rooms load and function
- No JavaScript console errors
- Mobile-friendly responsive design
EOF

# Create compressed archive
echo "🗜️ Creating compressed deployment archive..."
tar -czf "${DEPLOY_DIR}.tar.gz" "$DEPLOY_DIR"
zip -r "${DEPLOY_DIR}.zip" "$DEPLOY_DIR" > /dev/null

# File verification
echo "📋 Deployment package verification:"
echo "=================================="
echo "📁 Directory: $DEPLOY_DIR"
echo "📊 Total files: $(find "$DEPLOY_DIR" -type f | wc -l)"
echo "💾 Directory size: $(du -sh "$DEPLOY_DIR" | cut -f1)"
echo "🗜️ Compressed (.tar.gz): $(ls -lh "${DEPLOY_DIR}.tar.gz" | awk '{print $5}')"
echo "📦 Compressed (.zip): $(ls -lh "${DEPLOY_DIR}.zip" | awk '{print $5}')"
echo ""
echo "📄 Key files present:"
ls -la "$DEPLOY_DIR"/ | grep -E '\.(html|htaccess)$'
echo ""
echo "🎯 Assets summary:"
echo "CSS files: $(find "$DEPLOY_DIR/assets/css" -name '*.css' 2>/dev/null | wc -l)"
echo "JS files: $(find "$DEPLOY_DIR/assets/js" -name '*.js' 2>/dev/null | wc -l)"
echo "Icons: $(find "$DEPLOY_DIR/icons" -name '*.png' 2>/dev/null | wc -l)"

echo ""
echo "🚀 EMERGENCY DEPLOYMENT PACKAGE READY!"
echo "======================================"
echo "Choose your deployment method:"
echo "1. Upload $DEPLOY_DIR folder contents via cPanel/FTP"
echo "2. Upload ${DEPLOY_DIR}.zip and extract on server"
echo "3. Use ${DEPLOY_DIR}.tar.gz for command-line deployment"
echo ""
echo "⚠️  CRITICAL: This fixes live production issues!"
echo "🎯 Deploy immediately to resolve snakkaz.com errors"
EOF
