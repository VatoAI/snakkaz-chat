#!/bin/bash

# MCP Admin Deploy with Working FTP Credentials
echo "🚀 Deploying MCP Admin Dashboard with working FTP credentials..."

# Use LFTP for deployment with working credentials
lftp -f /dev/stdin << 'EOF'
set ssl:verify-certificate no
open -u admin@snakkaz.com,Rompetroll123! ftp.snakkaz.com
cd public_html
mkdir -p mcp
cd mcp
put /workspaces/snakkaz-chat/dist/mcp-admin/index.html
put /workspaces/snakkaz-chat/dist/mcp-admin/login.html
put /workspaces/snakkaz-chat/dist/mcp-admin/config.js
put /workspaces/snakkaz-chat/dist/mcp-admin/.htaccess
quit
EOF

echo "✅ MCP Admin Dashboard deployed!"
echo ""
echo "🔗 Access admin dashboard at: https://mcp.snakkaz.com/"
echo "🔗 Admin login at: https://mcp.snakkaz.com/login.html"
echo ""
echo "Demo credentials:"
echo "- Username: admin"
echo "- Password: SnakkazMCP2025!"
