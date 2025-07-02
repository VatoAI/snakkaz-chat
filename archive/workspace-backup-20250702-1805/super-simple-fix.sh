#!/bin/bash
# Superenkel direct FTP upload - ingen fancy ting

echo "🚀 DIRECT FTP UPLOAD - Fixing snakkaz.com JavaScript issues"

# Rett fram FTP kommando - ingen kompliserte ting
lftp -c "
set ssl:verify-certificate false
open -u snakkaz.com,B48@.m*VhQUF sftp://ftp.domeneshop.no
put dist/index.html index.html
mkdir -p assets/js
put dist/assets/js/index-BqZ1ZR0w.js assets/js/index-BqZ1ZR0w.js
put .htaccess .htaccess
quit
"

echo "✅ Upload ferdig - tester..."

sleep 3

# Test
INDEX_STATUS=$(curl -s -o /dev/null -w "%{http_code}" https://snakkaz.com/)
JS_STATUS=$(curl -s -o /dev/null -w "%{http_code}" https://snakkaz.com/assets/js/index-BqZ1ZR0w.js)

echo "Index: $INDEX_STATUS"
echo "JavaScript: $JS_STATUS"

if [ "$JS_STATUS" = "200" ]; then
    echo "🎉 SUKSESS! Test https://snakkaz.com nå"
else
    echo "❌ Fortsatt problemer - kan trenge mer tid"
fi
