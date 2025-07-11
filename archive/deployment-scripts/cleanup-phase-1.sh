#!/bin/bash

# WORKSPACE CLEANUP SCRIPT - Phase 1
# Implements the reorganization plan from SNAKKAZ-MASTER-CLEANUP-PLAN.md

echo "🧹 STARTING WORKSPACE CLEANUP - PHASE 1"
echo "======================================"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Create new directory structure
echo -e "${BLUE}Creating new directory structure...${NC}"

# Archive directory for old files
mkdir -p archive/{scripts,docs,configs,old-deployments}

# Scripts directory with categories
mkdir -p scripts/{deployment,database,monitoring,emergency,cleanup}

# Documentation
mkdir -p docs/{deployment,api,user-guides,troubleshooting}

# Configuration
mkdir -p config/{environment,database,ci-cd}

# Tools
mkdir -p tools/{admin,monitoring,backup}

echo -e "${GREEN}✓ Directory structure created${NC}"

echo ""
echo -e "${BLUE}Phase 1a: Moving deployment scripts...${NC}"

# Move deployment-related scripts
mv DIRECT-FTP-EMERGENCY-DEPLOY.sh scripts/deployment/ 2>/dev/null || echo "File not found: DIRECT-FTP-EMERGENCY-DEPLOY.sh"
mv EMERGENCY-DEPLOY-CORRECTED-FTP.sh scripts/deployment/ 2>/dev/null || echo "File not found: EMERGENCY-DEPLOY-CORRECTED-FTP.sh"
mv EMERGENCY-FTP-DEPLOY-NOW.sh scripts/deployment/ 2>/dev/null || echo "File not found: EMERGENCY-FTP-DEPLOY-NOW.sh"
mv FINAL-EMERGENCY-DEPLOY.sh scripts/deployment/ 2>/dev/null || echo "File not found: FINAL-EMERGENCY-DEPLOY.sh"
mv IMMEDIATE-BUNDLE-DEPLOY.sh scripts/deployment/ 2>/dev/null || echo "File not found: IMMEDIATE-BUNDLE-DEPLOY.sh"
mv emergency-react-fix-deploy.sh scripts/deployment/ 2>/dev/null || echo "File not found: emergency-react-fix-deploy.sh"
mv quick-index-fix.sh scripts/deployment/ 2>/dev/null || echo "File not found: quick-index-fix.sh"
mv setup-github-actions.sh scripts/deployment/ 2>/dev/null || echo "File not found: setup-github-actions.sh"

echo -e "${GREEN}✓ Deployment scripts moved${NC}"

echo ""
echo -e "${BLUE}Phase 1b: Moving emergency scripts...${NC}"

mv EMERGENCY-HOTFIX.js scripts/emergency/ 2>/dev/null || echo "File not found: EMERGENCY-HOTFIX.js"
mv emergency-hotfix.sh scripts/emergency/ 2>/dev/null || echo "File not found: emergency-hotfix.sh"
mv IMMEDIATE_FIX.js scripts/emergency/ 2>/dev/null || echo "File not found: IMMEDIATE_FIX.js"
mv CORRECTED-EMERGENCY-FIX.sh scripts/emergency/ 2>/dev/null || echo "File not found: CORRECTED-EMERGENCY-FIX.sh"

echo -e "${GREEN}✓ Emergency scripts moved${NC}"

echo ""
echo -e "${BLUE}Phase 1c: Moving database scripts...${NC}"

mv database-performance-optimization.sql scripts/database/ 2>/dev/null || echo "File not found: database-performance-optimization.sql"
mv apply-remaining-optimizations.sql scripts/database/ 2>/dev/null || echo "File not found: apply-remaining-optimizations.sql"
mv debug-policies.sql scripts/database/ 2>/dev/null || echo "File not found: debug-policies.sql"
mv emergency-fix-recursion.sql scripts/database/ 2>/dev/null || echo "File not found: emergency-fix-recursion.sql"
mv fix-infinite-recursion.sql scripts/database/ 2>/dev/null || echo "File not found: fix-infinite-recursion.sql"
mv fix-rls-recursion.sql scripts/database/ 2>/dev/null || echo "File not found: fix-rls-recursion.sql"

echo -e "${GREEN}✓ Database scripts moved${NC}"

