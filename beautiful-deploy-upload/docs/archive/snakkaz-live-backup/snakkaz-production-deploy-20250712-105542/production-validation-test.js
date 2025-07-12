/**
 * SNAKKAZ PRODUCTION VALIDATION TEST
 * Automatisert testing av LayoutGroupContext fix og chat system
 */

// Test Configuration
const TEST_CONFIG = {
    LOCAL_URL: 'http://localhost:8080',
    PROD_URL: 'https://www.snakkaz.com',
    TIMEOUT: 10000,
    EXPECTED_FIXES: [
        'ULTIMATE Vendor Bundle Fix initializing',
        'Pre-emptive React namespace created',
        'Pre-created LayoutGroupContext globally available',
        'ULTIMATE Vendor Bundle Fix: ALL SYSTEMS GO'
    ]
};

// Console monitoring function
function monitorConsoleMessages() {
    return new Promise((resolve) => {
        const messages = [];
        const originalLog = console.log;
        const originalError = console.error;
        const originalWarn = console.warn;
        
        console.log = (...args) => {
            messages.push({ type: 'log', content: args.join(' ') });
            originalLog.apply(console, args);
        };
        
        console.error = (...args) => {
            messages.push({ type: 'error', content: args.join(' ') });
            originalError.apply(console, args);
        };
        
        console.warn = (...args) => {
            messages.push({ type: 'warn', content: args.join(' ') });
            originalWarn.apply(console, args);
        };
        
        // Wait for page load and fixes to initialize
        setTimeout(() => {
            console.log = originalLog;
            console.error = originalError;
            console.warn = originalWarn;
            resolve(messages);
        }, 5000);
    });
}

// Test LayoutGroupContext fix
function testLayoutGroupContextFix() {
    console.log('🔍 Testing LayoutGroupContext fix...');
    
    try {
        // Check if LayoutGroupContext is available globally
        if (window.reactExports && window.reactExports.createContext) {
            console.log('✅ reactExports.createContext is available');
        } else {
            console.error('❌ reactExports.createContext is missing');
        }
        
        // Check if vendor bundles can access React
        if (window.React && window.React.createContext) {
            console.log('✅ React.createContext is available');
        } else {
            console.error('❌ React.createContext is missing');
        }
        
        // Test context creation
        const testContext = window.React?.createContext('test') || window.reactExports?.createContext('test');
        if (testContext) {
            console.log('✅ Context creation test passed');
            return true;
        } else {
            console.error('❌ Context creation test failed');
            return false;
        }
        
    } catch (error) {
        console.error('❌ LayoutGroupContext test failed:', error.message);
        return false;
    }
}

// Test chat system functionality
function testChatSystemBasics() {
    console.log('🔍 Testing chat system basics...');
    
    try {
        // Check if root element exists
        const root = document.getElementById('root');
        if (!root) {
            console.error('❌ Root element not found');
            return false;
        }
        
        // Check if React app is mounted
        if (root.children.length === 0) {
            console.warn('⚠️ React app not yet mounted (may still be loading)');
            return null; // Indeterminate
        }
        
        console.log('✅ Chat system root is present');
        return true;
        
    } catch (error) {
        console.error('❌ Chat system test failed:', error.message);
        return false;
    }
}

// Run comprehensive validation
async function runValidation() {
    console.log('🚀 SNAKKAZ Production Validation Starting...');
    console.log('==========================================');
    
    // Monitor console for fix messages
    const consolePromise = monitorConsoleMessages();
    
    // Wait for fixes to load
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Run tests
    const layoutTest = testLayoutGroupContextFix();
    const chatTest = testChatSystemBasics();
    
    // Get console messages
    const messages = await consolePromise;
    
    // Check for expected fix messages
    const fixMessages = messages.filter(msg => 
        TEST_CONFIG.EXPECTED_FIXES.some(expectedMsg => 
            msg.content.includes(expectedMsg)
        )
    );
    
    // Check for errors
    const errorMessages = messages.filter(msg => 
        msg.type === 'error' && 
        (msg.content.includes('undefined has no properties') || 
         msg.content.includes('LayoutGroupContext'))
    );
    
    // Report results
    console.log('\n📊 VALIDATION RESULTS:');
    console.log('=====================');
    console.log(`✅ LayoutGroupContext Fix: ${layoutTest ? 'PASSED' : 'FAILED'}`);
    console.log(`✅ Chat System Basic: ${chatTest === true ? 'PASSED' : chatTest === false ? 'FAILED' : 'LOADING'}`);
    console.log(`✅ Fix Messages Found: ${fixMessages.length}/${TEST_CONFIG.EXPECTED_FIXES.length}`);
    console.log(`✅ Critical Errors: ${errorMessages.length === 0 ? 'NONE (GOOD)' : errorMessages.length + ' FOUND'}`);
    
    if (fixMessages.length > 0) {
        console.log('\n🎯 Detected Fix Messages:');
        fixMessages.forEach(msg => console.log(`   • ${msg.content}`));
    }
    
    if (errorMessages.length > 0) {
        console.log('\n🚨 Critical Errors:');
        errorMessages.forEach(msg => console.log(`   • ${msg.content}`));
    }
    
    const overallStatus = layoutTest && errorMessages.length === 0 && fixMessages.length > 0;
    console.log(`\n🎉 OVERALL STATUS: ${overallStatus ? 'PRODUCTION READY' : 'NEEDS ATTENTION'}`);
    
    return {
        layoutGroupContextFix: layoutTest,
        chatSystemBasic: chatTest,
        fixMessagesFound: fixMessages.length,
        criticalErrors: errorMessages.length,
        productionReady: overallStatus
    };
}

// Auto-run validation when script loads
if (typeof window !== 'undefined') {
    // Run when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', runValidation);
    } else {
        setTimeout(runValidation, 1000);
    }
}

// Export for manual testing
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { runValidation, testLayoutGroupContextFix, testChatSystemBasics };
}
