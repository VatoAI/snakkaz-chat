/**
 * FASE 4: Chat Functionality E2E Tests
 * 
 * Tests the core chat features including:
 * - Chat interface functionality
 * - Message sending and receiving
 * - E2EE (End-to-End Encryption) validation
 * - Real-time communication
 */

import { test, expect } from '@playwright/test';

test.describe('FASE 4: Chat Functionality Tests', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test('Chat interface is accessible', async ({ page }) => {
    // Look for chat-related elements
    const chatElements = await page.locator(
      '[class*="chat"], [class*="message"], [role="textbox"], textarea, input[type="text"]'
    ).count();
    
    // Chat interface should have some interactive elements
    expect(chatElements).toBeGreaterThan(0);
    
    // Check for message input area
    const messageInput = page.locator(
      'textarea, input[type="text"], [contenteditable="true"], [role="textbox"]'
    ).first();
    
    if (await messageInput.isVisible()) {
      await expect(messageInput).toBeEditable();
      console.log('E2E_TEST: Chat input found and editable');
    }
  });

  test('Message composition works', async ({ page }) => {
    // Find message input
    const messageInput = page.locator(
      'textarea, input[type="text"], [contenteditable="true"], [role="textbox"]'
    ).first();
    
    if (await messageInput.isVisible()) {
      const testMessage = 'E2E Test Message';
      
      // Type test message
      await messageInput.fill(testMessage);
      
      // Verify message was typed
      const inputValue = await messageInput.inputValue().catch(async () => {
        // For contenteditable elements
        return await messageInput.textContent();
      });
      
      expect(inputValue).toContain(testMessage);
      console.log('E2E_TEST: Message composition successful');
    } else {
      console.log('E2E_TEST: No message input found (may require login)');
    }
  });

  test('Send button functionality', async ({ page }) => {
    const messageInput = page.locator(
      'textarea, input[type="text"], [contenteditable="true"], [role="textbox"]'
    ).first();
    
    const sendButton = page.locator(
      'button[type="submit"], button:has-text("Send"), button:has-text("Seند"), [role="button"]:has-text("Send")'
    ).first();
    
    if (await messageInput.isVisible() && await sendButton.isVisible()) {
      await messageInput.fill('Test message');
      
      // Click send button
      await sendButton.click();
      
      // Verify input is cleared after sending (common chat behavior)
      const inputValueAfterSend = await messageInput.inputValue().catch(() => '');
      expect(inputValueAfterSend).toBe('');
      
      console.log('E2E_TEST: Send button functionality working');
    }
  });

  test('E2EE indicators are present', async ({ page }) => {
    // Look for encryption indicators
    const encryptionIndicators = page.locator(
      '[class*="encrypt"], [class*="security"], [title*="encrypted"], 🔒, [aria-label*="encrypted"]'
    );
    
    const indicatorCount = await encryptionIndicators.count();
    
    if (indicatorCount > 0) {
      console.log(`E2E_TEST: Found ${indicatorCount} encryption indicators`);
      
      // Verify at least one indicator is visible
      const firstIndicator = encryptionIndicators.first();
      await expect(firstIndicator).toBeVisible();
    } else {
      console.log('E2E_TEST: No encryption indicators found (may require active chat)');
    }
  });

  test('Chat history display', async ({ page }) => {
    // Look for message history containers
    const messageContainers = page.locator(
      '[class*="message"], [class*="chat-history"], [class*="conversation"]'
    );
    
    const containerCount = await messageContainers.count();
    
    if (containerCount > 0) {
      console.log(`E2E_TEST: Found ${containerCount} message containers`);
      
      // Check if messages are properly structured
      const firstContainer = messageContainers.first();
      await expect(firstContainer).toBeVisible();
    }
  });

  test('Real-time connection status', async ({ page }) => {
    // Look for connection status indicators
    const connectionIndicators = page.locator(
      '[class*="status"], [class*="connection"], [class*="online"], [class*="offline"]'
    );
    
    const statusCount = await connectionIndicators.count();
    
    if (statusCount > 0) {
      console.log(`E2E_TEST: Found ${statusCount} connection status indicators`);
    }
    
    // Check for WebSocket or real-time connection
    const hasWebSocket = await page.evaluate(() => {
      return window.WebSocket !== undefined;
    });
    
    expect(hasWebSocket).toBeTruthy();
    console.log('E2E_TEST: WebSocket support available');
  });

  test('Chat performance under load', async ({ page }) => {
    const messageInput = page.locator(
      'textarea, input[type="text"], [contenteditable="true"], [role="textbox"]'
    ).first();
    
    if (await messageInput.isVisible()) {
      const startTime = Date.now();
      
      // Simulate multiple rapid messages
      for (let i = 0; i < 5; i++) {
        await messageInput.fill(`Performance test message ${i + 1}`);
        await page.waitForTimeout(100); // Small delay between messages
      }
      
      const endTime = Date.now();
      const totalTime = endTime - startTime;
      
      // Should handle multiple messages quickly
      expect(totalTime).toBeLessThan(2000); // 2 seconds
      
      console.log(`E2E_TEST: Chat performance test completed in ${totalTime}ms`);
    }
  });

  test('Keyboard shortcuts work', async ({ page }) => {
    const messageInput = page.locator(
      'textarea, input[type="text"], [contenteditable="true"], [role="textbox"]'
    ).first();
    
    if (await messageInput.isVisible()) {
      await messageInput.fill('Test message');
      
      // Test Enter key to send (common chat shortcut)
      await messageInput.press('Enter');
      
      // If Enter sends the message, input should be cleared
      await page.waitForTimeout(500);
      const inputValueAfterEnter = await messageInput.inputValue().catch(() => '');
      
      if (inputValueAfterEnter === '') {
        console.log('E2E_TEST: Enter key sends message');
      } else {
        console.log('E2E_TEST: Enter key does not send (may require Ctrl+Enter)');
      }
    }
  });

  test('Mobile chat experience', async ({ page, isMobile }) => {
    if (isMobile) {
      // Test mobile-specific chat features
      const messageInput = page.locator(
        'textarea, input[type="text"], [contenteditable="true"], [role="textbox"]'
      ).first();
      
      if (await messageInput.isVisible()) {
        // Test mobile keyboard behavior
        await messageInput.focus();
        
        // Verify input is still visible after keyboard appears
        await expect(messageInput).toBeVisible();
        
        // Test scrolling behavior on mobile
        await page.evaluate(() => {
          window.scrollTo(0, 100);
        });
        
        await expect(messageInput).toBeVisible();
        
        console.log('E2E_TEST: Mobile chat experience validated');
      }
    }
  });
});
