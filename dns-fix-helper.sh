#!/bin/bash

echo "🚨 DNS MX Circular Reference Fix Helper 🚨"
echo "============================================"
echo "Date: $(date)"
echo

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${YELLOW}STEP 1: Current Problem Verification${NC}"
echo "Checking for circular MX reference..."
echo

mx_result=$(dig +short MX mail.snakkaz.com)
if [ -n "$mx_result" ]; then
    echo -e "${RED}❌ CONFIRMED: Circular MX reference exists${NC}"
    echo "   mail.snakkaz.com MX record: $mx_result"
    echo -e "${RED}   This MUST be deleted!${NC}"
    NEEDS_FIX=true
else
    echo -e "${GREEN}✅ No circular MX reference found${NC}"
    NEEDS_FIX=false
fi

echo
echo -e "${YELLOW}STEP 2: What you need to fix manually${NC}"
echo "Since I can't access your DNS panel, here's exactly what to do:"
echo
echo -e "${BLUE}1. Login to Namecheap account${NC}"
echo -e "${BLUE}2. Go to Domain List → snakkaz.com → Manage${NC}"
echo -e "${BLUE}3. Click 'Advanced DNS'${NC}"
echo -e "${BLUE}4. Find this record and DELETE it:${NC}"
echo -e "${RED}   Type: MX${NC}"
echo -e "${RED}   Host: mail${NC}"
echo -e "${RED}   Value: snakkaz.com${NC}"
echo -e "${RED}   Priority: 10${NC}"
echo
echo -e "${GREEN}5. KEEP this record (don't delete):${NC}"
echo -e "${GREEN}   Type: A${NC}"
echo -e "${GREEN}   Host: mail${NC}"
echo -e "${GREEN}   Value: 162.0.229.214${NC}"
echo

echo -e "${YELLOW}STEP 3: Verification Commands${NC}"
echo "After making the DNS change, run these commands to verify:"
echo
echo "# Check that mail.snakkaz.com has NO MX records (should be empty):"
echo "dig MX mail.snakkaz.com"
echo
echo "# Check that mail.snakkaz.com still has the A record:"
echo "dig A mail.snakkaz.com"
echo
echo "# Check that main domain MX records are still correct:"
echo "dig MX snakkaz.com"
echo

if [ "$NEEDS_FIX" = true ]; then
    echo -e "${RED}⚠️  DNS PROPAGATION NOTE:${NC}"
    echo "Changes may take 1-24 hours to propagate worldwide"
    echo "Run this script again in 2-4 hours to verify the fix"
    echo
    echo -e "${YELLOW}🔄 Want to monitor the fix? Run:${NC}"
    echo "watch -n 300 'dig +short MX mail.snakkaz.com'"
    echo "(Checks every 5 minutes until empty result confirms fix)"
else
    echo -e "${GREEN}🎉 DNS configuration looks correct!${NC}"
    echo "No circular MX reference found."
fi

echo
echo -e "${BLUE}📚 Documentation:${NC}"
echo "- Full details: MAIL-MX-UPDATE-MAY24-2025.md"
echo "- Fix guide: DNS-MX-CIRCULAR-FIX.md"
echo
echo "Need help? The issue is documented in the workspace files above."
