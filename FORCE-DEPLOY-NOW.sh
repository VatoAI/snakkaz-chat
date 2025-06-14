#!/bin/bash

echo "🚨 FORCE DEPLOYMENT - BYPASS GITHUB ACTIONS"
echo "============================================"

# 1. Check FTP credentials are set
if [ -z "$FTP_USERNAME" ] || [ -z "$FTP_PASSWORD" ]; then
    echo "❌ FTP credentials missing!"
    echo "Set them with:"
    echo "export FTP_USERNAME='your_username'"
    echo "export FTP_PASSWORD='your_password'"
    exit 1
fi

# 2. Test connection first
echo "🔍 Testing FTP connection..."
lftp -e "ls; quit" -u $FTP_USERNAME,$FTP_PASSWORD ftp://ftp.snakkaz.com

# 3. Deploy ONLY the critical files
echo "🚀 Deploying critical files..."

cat > force-deploy.lftp << EOF
set ssl:verify-certificate no
set xfer:clobber on
set cmd:fail-exit yes

open -u $FTP_USERNAME,$FTP_PASSWORD ftp://ftp.snakkaz.com:21
cd public_html

# Upload the corrected bundles
put -c dist/assets/js/vendor-react-core-BfIF1-qE.js assets/js/vendor-react-core-BfIF1-qE.js
put -c dist/assets/js/vendor-react-dom-1Lp3Rl7J.js assets/js/vendor-react-dom-1Lp3Rl7J.js  
put -c dist/assets/js/vendor-misc-CvNb75W7.js assets/js/vendor-misc-CvNb75W7.js
put -c dist/assets/js/index-BdjqU1Nn.js assets/js/index-BdjqU1Nn.js

# Upload the corrected HTML with proper loading order
put -c dist/index.html index.html

quit
EOF

lftp -f force-deploy.lftp

if [ $? -eq 0 ]; then
    echo "✅ DEPLOYMENT SUCCESS!"
    echo "Wait 30 seconds then test: https://snakkaz.com"
else
    echo "❌ DEPLOYMENT FAILED"
    exit 1
fi
