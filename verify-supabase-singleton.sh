#!/bin/bash

# Script to verify Supabase singleton pattern usage
# This script will check for files that might still be creating their own Supabase clients

echo "🔍 Scanning codebase for Supabase client issues..."
echo

# Check for direct client creations
echo "Checking for direct createClient() calls..."
DIRECT_CLIENTS=$(grep -r "createClient(" --include="*.ts" --include="*.tsx" --include="*.js" --exclude="*.bak" --exclude="*-backup*" --exclude-dir={node_modules,dist,build,.git,backup} src)

if [ -n "$DIRECT_CLIENTS" ]; then
  echo "⚠️ Found files that might be creating Supabase clients directly:"
  echo "$DIRECT_CLIENTS" | sed 's/^/  - /'
  echo
else
  echo "✅ No direct Supabase client creations found."
  echo
fi

# Check for duplicate imports
echo "Checking for duplicate Supabase imports..."
DUPLICATE_IMPORTS=$(grep -r "^import.*supabase.*from" --include="*.ts" --include="*.tsx" --include="*.js" --exclude="*.bak" --exclude="*-backup*" --exclude-dir={node_modules,dist,build,.git,backup} src | sort | uniq -c | grep -v "^ *1 " | sed 's/^ *//')

if [ -n "$DUPLICATE_IMPORTS" ]; then
  echo "⚠️ Found files with duplicate Supabase imports:"
  echo "$DUPLICATE_IMPORTS" | sed 's/^[0-9]* /  - /'
  echo
else
  echo "✅ No duplicate Supabase imports found."
  echo
fi

# Check for import from the old locations
echo "Checking for imports from non-singleton locations..."
NON_SINGLETON_IMPORTS=$(grep -r "from ['\\\"]\(@\/integrations\/supabase\/client\|@\/integrations\/supabase\/client-fixed\)['\\\"]" --include="*.ts" --include="*.tsx" --include="*.js" --exclude="*.bak" --exclude="*-backup*" --exclude-dir={node_modules,dist,build,.git,backup} src)

if [ -n "$NON_SINGLETON_IMPORTS" ]; then
  echo "⚠️ Found files importing from non-singleton locations:"
  echo "$NON_SINGLETON_IMPORTS" | sed 's/^/  - /'
  echo
else
  echo "✅ No imports from non-singleton locations found."
  echo
fi

# Verify correct import path
echo "Verifying correct singleton import path usage..."
CORRECT_IMPORTS=$(grep -r "from ['\\\"]\(@\/lib\/supabaseClient\|@\/lib\/supabase-singleton\)['\\\"]" --include="*.ts" --include="*.tsx" --include="*.js" --exclude="*.bak" --exclude="*-backup*" --exclude-dir={node_modules,dist,build,.git,backup} src | wc -l)

echo "ℹ️ Found $CORRECT_IMPORTS files correctly importing from the singleton."
echo

echo "======================================"
echo "Supabase Singleton Pattern Verification"
echo "======================================"
echo
echo "✓ Verified Supabase client integration"
echo "✓ Checked for duplicate imports"
echo "✓ Confirmed singleton pattern usage"
echo 
echo "Please fix any warnings reported above."
