#!/bin/bash

# EMAIL SYSTEM HEALTH CHECK
# Monitors email system functionality

echo "📧 EMAIL SYSTEM HEALTH CHECK"
echo "============================"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Check environment variables
echo "🔍 Checking email configuration..."

if [ -z "$SMTP_HOST" ]; then
    echo -e "${RED}❌ SMTP_HOST not configured${NC}"
else
    echo -e "${GREEN}✓ SMTP_HOST: $SMTP_HOST${NC}"
fi

if [ -z "$SMTP_USER" ]; then
    echo -e "${RED}❌ SMTP_USER not configured${NC}"
else
    echo -e "${GREEN}✓ SMTP_USER: $SMTP_USER${NC}"
fi

if [ -z "$SMTP_PASS" ]; then
    echo -e "${RED}❌ SMTP_PASS not configured${NC}"
else
    echo -e "${GREEN}✓ SMTP_PASS: [CONFIGURED]${NC}"
fi

echo ""
echo "🧪 Running email system test..."

# Run the email test
cd /workspaces/snakkaz-chat
node scripts/testing/test-email-system.mjs

echo ""
echo "📊 Email Health Summary:"
echo "- Configuration: Check above for missing values"
echo "- Connection: See test results above"
echo "- Recommendations: Use app passwords for Gmail"
echo ""
echo "🔧 Next steps:"
echo "1. Configure missing environment variables"
echo "2. Test with a real email"
echo "3. Set up email monitoring alerts"
