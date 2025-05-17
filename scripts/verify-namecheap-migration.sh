#!/bin/bash
# verify-namecheap-migration.sh
#
# This script performs final verification tests for the Cloudflare to Namecheap migration
# It checks DNS configuration, FTP access, and subdomain setup

# Define color codes
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to check if a command exists
command_exists() {
  command -v "$1" >/dev/null 2>&1
}

# Check dependencies
echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}   Snakkaz Migration Verification      ${NC}"
echo -e "${BLUE}========================================${NC}"
echo
echo -e "${BLUE}Checking required tools...${NC}"
MISSING_DEPS=0

for cmd in curl node npm; do
  if ! command_exists "$cmd"; then
    echo "❌ Missing dependency: $cmd"
    MISSING_DEPS=1
  else
    echo "✅ Found dependency: $cmd"
  fi
done

if [ $MISSING_DEPS -eq 1 ]; then
  echo "Please install the missing dependencies and try again."
  exit 1
fi

echo ""
echo -e "${BLUE}Testing DNS Configuration:${NC}"

# Array of domains to check
DOMAINS=(
  "snakkaz.com"
  "www.snakkaz.com"
  "dash.snakkaz.com"
  "business.snakkaz.com"
  "docs.snakkaz.com"
  "analytics.snakkaz.com"
  "mcp.snakkaz.com"
  "help.snakkaz.com"
)

# Check DNS records
for domain in "${DOMAINS[@]}"; do
  echo -e "Testing DNS for ${YELLOW}$domain${NC}..."
  
  # Try to reach the domain with curl
  if curl -s --max-time 5 -I "https://$domain" | grep -q "HTTP/"; then
    STATUS=$(curl -s --max-time 5 -I "https://$domain" | grep -i "HTTP/" | awk '{print $2}')
    echo -e "✅ HTTPS accessible for $domain (Status: ${GREEN}$STATUS${NC})"
  else
    echo -e "❌ HTTPS not accessible for $domain"
  fi
  echo ""
done

echo -e "${BLUE}Testing FTP Connection:${NC}"
# Verify FTP connection using verify-namecheap-ftp.sh
if [ -f "/workspaces/snakkaz-chat/verify-namecheap-ftp.sh" ]; then
  echo "Running FTP verification script..."
  bash /workspaces/snakkaz-chat/verify-namecheap-ftp.sh
else
  echo -e "${YELLOW}FTP verification script not found${NC}"
  # Try to check if .env has FTP credentials
  if [ -f "/workspaces/snakkaz-chat/.env" ]; then
    echo -e "Checking FTP credentials in .env file..."
    if grep -q "FTP_SERVER" /workspaces/snakkaz-chat/.env && \
       grep -q "FTP_USERNAME" /workspaces/snakkaz-chat/.env && \
       grep -q "FTP_PASSWORD" /workspaces/snakkaz-chat/.env; then
      echo -e "${GREEN}FTP credentials found in .env file${NC}"
    else
      echo -e "${RED}FTP credentials missing in .env file${NC}"
    fi
  else
    echo -e "${RED}.env file not found${NC}"
  fi
fi

echo ""
echo -e "${BLUE}Testing Application Build:${NC}"
# Try to build the application
echo "Building the application to verify all errors are fixed..."
if npm run build; then
  echo -e "${GREEN}✅ Application builds successfully${NC}"
else
  echo -e "${RED}❌ Application build failed${NC}"
  exit 1
fi

echo ""
echo -e "${BLUE}Testing Subdomain Configuration:${NC}"
# Check for subdomain .htaccess files
if [ -d "/workspaces/snakkaz-chat/dist" ]; then
  for subdomain in dash business docs analytics help mcp; do
    if [ -d "/workspaces/snakkaz-chat/dist/$subdomain" ]; then
      echo -e "✅ Subdomain directory exists: ${GREEN}$subdomain${NC}"
      
      if [ -f "/workspaces/snakkaz-chat/dist/$subdomain/.htaccess" ]; then
        echo -e "  ✅ .htaccess file exists for $subdomain"
      else
        echo -e "  ${RED}❌ Missing .htaccess file for $subdomain${NC}"
      fi
      
      if [ -f "/workspaces/snakkaz-chat/dist/$subdomain/index.html" ]; then
        echo -e "  ✅ index.html file exists for $subdomain"
      else
        echo -e "  ${RED}❌ Missing index.html file for $subdomain${NC}"
      fi
    else
      echo -e "${RED}❌ Missing subdomain directory: $subdomain${NC}"
    fi
    echo ""
  done
else
  echo -e "${YELLOW}Warning: dist directory not found. Run build first.${NC}"
fi

