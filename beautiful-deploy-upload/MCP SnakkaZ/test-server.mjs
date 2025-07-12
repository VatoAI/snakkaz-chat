#!/usr/bin/env node

/**
 * Test SnakkaZ MCP Server
 * Verify that the server responds correctly to MCP requests
 */

import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));

console.log('🧪 Testing SnakkaZ MCP Server...');

// Start MCP server process
const serverPath = join(__dirname, 'build', 'server.js');
const server = spawn('node', [serverPath], {
    stdio: ['pipe', 'pipe', 'pipe']
});

let responseReceived = false;

// Test initialize request
const initRequest = {
    jsonrpc: '2.0',
    id: 1,
    method: 'initialize',
    params: {
        protocolVersion: '2024-11-05',
        capabilities: {},
        clientInfo: {
            name: 'test-client',
            version: '1.0.0'
        }
    }
};

// Handle server responses
server.stdout.on('data', (data) => {
    const response = data.toString();
    console.log('📨 Server response:', response);
    
    try {
        const parsed = JSON.parse(response);
        if (parsed.id === 1 && parsed.result) {
            console.log('✅ Server initialized successfully!');
            responseReceived = true;
            
            // Test list tools
            const toolsRequest = {
                jsonrpc: '2.0',
                id: 2,
                method: 'tools/list'
            };
            
            console.log('🔍 Testing tools list...');
            server.stdin.write(JSON.stringify(toolsRequest) + '\n');
        } else if (parsed.id === 2 && parsed.result) {
            console.log('✅ Tools listed successfully!');
            console.log('🛠️ Available tools:', parsed.result.tools.map(t => t.name));
            server.kill();
        }
    } catch (e) {
        console.log('📄 Raw response (not JSON):', response);
    }
});

server.stderr.on('data', (data) => {
    console.log('📢 Server log:', data.toString());
});

server.on('close', (code) => {
    if (responseReceived) {
        console.log('✅ SnakkaZ MCP Server test completed successfully!');
        process.exit(0);
    } else {
        console.log('❌ Server test failed with code:', code);
        process.exit(1);
    }
});

// Send initialize request
console.log('📤 Sending initialize request...');
server.stdin.write(JSON.stringify(initRequest) + '\n');

// Timeout after 10 seconds
setTimeout(() => {
    if (!responseReceived) {
        console.log('⏱️ Test timeout - server may be working but not responding as expected');
        server.kill();
        process.exit(1);
    }
}, 10000);
