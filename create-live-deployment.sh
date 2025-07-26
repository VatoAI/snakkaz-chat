#!/bin/bash

# 🚀 SNAKKAZ LIVE DEPLOYMENT SCRIPT
# Deploy to snakkaz.com + mcp.snakkaz.com
# Norwegian Enterprise Excellence - LIVE!

echo "🇳🇴 SNAKKAZ LIVE DEPLOYMENT STARTER!"
echo "======================================"

# Create deployment directory
mkdir -p snakkaz-live-deployment
cd snakkaz-live-deployment

echo "📁 Creating deployment packages..."

# 1. BUILD FRONTEND FOR PRODUCTION
echo "🏗️  Building frontend..."
cd ..
npm run build

# 2. CREATE MAIN SITE PACKAGE (public_html)
echo "📦 Creating main site package..."
mkdir -p snakkaz-live-deployment/public_html
cp -r dist/* snakkaz-live-deployment/public_html/

# Add custom .htaccess for snakkaz.com
cat > snakkaz-live-deployment/public_html/.htaccess << 'EOF'
# SNAKKAZ.COM - PRODUCTION HTACCESS
# Norwegian Enterprise Chat Platform

# Force HTTPS
RewriteEngine On
RewriteCond %{HTTPS} off
RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]

# Handle React Router (SPA)
Options -MultiViews
RewriteEngine On
RewriteCond %{REQUEST_FILENAME} !-f
RewriteRule ^ index.html [QSA,L]

# Security Headers
Header always set X-Content-Type-Options nosniff
Header always set X-Frame-Options DENY
Header always set X-XSS-Protection "1; mode=block"
Header always set Strict-Transport-Security "max-age=31536000; includeSubDomains"
Header always set Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; connect-src 'self' https://api.snakkaz.com https://mcp.snakkaz.com wss: https:"

# Gzip Compression
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

# Cache Control
<IfModule mod_expires.c>
    ExpiresActive on
    ExpiresByType text/css "access plus 1 year"
    ExpiresByType application/javascript "access plus 1 year"
    ExpiresByType image/png "access plus 1 year"
    ExpiresByType image/jpg "access plus 1 year"
    ExpiresByType image/jpeg "access plus 1 year"
    ExpiresByType image/gif "access plus 1 year"
    ExpiresByType image/svg+xml "access plus 1 year"
</IfModule>
EOF

# 3. CREATE MCP SUBDOMAIN PACKAGE
echo "🔌 Creating MCP subdomain package..."
mkdir -p snakkaz-live-deployment/mcp_subdomain

# Copy MCP server files
cp -r mcp-deployment/* snakkaz-live-deployment/mcp_subdomain/

# Create startup script for MCP
cat > snakkaz-live-deployment/mcp_subdomain/start-mcp.sh << 'EOF'
#!/bin/bash
# SNAKKAZ MCP SERVER STARTUP SCRIPT
# Run this in cPanel Terminal

echo "🚀 Starting SnakkaZ MCP Server..."

# Kill any existing processes
pkill -f "mcp-cors-server.js" 2>/dev/null || true

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

# Start MCP server in background
echo "🔌 Starting MCP CORS server..."
nohup node mcp-cors-server.js > mcp-server.log 2>&1 &

echo "✅ MCP Server started! Check mcp-server.log for status"
echo "🌐 Server running on: https://mcp.snakkaz.com"

# Show process
ps aux | grep mcp-cors-server | grep -v grep
EOF

chmod +x snakkaz-live-deployment/mcp_subdomain/start-mcp.sh

# 4. CREATE DEPLOYMENT ZIP FILES
echo "📦 Creating ZIP packages..."

# Main site ZIP
cd snakkaz-live-deployment
zip -r snakkaz-main-site.zip public_html/
echo "✅ Created: snakkaz-main-site.zip (for public_html)"

# MCP subdomain ZIP  
zip -r snakkaz-mcp-subdomain.zip mcp_subdomain/
echo "✅ Created: snakkaz-mcp-subdomain.zip (for mcp.snakkaz.com)"

# 5. CREATE DEPLOYMENT GUIDE
cat > CPANEL-DEPLOYMENT-GUIDE.md << 'EOF'
# 🚀 SNAKKAZ CPANEL DEPLOYMENT GUIDE
**Norwegian Enterprise Excellence - LIVE DEPLOYMENT**

## 📋 DEPLOYMENT CHECKLIST

### **STEP 1: DOMAIN SETUP**
1. **Main Domain**: snakkaz.com + www.snakkaz.com
2. **MCP Subdomain**: mcp.snakkaz.com
3. **SSL Certificates**: Enable for both domains

### **STEP 2: UPLOAD MAIN SITE**
1. **File**: `snakkaz-main-site.zip`
2. **Destination**: `/public_html/` (root of snakkaz.com)
3. **Action**: Extract ZIP in public_html folder
4. **Result**: Frontend accessible at https://snakkaz.com

```
cPanel File Manager:
public_html/
├── index.html
├── assets/
├── .htaccess
└── [all frontend files]
```

### **STEP 3: SETUP MCP SUBDOMAIN**  
1. **Create Subdomain**: mcp.snakkaz.com
2. **File**: `snakkaz-mcp-subdomain.zip`
3. **Destination**: `/mcp.snakkaz.com/` (subdomain root)
4. **Extract**: ZIP in subdomain folder

```
mcp.snakkaz.com/
├── mcp-cors-server.js
├── package.json
├── start-mcp.sh
└── api/
```

### **STEP 4: START MCP SERVER**
1. **cPanel Terminal**: Access terminal
2. **Navigate**: `cd /home/[user]/mcp.snakkaz.com/`
3. **Install**: `npm install`
4. **Start**: `./start-mcp.sh`
5. **Verify**: `curl https://mcp.snakkaz.com/api/health`

### **STEP 5: DOMAIN CONFIGURATION**

#### **DNS Settings:**
```
A Record: snakkaz.com → [Server IP]
A Record: www.snakkaz.com → [Server IP]  
A Record: mcp.snakkaz.com → [Server IP]
```

#### **SSL/HTTPS:**
- Enable SSL for snakkaz.com
- Enable SSL for www.snakkaz.com
- Enable SSL for mcp.snakkaz.com

### **STEP 6: VERIFY DEPLOYMENT**

#### **Main Site Test:**
```bash
curl https://snakkaz.com
curl https://www.snakkaz.com
```

#### **MCP Server Test:**
```bash
curl https://mcp.snakkaz.com/api/health
curl https://mcp.snakkaz.com/api/mcp/status
```

#### **Full Integration Test:**
```bash
curl -X POST https://mcp.snakkaz.com/api/chat \
  -H "Content-Type: application/json" \
  -H "Origin: https://snakkaz.com" \
  -d '{"message":"Live test from snakkaz.com"}'
```

## 🎯 **EXPECTED RESULTS**

### **https://snakkaz.com**
- ✅ Frontend loads perfectly
- ✅ React app routing works
- ✅ All assets load (CSS, JS, images)
- ✅ Performance: Grade A metrics

### **https://mcp.snakkaz.com**  
- ✅ MCP server responds to /api/health
- ✅ CORS configured for snakkaz.com
- ✅ Chat API processes messages
- ✅ Full MCP integration active

## 🛠️ **TROUBLESHOOTING**

### **If Main Site Not Loading:**
1. Check .htaccess syntax
2. Verify file permissions (755 for folders, 644 for files)
3. Check SSL certificate status
4. Verify domain DNS propagation

### **If MCP Server Not Starting:**
1. Check Node.js version: `node --version`
2. Install dependencies: `npm install`
3. Check port availability: `netstat -tulpn | grep 3000`
4. View logs: `cat mcp-server.log`

### **If CORS Errors:**
1. Verify domain in mcp-cors-server.js
2. Check SSL on both domains
3. Test with curl first
4. Check browser console for errors

## 🎉 **SUCCESS VERIFICATION**

When everything works:
- ✅ https://snakkaz.com loads the chat interface
- ✅ https://mcp.snakkaz.com/api/health returns healthy status
- ✅ Chat messages send successfully through MCP
- ✅ No CORS errors in browser console
- ✅ SSL certificates active on both domains

## 🇳🇴 **SNAKKAZ LIVE - NORWEGIAN TECH EXCELLENCE!**

**Gratulerer! SnakkaZ er nå live på internett! 🚀**
EOF

echo "📋 Created: CPANEL-DEPLOYMENT-GUIDE.md"

# 6. CREATE QUICK START SCRIPT
cat > QUICK-DEPLOY.sh << 'EOF'
#!/bin/bash
echo "🚀 SNAKKAZ QUICK DEPLOY TO CPANEL"
echo "================================="
echo ""
echo "📁 Files ready for upload:"
echo "1. snakkaz-main-site.zip → Upload to public_html"
echo "2. snakkaz-mcp-subdomain.zip → Upload to mcp.snakkaz.com"
echo ""
echo "📋 Next steps:"
echo "1. Create subdomain: mcp.snakkaz.com"  
echo "2. Upload and extract ZIP files"
echo "3. Run: cd mcp.snakkaz.com && ./start-mcp.sh"
echo "4. Test: curl https://mcp.snakkaz.com/api/health"
echo ""
echo "🇳🇴 SnakkaZ will be LIVE! 🚀"
EOF

chmod +x QUICK-DEPLOY.sh

cd ..

echo ""
echo "🎉 DEPLOYMENT PACKAGES READY!"
echo "=============================="
echo ""
echo "📦 Created files in snakkaz-live-deployment/:"
echo "  ✅ snakkaz-main-site.zip (Upload to public_html)"
echo "  ✅ snakkaz-mcp-subdomain.zip (Upload to mcp.snakkaz.com)"
echo "  ✅ CPANEL-DEPLOYMENT-GUIDE.md (Step-by-step guide)"
echo "  ✅ QUICK-DEPLOY.sh (Quick reference)"
echo ""
echo "🚀 Ready for LIVE deployment to snakkaz.com!"
echo "🇳🇴 Norwegian Enterprise Excellence - LIVE ON INTERNET!"
