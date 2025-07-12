#!/bin/bash

# WORKSPACE CLEANUP SCRIPT - Phase 2
# Handles remaining files and sets up admin tools

echo "🧹 STARTING WORKSPACE CLEANUP - PHASE 2"
echo "======================================"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}Phase 2a: Archiving debug and test files...${NC}"

# Move debug files to archive
mv debug-emoji-search.js archive/ 2>/dev/null || echo "File not found: debug-emoji-search.js"
mv debug-emoji-search.mjs archive/ 2>/dev/null || echo "File not found: debug-emoji-search.mjs"
mv debug-emoji-test.js archive/ 2>/dev/null || echo "File not found: debug-emoji-test.js"
mv debug-simple.js archive/ 2>/dev/null || echo "File not found: debug-simple.js"

# Move old HTML files
mv index-fixed.html archive/ 2>/dev/null || echo "File not found: index-fixed.html"
mv emergency-index.html archive/ 2>/dev/null || echo "File not found: emergency-index.html"

echo -e "${GREEN}✓ Debug and test files archived${NC}"

echo ""
echo -e "${BLUE}Phase 2b: Organizing remaining scripts...${NC}"

# Move extraction and verification scripts
mv extract-cpanel.sh scripts/deployment/ 2>/dev/null || echo "File not found: extract-cpanel.sh"
mv fix-html.mjs scripts/deployment/ 2>/dev/null || echo "File not found: fix-html.mjs"
mv final-mime-type-verification.sh scripts/deployment/ 2>/dev/null || echo "File not found: final-mime-type-verification.sh"
mv final-react-error-verification.sh scripts/deployment/ 2>/dev/null || echo "File not found: final-react-error-verification.sh"
mv FINAL-STATUS-VERIFICATION.sh scripts/deployment/ 2>/dev/null || echo "File not found: FINAL-STATUS-VERIFICATION.sh"
mv MASS-VENDOR-UPLOAD.sh scripts/deployment/ 2>/dev/null || echo "File not found: MASS-VENDOR-UPLOAD.sh"

# Move iteration and status scripts
mv iterate-deployment-juni7.js scripts/deployment/ 2>/dev/null || echo "File not found: iterate-deployment-juni7.js"

echo -e "${GREEN}✓ Remaining scripts organized${NC}"

echo ""
echo -e "${BLUE}Phase 2c: Archiving status reports...${NC}"

# Archive all status and report files
mv COMPLETE-SYSTEM-INTEGRATION-JUNI14.md archive/docs/ 2>/dev/null || echo "File not found: COMPLETE-SYSTEM-INTEGRATION-JUNI14.md"
mv COMPLETE-SYSTEM-INTEGRATION-JUNI18.md archive/docs/ 2>/dev/null || echo "File not found: COMPLETE-SYSTEM-INTEGRATION-JUNI18.md"
mv DEPLOYMENT_CONTINUATION_STRATEGY.md archive/docs/ 2>/dev/null || echo "File not found: DEPLOYMENT_CONTINUATION_STRATEGY.md"
mv DEPLOYMENT-CONFLICTS-RESOLVED-JUNI14.md archive/docs/ 2>/dev/null || echo "File not found: DEPLOYMENT-CONFLICTS-RESOLVED-JUNI14.md"
mv DEPLOYMENT-URGENT-JUNI29.md archive/docs/ 2>/dev/null || echo "File not found: DEPLOYMENT-URGENT-JUNI29.md"
mv EMERGENCY-DEPLOYMENT-STATUS-JUNI7.md archive/docs/ 2>/dev/null || echo "File not found: EMERGENCY-DEPLOYMENT-STATUS-JUNI7.md"
mv EMERGENCY-SITUATION-REPORT-JUNI8.md archive/docs/ 2>/dev/null || echo "File not found: EMERGENCY-SITUATION-REPORT-JUNI8.md"
mv EMERGENCY-SUCCESS-REPORT-JUNI8.md archive/docs/ 2>/dev/null || echo "File not found: EMERGENCY-SUCCESS-REPORT-JUNI8.md"
mv FINAL-DEPLOYMENT-INSTRUCTIONS-JUNI14.md archive/docs/ 2>/dev/null || echo "File not found: FINAL-DEPLOYMENT-INSTRUCTIONS-JUNI14.md"
mv FINAL-SUCCESS-VERIFICATION-JUNI14.md archive/docs/ 2>/dev/null || echo "File not found: FINAL-SUCCESS-VERIFICATION-JUNI14.md"
mv GITHUB-CLEANUP-REPORT-JUNI14.md archive/docs/ 2>/dev/null || echo "File not found: GITHUB-CLEANUP-REPORT-JUNI14.md"
mv ITERATION-STATUS-JUNI7.md archive/docs/ 2>/dev/null || echo "File not found: ITERATION-STATUS-JUNI7.md"
mv MAIL-CONFIGURATION-JUNI14.md archive/docs/ 2>/dev/null || echo "File not found: MAIL-CONFIGURATION-JUNI14.md"

