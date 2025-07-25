#!/bin/bash

# 🎯 SNAKKAZ Quick Fix for 503 Error
# Emergency commands to get server running

echo "🚨 SNAKKAZ Emergency 503 Fix"
echo "============================"

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${RED}🚨 EMERGENCY FIX - Run these commands in cPanel terminal:${NC}"
echo ""

echo -e "${YELLOW}1. Navigate to correct directory:${NC}"
echo "cd /home/snakqsqe/mcp.snakkaz.com"
echo ""

echo -e "${YELLOW}2. Kill any background processes:${NC}"
echo "pkill -f simplified-server"
echo "pkill -f snakkaz-mcp-server"
echo "pkill -f 'node.*3000'"
echo ""

echo -e "${YELLOW}3. Activate virtual environment:${NC}"
echo "source /home/snakqsqe/nodevenv/mcp.snakkaz.com/19/bin/activate"
echo ""

echo -e "${YELLOW}4. Install dependencies (if needed):${NC}"
echo "npm install --production"
echo ""

echo -e "${YELLOW}5. Test server manually first:${NC}"
echo "node simplified-server.js"
echo "(Press Ctrl+C to stop after testing)"
echo ""

echo -e "${YELLOW}6. If manual test works, update cPanel:${NC}"
echo "- Go to cPanel Node.js App"
echo "- Set startup file to: simplified-server.js"
echo "- Add environment variables:"
echo "  DOMAIN=mcp.snakkaz.com"
echo "  NODE_ENV=production"
echo "  PORT=3000"
echo "- Click SAVE then RESTART"
echo ""

echo -e "${YELLOW}7. Test endpoints:${NC}"
echo "curl https://mcp.snakkaz.com/api/health"
echo "curl https://mcp.snakkaz.com/"
echo ""

echo -e "${GREEN}🎯 Expected result:${NC}"
echo "✅ https://mcp.snakkaz.com/api/health should return JSON response"
echo "✅ https://mcp.snakkaz.com/ should return HTML page"
echo ""

echo -e "${BLUE}📱 Full test commands for copy/paste:${NC}"
echo "cd /home/snakqsqe/mcp.snakkaz.com && pkill -f simplified-server && pkill -f snakkaz-mcp-server && source /home/snakqsqe/nodevenv/mcp.snakkaz.com/19/bin/activate && npm install --production"

echo -e "\n${GREEN}🚀 Emergency fix guide complete!${NC}"
