#!/bin/bash

echo "🧹 Cleaning up emergency scripts and redundant files..."

# List of emergency/debug files to remove
FILES_TO_REMOVE=(
  "alternative-ftp.sh"
  "BRUKEROPPLEVELSE-COMMUNITY-PLAN-JUNI7-2025.md"
  "cache-busting-deploy.lftp"
  "check-current-policies.mjs"
  "check-database.mjs"
  "check-deployment-juni7.sh"
  "check-policies.mjs"
  "check-server-structure.lftp"
  "clean-restart-juni7.sh"
  "cleanup-github-workflows.sh"
  "cleanup-project-structure.sh"
  "complete-fix-deploy.lftp"
  "comprehensive-app-debugger.sh"
  "continue-iteration-juni7.sh"
  "CORRECTED-EMERGENCY-FIX.sh"
  "create-and-upload.lftp"
  "create-python-mcp-server.sh"
  "debug-emoji-search.js"
  "debug-emoji-search.mjs"
  "debug-emoji-test.js"
  "debug-policies.sql"
  "debug-server.sh"
  "debug-simple.js"
  "deploy-litespeed-fix.lftp"
  "deploy-memory.lftp"
  "deploy-with-correct-ftp.sh"
  "deploy.sh"
  "DEPLOYMENT_CONTINUATION_STRATEGY.md"
  "DEPLOYMENT-CONFLICTS-RESOLVED-JUNI14.md"
  "DIRECT-FTP-EMERGENCY-DEPLOY.sh"
  "drastisk-cleanup.sh"
  "EMERGENCY_BYPASS_STATUS.md"
  "emergency-bypass-deploy.sh"
  "EMERGENCY-DEPLOY-CORRECTED-FTP.sh"
  "emergency-deploy-juni7.sh"
  "EMERGENCY-DEPLOYMENT-STATUS-JUNI7.md"
  "emergency-fix-final-verification.sh"
  "emergency-fix-page.html"
  "emergency-fix-recursion.sql"
  "emergency-ftp-correct.lftp"
  "emergency-ftp-upload.lftp"
  "EMERGENCY-HOTFIX.js"
  "emergency-htaccess-fix.lftp"
  "emergency-htaccess-fix.sh"
  "emergency-js-files-deploy.sh"
  "emergency-k-undefined-fix-deploy.lftp"
  "emergency-mime-fix.lftp"
  "emergency-mime-type-fix.sh"
  "emergency-react-bundle-deploy.lftp"
  "emergency-react-fix-deploy.sh"
  "emergency-react-fix-deploy.lftp"
  "emergency-react-state-fix-deploy.lftp"
  "emergency-react-undefined-fix-deploy.lftp"
  "emergency-repair-snakkaz.sh"
  "emergency-repair-status.sh"
  "emergency-restore-deploy.sh"
  "emergency-restore-juni7.lftp"
  "EMERGENCY-SITUATION-REPORT-JUNI8.md"
  "emergency-status-check.sh"
  "EMERGENCY-SUCCESS-REPORT-JUNI8.md"
  "emergency-unified-deployment.sh"
  "ENDELIG-PROBLEMLØSNING-RAPPORT.sh"
  "enhanced-health-monitor.sh"
  "final-cleanup-and-status.sh"
  "FINAL-COMPLETE-DEPLOYMENT.lftp"
  "final-react-error-verification.sh"
)

echo "Files to remove:"
for file in "${FILES_TO_REMOVE[@]}"; do
  if [ -f "$file" ]; then
    echo "  ✓ $file"
    git rm "$file" 2>/dev/null || rm "$file"
  fi
done

# Keep only essential files
KEEP_FILES=(
  "REACT-ERROR-RESOLUTION-FINAL-REPORT.md"
  "COMPLETE-SYSTEM-INTEGRATION-JUNI14.md"
  "USEMERGEREF-FIX-COMPLETION-REPORT.md"
)

echo -e "\nKeeping essential documentation:"
for file in "${KEEP_FILES[@]}"; do
  if [ -f "$file" ]; then
    echo "  📄 $file"
  fi
done

echo -e "\n✅ Cleanup complete. Repository is now cleaner and more maintainable."
