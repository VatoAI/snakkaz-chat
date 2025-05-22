#!/bin/bash
# Script to apply Supabase performance fixes
# Created: May 22, 2025

# Define colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}=========================================================${NC}"
echo -e "${BLUE}    SUPABASE DATABASE PERFORMANCE OPTIMIZATION SCRIPT    ${NC}"
echo -e "${BLUE}=========================================================${NC}"
echo

# Check if Supabase CLI is installed
if ! command -v supabase &> /dev/null; then
    echo -e "${YELLOW}Supabase CLI not found. Please install it first:${NC}"
    echo "npm install -g supabase"
    echo -e "${YELLOW}Or follow the installation guide at:${NC}"
    echo "https://supabase.com/docs/guides/cli/getting-started"
    echo
    echo -e "${YELLOW}You can still apply the fixes manually using the SQL file.${NC}"
    exit 1
fi

echo -e "${YELLOW}This script will apply database performance fixes to your Supabase project:${NC}"
echo "1. Add indexes to foreign keys that are currently unindexed"
echo "2. Optimize the check_and_add_columns function"
echo "3. Add helper functions for index analysis and maintenance"
echo
echo -e "${RED}Important:${NC} This script will make schema changes to your database."
echo "Make sure you have a backup before proceeding."
echo
read -p "Do you want to continue? (y/n): " CONTINUE

if [[ ! "$CONTINUE" =~ ^[Yy]$ ]]; then
    echo -e "${YELLOW}Operation cancelled.${NC}"
    exit 0
fi

# Try to run the SQL script through Supabase CLI
echo -e "${GREEN}Applying database performance fixes...${NC}"

# Check if we're in a Supabase project
if [ -f "supabase/config.toml" ]; then
    echo "Running fixes through Supabase CLI..."
    supabase db execute --file scripts/fix-supabase-performance.sql
    STATUS=$?

    if [ $STATUS -eq 0 ]; then
        echo -e "${GREEN}SQL script executed successfully through Supabase CLI.${NC}"
    else
        echo -e "${RED}Failed to execute SQL script through Supabase CLI.${NC}"
        echo -e "${YELLOW}You may need to apply the fixes manually.${NC}"
    fi
else
    echo -e "${YELLOW}Not in a Supabase project directory with supabase/config.toml.${NC}"
    echo -e "${YELLOW}Alternative options to apply the fixes:${NC}"
    echo
    echo "Option 1: Run directly against your database:"
    echo "  psql \$DATABASE_URL -f scripts/fix-supabase-performance.sql"
    echo
    echo "Option 2: Using Supabase dashboard:"
    echo "  1. Go to https://app.supabase.com"
    echo "  2. Select your project"
    echo "  3. Go to SQL Editor"
    echo "  4. Copy and paste the contents of scripts/fix-supabase-performance.sql"
    echo "  5. Run the SQL"
fi

echo
echo -e "${BLUE}=========================================================${NC}"
echo -e "${GREEN}Performance optimizations summary:${NC}"
echo -e "${BLUE}=========================================================${NC}"
echo
echo -e "1. ${YELLOW}Added indexes for 7 foreign keys:${NC}"
echo "   - friendships.friend_id"
echo "   - group_encryption.group_id"
echo "   - group_invites.invited_by"
echo "   - group_invites.invited_user_id"
echo "   - group_members.group_id"
echo "   - groups.creator_id"
echo "   - messages.sender_id"
echo
echo -e "2. ${YELLOW}Optimized check_and_add_columns function:${NC}"
echo "   - Added search_path parameter for security"
echo "   - Improved performance by reducing redundant checks"
echo "   - Added better error handling"
echo
echo -e "3. ${YELLOW}Added helper functions:${NC}"
echo "   - analyze_index_usage: To find unused indexes"
echo "   - perform_index_maintenance: For regular maintenance"
echo
echo -e "4. ${YELLOW}Unused indexes:${NC}"
echo "   - The SQL script includes commented-out DROP statements for 5 unused indexes"
echo "   - Review these and uncomment them if you confirm they are not needed"
echo "     (Check scripts/fix-supabase-performance.sql for details)"
echo
echo -e "${BLUE}=========================================================${NC}"
echo -e "${BLUE}                      NEXT STEPS                         ${NC}"
echo -e "${BLUE}=========================================================${NC}"
echo
echo -e "${YELLOW}1. Run the analyze_index_usage function to monitor index usage:${NC}"
echo "   SELECT * FROM public.analyze_index_usage(30);"
echo
echo -e "${YELLOW}2. Schedule weekly index maintenance (requires pg_cron extension):${NC}"
echo "   SELECT cron.schedule('weekly', 'SELECT public.perform_index_maintenance();');"
echo
echo -e "${YELLOW}3. Run the Supabase Database Linter again to verify fixes:${NC}"
echo "   https://supabase.com/dashboard/project/_/database/database-linter"
echo
echo -e "${GREEN}Script execution completed.${NC}"
