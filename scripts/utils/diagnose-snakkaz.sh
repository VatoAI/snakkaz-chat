#!/bin/bash
# Snakkaz Chat Diagnostic and Fix Tool
# Created: May 23, 2025

echo "🔍 Snakkaz Chat Diagnostic Tool"
echo "============================="
echo ""

# Check for database configuration issues
echo "Step 1: Checking database configuration..."
DB_ISSUES=0

# Check if environment files exist
if [ -f ".env" ]; then
  echo "✓ Found .env file"
else
  echo "⚠️ No .env file found - application may be using default configuration"
  DB_ISSUES=$((DB_ISSUES + 1))
fi

# Check for Supabase URL in environment.ts
SUPABASE_URL=$(grep -o "url:.*'https://[^']*" src/config/environment.ts | cut -d "'" -f2)
if [ -n "$SUPABASE_URL" ]; then
  echo "✓ Found Supabase URL in environment config: ${SUPABASE_URL}"
else
  echo "❌ No Supabase URL found in environment config"
  DB_ISSUES=$((DB_ISSUES + 2))
fi

echo ""
echo "Step 2: Checking chat components..."

# Check if chat components exist
if [ -d "src/components/chat" ]; then
  CHAT_FILES=$(find src/components/chat -type f | wc -l)
  echo "✓ Found $CHAT_FILES chat component files"
else
  echo "❌ Chat components directory not found"
fi

# Check for ChatContext
if [ -f "src/contexts/ChatContext.tsx" ]; then
  echo "✓ Found ChatContext"
else
  echo "❌ ChatContext not found"
fi

echo ""
echo "Step 3: Checking for common errors..."

# Check for multiple Supabase client instances
SUPABASE_INSTANCES=$(grep -r "createClient" --include="*.ts" --include="*.tsx" src/ | wc -l)
if [ "$SUPABASE_INSTANCES" -gt 1 ]; then
  echo "⚠️ Found multiple createClient calls ($SUPABASE_INSTANCES) - might cause concurrency issues"
else
  echo "✓ Single Supabase client instance"
fi

# Check for missing component imports
MISSING_IMPORTS=$(grep -r "Cannot find module" src/components 2>/dev/null | wc -l)
if [ "$MISSING_IMPORTS" -gt 0 ]; then
  echo "❌ Found $MISSING_IMPORTS missing imports"
else
  echo "✓ No missing component imports"
fi

echo ""
echo "Step 4: Checking database schema..."

# Check if subscription tables exist in schema
SUBSCRIPTION_TABLES=$(grep -c "CREATE TABLE.*subscription" sql/schema.sql 2>/dev/null || echo "0")
if [ "$SUBSCRIPTION_TABLES" -gt 0 ]; then
  echo "✓ Found subscription tables in schema"
else
  echo "❌ No subscription tables found in schema - run ./fix-subscription-schema.sh"
fi

# Report summary
echo ""
echo "📊 Diagnostic Summary"
echo "-------------------"
echo "Database issues: $DB_ISSUES"
echo "Chat components: $([ -d "src/components/chat" ] && echo "Found" || echo "Missing")"
echo "Subscription tables: $([ "$SUBSCRIPTION_TABLES" -gt 0 ] && echo "Found" || echo "Missing")"
echo ""

# Recommend fixes
echo "🛠️ Recommended Actions:"
if [ "$DB_ISSUES" -gt 0 ]; then
  echo "- Check your Supabase configuration in src/config/environment.ts"
  echo "- Ensure your database connection is working properly"
fi

if [ "$SUBSCRIPTION_TABLES" -eq 0 ]; then
  echo "- Run ./fix-subscription-schema.sh to create missing subscription tables"
fi

if [ "$SUPABASE_INSTANCES" -gt 1 ]; then
  echo "- Fix multiple Supabase client instances by using the singleton pattern"
  echo "  (See src/lib/supabaseClient.ts for the recommended approach)"
fi

echo ""
echo "To apply all fixes and rebuild the application, run:"
echo "./fix-and-rebuild.sh"
echo ""
