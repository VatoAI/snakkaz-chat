// Simple test to check if custom emojis tables exist
console.log('🔍 Testing Custom Emojis Migration Status...\n');

// We'll use the existing Supabase client from the app
// First, let's check if we can access the app's environment

const fs = require('fs');
const path = require('path');

// Read .env file manually
const envPath = path.join(__dirname, '.env');
let supabaseUrl = '';
let supabaseKey = '';

try {
  const envContent = fs.readFileSync(envPath, 'utf8');
  const lines = envContent.split('\n');
  
  for (const line of lines) {
    if (line.startsWith('VITE_SUPABASE_URL=')) {
      supabaseUrl = line.split('=')[1];
    }
    if (line.startsWith('VITE_SUPABASE_ANON_KEY=')) {
      supabaseKey = line.split('=')[1];
    }
  }
} catch (error) {
  console.error('❌ Could not read .env file:', error.message);
  process.exit(1);
}

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials in .env file');
  process.exit(1);
}

const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(supabaseUrl, supabaseKey);

async function testCustomEmojisMigration() {
  try {
    // Test 1: Check if custom_emojis table exists
    console.log('📋 Test 1: Checking if custom_emojis table exists...');
    const { data: emojiTableData, error: emojiTableError } = await supabase
      .from('custom_emojis')
      .select('count', { count: 'exact', head: true });

    if (emojiTableError) {
      console.log('❌ custom_emojis table does not exist');
      console.log('Error:', emojiTableError.message);
      console.log('\n📝 MIGRATION REQUIRED');
      console.log('   Please apply the migration manually:');
      console.log('   1. Open Supabase Dashboard -> SQL Editor');
      console.log('   2. Copy contents of custom-emojis-safe-migration.sql');
      console.log('   3. Execute the migration');
      console.log('   4. Run this test again');
      return false;
    } else {
      console.log('✅ custom_emojis table exists');
    }

    // Test 2: Check if custom_emoji_reactions table exists
    console.log('📋 Test 2: Checking if custom_emoji_reactions table exists...');
    const { data: reactionsTableData, error: reactionsTableError } = await supabase
      .from('custom_emoji_reactions')
      .select('count', { count: 'exact', head: true });

    if (reactionsTableError) {
      console.log('❌ custom_emoji_reactions table does not exist');
      console.log('Error:', reactionsTableError.message);
      return false;
    } else {
      console.log('✅ custom_emoji_reactions table exists');
    }

    console.log('\n🎉 MIGRATION COMPLETE!');
    console.log('📊 Custom emojis system is ready to use!');
    console.log('\n✅ Next steps:');
    console.log('   1. Test custom emoji upload in the web app');
    console.log('   2. Test custom emoji reactions on messages');
    console.log('   3. Verify emoji management features');
    return true;

  } catch (error) {
    console.error('❌ Unexpected error:', error.message);
    return false;
  }
}

testCustomEmojisMigration();
