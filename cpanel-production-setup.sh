#!/bin/bash

# 🎯 SNAKKAZ cPanel Production Setup & Restart Guide
# Step-by-step instructions for fixing 503 error

echo "🎯 SNAKKAZ cPanel Production Setup"
echo "==================================="

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
NC='\033[0m'

echo -e "${BLUE}🚀 STEP-BY-STEP GUIDE TO FIX 503 ERROR${NC}"
echo ""

echo -e "${YELLOW}📍 STEP 1: Kill Background Processes${NC}"
echo "Current background Node.js processes:"
ps aux | grep -E "(simplified-server|snakkaz-mcp-server|node)" | grep -v grep | head -5

echo ""
echo "To kill background processes, run:"
echo "pkill -f 'simplified-server'"
echo "pkill -f 'snakkaz-mcp-server'"
echo "pkill -f 'node.*server'"

echo ""
read -p "Press Enter to continue after killing background processes..."

echo -e "\n${YELLOW}📍 STEP 2: Verify Environment${NC}"
echo "Current directory: $(pwd)"
echo "Required files check:"
for file in simplified-server.js package.json .env; do
    if [ -f "$file" ]; then
        echo -e "${GREEN}✅ $file exists${NC}"
    else
        echo -e "${RED}❌ $file missing${NC}"
    fi
done

echo -e "\n${YELLOW}📍 STEP 3: Install Dependencies${NC}"
echo "Running npm install to ensure all dependencies are present..."
if npm install; then
    echo -e "${GREEN}✅ Dependencies installed successfully${NC}"
else
    echo -e "${RED}❌ Dependency installation failed${NC}"
    echo "Try: npm install --production"
fi

echo -e "\n${YELLOW}📍 STEP 4: Test Local Server${NC}"
echo "Testing if server can start locally..."
echo "Starting simplified-server.js for 5 seconds..."

# Start server in background for testing
node simplified-server.js &
SERVER_PID=$!
sleep 3

# Test if it's responding
if curl -s http://localhost:3000/api/health > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Local server test successful${NC}"
else
    echo -e "${RED}❌ Local server test failed${NC}"
fi

# Kill test server
kill $SERVER_PID 2>/dev/null
sleep 1

echo -e "\n${YELLOW}📍 STEP 5: cPanel Configuration${NC}"
echo "Next steps to do in cPanel:"
echo ""
echo -e "${BLUE}1. Go to Node.js App in cPanel${NC}"
echo -e "${BLUE}2. Find your mcp.snakkaz.com application${NC}"
echo -e "${BLUE}3. Set 'Application startup file' to: simplified-server.js${NC}"
echo -e "${BLUE}4. Verify environment variables:${NC}"
echo "   - DOMAIN = mcp.snakkaz.com"
echo "   - NODE_ENV = production"
echo "   - PORT = 3000"
echo -e "${BLUE}5. Click 'SAVE' button${NC}"
echo -e "${BLUE}6. Click 'RESTART' button${NC}"

echo ""
read -p "Press Enter after completing cPanel configuration..."

echo -e "\n${YELLOW}📍 STEP 6: Test Public Endpoints${NC}"
echo "Testing public domain endpoints..."

sleep 5  # Give server time to start

echo -n "Testing https://mcp.snakkaz.com/api/health: "
if curl -s -f https://mcp.snakkaz.com/api/health > /dev/null 2>&1; then
    echo -e "${GREEN}✅ SUCCESS!${NC}"
    echo "Response:"
    curl -s https://mcp.snakkaz.com/api/health | head -3
else
    echo -e "${RED}❌ Still getting errors${NC}"
    echo "Response:"
    curl -s https://mcp.snakkaz.com/api/health | head -5
fi

echo ""
echo -n "Testing https://mcp.snakkaz.com/ (index page): "
if curl -s -f https://mcp.snakkaz.com/ > /dev/null 2>&1; then
    echo -e "${GREEN}✅ SUCCESS!${NC}"
else
    echo -e "${RED}❌ Still getting errors${NC}"
fi

echo -e "\n${PURPLE}🎯 FINAL STATUS CHECK${NC}"
echo "====================="

if curl -s -f https://mcp.snakkaz.com/api/health > /dev/null 2>&1; then
    echo -e "${GREEN}🎉 SUCCESS! Server is running correctly${NC}"
    echo "✅ mcp.snakkaz.com is live and responding"
    echo "✅ API endpoints are working"
    echo ""
    echo -e "${BLUE}Next steps:${NC}"
    echo "1. Test chat functionality"
    echo "2. Test MCP endpoints"
    echo "3. Launch to Norwegian tech community!"
else
    echo -e "${RED}❌ Still having issues${NC}"
    echo ""
    echo -e "${YELLOW}Troubleshooting:${NC}"
    echo "1. Check cPanel error logs"
    echo "2. Verify Node.js version compatibility"
    echo "3. Try using snakkaz-mcp-server.js instead"
    echo "4. Contact hosting support if issues persist"
fi

echo -e "\n${GREEN}🚀 Setup script completed!${NC}"
