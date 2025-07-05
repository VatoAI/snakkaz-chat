#!/bin/bash

# Simple MCP Admin Deploy Script
echo "🚀 Deploying MCP Admin Dashboard to mcp.snakkaz.com..."

# Check if files exist
if [ ! -d "dist/mcp-admin" ]; then
    echo "❌ MCP admin files not found. Building first..."
    exit 1
fi

# Create FTP script
cat > mcp-deploy.ftp << 'EOF'
open ftp.snakkaz.com
user snakkaz_admin SnakkazFTP2025!
binary
cd public_html
mkdir mcp
cd mcp
put dist/mcp-admin/index.html
put dist/mcp-admin/login.html
put dist/mcp-admin/config.js
put dist/mcp-admin/.htaccess
quit
EOF

# Run FTP deployment
echo "📤 Uploading files to mcp.snakkaz.com..."
ftp -n < mcp-deploy.ftp

# Clean up
rm -f mcp-deploy.ftp

echo "✅ MCP Admin Dashboard deployed!"
echo ""
echo "🔗 Access admin dashboard at: https://mcp.snakkaz.com/"
echo "🔗 Admin login at: https://mcp.snakkaz.com/login.html"
echo ""
echo "Demo credentials:"
echo "- Username: admin"
echo "- Password: SnakkazMCP2025!"
