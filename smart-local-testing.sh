#!/bin/bash
# SnakkaZ Smart Local Testing Suite
# Elegant og effektiv testing før live deployment

# Colors for better UX
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m'

# Test results tracking
TESTS_PASSED=0
TESTS_FAILED=0
CRITICAL_ISSUES=0

echo -e "${CYAN}🧪 SNAKKAZ SMART LOCAL TESTING SUITE${NC}"
echo -e "${BLUE}==========================================${NC}"
echo -e "Testing før live deployment på www.snakkaz.com\n"

# Helper functions
test_result() {
    local test_name="$1"
    local result="$2"
    local details="$3"
    
    if [ "$result" = "PASS" ]; then
        echo -e "${GREEN}✅ $test_name: PASSED${NC}"
        [ -n "$details" ] && echo -e "   ${BLUE}→ $details${NC}"
        ((TESTS_PASSED++))
    else
        echo -e "${RED}❌ $test_name: FAILED${NC}"
        [ -n "$details" ] && echo -e "   ${RED}→ $details${NC}"
        ((TESTS_FAILED++))
        if [[ "$test_name" == *"CRITICAL"* ]]; then
            ((CRITICAL_ISSUES++))
        fi
    fi
}

start_test_phase() {
    echo -e "\n${CYAN}=== $1 ===${NC}"
}

# 1. Quick Syntax & File Validation
start_test_phase "FASE 1: SYNTAX & FILE VALIDATION"

echo -e "${YELLOW}Sjekker alle kritiske JavaScript filer...${NC}"

# Check critical JS files
critical_files=(
    "assets/js/vendor-router-DRYHFKTT.js"
    "assets/js/vendor-react-core-Cd05VJ5Y.js"
    "assets/js/vendor-animation-BRHAymv3.js"
    "assets/js/app-services-Cf0jkxe3.js"
    "assets/js/index-BWQuTEbr.js"
)

for file in "${critical_files[@]}"; do
    if [ -f "$file" ]; then
        if node -c "$file" 2>/dev/null; then
            test_result "Syntax: $(basename $file)" "PASS" "Valid JavaScript syntax"
        else
            test_result "CRITICAL: $(basename $file)" "FAIL" "Syntax error detected"
        fi
    else
        test_result "CRITICAL: $(basename $file)" "FAIL" "File missing"
    fi
done

# Check SafeReact implementation
if grep -q "SafeReact" assets/js/vendor-router-DRYHFKTT.js; then
    test_result "SafeReact Implementation" "PASS" "Emergency fallback system active"
else
    test_result "CRITICAL: SafeReact" "FAIL" "Emergency fallback missing"
fi

# 2. Server Startup Test
start_test_phase "FASE 2: LOCAL SERVER TEST"

echo -e "${YELLOW}Starter lokal test server...${NC}"

# Kill any existing server
pkill -f "python3 -m http.server 8081" 2>/dev/null

# Start server in background
cd snakkaz-complete-deployment
python3 -m http.server 8081 > /tmp/snakkaz-server.log 2>&1 &
SERVER_PID=$!
cd ..

# Wait for server to start
sleep 3

# Test server response
if curl -s -I http://localhost:8081 | grep -q "200 OK"; then
    test_result "Local Server Startup" "PASS" "HTTP server responding on port 8081"
else
    test_result "CRITICAL: Server Startup" "FAIL" "Server not responding"
fi

# 3. Critical Endpoint Tests
start_test_phase "FASE 3: CRITICAL ENDPOINT VALIDATION"

endpoints=(
    "/"
    "/manifest.json"
    "/service-worker.js"
    "/assets/js/vendor-router-DRYHFKTT.js"
    "/assets/js/vendor-react-core-Cd05VJ5Y.js"
    "/assets/css/index-BuuGx747.css"
)

for endpoint in "${endpoints[@]}"; do
    if curl -s -I "http://localhost:8081$endpoint" | grep -q "200 OK"; then
        test_result "Endpoint: $endpoint" "PASS" "Loading correctly"
    else
        test_result "Endpoint: $endpoint" "FAIL" "Not accessible"
    fi
done

# 4. Browser Automation Test (Optional but powerful)
start_test_phase "FASE 4: AUTOMATED BROWSER TEST"

echo -e "${YELLOW}Starter automated browser test...${NC}"

# Create a simple browser test script
cat > /tmp/browser-test.js << 'EOF'
const puppeteer = require('puppeteer');

(async () => {
  try {
    const browser = await puppeteer.launch({headless: true});
    const page = await browser.newPage();
    
    // Console error tracking
    const errors = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });
    
    // Navigate to local app
    await page.goto('http://localhost:8081', {waitUntil: 'networkidle2'});
    
    // Basic checks
    const title = await page.title();
    const hasSnakkaz = title.includes('SnakkaZ') || title.includes('Chat');
    
    // Check for critical errors
    const criticalErrors = errors.filter(err => 
      err.includes('vendor-router') || 
      err.includes('TypeError') || 
      err.includes('Cannot access')
    );
    
    console.log(JSON.stringify({
      success: true,
      title: title,
      hasSnakkaz: hasSnakkaz,
      totalErrors: errors.length,
      criticalErrors: criticalErrors.length,
      errors: criticalErrors
    }));
    
    await browser.close();
  } catch (error) {
    console.log(JSON.stringify({
      success: false,
      error: error.message
    }));
  }
})();
EOF

