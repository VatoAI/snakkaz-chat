#!/usr/bin/env node

/**
 * SnakkaZ MCP Pre-Deploy Test Suite
 * Comprehensive testing before live deployment
 */

import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

const __dirname = dirname(fileURLToPath(import.meta.url));

console.log('🚀 SnakkaZ MCP Pre-Deploy Test Suite');
console.log('====================================');

let testsPassed = 0;
let testsFailed = 0;

function logTest(name, success, details = '') {
    if (success) {
        console.log(`✅ ${name}`);
        if (details) console.log(`   ${details}`);
        testsPassed++;
    } else {
        console.log(`❌ ${name}`);
        if (details) console.log(`   ${details}`);
        testsFailed++;
    }
}

async function runTest(name, testFn) {
    console.log(`\n🧪 Testing: ${name}`);
    try {
        const result = await testFn();
        logTest(name, true, result);
        return true;
    } catch (error) {
        logTest(name, false, error.message);
        return false;
    }
}

// Test 1: Verify build files exist
async function testBuildFiles() {
    const buildPath = join(__dirname, 'build', 'server.js');
    if (!fs.existsSync(buildPath)) {
        throw new Error('Build file not found: ' + buildPath);
    }
    return 'Build files exist and accessible';
}

// Test 2: MCP Server Initialization
async function testMCPInitialization() {
    return new Promise((resolve, reject) => {
        const serverPath = join(__dirname, 'build', 'server.js');
        const server = spawn('node', [serverPath], {
            stdio: ['pipe', 'pipe', 'pipe']
        });

        let initialized = false;
        const timeout = setTimeout(() => {
            server.kill();
            if (!initialized) {
                reject(new Error('Server initialization timeout'));
            }
        }, 5000);

        const initRequest = {
            jsonrpc: '2.0',
            id: 1,
            method: 'initialize',
            params: {
                protocolVersion: '2024-11-05',
                capabilities: {},
                clientInfo: { name: 'test-client', version: '1.0.0' }
            }
        };

        server.stdout.on('data', (data) => {
            try {
                const response = JSON.parse(data.toString());
                if (response.id === 1 && response.result) {
                    initialized = true;
                    clearTimeout(timeout);
                    server.kill();
                    resolve('Server initialized successfully');
                }
            } catch (e) {
                // Ignore non-JSON responses
            }
        });

        server.stdin.write(JSON.stringify(initRequest) + '\n');
    });
}

// Test 3: Tools List
async function testToolsList() {
    return new Promise((resolve, reject) => {
        const serverPath = join(__dirname, 'build', 'server.js');
        const server = spawn('node', [serverPath], {
            stdio: ['pipe', 'pipe', 'pipe']
        });

        let toolsListed = false;
        const timeout = setTimeout(() => {
            server.kill();
            if (!toolsListed) {
                reject(new Error('Tools list timeout'));
            }
        }, 5000);

        let initialized = false;

        server.stdout.on('data', (data) => {
            try {
                const response = JSON.parse(data.toString());
                
                if (response.id === 1 && response.result && !initialized) {
                    initialized = true;
                    // Send tools list request
                    const toolsRequest = {
                        jsonrpc: '2.0',
                        id: 2,
                        method: 'tools/list'
                    };
                    server.stdin.write(JSON.stringify(toolsRequest) + '\n');
                } else if (response.id === 2 && response.result) {
                    const tools = response.result.tools;
                    if (tools && tools.length >= 3) {
                        toolsListed = true;
                        clearTimeout(timeout);
                        server.kill();
                        resolve(`Found ${tools.length} tools: ${tools.map(t => t.name).join(', ')}`);
                    }
                }
            } catch (e) {
                // Ignore non-JSON responses
            }
        });

        // Initialize first
        const initRequest = {
            jsonrpc: '2.0',
            id: 1,
            method: 'initialize',
            params: {
                protocolVersion: '2024-11-05',
                capabilities: {},
                clientInfo: { name: 'test-client', version: '1.0.0' }
            }
        };
        server.stdin.write(JSON.stringify(initRequest) + '\n');
    });
}

