#!/bin/bash

# Snakkaz Chat - Enhanced Comprehensive Deployment Status Check
# Checks current live site status and compares with latest build
# Created: June 25, 2025
# Updated: June 27, 2025 - Added enhanced API, dependency, and security checks

# Define colors for better readability
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
BOLD='\033[1m'
NC='\033[0m' # No Color

# Status counters for summary
TOTAL_CHECKS=0
PASSED_CHECKS=0
WARNING_CHECKS=0
FAILED_CHECKS=0

# Function to increment counter and print status
check_status() {
    local status=$1
    local message=$2
    local indent=${3:-"  "}
    
    TOTAL_CHECKS=$((TOTAL_CHECKS+1))
    
    if [ "$status" = "pass" ]; then
        PASSED_CHECKS=$((PASSED_CHECKS+1))
        echo -e "${indent}${GREEN}✓ $message${NC}"
    elif [ "$status" = "warning" ]; then
        WARNING_CHECKS=$((WARNING_CHECKS+1))
        echo -e "${indent}${YELLOW}⚠️  $message${NC}"
    elif [ "$status" = "fail" ]; then
        FAILED_CHECKS=$((FAILED_CHECKS+1))
        echo -e "${indent}${RED}✗ $message${NC}"
    else
        echo -e "${indent}$message"
    fi
}

echo -e "${BLUE}${BOLD}🔍 SNAKKAZ ENHANCED DEPLOYMENT STATUS CHECK${NC}"
echo -e "${BLUE}=============================================${NC}"
echo -e "Date: $(date)"
echo -e "Machine: $(hostname)"
echo -e "User: $(whoami)"
echo ""

# Working directory setup
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
cd "$PROJECT_ROOT"

# Check for required dependencies
echo -e "${BLUE}${BOLD}🛠️ DEPENDENCY CHECK${NC}"
echo -e "${BLUE}----------------------------------------${NC}"

dependencies=("curl" "git" "npm" "node" "zip" "find" "grep" "lftp" "python3")
for dep in "${dependencies[@]}"; do
    if command -v "$dep" &> /dev/null; then
        if [ "$dep" = "node" ]; then
            NODE_VERSION=$(node -v)
            check_status "pass" "Node.js installed ($NODE_VERSION)"
        elif [ "$dep" = "npm" ]; then
            NPM_VERSION=$(npm -v)
            check_status "pass" "npm installed ($NPM_VERSION)"
        elif [ "$dep" = "python3" ]; then
            PYTHON_VERSION=$(python3 --version)
            check_status "pass" "Python3 installed ($PYTHON_VERSION)"
        else
            check_status "pass" "$dep installed"
        fi
    else
        check_status "fail" "$dep not found - required for deployment"
    fi
done

echo ""

# Check package.json and node_modules
echo -e "${BLUE}${BOLD}📦 PROJECT SETUP${NC}"
echo -e "${BLUE}----------------------------------------${NC}"

if [ -f "package.json" ]; then
    check_status "pass" "package.json found"
    
    # Check project name
    PROJECT_NAME=$(grep -o '"name": *"[^"]*"' package.json | sed 's/"name": "\(.*\)"/\1/')
    check_status "pass" "Project name: $PROJECT_NAME"
    
    # Check dependencies
    if grep -q '"react":' package.json; then
        check_status "pass" "React dependency found"
    else
        check_status "fail" "React dependency missing"
    fi
    
    # Check if node_modules exists and is populated
    if [ -d "node_modules" ]; then
        NODE_MODULES_COUNT=$(find node_modules -maxdepth 1 -type d | wc -l)
        if [ "$NODE_MODULES_COUNT" -gt 5 ]; then
            check_status "pass" "node_modules appears to be populated"
        else
            check_status "warning" "node_modules has few packages ($(($NODE_MODULES_COUNT-1)))"
        fi
    else
        check_status "warning" "node_modules directory not found - run 'npm install'"
    fi
else
    check_status "fail" "package.json not found - incorrect project root?"
fi

echo ""

# Check current build status
echo -e "${BLUE}${BOLD}🏗️ BUILD STATUS${NC}"
echo -e "${BLUE}----------------------------------------${NC}"

