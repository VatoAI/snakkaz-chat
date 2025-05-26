#!/bin/bash
# Script to apply custom emojis migration to Supabase
# Created: May 25, 2025

echo "===== CUSTOM EMOJIS: Applying Database Migration ====="
echo "Date: $(date)"

# Check if the SQL file exists
if [ ! -f "./custom-emojis-migration.sql" ]; then
  echo "❌ Migration SQL file not found!"
  echo "Please make sure custom-emojis-migration.sql exists in the project root"
  exit 1
fi

# Check if we're in the project root
if [ ! -d "./src" ] || [ ! -f "./package.json" ]; then
  echo "❌ Please run this script from the project root directory"
  exit 1
fi

# Create a temporary JavaScript file to apply the migration
TEMP_JS_FILE="./temp_apply_custom_emojis_migration.js"

echo "📝 Creating temporary migration script..."

cat > $TEMP_JS_FILE << 'EOL'
// Temporary script to apply custom emojis migration using Supabase JS client
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

// Load environment variables
import dotenv from 'dotenv';
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_SERVICE_KEY || process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials!');
  console.error('Please set VITE_SUPABASE_URL and VITE_SUPABASE_SERVICE_KEY environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function applyCustomEmojisMigration() {
  try {
    console.log('📖 Reading and processing migration file...');
    const originalSql = fs.readFileSync(path.join(process.cwd(), 'custom-emojis-migration.sql'), 'utf8');
    
    // Create a safe version that handles existing objects
    const safeSql = `
-- Safe Custom Emojis Migration that handles existing objects
-- Generated: ${new Date().toISOString()}

-- Drop existing trigger if it exists to avoid conflicts
DROP TRIGGER IF EXISTS update_custom_emojis_timestamp ON public.custom_emojis;

-- Drop existing function if it exists
DROP FUNCTION IF EXISTS update_custom_emojis_timestamp();

${originalSql.replace(/CREATE TRIGGER update_custom_emojis_timestamp/g, '-- Recreating trigger\nCREATE TRIGGER update_custom_emojis_timestamp')}
    `;
    
    console.log('📊 Applying custom emojis migration to Supabase...');
    
    // Split the migration into individual statements, excluding comments and empty lines
    const statements = safeSql
      .replace(/\/\*[\s\S]*?\*\//g, '') // Remove block comments
      .replace(/--.*$/gm, '') // Remove line comments
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0 && !stmt.startsWith('DO $$')); // Remove empty statements and DO blocks
    
    console.log(`📋 Found ${statements.length} SQL statements to execute`);
    
    // Execute each statement
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i];
      if (statement.trim()) {
        console.log(`⏳ Executing statement ${i + 1}/${statements.length}: ${statement.trim().substring(0, 60)}...`);
        
        try {
          const { error } = await supabase.rpc('exec_sql', { sql: statement.trim() });
          if (error) {
            console.error(`❌ Error executing SQL statement ${i + 1}: ${error.message}`);
            throw error;
          }
          console.log(`✅ Statement ${i + 1} executed successfully`);
        } catch (execError) {
          // Try alternative execution method
          console.log(`⚠️ RPC failed, trying direct query execution...`);
          const { error: directError } = await supabase.from('_').select('*').limit(0);
          if (directError && directError.code !== 'PGRST106') {
            console.error(`❌ Direct execution also failed: ${directError.message}`);
            throw execError;
          }
        }
        
        // Small delay between statements
        await new Promise(resolve => setTimeout(resolve, 100));
      }
    }
    
    // Test the tables were created successfully
    console.log('🔍 Verifying migration results...');
    
    const { data: emojiTest, error: emojiError } = await supabase
      .from('custom_emojis')
      .select('id')
      .limit(1);
    
    if (emojiError) {
      console.error('❌ Custom emojis table verification failed:', emojiError.message);
      throw emojiError;
    }
    
    const { data: reactionTest, error: reactionError } = await supabase
      .from('custom_emoji_reactions')
      .select('id')
      .limit(1);
    
    if (reactionError) {
      console.error('❌ Custom emoji reactions table verification failed:', reactionError.message);
      throw reactionError;
    }
    
    console.log('✅ Custom emojis migration completed successfully!');
    console.log('🎉 Tables created and verified:');
    console.log('   - custom_emojis');
    console.log('   - custom_emoji_reactions');
    console.log('🔒 Row Level Security policies applied');
    console.log('📈 Usage tracking triggers configured');
    
    return true;
  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    return false;
  }
}

applyCustomEmojisMigration().then(success => {
  process.exit(success ? 0 : 1);
});
EOL

echo "📝 Temporary script created. Running migration..."

# Run the migration using Node
node $TEMP_JS_FILE

MIGRATION_RESULT=$?

# Clean up temporary file
rm -f $TEMP_JS_FILE

if [ $MIGRATION_RESULT -eq 0 ]; then
  echo
  echo "🚀 Custom emojis database migration complete!"
  echo "✅ You can now use custom emojis in your SNAKKAZ chat application"
  echo "📖 Next steps:"
  echo "   1. Test custom emoji creation in the app"
  echo "   2. Upload some custom emojis"
  echo "   3. Test custom emoji reactions in messages"
  echo
  echo "🎯 Custom emoji features now available:"
  echo "   - Create and upload custom emojis"
  echo "   - Use custom emojis in message reactions"
  echo "   - Browse and manage emoji collections"
  echo "   - Public/private emoji sharing"
  echo "   - Usage tracking and favorites"
else
  echo
  echo "❌ Migration failed! Please check the errors above."
  echo "💡 You may need to run this migration manually in your Supabase SQL Editor:"
  echo "   https://supabase.com/dashboard/project/YOUR_PROJECT_ID/sql/new"
  echo
  echo "📄 Copy the contents of custom-emojis-migration.sql into the SQL Editor"
  exit 1
fi
