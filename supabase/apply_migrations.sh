#!/bin/sh
echo "Applying Snakkaz Chat database migrations..."

# Apply individual migrations
psql "$DATABASE_URL" -f supabase/migrations/fix_profiles_display_name.sql
psql "$DATABASE_URL" -f supabase/migrations/fix_profiles_is_premium.sql
psql "$DATABASE_URL" -f supabase/migrations/fix_user_presence_client_info.sql
psql "$DATABASE_URL" -f supabase/migrations/fix_group_members_policy.sql
psql "$DATABASE_URL" -f supabase/migrations/20250504_create_direct_messages.sql

echo "Migrations completed!"

