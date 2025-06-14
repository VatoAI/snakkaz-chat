#!/bin/bash

# ================================================
# SNAKKAZ COMPREHENSIVE APP DEBUGGER
# Juni 14, 2025 - VatoAI
# ================================================

echo "🔍 SNAKKAZ APP COMPREHENSIVE DEBUGGER - Juni 14, 2025"
echo "====================================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Create debug results directory
mkdir -p debug-results
DEBUG_LOG="debug-results/debug-$(date +%Y%m%d_%H%M%S).log"

log_result() {
    echo -e "$1" | tee -a "$DEBUG_LOG"
}

log_result "🔍 Starting comprehensive debug at $(date)"
log_result "📁 Working directory: $(pwd)"

# 1. PROJECT STRUCTURE VALIDATION
echo -e "\n${BLUE}1. 📂 PROJECT STRUCTURE VALIDATION${NC}"
log_result "\n=== PROJECT STRUCTURE ==="

# Check critical files
critical_files=("package.json" "vite.config.ts" "src/main.tsx" "src/App.tsx" "index.html")
for file in "${critical_files[@]}"; do
    if [ -f "$file" ]; then
        log_result "✅ $file exists"
    else
        log_result "❌ $file MISSING"
    fi
done

# Check critical directories
critical_dirs=("src" "src/components" "src/pages" "src/services" "src/utils" "dist")
for dir in "${critical_dirs[@]}"; do
    if [ -d "$dir" ]; then
        log_result "✅ $dir/ exists"
    else
        log_result "❌ $dir/ MISSING"
    fi
done

# 2. DEPENDENCY ANALYSIS
echo -e "\n${BLUE}2. 📦 DEPENDENCY ANALYSIS${NC}"
log_result "\n=== DEPENDENCY ANALYSIS ==="

if command -v npm &> /dev/null; then
    log_result "📊 Running npm audit..."
    npm audit --audit-level=moderate >> "$DEBUG_LOG" 2>&1
    
    log_result "📊 Checking outdated packages..."
    npm outdated >> "$DEBUG_LOG" 2>&1
    
    log_result "📊 Verifying React versions..."
    npm ls react react-dom >> "$DEBUG_LOG" 2>&1
fi

# 3. SOURCE CODE ANALYSIS
echo -e "\n${BLUE}3. 🔍 SOURCE CODE ANALYSIS${NC}"
log_result "\n=== SOURCE CODE ANALYSIS ==="

# Check for common problematic patterns
log_result "🔍 Scanning for undefined variables..."
grep -r "K is undefined\|undefined.*K\|let K\|var K\|const K" src/ --include="*.ts" --include="*.tsx" --include="*.js" --include="*.jsx" | head -10 >> "$DEBUG_LOG" 2>&1

log_result "🔍 Scanning for React import issues..."
grep -r "import.*React" src/ --include="*.ts" --include="*.tsx" --include="*.js" --include="*.jsx" | head -10 >> "$DEBUG_LOG" 2>&1

log_result "🔍 Scanning for useState issues..."
grep -r "useState\|use-sync-external-store" src/ --include="*.ts" --include="*.tsx" --include="*.js" --include="*.jsx" | head -10 >> "$DEBUG_LOG" 2>&1

log_result "🔍 Scanning for minified variable patterns..."
find src/ -name "*.ts" -o -name "*.tsx" -o -name "*.js" -o -name "*.jsx" | xargs grep -l "^\s*[A-Z]\s*=" | head -5 >> "$DEBUG_LOG" 2>&1

# 4. BUILD ANALYSIS
echo -e "\n${BLUE}4. 🏗️ BUILD ANALYSIS${NC}"
log_result "\n=== BUILD ANALYSIS ==="

if [ -d "dist" ]; then
    log_result "📊 Analyzing dist directory..."
    ls -la dist/ >> "$DEBUG_LOG" 2>&1
    
    if [ -d "dist/assets/js" ]; then
        log_result "📊 JavaScript bundle analysis..."
        ls -la dist/assets/js/ | grep -E "\.(js|js\.map)$" >> "$DEBUG_LOG" 2>&1
        
        # Check the problematic vendor-misc file
        if [ -f "dist/assets/js/vendor-misc-CX17Fr9w.js" ]; then
            log_result "🔍 Analyzing problematic vendor-misc bundle..."
            echo "File size: $(du -h dist/assets/js/vendor-misc-CX17Fr9w.js)" >> "$DEBUG_LOG"
            
            # Look for single letter variables at start of lines (common minification issue)
            grep -o "^[A-Z]=" dist/assets/js/vendor-misc-CX17Fr9w.js | head -10 >> "$DEBUG_LOG" 2>&1
            
            # Look for 'K is undefined' or similar patterns
            grep -o "K is undefined\|[A-Z] is undefined\|undefined.*[A-Z]" dist/assets/js/vendor-misc-CX17Fr9w.js | head -5 >> "$DEBUG_LOG" 2>&1
        fi
        
        # Check sourcemap issues
        log_result "🗺️ Checking sourcemap files..."
        find dist/assets/js/ -name "*.js.map" | while read mapfile; do
            if [ -f "$mapfile" ]; then
                log_result "✅ Found: $mapfile"
                # Validate JSON
                if jq empty "$mapfile" 2>/dev/null; then
                    log_result "✅ Valid JSON: $mapfile"
                else
                    log_result "❌ Invalid JSON: $mapfile"
                fi
            fi
        done
    fi
else
    log_result "❌ dist/ directory not found - need to build first"
fi

