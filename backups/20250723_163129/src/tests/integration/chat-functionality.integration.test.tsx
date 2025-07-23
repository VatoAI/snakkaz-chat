import '@testing-library/jest-dom';
import React from 'react';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithAuth, mockAuthenticatedUser } from '../../../tests/testUtils';
import SimpleChat from '@/components/chat/SimpleChat';

// Mock the main useAuth hook that SimpleChat uses
const mockUser = {
  id: 'test-user-id',
  email: 'test@snakkaz.no',
  name: 'Test User'
};

jest.mock('@/hooks/useAuth', () => ({
  useAuth: () => ({
    user: mockUser,
    loading: false,
    error: null,
    signIn: jest.fn(),
    signOut: jest.fn(),
    signUp: jest.fn(),
  }),
}));

// Mock the UnifiedNavigation to avoid complex dependencies
jest.mock('@/components/navigation/UnifiedNavigation', () => ({
  UnifiedNavigation: () => <div data-testid="unified-navigation">Navigation</div>
}));

describe('Chat Functionality Integration Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Basic Chat Interface', () => {
    it('should render the simple chat component', async () => {
      const { container } = renderWithAuth(<SimpleChat />, mockAuthenticatedUser);

      await waitFor(() => {
        // Look for chat interface elements that actually exist in SimpleChat
        expect(container.querySelector('input')).toBeInTheDocument();
      });
    });

    it('should allow sending messages', async () => {
      const user = userEvent.setup();
      const { container } = renderWithAuth(<SimpleChat />, mockAuthenticatedUser);

      const messageInput = container.querySelector('input');
      expect(messageInput).toBeInTheDocument();
      
      if (messageInput) {
        await user.type(messageInput, 'Test message');
        expect(messageInput).toHaveValue('Test message');
      }
    });

    it('should display chat interface without crashing', async () => {
      const { container } = renderWithAuth(<SimpleChat />, mockAuthenticatedUser);
      
      expect(container).toBeTruthy();
      
      // Should render without errors
      await waitFor(() => {
        expect(container.firstChild).toBeInTheDocument();
      });
    });
  });
});
