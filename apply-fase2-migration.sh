#!/bin/bash
# Script to apply FASE 2 database migrations using Supabase CLI

echo "===== FASE 2: Applying Group Administration Database Migrations ====="
echo "Date: $(date)"

# Check if Supabase CLI is installed
if ! command -v supabase &> /dev/null; then
  echo "❌ Supabase CLI not found!"
  echo "Please install it with: npm install -g supabase"
  exit 1
fi

# Check if we're in the project root
if [ ! -d "./src" ] || [ ! -f "./package.json" ]; then
  echo "❌ Please run this script from the project root directory"
  exit 1
fi

# Create migration directory if it doesn't exist
mkdir -p ./supabase/migrations

# Generate timestamp for migration filename
TIMESTAMP=$(date +"%Y%m%d%H%M%S")
MIGRATION_FILE="./supabase/migrations/${TIMESTAMP}_fase2_group_administration.sql"

# Copy migration SQL to file
echo "Creating migration file: $MIGRATION_FILE"
cp ./FASE2-GROUP-MIGRATION.sql "$MIGRATION_FILE"

echo "📝 Migration file created. Applying changes..."

# Run the migration
supabase db push

if [ $? -eq 0 ]; then
  echo "✅ Database migration applied successfully!"
  
  echo "Testing new tables and columns..."
  # Test that the migration was successful
  supabase db query "SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'group_settings' AND column_name = 'allow_member_invites'" >/dev/null
  
  if [ $? -eq 0 ]; then
    echo "✅ Group settings table updated with new columns"
  else
    echo "❌ Failed to verify group_settings table changes"
  fi
  
  supabase db query "SELECT * FROM information_schema.tables WHERE table_name = 'group_invites'" >/dev/null
  
  if [ $? -eq 0 ]; then
    echo "✅ Group invites table created successfully"
  else
    echo "❌ Failed to verify group_invites table creation"
  fi
  
  echo
  echo "🚀 FASE 2 database migration complete!"
  echo "You can now use the new GroupAdministration and GroupInvitePanel components."
else
  echo "❌ Migration failed!"
  echo "Please check the error messages above and fix any issues."
fi
