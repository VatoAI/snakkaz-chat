#!/bin/bash
# Comprehensive Supabase Client Singleton Fix Script
# Created: May 22, 2025

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}===============================================${NC}"
echo -e "${BLUE}    SUPABASE CLIENT SINGLETON FIX SCRIPT       ${NC}"
echo -e "${BLUE}===============================================${NC}"
echo

# Search for all TypeScript/JavaScript files with incorrect imports
echo -e "${YELLOW}Searching for files with incorrect Supabase imports...${NC}"

# Find files with old import style
files_to_fix=$(grep -l -r --include="*.ts" --include="*.tsx" --include="*.js" --include="*.jsx" "import.*supabase.*from.*@/integrations/supabase/client" /workspaces/snakkaz-chat | sort)

# Count found files
file_count=$(echo "$files_to_fix" | grep -v '^$' | wc -l)
echo -e "${YELLOW}Found $file_count files with incorrect Supabase imports${NC}"

if [ "$file_count" -eq 0 ]; then
  echo -e "${GREEN}No files need fixing! All imports are correct.${NC}"
  exit 0
fi

echo
echo -e "${YELLOW}Fixing imports in all files...${NC}"
echo

# Create a backup directory
backup_dir="/workspaces/snakkaz-chat/backup_before_supabase_fix_$(date +%Y%m%d_%H%M%S)"
mkdir -p "$backup_dir"
echo -e "${BLUE}Creating backup in: $backup_dir${NC}"

# Track progress
current=0

# Process each file
while IFS= read -r file; do
  if [ -z "$file" ]; then
    continue
  fi
  
  current=$((current + 1))
  percent=$((current * 100 / file_count))
  
  # Create relative path for backup
  rel_path=${file#/workspaces/snakkaz-chat/}
  backup_file="$backup_dir/$rel_path"
  mkdir -p "$(dirname "$backup_file")"
  
  # Backup original file
  cp "$file" "$backup_file"
  
  echo -e "${GREEN}[$percent%] Fixing:${NC} $rel_path"
  
  # Fix the imports - handle various styles
  sed -i 's|import { supabase } from "@/integrations/supabase/client"|import { supabase } from "@/lib/supabaseClient"|g' "$file"
  sed -i "s|import { supabase } from '@/integrations/supabase/client'|import { supabase } from '@/lib/supabaseClient'|g" "$file"
  
  # Handle variations with additional imports
  sed -i 's|import { supabase, \(.*\) } from "@/integrations/supabase/client"|import { supabase } from "@/lib/supabaseClient"\nimport { \1 } from "@/integrations/supabase/client"|g' "$file"
  sed -i "s|import { supabase, \(.*\) } from '@/integrations/supabase/client'|import { supabase } from '@/lib/supabaseClient'\nimport { \1 } from '@/integrations/supabase/client'|g" "$file"
  
  # Handle variations with supabase as something else
  sed -i 's|import { supabase as \(.*\) } from "@/integrations/supabase/client"|import { supabase as \1 } from "@/lib/supabaseClient"|g' "$file"
  sed -i "s|import { supabase as \(.*\) } from '@/integrations/supabase/client'|import { supabase as \1 } from '@/lib/supabaseClient'|g" "$file"

done <<< "$files_to_fix"

echo
echo -e "${GREEN}Import fixes completed successfully!${NC}"
echo -e "${BLUE}-----------------------------------------------${NC}"
echo -e "${YELLOW}Running verification...${NC}"

# Run the verification script if it exists
if [ -f "/workspaces/snakkaz-chat/verify-supabase-singleton.sh" ]; then
  bash /workspaces/snakkaz-chat/verify-supabase-singleton.sh
else
  echo -e "${RED}Verification script not found. Please run it manually.${NC}"
fi

echo
echo -e "${BLUE}===============================================${NC}"
echo -e "${GREEN}Supabase client singleton fix completed!${NC}"
echo -e "${YELLOW}Backup saved to: $backup_dir${NC}"
echo -e "${BLUE}===============================================${NC}"
