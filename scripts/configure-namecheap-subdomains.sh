#!/bin/bash
# configure-namecheap-subdomains.sh
#
# This script provides instructions for setting up subdomain configurations in Namecheap

# Define color codes
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Print header
echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}   Namecheap Subdomain Configuration   ${NC}"
echo -e "${BLUE}========================================${NC}"
echo

echo -e "${YELLOW}Based on our analysis, we need to configure the following DNS records in Namecheap:${NC}"
echo

# Print current DNS configuration
echo -e "${BLUE}Current DNS Configuration:${NC}"
echo -e "| ${YELLOW}Type${NC}  | ${YELLOW}Host${NC}      | ${YELLOW}Value${NC}                          | ${YELLOW}TTL${NC}     |"
echo -e "|-------|-----------|--------------------------------|----------|"
echo -e "| A     | @         | 185.158.133.1                  | 5 min    |"
echo -e "| A     | mcp       | 185.158.133.1                  | 5 min    |"
echo -e "| CNAME | www       | snakkaz.com                    | Automatic|"

echo
echo -e "${BLUE}Required Subdomain Configuration:${NC}"
echo
echo -e "To configure all subdomains properly, add the following CNAME records in Namecheap DNS settings:"
echo
echo -e "| ${YELLOW}Type${NC}  | ${YELLOW}Host${NC}      | ${YELLOW}Value${NC}                          | ${YELLOW}TTL${NC}     |"
echo -e "|-------|-----------|--------------------------------|----------|"
echo -e "| CNAME | dash      | snakkaz.com                    | Automatic|"
echo -e "| CNAME | business  | snakkaz.com                    | Automatic|"
echo -e "| CNAME | docs      | snakkaz.com                    | Automatic|"
echo -e "| CNAME | analytics | snakkaz.com                    | Automatic|"
echo -e "| CNAME | help      | snakkaz.com                    | Automatic|"
echo

echo -e "${BLUE}Steps to configure in Namecheap:${NC}"
echo -e "1. Log in to your Namecheap account"
echo -e "2. Go to Domain List and select snakkaz.com"
echo -e "3. Click on 'Manage' and then go to 'Advanced DNS'"
echo -e "4. Add each of the CNAME records listed above"
echo -e "   - For each record, select 'CNAME Record' as Type"
echo -e "   - Enter the subdomain name (without .snakkaz.com) in the Host field"
echo -e "   - Enter 'snakkaz.com' in the Value field"
echo -e "   - Leave TTL as 'Automatic'"
echo -e "5. Click the checkmark to save each record"
echo
echo -e "${YELLOW}Note: DNS changes may take 15 minutes to 48 hours to fully propagate${NC}"
echo
echo -e "${BLUE}After configuring DNS, you need to update your web server configuration:${NC}"
echo -e "1. Create .htaccess rules for each subdomain"
echo -e "2. Set up appropriate SSL certificates"
echo -e "3. Configure virtual hosts if necessary"
echo

echo -e "${BLUE}Configuration Guide Completed${NC}"
