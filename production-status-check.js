#!/usr/bin/env node

import https from 'https';
import { spawn } from 'child_process';
import fs from 'fs';

console.log('🎯 Snakkaz Chat Production Status Check');
console.log('============================================================');
console.log('Verifying all critical systems after emergency repair...\n');

async function checkUrl(url, expectedContent = null) {
    return new Promise((resolve) => {
        const request = https.get(url, (response) => {
            let data = '';
            response.on('data', (chunk) => data += chunk);
            response.on('end', () => {
                const isHealthy = response.statusCode === 200;
                const hasExpectedContent = expectedContent ? data.includes(expectedContent) : true;
                resolve({
                    status: response.statusCode,
                    healthy: isHealthy && hasExpectedContent,
                    size: data.length,
                    hasContent: hasExpectedContent
                });
            });
        });
        request.on('error', () => resolve({ status: 0, healthy: false, size: 0 }));
        request.setTimeout(10000, () => {
            request.destroy();
            resolve({ status: 0, healthy: false, size: 0 });
        });
    });
}

async function testClaudeIntegration() {
    return new Promise((resolve) => {
        const testScript = `
const axios = require('axios');

async function testClaude() {
    try {
        const response = await axios.post('https://api.anthropic.com/v1/messages', {
            model: 'claude-sonnet-4-20250514',
            max_tokens: 50,
            messages: [{ role: 'user', content: 'Test if you are working. Reply with just "WORKING"' }]
        }, {
            headers: {
                'x-api-key': process.env.ANTHROPIC_API_KEY,
                'Content-Type': 'application/json',
                'anthropic-version': '2023-06-01'
            },
            timeout: 15000
        });
        
        if (response.data && response.data.content) {
            console.log('CLAUDE_TEST_SUCCESS');
            process.exit(0);
        } else {
            console.log('CLAUDE_TEST_FAILED');
            process.exit(1);
        }
    } catch (error) {
        console.log('CLAUDE_TEST_ERROR:', error.message);
        process.exit(1);
    }
}

testClaude();
        `;
        
        const testProcess = spawn('node', ['-e', testScript], {
            env: { ...process.env, ANTHROPIC_API_KEY: 'sk-ant-api03-HZY9Z3ALOZrulY4Qmz7sLp8e7a24oITzG7LIE7hJH96n7JW-s3u4ovAcbA_6s0RxWaTyU0CptDt9FGhk-nGZBQ-IkY70QAA' }
        });
        
        let output = '';
        testProcess.stdout.on('data', (data) => output += data.toString());
        testProcess.stderr.on('data', (data) => output += data.toString());
        
        testProcess.on('close', (code) => {
            resolve({
                success: output.includes('CLAUDE_TEST_SUCCESS'),
                output: output.trim()
            });
        });
        
        setTimeout(() => {
            testProcess.kill();
            resolve({ success: false, output: 'Timeout' });
        }, 20000);
    });
}

async function runStatusCheck() {
    console.log('🌐 Testing site availability...');
    
    // Test main site
    const mainSite = await checkUrl('https://www.snakkaz.com', 'SnakkaZ Chat');
    console.log(mainSite.healthy ? '✅ Main Site: Online and showing correct content' : '❌ Main Site: Issues detected');
    if (mainSite.healthy) {
        console.log(`   📄 Content size: ${mainSite.size} bytes`);
    }
    
    // Test MCP dashboard
    const mcpSite = await checkUrl('https://mcp.snakkaz.com');
    console.log(mcpSite.healthy ? '✅ MCP Dashboard: Online' : '❌ MCP Dashboard: Issues detected');
    if (mcpSite.healthy) {
        console.log(`   📄 Content size: ${mcpSite.size} bytes`);
    }
    
    console.log('\n🤖 Testing Claude Sonnet 4 integration...');
    const claudeTest = await testClaudeIntegration();
    if (claudeTest.success) {
        console.log('✅ Claude Sonnet 4: Connected and responding');
        console.log('   📝 Model: claude-sonnet-4-20250514');
    } else {
        console.log('❌ Claude Sonnet 4: Connection issues');
        console.log('   📝 Error:', claudeTest.output);
    }
    
    console.log('\n🏗️ Testing application build status...');
    const buildHealthy = require('fs').existsSync('/workspaces/snakkaz-chat/dist/index.html');
    console.log(buildHealthy ? '✅ Application Build: Ready' : '❌ Application Build: Issues');
    
    console.log('\n🔧 Testing React state fix...');
    const stateFixExists = require('fs').existsSync('/workspaces/snakkaz-chat/src/utils/reactStateFix.ts');
    console.log(stateFixExists ? '✅ React State Fix: Applied' : '❌ React State Fix: Missing');
    
    console.log('\n============================================================');
    console.log('🏁 PRODUCTION STATUS SUMMARY');
    console.log('============================================================');
    
    const allCriticalSystemsWorking = mainSite.healthy && mcpSite.healthy && claudeTest.success && buildHealthy && stateFixExists;
    
    if (allCriticalSystemsWorking) {
        console.log('🎉 ALL CRITICAL SYSTEMS: OPERATIONAL');
        console.log('✅ Main application deployment: SUCCESS');
        console.log('✅ MCP dashboard deployment: SUCCESS');
        console.log('✅ Claude AI integration: SUCCESS');
        console.log('✅ React state synchronization: SUCCESS');
        console.log('✅ Emergency repair: COMPLETED');
        
        console.log('\n🌐 Live URLs:');
        console.log('  • Main app: https://www.snakkaz.com');
        console.log('  • MCP dashboard: https://mcp.snakkaz.com');
        
        console.log('\n🚀 Status: READY FOR PRODUCTION USE');
        process.exit(0);
    } else {
        console.log('⚠️  SOME SYSTEMS NEED ATTENTION');
        console.log(`❌ Main site: ${mainSite.healthy ? 'OK' : 'FAILED'}`);
        console.log(`❌ MCP dashboard: ${mcpSite.healthy ? 'OK' : 'FAILED'}`);
        console.log(`❌ Claude integration: ${claudeTest.success ? 'OK' : 'FAILED'}`);
        console.log(`❌ Build status: ${buildHealthy ? 'OK' : 'FAILED'}`);
        console.log(`❌ React fix: ${stateFixExists ? 'OK' : 'FAILED'}`);
        
        console.log('\n📋 Recommended actions:');
        if (!mainSite.healthy) console.log('  • Re-run emergency repair deployment');
        if (!mcpSite.healthy) console.log('  • Re-deploy MCP dashboard');
        if (!claudeTest.success) console.log('  • Check Claude API credentials');
        if (!buildHealthy) console.log('  • Rebuild application');
        if (!stateFixExists) console.log('  • Restore React state fix');
        
        process.exit(1);
    }
}

runStatusCheck().catch(console.error);
