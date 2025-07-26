#!/bin/bash

# FASE 5 Security Scanner
# Automated security analysis and vulnerability detection

echo "🔒 FASE 5 Security Scanner - Snakkaz Chat"
echo "========================================"
echo "Starting comprehensive security analysis..."
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Create security report directory
mkdir -p security-reports
REPORT_DIR="security-reports"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
REPORT_FILE="$REPORT_DIR/security-scan-$TIMESTAMP.txt"

echo "Security Scan Report - $(date)" > $REPORT_FILE
echo "=============================================" >> $REPORT_FILE
echo "" >> $REPORT_FILE

# Function to log results
log_result() {
    echo "$1" | tee -a $REPORT_FILE
}

# 1. NPM Audit - Check for known vulnerabilities
echo -e "${YELLOW}📦 Running NPM Security Audit...${NC}"
log_result "1. NPM SECURITY AUDIT"
log_result "====================="
npm audit --audit-level moderate >> $REPORT_FILE 2>&1
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ No critical vulnerabilities found${NC}"
    log_result "✅ NPM Audit: PASSED"
else
    echo -e "${RED}⚠️  Vulnerabilities detected - check report${NC}"
    log_result "⚠️  NPM Audit: VULNERABILITIES DETECTED"
fi
log_result ""

# 2. Check for hardcoded secrets and credentials
echo -e "${YELLOW}🔍 Scanning for hardcoded secrets...${NC}"
log_result "2. HARDCODED SECRETS SCAN"
log_result "========================="

# Check for common patterns
SECRET_PATTERNS=(
    "password.*="
    "secret.*="
    "key.*="
    "token.*="
    "api.*key"
    "private.*key"
    "jwt.*secret"
    "database.*url"
)

SECRETS_FOUND=0
for pattern in "${SECRET_PATTERNS[@]}"; do
    results=$(grep -r -i "$pattern" src/ --include="*.ts" --include="*.tsx" --include="*.js" --include="*.jsx" 2>/dev/null | grep -v ".env" | grep -v "test" | grep -v "mock")
    if [ ! -z "$results" ]; then
        log_result "⚠️  Found potential secrets for pattern: $pattern"
        echo "$results" >> $REPORT_FILE
        SECRETS_FOUND=1
    fi
done

if [ $SECRETS_FOUND -eq 0 ]; then
    echo -e "${GREEN}✅ No hardcoded secrets found${NC}"
    log_result "✅ Secrets Scan: PASSED"
else
    echo -e "${RED}⚠️  Potential secrets found - check report${NC}"
    log_result "⚠️  Secrets Scan: POTENTIAL ISSUES DETECTED"
fi
log_result ""

# 3. Check file permissions
echo -e "${YELLOW}🔐 Checking file permissions...${NC}"
log_result "3. FILE PERMISSIONS CHECK"
log_result "========================="

# Check for overly permissive files
PERM_ISSUES=0
if [ -f ".env" ]; then
    PERM=$(stat -c "%a" .env 2>/dev/null || stat -f "%A" .env 2>/dev/null)
    if [ "$PERM" != "600" ] && [ "$PERM" != "644" ]; then
        log_result "⚠️  .env file has insecure permissions: $PERM"
        PERM_ISSUES=1
    fi
fi

if [ -f ".env.production" ]; then
    PERM=$(stat -c "%a" .env.production 2>/dev/null || stat -f "%A" .env.production 2>/dev/null)
    if [ "$PERM" != "600" ] && [ "$PERM" != "644" ]; then
        log_result "⚠️  .env.production file has insecure permissions: $PERM"
        PERM_ISSUES=1
    fi
fi

if [ $PERM_ISSUES -eq 0 ]; then
    echo -e "${GREEN}✅ File permissions look secure${NC}"
    log_result "✅ File Permissions: PASSED"
else
    echo -e "${RED}⚠️  Permission issues found - check report${NC}"
    log_result "⚠️  File Permissions: ISSUES DETECTED"
fi
log_result ""

# 4. Check for insecure dependencies
echo -e "${YELLOW}📚 Analyzing dependency security...${NC}"
log_result "4. DEPENDENCY SECURITY ANALYSIS"
log_result "==============================="

# Check for known insecure packages
INSECURE_PACKAGES=(
    "lodash@4.17.20"
    "minimist@1.2.5"
    "serialize-javascript@3.1.0"
)

DEP_ISSUES=0
for package in "${INSECURE_PACKAGES[@]}"; do
    if npm list "$package" >/dev/null 2>&1; then
        log_result "⚠️  Found potentially insecure package: $package"
        DEP_ISSUES=1
    fi
