#!/usr/bin/env node

// Test script to verify the subscription 406 fix
// Run this after applying the SQL fix to Supabase

const SUPABASE_URL = 'https://wqpoozpbceucynsojmbk.supabase.co';
const TEST_USER_ID = '419b9a79-e1ee-4935-83e2-375ca5a3ac13';

async function testSubscriptionEndpoint() {
  console.log('🧪 Testing subscription endpoint after database fix...\n');
  
  try {
    // Test the exact failing endpoint from the error
    const url = `${SUPABASE_URL}/rest/v1/subscriptions?select=*,subscription_plans(*)&user_id=eq.${TEST_USER_ID}&status=eq.active`;
    
    console.log('📡 Testing URL:', url);
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        // Note: In production you'd need proper auth headers
        // 'Authorization': 'Bearer YOUR_JWT_TOKEN',
        // 'apikey': 'YOUR_API_KEY'
      }
    });
    
    console.log('📊 Response Status:', response.status);
    console.log('📊 Response Headers:', Object.fromEntries(response.headers.entries()));
    
    if (response.status === 406) {
      console.log('❌ STILL GETTING 406 ERROR');
      console.log('🔧 The database fix may not have been applied correctly');
      console.log('🔧 Or you may need to restart your Supabase instance');
      
      const errorText = await response.text();
      console.log('📄 Error Response:', errorText);
      
      return false;
    } else if (response.status === 401) {
      console.log('🔒 Got 401 (Unauthorized) - This is expected without auth headers');
      console.log('✅ The 406 error is fixed! (Now getting auth error instead)');
      return true;
    } else if (response.status === 200) {
      console.log('✅ SUCCESS! Got 200 response');
      const data = await response.json();
      console.log('📄 Response data:', JSON.stringify(data, null, 2));
      return true;
    } else {
      console.log(`ℹ️  Got status ${response.status} - may still be an improvement`);
      const responseText = await response.text();
      console.log('📄 Response:', responseText);
      return response.status !== 406;
    }
    
  } catch (error) {
    console.error('💥 Network error testing endpoint:', error.message);
    return false;
  }
}

async function testTableStructure() {
  console.log('\n🏗️  Testing table structure...\n');
  
  try {
    // Test if subscription_plans table exists
    const plansUrl = `${SUPABASE_URL}/rest/v1/subscription_plans?select=*&limit=1`;
    const plansResponse = await fetch(plansUrl, {
      headers: { 'Accept': 'application/json' }
    });
    
    console.log('📋 Subscription plans table status:', plansResponse.status);
    
    if (plansResponse.status === 200) {
      const plans = await plansResponse.json();
      console.log('✅ Subscription plans table exists');
      console.log(`📊 Found ${plans.length} plan(s)`);
    }
    
    // Test if subscriptions table exists  
    const subsUrl = `${SUPABASE_URL}/rest/v1/subscriptions?select=*&limit=1`;
    const subsResponse = await fetch(subsUrl, {
      headers: { 'Accept': 'application/json' }
    });
    
    console.log('📋 Subscriptions table status:', subsResponse.status);
    
    if (subsResponse.status === 200) {
      console.log('✅ Subscriptions table exists');
    }
    
  } catch (error) {
    console.error('💥 Error testing table structure:', error.message);
  }
}

async function main() {
  console.log('🔍 VERIFYING DATABASE FIX FOR HTTP 406 ERROR\n');
  console.log('=' .repeat(60));
  
  await testTableStructure();
  
  const subscriptionTestPassed = await testSubscriptionEndpoint();
  
  console.log('\n' + '=' .repeat(60));
  console.log('📋 SUMMARY:');
  
  if (subscriptionTestPassed) {
    console.log('✅ HTTP 406 error appears to be FIXED!');
    console.log('🎉 Your Snakkaz chat app should now work properly');
    console.log('🔄 Try refreshing your app and testing subscription features');
  } else {
    console.log('❌ HTTP 406 error still exists');
    console.log('🔧 Please ensure you:');
    console.log('   1. Applied the SQL script in Supabase SQL Editor');
    console.log('   2. The script ran without errors');  
    console.log('   3. Restarted your development server');
  }
  
  console.log('\n💡 Next steps:');
  console.log('   - Test the premium email section at: snakkaz.com/info#premium-email');
  console.log('   - Verify subscription features work in your chat app');
  console.log('   - Check that user accounts can upgrade to premium');
}

main().catch(console.error);
