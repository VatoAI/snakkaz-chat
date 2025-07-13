#!/bin/bash
# SnakkaZ Beta - Comprehensive Testing Script
# This script runs through all critical tests before deployment

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

print_status() { echo -e "${BLUE}[TEST]${NC} $1"; }
print_success() { echo -e "${GREEN}[PASS]${NC} $1"; }
print_warning() { echo -e "${YELLOW}[WARN]${NC} $1"; }
print_error() { echo -e "${RED}[FAIL]${NC} $1"; }

echo "================================================================="
echo "         SNAKKAZ BETA - COMPREHENSIVE TEST SUITE"
echo "                   Pre-Launch Validation"
echo "================================================================="

# Test 1: Environment Check
test_environment() {
    print_status "Testing environment setup..."
    
    if [ ! -f ".env" ]; then
        print_error "No .env file found"
        return 1
    fi
    
    # Check if required env vars are set
    source .env
    if [ -z "$VITE_SUPABASE_URL" ]; then
        print_error "VITE_SUPABASE_URL not set"
        return 1
    fi
    
    if [ -z "$VITE_SUPABASE_ANON_KEY" ]; then
        print_error "VITE_SUPABASE_ANON_KEY not set"
        return 1
    fi
    
    print_success "Environment configuration valid"
    return 0
}

# Test 2: Dependencies Check
test_dependencies() {
    print_status "Testing dependencies..."
    
    if [ ! -d "node_modules" ]; then
        print_error "node_modules not found - run npm install"
        return 1
    fi
    
    # Check package.json
    if [ ! -f "package.json" ]; then
        print_error "package.json not found"
        return 1
    fi
    
    # Test key dependencies
    if ! npm list @supabase/supabase-js &>/dev/null; then
        print_error "Supabase client not installed"
        return 1
    fi
    
    if ! npm list react &>/dev/null; then
        print_error "React not installed"
        return 1
    fi
    
    print_success "Dependencies check passed"
    return 0
}

# Test 3: Build Test
test_build() {
    print_status "Testing build process..."
    
    # Clean previous build
    rm -rf dist
    
    # Run build
    if npm run build:prod; then
        print_success "Build completed successfully"
    else
        print_error "Build failed"
        return 1
    fi
    
    # Check if critical files exist
    if [ ! -f "dist/index.html" ]; then
        print_error "index.html not generated"
        return 1
    fi
    
    if [ ! -d "dist/assets" ]; then
        print_error "Assets directory not generated"
        return 1
    fi
    
    # Check bundle size (should be reasonable)
    BUNDLE_SIZE=$(du -sk dist | cut -f1)
    if [ $BUNDLE_SIZE -gt 5120 ]; then  # 5MB limit
        print_warning "Bundle size is large: ${BUNDLE_SIZE}KB"
    else
        print_success "Bundle size acceptable: ${BUNDLE_SIZE}KB"
    fi
    
    return 0
}

# Test 4: Critical Files Check
test_critical_files() {
    print_status "Testing critical files..."
    
    CRITICAL_FILES=(
        "src/lib/supabaseClient.ts"
        "src/services/invite/inviteService.ts"
        "src/components/invite/SnakkaZInviteSystem.tsx"
        "src/pages/SnakkaZChatBeta.tsx"
        "src/pages/Register.tsx"
        "src/pages/Login.tsx"
        "database/complete-migration.sql"
        "public/manifest.json"
    )
    
    for file in "${CRITICAL_FILES[@]}"; do
        if [ ! -f "$file" ]; then
            print_error "Critical file missing: $file"
            return 1
        fi
    done
    
    print_success "All critical files present"
    return 0
}

# Test 5: Database Schema Check
test_database_schema() {
    print_status "Testing database schema..."
    
    if [ ! -f "database/complete-migration.sql" ]; then
        print_error "Database migration file missing"
        return 1
    fi
    
    # Check if schema contains required tables
    REQUIRED_TABLES=(
        "invites"
        "invite_clicks"
        "invite_conversions"
        "chat_rooms"
        "messages"
        "user_profiles"
    )
    
    for table in "${REQUIRED_TABLES[@]}"; do
        if ! grep -q "CREATE TABLE.*$table" database/complete-migration.sql; then
            print_error "Table definition missing: $table"
            return 1
        fi
    done
    
    print_success "Database schema validation passed"
    return 0
}

# Test 6: Component Integrity
test_components() {
    print_status "Testing component integrity..."
    
    # Check TypeScript compilation
    if command -v tsc &> /dev/null; then
        if npm run type-check &> /dev/null; then
            print_success "TypeScript compilation successful"
        else
            print_warning "TypeScript errors found (may be non-critical)"
        fi
    else
        print_warning "TypeScript compiler not available"
    fi
    
    # Check for common React issues
    if grep -r "useState.*function" src/ &> /dev/null; then
        print_warning "Potential useState function issues found"
    fi
    
    # Check for missing imports
    if grep -r "lucide-react" src/ | grep -v "import.*from.*lucide-react" &> /dev/null; then
        print_warning "Potential missing lucide-react imports"
    fi
    
    print_success "Component integrity check completed"
    return 0
}

