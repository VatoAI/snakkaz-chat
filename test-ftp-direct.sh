#!/bin/bash
# test-ftp-direct.sh - Enkel test av FTP-tilkobling

echo "Tester FTP-tilkobling direkte..."

# FTP-detaljer
FTP_HOST="premium123.web-hosting.com"
FTP_USER="SnakkaZ@snakkaz.com"
FTP_PASS="Snakkaz2025!"

# Test enkel FTP-kommando
ftp -inv $FTP_HOST << EOF
user $FTP_USER $FTP_PASS
pwd
ls -la
quit
EOF

echo "FTP-test fullført."
