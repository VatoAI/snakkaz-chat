#!/bin/bash
# upload-fixes.sh - Opplasting av reparasjoner via FTP

# FTP-detaljer
FTP_HOST="premium123.web-hosting.com"
FTP_USER="SnakkaZ@snakkaz.com"
FTP_PASS="Snakkaz2025!"
FTP_REMOTE_DIR="public_html"

echo "Laster opp .htaccess-filen..."
curl -v -T "fix-mime-types.htaccess" "ftp://$FTP_USER:$FTP_PASS@$FTP_HOST/$FTP_REMOTE_DIR/.htaccess"

echo "Testing MIME-type opplasting..."
echo 'console.log("MIME type test");' > mime-test.js
curl -v -T "mime-test.js" "ftp://$FTP_USER:$FTP_PASS@$FTP_HOST/$FTP_REMOTE_DIR/mime-test.js"

echo "Opplasting av fix-filer ferdig!"
