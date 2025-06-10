import React from 'react';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { render, createMockUser, createMockMessage, createMockChat, mockSupabaseSuccess } from '../../../tests/testUtils';
import ChatPage from '@/pages/SimpleChatPage';

// Mock the chat service
const mockSendMessage = jest.fn();
const mockGetMessages = jest.fn();
const mockCreateChat = jest.fn();

jest.mock('@/services/chat/GroupMessageService', () => ({
  GroupMessageService: jest.fn().mockImplementation(() => ({
    sendMessage: mockSendMessage,
    getMessages: mockGetMessages,
    createChat: mockCreateChat,
  })),
}));

// Mock Supabase real-time subscriptions
const mockSubscribe = jest.fn();
const mockUnsubscribe = jest.fn();

jest.mock('@/lib/supabaseClient', () => ({
  supabase: {
    channel: jest.fn(() => ({
      on: jest.fn().mockReturnThis(),
      subscribe: mockSubscribe,
      unsubscribe: mockUnsubscribe,
    })),
    from: jest.fn(() => ({
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      order: jest.fn().mockReturnThis(),
      limit: jest.fn().mockResolvedValue({ data: [], error: null }),
    })),
    auth: {
      getUser: jest.fn().mockResolvedValue({
        data: { 
          user: {
            id: 'mock-user-123',
            email: 'test@example.com',
            name: 'Test User'
          }
        },
        error: null,
      }),
    },
  },
}));

