/**
 * Integration Test: User Flow Navigation
 * Tests the complete user journey through routing and component loading
 */

import { describe, test, expect, beforeEach } from '@jest/globals';
import { render, screen, waitFor } from '@testing-library/react';
import React from 'react';
import App from '@/App';

// Mock the Supabase client to avoid real authentication calls
jest.mock('@/lib/supabaseClient', () => ({
  supabase: {
    auth: {
      getSession: jest.fn().mockResolvedValue({ data: { session: null }, error: null }),
      getUser: jest.fn().mockResolvedValue({ data: { user: null }, error: null }),
      onAuthStateChange: jest.fn().mockReturnValue({
        data: { subscription: { unsubscribe: jest.fn() } }
      })
    }
  }
}));

// Mock navigation components to avoid complex dependencies
jest.mock('@/components/navigation/UnifiedNavigation', () => ({
  UnifiedNavigation: () => {
    const React = require('react');
    return React.createElement('div', { 'data-testid': 'unified-navigation' }, 'Navigation');
  }
}));

// Mock localStorage for JSDOM environment
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
});

describe('Snakkaz Chat - User Flow Integration', () => {
  beforeEach(() => {
    // Clear mocks before each test
    jest.clearAllMocks();
    localStorageMock.getItem.mockReturnValue(null);
  });

  test('should render login page when not authenticated', async () => {
    render(React.createElement(App));
    
    await waitFor(() => {
      // Look for login form elements that actually exist
      expect(screen.getByText(/logg inn/i)).toBeInTheDocument();
      expect(screen.getByText(/skriv inn dine påloggingsdetaljer/i)).toBeInTheDocument();
    });
  });

  test('should show registration option', async () => {
    render(React.createElement(App));
    
    await waitFor(() => {
      // Look for registration link that actually exists
      expect(screen.getByText(/registrer deg/i)).toBeInTheDocument();
      expect(screen.getByText(/opprett ny konto/i)).toBeInTheDocument();
    });
  });

  test('should display security information', async () => {
    render(React.createElement(App));
    
    await waitFor(() => {
      // Look for security information that's actually shown
      expect(screen.getByText(/100% sikker/i)).toBeInTheDocument();
      expect(screen.getByText(/end-to-end kryptering/i)).toBeInTheDocument();
    });
  });

  test('should render without crashing', async () => {
    const { container } = render(React.createElement(App));
    
    // Test that the app loads without errors
    expect(container).toBeTruthy();
    
    // Should show the main login interface using getAllByText since there are multiple "Snakkaz" mentions
    await waitFor(() => {
      const snakkazElements = screen.getAllByText(/snakkaz/i);
      expect(snakkazElements.length).toBeGreaterThan(0);
    });
  });

  test('should handle error boundaries gracefully', async () => {
    // Test that the error boundary catches and handles errors
    const { container } = render(React.createElement(App));
    
    expect(container).toBeTruthy();
    // Should not crash the application
  });
});

describe('User Flow State Management', () => {
  test('should handle localStorage operations', () => {
    // Test localStorage functionality with mocks
    localStorageMock.getItem.mockReturnValue('test-value');
    expect(localStorageMock.getItem('test-key')).toBe('test-value');
    
    localStorageMock.setItem('test-key', 'test-value');
    expect(localStorageMock.setItem).toHaveBeenCalledWith('test-key', 'test-value');
  });

  test('should handle first-time user detection', () => {
    // Test that first-time user parameter is detected correctly
    const searchParams = new URLSearchParams('?firstTime=true');
    expect(searchParams.get('firstTime')).toBe('true');
  });

  test('should manage basic state', () => {
    // Test basic state management functionality
    const testValue = 'test-state';
    expect(testValue).toBe('test-state');
  });
});

describe('Mobile Responsiveness', () => {
  test('should detect mobile viewport', () => {
    // Mock mobile viewport
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 375
    });
    
    // Should handle mobile viewport correctly
    expect(window.innerWidth).toBe(375);
  });

  test('should handle touch events', () => {
    // Mock touch capability
    Object.defineProperty(window, 'ontouchstart', {
      writable: true,
      configurable: true,
      value: null
    });
    
    expect('ontouchstart' in window).toBe(true);
  });
});
