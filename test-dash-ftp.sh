#!/bin/bash

echo "🧪 Testing FTP deployment to dash.snakkaz.com..."

# Create test LFTP script
cat > "/tmp/test_dash_deploy.txt" << 'EOF'
set ftp:ssl-allow no
set ssl:verify-certificate no
set ftp:passive-mode on
set cmd:fail-exit yes
open -u @snakkaz.com,Snakkaz$09102024 ftp.snakkaz.com
cd /public_html/dash
pwd
ls -la
bye
EOF

echo "Testing connection and listing dash directory..."
lftp -f "/tmp/test_dash_deploy.txt"

# Cleanup
rm -f "/tmp/test_dash_deploy.txt"
