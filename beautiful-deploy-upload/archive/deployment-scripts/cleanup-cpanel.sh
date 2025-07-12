#!/bin/bash

# Snakkaz cPanel Cleanup Script
# Removes old deployment files and organizes the public_html directory

echo "=== SNAKKAZ CPANEL CLEANUP ==="
echo "Started at: $(date)"
echo ""

# Create LFTP script for cleanup
cat > cleanup.lftp << 'EOF'
set ftp:ssl-allow no
open -u admin@snakkaz.com,Rompetroll123! ftp.snakkaz.com
cd public_html

# List current files
echo "Current files in public_html:"
ls -la

# Remove old deployment ZIP files
echo "Removing old deployment files..."
rm -f snakkaz-emergency-upload.zip
rm -f snakkaz-rebuild-v2.zip
rm -f snakkaz-deployment-*.zip

# Keep the current snakkaz-dist.zip for now
echo "Keeping current snakkaz-dist.zip for extraction"

# List files after cleanup
echo "Files after cleanup:"
ls -la

quit
EOF

echo "🧹 Cleaning up old deployment files..."
lftp -f cleanup.lftp

if [ $? -eq 0 ]; then
    echo "✅ Cleanup successful!"
else
    echo "❌ Cleanup failed!"
fi

# Cleanup script file
rm cleanup.lftp

echo ""
echo "📋 NEXT STEPS:"
echo "1. Extract snakkaz-dist.zip in cPanel File Manager"
echo "2. Verify the site is working"
echo "3. Delete snakkaz-dist.zip after successful extraction"
echo ""
echo "Cleanup completed at: $(date)"
