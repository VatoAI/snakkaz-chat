# 🚨 MANUAL DEPLOYMENT GUIDE - EMERGENCY PRODUCTION FIX

## Summary
Fixed both critical issues:
1. ✅ **CAPTCHA Multi-digit Support** - Code fixed locally  
2. ✅ **Asset Files Ready** - Fresh build with correct hashes generated

## 📋 Manual Deployment Steps

Since automated deployment requires `lftp`, here's the manual process:

### Step 1: Download Built Files
The following files are ready in `/workspaces/snakkaz-chat/dist/`:

**Main Files:**
- `index.html` → Upload to root directory  
- `favicon.ico` → Upload to root directory

**CSS Assets:**
- `dist/assets/css/index-F5gxOYLI.css` → Upload to `assets/css/index-F5gxOYLI.css`

**JS Assets (upload all to `assets/js/`):**
- `app-services-BPA8dEMp.js`
- `app-utils-B-H4HVmM.js`  
- `components-ui-NGJhWGjo.js`
- `index-lYK_Wwju.js`
- `pages-auth-D-hVjKl0.js`
- `pages-chat-Dl1Ad3Kg.js`
- `pages-main-D4WYKyBJ.js`
- `vendor-database-CObNcoXU.js`
- `vendor-forms-C6h4g6AS.js`
- `vendor-media-special-DkxvLs-W.js`
- `vendor-misc-BZK5ivf1.js`
- `vendor-network-BSBq6A-N.js`
- `vendor-react-core-CXjOJsF6.js`
- `vendor-react-dom-BvQA5k-C.js`
- `vendor-router-CB_lAHnL.js`
- `vendor-security-LdHy7Pt9.js`
- `vendor-utils-CDGg_kJ1.js`

### Step 2: Create .htaccess File
Upload this content as `.htaccess` in the root directory:

```apache
# SnakkaZ Production .htaccess
# Fixed MIME types and asset serving

# Enable rewrite engine
RewriteEngine On

# Fix MIME types for CSS and JS
<FilesMatch "\.(css)$">
    ForceType text/css
</FilesMatch>

<FilesMatch "\.(js)$">
    ForceType application/javascript
</FilesMatch>

<FilesMatch "\.(mjs)$">
    ForceType application/javascript
</FilesMatch>

# Enable compression
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

# Cache static assets
<IfModule mod_expires.c>
    ExpiresActive On
    ExpiresByType text/css "access plus 1 month"
    ExpiresByType application/javascript "access plus 1 month"
    ExpiresByType image/png "access plus 1 month"
    ExpiresByType image/jpg "access plus 1 month"
    ExpiresByType image/jpeg "access plus 1 month"
    ExpiresByType image/gif "access plus 1 month"
    ExpiresByType image/svg+xml "access plus 1 month"
</IfModule>

# SPA routing - redirect all requests to index.html
<IfModule mod_rewrite.c>
    # Handle Angular and Vue.js router
    RewriteCond %{REQUEST_FILENAME} !-f
    RewriteCond %{REQUEST_FILENAME} !-d
    RewriteCond %{REQUEST_URI} !^/api/
    RewriteRule . /index.html [L]
</IfModule>

# Security headers
<IfModule mod_headers.c>
    Header always set X-Frame-Options "SAMEORIGIN"
    Header always set X-Content-Type-Options "nosniff"
    Header always set Referrer-Policy "strict-origin-when-cross-origin"
</IfModule>
```

### Step 3: Alternative - ZIP for Easy Upload
