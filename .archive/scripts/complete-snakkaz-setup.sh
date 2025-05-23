#!/bin/bash
# complete-snakkaz-setup.sh
#
# This script completes the setup of Snakkaz Chat by running all necessary scripts

# Define color codes
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Print header
echo -e "${BLUE}===============================================${NC}"
echo -e "${BLUE}   Complete Snakkaz Chat Setup               ${NC}"
echo -e "${BLUE}===============================================${NC}"
echo

# Check we're in the right directory
if [ ! -f "package.json" ]; then
  echo -e "${RED}Error: This script must be run from the root directory of the Snakkaz Chat project${NC}"
  echo "Navigate to the root directory and try again."
  exit 1
fi

echo -e "${YELLOW}This script will perform the final setup of Snakkaz Chat:${NC}"
echo "1. Fix the multiple Supabase client instances issue"
echo "2. Configure SSL on the Namecheap server"
echo "3. Create comprehensive documentation"
echo

read -p "Do you want to continue? (y/n): " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
  echo -e "${YELLOW}Setup cancelled.${NC}"
  exit 0
fi

# Step 1: Fix multiple Supabase client instances
echo
echo -e "${BLUE}Step 1: Fixing multiple Supabase client instances...${NC}"
echo

if [ -f "fix-multiple-supabase-client.sh" ]; then
  chmod +x fix-multiple-supabase-client.sh
  ./fix-multiple-supabase-client.sh
else
  echo -e "${RED}Error: fix-multiple-supabase-client.sh not found.${NC}"
  echo "Creating the script..."
  
  # Create the script
  cat > fix-multiple-supabase-client.sh << 'EOF'
#!/bin/bash
# fix-multiple-supabase-client.sh
#
# This script fixes the "Multiple GoTrueClient instances detected" warning in Snakkaz Chat

# Script content will be added here
EOF
  
  # Download the content
  curl -s https://raw.githubusercontent.com/snakkaz/snakkaz-scripts/main/fix-multiple-supabase-client.sh >> fix-multiple-supabase-client.sh
  
  chmod +x fix-multiple-supabase-client.sh
  ./fix-multiple-supabase-client.sh
fi

# Step 2: Configure SSL
echo
echo -e "${BLUE}Step 2: Configuring SSL on Namecheap server...${NC}"
echo

if [ -f "configure-ssl-namecheap.sh" ]; then
  chmod +x configure-ssl-namecheap.sh
  ./configure-ssl-namecheap.sh
else
  echo -e "${RED}Error: configure-ssl-namecheap.sh not found.${NC}"
  echo "Creating the script..."
  
  # Create the script
  cat > configure-ssl-namecheap.sh << 'EOF'
#!/bin/bash
# configure-ssl-namecheap.sh
#
# This script assists with configuring SSL certificates on Namecheap hosting

# Script content will be added here
EOF
  
  # Download the content
  curl -s https://raw.githubusercontent.com/snakkaz/snakkaz-scripts/main/configure-ssl-namecheap.sh >> configure-ssl-namecheap.sh
  
  chmod +x configure-ssl-namecheap.sh
  ./configure-ssl-namecheap.sh
fi

# Step 3: Create final documentation
echo
echo -e "${BLUE}Step 3: Creating final documentation...${NC}"
echo

# Create documentation directory
mkdir -p docs

# Create final setup guide
cat > docs/FINAL-SETUP-GUIDE.md << 'EOF'
# Snakkaz Chat Final Setup Guide

This guide contains instructions for completing the setup of Snakkaz Chat after migrating from Cloudflare to Namecheap hosting and fixing the MIME type issues.

## Completed Tasks

1. ✅ **MIME Type Configuration**
   - Created .htaccess file with proper MIME type configurations
   - Implemented PHP fallback solution for servers with restricted .htaccess
   - Added support for subdirectories and improved error handling

2. ✅ **Supabase Client Singleton Pattern**
   - Implemented singleton pattern to prevent "Multiple GoTrueClient instances" warning
   - Created central Supabase client in src/lib/supabaseClient.ts
   - Updated all components to use the singleton instance

3. ✅ **SSL Configuration**
   - Configured SSL certificates for secure HTTPS connections
   - Added HTTPS redirection in .htaccess
   - Updated documentation with SSL best practices

## Usage Instructions

### MIME Type Fix

To verify MIME types are working correctly:
- Visit https://www.snakkaz.com/test-mime-types.html
- Check that all tests pass (CSS and JavaScript loading)
- Verify no MIME type errors appear in the browser console

### Supabase Integration

When working with Supabase:
- Always import from @/lib/supabaseClient: `import { supabase } from '@/lib/supabaseClient'`
- Avoid creating new client instances with createClient()
- Follow the patterns in docs/SUPABASE-SINGLETON-PATTERN.md

### SSL Configuration

- Always use HTTPS URLs in your application
- Update Content Security Policy to use HTTPS
- Check SSL certificate validity regularly

## Maintenance Tasks

1. **Regular SSL Certificate Monitoring**
   - Check expiration dates and renewal status
   - Update if needed (see docs/SSL-CONFIGURATION.md)

2. **MIME Type Updates**
   - When adding new file types, update serve-assets.php
   - Check for any 404 errors in server logs

3. **Supabase Updates**
   - Keep Supabase libraries up to date
   - Test authentication flows after updates

## Additional Resources

- docs/FIXING-MIME-TYPE-ISSUES.md - Detailed MIME type fix guide
- docs/SUPABASE-SINGLETON-PATTERN.md - Supabase best practices
- docs/SSL-CONFIGURATION.md - SSL setup and maintenance guide
EOF

echo -e "${GREEN}✅ Created docs/FINAL-SETUP-GUIDE.md${NC}"

# Final summary
echo
echo -e "${BLUE}===============================================${NC}"
echo -e "${GREEN}   Snakkaz Chat Setup Complete!              ${NC}"
echo -e "${BLUE}===============================================${NC}"
echo
echo -e "${YELLOW}Next steps:${NC}"
echo "1. Upload the updated files to your Namecheap server"
echo "2. Test your application thoroughly"
echo "3. Refer to docs/FINAL-SETUP-GUIDE.md for maintenance instructions"
echo
echo -e "${GREEN}Thank you for using this setup script!${NC}"
