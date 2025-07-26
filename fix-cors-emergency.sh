#!/bin/bash

# 🇳🇴 SNAKKAZ CORS FIX - EMERGENCY UPDATE SCRIPT
echo "🔧 FIXING CORS ISSUE FOR SNAKKAZ.COM..."
echo "============================================"

# Navigate to MCP deployment directory
cd /workspaces/snakkaz-chat/

# Update MCP package with CORS fix
echo "📦 Creating updated MCP package with CORS fix..."

# Clean and rebuild MCP package
rm -rf snakkaz-live-deployment/mcp_subdomain
rm -f snakkaz-live-deployment/snakkaz-mcp-subdomain.zip

# Copy updated MCP files
mkdir -p snakkaz-live-deployment/mcp_subdomain
cp mcp-deployment/mcp-cors-server.js snakkaz-live-deployment/mcp_subdomain/
cp mcp-deployment/package.json snakkaz-live-deployment/mcp_subdomain/
cp mcp-deployment/package-lock.json snakkaz-live-deployment/mcp_subdomain/

# Copy status checker
cp mcp-deployment/live-status-checker.html snakkaz-live-deployment/mcp_subdomain/

# Create startup script with better logging
cat > snakkaz-live-deployment/mcp_subdomain/start-mcp.sh << 'EOF'
#!/bin/bash
echo "🚀 Starting SnakkaZ MCP Server with CORS fix..."
echo "=============================================="
echo "📍 Server will run on port 3000"
echo "🔐 CORS enabled for:"
echo "   - https://snakkaz.com"
echo "   - https://www.snakkaz.com" 
echo "   - https://mcp.snakkaz.com"
echo ""

# Ensure dependencies are installed
npm install

# Start the server with logging
node mcp-cors-server.js 2>&1 | tee mcp-server.log
EOF

chmod +x snakkaz-live-deployment/mcp_subdomain/start-mcp.sh

# Install node_modules for deployment
cd snakkaz-live-deployment/mcp_subdomain
npm install
cd ../..

# Create new ZIP with CORS fix
cd snakkaz-live-deployment
zip -r snakkaz-mcp-subdomain-CORS-FIX.zip mcp_subdomain/
cd ..

echo ""
echo "✅ CORS FIX PACKAGE CREATED!"
echo "================================"
echo "📦 File: snakkaz-mcp-subdomain-CORS-FIX.zip"
echo "📁 Upload to: /mcp.snakkaz.com/ (replace existing)"
echo "🔧 Then run: ./start-mcp.sh"
echo ""
echo "🧪 Test with live status checker:"
echo "   → Upload live-status-checker.html to public_html"
echo "   → Visit https://snakkaz.com/live-status-checker.html"
echo ""
echo "🇳🇴 SnakkaZ CORS issue skal nå være fikset!"
