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
node simplified-server.js 2>&1 | tee mcp-server.log
