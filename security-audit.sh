#!/bin/bash

# SnakkaZ Security Audit Script
# Ensures all TestSprite MCP references are removed and native testing is secure

echo "🔒 SnakkaZ Security Audit - TestSprite MCP Removal Verification"
echo "============================================================="

# Function to check for TestSprite references
check_testsprite_refs() {
    echo "🔍 Checking for TestSprite MCP references..."
    
    # Search for TestSprite references in code files
    TESTSPRITE_REFS=$(find . -name "*.ts" -o -name "*.tsx" -o -name "*.js" -o -name "*.jsx" -o -name "*.json" | \
                      grep -v node_modules | grep -v dist | grep -v coverage | \
                      xargs grep -l -i "testsprite" 2>/dev/null || echo "")
    
    if [ -z "$TESTSPRITE_REFS" ]; then
        echo "✅ No TestSprite MCP references found in source code"
    else
        echo "❌ TestSprite MCP references still found in:"
        echo "$TESTSPRITE_REFS"
        return 1
    fi
}

# Function to check package.json files
check_package_dependencies() {
    echo "🔍 Checking package.json files for TestSprite dependencies..."
    
    TESTSPRITE_DEPS=$(find . -name "package.json" | \
                      grep -v node_modules | \
                      xargs grep -l "testsprite" 2>/dev/null || echo "")
    
    if [ -z "$TESTSPRITE_DEPS" ]; then
        echo "✅ No TestSprite MCP dependencies found in package.json files"
    else
        echo "❌ TestSprite MCP dependencies still found in:"
        echo "$TESTSPRITE_DEPS"
        return 1
    fi
}

# Function to verify native testing tools are installed
check_native_testing() {
    echo "🔍 Checking native testing tools installation..."
    
    # Check for Playwright
    if npm list @playwright/test >/dev/null 2>&1; then
        echo "✅ Playwright E2E testing installed"
    else
        echo "❌ Playwright not found"
        return 1
    fi
    
    # Check for Vitest
    if npm list vitest >/dev/null 2>&1; then
        echo "✅ Vitest unit testing installed"
    else
        echo "❌ Vitest not found"
        return 1
    fi
    
    # Check for Testing Library
    if npm list @testing-library/react >/dev/null 2>&1; then
        echo "✅ React Testing Library installed"
    else
        echo "❌ React Testing Library not found"
        return 1
    fi
    
    # Check for Cypress
    if npm list cypress >/dev/null 2>&1; then
        echo "✅ Cypress integration testing installed"
    else
        echo "❌ Cypress not found"
        return 1
    fi
}

# Function to check for external API calls in test files
check_external_apis() {
    echo "🔍 Checking for external API calls in test files..."
    
    EXTERNAL_APIS=$(find . -name "*.test.*" -o -name "*.spec.*" -o -name "*.cy.*" | \
                    grep -v node_modules | \
                    xargs grep -l "http://" 2>/dev/null | \
                    xargs grep -l "https://" 2>/dev/null | \
                    grep -v "localhost" | grep -v "127.0.0.1" || echo "")
    
    if [ -z "$EXTERNAL_APIS" ]; then
        echo "✅ No external API calls found in test files"
    else
        echo "⚠️  External API calls found in test files (review needed):"
        echo "$EXTERNAL_APIS"
    fi
}

# Function to verify security configurations
check_security_config() {
    echo "🔍 Checking security configurations..."
    
    # Check for HTTPS enforcement
    if grep -q "https" vite.config.ts 2>/dev/null; then
        echo "✅ HTTPS configuration found"
    else
        echo "ℹ️  HTTPS configuration not found (OK for development)"
    fi
    
    # Check for CSP headers
    if find . -name "*.ts" -o -name "*.js" | xargs grep -q "Content-Security-Policy" 2>/dev/null; then
        echo "✅ Content Security Policy configuration found"
    else
        echo "ℹ️  CSP configuration not found (consider adding for production)"
    fi
}

# Run all checks
echo "Starting security audit..."
echo ""

AUDIT_FAILED=0

if ! check_testsprite_refs; then
    AUDIT_FAILED=1
fi
echo ""

if ! check_package_dependencies; then
    AUDIT_FAILED=1
fi
echo ""

if ! check_native_testing; then
    AUDIT_FAILED=1
fi
echo ""

check_external_apis
echo ""

check_security_config
echo ""

# Final result
if [ $AUDIT_FAILED -eq 0 ]; then
    echo "🎉 Security Audit PASSED"
    echo "✅ TestSprite MCP successfully removed"
    echo "✅ Native testing tools properly configured"
    echo "✅ No security issues detected"
    echo ""
    echo "Safe to proceed with:"
    echo "  npm run test:native"
    echo "  npm run test:e2e"
    echo "  npm run test:cypress"
else
    echo "❌ Security Audit FAILED"
    echo "Please fix the issues above before proceeding"
    exit 1
fi
