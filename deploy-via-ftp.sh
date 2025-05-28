#!/bin/bash

# Snakkaz Chat FTP Deployment Script
# This script uploads the React app to all subdomain directories

echo "🚀 Snakkaz Chat Subdomain FTP Deployment"
echo "========================================"
echo ""

# FTP Configuration
FTP_HOST="ftp.snakkaz.com"
FTP_USER="@snakkaz.com"
FTP_PASS="Snakkaz\$09102024"
LOCAL_BUILD_DIR="/workspaces/snakkaz-chat/dist"

# Subdomain directories on the server
SUBDOMAINS=("dash" "business" "docs" "analytics" "mcp" "help")

# Check if build directory exists
if [ ! -d "$LOCAL_BUILD_DIR" ]; then
    echo "❌ Error: Build directory not found at $LOCAL_BUILD_DIR"
    echo "Run 'npm run build' first!"
    exit 1
fi

echo "📦 Build directory found with $(ls -1 $LOCAL_BUILD_DIR | wc -l) files"
echo ""

# Function to deploy to a subdomain directory
deploy_to_subdomain() {
    local subdomain="$1"
    local remote_dir="/public_html/$subdomain"
    
    echo "🌐 Deploying to $subdomain.snakkaz.com..."
    echo "   Remote directory: $remote_dir"
    
    # Create LFTP script
    cat > "/tmp/lftp_deploy_${subdomain}.txt" << EOF
set ftp:ssl-allow no
set ssl:verify-certificate no
open -u $FTP_USER,$FTP_PASS $FTP_HOST
cd $remote_dir
lcd $LOCAL_BUILD_DIR

# Remove old files (but keep cgi-bin)
rm -rf assets icons images logos lovable-uploads thumbnails
rm -f *.html *.js *.css *.json *.txt *.svg *.png *.ico .htaccess _redirects _routes.json manifest.json robots.txt sitemap.xml

# Upload all new files
mirror -R --verbose --no-perms --exclude-glob=.git*

# Upload .htaccess for SPA routing
put ../subdomain-htaccess-template .htaccess

bye
EOF

    # Execute LFTP deployment
    if lftp -f "/tmp/lftp_deploy_${subdomain}.txt"; then
        echo "   ✅ Deployment successful for $subdomain"
    else
        echo "   ❌ Deployment failed for $subdomain"
    fi
    
    # Cleanup
    rm -f "/tmp/lftp_deploy_${subdomain}.txt"
    echo ""
}

# Deploy to all subdomains
echo "🚀 Starting deployment to all subdomains..."
echo ""

for subdomain in "${SUBDOMAINS[@]}"; do
    deploy_to_subdomain "$subdomain"
done

echo "🎉 Deployment process completed!"
echo ""
echo "🧪 Testing subdomain status..."
echo ""

# Run status check
if [ -f "quick-test.cjs" ]; then
    node quick-test.cjs
else
    echo "📋 Manual verification needed:"
    for subdomain in "${SUBDOMAINS[@]}"; do
        echo "   🌐 https://$subdomain.snakkaz.com"
    done
fi

echo ""
echo "🚀 Snakkaz Chat Subdomain Deployment Complete!"
