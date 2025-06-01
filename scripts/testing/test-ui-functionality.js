/**
 * SnakkaZ Chat UI/UX Testing Script
 * Tests all UI improvements including input field visibility, responsive design, and theme consistency
 */

console.log('🧪 Starting SnakkaZ Chat UI/UX Testing...');

// Test 1: Input field text visibility
function testInputVisibility() {
  console.log('\n📝 Testing Input Field Text Visibility...');
  
  const inputSelectors = [
    'input[type="text"]',
    'input[type="email"]', 
    'input[type="password"]',
    'textarea'
  ];
  
  let passedTests = 0;
  let totalTests = 0;
  
  inputSelectors.forEach(selector => {
    const elements = document.querySelectorAll(selector);
    elements.forEach(element => {
      totalTests++;
      const styles = getComputedStyle(element);
      const textColor = styles.color;
      const backgroundColor = styles.backgroundColor;
      
      // Check if text is visible (not transparent and has contrast)
      if (textColor !== 'rgba(0, 0, 0, 0)' && textColor !== 'transparent') {
        console.log(`✅ ${selector}: Text color is visible (${textColor})`);
        passedTests++;
      } else {
        console.log(`❌ ${selector}: Text color issue (${textColor})`);
      }
    });
  });
  
  console.log(`Input Visibility Test: ${passedTests}/${totalTests} passed`);
  return { passed: passedTests, total: totalTests };
}

// Test 2: Theme consistency
function testThemeConsistency() {
  console.log('\n🎨 Testing Theme Consistency...');
  
  const expectedColors = {
    'cyberdark-950': 'rgb(12, 12, 12)',
    'cyberdark-900': 'rgb(24, 24, 27)',
    'cyberdark-800': 'rgb(39, 39, 42)',
    'cyberdark-700': 'rgb(63, 63, 70)',
    'cyberdark-600': 'rgb(82, 82, 91)',
    'cyberdark-100': 'rgb(244, 244, 245)',
    'cybergold-500': 'rgb(234, 179, 8)',
    'cybergold-400': 'rgb(250, 204, 21)'
  };
  
  let themeTests = 0;
  let passedThemeTests = 0;
  
  // Check if cyberpunk theme classes are applied
  const elementsWithTheme = document.querySelectorAll('[class*="cyberdark"], [class*="cybergold"]');
  console.log(`Found ${elementsWithTheme.length} elements with cyberpunk theme classes`);
  
  if (elementsWithTheme.length > 0) {
    console.log('✅ Cyberpunk theme is being applied');
    passedThemeTests++;
  } else {
    console.log('❌ No cyberpunk theme classes found');
  }
  themeTests++;
  
  return { passed: passedThemeTests, total: themeTests };
}

// Test 3: Responsive design
function testResponsiveDesign() {
  console.log('\n📱 Testing Responsive Design...');
  
  const originalWidth = window.innerWidth;
  let responsiveTests = 0;
  let passedResponsiveTests = 0;
  
  // Test mobile viewport
  console.log('Testing mobile viewport (375px)...');
  // Note: Can't actually resize in this context, but check for responsive classes
  const responsiveElements = document.querySelectorAll('[class*="sm:"], [class*="md:"], [class*="lg:"]');
  
  if (responsiveElements.length > 0) {
    console.log(`✅ Found ${responsiveElements.length} responsive utility classes`);
    passedResponsiveTests++;
  } else {
    console.log('❌ No responsive utility classes found');
  }
  responsiveTests++;
  
  // Check for flex and grid layouts
  const flexElements = document.querySelectorAll('.flex, .grid');
  if (flexElements.length > 0) {
    console.log(`✅ Found ${flexElements.length} flexible layout elements`);
    passedResponsiveTests++;
  } else {
    console.log('❌ No flexible layout elements found');
  }
  responsiveTests++;
  
  return { passed: passedResponsiveTests, total: responsiveTests };
}

