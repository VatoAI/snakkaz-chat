import { test, expect } from '@playwright/test';

/**
 * SnakkaZ Chat - Core Functionality Tests
 * Testing essential chat features across browsers
 */

test.describe('SnakkaZ Chat - Core Features', () => {
  
  test('should load the main page successfully', async ({ page }) => {
    await page.goto('/');
    
    // Wait for React to load and remove loading screen
    await page.waitForSelector('.loading-screen', { state: 'hidden', timeout: 10000 });
    
    // Check if the main app content is visible
    await expect(page.locator('#root')).toBeVisible();
    
    // Verify page title
    await expect(page).toHaveTitle(/SnakkaZ Chat/);
  });

  test('should display professional design elements', async ({ page }) => {
    await page.goto('/');
    
    // Wait for React to load and replace loading screen
    await page.waitForSelector('.loading-screen', { state: 'hidden', timeout: 15000 });
    
    // Check for authentication form (should appear when not logged in)  
    const authForm = page.locator('form, .login-form, [data-testid="auth-form"], input[type="email"], input[type="password"]');
    await expect(authForm.first()).toBeVisible({ timeout: 10000 });
    
    // Verify CSS is loaded by checking computed styles
    const body = page.locator('body');
    const hasStyles = await body.evaluate(el => {
      const computed = getComputedStyle(el);
      return computed.fontFamily.includes('system-ui') || computed.fontFamily.includes('Segoe UI');
    });
    expect(hasStyles).toBe(true);
  });

  test('should show authentication form when not logged in', async ({ page }) => {
    await page.goto('/');
    await page.waitForSelector('.loading-screen', { state: 'hidden', timeout: 10000 });
    
    // Should show auth form
    await expect(page.locator('input[type="email"]')).toBeVisible({ timeout: 15000 });
    await expect(page.locator('input[type="password"]')).toBeVisible();
  });

  test('should handle responsive design on mobile', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    await page.waitForSelector('.loading-screen', { state: 'hidden', timeout: 10000 });
    
    // Verify mobile-friendly layout
    const authForm = page.locator('form, .auth-form, input[type="email"]').first();
    await expect(authForm).toBeVisible({ timeout: 15000 });
    
    // Check if elements are properly sized for mobile
    const input = page.locator('input[type="email"]').first();
    const boundingBox = await input.boundingBox();
    expect(boundingBox?.width).toBeLessThan(400); // Should fit mobile screen
  });

  test('should load CSS and JavaScript assets', async ({ page }) => {
    const responses: any[] = [];
    
    page.on('response', response => {
      responses.push({
        url: response.url(),
        status: response.status(),
        contentType: response.headers()['content-type']
      });
    });
    
    await page.goto('/');
    
    // Check CSS file loaded successfully
    const cssResponse = responses.find(r => r.url.includes('.css'));
    expect(cssResponse?.status).toBe(200);
    expect(cssResponse?.contentType).toContain('text/css');
    
    // Check JS file loaded successfully  
    const jsResponse = responses.find(r => r.url.includes('.js'));
    expect(jsResponse?.status).toBe(200);
    // Note: Content-Type might vary, just check status
  });

  test('should handle loading states gracefully', async ({ page }) => {
    await page.goto('/');
    
    // Wait for loading screen to disappear (it might be very fast)
    await page.waitForSelector('.loading-screen', { state: 'hidden', timeout: 15000 });
    
    // Main content should be visible after loading
    const mainContent = page.locator('#root > *:not(.loading-screen)');
    await expect(mainContent.first()).toBeVisible({ timeout: 5000 });
  });

});
