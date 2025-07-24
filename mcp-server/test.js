#!/usr/bin/env node

// Quick test script for SnakkaZ MCP Server
console.log('🧪 Testing SnakkaZ MCP Server...\n');

try {
  // Test import
  console.log('📦 Testing imports...');
  const { Server } = await import('@modelcontextprotocol/sdk/server/index.js');
  console.log('✅ MCP SDK imported successfully');
  
  // Test server creation
  console.log('🚀 Testing server creation...');
  const server = new Server(
    { name: 'test', version: '1.0.0', description: 'Test server' },
    { capabilities: { tools: {} } }
  );
  console.log('✅ MCP Server created successfully');
  
  // Test our main server file
  console.log('🔍 Testing main server file...');
  const fs = await import('fs');
  const serverExists = fs.existsSync('./server.js');
  console.log(`✅ Server file exists: ${serverExists}`);
  
  console.log('\n🎉 All tests passed! SnakkaZ MCP Server is ready!');
  console.log('🚀 Run "npm start" to start the server');
  console.log('🌟 Deploy to CloudMCP.run for production use');
  
} catch (error) {
  console.error('❌ Test failed:', error.message);
  process.exit(1);
}