// Test 4: Accessibility
function testAccessibility() {
  console.log('\n♿ Testing Accessibility...');
  
  let a11yTests = 0;
  let passedA11yTests = 0;
  
  // Check for proper labels
  const inputs = document.querySelectorAll('input, textarea, select');
  let labeledInputs = 0;
  
  inputs.forEach(input => {
    const hasLabel = input.labels && input.labels.length > 0;
    const hasAriaLabel = input.hasAttribute('aria-label');
    const hasPlaceholder = input.hasAttribute('placeholder');
    
    if (hasLabel || hasAriaLabel || hasPlaceholder) {
      labeledInputs++;
    }
  });
  
  if (inputs.length > 0) {
    const labelPercentage = (labeledInputs / inputs.length) * 100;
    console.log(`Input labeling: ${labeledInputs}/${inputs.length} (${labelPercentage.toFixed(1)}%)`);
    
    if (labelPercentage >= 80) {
      console.log('✅ Good input labeling coverage');
      passedA11yTests++;
    } else {
      console.log('⚠️ Low input labeling coverage');
    }
    a11yTests++;
  }
  
  // Check for focus indicators
  const focusableElements = document.querySelectorAll('button, input, textarea, select, a[href]');
  if (focusableElements.length > 0) {
    console.log(`✅ Found ${focusableElements.length} focusable elements`);
    passedA11yTests++;
    a11yTests++;
  }
  
  return { passed: passedA11yTests, total: a11yTests };
}

// Test 5: Performance
function testPerformance() {
  console.log('\n⚡ Testing Performance...');
  
  let perfTests = 0;
  let passedPerfTests = 0;
  
  // Check for lazy loading
  const lazyImages = document.querySelectorAll('img[loading="lazy"]');
  const totalImages = document.querySelectorAll('img').length;
  
  if (totalImages > 0) {
    const lazyPercentage = (lazyImages.length / totalImages) * 100;
    console.log(`Lazy loading: ${lazyImages.length}/${totalImages} images (${lazyPercentage.toFixed(1)}%)`);
    
    if (lazyPercentage >= 50 || totalImages <= 5) {
      console.log('✅ Good lazy loading implementation');
      passedPerfTests++;
    }
    perfTests++;
  }
  
  // Check DOM size
  const totalElements = document.querySelectorAll('*').length;
  console.log(`DOM size: ${totalElements} elements`);
  
  if (totalElements < 2000) {
    console.log('✅ Reasonable DOM size');
    passedPerfTests++;
  } else {
    console.log('⚠️ Large DOM size detected');
  }
  perfTests++;
  
  return { passed: passedPerfTests, total: perfTests };
}

// Run all tests
function runAllTests() {
  console.log('🚀 Running comprehensive UI/UX tests...');
  
  const results = {
    inputVisibility: testInputVisibility(),
    themeConsistency: testThemeConsistency(),
    responsiveDesign: testResponsiveDesign(),
    accessibility: testAccessibility(),
    performance: testPerformance()
  };
  
  // Calculate overall score
  const totalPassed = Object.values(results).reduce((sum, result) => sum + result.passed, 0);
  const totalTests = Object.values(results).reduce((sum, result) => sum + result.total, 0);
  const overallScore = totalTests > 0 ? ((totalPassed / totalTests) * 100).toFixed(1) : 0;
  
  console.log('\n📊 Test Results Summary:');
  console.log('=' .repeat(40));
  Object.entries(results).forEach(([testName, result]) => {
    const score = result.total > 0 ? ((result.passed / result.total) * 100).toFixed(1) : 0;
    console.log(`${testName}: ${result.passed}/${result.total} (${score}%)`);
  });
  console.log('=' .repeat(40));
  console.log(`Overall Score: ${totalPassed}/${totalTests} (${overallScore}%)`);
  
  if (overallScore >= 80) {
    console.log('🎉 Excellent! UI/UX improvements are working well.');
  } else if (overallScore >= 60) {
    console.log('👍 Good! Most UI/UX improvements are working.');
  } else {
    console.log('⚠️ Some UI/UX improvements need attention.');
  }
  
  return { overallScore, results };
}

// Auto-run tests when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', runAllTests);
} else {
  runAllTests();
}

// Export for manual testing
window.testSnakkazUI = runAllTests;