# 5. RUNTIME ERROR ANALYSIS
echo -e "\n${BLUE}5. 🐛 RUNTIME ERROR ANALYSIS${NC}"
log_result "\n=== RUNTIME ERROR ANALYSIS ==="

# Check for known problematic patterns in React/Vite builds
log_result "🔍 Checking Vite config for bundle optimization issues..."
if [ -f "vite.config.ts" ]; then
    grep -n "manualChunks\|minify\|terser" vite.config.ts >> "$DEBUG_LOG" 2>&1
fi

# Check main.tsx for import order issues
if [ -f "src/main.tsx" ]; then
    log_result "🔍 Checking main.tsx import order..."
    head -20 src/main.tsx >> "$DEBUG_LOG" 2>&1
fi

# 6. LIVE SITE ANALYSIS
echo -e "\n${BLUE}6. 🌐 LIVE SITE ANALYSIS${NC}"
log_result "\n=== LIVE SITE ANALYSIS ==="

if command -v curl &> /dev/null; then
    log_result "🌐 Testing live site accessibility..."
    HTTP_CODE=$(curl -s -w "%{http_code}" "https://www.snakkaz.com" -o /dev/null)
    log_result "HTTP Status: $HTTP_CODE"
    
    if [ "$HTTP_CODE" = "200" ]; then
        log_result "✅ Site is accessible"
        
        # Check for JavaScript errors in console (basic check)
        log_result "🔍 Checking for error patterns in live JS..."
        curl -s "https://www.snakkaz.com/assets/js/vendor-misc-CX17Fr9w.js" | grep -o "K is undefined\|[A-Z] is undefined" | head -3 >> "$DEBUG_LOG" 2>&1
        
        # Check if source map exists
        if curl -s --head "https://www.snakkaz.com/assets/js/vendor-misc-CX17Fr9w.js.map" | grep -q "200 OK"; then
            log_result "✅ Source map exists"
        else
            log_result "❌ Source map missing or inaccessible"
        fi
    else
        log_result "❌ Site not accessible (HTTP $HTTP_CODE)"
    fi
fi

# 7. TYPESCRIPT ANALYSIS
echo -e "\n${BLUE}7. 📝 TYPESCRIPT ANALYSIS${NC}"
log_result "\n=== TYPESCRIPT ANALYSIS ==="

if command -v npx &> /dev/null; then
    log_result "🔍 Running TypeScript compiler check..."
    npx tsc --noEmit --skipLibCheck >> "$DEBUG_LOG" 2>&1
fi

# 8. MEMORY AND PERFORMANCE
echo -e "\n${BLUE}8. ⚡ PERFORMANCE ANALYSIS${NC}"
log_result "\n=== PERFORMANCE ANALYSIS ==="

# Check bundle sizes
if [ -d "dist/assets" ]; then
    log_result "📊 Bundle size analysis..."
    find dist/assets -name "*.js" -exec du -h {} \; | sort -hr >> "$DEBUG_LOG" 2>&1
fi

# Check for large dependencies
log_result "📦 Large dependency analysis..."
npm ls --depth=0 --long >> "$DEBUG_LOG" 2>&1

# 9. RECOMMENDATIONS AND FIXES
echo -e "\n${BLUE}9. 💡 RECOMMENDATIONS AND FIXES${NC}"
log_result "\n=== RECOMMENDATIONS ==="

log_result "🔧 Potential fixes for 'K is undefined' error:"
log_result "1. Rebuild with source maps: npm run build:analyze"
log_result "2. Check Vite minification settings"
log_result "3. Verify all imports are properly resolved"
log_result "4. Check for circular dependencies"
log_result "5. Update dependencies to latest versions"

# 10. CREATE QUICK FIX SCRIPT
echo -e "\n${BLUE}10. 🚀 CREATING QUICK FIX SCRIPT${NC}"
cat > debug-results/quick-fix-k-undefined.sh << 'EOL'
#!/bin/bash
echo "🔧 Quick fix for 'K is undefined' error"

# 1. Clean rebuild with better source maps
echo "1. Cleaning and rebuilding..."
rm -rf dist/
npm run build:analyze

# 2. Update source map handling in Vite config
echo "2. Checking Vite config..."
if grep -q "sourcemap: true" vite.config.ts; then
    echo "✅ Source maps enabled"
else
    echo "❌ Source maps might need enabling"
fi

# 3. Check if rebuild fixed the issue
if [ -f "dist/assets/js/vendor-misc-*.js" ]; then
    echo "3. Checking new build for K undefined..."
    VENDOR_FILE=$(ls dist/assets/js/vendor-misc-*.js | head -1)
    if grep -q "K is undefined" "$VENDOR_FILE"; then
        echo "❌ K undefined still present"
    else
        echo "✅ K undefined issue might be resolved"
    fi
fi

echo "4. Ready to deploy with: npm run deploy"
EOL

chmod +x debug-results/quick-fix-k-undefined.sh

# SUMMARY
echo -e "\n${GREEN}🎯 DEBUG SUMMARY${NC}"
log_result "\n=== DEBUG SUMMARY ==="
log_result "📁 Debug log saved to: $DEBUG_LOG"
log_result "🔧 Quick fix script: debug-results/quick-fix-k-undefined.sh"
log_result "📊 Check the log file for detailed analysis"

echo -e "\n${YELLOW}Next steps:${NC}"
echo "1. Review the debug log: cat $DEBUG_LOG"
echo "2. Run the quick fix: ./debug-results/quick-fix-k-undefined.sh"
echo "3. If issue persists, check Vite bundling configuration"

log_result "\n🔍 Debug completed at $(date)"
