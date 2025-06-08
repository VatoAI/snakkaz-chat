#!/bin/bash

echo "EMERGENCY RESTORE - Snakkaz Chat Files"
echo "======================================" 
echo "Starting upload to FTP server..."

# Use lftp to upload files
lftp -c "
set ssl:verify-certificate false
open ftp://premium123.web-hosting.com:2083
user snakksge_snakkaz Kj88Hh99Pp55Tt44Oo
lcd dist
cd public_html
mirror -R . .
quit
"

echo "Upload completed! Checking status..."
echo "Files should now be restored on www.snakkaz.com"
