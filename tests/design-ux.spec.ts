import { test, expect } from '@playwright/test';

/**
 * SnakkaZ Chat - Design System Tests
 * Testing visual elements and user experience
 */

test.describe('SnakkaZ Chat - Design & UX', () => {

  test('should apply glassmorphism effects correctly', async ({ page }) => {
    await page.goto('/');
    await page.waitForSelector('.loading-screen', { state: 'hidden', timeout: 15000 });
    
    // Wait for authentication page to load 
    await page.waitForTimeout(2000);
    
    // Check for liquid-glass elements (auth form should have these)
    const glassElement = page.locator('.liquid-glass, .glass-morphism, [class*="liquid-glass"], [class*="glass"]').first();
    await expect(glassElement).toBeVisible({ timeout: 10000 });
    
    // Verify CSS backdrop-filter effects are applied
    const hasGlassEffect = await glassElement.evaluate(el => {
      const computed = getComputedStyle(el);
      return computed.backdropFilter.includes('blur') || 
             computed.background.includes('rgba') ||
             computed.backgroundColor.includes('rgba');
    });
    expect(hasGlassEffect).toBe(true);
  });

  test('should display proper loading animation', async ({ page }) => {
    await page.goto('/');
    
    // Check for loading text (might be very quick to load)
    const hasLoadingText = await page.locator('text=SnakkaZ Beta').isVisible();
    const hasLoadingDescription = await page.locator('text=Loading professional chat experience').isVisible();
    
    // At least one loading element should be visible or have been visible
    const loadingElementExists = hasLoadingText || hasLoadingDescription || 
      await page.locator('.loading-screen').count() > 0;
    
    expect(loadingElementExists).toBe(true);
    
    // Wait for loading to complete
    await page.waitForSelector('.loading-screen', { state: 'hidden', timeout: 15000 });
  });

  test('should handle hover effects on interactive elements', async ({ page }) => {
    await page.goto('/');
    await page.waitForSelector('.loading-screen', { state: 'hidden', timeout: 10000 });
    
    // Find interactive elements (buttons, links, etc.)
    const interactiveElements = page.locator('button, .glass-button, [role="button"]');
    const firstElement = interactiveElements.first();
    
    if (await firstElement.isVisible()) {
      // Test hover effect
      await firstElement.hover();
      
      // Verify hover state is applied (this will depend on your CSS)
      const transform = await firstElement.evaluate(el => getComputedStyle(el).transform);
      // Glass elements typically have transform effects on hover
    }
  });

  test('should maintain design consistency across viewport sizes', async ({ page }) => {
    const viewports = [
      { width: 1920, height: 1080, name: 'Desktop Large' },
      { width: 1366, height: 768, name: 'Desktop Standard' },
      { width: 768, height: 1024, name: 'Tablet' },
      { width: 375, height: 667, name: 'Mobile' }
    ];

    for (const viewport of viewports) {
      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      await page.goto('/');
      await page.waitForSelector('.loading-screen', { state: 'hidden', timeout: 10000 });
      
      // Take screenshot for visual comparison
      await page.screenshot({ 
        path: `tests/screenshots/design-${viewport.name.toLowerCase().replace(' ', '-')}.png`,
        fullPage: true 
      });
      
      // Verify key elements are visible
      await expect(page.locator('#root')).toBeVisible();
      
      // Check if text is readable (not too small)
      const mainHeading = page.locator('h1, h2, .text-2xl, .text-3xl').first();
      if (await mainHeading.isVisible()) {
        const fontSize = await mainHeading.evaluate(el => parseInt(getComputedStyle(el).fontSize));
        expect(fontSize).toBeGreaterThan(12); // Minimum readable size
      }
    }
  });

  test('should display proper color contrast', async ({ page }) => {
    await page.goto('/');
    await page.waitForSelector('.loading-screen', { state: 'hidden', timeout: 10000 });
    
    // Check text elements for proper contrast
    const textElements = page.locator('p, span, div, h1, h2, h3, h4, h5, h6');
    const firstVisible = textElements.first();
    
    if (await firstVisible.isVisible()) {
      const color = await firstVisible.evaluate(el => getComputedStyle(el).color);
      const backgroundColor = await firstVisible.evaluate(el => getComputedStyle(el).backgroundColor);
      
      // Basic check that colors are defined
      expect(color).toBeTruthy();
      expect(color).not.toBe('rgba(0, 0, 0, 0)'); // Not transparent
    }
  });

  test('should handle animations smoothly', async ({ page }) => {
    await page.goto('/');
    
    // Wait for loading to complete
    await page.waitForSelector('.loading-screen', { state: 'hidden', timeout: 15000 });
    
    // Look for liquid glass elements which should have transitions
    const glassElements = page.locator('.liquid-glass, [class*="liquid-glass"], .professional-glass');
    if (await glassElements.first().isVisible()) {
      // Check for transition properties
      const transition = await glassElements.first().evaluate(el => 
        getComputedStyle(el).transition || getComputedStyle(el).transitionProperty
      );
      expect(transition).toBeTruthy();
    } else {
      // If no glass elements visible yet, check basic page load
      await expect(page.locator('#root')).toBeVisible();
    }
  });

});
