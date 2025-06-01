#!/bin/bash
# filepath: /workspaces/snakkaz-chat/apply-emoji-analytics-migration.sh

# Script to apply the emoji analytics migration
# Created: May 25, 2025

echo "🔍 Applying Emoji Analytics Migration..."

# Define color codes
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Check if Supabase CLI is installed
if ! command -v supabase &> /dev/null; then
    echo -e "${RED}❌ Supabase CLI is not installed. Please install it first.${NC}"
    echo "   Run: npm install -g supabase"
    exit 1
fi

# Check if we have a local or remote Supabase setup
if [ -d ".supabase" ]; then
    echo -e "${BLUE}Local Supabase configuration detected.${NC}"
    TARGET="local"
else
    echo -e "${YELLOW}No local Supabase configuration found. Using remote.${NC}"
    TARGET="remote"
    
    # Verify that we have a Supabase reference
    if ! supabase projects list &> /dev/null; then
        echo -e "${RED}❌ Not logged in to Supabase or no project linked.${NC}"
        echo "   Run: supabase login"
        echo "   Then: supabase link --project-ref your-project-ref"
        exit 1
    fi
fi

# Apply the migration
echo -e "\n${BLUE}Applying emoji_analytics_table.sql migration...${NC}"

if [ "$TARGET" = "local" ]; then
    # Apply to local Supabase
    supabase db reset
else
    # Apply to remote Supabase
    cat src/migrations/emoji_analytics_table.sql | supabase db remote sql
fi

# Check exit status
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Migration applied successfully!${NC}"
else
    echo -e "${RED}❌ Error applying migration.${NC}"
    exit 1
fi

# Verify the table exists
echo -e "\n${BLUE}Verifying emoji_analytics table...${NC}"

if [ "$TARGET" = "local" ]; then
    # Verify in local DB
    TABLE_CHECK=$(supabase db execute "SELECT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'emoji_analytics');" --single-row --single-column)
else
    # Verify in remote DB
    TABLE_CHECK=$(supabase db remote execute "SELECT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'emoji_analytics');" --single-row --single-column)
fi

if [[ $TABLE_CHECK == *"t"* ]]; then
    echo -e "${GREEN}✅ emoji_analytics table exists${NC}"
else
    echo -e "${RED}❌ emoji_analytics table was not created${NC}"
    exit 1
fi

# Verify the view exists
echo -e "${BLUE}Verifying emoji_usage_stats view...${NC}"

if [ "$TARGET" = "local" ]; then
    # Verify in local DB
    VIEW_CHECK=$(supabase db execute "SELECT EXISTS (SELECT FROM information_schema.views WHERE table_name = 'emoji_usage_stats');" --single-row --single-column)
else
    # Verify in remote DB
    VIEW_CHECK=$(supabase db remote execute "SELECT EXISTS (SELECT FROM information_schema.views WHERE table_name = 'emoji_usage_stats');" --single-row --single-column)
fi

if [[ $VIEW_CHECK == *"t"* ]]; then
    echo -e "${GREEN}✅ emoji_usage_stats view exists${NC}"
else
    echo -e "${RED}❌ emoji_usage_stats view was not created${NC}"
    exit 1
fi

echo -e "\n${GREEN}============================================${NC}"
echo -e "${GREEN}Emoji Analytics Migration Complete${NC}"
echo -e "${GREEN}============================================${NC}"
echo -e "Date: $(date)"
echo -e "Target: ${TARGET}"

echo -e "\n${YELLOW}Next steps:${NC}"
echo "1. Restart your development server"
echo "2. Test the emoji analytics functionality"
echo "3. Verify data is being recorded in the emoji_analytics table"

exit 0
