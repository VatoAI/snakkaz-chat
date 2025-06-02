#!/bin/bash

# Deploy MCP package to mcp.snakkaz.com subdomain
echo "🚀 Deploying MCP Dashboard to mcp.snakkaz.com..."

# Check if package exists
if [ ! -d "deployment-packages/mcp-package" ]; then
    echo "❌ Error: MCP package not found"
    exit 1
fi

echo "📦 Found MCP package with $(ls -la deployment-packages/mcp-package | wc -l) files"

# Deploy using lftp with safer settings
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

# Navigate to MCP subdomain directory
cd public_html/mcp

# Upload all MCP files without aggressive deletion
mirror -R deployment-packages/mcp-package/ ./ --no-empty-dirs --parallel=2 --verbose

# Set permissions for web files
chmod 644 *.html 2>/dev/null || true
chmod 644 *.css 2>/dev/null || true  
chmod 644 *.js 2>/dev/null || true
chmod 644 .htaccess 2>/dev/null || true
chmod 755 assets 2>/dev/null || true

echo 'MCP deployment complete'
quit
"

echo "✅ MCP Dashboard deployed to mcp.snakkaz.com"
echo "🌐 Visit: https://mcp.snakkaz.com"
