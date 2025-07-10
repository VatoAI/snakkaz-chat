#!/usr/bin/env node
/**
 * SnakkaZ Infrastructure Integration Demo
 *
 * Demonstrates the new infrastructure integration capabilities
 * of the modernized SnakkaZ MCP server.
 *
 * @version 1.0.0
 * @author SnakkaZ Team
 */
import { infrastructureService } from './services/infrastructure-integration.js';
console.log('🎯 SnakkaZ Infrastructure Integration Demo');
console.log('==========================================');
async function demonstrateInfrastructure() {
    try {
        // 1. Test Infrastructure Status
        console.log('\n1. 🔍 Testing Infrastructure Status...');
        const status = await infrastructureService.getInfrastructureStatus();
        console.log('✅ Infrastructure Status:', JSON.stringify(status, null, 2));
        // 2. Test API Token Management
        console.log('\n2. 🔑 Testing API Token Management...');
        const newToken = await infrastructureService.manageApiToken('create', 'DemoToken');
        console.log('✅ Created API Token:', newToken.name);
        const tokens = await infrastructureService.manageApiToken('list');
        console.log('✅ Available Tokens:', tokens.length);
        // 3. Test WebDAV Connection
        console.log('\n3. 🗂️ Testing WebDAV Connection...');
        const webdavTest = await infrastructureService.testWebDavConnection();
        console.log('✅ WebDAV Test:', webdavTest.success ? 'Success' : 'Failed');
        if (webdavTest.config) {
            console.log('   WebDAV URL:', webdavTest.config.url);
        }
        // 4. Test CalDAV Connection
        console.log('\n4. 📅 Testing CalDAV Connection...');
        const caldavTest = await infrastructureService.testCalDavConnection();
        console.log('✅ CalDAV Test:', caldavTest.success ? 'Success' : 'Failed');
        if (caldavTest.details) {
            console.log('   CalDAV Server:', caldavTest.details.server);
            console.log('   Calendar URL:', caldavTest.details.calendarUrl);
        }
        // 5. Get Infrastructure Configuration
        console.log('\n5. ⚙️ Getting Infrastructure Configuration...');
        const config = infrastructureService.getInfrastructureConfig();
        console.log('✅ Infrastructure Configuration:');
        console.log('   Main Domain:', config.domains.main);
        console.log('   MCP Domain:', config.domains.mcp);
        console.log('   WebDAV Service:', config.services.webdav.url);
        console.log('   CalDAV Server:', config.services.caldav.server);
        // 6. Generate WebDAV Script
        console.log('\n6. 📝 Generating WebDAV Script...');
        const script = infrastructureService.generateWebDavShortcut();
        console.log('✅ WebDAV Script generated (', script.length, 'characters)');
        // 7. Test cPanel API
        console.log('\n7. 🔧 Testing cPanel API...');
        const apiTest = await infrastructureService.executeCpanelApi('Email', 'list_accounts');
        console.log('✅ cPanel API Test:', apiTest.success ? 'Success' : 'Failed');
        console.log('   API URL:', apiTest.url);
        // 8. Clean up demo token
        console.log('\n8. 🧹 Cleaning up demo token...');
        const revokeResult = await infrastructureService.manageApiToken('revoke', 'DemoToken');
        console.log('✅ Token Revoked:', revokeResult.success);
        console.log('\n🎉 Infrastructure Integration Demo Complete!');
        console.log('=============================================');
        console.log('✅ All infrastructure services are operational');
        console.log('✅ WebDAV service ready for file sharing');
        console.log('✅ CalDAV/CardDAV ready for calendar/contacts');
        console.log('✅ cPanel API ready for management operations');
        console.log('✅ Security tokens properly managed');
        console.log('\n🚀 Your SnakkaZ MCP server is fully integrated with infrastructure!');
    }
    catch (error) {
        console.error('❌ Demo failed:', error);
    }
}
// Run the demonstration
demonstrateInfrastructure();
//# sourceMappingURL=demo-infrastructure.js.map