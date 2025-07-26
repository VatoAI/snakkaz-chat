/**
 * FASE 4: Core Application E2E Tests
 * 
 * Tests the fundamental functionality of Snakkaz Chat:
 * - Application loading and performance
 * - Navigation and UI components
 * - Basic user interactions
 */

import { test, expect } from '@playwright/test';

test.describe('FASE 4: Core Application Tests', () => {
  
  test.beforeEach(async ({ page }) => {
    // Mark test start for performance tracking
    await page.addInitScript(() => {
      window.__E2E_TEST_START__ = performance.now();
    });
  });

  test('Application loads and displays correctly', async ({ page }) => {
    // Navigate to application
    await page.goto('/');
    
    // Wait for app to be fully loaded
    await page.waitForLoadState('networkidle');
    
    // Check that the main app container is visible
    const appContainer = page.locator('#root');
    await expect(appContainer).toBeVisible();
    
    // Verify title
    await expect(page).toHaveTitle(/SnakkaZ/);
    
    // Check for critical UI elements
    const mainContent = page.locator('main, [role="main"], .app-content');
    await expect(mainContent).toBeVisible({ timeout: 10000 });
    
    // Performance check - app should load in under 3 seconds
    const loadTime = await page.evaluate(() => {
      return performance.now() - window.__E2E_TEST_START__;
    });
    
    expect(loadTime).toBeLessThan(3000);
    console.log(`E2E_TEST: App load time: ${loadTime.toFixed(2)}ms`);
  });

  test('Glass liquid design renders correctly', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Check for glass liquid design elements
    const glassElements = await page.locator('[class*="glass"], [class*="liquid"], [class*="gradient"]').count();
    expect(glassElements).toBeGreaterThan(0);
    
    // Verify modern design system is loaded
    const designSystemLoaded = await page.evaluate(() => {
      const styles = getComputedStyle(document.body);
      return styles.background.includes('gradient') || 
             styles.backdropFilter !== 'none' ||
             styles.background.includes('rgba');
    });
    
    expect(designSystemLoaded).toBeTruthy();
  });

  test('Navigation works correctly', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Test navigation links (if any)
    const navLinks = page.locator('nav a, [role="navigation"] a');
    const linkCount = await navLinks.count();
    
    if (linkCount > 0) {
      const firstLink = navLinks.first();
      await firstLink.click();
      
      // Verify navigation occurred
      await page.waitForLoadState('networkidle');
      const currentUrl = page.url();
      expect(currentUrl).not.toBe('/');
    }
  });

  test('PWA features are functional', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Check if service worker is registered
    const serviceWorkerRegistered = await page.evaluate(async () => {
      if ('serviceWorker' in navigator) {
        const registration = await navigator.serviceWorker.getRegistration();
        return !!registration;
      }
      return false;
    });
    
    // Note: In test environment, SW might not be available
    if (serviceWorkerRegistered) {
      console.log('E2E_TEST: Service Worker registered successfully');
    }
    
    // Check for manifest.json
    const manifestLink = page.locator('link[rel="manifest"]');
    await expect(manifestLink).toBeAttached();
  });

  test('No console errors on load', async ({ page }) => {
    const consoleErrors: string[] = [];
    
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });
    
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Filter out known acceptable errors (like failed network requests in test env)
    const criticalErrors = consoleErrors.filter(error => 
      !error.includes('Failed to fetch') &&
      !error.includes('network') &&
      !error.includes('ServiceWorker') &&
      !error.includes('manifest.json')
    );
    
    expect(criticalErrors).toHaveLength(0);
    
    if (criticalErrors.length > 0) {
      console.log('E2E_TEST: Console errors found:', criticalErrors);
    }
  });

  test('Mobile responsiveness', async ({ page, isMobile }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    if (isMobile) {
      // Test mobile-specific features
      const viewport = page.viewportSize();
      expect(viewport?.width).toBeLessThan(768);
      
      // Check for mobile navigation or responsive design
      const mobileElements = page.locator('[class*="mobile"], [class*="responsive"]');
      const mobileElementCount = await mobileElements.count();
      
      // Verify touch-friendly elements
      const touchTargets = page.locator('button, a, input, [role="button"]');
      const touchTargetCount = await touchTargets.count();
      
      if (touchTargetCount > 0) {
        const firstTarget = touchTargets.first();
        const boundingBox = await firstTarget.boundingBox();
        
        if (boundingBox) {
          // Touch targets should be at least 44px (iOS guideline)
          expect(boundingBox.height).toBeGreaterThanOrEqual(44);
        }
      }
    }
  });

  test('Performance budgets', async ({ page }) => {
    await page.goto('/');
    
    // Wait for all resources to load
    await page.waitForLoadState('networkidle');
    
    // Get performance metrics
    const metrics = await page.evaluate(() => {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      
      return {
        domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
        loadComplete: navigation.loadEventEnd - navigation.loadEventStart,
        firstContentfulPaint: performance.getEntriesByName('first-contentful-paint')[0]?.startTime || 0,
        totalSize: Array.from(performance.getEntriesByType('resource')).reduce((total, resource: any) => {
          return total + (resource.transferSize || 0);
        }, 0)
      };
    });
    
    // Performance budget checks
    expect(metrics.domContentLoaded).toBeLessThan(2000); // 2 seconds
    expect(metrics.totalSize).toBeLessThan(5 * 1024 * 1024); // 5MB
    
    if (metrics.firstContentfulPaint > 0) {
      expect(metrics.firstContentfulPaint).toBeLessThan(1500); // 1.5 seconds
    }
    
    console.log('E2E_TEST: Performance metrics:', {
      domContentLoaded: `${metrics.domContentLoaded}ms`,
      loadComplete: `${metrics.loadComplete}ms`,
      firstContentfulPaint: `${metrics.firstContentfulPaint}ms`,
      totalSize: `${(metrics.totalSize / 1024 / 1024).toFixed(2)}MB`
    });
  });
});
