/**
 * Quick CSP and React Test Script
 * Tests that our fixes are working correctly
 */

console.log('🧪 Running SnakkaZ Beta tests...');

// Test 1: Check if Google Fonts CSP is working
function testGoogleFonts() {
  const fontLink = document.querySelector('link[href*="fonts.googleapis.com"]');
  if (fontLink) {
    console.log('✅ Google Fonts link found:', fontLink.href);
  } else {
    console.log('⚠️ No Google Fonts link found');
  }
}

// Test 2: Check if React globals are available
function testReactGlobals() {
  if (window.React && window.reactExports) {
    console.log('✅ React globals available:', {
      React: !!window.React,
      reactExports: !!window.reactExports,
      createContext: !!window.React.createContext
    });
  } else {
    console.log('⚠️ React globals missing');
  }
}

// Test 3: Check CSP meta tag
function testCSPMetaTag() {
  const cspMeta = document.querySelector('meta[http-equiv="Content-Security-Policy"]');
  if (cspMeta) {
    const content = cspMeta.getAttribute('content');
    const hasGoogleFonts = content.includes('fonts.googleapis.com');
    console.log('✅ CSP meta tag found');
    console.log('✅ Google Fonts in CSP:', hasGoogleFonts);
  } else {
    console.log('⚠️ No CSP meta tag found');
  }
}

// Test 4: Check for console errors
function testConsoleErrors() {
  const originalError = console.error;
  let errorCount = 0;
  
  console.error = function(...args) {
    errorCount++;
    originalError.apply(console, args);
  };
  
  setTimeout(() => {
    console.error = originalError;
    if (errorCount === 0) {
      console.log('✅ No console errors detected in last 3 seconds');
    } else {
      console.log(`⚠️ ${errorCount} console errors detected`);
    }
  }, 3000);
}

// Run all tests
setTimeout(() => {
  console.log('\n🧪 SNAKKAZ BETA TEST RESULTS:');
  console.log('================================');
  testGoogleFonts();
  testReactGlobals();
  testCSPMetaTag();
  testConsoleErrors();
  console.log('================================');
  console.log('✅ SnakkaZ Beta testing complete!');
}, 1000);

export { testGoogleFonts, testReactGlobals, testCSPMetaTag, testConsoleErrors };
