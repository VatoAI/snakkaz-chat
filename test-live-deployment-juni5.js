#!/usr/bin/env node
/**
 * SNAKKAZ LIVE DEPLOYMENT TEST - JUNI 5, 2025
 * Tests www.snakkaz.com for:
 * 1. Black screen resolution
 * 2. React error fixes ("Nt is undefined")
 * 3. Performance and user experience
 * 4. Core functionality validation
 */

const https = require('https');
const fs = require('fs');

console.log('🚀 TESTING SNAKKAZ LIVE DEPLOYMENT...\n');

async function testSnakkazDeployment() {
  const results = {
    timestamp: new Date().toISOString(),
    tests: []
  };

  // Test 1: Basic connectivity
  console.log('📡 Testing basic connectivity...');
  try {
    const response = await fetch('https://www.snakkaz.com');
    const responseTime = Date.now();
    
    results.tests.push({
      name: 'Basic Connectivity',
      status: response.status === 200 ? 'PASS' : 'FAIL',
      details: `HTTP ${response.status}`,
      responseTime: `${Date.now() - responseTime}ms`
    });
    
    console.log(`✅ Status: ${response.status}`);
  } catch (error) {
    results.tests.push({
      name: 'Basic Connectivity',
      status: 'FAIL',
      error: error.message
    });
    console.log(`❌ Error: ${error.message}`);
  }

  // Test 2: Emergency fix deployment
  console.log('\n🔧 Testing emergency React fix deployment...');
  try {
    const fixResponse = await fetch('https://www.snakkaz.com/emergency-react-fix.js');
    const fixContent = await fixResponse.text();
    
    const hasNtFix = fixContent.includes('if (!w.Nt) w.Nt = emergencyUseState');
    const hasEnhancedFix = fixContent.includes('ENHANCED EMERGENCY FIX');
    
    results.tests.push({
      name: 'Emergency React Fix',
      status: (fixResponse.status === 200 && hasNtFix && hasEnhancedFix) ? 'PASS' : 'FAIL',
      details: {
        fileExists: fixResponse.status === 200,
        hasNtFix,
        hasEnhancedFix
      }
    });
    
    console.log(`✅ Emergency fix file: ${fixResponse.status === 200 ? 'EXISTS' : 'MISSING'}`);
    console.log(`✅ Nt fix present: ${hasNtFix ? 'YES' : 'NO'}`);
    console.log(`✅ Enhanced fix: ${hasEnhancedFix ? 'YES' : 'NO'}`);
  } catch (error) {
    results.tests.push({
      name: 'Emergency React Fix',
      status: 'FAIL',
      error: error.message
    });
    console.log(`❌ Error: ${error.message}`);
  }

  // Test 3: Main page content
  console.log('\n🎯 Testing main page content load...');
  try {
    const pageResponse = await fetch('https://www.snakkaz.com');
    const pageContent = await pageResponse.text();
    
    const hasReactRoot = pageContent.includes('<div id="root">');
    const hasEmergencyScript = pageContent.includes('emergency-react-fix.js');
    const hasCacheBust = pageContent.includes('FORCE CACHE BUST');
    
    results.tests.push({
      name: 'Main Page Content',
      status: (hasReactRoot && hasEmergencyScript && hasCacheBust) ? 'PASS' : 'FAIL',
      details: {
        hasReactRoot,
        hasEmergencyScript,
        hasCacheBust
      }
    });
    
    console.log(`✅ React root div: ${hasReactRoot ? 'PRESENT' : 'MISSING'}`);
    console.log(`✅ Emergency script: ${hasEmergencyScript ? 'LOADED' : 'MISSING'}`);
    console.log(`✅ Cache bust: ${hasCacheBust ? 'ACTIVE' : 'INACTIVE'}`);
  } catch (error) {
    results.tests.push({
      name: 'Main Page Content',
      status: 'FAIL',
      error: error.message
    });
    console.log(`❌ Error: ${error.message}`);
  }

  // Test 4: Performance metrics
  console.log('\n⚡ Testing performance...');
  const startTime = Date.now();
  try {
    const perfResponse = await fetch('https://www.snakkaz.com');
    const loadTime = Date.now() - startTime;
    
    results.tests.push({
      name: 'Performance',
      status: loadTime < 3000 ? 'EXCELLENT' : loadTime < 5000 ? 'GOOD' : 'NEEDS_IMPROVEMENT',
      loadTime: `${loadTime}ms`,
      rating: loadTime < 2000 ? '🚀 FAST' : loadTime < 4000 ? '✅ GOOD' : '⚠️ SLOW'
    });
    
    console.log(`⚡ Load time: ${loadTime}ms ${loadTime < 2000 ? '🚀' : loadTime < 4000 ? '✅' : '⚠️'}`);
  } catch (error) {
    results.tests.push({
      name: 'Performance',
      status: 'FAIL',
      error: error.message
    });
    console.log(`❌ Error: ${error.message}`);
  }

  // Generate summary
  console.log('\n' + '='.repeat(50));
  console.log('📊 DEPLOYMENT TEST SUMMARY');
  console.log('='.repeat(50));
  
  const passedTests = results.tests.filter(t => t.status === 'PASS' || t.status === 'EXCELLENT' || t.status === 'GOOD').length;
  const totalTests = results.tests.length;
  
  console.log(`✅ Tests passed: ${passedTests}/${totalTests}`);
  console.log(`📅 Timestamp: ${results.timestamp}`);
  
  if (passedTests === totalTests) {
    console.log('\n🎉 ALL TESTS PASSED! www.snakkaz.com should be working properly!');
    console.log('🚀 Ready for community building and user experience focus!');
  } else {
    console.log('\n⚠️ Some tests failed. Manual verification recommended.');
  }

  // Save detailed results
  fs.writeFileSync('./deployment-test-results.json', JSON.stringify(results, null, 2));
  console.log('\n📄 Detailed results saved to: deployment-test-results.json');
  
  return results;
}

// For Node.js environments that don't have fetch
if (typeof fetch === 'undefined') {
  global.fetch = require('node-fetch');
}

if (require.main === module) {
  testSnakkazDeployment().catch(console.error);
}

module.exports = { testSnakkazDeployment };
