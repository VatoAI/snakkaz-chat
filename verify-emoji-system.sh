#!/bin/bash
# filepath: /workspaces/snakkaz-chat/verify-emoji-system.sh

# Script to verify the complete emoji system functionality
# Created: May 25, 2025

echo "🔍 Verifying Complete Emoji System..."

# Define color codes
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Check site accessibility
echo -e "\n${BLUE}Checking site accessibility...${NC}"
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" https://www.snakkaz.com)

if [ "$HTTP_CODE" -eq 200 ]; then
    echo -e "${GREEN}✅ Site is accessible (HTTP 200 OK)${NC}"
else
    echo -e "${RED}❌ Site returned HTTP code: $HTTP_CODE${NC}"
fi

# Download HTML to check for required resources
CONTENT=$(curl -s https://www.snakkaz.com)

# Check for build hash
if [[ $CONTENT == *"index-"*".js"* ]]; then
    BUILD_HASH=$(echo $CONTENT | grep -o 'index-[A-Za-z0-9]\+\.js' | head -1)
    echo -e "${GREEN}✅ Build detected: $BUILD_HASH${NC}"
    
    # Check if this is the expected build hash
    if [[ $BUILD_HASH == "index-BThXBval.js" ]]; then
        echo -e "${GREEN}✅ This is the expected build with emoji enhancements${NC}"
    else
        echo -e "${YELLOW}⚠️ Build hash doesn't match expected hash (index-BThXBval.js)${NC}"
    fi
else
    echo -e "${RED}❌ Could not detect build hash${NC}"
fi

echo -e "\n${BLUE}Checking for emoji system files...${NC}"

# Array of required JS modules for emoji functionality
EXPECTED_MODULES=(
    "customEmojiUtils"
    "emojiSearchUtils" 
    "emojiAnalyticsUtils"
    "emojiPackUtils"
    "EmojiSearch"
    "EmojiAnalytics"
    "EmojiPackBrowser"
)

# Check if the build file contains the expected modules
echo -e "${BLUE}Checking for emoji modules in build file...${NC}"

for module in "${EXPECTED_MODULES[@]}"; do
    BUILD_CONTENT=$(curl -s "https://www.snakkaz.com/$BUILD_HASH")
    if [[ $BUILD_CONTENT == *"$module"* ]]; then
        echo -e "${GREEN}✅ Found module: $module${NC}"
    else
        echo -e "${YELLOW}⚠️ Module not found: $module${NC}"
    fi
done

# Check for unwanted references (should be removed)
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
    "emoji_analytics"
    "emoji_packs"
    "pack_emojis"
)

for endpoint in "${API_ENDPOINTS[@]}"; do
    if curl -s -I "https://api.snakkaz.com/$endpoint" | grep -q "HTTP/"; then
        echo -e "${GREEN}✅ API endpoint /$endpoint is available${NC}"
    else
        echo -e "${YELLOW}⚠️ Could not verify API endpoint /$endpoint${NC}"
    fi
done

# Check database tables
echo -e "\n${BLUE}Checking database configuration...${NC}"
echo -e "${YELLOW}Note: This requires access to the database and Supabase credentials${NC}"
echo -e "${YELLOW}Run the following commands manually if you have access:${NC}"
echo -e "  supabase db remote execute \"SELECT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'emoji_analytics');\""
echo -e "  supabase db remote execute \"SELECT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'emoji_packs');\""
echo -e "  supabase db remote execute \"SELECT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'pack_emojis');\""

# Manual checks reminder
echo -e "\n${BLUE}Manual checks required:${NC}"
echo -e "${YELLOW}1. Log in and check if emoji upload works${NC}"
echo -e "${YELLOW}2. Verify emoji reactions on messages${NC}"
echo -e "${YELLOW}3. Check emoji search functionality${NC}"
echo -e "${YELLOW}4. Test emoji pack browsing and installation${NC}"
echo -e "${YELLOW}5. Verify the emoji analytics dashboard${NC}"

# Summary
echo -e "\n${BLUE}=========================================${NC}"
echo -e "${BLUE}Emoji System Verification Summary${NC}"
echo -e "${BLUE}=========================================${NC}"
echo -e "Date: $(date)"
echo -e "Site Accessibility: $([ "$HTTP_CODE" -eq 200 ] && echo "${GREEN}OK${NC}" || echo "${RED}FAILED${NC}")"
echo -e "Current Build: ${YELLOW}$BUILD_HASH${NC}"
echo -e "Expected Build: ${YELLOW}index-BThXBval.js${NC}"
echo -e "Unwanted References: $([ $CONTENT == *"lovable.dev"* || $CONTENT == *"gpteng.co"* ] && echo "${RED}FOUND${NC}" || echo "${GREEN}NONE${NC}")"

echo -e "\n${BLUE}Next steps:${NC}"
echo "1. Run the database verification queries if you have access"
echo "2. Perform the manual verification steps"
echo "3. If any issues are found, check the deployment logs and fix as needed"
echo "4. Run the migration scripts if database tables are missing"

echo -e "\n${GREEN}Verification completed!${NC}"
