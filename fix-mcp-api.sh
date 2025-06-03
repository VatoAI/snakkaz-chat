#!/bin/bash

# Fix MCP API issues
echo "🔧 Fixing MCP API issues..."

# Create simplified test.php file
echo "<?php echo 'PHP Test: OK - ' . date('Y-m-d H:i:s'); ?>" > test.php

# Create .htaccess file
cat > api.htaccess << EOL
# Enable PHP execution
AddHandler application/x-httpd-php .php
DirectoryIndex index.php

# PHP settings
php_flag display_errors On
php_value error_reporting 2047

# Security headers
Header always set X-Content-Type-Options "nosniff"
Header always set X-XSS-Protection "1; mode=block" 
EOL

echo "📦 Created test files"

# Deploy using lftp
lftp -c "
# Connect to server
open -u SnakkaZ@snakkaz.com,Snakkaz2025! premium123.web-hosting.com

# SSL/TLS settings
set ssl:verify-certificate no
set ftp:ssl-allow yes
set ftp:ssl-protect-data yes
set ftp:passive-mode yes

# Network settings
set net:timeout 60
set net:max-retries 3

# Navigate to correct document root based on cPanel setup
# The mcp.snakkaz.com subdomain points directly to public_html
cd public_html

# Create API directory if it doesn't exist
mkdir -p api 2>/dev/null || true

# Upload test files
cd api
put -O . test.php
put -O . api.htaccess -o .htaccess

# Also upload our actual API files from the deployment package
put -O . deployment-packages/mcp-package/api/health.php
put -O . deployment-packages/mcp-package/api/memory.php

# Set permissions
chmod 644 test.php
chmod 644 .htaccess

# Done
quit
"

echo "✅ API fix deployed"
echo "🌐 Test URLs:"
echo "   - Test: https://mcp.snakkaz.com/api/test.php"
echo "   - Health API: https://mcp.snakkaz.com/api/health.php"
echo "   - Memory API: https://mcp.snakkaz.com/api/memory.php"

# Check if the API endpoints are accessible
echo -n "🔍 Testing API endpoints... "
if curl -s "https://mcp.snakkaz.com/api/test.php" | grep -q "PHP Test: OK"; then
  echo "✅ test.php is accessible"
else
  echo "❌ test.php is not accessible"
fi

if curl -s "https://mcp.snakkaz.com/api/health.php" | grep -q "status"; then
  echo "✅ health.php is accessible"
else
  echo "❌ health.php is not accessible"
fi
