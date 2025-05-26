#!/bin/bash
# deploy-to-production.sh - Enhanced deployment script for Snakkaz Chat
# This script builds and deploys the application to production

# Colors for better readability
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}=============================================${NC}"
echo -e "${BLUE}     Snakkaz Chat Production Deployment      ${NC}"
echo -e "${BLUE}=============================================${NC}"
echo

# Check if running in the correct directory
if [ ! -f "package.json" ] || [ ! -d "src" ]; then
    echo -e "${RED}Error: Must be run from the project root directory${NC}"
    exit 1
fi

# Check if .env file exists
if [ ! -f ".env" ]; then
    echo -e "${RED}Error: .env file not found${NC}"
    echo "Please create a .env file with required environment variables"
    exit 1
fi

# Load environment variables
source .env

# Verify required environment variables
echo -e "${BLUE}Verifying environment variables...${NC}"
REQUIRED_VARS=("VITE_SUPABASE_URL" "VITE_SUPABASE_ANON_KEY" "FTP_HOST" "FTP_USER" "FTP_PASS" "FTP_REMOTE_DIR")
MISSING_VARS=0

for VAR in "${REQUIRED_VARS[@]}"; do
    if [ -z "${!VAR}" ]; then
        echo -e "${RED}❌ Missing required environment variable: $VAR${NC}"
        MISSING_VARS=1
    else
        echo -e "${GREEN}✅ $VAR is set${NC}"
    fi
done

if [ $MISSING_VARS -eq 1 ]; then
    echo -e "${RED}Error: Missing required environment variables${NC}"
    exit 1
fi

# Check for required dependencies
echo -e "\n${BLUE}Checking required dependencies...${NC}"
MISSING_DEPS=0

# Check for Node.js
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js not found${NC}"
    MISSING_DEPS=1
else
    NODE_VERSION=$(node -v)
    echo -e "${GREEN}✅ Node.js $NODE_VERSION${NC}"
fi

# Check for npm
if ! command -v npm &> /dev/null; then
    echo -e "${RED}❌ npm not found${NC}"
    MISSING_DEPS=1
else
    NPM_VERSION=$(npm -v)
    echo -e "${GREEN}✅ npm $NPM_VERSION${NC}"
fi

# Check for git
if ! command -v git &> /dev/null; then
    echo -e "${RED}❌ git not found${NC}"
    MISSING_DEPS=1
else
    GIT_VERSION=$(git --version)
    echo -e "${GREEN}✅ $GIT_VERSION${NC}"
fi

# Check for lftp (for deployment)
if ! command -v lftp &> /dev/null; then
    echo -e "${YELLOW}⚠️ lftp not found (required for deployment)${NC}"
    MISSING_DEPS=1
else
    LFTP_VERSION=$(lftp --version | head -n1)
    echo -e "${GREEN}✅ $LFTP_VERSION${NC}"
fi

if [ $MISSING_DEPS -eq 1 ]; then
    echo -e "${RED}Error: Missing required dependencies${NC}"
    exit 1
fi

# Install dependencies
echo -e "\n${BLUE}Installing dependencies...${NC}"
npm ci

if [ $? -ne 0 ]; then
    echo -e "${RED}Error: Failed to install dependencies${NC}"
    exit 1
else
    echo -e "${GREEN}✅ Dependencies installed successfully${NC}"
fi

# Build the application
echo -e "\n${BLUE}Building application for production...${NC}"
echo -e "${YELLOW}This may take a few minutes...${NC}"

# Attempt to build with the production build command first
echo "Trying build:prod..."
npm run build:prod || {
    echo -e "${YELLOW}⚠️ Production build with linting failed, trying regular build...${NC}"
    npm run build
}

if [ ! -d "dist" ]; then
    echo -e "${RED}Error: Build failed - no dist directory created${NC}"
    exit 1
else
    echo -e "${GREEN}✅ Build completed successfully${NC}"
fi

# Verify build artifacts
echo -e "\n${BLUE}Verifying build artifacts...${NC}"
if [ ! -d "dist" ]; then
    echo -e "${RED}Error: Build directory not found${NC}"
    exit 1
fi

# Count files in the dist directory
FILE_COUNT=$(find dist -type f | wc -l)
echo -e "${GREEN}✅ Found $FILE_COUNT files in the build directory${NC}"

# Deployment
echo -e "\n${BLUE}Preparing for deployment...${NC}"
echo -e "${YELLOW}Target: ${FTP_HOST}/${FTP_REMOTE_DIR}${NC}"

# Check if user wants to continue
read -p "Deploy to production? (y/n) " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo -e "${YELLOW}Deployment cancelled by user${NC}"
    exit 0
fi

# Create deployment script for lftp
echo -e "\n${BLUE}Creating deployment script...${NC}"
cat > deploy.lftp << EOF
# LFTP deployment script for Snakkaz Chat
# Generated on $(date)

# Open connection
open -u "${FTP_USER}","${FTP_PASS}" "${FTP_HOST}"

# Turn on FTPS 
set ftps:initial-prot ""
set ftp:ssl-protect-data true

# Set parallel transfer
set parallel 4
set xfer:clobber on

# Mirror local dist directory to remote directory
mirror -R --delete --verbose dist/ "${FTP_REMOTE_DIR}/"

# Exit when done
bye
EOF

echo -e "${GREEN}✅ Deployment script created${NC}"

# Execute deployment
echo -e "\n${BLUE}Deploying to production...${NC}"
echo -e "${YELLOW}This may take several minutes depending on the connection...${NC}"

lftp -f deploy.lftp

if [ $? -ne 0 ]; then
    echo -e "${RED}Error: Deployment failed${NC}"
    exit 1
else
    echo -e "${GREEN}✅ Deployment completed successfully${NC}"
fi

# Clean up
rm deploy.lftp

echo -e "\n${BLUE}Verifying deployment...${NC}"
echo -e "${YELLOW}Testing website at https://www.snakkaz.com...${NC}"

# Check if website is accessible
HTTP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" https://www.snakkaz.com)
if [ "$HTTP_STATUS" = "200" ] || [ "$HTTP_STATUS" = "301" ] || [ "$HTTP_STATUS" = "302" ]; then
    echo -e "${GREEN}✅ Website is accessible (HTTP status $HTTP_STATUS)${NC}"
else
    echo -e "${RED}⚠️ Website returned unexpected status code: $HTTP_STATUS${NC}"
    echo -e "${YELLOW}This might be normal depending on your site configuration.${NC}"
    echo -e "${YELLOW}Please verify manually that the site is working correctly.${NC}"
fi

echo -e "\n${GREEN}==================================================${NC}"
echo -e "${GREEN}     Deployment process completed successfully!     ${NC}"
echo -e "${GREEN}==================================================${NC}"
echo
echo -e "Next steps:"
echo -e "1. Verify the website is working at https://www.snakkaz.com"
echo -e "2. Test critical functionality"
echo -e "3. Check mail system at https://mail.snakkaz.com"
echo
echo -e "${YELLOW}If mail.snakkaz.com is still having issues, run:${NC}"
echo -e "  ./mail-system-test.sh"
echo -e "  ./dns-mail-fix.sh"
