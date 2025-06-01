#!/bin/bash

# Snakkaz Chat Subdomain Deployment Script
# This script deploys the React app to all subdomain directories

echo "🚀 Snakkaz Chat Subdomain Deployment"
echo "===================================="
echo ""

# FTP Configuration
FTP_HOST="ftp.snakkaz.com"
FTP_USER="@snakkaz.com"
FTP_PASS="Snakkaz$09102024"
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

# Create subdomain-specific .htaccess file
create_subdomain_htaccess() {
    local subdomain="$1"
    cat > "/tmp/subdomain_htaccess_${subdomain}" << EOF
# Snakkaz Chat Subdomain Configuration for ${subdomain}
DirectoryIndex index.html

# Enable mod_rewrite
RewriteEngine On

# Handle React Router (SPA) - redirect all requests to index.html
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule . /index.html [L]

# Security headers
Header always set X-Frame-Options "SAMEORIGIN"
Header always set X-Content-Type-Options "nosniff"
Header always set X-XSS-Protection "1; mode=block"
Header always set Referrer-Policy "strict-origin-when-cross-origin"

# Cache static assets
<FilesMatch "\.(css|js|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$">
    Header set Cache-Control "public, max-age=31536000"
</FilesMatch>

# Don't cache HTML files
<FilesMatch "\.(html|htm)$">
    Header set Cache-Control "no-cache, no-store, must-revalidate"
    Header set Pragma "no-cache"
    Header set Expires "0"
</FilesMatch>

# Compress files
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

# Error pages
ErrorDocument 404 /index.html
EOF
}

# Function to deploy to a subdomain directory
deploy_to_subdomain() {
    local subdomain="$1"
    local remote_dir="/public_html/$subdomain"
    
    echo "🌐 Deploying to $subdomain.snakkaz.com..."
    echo "   Remote directory: $remote_dir"
    
    # Create subdomain-specific .htaccess
    create_subdomain_htaccess "$subdomain"
    
    # Create FTP command script
    cat > "/tmp/ftp_deploy_${subdomain}.txt" << EOF
open $FTP_HOST
user $FTP_USER $FTP_PASS
binary
cd $remote_dir
prompt off
mdelete *
mdelete assets/*
mdelete icons/*
mdelete images/*
mdelete logos/*
mdelete lovable-uploads/*
mdelete thumbnails/*
rmdir assets
rmdir icons
rmdir images
rmdir logos
rmdir lovable-uploads
rmdir thumbnails
mkdir assets
mkdir icons
mkdir images
mkdir logos
mkdir lovable-uploads
mkdir thumbnails
lcd $LOCAL_BUILD_DIR
mput *
cd assets
lcd assets
mput *
cd ..
cd icons
lcd ../icons
mput *
cd ..
cd images
lcd ../images
mput *
cd ..
cd logos
lcd ../logos
mput *
cd ..
cd lovable-uploads
lcd ../lovable-uploads
mput *
cd ..
cd thumbnails
lcd ../thumbnails
mput *
cd ..
put /tmp/subdomain_htaccess_${subdomain} .htaccess
quit
EOF
    
    # Execute FTP deployment
    if ftp -n < "/tmp/ftp_deploy_${subdomain}.txt" > "/tmp/ftp_log_${subdomain}.txt" 2>&1; then
        echo "   ✅ Successfully deployed to $subdomain subdomain"
    else
        echo "   ❌ Failed to deploy to $subdomain subdomain"
        echo "   Check log: /tmp/ftp_log_${subdomain}.txt"
        return 1
    fi
    
    # Clean up temp files
    rm -f "/tmp/ftp_deploy_${subdomain}.txt"
    rm -f "/tmp/subdomain_htaccess_${subdomain}"
    
    echo ""
}

# Main deployment loop
echo "🔄 Starting deployment to all subdomains..."
echo ""

failed_deployments=()

for subdomain in "${SUBDOMAINS[@]}"; do
    if ! deploy_to_subdomain "$subdomain"; then
        failed_deployments+=("$subdomain")
    fi
    sleep 2  # Small delay between deployments
done

# Summary
echo "📊 Deployment Summary:"
echo "====================="
echo ""

if [ ${#failed_deployments[@]} -eq 0 ]; then
    echo "🎉 SUCCESS: All ${#SUBDOMAINS[@]} subdomains deployed successfully!"
    echo ""
    echo "🌐 Your subdomains are now ready:"
    for subdomain in "${SUBDOMAINS[@]}"; do
        echo "   ✅ https://$subdomain.snakkaz.com"
    done
    echo ""
    echo "🔍 Test subdomain detection:"
    echo "   1. Visit each subdomain in browser"
    echo "   2. Open Developer Tools (F12) → Console"
    echo "   3. Look for messages like:"
    echo "      🌐 Snakkaz Chat: Detected subdomain \"$subdomain\" - configuring app..."
    echo "   4. Check document title changes based on subdomain"
    echo ""
    echo "🎯 Next steps:"
    echo "   • Test each subdomain functionality"
    echo "   • Verify console logging works"
    echo "   • Check sessionStorage data"
else
    echo "⚠️ PARTIAL SUCCESS: ${#failed_deployments[@]} deployments failed"
    echo ""
    echo "❌ Failed subdomains:"
    for subdomain in "${failed_deployments[@]}"; do
        echo "   • $subdomain.snakkaz.com"
    done
    echo ""
    echo "✅ Successful subdomains:"
    for subdomain in "${SUBDOMAINS[@]}"; do
        if [[ ! " ${failed_deployments[@]} " =~ " ${subdomain} " ]]; then
            echo "   • https://$subdomain.snakkaz.com"
        fi
    done
fi

echo ""
echo "🔧 If any issues occur, check:"
echo "   • FTP connection settings"
echo "   • Server directory permissions"
echo "   • .htaccess file conflicts"
echo ""
echo "📞 Contact hosting provider if needed for:"
echo "   • Subdomain document root configuration"
echo "   • Directory permissions"
echo "   • .htaccess support verification"
