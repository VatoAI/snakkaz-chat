#!/bin/bash
# filepath: /workspaces/snakkaz-chat/apply-emoji-pack-migration.sh

# Script to apply the emoji pack migration
# Created: May 25, 2025

echo "🔍 Applying Emoji Pack Migration..."

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

# Create migration file
MIGRATION_FILE="/workspaces/snakkaz-chat/src/migrations/emoji_pack_tables.sql"

echo -e "${BLUE}Creating migration file at ${MIGRATION_FILE}...${NC}"

# Get SQL from the utility function
node -e "
const fs = require('fs');
try {
  const { getEmojiPackMigrationSQL } = require('./src/utils/emojiPackUtils');
  fs.writeFileSync('${MIGRATION_FILE}', getEmojiPackMigrationSQL());
  console.log('Migration file created successfully');
} catch (err) {
  console.error('Error creating migration file:', err);
  process.exit(1);
}
"

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Failed to create migration file.${NC}"
    exit 1
fi

# Apply the migration
echo -e "\n${BLUE}Applying emoji_pack_tables.sql migration...${NC}"

if [ "$TARGET" = "local" ]; then
    # Apply to local Supabase
    supabase db reset
else
    # Apply to remote Supabase
    cat src/migrations/emoji_pack_tables.sql | supabase db remote sql
fi

# Check exit status
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Migration applied successfully!${NC}"
else
    echo -e "${RED}❌ Error applying migration.${NC}"
    exit 1
fi

# Verify the tables exist
echo -e "\n${BLUE}Verifying emoji_packs table...${NC}"

if [ "$TARGET" = "local" ]; then
    # Verify in local DB
    TABLE_CHECK=$(supabase db execute "SELECT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'emoji_packs');" --single-row --single-column)
else
    # Verify in remote DB
    TABLE_CHECK=$(supabase db remote execute "SELECT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'emoji_packs');" --single-row --single-column)
fi

if [[ $TABLE_CHECK == *"t"* ]]; then
    echo -e "${GREEN}✅ emoji_packs table exists${NC}"
else
    echo -e "${RED}❌ emoji_packs table was not created${NC}"
    exit 1
fi

# Verify the second table
echo -e "${BLUE}Verifying pack_emojis table...${NC}"

if [ "$TARGET" = "local" ]; then
    # Verify in local DB
    TABLE_CHECK=$(supabase db execute "SELECT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'pack_emojis');" --single-row --single-column)
else
    # Verify in remote DB
    TABLE_CHECK=$(supabase db remote execute "SELECT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'pack_emojis');" --single-row --single-column)
fi

if [[ $TABLE_CHECK == *"t"* ]]; then
    echo -e "${GREEN}✅ pack_emojis table exists${NC}"
else
    echo -e "${RED}❌ pack_emojis table was not created${NC}"
    exit 1
fi

# Verify the function
echo -e "${BLUE}Verifying increment_emoji_pack_count function...${NC}"

if [ "$TARGET" = "local" ]; then
    # Verify in local DB
    FUNC_CHECK=$(supabase db execute "SELECT EXISTS (SELECT FROM pg_proc WHERE proname = 'increment_emoji_pack_count');" --single-row --single-column)
else
    # Verify in remote DB
    FUNC_CHECK=$(supabase db remote execute "SELECT EXISTS (SELECT FROM pg_proc WHERE proname = 'increment_emoji_pack_count');" --single-row --single-column)
fi

if [[ $FUNC_CHECK == *"t"* ]]; then
    echo -e "${GREEN}✅ increment_emoji_pack_count function exists${NC}"
else
    echo -e "${RED}❌ increment_emoji_pack_count function was not created${NC}"
    exit 1
fi

echo -e "\n${GREEN}============================================${NC}"
echo -e "${GREEN}Emoji Pack Migration Complete${NC}"
echo -e "${GREEN}============================================${NC}"
echo -e "Date: $(date)"
echo -e "Target: ${TARGET}"

echo -e "\n${YELLOW}Next steps:${NC}"
echo "1. Restart your development server"
echo "2. Test the emoji pack functionality"
echo "3. Try creating and installing emoji packs"

exit 0
