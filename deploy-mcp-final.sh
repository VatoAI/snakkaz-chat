#!/bin/bash

# Deploy MCP package to mcp.snakkaz.com subdomain
echo "🚀 Deploying MCP Dashboard to mcp.snakkaz.com..."

# Check if package exists
if [ ! -d "deployment-packages/mcp-package" ]; then
    echo "❌ Error: MCP package not found"
    exit 1
fi

echo "📦 Found MCP package with $(ls -la deployment-packages/mcp-package | wc -l) files"

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

# First verify mcp directory exists, create if not
mkdir -p public_html/mcp 2>/dev/null || true

# Navigate to MCP subdomain directory
cd public_html/mcp

# Create backup directory
mkdir backup-mcp-deploy 2>/dev/null || true

# Upload all MCP files
mirror -R deployment-packages/mcp-package/ ./ --delete --parallel=2 --verbose

# Set permissions
chmod 644 *.html *.css *.js
chmod 644 .htaccess

echo 'MCP deployment complete'
quit
"

echo "✅ MCP Dashboard deployed to mcp.snakkaz.com"
echo "🌐 Visit: https://mcp.snakkaz.com"