# Test 7: PWA Configuration
test_pwa() {
    print_status "Testing PWA configuration..."
    
    if [ ! -f "public/manifest.json" ]; then
        print_error "PWA manifest missing"
        return 1
    fi
    
    # Check manifest content
    if ! grep -q "SnakkaZ" public/manifest.json; then
        print_error "Manifest doesn't contain app name"
        return 1
    fi
    
    # Check for service worker
    if [ -f "public/sw.js" ]; then
        print_success "Service worker found"
    else
        print_warning "Service worker not found (PWA functionality limited)"
    fi
    
    print_success "PWA configuration check passed"
    return 0
}

# Test 8: Security Configuration
test_security() {
    print_status "Testing security configuration..."
    
    # Check for CSP configuration
    if grep -r "Content-Security-Policy" src/ &> /dev/null; then
        print_success "CSP configuration found"
    else
        print_warning "CSP configuration not detected"
    fi
    
    # Check for hardcoded secrets
    if grep -r "sk_" src/ &> /dev/null; then
        print_error "Potential secret keys found in source"
        return 1
    fi
    
    # Check environment variable usage
    if grep -r "process.env" src/ | grep -v "VITE_" &> /dev/null; then
        print_warning "Non-VITE environment variables found"
    fi
    
    print_success "Security configuration check passed"
    return 0
}

# Test 9: Performance Check
test_performance() {
    print_status "Testing performance optimizations..."
    
    # Check for code splitting
    if grep -r "lazy\|Suspense" src/ &> /dev/null; then
        print_success "Code splitting detected"
    else
        print_warning "No code splitting found"
    fi
    
    # Check bundle analysis
    if [ -f "dist/assets/index-*.js" ]; then
        JS_SIZE=$(du -sk dist/assets/index-*.js | cut -f1)
        if [ $JS_SIZE -gt 1024 ]; then  # 1MB limit
            print_warning "JavaScript bundle is large: ${JS_SIZE}KB"
        else
            print_success "JavaScript bundle size acceptable: ${JS_SIZE}KB"
        fi
    fi
    
    return 0
}

# Test 10: Deployment Readiness
test_deployment_readiness() {
    print_status "Testing deployment readiness..."
    
    # Check if deployment script exists
    if [ ! -f "deploy-snakkaz-beta.sh" ]; then
        print_error "Deployment script missing"
        return 1
    fi
    
    # Check if script is executable
    if [ ! -x "deploy-snakkaz-beta.sh" ]; then
        print_error "Deployment script not executable"
        return 1
    fi
    
    # Check for required deployment files
    DEPLOY_FILES=(
        "_redirects"
        "package.json"
        "database/complete-migration.sql"
    )
    
    for file in "${DEPLOY_FILES[@]}"; do
        if [ ! -f "$file" ]; then
            print_warning "Optional deployment file missing: $file"
        fi
    done
    
    print_success "Deployment readiness check passed"
    return 0
}

# Run all tests
main() {
    echo ""
    print_status "Starting comprehensive test suite..."
    echo ""
    
    FAILED_TESTS=0
    
    # Run each test
    test_environment || ((FAILED_TESTS++))
    test_dependencies || ((FAILED_TESTS++))
    test_critical_files || ((FAILED_TESTS++))
    test_database_schema || ((FAILED_TESTS++))
    test_components || ((FAILED_TESTS++))
    test_pwa || ((FAILED_TESTS++))
    test_security || ((FAILED_TESTS++))
    test_build || ((FAILED_TESTS++))
    test_performance || ((FAILED_TESTS++))
    test_deployment_readiness || ((FAILED_TESTS++))
    
    echo ""
    echo "================================================================="
    echo "                    TEST SUITE RESULTS"
    echo "================================================================="
    
    if [ $FAILED_TESTS -eq 0 ]; then
        print_success "🎉 ALL TESTS PASSED - READY FOR DEPLOYMENT!"
        echo ""
        echo "Your SnakkaZ Beta is ready for launch! 🚀"
        echo ""
        echo "Next steps:"
        echo "1. Run database migration in Supabase"
        echo "2. Deploy using: ./deploy-snakkaz-beta.sh"
        echo "3. Start beta testing with friends"
        echo ""
    else
        print_error "❌ $FAILED_TESTS tests failed"
        echo ""
        echo "Please fix the issues above before deploying."
        echo "Run this test script again after fixes."
        exit 1
    fi
}

# Handle arguments
case "${1:-}" in
    "quick")
        test_critical_files
        test_build
        ;;
    "security")
        test_security
        ;;
    "performance")
        test_performance
        ;;
    *)
        main
        ;;
esac
