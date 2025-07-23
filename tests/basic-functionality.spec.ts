import { test, expect } from '@playwright/test';

test.describe('SnakkaZ Chat - Basic Functionality', () => {
  test('should load the main page successfully', async ({ page }) => {
    await page.goto('/');
    
    // Check page loads and has correct title
    await expect(page).toHaveTitle(/SnakkaZ Chat/);
    
    // Check that main content container exists
    await expect(page.locator('#root')).toBeVisible();
  });

  test('should load development environment correctly', async ({ page }) => {
    await page.goto('/');
    
    // Check for loading text in development
    const hasTitle = await page.locator('text=SnakkaZ Beta').isVisible();
    const hasDescription = await page.locator('text=Loading professional chat experience').isVisible();
    
    // In development, at least one of these should be visible
    expect(hasTitle || hasDescription).toBe(true);
  });

  test('should handle CSS and JS loading', async ({ page }) => {
    const responses: Array<{ url: string; status: number; contentType: string | null }> = [];
    
    page.on('response', response => {
      responses.push({
        url: response.url(),
        status: response.status(),
        contentType: response.headers()['content-type'] || null
      });
    });

    await page.goto('/');

    // Check main page loaded successfully
    const htmlResponse = responses.find(r => r.url.includes('localhost:5173') && !r.url.includes('.'));
    expect(htmlResponse?.status).toBe(200);

    // Check CSS file loaded successfully  
    const cssResponse = responses.find(r => r.url.includes('.css'));
    if (cssResponse) {
      expect(cssResponse.status).toBe(200);
    }

    // Check JS file loaded successfully  
    const jsResponse = responses.find(r => r.url.includes('.js') || r.url.includes('.tsx'));
    if (jsResponse) {
      expect(jsResponse.status).toBe(200);
    }
  });

  test('should be responsive on different screen sizes', async ({ page }) => {
    const viewports = [
      { width: 1920, height: 1080, name: 'Desktop' },
      { width: 768, height: 1024, name: 'Tablet' },
      { width: 375, height: 667, name: 'Mobile' }
    ];

    for (const viewport of viewports) {
      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      await page.goto('/');
      
      // Verify key elements are visible
      await expect(page.locator('#root')).toBeVisible();
      
      // Take screenshot for visual comparison
      await page.screenshot({ 
        path: `tests/screenshots/basic-${viewport.name.toLowerCase()}.png`,
        fullPage: true 
      });
    }
  });

  test('should handle page reload gracefully', async ({ page }) => {
    await page.goto('/');
    
    // Initial load
    await expect(page.locator('#root')).toBeVisible();
    
    // Reload page
    await page.reload();
    
    // Should still work after reload
    await expect(page.locator('#root')).toBeVisible();
    await expect(page).toHaveTitle(/SnakkaZ Chat/);
  });
});
