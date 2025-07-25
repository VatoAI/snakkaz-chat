#!/bin/bash
# fix-database-schema.sh
# Script to fix database schema issues with SnakkaZ chat app

echo "🔧 SnakkaZ Database Schema Fix"
echo "============================"

# Check if the SUPABASE_URL and SUPABASE_KEY environment variables are set
if [ -z "$SUPABASE_URL" ] || [ -z "$SUPABASE_SERVICE_KEY" ]; then
  echo "❌ Error: SUPABASE_URL and SUPABASE_SERVICE_KEY environment variables must be set."
  echo
  echo "Please set them before running this script:"
  echo "export SUPABASE_URL=\"your-project-url\""
  echo "export SUPABASE_SERVICE_KEY=\"your-service-role-key\""
  echo
  echo "You can find these values in your Supabase project settings > API"
  exit 1
fi

echo "🔍 Checking database schema..."

# Run the SQL script to fix database schema
echo "🔧 Applying schema fixes..."
curl -X POST "${SUPABASE_URL}/rest/v1/rpc/exec_sql" \
  -H "apikey: ${SUPABASE_SERVICE_KEY}" \
  -H "Authorization: Bearer ${SUPABASE_SERVICE_KEY}" \
  -H "Content-Type: application/json" \
  -d @scripts/fix-database-schema.sql

# Display success message
echo "✅ Database schema fix applied!"
echo
echo "Next steps:"
echo "1. Restart your application to apply the schema changes"
echo "2. Run 'npm run build' to rebuild with the updated schema"
echo "3. Test the chat functionality again"
