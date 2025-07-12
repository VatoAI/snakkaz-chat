#!/bin/bash

# RETRY FTP UPLOAD - Simple approach
echo "🔄 RETRY: FTP upload for index.html"

# Simple FTP upload without timeouts
cat > retry-upload.lftp << 'EOF'
set ssl:verify-certificate no
set ftp:passive-mode on
open -u admin@snakkaz.com,Rompetroll123! ftp://ftp.snakkaz.com
put dist/index.html index.html
quit
EOF

echo "📡 Attempting FTP upload..."
lftp -f retry-upload.lftp

echo "✅ Upload attempt completed"
rm -f retry-upload.lftp
