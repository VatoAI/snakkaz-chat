#!/usr/bin/env node

// Simple test using curl to check if custom emojis migration is applied
const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🔍 Testing Custom Emojis Migration Status...\n');

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

async function testCustomEmojisMigration() {
  try {
    // Test 1: Check if custom_emojis table exists using curl
    console.log('📋 Test 1: Checking if custom_emojis table exists...');
    
    const curlCmd = `curl -X GET "${supabaseUrl}/rest/v1/custom_emojis?select=count" \
      -H "apikey: ${supabaseKey}" \
      -H "Authorization: Bearer ${supabaseKey}" \
      -H "Content-Type: application/json" \
      -H "Prefer: count=exact"`;
    
    exec(curlCmd, (error, stdout, stderr) => {
      if (error) {
        console.log('❌ custom_emojis table does not exist');
        console.log('Error:', error.message);
        console.log('\n📝 MIGRATION REQUIRED');
        console.log('   Please apply the migration manually:');
        console.log('   1. Open Supabase Dashboard -> SQL Editor');
        console.log('   2. Copy contents of custom-emojis-safe-migration.sql');
        console.log('   3. Execute the migration');
        console.log('   4. Run this test again');
        return;
      }
      
      try {
        const response = JSON.parse(stdout);
        if (response.error) {
          console.log('❌ custom_emojis table does not exist');
          console.log('Error:', response.error.message);
          console.log('\n📝 MIGRATION REQUIRED');
          console.log('   Please apply the migration manually:');
          console.log('   1. Open Supabase Dashboard -> SQL Editor');
          console.log('   2. Copy contents of custom-emojis-safe-migration.sql');
          console.log('   3. Execute the migration');
          console.log('   4. Run this test again');
        } else {
          console.log('✅ custom_emojis table exists');
          
          // Test 2: Check if custom_emoji_reactions table exists
          console.log('📋 Test 2: Checking if custom_emoji_reactions table exists...');
          
          const curlCmd2 = `curl -X GET "${supabaseUrl}/rest/v1/custom_emoji_reactions?select=count" \
            -H "apikey: ${supabaseKey}" \
            -H "Authorization: Bearer ${supabaseKey}" \
            -H "Content-Type: application/json" \
            -H "Prefer: count=exact"`;
          
          exec(curlCmd2, (error2, stdout2, stderr2) => {
            if (error2) {
              console.log('❌ custom_emoji_reactions table does not exist');
              console.log('Error:', error2.message);
              return;
            }
            
            try {
              const response2 = JSON.parse(stdout2);
              if (response2.error) {
                console.log('❌ custom_emoji_reactions table does not exist');
                console.log('Error:', response2.error.message);
              } else {
                console.log('✅ custom_emoji_reactions table exists');
                console.log('\n🎉 MIGRATION COMPLETE!');
                console.log('📊 Custom emojis system is ready to use!');
                console.log('\n✅ Next steps:');
                console.log('   1. Test custom emoji upload in the web app');
                console.log('   2. Test custom emoji reactions on messages');
                console.log('   3. Verify emoji management features');
              }
            } catch (parseError2) {
              console.log('❌ Error parsing response for custom_emoji_reactions');
            }
          });
        }
      } catch (parseError) {
        console.log('❌ Error parsing response for custom_emojis');
      }
    });

  } catch (error) {
    console.error('❌ Unexpected error:', error.message);
    return false;
  }
}

testCustomEmojisMigration();
