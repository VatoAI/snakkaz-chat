const fs = require('fs');
const path = require('path');

// Define performance budgets
const BUDGET = {
  // Maximum bundle size in KB
  totalBundleSize: 300,
  mainBundleSize: 120,
  vendorBundleSize: 200,
  
  // Maximum media asset size in KB
  maxImageSize: 200,
  totalImagesSize: 1000,
  
  // Maximum API response time in ms
  apiResponseTime: 300,
  
  // Maximum component render time in ms
  componentRenderTime: 16, // 1 frame @ 60fps
  
  // First paint metrics in ms
  firstContentfulPaint: 1000,
  timeToInteractive: 3000,
};

// Function to analyze bundle sizes
async function analyzeBundles() {
  console.log('Analyzing bundle sizes...');
  
  try {
    if (!fs.existsSync('dist')) {
      console.log('No dist directory found. Skipping bundle analysis.');
      return;
    }
    
    let totalSize = 0;
    let mainSize = 0;
    let vendorSize = 0;
    
    // Scan the dist directory for JS files
    const files = fs.readdirSync('dist/assets');
    
    files.forEach(file => {
      if (file.endsWith('.js')) {
        const stats = fs.statSync(path.join('dist/assets', file));
        const sizeKB = stats.size / 1024;
        
        totalSize += sizeKB;
        
        if (file.includes('index') || file.includes('main')) {
          mainSize += sizeKB;
        } else if (file.includes('vendor') || file.includes('chunk')) {
          vendorSize += sizeKB;
        }
      }
    });
    
    // Check if we're exceeding budgets
    const budgetResults = {
      totalBundle: {
        actual: totalSize.toFixed(2),
        budget: BUDGET.totalBundleSize,
        passed: totalSize <= BUDGET.totalBundleSize
      },
      mainBundle: {
        actual: mainSize.toFixed(2),
        budget: BUDGET.mainBundleSize,
        passed: mainSize <= BUDGET.mainBundleSize
      },
      vendorBundle: {
        actual: vendorSize.toFixed(2),
        budget: BUDGET.vendorBundleSize,
        passed: vendorSize <= BUDGET.vendorBundleSize
      }
    };
    
    console.log('Bundle size budget results:');
    console.log(JSON.stringify(budgetResults, null, 2));
    
    // Write the results to a file
    fs.writeFileSync('performance-budget-results.json', JSON.stringify({
      timestamp: new Date().toISOString(),
      bundleSizes: budgetResults
    }, null, 2));
    
  } catch (err) {
    console.error('Error analyzing bundles:', err);
  }
}

// Run the analysis
analyzeBundles();
