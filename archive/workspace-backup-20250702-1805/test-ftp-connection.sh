#!/bin/bash

echo "🚨 DIRECT FTP TEST WITH COMPLETE CREDENTIALS"
echo "============================================="

# Test primary FTP account
echo "Testing primary FTP account: SnakkaZ@snakkaz.com"
echo "Server: ftp.snakkaz.com"
echo "Password: Eplekake123!"
echo ""

cat > test-ftp.lftp << 'EOF'
open -u SnakkaZ@snakkaz.com,Eplekake123! ftp.snakkaz.com
set ssl:verify-certificate no
set ftp:ssl-allow yes
set net:timeout 30
pwd
ls -la
cd /home/snakqsqe/public_html
pwd
ls -la
bye
EOF

echo "Running FTP test..."
lftp -f test-ftp.lftp

rm -f test-ftp.lftp
