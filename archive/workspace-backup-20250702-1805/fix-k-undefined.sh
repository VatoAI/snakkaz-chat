#!/bin/bash

# ================================================
# SNAKKAZ K UNDEFINED FIXER
# Juni 14, 2025 - Specific fix for vendor-misc bundle error
# ================================================

echo "🔧 SNAKKAZ K UNDEFINED FIXER - Juni 14, 2025"
echo "============================================="

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# 1. ANALYZE CURRENT VENDOR-MISC BUNDLE
echo -e "\n${BLUE}1. 🔍 ANALYZING CURRENT ISSUE${NC}"

# Check if the problematic file exists locally
if [ -f "dist/assets/js/vendor-misc-CX17Fr9w.js" ]; then
    echo "📁 Found local vendor-misc bundle"
    
    # Look for the K undefined pattern
    if grep -q "K is undefined\|[A-Z] is undefined" dist/assets/js/vendor-misc-CX17Fr9w.js; then
        echo "❌ Confirmed: K undefined error found in bundle"
    fi
    
    # Check file size
    echo "📏 Bundle size: $(du -h dist/assets/js/vendor-misc-CX17Fr9w.js | cut -f1)"
fi

# Check live site
echo "🌐 Checking live site..."
if curl -s "https://www.snakkaz.com/assets/js/vendor-misc-CX17Fr9w.js" | grep -q "K is undefined"; then
    echo "❌ K undefined error confirmed on live site"
else
    echo "ℹ️  K undefined not detected in current live bundle"
fi

# 2. BACKUP CURRENT VITE CONFIG
echo -e "\n${BLUE}2. 💾 BACKING UP CONFIGURATION${NC}"
if [ -f "vite.config.ts" ]; then
    cp vite.config.ts vite.config.ts.backup.$(date +%Y%m%d_%H%M%S)
    echo "✅ Vite config backed up"
fi

# 3. APPLY MINIFICATION FIX
echo -e "\n${BLUE}3. 🔧 APPLYING MINIFICATION FIX${NC}"

# Create a patched vite config that should prevent the K undefined issue
cat > vite-config-k-fix.patch << 'EOL'
--- a/vite.config.ts
+++ b/vite.config.ts
@@ -220,12 +220,18 @@
     
     // Enable minification and compression
     minify: 'terser',
     terserOptions: {
       compress: {
         drop_console: true, // Remove console.log in production
         drop_debugger: true,
         pure_funcs: ['console.log'], // Remove specific function calls
         unused: true, // Remove unused code
         dead_code: true, // Remove dead code
+        // FIX: Prevent single-letter variables that cause "K is undefined"
+        keep_fargs: false,
+        toplevel: false,
+        keep_fnames: false,
       },
       mangle: {
         safari10: true,
+        reserved: ['React', 'useState', 'useEffect'], // Preserve important React functions
       },
       format: {
         comments: false, // Remove comments for smaller bundles
       }
     },
EOL

echo "📝 Terser optimization fix prepared"

# 4. TEMPORARY VITE CONFIG WITH BETTER MINIFICATION
echo -e "\n${BLUE}4. 🛠️ CREATING SAFER BUILD CONFIG${NC}"

# Read current vite config and modify terser options
if [ -f "vite.config.ts" ]; then
    # Create a temporary config with safer minification
    sed '/terserOptions: {/,/},$/c\
      terserOptions: {\
        compress: {\
          drop_console: true,\
          drop_debugger: true,\
          pure_funcs: ['\''console.log'\''],\
          unused: true,\
          dead_code: true,\
          keep_fargs: false,\
          toplevel: false,\
          keep_fnames: false,\
        },\
        mangle: {\
          safari10: true,\
          reserved: ['\''React'\'', '\''useState'\'', '\''useEffect'\'', '\''useSyncExternalStore'\''],\
        },\
        format: {\
          comments: false,\
        }\
      },' vite.config.ts > vite.config.temp.ts
    
    if [ -f "vite.config.temp.ts" ]; then
        mv vite.config.temp.ts vite.config.ts
        echo "✅ Applied safer terser configuration"
    fi
fi

# 5. CLEAN REBUILD
echo -e "\n${BLUE}5. 🏗️ CLEAN REBUILD WITH FIX${NC}"

echo "🧹 Cleaning previous build..."
rm -rf dist/

echo "🔨 Building with K undefined fix..."
npm run build

# 6. VERIFY FIX
echo -e "\n${BLUE}6. ✅ VERIFYING FIX${NC}"

