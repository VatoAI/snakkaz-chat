const puppeteer = require('puppeteer');

async function testSubdomainFunctionality() {
    console.log('🧪 Snakkaz Chat Subdomain JavaScript Functionality Test');
    console.log('=====================================================\n');

    let browser;
    try {
        browser = await puppeteer.launch({
            headless: 'new',
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });

        const testCases = [
            {
                name: 'Main Domain',
                url: 'https://www.snakkaz.com',
                expectedTitle: 'Snakkaz Chat',
                expectedMode: 'main',
                expectedSubdomain: null
            },
            {
                name: 'Dashboard',
                url: 'https://dash.snakkaz.com',
                expectedTitle: 'Snakkaz Chat - Dashboard',
                expectedMode: 'dash',
                expectedSubdomain: 'dash'
            },
            {
                name: 'Business',
                url: 'https://business.snakkaz.com',
                expectedTitle: 'Snakkaz Chat - Business',
                expectedMode: 'business',
                expectedSubdomain: 'business'
            },
            {
                name: 'Documentation',
                url: 'https://docs.snakkaz.com',
                expectedTitle: 'Snakkaz Chat - Documentation',
                expectedMode: 'docs',
                expectedSubdomain: 'docs'
            },
            {
                name: 'Analytics',
                url: 'https://analytics.snakkaz.com',
                expectedTitle: 'Snakkaz Chat - Analytics',
                expectedMode: 'analytics',
                expectedSubdomain: 'analytics'
            },
            {
                name: 'MCP',
                url: 'https://mcp.snakkaz.com',
                expectedTitle: 'Snakkaz Chat - MCP',
                expectedMode: 'mcp',
                expectedSubdomain: 'mcp'
            },
            {
                name: 'Help',
                url: 'https://help.snakkaz.com',
                expectedTitle: 'Snakkaz Chat - Help',
                expectedMode: 'help',
                expectedSubdomain: 'help'
            }
        ];

        let allPassed = true;
        const results = [];

        for (const testCase of testCases) {
            console.log(`🔍 Testing ${testCase.name}...`);
            
            const page = await browser.newPage();
            
            // Set up console logging to capture app logs
            const consoleLogs = [];
            page.on('console', msg => {
                if (msg.text().includes('Snakkaz Chat:')) {
                    consoleLogs.push(msg.text());
                }
            });

            try {
                // Navigate to the page
                await page.goto(testCase.url, { 
                    waitUntil: 'networkidle0',
                    timeout: 15000 
                });

                // Wait a bit for React to initialize and subdomain detection to run
                await page.waitForTimeout(3000);

                // Get the page title
                const actualTitle = await page.title();

                // Get sessionStorage data
                const sessionData = await page.evaluate(() => {
                    return {
                        appMode: sessionStorage.getItem('snakkaz_app_mode'),
                        subdomain: sessionStorage.getItem('snakkaz_subdomain'),
                        timestamp: sessionStorage.getItem('snakkaz_subdomain_timestamp')
                    };
                });

                // Check if the page contains React app
                const hasReactApp = await page.evaluate(() => {
                    return document.querySelector('[data-reactroot]') !== null ||
                           document.querySelector('#root') !== null ||
                           document.body.innerHTML.includes('Snakkaz') ||
                           window.React !== undefined;
                });

                // Analyze results
                const titleMatch = actualTitle === testCase.expectedTitle;
                const modeMatch = sessionData.appMode === testCase.expectedMode;
                const subdomainMatch = sessionData.subdomain === testCase.expectedSubdomain;

                const result = {
                    name: testCase.name,
                    url: testCase.url,
                    success: titleMatch && modeMatch && hasReactApp,
                    details: {
                        title: { expected: testCase.expectedTitle, actual: actualTitle, match: titleMatch },
                        mode: { expected: testCase.expectedMode, actual: sessionData.appMode, match: modeMatch },
                        subdomain: { expected: testCase.expectedSubdomain, actual: sessionData.subdomain, match: subdomainMatch },
                        hasReactApp,
                        consoleLogs
                    }
                };

                results.push(result);

                if (result.success) {
                    console.log(`   ✅ ${testCase.name}: All checks passed!`);
                    console.log(`      Title: "${actualTitle}"`);
                    console.log(`      Mode: ${sessionData.appMode}`);
                    if (sessionData.subdomain) {
                        console.log(`      Subdomain: ${sessionData.subdomain}`);
                    }
                } else {
                    console.log(`   ❌ ${testCase.name}: Some checks failed`);
                    console.log(`      Title: Expected "${testCase.expectedTitle}", got "${actualTitle}"`);
                    console.log(`      Mode: Expected "${testCase.expectedMode}", got "${sessionData.appMode}"`);
                    console.log(`      React App: ${hasReactApp ? 'Found' : 'Not found'}`);
                    allPassed = false;
                }

                if (consoleLogs.length > 0) {
                    console.log(`      Console logs: ${consoleLogs.join(', ')}`);
                }

            } catch (error) {
                console.log(`   ❌ ${testCase.name}: Error - ${error.message}`);
                results.push({
                    name: testCase.name,
                    success: false,
                    error: error.message
                });
                allPassed = false;
            }

            await page.close();
            console.log('');
        }

        // Summary
        console.log('\n📊 Test Summary:');
        console.log('================');
        
        const passed = results.filter(r => r.success).length;
        const total = results.length;
        
        console.log(`✅ Passed: ${passed}/${total}`);
        console.log(`❌ Failed: ${total - passed}/${total}`);
        
        if (allPassed) {
            console.log('\n🎉 All subdomain functionality tests PASSED!');
            console.log('   ✨ JavaScript subdomain detection is working perfectly');
            console.log('   ✨ Document titles are set correctly');
            console.log('   ✨ SessionStorage is storing subdomain data');
            console.log('   ✨ React app is loading on all subdomains');
        } else {
            console.log('\n⚠️ Some tests failed. Check the details above.');
        }

        return { allPassed, results };

    } catch (error) {
        console.error('❌ Test setup error:', error.message);
        return { allPassed: false, error: error.message };
    } finally {
        if (browser) {
            await browser.close();
        }
    }
}

// Run the tests
if (require.main === module) {
    testSubdomainFunctionality()
        .then(({ allPassed }) => {
            process.exit(allPassed ? 0 : 1);
        })
        .catch(error => {
            console.error('Fatal error:', error);
            process.exit(1);
        });
}

module.exports = { testSubdomainFunctionality };
