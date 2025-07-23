#!/bin/bash
# SnakkaZ Beta Quick Validation Script
# Run this script to perform essential pre-launch checks

echo "🚀 SnakkaZ Beta Launch Validation Script"
echo "========================================"

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to check if a URL is accessible
check_url() {
    local url=$1
    local description=$2
    
    echo -n "Checking $description... "
    if curl -s --head "$url" | head -n 1 | grep -q "200 OK"; then
        echo -e "${GREEN}✓${NC}"
        return 0
    else
        echo -e "${RED}✗${NC}"
        return 1
    fi
}

# Function to check SSL certificate
check_ssl() {
    local domain=$1
    echo -n "Checking SSL certificate for $domain... "
    
    if echo | openssl s_client -servername "$domain" -connect "$domain:443" 2>/dev/null | openssl x509 -noout -dates 2>/dev/null; then
        echo -e "${GREEN}✓${NC}"
        return 0
    else
        echo -e "${RED}✗${NC}"
        return 1
    fi
}

echo ""
echo "1. 🌐 Infrastructure Checks"
echo "=========================="

# Check main domain
check_url "https://snakkaz.com" "Main site"
check_url "https://dash.snakkaz.com" "Dashboard subdomain"
check_url "https://business.snakkaz.com" "Business subdomain"

# Check SSL certificates
check_ssl "snakkaz.com"

echo ""
echo "2. 🔧 Build & Test Status"
echo "======================"

# Run core unit tests
echo "Running unit tests..."
if npm test -- --testPathPattern="encryption|chatService" --passWithNoTests; then
    echo -e "${GREEN}✓ Core unit tests passing${NC}"
else
    echo -e "${RED}✗ Unit tests failing${NC}"
fi

# Check build status
echo "Checking build status..."
if npm run build --silent; then
    echo -e "${GREEN}✓ Build successful${NC}"
else
    echo -e "${RED}✗ Build failed${NC}"
fi

echo ""
echo "3. 📋 Manual Testing Checklist"
echo "============================"
echo "Please verify the following manually:"
echo ""
echo "Essential (🔴 Blocking):"
echo "  □ User registration works"
echo "  □ User login works"
echo "  □ Basic messaging works"
echo "  □ Mobile responsive design"
echo "  □ HTTPS enforced"
echo ""
echo "Important (🟡 Should work):"
echo "  □ WebRTC calling"
echo "  □ Group chat creation"
echo "  □ File sharing"
echo "  □ Real-time notifications"
echo ""
echo "Nice-to-have (⚪ Can be fixed post-launch):"
echo "  □ Advanced settings"
echo "  □ Dark/light theme"
echo "  □ Integration features"
echo ""

echo "4. 🚨 Security Checklist"
echo "====================="
echo "Manual security verification needed:"
echo "  □ No sensitive data in browser console"
echo "  □ CSP headers active"
echo "  □ Authentication tokens secure"
echo "  □ Input validation working"
echo ""

echo "5. 📊 Beta Launch Decision"
echo "========================"
echo "Launch criteria:"
echo "  - All 🔴 Essential items must be ✓"
echo "  - 80%+ of 🟡 Important items should be ✓"
echo "  - No critical security issues"
echo ""
echo -e "${YELLOW}Manual testing required before final launch decision!${NC}"
echo ""
echo "Next steps:"
echo "1. Complete manual testing checklist above"
echo "2. Review BETA-ACCEPTANCE-TESTING.md for detailed tests"
echo "3. Make launch decision based on results"
echo ""
echo "🎯 Good luck with your beta launch!"
