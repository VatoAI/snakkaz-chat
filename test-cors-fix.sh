#!/bin/bash

# 🧪 TEST SCRIPT - After uploading CORS fix to mcp.snakkaz.com

echo "🚀 Testing SnakkaZ MCP API after CORS fix upload..."
echo "📅 $(date)"
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}Testing API endpoints...${NC}"

# Test 1: Basic API endpoint existence
echo "1. Testing https://mcp.snakkaz.com/api/health"
response=$(curl -s -o /dev/null -w "%{http_code}" https://mcp.snakkaz.com/api/health)
if [ "$response" = "200" ]; then
    echo -e "   ${GREEN}✅ API endpoint working (200 OK)${NC}"
else
    echo -e "   ${RED}❌ API endpoint failed (HTTP $response)${NC}"
fi

# Test 2: CORS headers for snakkaz.com
echo "2. Testing CORS for https://snakkaz.com origin"
cors_header=$(curl -s -H "Origin: https://snakkaz.com" -I https://mcp.snakkaz.com/api/health | grep -i "access-control-allow-origin")
if [[ $cors_header == *"https://snakkaz.com"* ]]; then
    echo -e "   ${GREEN}✅ CORS allows snakkaz.com${NC}"
else
    echo -e "   ${RED}❌ CORS does not allow snakkaz.com${NC}"
    echo "   Current header: $cors_header"
fi

# Test 3: CORS headers for www.snakkaz.com
echo "3. Testing CORS for https://www.snakkaz.com origin"
cors_header_www=$(curl -s -H "Origin: https://www.snakkaz.com" -I https://mcp.snakkaz.com/api/health | grep -i "access-control-allow-origin")
if [[ $cors_header_www == *"https://www.snakkaz.com"* ]]; then
    echo -e "   ${GREEN}✅ CORS allows www.snakkaz.com${NC}"
else
    echo -e "   ${RED}❌ CORS does not allow www.snakkaz.com${NC}"
    echo "   Current header: $cors_header_www"
fi

# Test 4: JSON response content
echo "4. Testing API response content"
api_response=$(curl -s https://mcp.snakkaz.com/api/health)
if [[ $api_response == *"status"* && $api_response == *"healthy"* ]]; then
    echo -e "   ${GREEN}✅ API returns valid JSON response${NC}"
    echo "   Response: $api_response"
else
    echo -e "   ${RED}❌ API response invalid or missing${NC}"
    echo "   Response: $api_response"
fi

echo ""
echo -e "${BLUE}Summary:${NC}"
echo "After uploading the CORS fix to mcp.snakkaz.com, all tests above should show ✅"
echo "If any show ❌, the zip file may not have been uploaded to the correct location."
echo ""
echo -e "${GREEN}Expected result: snakkaz.com app can call mcp.snakkaz.com API without errors!${NC}"
