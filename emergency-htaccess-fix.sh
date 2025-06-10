#!/bin/bash

# 🚨 EMERGENCY .htaccess FIX - CRITICAL MIME TYPE ISSUE
# Juni 9, 2025 - Fix JavaScript files being served as text/html

echo "🚨 EMERGENCY .htaccess FIX FOR MIME TYPE ISSUE"
echo "=============================================="
echo "Issue: JavaScript files served as text/html instead of application/javascript"
echo "Fix: Upload corrected .htaccess file with proper MIME type configuration"
echo ""

# Verify .htaccess exists in dist
if [ ! -f "dist/.htaccess" ]; then
    echo "❌ .htaccess file not found in dist directory!"
    echo "Copying .htaccess to dist..."
    cp .htaccess dist/.htaccess
    if [ $? -eq 0 ]; then
        echo "✅ .htaccess copied to dist directory"
    else
        echo "❌ Failed to copy .htaccess"
        exit 1
    fi
fi

echo "✅ .htaccess file exists in dist directory"
echo "Contents preview:"
echo "=================="
head -20 dist/.htaccess
echo "=================="
echo ""

# Upload via FTP
echo "🚀 Uploading .htaccess file to production server..."

cat > emergency-htaccess-upload.lftp << 'EOF'
set ftp:list-options -a
set cmd:fail-exit yes
set ftp:ssl-allow no
set ftp:passive-mode yes

open ftp://snakqsqe:Snakkaz2023@ftp.snakkaz.com

cd /public_html

# Upload the .htaccess file
put dist/.htaccess .htaccess

# Verify upload
ls -la .htaccess

bye
EOF

echo "Executing FTP upload..."
lftp -f emergency-htaccess-upload.lftp

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ EMERGENCY FIX DEPLOYED SUCCESSFULLY!"
    echo "🌐 The .htaccess file has been uploaded to production"
    echo "🔧 JavaScript files should now be served with correct MIME type"
    echo ""
    echo "Please test the website now: https://snakkaz.com"
    echo ""
else
    echo ""
    echo "❌ DEPLOYMENT FAILED!"
    echo "Manual intervention required"
    exit 1
fi

# Cleanup
rm -f emergency-htaccess-upload.lftp

echo "Emergency deployment completed!"
