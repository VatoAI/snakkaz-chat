#!/bin/bash

# 🚨 SNAKKAZ EMERGENCY 503 FINAL FIX
# This is the ULTIMATE solution for cPanel routing issues

echo "🚨 SNAKKAZ EMERGENCY 503 FINAL FIX"
echo "=================================="

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m'

echo -e "${RED}🎯 CRITICAL ISSUE IDENTIFIED:${NC}"
echo "The 503 error is a cPanel-specific routing problem."
echo "Your Node.js app exists but cPanel isn't routing domain traffic to it."
echo ""

echo -e "${YELLOW}🔥 EMERGENCY COMMANDS - Run these NOW:${NC}"
echo ""

echo -e "${BLUE}Step 1: Check current Node.js processes${NC}"
echo "ps aux | grep node"
echo ""

echo -e "${BLUE}Step 2: Kill ALL Node.js processes${NC}"
echo "pkill -f node"
echo "pkill -f simplified-server"
echo "pkill -f snakkaz-mcp-server"
echo ""

echo -e "${BLUE}Step 3: Check if port 3000 is free${NC}"
echo "netstat -tulpn | grep 3000"
echo ""

echo -e "${BLUE}Step 4: Start server manually in foreground (TEST)${NC}"
echo "cd /home/snakqsqe/mcp.snakkaz.com"
echo "source /home/snakqsqe/nodevenv/mcp.snakkaz.com/19/bin/activate"
echo "npm install --production"
echo "node simplified-server.js"
echo ""
echo "Leave this running and test in another terminal:"
echo "curl http://localhost:3000/api/health"
echo ""

echo -e "${PURPLE}🚨 CRITICAL cPanel FIXES:${NC}"
echo ""

echo -e "${CYAN}Option A: Fix Node.js App Configuration${NC}"
echo "1. Go to cPanel → Node.js Selector"
echo "2. Make sure mcp.snakkaz.com app exists"
echo "3. Click on mcp.snakkaz.com application"
echo "4. Verify settings:"
echo "   - App Root: /home/snakqsqe/mcp.snakkaz.com"
echo "   - App URL: mcp.snakkaz.com"
echo "   - App startup file: simplified-server.js"
echo "   - Node.js version: 19.x"
echo "5. Click 'RESTART' (not just start)"
echo ""

echo -e "${CYAN}Option B: Create .htaccess redirect${NC}"
echo "Create /home/snakqsqe/public_html/mcp/.htaccess:"
echo "RewriteEngine On"
echo "RewriteRule ^(.*)$ http://localhost:3000/\$1 [P,L]"
echo ""

echo -e "${CYAN}Option C: Use subdomain instead${NC}"
echo "Test if app.mcp.snakkaz.com works instead"
echo ""

echo -e "${RED}🎯 ROOT CAUSE ANALYSIS:${NC}"
echo "Problem: cPanel is not routing mcp.snakkaz.com to your Node.js app"
echo "Evidence: Both / and /api/health return same 503 HTML"
echo "Solution: Force cPanel to recognize and route to Node.js app"
echo ""

echo -e "${GREEN}📋 COPY-PASTE COMMANDS:${NC}"
echo ""
echo "# Kill all Node processes:"
echo "pkill -f node; pkill -f simplified-server; pkill -f snakkaz-mcp-server"
echo ""
echo "# Test manual startup:"
echo "cd /home/snakqsqe/mcp.snakkaz.com && source /home/snakqsqe/nodevenv/mcp.snakkaz.com/19/bin/activate && npm install --production && node simplified-server.js"
echo ""
echo "# Test local endpoint:"
echo "curl http://localhost:3000/api/health"
echo ""

echo -e "${YELLOW}🚀 EXPECTED RESULTS:${NC}"
echo "✅ Manual server start should show: 'SnakkaZ Simplified Server running on port 3000'"
echo "✅ Local curl should return JSON (not HTML)"
echo "✅ After cPanel restart, public domain should work"
echo ""

echo -e "${PURPLE}💡 PRO TIP:${NC}"
echo "If manual startup works but public domain doesn't,"
echo "the issue is 100% cPanel routing configuration."
echo "Contact hosting support with these details."
echo ""

echo -e "${GREEN}🎯 Emergency fix ready - execute commands now!${NC}"
