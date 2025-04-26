import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Check for placeholder values that were not replaced
const isPlaceholderUrl = supabaseUrl?.includes('your-project-id.supabase.co');
const isPlaceholderKey = supabaseAnonKey?.includes('your-anon-key-here');

// Validate required environment variables
if (!supabaseUrl || isPlaceholderUrl) {
  console.error('ERROR: Supabase URL is missing or using placeholder value.');
  console.error('Please update your .env file with your actual Supabase URL from your Supabase dashboard (Project Settings > API).');
}

if (!supabaseAnonKey || isPlaceholderKey) {
  console.error('ERROR: Supabase Anonymous Key is missing or using placeholder value.');
  console.error('Please update your .env file with your actual anon/public key from your Supabase dashboard (Project Settings > API).');
}

// Only create the client if we have valid credentials
const hasValidCredentials = supabaseUrl && supabaseAnonKey && !isPlaceholderUrl && !isPlaceholderKey;

export const supabase = hasValidCredentials 
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
      },
      realtime: {
        params: {
          eventsPerSecond: 10,
        },
      },
    })
  : null;

// Add enhanced logging for debugging
if (supabase) {
  supabase.on('debug', (event) => {
    console.log('Supabase Debug:', event);
  });
} else {
  console.warn('Supabase client was not initialized due to missing or invalid credentials.');
  
  // Create a more visible error message in the browser console
  if (typeof window !== 'undefined') {
    console.error('%c⚠️ Supabase Connection Error ⚠️', 'font-size: 20px; font-weight: bold; color: red;');
    console.error('%cCould not connect to Supabase. Please check your environment variables.', 'font-size: 16px;');
    console.error('%c1. Ensure .env file has valid VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY', 'font-size: 14px;');
    console.error('%c2. Restart your dev server after making changes', 'font-size: 14px;');
  }
}
