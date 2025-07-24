#!/bin/bash

# Final Deployment Validation Script
echo "🚀 SNAKKAZ CHAT - FINAL DEPLOYMENT VALIDATION"
echo "=============================================="
echo ""

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

TIMESTAMP=$(date "+%Y%m%d_%H%M%S")
VALIDATION_LOG="validation-report-${TIMESTAMP}.txt"

echo "Validation started at: $(date)" > $VALIDATION_LOG

# Function to print status
print_status() {
    local status=$1
    local message=$2
    if [ "$status" = "PASS" ]; then
        echo -e "✅ ${GREEN}PASS${NC}: $message"
        echo "✅ PASS: $message" >> $VALIDATION_LOG
    elif [ "$status" = "FAIL" ]; then
        echo -e "❌ ${RED}FAIL${NC}: $message"
        echo "❌ FAIL: $message" >> $VALIDATION_LOG
    elif [ "$status" = "WARN" ]; then
        echo -e "⚠️  ${YELLOW}WARN${NC}: $message"
        echo "⚠️ WARN: $message" >> $VALIDATION_LOG
    else
        echo -e "ℹ️  ${BLUE}INFO${NC}: $message"
        echo "ℹ️ INFO: $message" >> $VALIDATION_LOG
    fi
}

echo "🔍 CORE SYSTEM VALIDATION"
echo "========================="

# 1. Check Node.js and npm
if command -v node &> /dev/null; then
    NODE_VERSION=$(node --version)
    print_status "PASS" "Node.js installed: $NODE_VERSION"
else
    print_status "FAIL" "Node.js not found"
fi

if command -v npm &> /dev/null; then
    NPM_VERSION=$(npm --version)
    print_status "PASS" "npm installed: $NPM_VERSION"
else
    print_status "FAIL" "npm not found"
fi

# 2. Check package.json
if [ -f "package.json" ]; then
    print_status "PASS" "package.json exists"
    
    # Check key dependencies
    if grep -q '"react"' package.json; then
        REACT_VERSION=$(grep '"react":' package.json | cut -d'"' -f4)
        print_status "PASS" "React dependency found: $REACT_VERSION"
    else
        print_status "FAIL" "React dependency missing"
    fi
    
    if grep -q '"vite"' package.json; then
        VITE_VERSION=$(grep '"vite":' package.json | cut -d'"' -f4)
        print_status "PASS" "Vite dependency found: $VITE_VERSION"
    else
        print_status "FAIL" "Vite dependency missing"
    fi
else
    print_status "FAIL" "package.json not found"
fi

echo ""
echo "📦 BUILD SYSTEM VALIDATION"
echo "=========================="

# 3. Check if build directory exists and contains files
if [ -d "dist" ]; then
    DIST_FILES=$(find dist -type f | wc -l)
    print_status "PASS" "Build directory exists with $DIST_FILES files"
    
    # Check for critical build files
    if [ -f "dist/index.html" ]; then
        print_status "PASS" "index.html exists in dist/"
        
        # Check if index.html contains React mount point
        if grep -q 'id="root"' dist/index.html; then
            print_status "PASS" "React mount point found in index.html"
        else
            print_status "WARN" "React mount point not found in index.html"
        fi
    else
        print_status "FAIL" "index.html missing from dist/"
    fi
    
    # Check for CSS assets
    CSS_COUNT=$(find dist -name "*.css" | wc -l)
    if [ $CSS_COUNT -gt 0 ]; then
        print_status "PASS" "CSS assets found: $CSS_COUNT files"
    else
        print_status "WARN" "No CSS assets found"
    fi
    
    # Check for JS assets
    JS_COUNT=$(find dist -name "*.js" | wc -l)
    if [ $JS_COUNT -gt 0 ]; then
        print_status "PASS" "JavaScript assets found: $JS_COUNT files"
    else
        print_status "FAIL" "No JavaScript assets found"
    fi
else
    print_status "FAIL" "Build directory (dist/) not found"
fi

echo ""
echo "🌐 APPLICATION SERVER VALIDATION"
echo "================================"

# 4. Check if development server is accessible
if curl -s -o /dev/null -w "%{http_code}" "http://localhost:5173" | grep -q "200"; then
    print_status "PASS" "Development server responding on localhost:5173"
    
    # Check if the page contains React app
    if curl -s "http://localhost:5173" | grep -q "SnakkaZ"; then
        print_status "PASS" "SnakkaZ application content found"
    else
        print_status "WARN" "SnakkaZ content not detected in response"
    fi
else
    print_status "WARN" "Development server not accessible (may be stopped)"
fi

echo ""
echo "🔧 MCP SERVER VALIDATION"
echo "========================"

# 5. Check MCP server directory and files
if [ -d "MCP SnakkaZ" ]; then
    print_status "PASS" "MCP SnakkaZ directory exists"
    
    if [ -f "MCP SnakkaZ/package.json" ]; then
        print_status "PASS" "MCP server package.json exists"
    else
        print_status "FAIL" "MCP server package.json missing"
    fi
    
    if [ -d "MCP SnakkaZ/build" ]; then
        MCP_BUILD_FILES=$(find "MCP SnakkaZ/build" -name "*.js" | wc -l)
        print_status "PASS" "MCP server built with $MCP_BUILD_FILES JavaScript files"
    else
        print_status "WARN" "MCP server build directory not found"
    fi
    
else
    print_status "FAIL" "MCP SnakkaZ directory not found"
fi