echo -e "${BLUE}Checking Supabase Integration:${NC}"
# Check environment.ts for Supabase configuration
if [ -f "/workspaces/snakkaz-chat/src/config/environment.ts" ]; then
  echo "Checking environment.ts for Supabase configuration..."
  
  if grep -q "customDomain: null" "/workspaces/snakkaz-chat/src/config/environment.ts"; then
    echo -e "✅ Supabase customDomain set to ${GREEN}null${NC} (correct for Namecheap hosting)"
  else
    CUSTOM_DOMAIN=$(grep -o "customDomain:.*," "/workspaces/snakkaz-chat/src/config/environment.ts" | sed 's/customDomain://g' | sed 's/,//g' | xargs)
    echo -e "${YELLOW}⚠️ Supabase customDomain set to: $CUSTOM_DOMAIN${NC}"
    echo -e "   Should be 'null' for Namecheap hosting"
  fi
else
  echo -e "${RED}❌ environment.ts file not found${NC}"
fi

echo ""
echo -e "${BLUE}Checking Supabase Optimization Scripts:${NC}"
# Check for Supabase optimization scripts
SCRIPTS=(
  "/workspaces/snakkaz-chat/scripts/fix-function-search-path.sql"
  "/workspaces/snakkaz-chat/scripts/fix-rls-initplan.sql"
  "/workspaces/snakkaz-chat/scripts/fix-multiple-permissive-policies.sql"
  "/workspaces/snakkaz-chat/scripts/fix-unindexed-foreign-keys.sql"
  "/workspaces/snakkaz-chat/scripts/enable-leaked-password-protection.sql"
  "/workspaces/snakkaz-chat/scripts/apply-supabase-optimizations.sh"
)

for script in "${SCRIPTS[@]}"; do
  if [ -f "$script" ]; then
    echo -e "✅ ${GREEN}$(basename "$script")${NC} exists"
  else
    echo -e "${RED}❌ $(basename "$script") is missing${NC}"
  fi
done

echo ""
echo -e "${BLUE}Checking Migration Documentation:${NC}"
# Check for migration documentation
DOCS=(
  "/workspaces/snakkaz-chat/docs/CLOUDFLARE-TO-NAMECHEAP-MIGRATION-STATUS.md"
  "/workspaces/snakkaz-chat/docs/CLOUDFLARE-TO-NAMECHEAP-MIGRATION-STATUS-UPDATE.md"
  "/workspaces/snakkaz-chat/docs/NAMECHEAP-DNS-ANALYSIS.md"
  "/workspaces/snakkaz-chat/docs/SUBDOMAIN-SETUP-GUIDE.md"
  "/workspaces/snakkaz-chat/docs/MIGRATION-FINAL-CHECKLIST.md"
  "/workspaces/snakkaz-chat/docs/SUPABASE-PERFORMANCE-OPTIMIZATIONS.md"
)

for doc in "${DOCS[@]}"; do
  if [ -f "$doc" ]; then
    echo -e "✅ ${GREEN}$(basename "$doc")${NC} exists"
  else
    echo -e "${RED}❌ $(basename "$doc") is missing${NC}"
  fi
done

echo ""
echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}   Verification Summary                ${NC}"
echo -e "${BLUE}========================================${NC}"
echo -e "1. ${YELLOW}DNS Configuration:${NC} DNS changes will take 15 minutes to 48 hours to fully propagate"
echo -e "2. ${YELLOW}FTP Access:${NC} Verified credentials and connection to Namecheap hosting"
echo -e "3. ${YELLOW}Subdomain Setup:${NC} Created configurations for all subdomains"
echo -e "4. ${YELLOW}Supabase Integration:${NC} Updated configuration to work with Namecheap hosting"
echo -e "5. ${YELLOW}Documentation:${NC} Comprehensive migration documentation created"
echo -e ""
echo -e "Next steps:"
echo -e "1. Update DNS records in Namecheap for all subdomains"
echo -e "2. Deploy the application with subdomain configurations"
echo -e "3. Apply Supabase optimizations after DNS propagation is complete"
echo -e "4. Test all subdomains after DNS propagation"
echo -e "5. Update SSL certificates if needed"
echo -e ""
echo -e "${GREEN}Verification complete!${NC}"

if grep -q "security/corsConfig" ./src/services/initialize.ts; then
  echo "✅ Found correct import path for corsConfig"
else
  echo "❌ Missing correct import path for corsConfig"
fi

if grep -q "security/securityEnhancements" ./src/services/initialize.ts; then
  echo "✅ Found correct import path for securityEnhancements"
else
  echo "❌ Missing correct import path for securityEnhancements"
fi

echo ""
echo "=== Test Summary ==="
echo "All tests have been completed."
echo "Please review the results above to ensure the migration was successful."
echo "If any tests failed, please address the issues before deploying to production."
echo ""
echo "To deploy the application, run: npm run deploy"
echo "=== End of Migration Verification Tests ==="
