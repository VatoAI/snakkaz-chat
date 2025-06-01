#!/bin/bash

echo "🧪 Testing single subdomain deployment (dash)"
echo "============================================="

# Test deployment to dash subdomain only
LOCAL_BUILD_DIR="/workspaces/snakkaz-chat/dist"
SUBDOMAIN="dash"
REMOTE_DIR="/public_html/$SUBDOMAIN"

echo "📁 Local files to deploy:"
echo "   Source: $LOCAL_BUILD_DIR"
echo "   Files: $(ls -1 $LOCAL_BUILD_DIR | wc -l) items"
echo ""

echo "🌐 Target subdomain: $SUBDOMAIN.snakkaz.com"
echo "   Remote path: $REMOTE_DIR"
echo ""

# Create LFTP deployment script
cat > "/tmp/deploy_dash.lftp" << 'EOF'
set ftp:ssl-allow no
set ssl:verify-certificate no
set ftp:passive-mode on
set cmd:fail-exit yes
set ftp:list-options -a

debug 5

open -u @snakkaz.com,Snakkaz$09102024 ftp.snakkaz.com

echo "Connected to FTP server"
pwd
echo "Current working directory shown above"

cd /public_html/dash
pwd
echo "Changed to dash directory"

ls -la
echo "Current dash directory contents shown above"

quit
EOF

echo "🔗 Testing FTP connection and navigation..."
if lftp -f "/tmp/deploy_dash.lftp" 2>&1; then
    echo "✅ FTP connection successful!"
    echo ""
    
    # If connection works, try actual deployment
    echo "🚀 Attempting file deployment..."
    
    cat > "/tmp/deploy_dash_files.lftp" << EOF
set ftp:ssl-allow no
set ssl:verify-certificate no
set ftp:passive-mode on

open -u @snakkaz.com,Snakkaz\$09102024 ftp.snakkaz.com
cd /public_html/dash

# Remove old files but keep cgi-bin
rm -rf assets icons images logos lovable-uploads thumbnails
rm -f *.html *.js *.css *.json *.txt *.svg *.png *.ico _redirects _routes.json manifest.json robots.txt sitemap.xml

# Change to local directory and upload
lcd $LOCAL_BUILD_DIR
mput *
mkdir assets
cd assets
lcd assets
mput *
cd ..

# Upload .htaccess
lcd ..
put subdomain-htaccess-template .htaccess

ls -la
quit
EOF

    if lftp -f "/tmp/deploy_dash_files.lftp"; then
        echo "✅ File deployment completed!"
    else
        echo "❌ File deployment failed"
    fi
    
else
    echo "❌ FTP connection failed"
    echo ""
    echo "📋 Manual deployment required:"
    echo "   1. Download dash-snakkaz-deployment.zip"
    echo "   2. Upload to /public_html/dash/ via cPanel File Manager"
    echo "   3. Extract all files to the dash directory root"
fi

# Cleanup
rm -f "/tmp/deploy_dash.lftp" "/tmp/deploy_dash_files.lftp"

echo ""
echo "🧪 Testing deployment result..."
echo "Checking https://dash.snakkaz.com..."

sleep 3

# Test the deployed subdomain
curl -s -I https://dash.snakkaz.com/ | head -3
echo ""

RESPONSE=$(curl -s https://dash.snakkaz.com/ | head -200)
if echo "$RESPONSE" | grep -q "Snakkaz Chat"; then
    echo "🎉 SUCCESS! Dash subdomain is serving Snakkaz Chat app!"
elif echo "$RESPONSE" | grep -q "Index of"; then
    echo "📁 Still showing directory listing - deployment may not have completed"
else
    echo "❓ Unknown response from subdomain"
fi

echo ""
echo "🔗 Manual verification: https://dash.snakkaz.com"