# Try to run browser test if puppeteer is available
if command -v npm >/dev/null 2>&1; then
    if npm list puppeteer >/dev/null 2>&1 || npm list -g puppeteer >/dev/null 2>&1; then
        browser_result=$(node /tmp/browser-test.js 2>/dev/null)
        if echo "$browser_result" | grep -q '"success":true'; then
            critical_errors=$(echo "$browser_result" | grep -o '"criticalErrors":[0-9]*' | cut -d: -f2)
            if [ "$critical_errors" = "0" ]; then
                test_result "Browser Automation" "PASS" "No critical JavaScript errors detected"
            else
                test_result "Browser Automation" "FAIL" "$critical_errors critical errors found"
            fi
        else
            test_result "Browser Automation" "FAIL" "Browser test failed to run"
        fi
    else
        test_result "Browser Automation" "SKIP" "Puppeteer not available (optional test)"
    fi
else
    test_result "Browser Automation" "SKIP" "Node.js not available (optional test)"
fi

# 5. Performance Quick Check
start_test_phase "FASE 5: PERFORMANCE VALIDATION"

# Check bundle sizes
index_size=$(stat -f%z "snakkaz-complete-deployment/index.html" 2>/dev/null || stat -c%s "snakkaz-complete-deployment/index.html" 2>/dev/null)
css_size=$(stat -f%z "snakkaz-complete-deployment/assets/css/index-BuuGx747.css" 2>/dev/null || stat -c%s "snakkaz-complete-deployment/assets/css/index-BuuGx747.css" 2>/dev/null)

if [ "$index_size" -lt 10000 ]; then
    test_result "HTML Size Check" "PASS" "Index.html: ${index_size} bytes (optimal)"
else
    test_result "HTML Size Check" "WARN" "Index.html: ${index_size} bytes (large)"
fi

if [ "$css_size" -lt 100000 ]; then
    test_result "CSS Size Check" "PASS" "CSS bundle: ${css_size} bytes (optimal)"
else
    test_result "CSS Size Check" "WARN" "CSS bundle: ${css_size} bytes (large)"
fi

# Load time test
load_time=$(curl -w "@-" -o /dev/null -s "http://localhost:8081" <<< 'time_total: %{time_total}' | grep -o '[0-9.]*')
if (( $(echo "$load_time < 2.0" | bc -l) )); then
    test_result "Load Time Test" "PASS" "Page loads in ${load_time}s (excellent)"
else
    test_result "Load Time Test" "WARN" "Page loads in ${load_time}s (consider optimization)"
fi

# 6. Final Results Summary
start_test_phase "TEST RESULTS SUMMARY"

echo -e "\n${CYAN}📊 FINAL TEST RESULTS${NC}"
echo -e "${BLUE}========================${NC}"
echo -e "${GREEN}✅ Tests Passed: $TESTS_PASSED${NC}"
echo -e "${RED}❌ Tests Failed: $TESTS_FAILED${NC}"
echo -e "${RED}🚨 Critical Issues: $CRITICAL_ISSUES${NC}"

if [ $CRITICAL_ISSUES -eq 0 ] && [ $TESTS_FAILED -lt 3 ]; then
    echo -e "\n${GREEN}🎉 READY FOR DEPLOYMENT!${NC}"
    echo -e "${GREEN}SnakkaZ app is stable and ready for production!${NC}"
    echo -e "\n${CYAN}Next steps:${NC}"
    echo -e "1. Upload snakkaz-complete-production-ready-v2.zip to cPanel"
    echo -e "2. Extract to public_html directory"
    echo -e "3. Test www.snakkaz.com"
    echo -e "4. Begin beta launch phase"
    
    # Log success
    echo "$(date): Local testing completed successfully - READY FOR DEPLOYMENT" >> /tmp/snakkaz-testing.log
    
    exit 0
else
    echo -e "\n${RED}⚠️  ISSUES DETECTED!${NC}"
    echo -e "${RED}Fix critical issues before deployment${NC}"
    echo -e "\n${YELLOW}Debugging tips:${NC}"
    echo -e "- Check server logs: tail /tmp/snakkaz-server.log"
    echo -e "- Run emergency debug: ./emergency-debug-fix-suite.sh"
    echo -e "- Check browser console at: http://localhost:8081"
    
    # Log issues
    echo "$(date): Local testing failed - $CRITICAL_ISSUES critical issues" >> /tmp/snakkaz-testing.log
    
    exit 1
fi

# Cleanup
kill $SERVER_PID 2>/dev/null
rm -f /tmp/browser-test.js
