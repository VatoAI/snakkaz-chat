#!/bin/bash
# Debug server status

echo "🔍 DEBUGGING: Checking server structure"

# Test basic connectivity 
echo "1. Testing basic connectivity..."
curl -s -I https://snakkaz.com/ | head -5

echo -e "\n2. Testing assets directory..."
curl -s -o /dev/null -w "assets/ directory: %{http_code}\n" https://snakkaz.com/assets/

echo -e "\n3. Testing assets/js directory..."  
curl -s -o /dev/null -w "assets/js/ directory: %{http_code}\n" https://snakkaz.com/assets/js/

echo -e "\n4. Looking for any existing JS files..."
# Test if there are any JS files at all
curl -s https://snakkaz.com/assets/js/ | head -10

echo -e "\n5. Testing .htaccess..."
curl -s -I https://snakkaz.com/.htaccess | head -3

echo -e "\n6. Checking index.html content for script references..."
curl -s https://snakkaz.com/ | grep -o 'src="[^"]*\.js"' | head -5

echo -e "\n7. Manual FTP test..."
# Try simple FTP connection test
lftp -c "
set ssl:verify-certificate false;
open -u snakkaz.com,B48@.m*VhQUF sftp://ftp.domeneshop.no;
ls -la;
quit;
" | head -10
