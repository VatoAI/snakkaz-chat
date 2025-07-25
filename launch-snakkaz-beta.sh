#!/bin/bash
# 🚀 SnakkaZ Beta Launch Script - Deploy to www.snakkaz.com
# Usage: ./launch-snakkaz-beta.sh

echo "🚀 SNAKKAZ BETA LAUNCH SEQUENCE INITIATED!"
echo "📅 Launch Date: $(date)"
echo "🎯 Target: www.snakkaz.com"
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Step 1: Verify we're in the right directory
echo -e "${BLUE}📂 Step 1: Verifying workspace...${NC}"
if [ ! -f "package.json" ] || [ ! -d "src" ]; then
    echo -e "${RED}❌ Error: Not in SnakkaZ workspace directory!${NC}"
    echo "Please run this script from /workspaces/snakkaz-chat/"
    exit 1
fi
echo -e "${GREEN}✅ Workspace verified!${NC}"
echo ""

# Step 2: Clean and build production version
echo -e "${BLUE}🔨 Step 2: Building production version...${NC}"
echo "Cleaning previous build..."
rm -rf dist/

echo "Building optimized production bundle..."
npm run build:prod

if [ ! -d "dist" ]; then
    echo -e "${RED}❌ Build failed! dist/ folder not created.${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Production build complete!${NC}"
echo ""

# Step 3: Create deployment package
echo -e "${BLUE}📦 Step 3: Creating deployment package...${NC}"

# Create deployment directory
DEPLOY_DIR="snakkaz-beta-launch-$(date +%Y%m%d_%H%M%S)"
mkdir -p "$DEPLOY_DIR"

# Copy all dist contents to deployment package
echo "Copying build files..."
cp -r dist/* "$DEPLOY_DIR/"

# Add deployment instructions
cat > "$DEPLOY_DIR/DEPLOY-INSTRUCTIONS.txt" << 'EOF'
🚀 SNAKKAZ BETA DEPLOYMENT INSTRUCTIONS

1. CLEAR PUBLIC_HTML:
   - Log into cPanel File Manager
   - Navigate to public_html folder
   - SELECT ALL files and DELETE them

2. UPLOAD FILES:
   - Select ALL files from this folder
   - Upload to public_html ROOT (not subfolder!)
   - Verify all files are in root level

3. SET PERMISSIONS:
   - Files: 644
   - Folders: 755

4. TEST:
   - Visit: https://www.snakkaz.com
   - Hard refresh: Ctrl+F5
   - Check console: F12 (should be no errors)

✅ SUCCESS INDICATORS:
- App loads with Glass Liquid design
- No console errors
- PWA install prompt appears
- All features work (login, chat, etc.)

🎉 SNAKKAZ BETA IS NOW LIVE!
EOF

# Create ZIP package for easy upload
echo "Creating ZIP package..."
zip -r "${DEPLOY_DIR}.zip" "$DEPLOY_DIR/" -q

# Get file sizes
FOLDER_SIZE=$(du -sh "$DEPLOY_DIR" | cut -f1)
ZIP_SIZE=$(du -sh "${DEPLOY_DIR}.zip" | cut -f1)

echo -e "${GREEN}✅ Deployment package created!${NC}"
echo "📁 Folder: $DEPLOY_DIR ($FOLDER_SIZE)"
echo "📦 ZIP: ${DEPLOY_DIR}.zip ($ZIP_SIZE)"
echo ""

# Step 4: Verify package contents
echo -e "${BLUE}🔍 Step 4: Verifying package contents...${NC}"

REQUIRED_FILES=(
    "index.html"
    "manifest.json"
    "service-worker-improved.js"
    "assets/css"
    "assets/js"
    "icons"
    "robots.txt"
)

ALL_GOOD=true
for file in "${REQUIRED_FILES[@]}"; do
    if [ -e "$DEPLOY_DIR/$file" ]; then
        echo -e "${GREEN}✅ $file${NC}"
    else
        echo -e "${RED}❌ Missing: $file${NC}"
        ALL_GOOD=false
    fi
done

if [ "$ALL_GOOD" = false ]; then
    echo -e "${RED}❌ Package verification failed!${NC}"
    exit 1
fi

echo -e "${GREEN}✅ All required files present!${NC}"
echo ""

# Step 5: Show deployment summary
echo -e "${BLUE}📊 Step 5: Deployment Summary${NC}"
echo "=================================="
echo -e "🎯 Target Domain: ${YELLOW}www.snakkaz.com${NC}"
echo -e "📦 Package Ready: ${GREEN}${DEPLOY_DIR}.zip${NC}"
echo -e "📁 Package Size: ${YELLOW}$ZIP_SIZE${NC}"
echo -e "🔧 Files Included: ${YELLOW}$(find "$DEPLOY_DIR" -type f | wc -l) files${NC}"
echo ""

# Step 6: Next steps
echo -e "${BLUE}🚀 NEXT STEPS FOR LAUNCH:${NC}"
echo "=================================="
echo "1. 📤 Upload ${DEPLOY_DIR}.zip to cPanel"
echo "2. 📂 Extract to public_html root"
echo "3. 🌐 Visit www.snakkaz.com"
echo "4. 🧪 Test all features"
echo "5. 🎉 Celebrate successful launch!"
echo ""

# Create a quick test script
cat > "test-snakkaz-live.sh" << 'EOF'
#!/bin/bash
echo "🧪 Testing SnakkaZ Beta Live..."
echo "🌐 Checking www.snakkaz.com..."

# Test if site is reachable
if curl -s -o /dev/null -w "%{http_code}" "https://www.snakkaz.com" | grep -q "200"; then
    echo "✅ Site is online!"
    echo "🎉 SnakkaZ Beta launch successful!"
else
    echo "❌ Site is not reachable or returning errors"
    echo "🔧 Check deployment and try again"
fi
EOF

chmod +x test-snakkaz-live.sh

echo -e "${GREEN}🎉 SNAKKAZ BETA LAUNCH PACKAGE IS READY!${NC}"
echo ""
echo -e "${YELLOW}📦 Upload this file to cPanel: ${DEPLOY_DIR}.zip${NC}"
echo -e "${YELLOW}📋 Follow instructions in: $DEPLOY_DIR/DEPLOY-INSTRUCTIONS.txt${NC}"
echo -e "${YELLOW}🧪 Test after deployment: ./test-snakkaz-live.sh${NC}"
echo ""
echo -e "${BLUE}🚀 Ready to launch SnakkaZ Beta to the world! 🌍${NC}"
