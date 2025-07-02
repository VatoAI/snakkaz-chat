#!/bin/bash

# Upload the fixed version to replace the problematic one
echo "=== UPLOADING FIXED VERSION ==="
echo "Started at: $(date)"

# Create LFTP script
cat > upload-fixed.lftp << 'EOF'
set ftp:ssl-allow no
open -u admin@snakkaz.com,Rompetroll123! ftp.snakkaz.com
cd public_html
put snakkaz-dist-fixed.zip
ls -la snakkaz-dist-fixed.zip
quit
EOF

echo "📡 Uploading fixed version..."
lftp -f upload-fixed.lftp

if [ $? -eq 0 ]; then
    echo "✅ Upload successful!"
    echo ""
    echo "📋 EXTRACTION STEPS:"
    echo "1. Go to cPanel File Manager"
    echo "2. Find snakkaz-dist-fixed.zip"
    echo "3. Right-click → Extract"
    echo "4. IMPORTANT: Check 'Overwrite existing files'"
    echo "5. Extract to public_html"
    echo "6. Delete the ZIP file"
    echo "7. Test https://snakkaz.com"
else
    echo "❌ Upload failed!"
fi

# Cleanup
rm upload-fixed.lftp

echo "Completed at: $(date)"
