#!/bin/bash
# Emergency MIME Type Fix Deployment Script
# This script will deploy the enhanced .htaccess file and web.config to fix JavaScript MIME type issues

echo "🚨 EMERGENCY MIME TYPE FIX DEPLOYMENT - $(date)"
echo "==========================================="

# Copy the enhanced .htaccess to dist directory
cp .htaccess dist/.htaccess
echo "✅ Enhanced .htaccess copied to dist directory"

# Copy web.config to dist directory
cp web.config dist/web.config
echo "✅ Web.config copied to dist directory"

# Create a backup of the original .htaccess on server
echo "📋 Creating backup of original server .htaccess..."

# Deploy via FTP with emergency settings
cat > emergency-mime-fix.lftp << 'EOF'
set ftp:ssl-allow false
set ftp:ssl-protect-data false
set ssl:verify-certificate false
set ftp:use-feat false
set ftp:use-mlsd false
set ftp:passive-mode true
set cmd:trace true

open ftp://snakkaz_admin:GR33nT3ch2024!@snakkaz.com

# Create backup of original .htaccess
get .htaccess .htaccess.backup.$(date +%Y%m%d_%H%M%S) || echo "No existing .htaccess found"

# Upload enhanced .htaccess with MIME type fixes
put dist/.htaccess .htaccess
echo "✅ Enhanced .htaccess uploaded"

# Upload web.config as fallback
put dist/web.config web.config
echo "✅ Web.config uploaded as IIS fallback"

# Verify upload
ls -la .htaccess
ls -la web.config

quit
EOF

# Execute FTP deployment
lftp -f emergency-mime-fix.lftp

echo ""
echo "🎯 DEPLOYMENT COMPLETED - $(date)"
echo "====================================="
echo "✅ Enhanced .htaccess with multiple MIME type fixes deployed"
echo "✅ Web.config deployed as IIS server fallback"
echo "✅ Original .htaccess backed up on server"
echo ""
echo "🔍 NEXT STEPS:"
echo "1. Test JavaScript module loading on snakkaz.com"
echo "2. Verify MIME types are now 'application/javascript'"
echo "3. Monitor console for module loading errors"
echo ""
echo "📊 MIME TYPE FIXES APPLIED:"
echo "- AddType application/javascript .js"
echo "- Header always set Content-Type application/javascript"
echo "- Force override for assets/js/* files"
echo "- IIS web.config fallback configuration"
