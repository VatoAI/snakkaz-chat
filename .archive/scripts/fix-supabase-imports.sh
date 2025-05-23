#!/bin/bash
# Script to fix remaining Supabase client imports
# This script will migrate from @/integrations/supabase/client to @/lib/supabaseClient

# Define colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color
BLUE='\033[0;34m'

echo -e "${BLUE}==================================================${NC}"
echo -e "${BLUE}Supabase Client Migration - Fixing Imports${NC}"
echo -e "${BLUE}==================================================${NC}"
echo

# Count files that need fixing
FILE_COUNT=$(grep -r --include="*.ts" --include="*.tsx" --include="*.js" --include="*.jsx" "import.*supabase.*from.*@/integrations/supabase/client" /workspaces/snakkaz-chat | wc -l)
echo -e "${YELLOW}Found $FILE_COUNT files with incorrect Supabase imports${NC}"

# Function to fix imports in a file
fix_file() {
    local file=$1
    echo -e "${GREEN}Processing:${NC} $file"
    
    # Replace imports
    sed -i 's|import { supabase } from "@/integrations/supabase/client";|import { supabase } from "@/lib/supabaseClient";|g' "$file"
    sed -i "s|import { supabase } from '@/integrations/supabase/client';|import { supabase } from '@/lib/supabaseClient';|g" "$file"
    sed -i 's|import { supabase as.*} from "@/integrations/supabase/client";|import { supabase } from "@/lib/supabaseClient";|g' "$file"
    sed -i "s|import { supabase as.*} from '@/integrations/supabase/client';|import { supabase } from '@/lib/supabaseClient';|g" "$file"
    
    # Handle multi-import cases
    sed -i 's|import { supabase, \(.*\) } from "@/integrations/supabase/client";|import { supabase } from "@/lib/supabaseClient";\nimport { \1 } from "@/integrations/supabase/client";|g' "$file"
    sed -i "s|import { supabase, \(.*\) } from '@/integrations/supabase/client';|import { supabase } from '@/lib/supabaseClient';\nimport { \1 } from '@/integrations/supabase/client';|g" "$file"
}

# Find and process all files with incorrect imports
echo -e "${YELLOW}Starting migration process...${NC}"
echo

FILES=$(grep -l --include="*.ts" --include="*.tsx" --include="*.js" --include="*.jsx" -r "import.*supabase.*from.*@/integrations/supabase/client" /workspaces/snakkaz-chat)

for file in $FILES; do
    fix_file "$file"
done

echo
echo -e "${GREEN}Migration completed! Fixed $FILE_COUNT files.${NC}"
echo -e "${YELLOW}Run the verification script to confirm all issues are resolved:${NC}"
echo -e "  bash verify-supabase-singleton.sh"
echo
echo -e "${BLUE}==================================================${NC}"
