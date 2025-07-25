#!/bin/bash

# 🚀 SNAKKAZ cPanel Cleanup & Production Test Script
# Fjerner lokale configs og setter opp for cPanel production

echo "🧹 SNAKKAZ cPanel Cleanup & Production Setup"
echo "=============================================="

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}📋 Checking current directory and files...${NC}"
pwd
ls -la

echo -e "\n${YELLOW}🔍 Step 1: Checking for localhost references...${NC}"
if grep -r "localhost" . --exclude-dir=node_modules --exclude="*.log" --exclude="*.sh"; then
    echo -e "${RED}⚠️  Found localhost references that should be updated${NC}"
else
    echo -e "${GREEN}✅ No localhost references found${NC}"
fi

echo -e "\n${YELLOW}🔍 Step 2: Checking for port 3001 references (should be 3000)...${NC}"
if grep -r ":3001" . --exclude-dir=node_modules --exclude="*.log" --exclude="*.sh"; then
    echo -e "${RED}⚠️  Found port 3001 references - should be 3000 for cPanel${NC}"
else
    echo -e "${GREEN}✅ No incorrect port references found${NC}"
fi

echo -e "\n${YELLOW}🔍 Step 3: Validating environment variables...${NC}"
echo "Expected environment variables for cPanel:"
echo "- DOMAIN=mcp.snakkaz.com"
echo "- NODE_ENV=production"  
echo "- PORT=3000"
echo ""
if [ -f ".env" ]; then
    echo "Current .env file:"
    cat .env | grep -E "(DOMAIN|NODE_ENV|PORT)" || echo "No matching variables found"
else
    echo -e "${RED}❌ No .env file found${NC}"
fi

echo -e "\n${YELLOW}🔍 Step 4: Checking package.json configuration...${NC}"
if [ -f "package.json" ]; then
    echo "Package.json type configuration:"
    grep -A2 -B2 '"type"' package.json || echo "No type field found"
    echo ""
    echo "Main script configuration:"
    grep -A2 -B2 '"main"' package.json || echo "No main field found"
else
    echo -e "${RED}❌ No package.json found${NC}"
fi

echo -e "\n${YELLOW}🔍 Step 5: Checking startup files...${NC}"
echo "Available server files:"
for file in simplified-server.js snakkaz-mcp-server.js; do
    if [ -f "$file" ]; then
        echo -e "${GREEN}✅ $file exists${NC}"
        echo "   Size: $(wc -l < "$file") lines"
    else
        echo -e "${RED}❌ $file missing${NC}"
    fi
done

echo -e "\n${YELLOW}🔍 Step 6: Testing for running processes...${NC}"
if pgrep -f "simplified-server\|snakkaz-mcp-server" > /dev/null; then
    echo -e "${RED}⚠️  Server processes are running:${NC}"
    ps aux | grep -E "(simplified-server|snakkaz-mcp-server)" | grep -v grep
    echo -e "${YELLOW}💡 These should be stopped before starting via cPanel${NC}"
else
    echo -e "${GREEN}✅ No conflicting server processes running${NC}"
fi

echo -e "\n${YELLOW}🔍 Step 7: Checking critical dependencies...${NC}"
if [ -f "package.json" ]; then
    echo "Checking for required dependencies:"
    required_deps=("express" "cors" "dotenv" "jsonwebtoken" "helmet")
    for dep in "${required_deps[@]}"; do
        if grep -q "\"$dep\"" package.json; then
            echo -e "${GREEN}✅ $dep found${NC}"
        else
            echo -e "${RED}❌ $dep missing${NC}"
        fi
    done
fi

echo -e "\n${BLUE}📝 CLEANUP RECOMMENDATIONS:${NC}"
echo "1. Kill any running background processes"
echo "2. Ensure cPanel Node.js app uses 'simplified-server.js' as startup file"
echo "3. Verify all environment variables are set in cPanel"
echo "4. Restart via cPanel Node.js interface (not manual background)"
echo "5. Test endpoints: https://mcp.snakkaz.com/api/health"

echo -e "\n${GREEN}🎯 Script completed!${NC}"
