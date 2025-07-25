#!/bin/bash

echo "🚀 SnakkaZ MCP API Routing Fix"
echo "==============================="

echo "🔍 Testing API endpoints through different routing methods..."

# Test different API paths
echo "1. Testing /api/health directly:"
curl -s -w "Status: %{http_code}\n" https://mcp.snakkaz.com/api/health | head -3
echo ""

echo "2. Testing with explicit Node.js routing:"
curl -s -w "Status: %{http_code}\n" https://mcp.snakkaz.com/app/api/health | head -3
echo ""

echo "3. Testing subdomain routing:"
curl -s -w "Status: %{http_code}\n" https://api.mcp.snakkaz.com/health | head -3
echo ""

echo "4. Testing with different endpoint structure:"
curl -s -w "Status: %{http_code}\n" https://mcp.snakkaz.com/health | head -3
echo ""

echo "🎯 API Routing Analysis Complete!"
echo "🔧 Next: Configure cPanel Node.js app routing"
