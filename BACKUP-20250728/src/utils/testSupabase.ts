/**
 * Supabase Configuration Test
 * Tests and validates Supabase connection
 */
import { supabase } from '@/lib/supabaseClient';

export async function testSupabaseConnection() {
  try {
    console.log('🧪 Testing Supabase connection...');
    
    // Test 1: Basic connection
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    console.log('✅ Session check:', session ? 'Active session' : 'No session', sessionError || '');
    
    // Test 2: Database query test (without requiring authentication)
    try {
      const { data, error, count } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });
      
      console.log('✅ Database connection test:', error ? 'Failed' : 'Success');
      console.log('📊 Profiles table exists:', count !== null ? 'Yes' : 'Unknown');
      
      if (error) {
        console.log('❌ Database error:', error.message);
      }
    } catch (dbError) {
      console.log('❌ Database test failed:', dbError);
    }
    
    // Test 3: Auth test
    try {
      const { data: authData, error: authError } = await supabase.auth.getUser();
      console.log('✅ Auth test:', authError ? 'No user' : 'User authenticated');
    } catch (authTestError) {
      console.log('❌ Auth test failed:', authTestError);
    }
    
    return true;
  } catch (error) {
    console.error('❌ Supabase connection test failed:', error);
    return false;
  }
}

// Run test immediately when imported
testSupabaseConnection();