echo ""
echo "📁 PROJECT STRUCTURE VALIDATION"
echo "==============================="

# 6. Check critical directories and files
CRITICAL_DIRS=("src" "public" "docs")
for dir in "${CRITICAL_DIRS[@]}"; do
    if [ -d "$dir" ]; then
        FILE_COUNT=$(find "$dir" -type f | wc -l)
        print_status "PASS" "$dir/ directory exists with $FILE_COUNT files"
    else
        print_status "FAIL" "$dir/ directory missing"
    fi
done

# Check for key source files
KEY_FILES=(
    "src/App.tsx"
    "src/main.tsx"
    "src/pages/BasicChatPage.tsx"
    "src/components/ErrorBoundary.jsx"
    "src/styles/professional-modern-2025.css"
    "vite.config.ts"
    ".gitignore"
    "README.md"
)

for file in "${KEY_FILES[@]}"; do
    if [ -f "$file" ]; then
        print_status "PASS" "$file exists"
    else
        print_status "WARN" "$file missing"
    fi
done

echo ""
echo "🔒 SECURITY & DEPLOYMENT READINESS"
echo "=================================="

# 7. Check for sensitive files that shouldn't be in production
SENSITIVE_PATTERNS=(".env" "*.key" "*.pem" "node_modules")
for pattern in "${SENSITIVE_PATTERNS[@]}"; do
    if [ "$pattern" = "node_modules" ]; then
        if [ -d "node_modules" ]; then
            print_status "INFO" "node_modules directory present (normal for dev)"
        fi
    elif [ "$pattern" = ".env" ]; then
        if [ -f ".env" ]; then
            print_status "WARN" ".env file present - ensure secrets are not committed"
        fi
    else
        if ls $pattern 1> /dev/null 2>&1; then
            print_status "WARN" "Found sensitive files matching: $pattern"
        fi
    fi
done

# 8. Check Git status
if [ -d ".git" ]; then
    print_status "PASS" "Git repository initialized"
    
    if command -v git &> /dev/null; then
        UNCOMMITTED=$(git status --porcelain | wc -l)
        if [ $UNCOMMITTED -eq 0 ]; then
            print_status "PASS" "No uncommitted changes"
        else
            print_status "INFO" "$UNCOMMITTED uncommitted changes detected"
        fi
    fi
else
    print_status "WARN" "Not a Git repository"
fi

echo ""
echo "📊 DEPLOYMENT PACKAGES VALIDATION"
echo "================================="

# 9. Check for deployment packages
DEPLOYMENT_PACKAGES=(
    "snakkaz-production-deploy"
    "snakkaz-comprehensive-fix"
)

for package in "${DEPLOYMENT_PACKAGES[@]}"; do
    if find . -maxdepth 2 -name "*${package}*" -type d | head -1 | grep -q .; then
        PACKAGE_DIR=$(find . -maxdepth 2 -name "*${package}*" -type d | head -1)
        PACKAGE_FILES=$(find "$PACKAGE_DIR" -type f | wc -l)
        print_status "PASS" "Deployment package found: $PACKAGE_DIR ($PACKAGE_FILES files)"
    else
        print_status "INFO" "Deployment package not found: $package"
    fi
done

echo ""
echo "📋 SUMMARY & RECOMMENDATIONS"
echo "============================"

# Count results
PASS_COUNT=$(grep -c "✅ PASS:" $VALIDATION_LOG)
FAIL_COUNT=$(grep -c "❌ FAIL:" $VALIDATION_LOG)
WARN_COUNT=$(grep -c "⚠️ WARN:" $VALIDATION_LOG)
INFO_COUNT=$(grep -c "ℹ️ INFO:" $VALIDATION_LOG)

echo "Validation Results Summary:"
echo "- ✅ Passes: $PASS_COUNT"
echo "- ❌ Failures: $FAIL_COUNT"
echo "- ⚠️  Warnings: $WARN_COUNT"
echo "- ℹ️  Info: $INFO_COUNT"

# Determine deployment readiness
if [ $FAIL_COUNT -eq 0 ]; then
    if [ $WARN_COUNT -le 2 ]; then
        print_status "PASS" "🎉 DEPLOYMENT READY - All critical checks passed!"
        echo ""
        echo "🚀 NEXT STEPS FOR DEPLOYMENT:"
        echo "1. Stop development server: Ctrl+C in the dev server terminal"
        echo "2. Final build: npm run build"
        echo "3. Upload dist/ contents to production server"
        echo "4. Upload MCP server to mcp.snakkaz.com subdomain"
        echo "5. Test production deployment"
    else
        print_status "WARN" "⚠️  DEPLOYMENT POSSIBLE - Review warnings before proceeding"
    fi
else
    print_status "FAIL" "❌ NOT READY FOR DEPLOYMENT - Fix critical failures first"
fi

echo ""
echo "📄 Full validation report saved to: $VALIDATION_LOG"
echo "🕒 Validation completed at: $(date)"

# Display the last few lines of any error logs for debugging
if [ -f "error.log" ]; then
    echo ""
    echo "Recent error log entries:"
    tail -5 error.log 2>/dev/null || echo "No recent errors"
fi

echo ""
echo "🔗 USEFUL LINKS:"
echo "- Local Development: http://localhost:5173"
echo "- MCP Server Integration: VS Code Copilot Chat (@snakkaz-mcp-server)"
echo "- Documentation: ./docs/"
echo "- Deployment Guides: ./docs/MCP-CPANEL-DEPLOYMENT.md"
