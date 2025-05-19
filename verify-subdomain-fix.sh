#!/bin/bash
# verify-subdomain-fix.sh
#
# This script verifies that the subdomain root and ping access fix is working correctly.

# Define colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}=====================================================${NC}"
echo -e "${BLUE}   SNAKKAZ CHAT: SUBDOMAIN FIX VERIFICATION          ${NC}"
echo -e "${BLUE}=====================================================${NC}"
echo

# Function to check if a directory and required files exist
check_directory() {
    local dir=$1
    local success=true
    
    echo -e "${YELLOW}Checking $dir subdomain directory:${NC}"
    
    # Check directory
    if [ -d "$dir" ]; then
        echo -e "  - Directory: ${GREEN}✓ Exists${NC}"
    else
        echo -e "  - Directory: ${RED}✗ Missing${NC}"
        success=false
    fi
    
    # Check ping.json
    if [ -f "$dir/ping.json" ]; then
        echo -e "  - ping.json: ${GREEN}✓ Exists${NC}"
    else
        echo -e "  - ping.json: ${RED}✗ Missing${NC}"
        success=false
    fi
    
    # Check index.json
    if [ -f "$dir/index.json" ]; then
        echo -e "  - index.json: ${GREEN}✓ Exists${NC}"
    else
        echo -e "  - index.json: ${RED}✗ Missing${NC}"
        success=false
    fi
    
    # Check index.html
    if [ -f "$dir/index.html" ]; then
        echo -e "  - index.html: ${GREEN}✓ Exists${NC}"
    else
        echo -e "  - index.html: ${RED}✗ Missing${NC}"
        success=false
    fi
    
    # Check .htaccess
    if [ -f "$dir/.htaccess" ]; then
        echo -e "  - .htaccess: ${GREEN}✓ Exists${NC}"
    else
        echo -e "  - .htaccess: ${RED}✗ Missing${NC}"
        success=false
    fi
    
    # Check for RewriteRule in .htaccess
    if [ -f "$dir/.htaccess" ] && grep -q "RewriteRule \^$" "$dir/.htaccess"; then
        echo -e "  - Root RewriteRule: ${GREEN}✓ Configured${NC}"
    else
        echo -e "  - Root RewriteRule: ${RED}✗ Missing${NC}"
        success=false
    fi
    
    if [ "$success" = true ]; then
        echo -e "  ${GREEN}✓ $dir subdomain setup is complete!${NC}"
    else
        echo -e "  ${RED}✗ $dir subdomain setup is incomplete${NC}"
    fi
    echo
}

# Check .htaccess in root directory
echo -e "${YELLOW}Checking root .htaccess:${NC}"
if [ -f ".htaccess" ]; then
    echo -e "  - File: ${GREEN}✓ Exists${NC}"
    
    # Check for subdomain root handling
    if grep -q "RewriteRule \^(analytics|business|dash|docs)\.snakkaz\.com$ -" ".htaccess"; then
        echo -e "  - Subdomain root handling: ${GREEN}✓ Configured${NC}"
    else
        echo -e "  - Subdomain root handling: ${RED}✗ Missing${NC}"
    fi
else
    echo -e "  - File: ${RED}✗ Missing${NC}"
fi
echo

# Check if fix-subdomain-pings.js exists and contains root handling
echo -e "${YELLOW}Checking subdomain handler script:${NC}"
if [ -f "fix-subdomain-pings.js" ]; then
    echo -e "  - File: ${GREEN}✓ Exists${NC}"
    
    # Check for isRootRequest function
    if grep -q "isRootRequest" "fix-subdomain-pings.js"; then
        echo -e "  - Root request handling: ${GREEN}✓ Configured${NC}"
    else
        echo -e "  - Root request handling: ${RED}✗ Missing${NC}"
    fi
else
    echo -e "  - File: ${RED}✗ Missing${NC}"
fi
echo

# Check subdomain directories
for subdomain in analytics business dash docs; do
    check_directory "$subdomain"
done

echo -e "${BLUE}=====================================================${NC}"
echo -e "${BLUE}   VERIFICATION COMPLETE                            ${NC}"
echo -e "${BLUE}=====================================================${NC}"
echo
