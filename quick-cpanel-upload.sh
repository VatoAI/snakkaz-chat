#!/bin/bash

# 🚀 SnakkaZ MCP - Quick cPanel Upload
echo "🚀 Preparing SnakkaZ MCP for cPanel upload..."

# Build fresh production version
echo "🔨 Building production version..."
npm run build:prod

# Create deployment package 
echo "📦 Creating deployment package..."
tar -czf snakkaz-mcp-cpanel.tar.gz \
  dist/ \
  snakkaz-mcp-server.js \
  .env \
  package.json \
  security-middleware.js \
  performance-utils.js \
  vector-db-manager.js \
  mock-vector-db.js

# Show package info
echo "✅ Package created: snakkaz-mcp-cpanel.tar.gz"
ls -lh snakkaz-mcp-cpanel.tar.gz

echo ""
echo "📋 Next steps:"
echo "1. Upload snakkaz-mcp-cpanel.tar.gz to cPanel File Manager"
echo "2. Navigate to /public_html/mcp.snakkaz.com/"
echo "3. Extract the package"
echo "4. Run commands in cPanel Terminal:"
echo "   cd /home/snakkaze/public_html/mcp.snakkaz.com"
echo "   tar -xzf snakkaz-mcp-cpanel.tar.gz"
echo "   mv dist/* ."
echo "   rm -rf dist"
echo "   npm install --production"
echo "5. Update Node.js app settings in cPanel"
echo "6. Restart Node.js application"
echo ""
echo "🌐 Live URL: https://mcp.snakkaz.com"
