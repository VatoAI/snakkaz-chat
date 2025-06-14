#!/bin/bash

# ================================================
# SNAKKAZ REACT UNDEFINED FIX DEPLOYMENT
# Juni 14, 2025 - Emergency React Fix
# ================================================

echo "🚀 DEPLOYING REACT UNDEFINED FIX..."

# Deploy critical bundles only for immediate fix
lftp -c "
set ssl:verify-certificate no
open -u snakkazcom,YWC5-wgd-yrE-Ckt ftp.snakkaz.com
put -c dist/assets/js/vendor-react-core-P8orpnXN.js -o public_html/assets/js/vendor-react-core-P8orpnXN.js
put -c dist/assets/js/vendor-react-core-P8orpnXN.js.map -o public_html/assets/js/vendor-react-core-P8orpnXN.js.map
put -c dist/assets/js/vendor-misc-DcaTGh4z.js -o public_html/assets/js/vendor-misc-DcaTGh4z.js
put -c dist/assets/js/vendor-misc-DcaTGh4z.js.map -o public_html/assets/js/vendor-misc-DcaTGh4z.js.map
put -c dist/assets/js/index-ClZPYTJk.js -o public_html/assets/js/index-ClZPYTJk.js
put -c dist/assets/js/index-ClZPYTJk.js.map -o public_html/assets/js/index-ClZPYTJk.js.map
put -c dist/index.html -o public_html/index.html
quit
"

echo "🎉 CRITICAL FIXES DEPLOYED!"
echo "✅ React bundled with use-sync-external-store"
echo "✅ Correct loading order applied"
