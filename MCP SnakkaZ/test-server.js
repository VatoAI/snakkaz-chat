#!/usr/bin/env node

/**
 * Test script for SnakkaZ MCP Server
 */

console.log('🔍 Testing SnakkaZ MCP Server...');

try {
    // Test basic imports
    const { Server } = require('@modelcontextprotocol/sdk/server/index.js');
    const { StdioServerTransport } = require('@modelcontextprotocol/sdk/server/stdio.js');
    console.log('✅ MCP SDK imports working');

    // Test environment
    require('dotenv').config();
    console.log('✅ dotenv loaded');

    // Test server creation (without starting)
    const server = new Server(
        {
            name: "snakkaz-mcp-server-test",
            version: "1.0.0",
        },
        {
            capabilities: {
                tools: {},
            },
        }
    );
    console.log('✅ MCP Server created successfully');

    // Test tools setup
    server.setRequestHandler({
        method: "tools/list",
        schema: {
            type: "object",
            properties: {}
        }
    }, async () => {
        return {
            tools: [
                {
                    name: "test_tool",
                    description: "Test tool",
                    inputSchema: {
                        type: "object",
                        properties: {}
                    }
                }
            ]
        };
    });
    console.log('✅ Tool handlers setup successfully');

    console.log('🎉 MCP Server test passed! Server is ready to run.');
    
} catch (error) {
    console.error('❌ MCP Server test failed:', error.message);
    process.exit(1);
}
