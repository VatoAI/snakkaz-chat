/**
 * FASE 4: Global E2E Test Setup
 * 
 * Global setup for Playwright E2E tests including:
 * - Environment preparation
 * - Test data initialization
 * - Performance monitoring setup
 */

import { chromium, FullConfig } from '@playwright/test';

async function globalSetup(config: FullConfig) {
  console.log('🚀 FASE 4: Starting E2E Test Global Setup');
  
  // Set up test environment
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  try {
    // Warm up the application
    console.log('🔥 Warming up application...');
    await page.goto(config.projects[0].use.baseURL || 'http://127.0.0.1:5173');
    
    // Wait for app to be ready
    await page.waitForLoadState('networkidle');
    
    // Verify core app functionality
    const title = await page.title();
    if (!title.includes('SnakkaZ')) {
      throw new Error('Application not properly loaded');
    }
    
    console.log('✅ Application ready for testing');
    
    // Set up performance monitoring
    await page.addInitScript(() => {
      // Add performance monitoring helpers
      window.__PLAYWRIGHT_TEST_MODE__ = true;
      window.__PERFORMANCE_MARKS__ = {};
      
      // Override console for test debugging
      const originalLog = console.log;
      console.log = (...args) => {
        if (args[0]?.includes?.('E2E_TEST:')) {
          originalLog(...args);
        }
      };
    });
    
    console.log('✅ Performance monitoring initialized');
    
  } catch (error) {
    console.error('❌ Global setup failed:', error);
    throw error;
  } finally {
    await browser.close();
  }
  
  console.log('🎉 FASE 4: E2E Test Global Setup Complete');
}

export default globalSetup;
