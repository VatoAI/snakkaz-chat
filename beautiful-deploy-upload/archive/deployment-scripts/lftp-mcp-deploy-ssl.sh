#!/bin/bash

# MCP Admin Deploy with LFTP (SSL workaround)
echo "🚀 Deploying MCP Admin Dashboard with LFTP (SSL workaround)..."

# Use LFTP for deployment with SSL bypass
lftp -f /dev/stdin << 'EOF'
set ssl:verify-certificate no
open -u snakkaz_admin,SnakkazFTP2025! ftp.snakkaz.com
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