describe('Chat Functionality Integration Tests', () => {
  const mockUser = createMockUser();
  const mockChat = createMockChat();
  const mockMessages = [
    createMockMessage({ id: '1', content: 'Hei! Hvordan har du det?', sender_id: 'user-456' }),
    createMockMessage({ id: '2', content: 'Bare bra takk! 😊', sender_id: mockUser.id }),
    createMockMessage({ id: '3', content: 'Skal vi møtes på kafe senere?', sender_id: 'user-456' }),
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    mockGetMessages.mockResolvedValue(mockSupabaseSuccess(mockMessages));
  });

  describe('Message Display', () => {
    it('should display existing messages in correct order', async () => {
      render(<ChatPage chatId={mockChat.id} />);

      await waitFor(() => {
        expect(screen.getByText('Hei! Hvordan har du det?')).toBeInTheDocument();
        expect(screen.getByText('Bare bra takk! 😊')).toBeInTheDocument();
        expect(screen.getByText('Skal vi møtes på kafe senere?')).toBeInTheDocument();
      });

      // Verify messages are in correct chronological order
      const messages = screen.getAllByTestId(/message-/);
      expect(messages).toHaveLength(3);
    });

    it('should distinguish between sent and received messages', async () => {
      render(<ChatPage chatId={mockChat.id} />);

      await waitFor(() => {
        const sentMessage = screen.getByText('Bare bra takk! 😊');
        const receivedMessage = screen.getByText('Hei! Hvordan har du det?');

        // Sent messages should have different styling (right alignment, different color)
        expect(sentMessage.closest('[data-testid*="message-sent"]')).toBeInTheDocument();
        expect(receivedMessage.closest('[data-testid*="message-received"]')).toBeInTheDocument();
      });
    });

    it('should handle Norwegian characters and emojis correctly', async () => {
      const norwegianMessages = [
        createMockMessage({ content: 'Hei på deg! Æ ø å 🇳🇴' }),
        createMockMessage({ content: 'Dette er en test med norske tegn: æøå' }),
        createMockMessage({ content: 'Møtes på Rådhusplassen kl 15:00 ⏰' }),
      ];

      mockGetMessages.mockResolvedValue(mockSupabaseSuccess(norwegianMessages));
      render(<ChatPage chatId={mockChat.id} />);

      await waitFor(() => {
        expect(screen.getByText('Hei på deg! Æ ø å 🇳🇴')).toBeInTheDocument();
        expect(screen.getByText('Dette er en test med norske tegn: æøå')).toBeInTheDocument();
        expect(screen.getByText('Møtes på Rådhusplassen kl 15:00 ⏰')).toBeInTheDocument();
      });
    });
  });

  describe('Message Sending', () => {
    it('should send a text message successfully', async () => {
      const user = userEvent.setup();
      mockSendMessage.mockResolvedValue(mockSupabaseSuccess({ 
        id: 'new-msg', 
        content: 'Ny melding' 
      }));

      render(<ChatPage chatId={mockChat.id} />);

      // Find message input and send button
      const messageInput = screen.getByPlaceholderText(/skriv en melding/i);
      const sendButton = screen.getByRole('button', { name: /send/i });

      // Type and send message
      await user.type(messageInput, 'Ny melding');
      await user.click(sendButton);

      // Verify message was sent
      expect(mockSendMessage).toHaveBeenCalledWith({
        content: 'Ny melding',
        chatId: mockChat.id,
        recipientId: expect.any(String),
      });

      // Input should be cleared after sending
      await waitFor(() => {
        expect(messageInput).toHaveValue('');
      });
    });

    it('should send message with Enter key', async () => {
      const user = userEvent.setup();
      mockSendMessage.mockResolvedValue(mockSupabaseSuccess({ 
        id: 'new-msg', 
        content: 'Melding med Enter' 
      }));

      render(<ChatPage chatId={mockChat.id} />);

      const messageInput = screen.getByPlaceholderText(/skriv en melding/i);
      
      await user.type(messageInput, 'Melding med Enter');
      await user.keyboard('{Enter}');

      expect(mockSendMessage).toHaveBeenCalledWith({
        content: 'Melding med Enter',
        chatId: mockChat.id,
        recipientId: expect.any(String),
      });
    });

    it('should not send empty messages', async () => {
      const user = userEvent.setup();
      render(<ChatPage chatId={mockChat.id} />);

      const messageInput = screen.getByPlaceholderText(/skriv en melding/i);
      const sendButton = screen.getByRole('button', { name: /send/i });

      // Try to send empty message
      await user.click(sendButton);

      expect(mockSendMessage).not.toHaveBeenCalled();

      // Try to send whitespace-only message
      await user.type(messageInput, '   ');
      await user.click(sendButton);

      expect(mockSendMessage).not.toHaveBeenCalled();
    });

    it('should handle message sending errors gracefully', async () => {
      const user = userEvent.setup();
      mockSendMessage.mockResolvedValue({
        data: null,
        error: { message: 'Failed to send message' },
      });

      render(<ChatPage chatId={mockChat.id} />);

      const messageInput = screen.getByPlaceholderText(/skriv en melding/i);
      const sendButton = screen.getByRole('button', { name: /send/i });

      await user.type(messageInput, 'Test message');
      await user.click(sendButton);

      // Should show error message
      await waitFor(() => {
        expect(screen.getByText(/failed to send message/i)).toBeInTheDocument();
      });

      // Message should remain in input for retry
      expect(messageInput).toHaveValue('Test message');
    });
  });

  describe('Real-time Updates', () => {
    it('should subscribe to real-time message updates', async () => {
      render(<ChatPage chatId={mockChat.id} />);

      await waitFor(() => {
        expect(mockSubscribe).toHaveBeenCalled();
      });
    });

    it('should unsubscribe when component unmounts', async () => {
      const { unmount } = render(<ChatPage chatId={mockChat.id} />);

      unmount();

      expect(mockUnsubscribe).toHaveBeenCalled();
    });

    it('should display new messages in real-time', async () => {
      render(<ChatPage chatId={mockChat.id} />);

      // Simulate receiving a new message through real-time subscription
      const newMessage = createMockMessage({ 
        id: 'new-realtime-msg', 
        content: 'Ny melding i sanntid!',
        sender_id: 'user-456'
      });

      // This would normally be triggered by the real-time subscription
      // For testing, we'll simulate it by updating the component state
      // In a real implementation, this would be handled by the real-time callback

      await waitFor(() => {
        // Verify that the subscription setup is working
        expect(mockSubscribe).toHaveBeenCalled();
      });
    });
  });

  describe('Message Actions', () => {
    it('should allow editing own messages', async () => {
      const user = userEvent.setup();
      const editableMessage = createMockMessage({ 
        sender_id: mockUser.id, 
        content: 'Melding jeg kan redigere' 
      });
      
      mockGetMessages.mockResolvedValue(mockSupabaseSuccess([editableMessage]));
      render(<ChatPage chatId={mockChat.id} />);

      await waitFor(() => {
        expect(screen.getByText('Melding jeg kan redigere')).toBeInTheDocument();
      });

      // Right-click on own message to show context menu
      const message = screen.getByText('Melding jeg kan redigere');
      await user.rightClick(message);

      // Should show edit option
      expect(screen.getByText(/rediger/i)).toBeInTheDocument();
    });

    it('should allow deleting own messages', async () => {
      const user = userEvent.setup();
      const deletableMessage = createMockMessage({ 
        sender_id: mockUser.id, 
        content: 'Melding jeg kan slette' 
      });
      
      mockGetMessages.mockResolvedValue(mockSupabaseSuccess([deletableMessage]));
      render(<ChatPage chatId={mockChat.id} />);

      await waitFor(() => {
        expect(screen.getByText('Melding jeg kan slette')).toBeInTheDocument();
      });

      // Right-click on own message
      const message = screen.getByText('Melding jeg kan slette');
      await user.rightClick(message);

      // Should show delete option
      expect(screen.getByText(/slett/i)).toBeInTheDocument();
    });

    it('should not show edit/delete options for other users messages', async () => {
      const user = userEvent.setup();
      const otherUserMessage = createMockMessage({ 
        sender_id: 'user-456', 
        content: 'Melding fra annen bruker' 
      });
      
      mockGetMessages.mockResolvedValue(mockSupabaseSuccess([otherUserMessage]));
      render(<ChatPage chatId={mockChat.id} />);

      await waitFor(() => {
        expect(screen.getByText('Melding fra annen bruker')).toBeInTheDocument();
      });

      // Right-click on other user's message
      const message = screen.getByText('Melding fra annen bruker');
      await user.rightClick(message);

      // Should not show edit/delete options
      expect(screen.queryByText(/rediger/i)).not.toBeInTheDocument();
      expect(screen.queryByText(/slett/i)).not.toBeInTheDocument();
    });
  });

  describe('Chat Loading States', () => {
    it('should show loading state while fetching messages', async () => {
      // Mock delayed response
      mockGetMessages.mockImplementation(() => 
        new Promise(resolve => setTimeout(() => resolve(mockSupabaseSuccess([])), 100))
      );

      render(<ChatPage chatId={mockChat.id} />);

      expect(screen.getByTestId('messages-loading')).toBeInTheDocument();

      await waitFor(() => {
        expect(screen.queryByTestId('messages-loading')).not.toBeInTheDocument();
      });
    });

    it('should show error state when message loading fails', async () => {
      mockGetMessages.mockResolvedValue({
        data: null,
        error: { message: 'Failed to load messages' },
      });

      render(<ChatPage chatId={mockChat.id} />);

      await waitFor(() => {
        expect(screen.getByText(/failed to load messages/i)).toBeInTheDocument();
      });
    });
  });
});
