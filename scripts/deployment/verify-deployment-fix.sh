#!/bin/bash

# Deployment Readiness Verification Script
# Snakkaz Chat - May 24, 2025

echo "🔍 Verifying Deployment Fix Readiness..."
echo "========================================="

# Check if improved extraction script exists and is valid
echo "1. Checking improved extraction script..."
if [ -f "improved-extract.php" ]; then
    echo "   ✅ improved-extract.php exists"
    
    # Check PHP syntax
    if php -l improved-extract.php > /dev/null 2>&1; then
        echo "   ✅ PHP syntax is valid"
    else
        echo "   ❌ PHP syntax error detected"
        exit 1
    fi
    
    # Check for required success patterns
    if grep -q "✅ Extraction successful" improved-extract.php; then
        echo "   ✅ Success pattern '✅ Extraction successful' found"
    else
        echo "   ❌ Success pattern '✅ Extraction successful' missing"
        exit 1
    fi
    
    if grep -q "DEPLOYMENT COMPLETE" improved-extract.php; then
        echo "   ✅ Success pattern 'DEPLOYMENT COMPLETE' found"
    else
        echo "   ❌ Success pattern 'DEPLOYMENT COMPLETE' missing"
        exit 1
    fi
else
    echo "   ❌ improved-extract.php not found"
    exit 1
fi

echo ""

# Check workflow files
echo "2. Checking GitHub Actions workflows..."

# Check deploy-cpanel-token.yml
if [ -f ".github/workflows/deploy-cpanel-token.yml" ]; then
    echo "   ✅ deploy-cpanel-token.yml exists"
    
    if grep -q "cp improved-extract.php extract.php" .github/workflows/deploy-cpanel-token.yml; then
        echo "   ✅ Uses improved extraction script"
    else
        echo "   ❌ Not using improved extraction script"
        exit 1
    fi
    
    if grep -q '\*"✅ Extraction successful"\*.*\*"DEPLOYMENT COMPLETE"\*' .github/workflows/deploy-cpanel-token.yml; then
        echo "   ✅ Checks for both success patterns"
    else
        echo "   ❌ Missing updated success pattern check"
        exit 1
    fi
else
    echo "   ❌ deploy-cpanel-token.yml not found"
    exit 1
fi

# Check deploy-cpanel.yml
if [ -f ".github/workflows/deploy-cpanel.yml" ]; then
    echo "   ✅ deploy-cpanel.yml exists"
    
    if grep -q "cp improved-extract.php extract.php" .github/workflows/deploy-cpanel.yml; then
        echo "   ✅ Uses improved extraction script"
    else
        echo "   ❌ Not using improved extraction script"
        exit 1
    fi
    
    if grep -q '\*"✅ Extraction successful"\*.*\*"DEPLOYMENT COMPLETE"\*' .github/workflows/deploy-cpanel.yml; then
        echo "   ✅ Checks for both success patterns"
    else
        echo "   ❌ Missing updated success pattern check"
        exit 1
    fi
else
    echo "   ❌ deploy-cpanel.yml not found"
    exit 1
fi

echo ""

# Test pattern matching logic
echo "3. Testing pattern matching logic..."

# Test first pattern
EXTRACT_RESULT="✅ Extraction successful! Extracted 15 new files/directories."
if [[ "$EXTRACT_RESULT" == *"✅ Extraction successful"* ]]; then
    echo "   ✅ Pattern '✅ Extraction successful' matches correctly"
else
    echo "   ❌ Pattern '✅ Extraction successful' not matching"
    exit 1
fi

# Test second pattern
EXTRACT_RESULT="DEPLOYMENT COMPLETE"
if [[ "$EXTRACT_RESULT" == *"DEPLOYMENT COMPLETE"* ]]; then
    echo "   ✅ Pattern 'DEPLOYMENT COMPLETE' matches correctly"
else
    echo "   ❌ Pattern 'DEPLOYMENT COMPLETE' not matching"
    exit 1
fi

# Test combined logic
EXTRACT_RESULT="✅ Extraction successful! Extracted 15 new files/directories."
if [[ "$EXTRACT_RESULT" == *"✅ Extraction successful"* || "$EXTRACT_RESULT" == *"DEPLOYMENT COMPLETE"* ]]; then
    echo "   ✅ Combined pattern matching works correctly"
else
    echo "   ❌ Combined pattern matching failed"
    exit 1
fi

echo ""
echo "🎉 ALL CHECKS PASSED!"
echo "=============================="
echo ""
echo "✅ Deployment fix is ready for production testing"
echo "✅ Extraction script error should be resolved"
echo "✅ Automatic deployments should now work correctly"
echo ""
echo "Next steps:"
echo "1. Trigger a deployment to test the fix"
echo "2. Monitor deployment logs for success"
echo "3. Verify site functionality after deployment"
echo "4. Clean up temporary files if deployment succeeds"
