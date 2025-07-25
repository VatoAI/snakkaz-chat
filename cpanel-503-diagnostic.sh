#!/bin/bash

# 🔬 SNAKKAZ 503 Error Diagnostic Script
# Comprehensive testing for cPanel deployment issues

echo "🔬 SNAKKAZ 503 Error Diagnostic"
echo "==============================="

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
NC='\033[0m'

DOMAIN="mcp.snakkaz.com"
PORT="3000"

echo -e "${BLUE}🌐 Testing Domain: $DOMAIN${NC}"
echo -e "${BLUE}🔌 Expected Port: $PORT${NC}"
echo ""

echo -e "${YELLOW}🔍 Step 1: DNS Resolution Test...${NC}"
if nslookup $DOMAIN > /dev/null 2>&1; then
    echo -e "${GREEN}✅ DNS resolution successful${NC}"
    nslookup $DOMAIN
else
    echo -e "${RED}❌ DNS resolution failed${NC}"
fi

echo -e "\n${YELLOW}🔍 Step 2: Server Process Check...${NC}"
echo "Checking for Node.js processes:"
if pgrep -f "node" > /dev/null; then
    echo -e "${GREEN}✅ Node.js processes found:${NC}"
    ps aux | grep node | grep -v grep | head -5
else
    echo -e "${RED}❌ No Node.js processes running${NC}"
fi

echo -e "\n${YELLOW}🔍 Step 3: Port Availability Check...${NC}"
if command -v netstat > /dev/null; then
    echo "Checking if port $PORT is in use:"
    if netstat -tulpn 2>/dev/null | grep ":$PORT "; then
        echo -e "${GREEN}✅ Port $PORT is in use${NC}"
        netstat -tulpn 2>/dev/null | grep ":$PORT "
    else
        echo -e "${RED}❌ Port $PORT is not in use${NC}"
    fi
else
    echo "netstat not available, checking with lsof..."
    if command -v lsof > /dev/null; then
        lsof -i :$PORT 2>/dev/null || echo -e "${RED}❌ Port $PORT not in use${NC}"
    fi
fi

echo -e "\n${YELLOW}🔍 Step 4: Local Endpoint Tests...${NC}"
echo "Testing localhost endpoints:"

# Test localhost health endpoint
echo -n "Local health check (localhost:$PORT/api/health): "
if curl -s -f http://localhost:$PORT/api/health > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Success${NC}"
    curl -s http://localhost:$PORT/api/health | head -3
else
    echo -e "${RED}❌ Failed${NC}"
fi

# Test localhost chat endpoint  
echo -n "Local chat check (localhost:$PORT/api/chat): "
if curl -s -f http://localhost:$PORT/api/chat > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Success${NC}"
else
    echo -e "${RED}❌ Failed${NC}"
fi

echo -e "\n${YELLOW}🔍 Step 5: Public Domain Tests...${NC}"
echo "Testing public domain endpoints:"

# Test public health endpoint
echo -n "Public health check (https://$DOMAIN/api/health): "
if curl -s -f https://$DOMAIN/api/health > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Success${NC}"
    curl -s https://$DOMAIN/api/health | head -3
else
    echo -e "${RED}❌ Failed - checking error...${NC}"
    curl -s https://$DOMAIN/api/health | head -5
fi

# Test public index page
echo -n "Public index page (https://$DOMAIN/): "
if curl -s -f https://$DOMAIN/ > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Success${NC}"
else
    echo -e "${RED}❌ Failed - checking error...${NC}"
    curl -s https://$DOMAIN/ | head -5
fi

echo -e "\n${YELLOW}🔍 Step 6: Log File Analysis...${NC}"
if [ -f "server.log" ]; then
    echo "Last 10 lines of server.log:"
    tail -10 server.log
else
    echo "No server.log file found"
fi

if [ -f "stderr.log" ]; then
    echo -e "\nLast 10 lines of stderr.log:"
    tail -10 stderr.log
else
    echo "No stderr.log file found"
fi

echo -e "\n${YELLOW}🔍 Step 7: Environment Check...${NC}"
echo "Environment variables:"
echo "NODE_ENV: ${NODE_ENV:-'not set'}"
echo "PORT: ${PORT:-'not set'}"
echo "DOMAIN: ${DOMAIN:-'not set'}"

echo -e "\n${YELLOW}🔍 Step 8: File Permissions Check...${NC}"
echo "Critical file permissions:"
for file in simplified-server.js snakkaz-mcp-server.js package.json .env index.html; do
    if [ -f "$file" ]; then
        ls -la "$file"
    else
        echo -e "${RED}❌ $file not found${NC}"
    fi
done

echo -e "\n${PURPLE}🎯 DIAGNOSTIC SUMMARY:${NC}"
echo "===================="
echo -e "${BLUE}If you see 503 errors, common causes:${NC}"
echo "1. Node.js app not started via cPanel interface"
echo "2. Background process conflicts with cPanel managed process" 
echo "3. Missing dependencies (run npm install)"
echo "4. Incorrect startup file configuration"
echo "5. Port conflicts or binding issues"
echo ""
echo -e "${BLUE}Recommended fixes:${NC}"
echo "1. Kill background processes: pkill -f 'simplified-server|snakkaz-mcp-server'"
echo "2. Install dependencies: npm install"
echo "3. Set cPanel startup file to: simplified-server.js"
echo "4. Restart via cPanel Node.js interface"
echo "5. Check cPanel error logs"

echo -e "\n${GREEN}🔬 Diagnostic completed!${NC}"
