#!/bin/bash
# Script to apply Supabase database optimizations

# Colors for terminal output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}   Supabase Database Optimization      ${NC}"
echo -e "${BLUE}========================================${NC}"
echo

# Set your Supabase project URL and service role key
# These should be stored as environment variables
if [ -z "$SUPABASE_URL" ] || [ -z "$SUPABASE_SERVICE_ROLE_KEY" ]; then
  echo -e "${YELLOW}Warning: SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY environment variables not set.${NC}"
  echo -e "${YELLOW}You will be prompted for these values.${NC}"
  echo
  
  read -p "Enter your Supabase project URL: " SUPABASE_URL
  read -sp "Enter your Supabase service role key: " SUPABASE_SERVICE_ROLE_KEY
  echo
fi

# Prepare the header for PSQL commands
PSQL_HEADER="PGPASSWORD=$SUPABASE_SERVICE_ROLE_KEY psql -h $(echo $SUPABASE_URL | sed 's|^https\?://||' | sed 's|/.*$||') -U postgres -d postgres -f"

echo -e "${GREEN}Applying function search path fixes...${NC}"
$PSQL_HEADER ./scripts/fix-function-search-path.sql
echo

echo -e "${GREEN}Applying RLS initialization plan optimizations...${NC}"
$PSQL_HEADER ./scripts/fix-rls-initplan.sql
echo

echo -e "${GREEN}Consolidating multiple permissive policies...${NC}"
$PSQL_HEADER ./scripts/fix-multiple-permissive-policies.sql
echo

echo -e "${GREEN}Adding indexes for foreign keys...${NC}"
$PSQL_HEADER ./scripts/fix-unindexed-foreign-keys.sql
echo

echo -e "${YELLOW}Note: To enable leaked password protection, you must use${NC}"
echo -e "${YELLOW}the Supabase dashboard or CLI as described in:${NC}"
echo -e "${YELLOW}./scripts/enable-leaked-password-protection.sql${NC}"
echo

echo -e "${GREEN}Database optimizations complete!${NC}"
echo -e "${GREEN}Run the Supabase linter again to verify fixes.${NC}"
