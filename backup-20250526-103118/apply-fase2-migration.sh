#!/bin/bash
# Script to apply FASE 2 database migrations directly to the production database
# Since we're working with a remote Supabase instance

echo "===== FASE 2: Applying Group Administration Database Migrations ====="
echo "Date: $(date)"

# Check if the SQL file exists
if [ ! -f "./FASE2-GROUP-MIGRATION.sql" ]; then
  echo "❌ Migration SQL file not found!"
  echo "Please make sure FASE2-GROUP-MIGRATION.sql exists in the project root"
  exit 1
fi

# Check if we're in the project root
if [ ! -d "./src" ] || [ ! -f "./package.json" ]; then
  echo "❌ Please run this script from the project root directory"
  exit 1
fi

# Create a temporary JavaScript file to apply the migration
TEMP_JS_FILE="./temp_apply_migration.js"

echo "📝 Creating temporary migration script..."

cat > $TEMP_JS_FILE << 'EOL'
// Temporary script to apply database migrations using Supabase JS client
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials!');
  console.error('Please set SUPABASE_URL and SUPABASE_SERVICE_KEY environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function applyMigration() {
  try {
    const sql = fs.readFileSync(path.join(process.cwd(), 'FASE2-GROUP-MIGRATION.sql'), 'utf8');
    
    console.log('Applying migration to Supabase...');
    
    // Split the migration into individual statements
    const statements = sql
      .replace(/\/\*[\s\S]*?\*\//g, '') // Remove block comments
      .replace(/--.*$/gm, '') // Remove line comments
      .split(';')
      .filter(stmt => stmt.trim()); // Remove empty statements
    
    // Execute each statement
    for (const statement of statements) {
      if (statement.trim()) {
        console.log(`Executing: ${statement.trim().substring(0, 60)}...`);
        const { error } = await supabase.rpc('exec_sql', { sql: statement.trim() });
        if (error) {
          console.error(`❌ Error executing SQL: ${error.message}`);
          throw error;
        }
      }
    }
    
    console.log('✅ Migration completed successfully!');
    return true;
  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    return false;
  }
}

applyMigration().then(success => {
  process.exit(success ? 0 : 1);
});
EOL

echo "📝 Temporary script created. Running migration..."

# Run the migration using Node
node $TEMP_JS_FILE

if [ $? -eq 0 ]; then
  echo
  echo "🚀 FASE 2 database migration complete!"
  echo "You can now use the new GroupSettingsPanel, GroupAdministration and GroupInvitePanel components."
  
  # Clean up the temporary file
  rm -f $TEMP_JS_FILE
else
  echo "❌ Migration failed!"
  echo "Please check the error messages above and fix any issues."
  
  # Clean up the temporary file even on failure
  rm -f $TEMP_JS_FILE
  exit 1
fi
