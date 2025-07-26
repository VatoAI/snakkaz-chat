/**
 * FASE 4: Performance Testing Suite
 * 
 * Comprehensive performance testing for Snakkaz Chat
 * including load testing, stress testing, and performance validation
 */

import { test, expect } from '@playwright/test';

test.describe('FASE 4: Performance Testing Suite', () => {

  test('Lighthouse Performance Audit', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Run basic performance checks
    const performanceMetrics = await page.evaluate(() => {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      const resources = performance.getEntriesByType('resource');
      
      return {
        domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
        loadComplete: navigation.loadEventEnd - navigation.loadEventStart,
        firstPaint: performance.getEntriesByName('first-paint')[0]?.startTime || 0,
        firstContentfulPaint: performance.getEntriesByName('first-contentful-paint')[0]?.startTime || 0,
        resourceCount: resources.length,
        totalTransferSize: resources.reduce((total: number, resource: any) => 
          total + (resource.transferSize || 0), 0
        )
      };
    });
    
    // Performance assertions
    expect(performanceMetrics.domContentLoaded).toBeLessThan(2000); // 2s
    expect(performanceMetrics.firstContentfulPaint).toBeLessThan(1500); // 1.5s
    expect(performanceMetrics.totalTransferSize).toBeLessThan(5 * 1024 * 1024); // 5MB
    
    console.log('PERFORMANCE_TEST: Metrics', {
      domContentLoaded: `${performanceMetrics.domContentLoaded.toFixed(2)}ms`,
      loadComplete: `${performanceMetrics.loadComplete.toFixed(2)}ms`,
      firstPaint: `${performanceMetrics.firstPaint.toFixed(2)}ms`,
      firstContentfulPaint: `${performanceMetrics.firstContentfulPaint.toFixed(2)}ms`,
      resourceCount: performanceMetrics.resourceCount,
      totalTransferSize: `${(performanceMetrics.totalTransferSize / 1024 / 1024).toFixed(2)}MB`
    });
  });

  test('Memory Usage Monitoring', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Monitor memory usage
    const memoryInfo = await page.evaluate(() => {
      if ('memory' in performance) {
        const memory = (performance as any).memory;
        return {
          usedJSHeapSize: memory.usedJSHeapSize,
          totalJSHeapSize: memory.totalJSHeapSize,
          jsHeapSizeLimit: memory.jsHeapSizeLimit
        };
      }
      return null;
    });
    
    if (memoryInfo) {
      const heapUsagePercent = (memoryInfo.usedJSHeapSize / memoryInfo.totalJSHeapSize) * 100;
      
      // Memory usage should be reasonable
      expect(memoryInfo.usedJSHeapSize).toBeLessThan(100 * 1024 * 1024); // 100MB
      expect(heapUsagePercent).toBeLessThan(80); // Less than 80% heap usage
      
      console.log('PERFORMANCE_TEST: Memory Usage', {
        usedHeap: `${(memoryInfo.usedJSHeapSize / 1024 / 1024).toFixed(2)}MB`,
        totalHeap: `${(memoryInfo.totalJSHeapSize / 1024 / 1024).toFixed(2)}MB`,
        heapLimit: `${(memoryInfo.jsHeapSizeLimit / 1024 / 1024).toFixed(2)}MB`,
        heapUsage: `${heapUsagePercent.toFixed(2)}%`
      });
    }
  });

  test('Bundle Size Analysis', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Analyze bundle sizes
    const bundleAnalysis = await page.evaluate(() => {
      const resources = performance.getEntriesByType('resource');
      const scripts = resources.filter((r: any) => r.name.includes('.js'));
      const styles = resources.filter((r: any) => r.name.includes('.css'));
      
      const scriptSizes = scripts.map((script: any) => ({
        name: script.name.split('/').pop(),
        size: script.transferSize || 0,
        compressed: script.encodedBodySize || 0
      }));
      
      const styleSizes = styles.map((style: any) => ({
        name: style.name.split('/').pop(),
        size: style.transferSize || 0,
        compressed: style.encodedBodySize || 0
      }));
      
      return {
        scripts: scriptSizes,
        styles: styleSizes,
        totalScriptSize: scriptSizes.reduce((total, script) => total + script.size, 0),
        totalStyleSize: styleSizes.reduce((total, style) => total + style.size, 0)
      };
    });
    
    // Bundle size assertions
    expect(bundleAnalysis.totalScriptSize).toBeLessThan(2 * 1024 * 1024); // 2MB for JS
    expect(bundleAnalysis.totalStyleSize).toBeLessThan(500 * 1024); // 500KB for CSS
    
    console.log('PERFORMANCE_TEST: Bundle Analysis', {
      totalJS: `${(bundleAnalysis.totalScriptSize / 1024).toFixed(2)}KB`,
      totalCSS: `${(bundleAnalysis.totalStyleSize / 1024).toFixed(2)}KB`,
      scriptCount: bundleAnalysis.scripts.length,
      styleCount: bundleAnalysis.styles.length
    });
  });

  test('Network Performance Under Load', async ({ page }) => {
    // Simulate slow network
    await page.route('**/*', async route => {
      await new Promise(resolve => setTimeout(resolve, Math.random() * 100)); // 0-100ms delay
      await route.continue();
    });
    
    const startTime = Date.now();
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    const loadTime = Date.now() - startTime;
    
    // Should handle network delays gracefully
    expect(loadTime).toBeLessThan(10000); // 10 seconds max with network simulation
    
    console.log(`PERFORMANCE_TEST: Load time with network simulation: ${loadTime}ms`);
  });

  test('Concurrent User Simulation', async ({ browser }) => {
    const pages = [];
    const loadTimes = [];
    
    // Create multiple pages to simulate concurrent users
    for (let i = 0; i < 5; i++) {
      const context = await browser.newContext();
      pages.push(await context.newPage());
    }
    
    // Load pages concurrently
    const loadPromises = pages.map(async (page, index) => {
      const startTime = Date.now();
      await page.goto('/');
      await page.waitForLoadState('networkidle');
      const loadTime = Date.now() - startTime;
      loadTimes.push(loadTime);
      
      console.log(`PERFORMANCE_TEST: Concurrent user ${index + 1} load time: ${loadTime}ms`);
    });
    
    await Promise.all(loadPromises);
    
    // Cleanup
    for (const page of pages) {
      await page.close();
    }
    
    // All concurrent loads should complete reasonably
    const averageLoadTime = loadTimes.reduce((sum, time) => sum + time, 0) / loadTimes.length;
    expect(averageLoadTime).toBeLessThan(5000); // 5 seconds average
    
    console.log(`PERFORMANCE_TEST: Average concurrent load time: ${averageLoadTime.toFixed(2)}ms`);
  });

  test('CPU Intensive Operations', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Simulate CPU intensive operations
    const cpuTestResult = await page.evaluate(() => {
      const startTime = performance.now();
      
      // Simulate heavy computation
      let result = 0;
      for (let i = 0; i < 1000000; i++) {
        result += Math.random() * Math.sin(i);
      }
      
      const endTime = performance.now();
      return {
        duration: endTime - startTime,
        result: result // To prevent optimization
      };
    });
    
    // CPU operations should not block for too long
    expect(cpuTestResult.duration).toBeLessThan(1000); // 1 second
    
    console.log(`PERFORMANCE_TEST: CPU intensive operation: ${cpuTestResult.duration.toFixed(2)}ms`);
  });

  test('Cache Performance Validation', async ({ page }) => {
    // First load
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Get initial load metrics
    const firstLoadMetrics = await page.evaluate(() => {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      return {
        loadTime: navigation.loadEventEnd - navigation.loadEventStart,
        resourceCount: performance.getEntriesByType('resource').length
      };
    });
    
    // Reload to test cache
    await page.reload();
    await page.waitForLoadState('networkidle');
    
    const secondLoadMetrics = await page.evaluate(() => {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      return {
        loadTime: navigation.loadEventEnd - navigation.loadEventStart,
        resourceCount: performance.getEntriesByType('resource').length
      };
    });
    
    // Second load should be faster due to caching
    expect(secondLoadMetrics.loadTime).toBeLessThanOrEqual(firstLoadMetrics.loadTime);
    
    console.log('PERFORMANCE_TEST: Cache Performance', {
      firstLoad: `${firstLoadMetrics.loadTime.toFixed(2)}ms`,
      secondLoad: `${secondLoadMetrics.loadTime.toFixed(2)}ms`,
      improvement: `${((firstLoadMetrics.loadTime - secondLoadMetrics.loadTime) / firstLoadMetrics.loadTime * 100).toFixed(2)}%`
    });
  });
});