// Test 4: Tool Execution - get_chat_status
async function testChatStatus() {
    return new Promise((resolve, reject) => {
        const serverPath = join(__dirname, 'build', 'server.js');
        const server = spawn('node', [serverPath], {
            stdio: ['pipe', 'pipe', 'pipe']
        });

        let executed = false;
        const timeout = setTimeout(() => {
            server.kill();
            if (!executed) {
                reject(new Error('Chat status execution timeout'));
            }
        }, 5000);

        let step = 0;

        server.stdout.on('data', (data) => {
            try {
                const response = JSON.parse(data.toString());
                
                if (response.id === 1 && response.result && step === 0) {
                    step = 1;
                    // Send tool call
                    const toolCall = {
                        jsonrpc: '2.0',
                        id: 2,
                        method: 'tools/call',
                        params: {
                            name: 'get_chat_status',
                            arguments: {}
                        }
                    };
                    server.stdin.write(JSON.stringify(toolCall) + '\n');
                } else if (response.id === 2 && response.result && step === 1) {
                    executed = true;
                    clearTimeout(timeout);
                    server.kill();
                    resolve('Chat status tool executed successfully');
                }
            } catch (e) {
                // Ignore non-JSON responses
            }
        });

        // Initialize first
        const initRequest = {
            jsonrpc: '2.0',
            id: 1,
            method: 'initialize',
            params: {
                protocolVersion: '2024-11-05',
                capabilities: {},
                clientInfo: { name: 'test-client', version: '1.0.0' }
            }
        };
        server.stdin.write(JSON.stringify(initRequest) + '\n');
    });
}

// Test 5: Environment Variables
async function testEnvironmentVariables() {
    const requiredEnvVars = [
        'SNAKKAZ_API_URL',
        'SNAKKAZ_DB_URL'
    ];
    
    const missing = [];
    for (const envVar of requiredEnvVars) {
        if (!process.env[envVar]) {
            missing.push(envVar);
        }
    }
    
    if (missing.length > 0) {
        throw new Error(`Missing environment variables: ${missing.join(', ')}`);
    }
    
    return `All required environment variables present`;
}

// Test 6: Package Dependencies
async function testDependencies() {
    const packagePath = join(__dirname, 'package.json');
    if (!fs.existsSync(packagePath)) {
        throw new Error('package.json not found');
    }
    
    const pkg = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
    const requiredDeps = [
        '@modelcontextprotocol/sdk',
        'dotenv'
    ];
    
    const missing = [];
    for (const dep of requiredDeps) {
        if (!pkg.dependencies || !pkg.dependencies[dep]) {
            missing.push(dep);
        }
    }
    
    if (missing.length > 0) {
        throw new Error(`Missing dependencies: ${missing.join(', ')}`);
    }
    
    return `All required dependencies present`;
}

// Test 7: VS Code Configuration
async function testVSCodeConfig() {
    const configPath = join(__dirname, '..', '.vscode', 'settings.json');
    if (!fs.existsSync(configPath)) {
        throw new Error('VS Code settings.json not found');
    }
    
    const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
    if (!config['mcp.servers'] || !config['mcp.servers']['snakkaz-mcp-server']) {
        throw new Error('SnakkaZ MCP server not configured in VS Code settings');
    }
    
    return 'VS Code MCP configuration present';
}

// Main test runner
async function runAllTests() {
    console.log('Starting comprehensive pre-deploy tests...\n');
    
    await runTest('Build Files Exist', testBuildFiles);
    await runTest('MCP Server Initialization', testMCPInitialization);
    await runTest('Tools List', testToolsList);
    await runTest('Chat Status Tool', testChatStatus);
    await runTest('Environment Variables', testEnvironmentVariables);
    await runTest('Package Dependencies', testDependencies);
    await runTest('VS Code Configuration', testVSCodeConfig);
    
    console.log('\n' + '='.repeat(50));
    console.log(`📊 Test Results: ${testsPassed} passed, ${testsFailed} failed`);
    
    if (testsFailed === 0) {
        console.log('🎉 All tests passed! Ready for live deploy!');
        console.log('\n🚀 Next steps:');
        console.log('1. Deploy MCP integration: ./deploy-mcp-integration.sh');
        console.log('2. Test with GitHub Copilot: @snakkaz-mcp-server get_chat_status');
        console.log('3. Install additional MCP servers: ./setup-mcp-integration.sh');
        process.exit(0);
    } else {
        console.log('❌ Some tests failed. Please fix issues before deploy.');
        process.exit(1);
    }
}

// Run tests
runAllTests().catch(error => {
    console.error('💥 Test suite crashed:', error);
    process.exit(1);
});