done

if [ $DEP_ISSUES -eq 0 ]; then
    echo -e "${GREEN}✅ No known insecure dependencies found${NC}"
    log_result "✅ Dependency Security: PASSED"
else
    echo -e "${RED}⚠️  Insecure dependencies detected - check report${NC}"
    log_result "⚠️  Dependency Security: ISSUES DETECTED"
fi
log_result ""

# 5. Check TypeScript configuration security
echo -e "${YELLOW}⚙️  Checking TypeScript security config...${NC}"
log_result "5. TYPESCRIPT SECURITY CONFIG"
log_result "============================="

TS_ISSUES=0
if [ -f "tsconfig.json" ]; then
    # Check for strict mode
    if ! grep -q '"strict": true' tsconfig.json; then
        log_result "⚠️  TypeScript strict mode not enabled"
        TS_ISSUES=1
    fi
    
    # Check for no implicit any
    if ! grep -q '"noImplicitAny": true' tsconfig.json; then
        log_result "⚠️  TypeScript noImplicitAny not enabled"
        TS_ISSUES=1
    fi
fi

if [ $TS_ISSUES -eq 0 ]; then
    echo -e "${GREEN}✅ TypeScript configuration looks secure${NC}"
    log_result "✅ TypeScript Config: PASSED"
else
    echo -e "${RED}⚠️  TypeScript security issues found - check report${NC}"
    log_result "⚠️  TypeScript Config: ISSUES DETECTED"
fi
log_result ""

# 6. Check for security headers implementation
echo -e "${YELLOW}🛡️  Checking security headers implementation...${NC}"
log_result "6. SECURITY HEADERS CHECK"
log_result "========================"

HEADERS_ISSUES=0
if [ ! -f "src/middleware/security.ts" ]; then
    log_result "⚠️  Security middleware not found"
    HEADERS_ISSUES=1
else
    # Check for required security headers
    REQUIRED_HEADERS=(
        "helmet"
        "contentSecurityPolicy"
        "hsts"
        "crossOriginEmbedderPolicy"
    )
    
    for header in "${REQUIRED_HEADERS[@]}"; do
        if ! grep -q "$header" src/middleware/security.ts; then
            log_result "⚠️  Missing security header implementation: $header"
            HEADERS_ISSUES=1
        fi
    done
fi

if [ $HEADERS_ISSUES -eq 0 ]; then
    echo -e "${GREEN}✅ Security headers properly implemented${NC}"
    log_result "✅ Security Headers: PASSED"
else
    echo -e "${RED}⚠️  Security header issues found - check report${NC}"
    log_result "⚠️  Security Headers: ISSUES DETECTED"
fi
log_result ""

# 7. Generate security recommendations
echo -e "${YELLOW}📋 Generating security recommendations...${NC}"
log_result "7. SECURITY RECOMMENDATIONS"
log_result "==========================="
log_result "• Enable Content Security Policy (CSP) headers"
log_result "• Implement rate limiting for all API endpoints"
log_result "• Use HTTPS everywhere in production"
log_result "• Enable HSTS headers with long max-age"
log_result "• Implement proper input validation and sanitization"
log_result "• Use secure session management"
log_result "• Enable CORS with specific origins only"
log_result "• Implement proper error handling (no sensitive info exposure)"
log_result "• Use environment variables for all secrets"
log_result "• Implement proper logging and monitoring"
log_result "• Regular security updates for all dependencies"
log_result "• Implement proper authentication and authorization"
log_result ""

# 8. Generate final report summary
echo -e "${YELLOW}📊 Security Scan Summary${NC}"
log_result "8. SECURITY SCAN SUMMARY"
log_result "========================"
log_result "Scan completed at: $(date)"
log_result "Report saved to: $REPORT_FILE"
log_result ""
log_result "Next steps:"
log_result "1. Review the detailed report above"
log_result "2. Address any vulnerabilities found"
log_result "3. Implement recommended security measures"
log_result "4. Schedule regular security scans"
log_result "5. Keep dependencies updated"
log_result ""

echo ""
echo -e "${GREEN}🎯 Security scan completed!${NC}"
echo -e "${GREEN}📄 Report saved to: $REPORT_FILE${NC}"
echo ""
echo "Next recommended actions:"
echo "1. Review the security report"
echo "2. Fix any vulnerabilities found"
echo "3. Run 'npm audit fix' for dependency issues"
echo "4. Implement missing security headers"
echo "5. Schedule regular security scans"

# Make the script executable
chmod +x security-scan.sh