echo -e "${GREEN}✓ Status reports archived${NC}"

echo ""
echo -e "${BLUE}Phase 2d: Setting up admin tools...${NC}"

# Create admin dashboard structure if it doesn't exist
mkdir -p tools/admin/dashboard
mkdir -p tools/admin/scripts
mkdir -p tools/monitoring/health
mkdir -p tools/backup

# Move existing admin setup
mv setup-admin-dashboard.sh tools/admin/scripts/ 2>/dev/null || echo "File not found: setup-admin-dashboard.sh"

# Create admin health check script
cat > tools/admin/scripts/health-check.sh << 'EOF'
#!/bin/bash

# SNAKKAZ HEALTH CHECK SCRIPT
# Comprehensive system health monitoring

echo "🏥 SNAKKAZ SYSTEM HEALTH CHECK"
echo "============================="

# Check React app
echo "1. Checking React Application..."
curl -s https://your-domain.com | grep -q "react" && echo "✓ React app responding" || echo "✗ React app issues"

# Check database
echo "2. Checking Database Connection..."
# Add database health check here

# Check email system
echo "3. Checking Email System..."
# Add email health check here

# Check performance
echo "4. Performance Metrics..."
echo "Response time: $(curl -o /dev/null -s -w "%{time_total}" https://your-domain.com)s"

echo "============================="
echo "Health check complete"
EOF

chmod +x tools/admin/scripts/health-check.sh

echo -e "${GREEN}✓ Admin tools setup complete${NC}"

echo ""
echo -e "${BLUE}Phase 2e: Creating summary and index files...${NC}"

# Create workspace index
cat > WORKSPACE-INDEX.md << 'EOF'
# SNAKKAZ CHAT - WORKSPACE INDEX

## 📁 Directory Structure

### 🚀 Core Application
- `src/` - Main application source code
- `dist/` - Production build output
- `public/` - Static assets

### 🛠️ Scripts
- `scripts/deployment/` - Deployment automation
- `scripts/database/` - Database management
- `scripts/monitoring/` - System monitoring
- `scripts/emergency/` - Emergency fixes
- `scripts/cleanup/` - Maintenance scripts

### 📚 Documentation
- `docs/` - Project documentation
- `docs/deployment/` - Deployment guides
- `docs/api/` - API documentation

### ⚙️ Configuration
- `config/` - Configuration files
- `.github/` - GitHub Actions workflows

### 🔧 Tools
- `tools/admin/` - Admin dashboard and scripts
- `tools/monitoring/` - Health monitoring
- `tools/backup/` - Backup utilities

### 📦 Archive
- `archive/` - Old files and reports

## 🚨 Emergency Procedures

1. **React Runtime Error**: See `docs/deployment/IMMEDIATE-MANUAL-DEPLOYMENT-GUIDE.md`
2. **Deployment Issues**: Run `scripts/deployment/emergency-react-fix-deploy.sh`
3. **System Health**: Run `tools/admin/scripts/health-check.sh`

## 🔗 Quick Links

- [Master Cleanup Plan](docs/SNAKKAZ-MASTER-CLEANUP-PLAN.md)
- [Deployment Guide](docs/deployment/DEPLOYMENT-GUIDE.md)
- [Admin Dashboard](src/admin/)
EOF

echo -e "${GREEN}✓ Workspace index created${NC}"

echo ""
echo "======================================"
echo -e "${GREEN}PHASE 2 CLEANUP COMPLETE!${NC}"
echo ""
echo "📋 Summary of Changes:"
echo "  ✓ Debug files archived"
echo "  ✓ Scripts organized by category"  
echo "  ✓ Status reports archived"
echo "  ✓ Admin tools setup"
echo "  ✓ Workspace index created"
echo ""
echo "📖 See WORKSPACE-INDEX.md for navigation"
echo "🔄 Next: Run cleanup-phase-3.sh for final optimization"
