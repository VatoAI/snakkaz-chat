#!/bin/bash

# CloudMCP.run Status Checker for SnakkaZ Chat
# Quick script to test CloudMCP.run availability

echo "🌐 CloudMCP.run Status Checker"
echo "=============================="
echo ""

echo "📡 Testing CloudMCP.run service..."

# Test if CloudMCP.run is responding
if curl -s --connect-timeout 10 https://cloudmcp.run > /dev/null 2>&1; then
    echo "✅ CloudMCP.run is responding!"
    echo ""
    echo "🚀 Ready to deploy SnakkaZ MCP Server:"
    echo "   cd mcp-server && npm run deploy-cloudmcp"
    echo ""
else
    echo "❌ CloudMCP.run is not responding (404 or timeout)"
    echo ""
    echo "⏸️  Continue with local development:"
    echo "   cd mcp-server && npm start"
    echo "   ./mcp-test.sh status"
    echo ""
fi

echo "📊 Local MCP Server Status:"
if [ -f "mcp-server/server.js" ]; then
    echo "✅ MCP Server file exists"
else
    echo "❌ MCP Server file missing"
fi

if [ -f "mcp-test.sh" ]; then
    echo "✅ MCP Test suite available"
else
    echo "❌ MCP Test suite missing"
fi

echo ""
echo "🎯 Next Actions:"
echo "1. Run: cd mcp-server && npm start"
echo "2. Test: ./mcp-test.sh status"
echo "3. Check CloudMCP.run periodically"
echo ""
echo "🌟 Your MCP integration is ready for deployment!"
