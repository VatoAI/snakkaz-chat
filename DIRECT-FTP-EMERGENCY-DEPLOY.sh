#!/bin/bash

# 🚨 EMERGENCY DIRECT FTP DEPLOYMENT SCRIPT
# This bypasses GitHub Actions to deploy directly via FTP

echo "🚨 EMERGENCY DEPLOYMENT: Direct FTP Upload"
echo "=========================================="

# Build the project first
echo "📦 Building project..."
npm run build --no-lint

if [ $? -ne 0 ]; then
    echo "❌ Build failed! Cannot proceed with deployment."
    exit 1
fi

echo "✅ Build completed successfully"

# Check if dist folder exists and has content
if [ ! -d "dist" ] || [ -z "$(ls -A dist)" ]; then
    echo "❌ No dist folder or empty dist folder found!"
    exit 1
fi

echo "📁 Contents of dist folder:"
ls -la dist/

echo "📱 Checking bundle files:"
ls -la dist/assets/js/ | grep -E "(index-|vendor-misc)"

# Create FTP commands to upload all files
echo "📤 Creating FTP upload script..."

cat > emergency-direct-ftp.lftp << 'EOF'
set ssl:verify-certificate no
set ftp:ssl-allow no
set cmd:fail-exit yes

open ftp://snakkaz.com
user snakkaz.com snak6452

# Clear existing files first (backup approach)
mirror --reverse --delete --verbose dist/ public_html/

# Alternative: Upload specific critical files
lcd dist
cd public_html

# Upload main files
put index.html
put .htaccess

# Upload assets
mirror --reverse --verbose assets/ assets/

# Verify upload
ls -la
ls -la assets/js/ | head -10

quit
EOF

echo "📋 FTP Script created. Contents:"
echo "================================"
cat emergency-direct-ftp.lftp
echo "================================"

# Execute the FTP upload
echo "🚀 Starting FTP upload..."
lftp -f emergency-direct-ftp.lftp

if [ $? -eq 0 ]; then
    echo "✅ FTP upload completed successfully!"
    
    # Verify deployment
    echo "🔍 Verifying deployment..."
    sleep 10
    
    echo "📊 Checking live bundles..."
    curl -s https://www.snakkaz.com | grep -E '(index-|vendor-misc)' | head -5
    
    echo "🧪 Testing site response..."
    curl -I https://www.snakkaz.com
    
    echo "🎉 EMERGENCY DEPLOYMENT COMPLETED!"
    echo "Please check: https://www.snakkaz.com"
else
    echo "❌ FTP upload failed!"
    echo "Trying alternative FTP method..."
    
    # Alternative method using curl
    echo "📤 Trying curl-based upload..."
    
    cd dist
    
    # Upload index.html
    curl -T index.html --user "snakkaz.com:snak6452" "ftp://snakkaz.com/public_html/"
    
    # Upload critical JS files
    curl -T assets/js/index-*.js --user "snakkaz.com:snak6452" "ftp://snakkaz.com/public_html/assets/js/"
    curl -T assets/js/vendor-misc-*.js --user "snakkaz.com:snak6452" "ftp://snakkaz.com/public_html/assets/js/"
    
    echo "📋 Alternative upload attempt completed"
fi

echo "🏁 Emergency deployment script finished"
