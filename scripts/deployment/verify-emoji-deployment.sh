#!/bin/bash

# verify-emoji-deployment.sh
# Script to verify that custom emoji functionality is properly deployed
# Created: 25 May 2025

echo "🔍 Verifying Custom Emoji System Deployment..."

# Define color codes
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Check site accessibility
echo -e "${BLUE}Checking site accessibility...${NC}"
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" https://www.snakkaz.com)

if [ "$HTTP_CODE" -eq 200 ]; then
    echo -e "${GREEN}✅ Site is accessible (HTTP 200 OK)${NC}"
else
    echo -e "${RED}❌ Site returned HTTP code: $HTTP_CODE${NC}"
fi

# Check for required files
echo -e "\n${BLUE}Checking for custom emoji system files...${NC}"

# Download HTML to check for required resources
CONTENT=$(curl -s https://www.snakkaz.com)

# Check for custom emoji CSS
if [[ $CONTENT == *"custom-emoji.css"* ]]; then
    echo -e "${GREEN}✅ Custom emoji CSS detected${NC}"
else
    echo -e "${YELLOW}⚠️ Custom emoji CSS not detected${NC}"
fi

# Check for build hash (to confirm new deployment)
if [[ $CONTENT == *"index-"*".js"* ]]; then
    BUILD_HASH=$(echo $CONTENT | grep -o 'index-[A-Za-z0-9]\+\.js' | head -1)
    echo -e "${GREEN}✅ Build detected: $BUILD_HASH${NC}"
else
    echo -e "${RED}❌ Could not detect build hash${NC}"
fi

# Check for Lovable references (should be removed)
echo -e "\n${BLUE}Checking for unwanted references...${NC}"
if [[ $CONTENT == *"lovable.dev"* || $CONTENT == *"gpteng.co"* ]]; then
    echo -e "${RED}❌ Found unwanted references in the page content${NC}"
else
    echo -e "${GREEN}✅ No unwanted references found${NC}"
fi

# Check API endpoints
echo -e "\n${BLUE}Checking API endpoints...${NC}"
API_ENDPOINTS=(
    "custom_emojis"
    "message_reactions"
)

for endpoint in "${API_ENDPOINTS[@]}"; do
    if curl -s -I "https://api.snakkaz.com/$endpoint" | grep -q "HTTP/"; then
        echo -e "${GREEN}✅ API endpoint /$endpoint is available${NC}"
    else
        echo -e "${YELLOW}⚠️ Could not verify API endpoint /$endpoint${NC}"
    fi
done

# Summary
echo -e "\n${BLUE}===========================================${NC}"
echo -e "${BLUE}Custom Emoji System Deployment Verification${NC}"
echo -e "${BLUE}===========================================${NC}"
echo -e "Date: $(date)"
echo -e "Site Accessibility: $([ "$HTTP_CODE" -eq 200 ] && echo "${GREEN}OK${NC}" || echo "${RED}FAILED${NC}")"
echo -e "Current Build: ${YELLOW}$BUILD_HASH${NC}"
echo -e "Unwanted References: $([ $CONTENT == *"lovable.dev"* || $CONTENT == *"gpteng.co"* ] && echo "${RED}FOUND${NC}" || echo "${GREEN}NONE${NC}")"

echo -e "\n${BLUE}Next steps:${NC}"
echo "1. Login and test emoji upload functionality"
echo "2. Verify emoji reactions on messages"
echo "3. Test emoji shortcodes in message text"
echo "4. Complete any remaining manual deployment steps if necessary"

echo -e "\n${GREEN}Verification completed!${NC}"
