#!/bin/bash

echo "🚨 EMERGENCY FTP DEPLOYMENT FOR SNAKKAZ.COM 🚨"
echo "Deploying React fix immediately..."

# FTP server details from cPanel
FTP_HOST="snakkaz.com"
FTP_USER="Snakkaz@snakkaz.com"
FTP_PASS="YOUR_FTP_PASSWORD"  # You need to fill this in

# Check if we have the dist folder
if [ ! -d "dist" ]; then
    echo "❌ No dist folder found. Building first..."
    npm run build
fi

# Create LFTP deployment script
cat > emergency-ftp-upload.lftp << 'EOF'
set ftp:ssl-allow no
set ssl:verify-certificate no
set ftp:passive-mode on

# Connect to FTP
open -u Snakkaz@snakkaz.com ftp://snakkaz.com

# Navigate to public_html
cd public_html

echo "📁 Current directory contents:"
ls -la

# Upload the critical index.html file first
echo "📄 Uploading new index.html..."
put dist/index.html index.html

# Navigate to assets/js directory
cd assets/js

echo "📦 Uploading critical React bundles..."
# Upload the React core bundle (must load first)
put dist/assets/js/vendor-react-core-BfIF1-qE.js vendor-react-core-BfIF1-qE.js

# Upload React DOM bundle (must load second)
put dist/assets/js/vendor-react-dom-1Lp3Rl7J.js vendor-react-dom-1Lp3Rl7J.js

# Upload misc bundle (contains use-sync-external-store, must load after React)
put dist/assets/js/vendor-misc-CvNb75W7.js vendor-misc-CvNb75W7.js

# Upload main app bundle
put dist/assets/js/index-BdjqU1Nn.js index-BdjqU1Nn.js

echo "📦 Uploading remaining bundles..."
# Upload all other JS files
mput dist/assets/js/*.js

echo "✅ FTP upload complete!"

# Go back to public_html and check
cd ../..
echo "📋 Verifying index.html contains new bundle references:"
cat index.html | head -50

bye
EOF

echo "🔧 Created LFTP script. Now executing FTP upload..."

# Check if lftp is installed
if ! command -v lftp &> /dev/null; then
    echo "❌ LFTP not found. Installing..."
    sudo apt-get update && sudo apt-get install -y lftp
fi

# Run the LFTP script
echo "🚀 Deploying to snakkaz.com via FTP..."
lftp -f emergency-ftp-upload.lftp

echo "✅ Emergency deployment complete!"
echo ""
echo "🧪 Testing the fix..."
sleep 3

# Test if the fix worked
echo "📋 Checking if new bundles are live..."
if curl -s https://snakkaz.com/ | grep -q "index-BdjqU1Nn.js"; then
    echo "✅ SUCCESS! New index.html is live!"
else
    echo "❌ Upload may have failed. Check manually."
fi

echo ""
echo "🌐 Please test https://snakkaz.com in your browser"
echo "The React error should be gone!"
echo ""
echo "🔍 If you still see errors, check browser DevTools Console"
echo "You may need to clear browser cache (Ctrl+F5)"