# Check if dist directory exists
if [ -d "dist" ]; then
    check_status "pass" "dist directory found"
    
    if [ -f "dist/index.html" ]; then
        CURRENT_HASH=$(grep -o 'index-[^"]*\.js' dist/index.html | head -1)
        check_status "pass" "Local build hash: $CURRENT_HASH"
        
        # Get build timestamp
        DIST_TIMESTAMP=$(stat -c '%y' dist/index.html | cut -d. -f1)
        check_status "pass" "Build timestamp: $DIST_TIMESTAMP"
    else
        check_status "fail" "No dist/index.html found - build may be needed"
        echo -e "  ${YELLOW}Run: npm run build${NC}"
    fi
    
    # Count assets to provide build size info
    ASSET_COUNT=$(find dist/assets -type f | wc -l)
    check_status "pass" "Asset files: $ASSET_COUNT"
    
    # Check individual asset types
    JS_COUNT=$(find dist/assets -name "*.js" | wc -l)
    CSS_COUNT=$(find dist/assets -name "*.css" | wc -l)
    IMG_COUNT=$(find dist/assets -type f -not -name "*.js" -not -name "*.css" -not -name "*.html" | wc -l)
    
    echo -e "  ${CYAN}Asset breakdown:${NC}"
    echo -e "    - JavaScript: $JS_COUNT files"
    echo -e "    - CSS: $CSS_COUNT files"
    echo -e "    - Images & Other: $IMG_COUNT files"
    
    # Check build size
    BUILD_SIZE=$(du -sh dist | cut -f1)
    check_status "pass" "Total build size: $BUILD_SIZE"
    
    # Check for source maps (not recommended in production)
    SOURCE_MAPS=$(find dist/assets -name "*.map" | wc -l)
    if [ "$SOURCE_MAPS" -gt 0 ]; then
        check_status "warning" "Source maps found in build ($SOURCE_MAPS files) - security risk"
    else
        check_status "pass" "No source maps in production build"
    fi
else
    check_status "fail" "No dist directory found - build required"
    echo -e "  ${YELLOW}Run: npm run build${NC}"
    
    # Check if build script exists
    if grep -q '"build"' package.json; then
        check_status "pass" "Build script found in package.json"
    else
        check_status "fail" "No build script defined in package.json"
    fi
fi

echo ""

# Check live site connectivity
echo -e "${BLUE}${BOLD}🌐 LIVE SITE STATUS${NC}"
echo -e "${BLUE}----------------------------------------${NC}"

