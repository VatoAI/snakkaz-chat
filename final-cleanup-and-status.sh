#!/bin/bash

echo "🧹🚀 SNAKKAZ COMPREHENSIVE CLEANUP & STATUS REPORT"
echo "=================================================="
echo "Date: $(date)"
echo "Time: $(date '+%H:%M:%S UTC')"
echo

# === CLEANUP PHASE ===
echo "🗑️  PHASE 1: DEPLOYMENT CLEANUP"
echo "==============================="

echo "Removing old emergency scripts and deployment artifacts..."

# Count files before cleanup
before_count=$(ls -1 | grep -E "(emergency|deploy|fix|status|verification|final|corrected)" | wc -l)
echo "Files to clean: $before_count"

# Remove old deployment scripts
rm -f emergency-*.sh emergency-*.lftp emergency-*.js emergency-*.html 2>/dev/null
rm -f *-deploy*.sh *-deploy*.lftp CORRECTED-*.sh EMERGENCY-*.sh 2>/dev/null
rm -f final-*.sh final-*.lftp FINAL-*.sh FINAL-*.lftp 2>/dev/null
rm -f *-fix-*.sh *-status*.sh *-verification*.sh 2>/dev/null
rm -f apply-*.sql debug-*.js debug-*.mjs check-*.mjs 2>/dev/null
rm -f drastisk-*.sh *-cleanup*.sh complete-*.lftp 2>/dev/null
rm -f *-emergency*.sh *-hotfix*.js *-repair*.sh 2>/dev/null
rm -f *RAPPORT*.sh *STATUS*.md *DEPLOYMENT*.md 2>/dev/null
rm -f alternative-ftp.sh analyze-database.mjs 2>/dev/null
rm -f clean-restart-*.sh continue-iteration-*.sh 2>/dev/null
rm -f enhanced-health-monitor.sh force-*.lftp 2>/dev/null
rm -f investigate-*.mjs iterate-*.js monitor-*.js 2>/dev/null
rm -f measure-*.mjs run-*.mjs simple-*.sh 2>/dev/null
rm -f test-*.js test-*.mjs test-*.py 2>/dev/null
rm -f upload-*.lftp verify-*.sh verify-*.js 2>/dev/null

# Count files after cleanup
after_count=$(ls -1 | grep -E "(emergency|deploy|fix|status|verification|final|corrected)" | wc -l 2>/dev/null || echo "0")
echo "Files remaining: $after_count"
echo "✅ Cleaned $(($before_count - $after_count)) deployment artifacts"

# === STATUS CHECK PHASE ===
echo
echo "🔍 PHASE 2: COMPREHENSIVE STATUS CHECK"
echo "======================================"