echo ""
echo -e "${BLUE}Phase 1d: Moving monitoring scripts...${NC}"

mv analyze-database.mjs scripts/monitoring/ 2>/dev/null || echo "File not found: analyze-database.mjs"
mv check-current-policies.mjs scripts/monitoring/ 2>/dev/null || echo "File not found: check-current-policies.mjs"
mv check-database.mjs scripts/monitoring/ 2>/dev/null || echo "File not found: check-database.mjs"
mv check-policies.mjs scripts/monitoring/ 2>/dev/null || echo "File not found: check-policies.mjs"
mv final-performance-test.mjs scripts/monitoring/ 2>/dev/null || echo "File not found: final-performance-test.mjs"
mv final-status-check.mjs scripts/monitoring/ 2>/dev/null || echo "File not found: final-status-check.mjs"
mv investigate-and-fix.mjs scripts/monitoring/ 2>/dev/null || echo "File not found: investigate-and-fix.mjs"
mv measure-performance.mjs scripts/monitoring/ 2>/dev/null || echo "File not found: measure-performance.mjs"

echo -e "${GREEN}✓ Monitoring scripts moved${NC}"

echo ""
echo -e "${BLUE}Phase 1e: Moving cleanup scripts...${NC}"

mv clean-restart-juni7.sh scripts/cleanup/ 2>/dev/null || echo "File not found: clean-restart-juni7.sh"
mv continue-iteration-juni7.sh scripts/cleanup/ 2>/dev/null || echo "File not found: continue-iteration-juni7.sh"
mv KOMPLETT-ALT-PÅ-EN-GANG-FIX.sh scripts/cleanup/ 2>/dev/null || echo "File not found: KOMPLETT-ALT-PÅ-EN-GANG-FIX.sh"

echo -e "${GREEN}✓ Cleanup scripts moved${NC}"

echo ""
echo -e "${BLUE}Phase 1f: Moving documentation...${NC}"

mv BRUKEROPPLEVELSE-COMMUNITY-PLAN-JUNI7-2025.md docs/ 2>/dev/null || echo "File not found: BRUKEROPPLEVELSE-COMMUNITY-PLAN-JUNI7-2025.md"
mv DEPLOYMENT-GUIDE.md docs/deployment/ 2>/dev/null || echo "File not found: DEPLOYMENT-GUIDE.md"
mv SNAKKAZ-MASTER-CLEANUP-PLAN.md docs/ 2>/dev/null || echo "File not found: SNAKKAZ-MASTER-CLEANUP-PLAN.md"
mv IMMEDIATE-MANUAL-DEPLOYMENT-GUIDE.md docs/deployment/ 2>/dev/null || echo "File not found: IMMEDIATE-MANUAL-DEPLOYMENT-GUIDE.md"

# Move status reports to archive
mv CLEANUP-REPORT-20250702-1805.md archive/docs/ 2>/dev/null || echo "File not found: CLEANUP-REPORT-20250702-1805.md"
mv DEPLOYMENT-STATUS.md archive/docs/ 2>/dev/null || echo "File not found: DEPLOYMENT-STATUS.md"
mv EMERGENCY_BYPASS_STATUS.md archive/docs/ 2>/dev/null || echo "File not found: EMERGENCY_BYPASS_STATUS.md"

echo -e "${GREEN}✓ Documentation organized${NC}"

echo ""
echo -e "${BLUE}Phase 1g: Moving configuration files...${NC}"

mv babel.config.json config/ 2>/dev/null || echo "File not found: babel.config.json"
mv components.json config/ 2>/dev/null || echo "File not found: components.json"
mv eslint.config.js config/ 2>/dev/null || echo "File not found: eslint.config.js"
mv jest.config.mjs config/ 2>/dev/null || echo "File not found: jest.config.mjs"

echo -e "${GREEN}✓ Configuration files moved${NC}"

echo ""
echo "======================================"
echo -e "${GREEN}PHASE 1 CLEANUP COMPLETE!${NC}"
echo ""
echo "📁 New Structure Created:"
echo "  📂 scripts/     - Organized by category"
echo "  📂 docs/        - Documentation"
echo "  📂 config/      - Configuration files"
echo "  📂 tools/       - Admin and monitoring tools"
echo "  📂 archive/     - Old files preserved"
echo ""
echo "🔄 Next: Run cleanup-phase-2.sh to continue"
