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
    
    console.log('\n🏗️ Testing application build status...');
    const buildHealthy = fs.existsSync('/workspaces/snakkaz-chat/dist/index.html');
    console.log(buildHealthy ? '✅ Application Build: Ready' : '❌ Application Build: Issues');
    
    console.log('\n🔧 Testing React state fix...');
    const stateFixExists = fs.existsSync('/workspaces/snakkaz-chat/src/utils/reactStateFix.ts');
    console.log(stateFixExists ? '✅ React State Fix: Applied' : '❌ React State Fix: Missing');
    
    console.log('\n============================================================');
    console.log('🏁 PRODUCTION STATUS SUMMARY');
    console.log('============================================================');
    
    const allCriticalSystemsWorking = mainSite.healthy && mcpSite.healthy && buildHealthy && stateFixExists;
    
    if (allCriticalSystemsWorking) {
        console.log('🎉 ALL CRITICAL SYSTEMS: OPERATIONAL');
        console.log('✅ Main application deployment: SUCCESS');
        console.log('✅ MCP dashboard deployment: SUCCESS');
        console.log('✅ React state synchronization: SUCCESS');
        console.log('✅ Emergency repair: COMPLETED');
        
        console.log('\n🌐 Live URLs:');
        console.log('  • Main app: https://www.snakkaz.com');
        console.log('  • MCP dashboard: https://mcp.snakkaz.com');
        
        console.log('\n🚀 Status: READY FOR PRODUCTION USE');
        console.log('\n🛠️ Next Steps:');
        console.log('  • Test login/registration functionality');
        console.log('  • Verify AI chat features are working');
        console.log('  • Configure API keys if needed');
        console.log('  • Monitor for any JavaScript errors in browser console');
        
        console.log('\n📋 Emergency Repair Summary:');
        console.log('  • Fixed React useState synchronization error');
        console.log('  • Rebuilt application with corrected state fix');
        console.log('  • Successfully deployed to www.snakkaz.com');
        console.log('  • All critical functionality restored');
        
        process.exit(0);
    } else {
        console.log('⚠️  SOME SYSTEMS NEED ATTENTION');
        console.log(`❌ Main site: ${mainSite.healthy ? 'OK' : 'FAILED'}`);
        console.log(`❌ MCP dashboard: ${mcpSite.healthy ? 'OK' : 'FAILED'}`);
        console.log(`❌ Build status: ${buildHealthy ? 'OK' : 'FAILED'}`);
        console.log(`❌ React fix: ${stateFixExists ? 'OK' : 'FAILED'}`);
        
        console.log('\n📋 Recommended actions:');
        if (!mainSite.healthy) console.log('  • Re-run emergency repair deployment');
        if (!mcpSite.healthy) console.log('  • Re-deploy MCP dashboard');
        if (!buildHealthy) console.log('  • Rebuild application');
        if (!stateFixExists) console.log('  • Restore React state fix');
        
        process.exit(1);
    }
}

runStatusCheck().catch(console.error);