# First try connecting to main domain
echo -e "Testing connectivity to main domain..."
if curl -Is --connect-timeout 10 https://snakkaz.com > /dev/null 2>&1; then
    check_status "pass" "https://snakkaz.com is accessible"
    
    # Try to get live build hash
    LIVE_HASH=$(curl -s --connect-timeout 15 https://snakkaz.com 2>/dev/null | grep -o 'index-[^"]*\.js' | head -1)
    if [ -n "$LIVE_HASH" ]; then
        check_status "pass" "Live build hash: $LIVE_HASH"
        
        # Compare hashes
        if [ -n "$CURRENT_HASH" ]; then
            if [ "$CURRENT_HASH" = "$LIVE_HASH" ]; then
                check_status "pass" "Live site matches current build"
            else
                check_status "warning" "Live site shows different build hash"
                echo -e "    - Local: $CURRENT_HASH"
                echo -e "    - Live:  $LIVE_HASH"
                check_status "warning" "Manual ZIP extraction may be needed"
            fi
        else
            check_status "warning" "No local build hash to compare with"
        fi
        
        # Check for specific content markers
        echo -e "Verifying site components..."
        SITE_CONTENT=$(curl -s --connect-timeout 10 https://snakkaz.com)
        if echo "$SITE_CONTENT" | grep -q "Snakkaz Chat"; then
            check_status "pass" "Site content verification passed"
        else
            check_status "warning" "Site content verification failed - site may be showing error page"
        fi
        
        # Check for critical frontend components
        if echo "$SITE_CONTENT" | grep -q "UnifiedNavigation"; then
            check_status "pass" "Navigation component present"
        fi
        
        if echo "$SITE_CONTENT" | grep -q "MemoryProvider"; then
            check_status "pass" "Memory system integration present"
        fi
    else
        check_status "warning" "Could not detect build hash from live site"
    fi
    
    # Check HTTP headers for security
    HTTP_HEADERS=$(curl -sI --connect-timeout 10 https://snakkaz.com)
    echo -e "Checking security headers..."
    
    if echo "$HTTP_HEADERS" | grep -q "Content-Security-Policy"; then
        check_status "pass" "Content-Security-Policy header found"
    else
        check_status "warning" "No Content-Security-Policy header"
    fi
    
    if echo "$HTTP_HEADERS" | grep -q "Strict-Transport-Security"; then
        check_status "pass" "HSTS header found"
    else
        check_status "warning" "No HSTS header"
    fi
    
    if echo "$HTTP_HEADERS" | grep -q "X-Content-Type-Options"; then
        check_status "pass" "X-Content-Type-Options header found"
    else
        check_status "warning" "No X-Content-Type-Options header"
    fi
    
    if echo "$HTTP_HEADERS" | grep -q "X-Frame-Options"; then
        check_status "pass" "X-Frame-Options header found"
    else
        check_status "warning" "No X-Frame-Options header"
    fi
    
    # Check for server information disclosure
    if echo "$HTTP_HEADERS" | grep -q -i "server:"; then
        SERVER_INFO=$(echo "$HTTP_HEADERS" | grep -i "server:" | head -1)
        if echo "$SERVER_INFO" | grep -q -i "version\|apache\|nginx\|litespeed"; then
            check_status "warning" "Server information disclosure (security risk): $SERVER_INFO"
        else
            check_status "pass" "Server header present but minimal information disclosure"
        fi
    else
        check_status "pass" "No server information disclosure"
    fi
    
    # Check API endpoints
    echo -e "Checking API endpoints..."
    if curl -Is --connect-timeout 10 https://snakkaz.com/api/health > /dev/null 2>&1; then
        check_status "pass" "API health endpoint accessible"
    else
        check_status "warning" "API health endpoint not accessible"
    fi
    
    # Check memory API endpoint
    if curl -Is --connect-timeout 10 https://snakkaz.com/api/memory/status > /dev/null 2>&1; then
        check_status "pass" "Memory API endpoint accessible"
    else
        check_status "warning" "Memory API endpoint not accessible"
    fi
else
    check_status "fail" "https://snakkaz.com is not accessible or timed out"
    
    # Try alternate domains
    echo -e "Testing www subdomain..."
    if curl -Is --connect-timeout 10 https://www.snakkaz.com > /dev/null 2>&1; then
        check_status "pass" "https://www.snakkaz.com is accessible"
        check_status "warning" "Main domain may need DNS verification"
    else
        check_status "fail" "https://www.snakkaz.com is not accessible"
    fi
    
    # Check if local IP is accessible
    if curl -Is --connect-timeout 5 http://localhost:3000 > /dev/null 2>&1 || curl -Is --connect-timeout 5 http://localhost:5173 > /dev/null 2>&1; then
        check_status "warning" "Local development server appears to be running but production site unreachable"
    fi
fi

echo ""

# Check GitHub deployment status
echo -e "${BLUE}${BOLD}🚀 CI/CD STATUS${NC}"
echo -e "${BLUE}----------------------------------------${NC}"

if command -v git &> /dev/null && git rev-parse --is-inside-work-tree &> /dev/null; then
    # Get repository information
    REPO_URL=$(git remote get-url origin 2>/dev/null || echo "Unknown repository")
    
    # Extract repo owner and name for GitHub Actions URL
    if [[ "$REPO_URL" == *"github.com"* ]]; then
        REPO_INFO=$(echo "$REPO_URL" | sed 's/.*github.com[:/]\([^/]*\/[^/]*\).*/\1/' | sed 's/\.git$//')
        check_status "pass" "Repository: $REPO_INFO"
        check_status "pass" "GitHub Actions: https://github.com/$REPO_INFO/actions"
        
        # Get current branch
        CURRENT_BRANCH=$(git branch --show-current)
        check_status "pass" "Current branch: $CURRENT_BRANCH"
        
        # Get last commit
        LAST_COMMIT=$(git log -1 --format="%h - %s (%cr)" 2>/dev/null || echo "No commits")
        check_status "pass" "Last commit: $LAST_COMMIT"
        
        # Check for uncommitted changes
        if git diff-index --quiet HEAD --; then
            check_status "pass" "Working directory is clean"
        else
            check_status "warning" "Uncommitted changes in working directory"
            echo -e "    ${YELLOW}Use 'git status' to see changes${NC}"
        fi
        
        # Check workflow files
        if [ -d ".github/workflows" ]; then
            WORKFLOW_COUNT=$(ls -1 .github/workflows/*.yml 2>/dev/null | wc -l)
            if [ "$WORKFLOW_COUNT" -gt 0 ]; then
                check_status "pass" "GitHub workflow files found ($WORKFLOW_COUNT)"
            else
                check_status "warning" "No GitHub workflow files (.yml)"
            fi
        else
            check_status "warning" "No .github/workflows directory"
        fi
    else
        check_status "warning" "Not a GitHub repository or no remote set"
    fi
else
    check_status "fail" "Not a git repository or git not installed"
fi

echo ""

# Check for ZIP files in project (indicates pending manual extraction)
echo -e "${BLUE}${BOLD}📁 DEPLOYMENT FILES${NC}"
echo -e "${BLUE}----------------------------------------${NC}"

# Look for deployment ZIPs
ZIP_FILES=$(find . -maxdepth 1 -name "*.zip" -type f | grep -E "(snakkaz|dist)" | head -5)
if [ -n "$ZIP_FILES" ]; then
    check_status "warning" "Found deployment ZIP files:"
    echo "$ZIP_FILES" | sed 's/^/    - /'
    
    # Check ZIP file sizes
    check_status "warning" "ZIP file sizes:"
    for zip in $ZIP_FILES; do
        SIZE=$(du -h "$zip" | cut -f1)
        MTIME=$(stat -c '%y' "$zip" | cut -d. -f1)
        echo -e "    - ${YELLOW}$(basename "$zip")${NC}: $SIZE (modified: $MTIME)"
        
        # Check if recently created (within last 24 hours)
        ZIP_AGE_SECONDS=$(($(date +%s) - $(date -d "$(stat -c '%y' "$zip")" +%s)))
        if [ "$ZIP_AGE_SECONDS" -lt 86400 ]; then
            check_status "warning" "$(basename "$zip") was created recently ($(($ZIP_AGE_SECONDS / 60)) minutes ago)"
        fi
    done
    
    check_status "warning" "These may need manual extraction via cPanel File Manager"
else
    check_status "pass" "No pending ZIP files found"
fi

# Check FTP credentials and configuration
if [ -f "$PROJECT_ROOT/.env" ]; then
    if grep -q "FTP_HOST" "$PROJECT_ROOT/.env"; then
        check_status "pass" "FTP host configuration found in .env"
    else
        check_status "warning" "No FTP_HOST in .env file"
    fi
    
    if grep -q "FTP_USER" "$PROJECT_ROOT/.env"; then
        check_status "pass" "FTP user configuration found in .env"
    else
        check_status "warning" "No FTP_USER in .env file"
    fi
    
    if grep -q "FTP_PASSWORD" "$PROJECT_ROOT/.env"; then
        check_status "pass" "FTP password configuration found in .env"
    else
        check_status "warning" "No FTP_PASSWORD in .env file"
    fi
    
    if grep -q "CPANEL_API_TOKEN" "$PROJECT_ROOT/.env"; then
        check_status "pass" "cPanel API token found in .env"
    else
        check_status "warning" "No CPANEL_API_TOKEN in .env file (needed for auto extraction)"
    fi
    
    if grep -q "CPANEL_USER" "$PROJECT_ROOT/.env"; then
        check_status "pass" "cPanel user found in .env"
    else
        check_status "warning" "No CPANEL_USER in .env file"
    fi
else
    check_status "fail" "No .env file found in project root"
fi

# Check LFTP configuration
if [ -f "$PROJECT_ROOT/cache-busting-deploy.lftp" ] || [ -f "$PROJECT_ROOT/emergency-deploy.lftp" ]; then
    check_status "pass" "LFTP deployment scripts found"
else
    check_status "warning" "No LFTP deployment scripts found"
fi

echo ""

# Check memory system
echo -e "${BLUE}${BOLD}🧠 MEMORY SYSTEM STATUS${NC}"
echo -e "${BLUE}----------------------------------------${NC}"

# Check Memory System components
if [ -f "$PROJECT_ROOT/src/pages/MemoryDashboard.tsx" ]; then
    check_status "pass" "MemoryDashboard.tsx exists"
    
    # Check frontend integration
    if [ -f "$PROJECT_ROOT/src/components/navigation/UnifiedNavigation.tsx" ]; then
        if grep -q -E "Memory|Dashboard" "$PROJECT_ROOT/src/components/navigation/UnifiedNavigation.tsx"; then
            check_status "pass" "Memory Dashboard linked in navigation"
        else
            check_status "warning" "Memory Dashboard not linked in navigation"
        fi
    fi
    
    # Check memory service
    if [ -f "$PROJECT_ROOT/src/services/ai/memoryService.ts" ]; then
        check_status "pass" "memoryService.ts exists"
        
        # Check for key memory functions
        if grep -q "storeMemory" "$PROJECT_ROOT/src/services/ai/memoryService.ts"; then
            check_status "pass" "storeMemory function found in memory service"
        fi
        
        if grep -q "retrieveMemory" "$PROJECT_ROOT/src/services/ai/memoryService.ts"; then
            check_status "pass" "retrieveMemory function found in memory service"
        fi
    else
        check_status "fail" "memoryService.ts missing"
    fi
    
    # Check MCP server
    if [ -d "$PROJECT_ROOT/src/services/mcp" ]; then
        check_status "pass" "MCP server directory exists"
        
        # Check Python server file
        if [ -f "$PROJECT_ROOT/src/services/mcp/memoryServer.py" ]; then
            check_status "pass" "memoryServer.py exists"
            
            # Check for Python requirements
            if [ -f "$PROJECT_ROOT/src/services/mcp/requirements.txt" ]; then
                check_status "pass" "MCP requirements.txt exists"
                
                # Check MCP dependencies
                if grep -q "fastapi" "$PROJECT_ROOT/src/services/mcp/requirements.txt"; then
                    check_status "pass" "FastAPI dependency found for MCP server"
                else
                    check_status "warning" "FastAPI dependency missing for MCP server"
                fi
            else
                check_status "warning" "No requirements.txt for MCP server"
            fi
            
            # Check if Python MCP server is running
            PY_SERVER_PID=$(pgrep -f "python.*memoryServer.py" || echo "")
            if [ -n "$PY_SERVER_PID" ]; then
                check_status "pass" "MCP Python server is running (PID: $PY_SERVER_PID)"
            else
                check_status "warning" "MCP Python server is not running locally"
            fi
        else
            check_status "fail" "memoryServer.py missing"
        fi
    else
        check_status "fail" "MCP server directory missing"
    fi
else
    check_status "fail" "MemoryDashboard.tsx missing"
fi

echo ""

# Check database connection
echo -e "${BLUE}${BOLD}🗄️ DATABASE CONNECTION${NC}"
echo -e "${BLUE}----------------------------------------${NC}"

# Check for Supabase credentials
if [ -f "$PROJECT_ROOT/.env" ]; then
    if grep -q "SUPABASE_URL" "$PROJECT_ROOT/.env"; then
        check_status "pass" "Supabase URL found in .env"
    else
        check_status "warning" "No SUPABASE_URL in .env file"
    fi
    
    if grep -q "SUPABASE_KEY" "$PROJECT_ROOT/.env"; then
        check_status "pass" "Supabase API key found in .env"
    else
        check_status "warning" "No SUPABASE_KEY in .env file"
    fi
    
    # Check Supabase queries in codebase
    SUPABASE_QUERIES=$(grep -r "supabase" --include="*.ts" --include="*.tsx" "$PROJECT_ROOT/src" | wc -l)
    if [ "$SUPABASE_QUERIES" -gt 0 ]; then
        check_status "pass" "Found $SUPABASE_QUERIES Supabase queries in codebase"
    else
        check_status "warning" "No Supabase queries found in codebase"
    fi
    
    # Check for Supabase types
    if [ -d "$PROJECT_ROOT/src/types" ] && grep -q "supabase" --include="*.ts" "$PROJECT_ROOT/src/types"; then
        check_status "pass" "Supabase types defined"
    fi
else
    check_status "fail" "No .env file found for database credentials"
fi

echo ""

# Check for user authentication
echo -e "${BLUE}${BOLD}🔐 AUTHENTICATION${NC}"
echo -e "${BLUE}----------------------------------------${NC}"

# Look for auth files
if [ -d "$PROJECT_ROOT/src/auth" ] || grep -r "auth" --include="*.tsx" --include="*.ts" "$PROJECT_ROOT/src"; then
    check_status "pass" "Authentication system found in codebase"
    
    if grep -q "login\|signin\|authenticate" --include="*.tsx" --include="*.ts" "$PROJECT_ROOT/src"; then
        check_status "pass" "Login functionality found"
    else
        check_status "warning" "No login functionality detected"
    fi
    
    if grep -q "register\|signup" --include="*.tsx" --include="*.ts" "$PROJECT_ROOT/src"; then
        check_status "pass" "Registration functionality found"
    else
        check_status "warning" "No registration functionality detected"
    fi
else
    check_status "warning" "Authentication system not clearly identified"
fi

echo ""

# Summary and next steps
echo -e "${BLUE}${BOLD}📊 STATUS SUMMARY${NC}"
echo -e "${BLUE}----------------------------------------${NC}"
echo -e "${GREEN}✓ Passed checks: $PASSED_CHECKS${NC}"
echo -e "${YELLOW}⚠️  Warning checks: $WARNING_CHECKS${NC}"
echo -e "${RED}✗ Failed checks: $FAILED_CHECKS${NC}"
echo -e "Total checks: $TOTAL_CHECKS"

echo ""

# Determine deployment status
if [ -n "$LIVE_HASH" ] && [ -n "$CURRENT_HASH" ]; then
    if [ "$CURRENT_HASH" = "$LIVE_HASH" ]; then
        echo -e "${GREEN}${BOLD}✓ DEPLOYMENT STATUS: UP-TO-DATE${NC}"
        DEPLOYMENT_NEEDED="no"
    else
        echo -e "${YELLOW}${BOLD}⚠️  DEPLOYMENT STATUS: OUT-OF-DATE${NC}"
        echo -e "  Local hash: $CURRENT_HASH"
        echo -e "  Live hash: $LIVE_HASH"
        DEPLOYMENT_NEEDED="yes"
    fi
elif [ -n "$ZIP_FILES" ]; then
    echo -e "${YELLOW}${BOLD}⚠️  DEPLOYMENT STATUS: ZIP FILES PENDING EXTRACTION${NC}"
    DEPLOYMENT_NEEDED="manual-extraction"
else
    echo -e "${YELLOW}${BOLD}⚠️  DEPLOYMENT STATUS: UNKNOWN (Could not determine build hashes)${NC}"
    DEPLOYMENT_NEEDED="unknown"
fi

echo ""

# Next steps
echo -e "${BLUE}${BOLD}🎯 NEXT STEPS${NC}"
echo -e "${BLUE}----------------------------------------${NC}"

# Determine what actions are needed based on checks
if [ "$DEPLOYMENT_NEEDED" = "yes" ]; then
    echo -e "  ${YELLOW}1. DEPLOYMENT NEEDED: Hashes don't match${NC}"
    echo -e "     - Current: $CURRENT_HASH"
    echo -e "     - Live: $LIVE_HASH"
elif [ "$DEPLOYMENT_NEEDED" = "manual-extraction" ]; then
    echo -e "  ${YELLOW}1. MANUAL EXTRACTION NEEDED: ZIP files found${NC}"
elif [ "$DEPLOYMENT_NEEDED" = "unknown" ]; then
    echo -e "  ${YELLOW}1. BUILD VERIFICATION NEEDED: Could not determine deployment status${NC}"
else
    echo -e "  ${GREEN}1. Deployment appears up-to-date${NC}"
fi

echo -e "  ${BLUE}2. Test memory system:${NC} Visit /memory on live site when logged in"
echo -e "  ${BLUE}3. Verify chat functionality:${NC} Test pin system and custom emojis"
echo -e "  ${BLUE}4. Check memory dashboard:${NC} Ensure AI agent integration works"

# Additional checks based on our findings
if [ "$FAILED_CHECKS" -gt 0 ]; then
    echo -e "  ${RED}5. Fix failed checks:${NC} $FAILED_CHECKS issues need immediate attention"
fi

if [ "$WARNING_CHECKS" -gt 0 ]; then
    echo -e "  ${YELLOW}6. Address warnings:${NC} $WARNING_CHECKS potential issues detected"
fi

# Show manual deployment steps if needed
if [ "$DEPLOYMENT_NEEDED" = "yes" ] || [ "$DEPLOYMENT_NEEDED" = "manual-extraction" ]; then
    echo ""
    echo -e "${BLUE}${BOLD}🔧 MANUAL DEPLOYMENT STEPS${NC}"
    echo -e "${BLUE}----------------------------------------${NC}"
    echo -e "  1. Go to ${YELLOW}https://[domain]:2083${NC}"
    echo -e "  2. Open cPanel File Manager"
    echo -e "  3. Navigate to ${YELLOW}/public_html${NC}"
    echo -e "  4. Find ${YELLOW}snakkaz-dist.zip${NC}"
    echo -e "  5. Right-click → Extract → Extract to current directory"
    echo -e "  6. Delete ZIP after successful extraction"
    echo -e "  7. Verify site shows new build hash: ${YELLOW}$CURRENT_HASH${NC}"
    
    echo ""
    echo -e "${CYAN}${BOLD}💡 QUICK EXTRACTION COMMANDS${NC}"
    echo -e "${CYAN}----------------------------------------${NC}"
    echo -e "  If you have SSH access, use these commands:"
    echo -e "  ${YELLOW}cd /home/[username]/public_html${NC}"
    echo -e "  ${YELLOW}unzip -o snakkaz-dist.zip${NC}"
    echo -e "  ${YELLOW}rm snakkaz-dist.zip${NC}"
fi

# Add automated deployment option
if [ -f "$PROJECT_ROOT/scripts/deploy-automated.sh" ]; then
    echo ""
    echo -e "${BLUE}${BOLD}🚀 AUTOMATED DEPLOYMENT OPTION${NC}"
    echo -e "${BLUE}----------------------------------------${NC}"
    echo -e "  Run: ${YELLOW}./scripts/deploy-automated.sh${NC}"
    echo -e "  This will attempt full automated deployment including ZIP extraction"
elif [ -f "$PROJECT_ROOT/deploy-snakkaz-auto.sh" ]; then
    echo ""
    echo -e "${BLUE}${BOLD}🚀 AUTOMATED DEPLOYMENT OPTION${NC}"
    echo -e "${BLUE}----------------------------------------${NC}"
    echo -e "  Run: ${YELLOW}./deploy-snakkaz-auto.sh${NC}"
    echo -e "  This will attempt full automated deployment including ZIP extraction"
fi

# Memory system monitoring option
if [ -f "$PROJECT_ROOT/scripts/monitor-memory-system.sh" ]; then
    echo ""
    echo -e "${BLUE}${BOLD}🧠 MEMORY SYSTEM MONITORING${NC}"
    echo -e "${BLUE}----------------------------------------${NC}"
    echo -e "  Run: ${YELLOW}./scripts/monitor-memory-system.sh${NC}"
    echo -e "  This will monitor the MCP server and memory system integration"
fi

echo ""
echo -e "${BLUE}${BOLD}Status check completed at $(date)${NC}"
echo -e "${BLUE}=========================================${NC}"
