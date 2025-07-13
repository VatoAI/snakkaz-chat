import { ChatService } from '@/services/ChatService';
import { supabase } from '@/integrations/supabase/client';

jest.mock('@/integrations/supabase/client', () => ({
  supabase: {
    from: jest.fn(),
    rpc: jest.fn(),
    auth: {
      getUser: jest.fn(),
    },
  },
}));

const mockSupabase = supabase as jest.Mocked<typeof supabase>;

describe('ChatService', () => {
  let chatService: ChatService;
  
  beforeEach(() => {
    chatService = new ChatService();
    jest.clearAllMocks();
  });

  describe('sendMessage', () => {
    it('should send a text message successfully', async () => {
      const mockInsert = jest.fn();
      const mockSelect = jest.fn();
      const mockSingle = jest.fn().mockResolvedValue({
        data: { id: '123', content: 'Test message' },
        error: null,
      });
      
      mockInsert.mockReturnValue({ select: mockSelect });
      mockSelect.mockReturnValue({ single: mockSingle });
      
      mockSupabase.from.mockReturnValue({
        insert: mockInsert,
      } as any);

      const result = await chatService.sendMessage(
        'Test message',     // content
        'user-456',         // recipientId
        'chat-789',         // chatId
        'text',             // messageType
        undefined,          // fileUrl
        false               // isEncrypted
      );

      expect(mockInsert).toHaveBeenCalledWith({
        content: 'Test message',
        recipient_id: 'user-456',
        chat_id: 'chat-789',
        message_type: 'text',
        is_encrypted: false,
        created_at: expect.any(String),
      });
      
      expect(result).toEqual({
        data: { id: '123', content: 'Test message' },
        error: null,
      });
    });

    it('should handle encrypted messages', async () => {
      const mockInsert = jest.fn().mockResolvedValue({
        data: { id: '123', content: 'encrypted_content' },
        error: null,
      });
      
      mockSupabase.from.mockReturnValue({
        insert: mockInsert,
        select: jest.fn().mockReturnThis(),
        single: jest.fn(),
      } as any);

      await chatService.sendMessage(
        'encrypted_content', // content
        'user-456',          // recipientId  
        'chat-789',          // chatId
        'text',              // messageType
        undefined,           // fileUrl
        true                 // isEncrypted
      );

      expect(mockInsert).toHaveBeenCalledWith({
        content: 'encrypted_content',
        recipient_id: 'user-456',
        chat_id: 'chat-789',
        message_type: 'text',
        is_encrypted: true,
        created_at: expect.any(String),
      });
    });

    it('should handle file messages', async () => {
      const mockInsert = jest.fn().mockResolvedValue({
        data: { id: '123', file_url: 'https://example.com/file.pdf' },
        error: null,
      });
      
      mockSupabase.from.mockReturnValue({
        insert: mockInsert,
        select: jest.fn().mockReturnThis(),
        single: jest.fn(),
      } as any);

      await chatService.sendMessage(
        'File shared',                    // content
        'user-456',                      // recipientId
        'chat-789',                      // chatId  
        'file',                          // messageType
        'https://example.com/file.pdf',  // fileUrl
        false                            // isEncrypted
      );

      expect(mockInsert).toHaveBeenCalledWith({
        content: 'File shared',
        recipient_id: 'user-456',
        chat_id: 'chat-789',
        message_type: 'file',
        file_url: 'https://example.com/file.pdf',
        is_encrypted: false,
        created_at: expect.any(String),
      });
    });
  });

  describe('getMessages', () => {
    it('should retrieve messages for a chat', async () => {
      const mockMessages = [
        { id: '1', content: 'Hello', created_at: '2025-06-08T10:00:00Z' },
        { id: '2', content: 'Hi there', created_at: '2025-06-08T10:01:00Z' },
      ];
      
      const mockSelect = jest.fn().mockReturnValue({
        eq: jest.fn().mockReturnValue({
          order: jest.fn().mockReturnValue({
            limit: jest.fn().mockResolvedValue({
              data: mockMessages,
              error: null,
            }),
          }),
        }),
      });
      
      mockSupabase.from.mockReturnValue({
        select: mockSelect,
      } as any);

      const result = await chatService.getMessages('chat-789', 50);

      expect(mockSelect).toHaveBeenCalledWith('*');
      expect(result).toEqual({
        data: mockMessages,
        error: null,
      });
    });

    it('should handle pagination correctly', async () => {
      const mockSelect = jest.fn().mockReturnValue({
        eq: jest.fn().mockReturnValue({
          order: jest.fn().mockReturnValue({
            limit: jest.fn().mockResolvedValue({
              data: [],
              error: null,
            }),
          }),
        }),
      });
      
      mockSupabase.from.mockReturnValue({
        select: mockSelect,
      } as any);

      await chatService.getMessages('chat-789', 25);

      const orderCall = mockSelect().eq().order;
      const limitCall = orderCall().limit;
      
      expect(limitCall).toHaveBeenCalledWith(25);
    });
  });

  describe('createChat', () => {
    it('should create a new chat successfully', async () => {
      const mockInsert = jest.fn();
      const mockSelect = jest.fn();
      const mockSingle = jest.fn().mockResolvedValue({
        data: { id: 'new-chat-123', name: 'Test Chat' },
        error: null,
      });
      
      mockInsert.mockReturnValue({ select: mockSelect });
      mockSelect.mockReturnValue({ single: mockSingle });
      
      mockSupabase.from.mockReturnValue({
        insert: mockInsert,
      } as any);

      const result = await chatService.createChat({
        name: 'Test Chat',
        participantIds: ['user-1', 'user-2'],
        isGroup: true,
      });

      expect(mockInsert).toHaveBeenCalledWith({
        name: 'Test Chat',
        is_group: true,
        created_by: undefined,
      });
      
      expect(result).toEqual({
        data: { id: 'new-chat-123', name: 'Test Chat' },
        error: null,
      });
    });
  });

  describe('deleteMessage', () => {
    it('should delete a message successfully', async () => {
      const mockDelete = jest.fn().mockResolvedValue({
        data: null,
        error: null,
      });
      
      mockSupabase.from.mockReturnValue({
        delete: jest.fn().mockReturnValue({
          eq: jest.fn().mockResolvedValue({
            data: null,
            error: null,
          }),
        }),
      } as any);

      const result = await chatService.deleteMessage('message-123');

      expect(result.error).toBeNull();
    });

    it('should handle delete errors', async () => {
      const mockError = new Error('Delete failed');
      
      mockSupabase.from.mockReturnValue({
        delete: jest.fn().mockReturnValue({
          eq: jest.fn().mockResolvedValue({
            data: null,
            error: mockError,
          }),
        }),
      } as any);

      const result = await chatService.deleteMessage('message-123');

      expect(result.error).toBe(mockError);
    });
  });
});
