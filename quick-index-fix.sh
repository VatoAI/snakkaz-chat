#!/bin/bash

# QUICK FIX: Force upload correct index.html
echo "🚀 QUICK INDEX.HTML FIX"
echo "Started at: $(date)"

# Verify our local index.html has the correct references
echo "🔍 Checking local dist/index.html..."
if grep -q "assets/js/index-.*\.js" dist/index.html; then
    echo "✅ Local index.html has correct production references"
    grep "assets/js/index-.*\.js" dist/index.html
else
    echo "❌ Local index.html missing production references!"
    exit 1
fi

# Create simple upload script
cat > quick-index-fix.lftp << 'EOF'
set ssl:verify-certificate no
set ftp:passive-mode on
set cmd:fail-exit yes
set net:timeout 10
set net:max-retries 2

open -u admin@snakkaz.com,Rompetroll123! ftp://ftp.snakkaz.com

# Quick backup
get index.html index-old-backup.html

# Force upload new index.html
put dist/index.html index.html

# Quick verification - just check if it uploaded
ls -la index.html

quit
EOF

echo "📡 Uploading correct index.html..."
lftp -f quick-index-fix.lftp

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Upload completed!"
    echo ""
    echo "🎯 IMMEDIATE TEST:"
    echo "1. Go to https://snakkaz.com"
    echo "2. Press Ctrl+Shift+R (hard refresh)"
    echo "3. Check Developer Console - should see:"
    echo "   ✅ React hooks fix messages"
    echo "   ✅ NO 'main.tsx' errors"
    echo "   ✅ Loading vendor-misc-1EIi_gUb.js"
    echo ""
    echo "📊 Expected result:"
    echo "   ❌ OLD: Loading main.tsx (MIME type error)"
    echo "   ✅ NEW: Loading assets/js/index-C8UgCmie.js"
else
    echo "❌ Upload failed!"
fi

# Cleanup
rm -f quick-index-fix.lftp
echo "⏰ Finished at: $(date)"
