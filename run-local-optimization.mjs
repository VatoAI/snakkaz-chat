#!/usr/bin/env node

import { runLocalSupabaseSetup } from './src/utils/supabase/LocalSupabaseManager.ts';

console.log('🚀 Starting Local Supabase Database Optimization...');
console.log('================================================');

try {
  await runLocalSupabaseSetup();
} catch (error) {
  console.error('❌ Failed to run optimization:', error);
  process.exit(1);
}
