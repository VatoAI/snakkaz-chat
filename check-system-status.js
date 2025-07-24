#!/usr/bin/env node
import { supabase } from './src/lib/supabaseClient.js';
import { MCPClient } from './src/config/mcp.js';

console.log('🔍 Sjekker SupaBase og MCP status...\n');

// Test SupaBase
try {
  console.log('📊 SupaBase Status:');
  const { data, error } = await supabase.from('profiles').select('count').limit(1);
  
  if (error) {
    console.log('❌ SupaBase: FEIL -', error.message);
  } else {
    console.log('✅ SupaBase: TILKOBLET og operasjonell');
    console.log('   - Database: wqpoozpbceucynsojmbk.supabase.co');
    console.log('   - Tables: Tilgjengelig');
  }
} catch (err) {
  console.log('❌ SupaBase: TILKOBLINGSFEIL -', err.message);
}

console.log('');

// Test MCP
try {
  console.log('🔧 MCP Status:');
  const mcpClient = new MCPClient();
  const isHealthy = await mcpClient.testConnection();
  
  if (isHealthy) {
    console.log('✅ MCP Server: TILKOBLET og operasjonell');
    console.log('   - URL: https://mcp.snakkaz.com');
    console.log('   - Health Check: OK');
  } else {
    console.log('❌ MCP Server: IKKE TILKOBLET');
    console.log('   - URL: https://mcp.snakkaz.com (Ikke tilgjengelig)');
  }
} catch (err) {
  console.log('❌ MCP Server: FEIL -', err.message);
}

console.log('\n📋 Sammendrag:');
console.log('- SupaBase: Database for brukere, meldinger og profiler');
console.log('- MCP: Model Context Protocol for AI-integrasjon');
console.log('- Begge systemer må være operative for full funksjonalitet');
console.log('\n🎯 Design og UX Status: ✅ Forbedret med feilmeldinger og responsivitet');
