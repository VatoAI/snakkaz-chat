#!/bin/bash

# Script to create 'api' schema and migrate tables from 'public' schema
# This script helps implement Supabase's recommended practice of using 'api' schema instead of 'public'

echo "🔧 Setting up API schema for Supabase..."
echo "========================================"

# Check if environment variables are set
if [ -z "$SUPABASE_URL" ] || [ -z "$SUPABASE_SERVICE_KEY" ]; then
    echo "❌ Error: SUPABASE_URL and SUPABASE_SERVICE_KEY environment variables must be set."
    echo ""
    echo "Please set them before running this script:"
    echo "export SUPABASE_URL=\"your-project-url\""
    echo "export SUPABASE_SERVICE_KEY=\"your-service-role-key\""
    echo ""
    echo "You can find these values in your Supabase project settings > API"
    exit 1
fi

# SQL to execute
SQL_COMMANDS=$(cat << EOF
-- Create the api schema
CREATE SCHEMA IF NOT EXISTS api;

-- Grant usage privileges to anon and authenticated roles
GRANT USAGE ON SCHEMA api TO anon, authenticated;

-- Move existing tables from public schema to api schema (if they exist)
DO \$\$
DECLARE
    table_name text;
BEGIN
    -- Get all tables from public schema
    FOR table_name IN 
        SELECT tablename FROM pg_tables WHERE schemaname = 'public'
    LOOP
        -- Create the table in api schema
        EXECUTE 'CREATE TABLE IF NOT EXISTS api.' || table_name || ' (LIKE public.' || table_name || ' INCLUDING ALL)';
        
        -- Copy data from public to api schema
        EXECUTE 'INSERT INTO api.' || table_name || ' SELECT * FROM public.' || table_name;
        
        -- Grant permissions to authenticated users
        EXECUTE 'GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE api.' || table_name || ' TO authenticated';
        
        -- Grant select permissions to anon users
        EXECUTE 'GRANT SELECT ON TABLE api.' || table_name || ' TO anon';
    END LOOP;
END;
\$\$;

-- Verify the schemas exist
SELECT schema_name FROM information_schema.schemata WHERE schema_name IN ('public', 'api');
EOF
)

# Use curl to execute the SQL commands
echo "🔄 Executing SQL commands..."
curl -s -X POST \
  -H "apikey: $SUPABASE_SERVICE_KEY" \
  -H "Authorization: Bearer $SUPABASE_SERVICE_KEY" \
  -H "Content-Type: application/json" \
  -H "Prefer: return=representation" \
  -d "{\"query\": \"$SQL_COMMANDS\"}" \
  "$SUPABASE_URL/rest/v1/rpc/exec_sql" | jq -r '.'

echo "✅ API schema setup complete!"
echo ""
echo "Next steps:"
echo "1. In the Supabase dashboard, go to API Settings"
echo "2. Add 'api' to 'Exposed schemas'"
echo "3. Remove 'public' from 'Exposed schemas' (after ensuring your app uses 'api')"
echo "4. Update your app to use 'api' schema instead of 'public' schema"
