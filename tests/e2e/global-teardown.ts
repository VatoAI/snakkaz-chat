/**
 * FASE 4: Global E2E Test Teardown
 * 
 * Global teardown for Playwright E2E tests including:
 * - Cleanup test artifacts
 * - Generate test reports
 * - Performance summary
 */

import { FullConfig } from '@playwright/test';
import fs from 'fs/promises';
import path from 'path';

async function globalTeardown(config: FullConfig) {
  console.log('🧹 FASE 4: Starting E2E Test Global Teardown');
  
  try {
    // Generate test summary report
    const testResultsDir = 'test-results';
    const summaryPath = path.join(testResultsDir, 'e2e-summary.json');
    
    const summary = {
      timestamp: new Date().toISOString(),
      phase: 'FASE 4',
      testType: 'E2E Testing',
      configuration: {
        browsers: config.projects.map(p => p.name),
        baseURL: config.projects[0].use.baseURL,
        parallel: config.fullyParallel,
        workers: config.workers
      },
      completed: true
    };
    
    // Ensure test results directory exists
    try {
      await fs.mkdir(testResultsDir, { recursive: true });
    } catch (error) {
      // Directory already exists
    }
    
    await fs.writeFile(summaryPath, JSON.stringify(summary, null, 2));
    console.log('✅ Test summary generated:', summaryPath);
    
    // Log performance summary
    console.log('📊 E2E Test Performance Summary:');
    console.log('   - Browsers tested:', config.projects.length);
    console.log('   - Parallel execution:', config.fullyParallel ? 'Yes' : 'No');
    console.log('   - Test directory:', config.testDir);
    
  } catch (error) {
    console.error('❌ Global teardown error:', error);
  }
  
  console.log('🎉 FASE 4: E2E Test Global Teardown Complete');
}

export default globalTeardown;
