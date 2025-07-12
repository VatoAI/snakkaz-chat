#!/bin/bash

# Simple FTP Deployment Script for Snakkaz Chat
# Uses the provided FTP credentials to upload and extract

echo "=== SNAKKAZ SIMPLE FTP DEPLOYMENT ==="
echo "Started at: $(date)"
echo ""

# Check if ZIP file exists
if [ ! -f "snakkaz-dist.zip" ]; then
    echo "❌ snakkaz-dist.zip not found. Run: zip -r snakkaz-dist.zip dist/"
    exit 1
fi

echo "✅ Found snakkaz-dist.zip ($(du -h snakkaz-dist.zip | cut -f1))"
echo ""

# Create LFTP script
echo "📡 Uploading to ftp.snakkaz.com/public_html..."
cat > upload.lftp << 'EOF'
set ftp:ssl-allow no
open -u admin@snakkaz.com,Rompetroll123! ftp.snakkaz.com
cd public_html
put snakkaz-dist.zip
ls -la snakkaz-dist.zip
quit
EOF

# Upload file
lftp -f upload.lftp

# Check if upload was successful
if [ $? -eq 0 ]; then
    echo "✅ Upload successful!"
    echo ""
    echo "📋 MANUAL EXTRACTION STEPS:"
    echo "1. Go to https://snakkaz.com:2083"
    echo "2. Login with admin@snakkaz.com"
    echo "3. Open File Manager"
    echo "4. Navigate to public_html"
    echo "5. Right-click snakkaz-dist.zip → Extract"
    echo "6. Choose 'Extract files to current directory'"
    echo "7. Delete the ZIP file after extraction"
    echo ""
    echo "🌐 Then visit: https://snakkaz.com"
else
    echo "❌ Upload failed!"
    exit 1
fi

# Cleanup
rm upload.lftp

echo "Deployment script completed at: $(date)"
