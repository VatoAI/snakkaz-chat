// Test script for Cloudflare CSP fixes
console.log("Testing CSP and CORS fixes...");

// Simulating a window document environment
const mockDocument = {
  head: { appendChild: () => {} },
  createElement: () => ({ 
    setAttribute: () => {}, 
    hasAttribute: () => false,
    removeAttribute: () => {}
  }),
  querySelector: () => null
};

// Mock window
const mockWindow = {
  fetch: () => Promise.resolve({ json: () => Promise.resolve({}) })
};

// Simple test function
async function testCspFixes() {
  try {
    // Import the CSP fixes module
    const { applyAllCspFixes } = require('./src/services/encryption/cspFixes');
    
    // Mock document and window
    global.document = mockDocument;
    global.window = mockWindow;
    
    // Apply fixes
    console.log("Applying CSP fixes...");
    applyAllCspFixes();
    
    console.log("✅ CSP fixes applied successfully!");
    return true;
  } catch (error) {
    console.error("❌ Error testing CSP fixes:", error);
    return false;
  }
}

// Run the test
testCspFixes().then(success => {
  console.log(success ? "All tests passed!" : "Tests failed!");
  process.exit(success ? 0 : 1);
});
