#!/bin/bash

# COMPREHENSIVE SECURITY AUDIT SCRIPT
# Checks for common security vulnerabilities

echo "🔐 COMPREHENSIVE SECURITY AUDIT"
echo "==============================="

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

ISSUES_FOUND=0

echo -e "${BLUE}1. Environment Security Check${NC}"
echo "-----------------------------------"

# Check for sensitive files
if [ -f ".env" ]; then
    echo -e "${GREEN}✓ .env file exists${NC}"
    
    # Check if .env is in .gitignore
    if grep -q "\.env" .gitignore 2>/dev/null; then
        echo -e "${GREEN}✓ .env is in .gitignore${NC}"
    else
        echo -e "${RED}❌ .env is NOT in .gitignore${NC}"
        ((ISSUES_FOUND++))
    fi
else
    echo -e "${YELLOW}⚠ .env file not found${NC}"
fi

# Check for hardcoded secrets
echo -e "${BLUE}2. Hardcoded Secrets Check${NC}"
echo "-----------------------------------"

# Search for potential hardcoded secrets
SECRET_PATTERNS=("password" "secret" "key" "token" "api_key")
for pattern in "${SECRET_PATTERNS[@]}"; do
    found=$(grep -r -i "$pattern.*=" src/ --include="*.ts" --include="*.js" 2>/dev/null | grep -v "process.env" | wc -l)
    if [ "$found" -gt 0 ]; then
        echo -e "${RED}❌ Found $found potential hardcoded $pattern(s)${NC}"
        ((ISSUES_FOUND++))
    else
        echo -e "${GREEN}✓ No hardcoded $pattern found${NC}"
    fi
done

echo -e "${BLUE}3. Dependencies Security Check${NC}"
echo "-----------------------------------"

# Run npm audit
if command -v npm &> /dev/null; then
    echo "Running npm audit..."
    npm audit --audit-level moderate > /tmp/npm_audit.log 2>&1
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✓ No high-severity vulnerabilities found${NC}"
    else
        echo -e "${RED}❌ Security vulnerabilities found in dependencies${NC}"
        echo "Run 'npm audit' for details"
        ((ISSUES_FOUND++))
    fi
else
    echo -e "${YELLOW}⚠ npm not found, skipping dependency audit${NC}"
fi

echo -e "${BLUE}4. File Permissions Check${NC}"
echo "-----------------------------------"

# Check for overly permissive files
if find . -type f -perm 777 2>/dev/null | grep -q .; then
    echo -e "${RED}❌ Found files with 777 permissions${NC}"
    ((ISSUES_FOUND++))
else
    echo -e "${GREEN}✓ No overly permissive files found${NC}"
fi

echo -e "${BLUE}5. SSL/TLS Configuration${NC}"
echo "-----------------------------------"

# Check if HTTPS is enforced
if grep -q "https://" package.json 2>/dev/null; then
    echo -e "${GREEN}✓ HTTPS references found in configuration${NC}"
else
    echo -e "${YELLOW}⚠ Consider enforcing HTTPS${NC}"
fi

echo -e "${BLUE}6. Database Security${NC}"
echo "-----------------------------------"

# Check for secure database connection
if [ -f ".env" ] && grep -q "DATABASE_URL.*ssl=true" .env; then
    echo -e "${GREEN}✓ SSL enabled for database connection${NC}"
else
    echo -e "${YELLOW}⚠ Consider enabling SSL for database connections${NC}"
fi

echo -e "${BLUE}7. API Security${NC}"
echo "-----------------------------------"

# Check for CORS configuration
if grep -q "cors" src/ -r 2>/dev/null; then
    echo -e "${GREEN}✓ CORS configuration found${NC}"
else
    echo -e "${YELLOW}⚠ CORS configuration not found${NC}"
fi

# Check for rate limiting
if grep -q "rate.*limit" src/ -r 2>/dev/null; then
    echo -e "${GREEN}✓ Rate limiting implementation found${NC}"
else
    echo -e "${YELLOW}⚠ Consider implementing rate limiting${NC}"
fi

echo ""
echo "==============================="
if [ $ISSUES_FOUND -eq 0 ]; then
    echo -e "${GREEN}🎉 SECURITY AUDIT PASSED!${NC}"
    echo -e "${GREEN}No critical security issues found${NC}"
else
    echo -e "${RED}⚠ SECURITY ISSUES FOUND: $ISSUES_FOUND${NC}"
    echo -e "${YELLOW}Please review and fix the issues above${NC}"
fi
echo "==============================="

echo ""
echo "📋 Security Recommendations:"
echo "• Use strong, unique passwords"
echo "• Enable 2FA for all accounts"
echo "• Keep dependencies up to date"
echo "• Use HTTPS in production"
echo "• Implement proper input validation"
echo "• Set up monitoring and logging"
echo "• Regular security audits"
