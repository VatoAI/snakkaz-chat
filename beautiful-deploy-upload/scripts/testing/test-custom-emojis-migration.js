// Test script to check if custom emojis migration has been applied
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials in environment variables');
  console.error('Expected: VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function testCustomEmojisMigration() {
  console.log('🔍 Testing Custom Emojis Migration Status...\n');

  try {
    // Test 1: Check if custom_emojis table exists
    console.log('📋 Test 1: Checking if custom_emojis table exists...');
    const { data: emojiTableData, error: emojiTableError } = await supabase
      .from('custom_emojis')
      .select('count', { count: 'exact', head: true });

    if (emojiTableError) {
      console.log('❌ custom_emojis table does not exist');
      console.log('Error:', emojiTableError.message);
      console.log('\n📝 Action Required: Apply the custom emojis migration');
      console.log('   1. Open Supabase SQL Editor');
      console.log('   2. Copy contents of custom-emojis-safe-migration.sql');
      console.log('   3. Execute the migration');
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

    console.log('\n🎉 Migration Status: COMPLETE');
    console.log('📊 Custom emojis system is ready to use!');
    return true;

  } catch (error) {
    console.error('❌ Unexpected error:', error);
    return false;
  }
}

// Run the test
testCustomEmojisMigration()
  .then((success) => {
    if (success) {
      console.log('\n✅ Next steps:');
      console.log('   1. Test custom emoji upload in the application');
      console.log('   2. Test custom emoji reactions on messages');
      console.log('   3. Verify emoji management features');
    } else {
      console.log('\n❌ Migration not complete. Please follow the manual migration instructions.');
    }
  })
  .catch(console.error);