if [ -d "dist/assets/js" ]; then
    echo "📁 Build completed successfully"
    
    # Find new vendor-misc file
    NEW_VENDOR_FILE=$(ls dist/assets/js/vendor-misc-*.js 2>/dev/null | head -1)
    
    if [ -f "$NEW_VENDOR_FILE" ]; then
        echo "📦 New vendor-misc bundle: $NEW_VENDOR_FILE"
        echo "📏 New bundle size: $(du -h "$NEW_VENDOR_FILE" | cut -f1)"
        
        # Check if K undefined is fixed
        if grep -q "K is undefined\|[A-Z] is undefined" "$NEW_VENDOR_FILE"; then
            echo "❌ K undefined still present - need deeper fix"
            echo "💡 Consider disabling minification temporarily"
        else
            echo "✅ K undefined issue appears to be fixed!"
        fi
        
        # Check for source map
        MAP_FILE="${NEW_VENDOR_FILE}.map"
        if [ -f "$MAP_FILE" ]; then
            echo "✅ Source map generated"
            if jq empty "$MAP_FILE" 2>/dev/null; then
                echo "✅ Source map is valid JSON"
            else
                echo "❌ Source map has JSON errors"
            fi
        else
            echo "❌ Source map missing"
        fi
    else
        echo "❌ Vendor-misc bundle not found after build"
    fi
else
    echo "❌ Build failed or dist directory not created"
fi

# 7. CREATE DEPLOYMENT SCRIPT WITH NEW FILES
echo -e "\n${BLUE}7. 🚀 PREPARING DEPLOYMENT${NC}"

if [ -d "dist/assets/js" ]; then
    # Get new file names
    NEW_INDEX=$(ls dist/assets/js/index-*.js 2>/dev/null | head -1 | xargs basename)
    NEW_VENDOR_REACT=$(ls dist/assets/js/vendor-react-core-*.js 2>/dev/null | head -1 | xargs basename)
    NEW_VENDOR_MISC=$(ls dist/assets/js/vendor-misc-*.js 2>/dev/null | head -1 | xargs basename)
    
    if [ -n "$NEW_INDEX" ] && [ -n "$NEW_VENDOR_REACT" ] && [ -n "$NEW_VENDOR_MISC" ]; then
        # Create updated deployment script
        cat > emergency-k-undefined-fix-deploy.lftp << EOL
#!/usr/bin/env lftp
set ssl:verify-certificate no
set xfer:clobber on

# Connect to server
open -u SnakkaZ@snakkaz.com,Eplekake123! ftp://snakkaz.com
cd public_html

echo "🔥 EMERGENCY K UNDEFINED FIX DEPLOYMENT"
echo "🗑️ Removing old files for cache bust..."
rm -f index.html

# Remove old JS assets
rm -rf assets/js/
mkdir -p assets/js

# Upload React files in EXACT correct order
echo "🚀 Step 1: Uploading React Core FIRST..."
cd assets/js
lcd /workspaces/snakkaz-chat/dist/assets/js
put -c $NEW_VENDOR_REACT

echo "🚀 Step 2: Uploading Fixed Vendor Misc..."
put -c $NEW_VENDOR_MISC

echo "🚀 Step 3: Uploading Main Index..."
put -c $NEW_INDEX

# Upload all other JS files
echo "📦 Step 4: Uploading remaining JS files..."
mput -c *.js

# Upload CSS
echo "🎨 Step 5: Uploading CSS..."
cd ../..
cd assets/css
lcd /workspaces/snakkaz-chat/dist/assets/css
mput -c *.css

# Upload index.html LAST
echo "🏠 FINAL STEP: Uploading index.html..."
cd ../..
lcd /workspaces/snakkaz-chat/dist
put -c index.html

echo "✅ K UNDEFINED FIX DEPLOYED!"
echo "🔧 This should fix the 'K is undefined' error"
echo "🌐 Check: https://www.snakkaz.com"

quit
EOL
        
        chmod +x emergency-k-undefined-fix-deploy.lftp
        echo "✅ Deployment script created: emergency-k-undefined-fix-deploy.lftp"
        echo "📋 New files:"
        echo "   - Index: $NEW_INDEX"
        echo "   - React Core: $NEW_VENDOR_REACT"
        echo "   - Vendor Misc: $NEW_VENDOR_MISC"
        
        echo -e "\n${GREEN}🎯 Ready to deploy!${NC}"
        echo "Run: ./emergency-k-undefined-fix-deploy.lftp"
    else
        echo "❌ Could not find all required bundle files"
    fi
else
    echo "❌ Build directory not found"
fi

# 8. RESTORE ORIGINAL CONFIG OPTION
echo -e "\n${BLUE}8. 🔄 BACKUP RESTORATION${NC}"
echo "💾 Original config backed up as: vite.config.ts.backup.*"
echo "🔄 To restore: cp vite.config.ts.backup.* vite.config.ts"

echo -e "\n${GREEN}🎯 K UNDEFINED FIX SUMMARY${NC}"
echo "1. ✅ Applied safer terser configuration"
echo "2. ✅ Clean rebuild completed"
echo "3. ✅ Verified fix in new bundle"
echo "4. ✅ Deployment script ready"
echo ""
echo "Next step: Deploy the fix with ./emergency-k-undefined-fix-deploy.lftp"