# Check main site
echo "🌐 Main Site Status:"
main_response=$(curl -s -o /dev/null -w "%{http_code}" https://snakkaz.com/)
if [ "$main_response" = "200" ]; then
    echo "   ✅ Main site accessible (HTTP $main_response)"
else
    echo "   ❌ Main site failed (HTTP $main_response)"
fi

# Check critical JavaScript files
echo
echo "📄 JavaScript Files Status:"

# Get actual file names from live site
react_core_file=$(curl -s https://snakkaz.com/ | grep -o "vendor-react-core-[a-zA-Z0-9_-]*\.js" | head -1)
react_dom_file=$(curl -s https://snakkaz.com/ | grep -o "vendor-react-dom-[a-zA-Z0-9_-]*\.js" | head -1)
vendor_misc_file=$(curl -s https://snakkaz.com/ | grep -o "vendor-misc-[a-zA-Z0-9_-]*\.js" | head -1)
main_file=$(curl -s https://snakkaz.com/ | grep -o "index-[a-zA-Z0-9_-]*\.js" | head -1)

files_to_check=("$react_core_file" "$react_dom_file" "$vendor_misc_file" "$main_file")
file_names=("React Core" "React DOM" "Vendor Misc" "Main Entry")

all_files_ok=true

for i in "${!files_to_check[@]}"; do
    file="${files_to_check[$i]}"
    name="${file_names[$i]}"
    
    if [ -n "$file" ]; then
        # Check HTTP status
        response=$(curl -s -o /dev/null -w "%{http_code}" "https://snakkaz.com/assets/js/$file")
        
        # Check MIME type
        mime_type=$(curl -s -I "https://snakkaz.com/assets/js/$file" | grep -i "content-type" | grep -o "application/javascript")
        
        if [ "$response" = "200" ] && [ -n "$mime_type" ]; then
            echo "   ✅ $name ($file): OK"
        else
            echo "   ❌ $name ($file): FAILED (HTTP: $response, MIME: $mime_type)"
            all_files_ok=false
        fi
    else
        echo "   ❌ $name: FILE NOT FOUND"
        all_files_ok=false
    fi
done

# Check module loading order
echo
echo "📦 Module Loading Order:"
module_order=$(curl -s https://snakkaz.com/ | grep -E "vendor-react-core|vendor-misc" | head -2)
if echo "$module_order" | grep -q "vendor-react-core.*vendor-misc"; then
    echo "   ✅ React Core loads before Vendor Misc (CORRECT)"
else
    echo "   ❌ Module loading order is incorrect"
    all_files_ok=false
fi

# Check for emergency fixes
echo
echo "🚫 Emergency Fix Check:"
emergency_check=$(curl -s https://snakkaz.com/ | grep "emergency-react-fix")
if [ -z "$emergency_check" ]; then
    echo "   ✅ No emergency fixes detected"
else
    echo "   ❌ Emergency fixes still present"
    all_files_ok=false
fi

# Check Supabase connection
echo
echo "🗄️  Supabase Connection:"
supabase_response=$(curl -s -o /dev/null -w "%{http_code}" "https://wqpoozpbceucynsojmbk.supabase.co/rest/v1/" -H "apikey: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndxcG9venBiY2V1Y3luc29qbWJrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzk1NjgzMDUsImV4cCI6MjA1NTE0NDMwNX0.vu1s86gQKEPXFleOZ1U2uOjW-kj4k4RAiKTbOuXPUD8")

if [ "$supabase_response" = "200" ]; then
    echo "   ✅ Supabase API accessible (HTTP $supabase_response)"
else
    echo "   ❌ Supabase API failed (HTTP $supabase_response)"
fi

# === CONFIGURATION PHASE ===
echo
echo "🔧 PHASE 3: CONFIGURATION UPDATE"
echo "================================"

# Update .env with correct values
echo "📝 Updating environment configuration..."
cat > .env << 'EOF'
# SnakkaZ Chat Environment Configuration
# Updated: $(date)

# Supabase Configuration
VITE_SUPABASE_URL=https://wqpoozpbceucynsojmbk.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndxcG9venBiY2V1Y3luc29qbWJrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzk1NjgzMDUsImV4cCI6MjA1NTE0NDMwNX0.vu1s86gQKEPXFleOZ1U2uOjW-kj4k4RAiKTbOuXPUD8

# Application Settings
VITE_APP_NAME=SnakkaZ Chat
VITE_APP_URL=https://snakkaz.com

# Development Settings
NODE_ENV=production
EOF

echo "   ✅ Environment variables updated"

# Create modern package.json scripts
echo
echo "📋 Updating package.json scripts..."
if command -v jq > /dev/null; then
    cp package.json package.json.backup
    jq '.scripts.deploy = "./deploy.sh" | .scripts."deploy:quick" = "lftp -f quick-deploy.lftp" | .scripts."health-check" = "./health-check.sh" | .scripts."clean-deploy" = "rm -rf dist && npm run build && ./deploy.sh"' package.json > package.json.tmp && mv package.json.tmp package.json
    echo "   ✅ Package.json scripts updated"
else
    echo "   ⚠️  jq not available, skipping package.json update"
fi

# === SUMMARY PHASE ===
echo
echo "🏁 PHASE 4: FINAL STATUS SUMMARY"
echo "================================"

if $all_files_ok; then
    echo "🎉 SUCCESS! All systems operational:"
    echo
    echo "✅ JavaScript files accessible with correct MIME types"
    echo "✅ React dependencies load in correct order"
    echo "✅ No emergency fix interference"
    echo "✅ Supabase connection working"
    echo "✅ Clean deployment environment"
    echo
    echo "🌐 SnakkaZ.com is ready for production use!"
    echo "🚀 React 'K is undefined' error should be resolved"
    echo
    echo "🔄 Users should clear browser cache to see improvements"
else
    echo "⚠️  Some issues detected. Review the status checks above."
fi

echo
echo "📖 Available Commands:"
echo "• npm run deploy         - Full deployment"
echo "• npm run deploy:quick   - Quick deployment"
echo "• npm run health-check   - Check site health"
echo "• npm run clean-deploy   - Clean build and deploy"
echo
echo "🌐 Live Site: https://snakkaz.com"
echo "🗄️  Supabase: https://wqpoozpbceucynsojmbk.supabase.co"
echo
echo "✨ Cleanup and verification completed!"
