/**
 * Chat Presenter
 * 
 * Presents chat data to the UI and handles chat-related interactions.
 * Manages chat display, message lists, and participant information.
 */

import { BasePresenter, View } from './BasePresenter';
import { Chat, ChatType } from '../models/Chat';
import { Message } from '../models/Message';
import { User } from '../models/User';
import { ChatController } from '../controllers/ChatController';
import { MessagePresenter } from './MessagePresenter';

export interface ChatView extends View {
  renderChatList(chats: Chat[]): void;
  renderChat(chat: Chat, messages: Message[]): void;
  renderParticipants(participants: User[]): void;
  showChatStatus(status: 'loading' | 'ready' | 'error', message?: string): void;
  showError(message: string): void;
}

export class ChatPresenter extends BasePresenter<ChatView> {
  constructor(
    private chatController: ChatController,
    private messagePresenter: MessagePresenter
  ) {
    super();
  }
  
  /**
   * Load chats for a user
   * 
   * @param userId - ID of the user
   */
  async loadUserChats(userId: string): Promise<void> {
    if (this.view) {
      this.view.showChatStatus('loading', 'Loading chats...');
    }
    
    try {
      const userChats = this.chatController.getUserChats(userId);
      
      if (this.view) {
        this.view.renderChatList(userChats);
        this.view.showChatStatus('ready');
      }
    } catch (error) {
      console.error("Error loading chats:", error);
      if (this.view) {
        this.view.showChatStatus('error', 'Failed to load chats');
        this.view.showError("Error loading chats: " + (error as Error).message);
      }
    }
  }
  
  /**
   * Load and display a specific chat
   * 
   * @param chatId - ID of the chat to load
   * @param currentUser - Currently logged in user
   */
  async loadChat(chatId: string, currentUser: User): Promise<void> {
    if (this.view) {
      this.view.showChatStatus('loading', 'Loading chat...');
    }
    
    try {
      const chat = this.chatController.getChat(chatId);
      
      if (!chat) {
        if (this.view) {
          this.view.showChatStatus('error', 'Chat not found');
          this.view.showError("Chat not found");
        }
        return;
      }
      
      // Check if user is a participant
      if (!chat.hasParticipant(currentUser.id)) {
        if (this.view) {
          this.view.showChatStatus('error', 'Access denied');
          this.view.showError("You don't have access to this chat");
        }
        return;
      }
      
      // Get messages
      const messages = chat.messages;
      
      // Render the chat
      if (this.view) {
        this.view.renderChat(chat, messages);
        this.view.showChatStatus('ready');
        
        // Load and display messages one by one to allow decryption
        for (const message of messages) {
          // We bypass the view here and use the message presenter directly
          await this.messagePresenter.displayMessage(message, currentUser);
        }
      }
    } catch (error) {
      console.error("Error loading chat:", error);
      if (this.view) {
        this.view.showChatStatus('error', 'Failed to load chat');
        this.view.showError("Error loading chat: " + (error as Error).message);
      }
    }
  }
  
  /**
   * Create a new chat
   * 
   * @param name - Chat name
   * @param participants - User IDs to include
   * @param creator - User creating the chat
   * @param type - Type of chat
   * @param isEncrypted - Whether to enable encryption
   */
  async createNewChat(
    name: string,
    participants: string[],
    creator: User,
    type: ChatType = ChatType.PRIVATE,
    isEncrypted: boolean = true
  ): Promise<Chat | null> {
    try {
      const chat = await this.chatController.createChat(
        name,
        participants,
        creator,
        type,
        isEncrypted
      );
      
      // Refresh the chat list
      this.loadUserChats(creator.id);
      
      return chat;
    } catch (error) {
      console.error("Error creating chat:", error);
      if (this.view) {
        this.view.showError("Failed to create chat: " + (error as Error).message);
      }
      return null;
    }
  }
  
  /**
   * Send a message to a chat
   * 
   * @param chatId - ID of the chat
   * @param content - Message content
   * @param sender - User sending the message
   * @param files - Optional file attachments
   */
  async sendMessage(
    chatId: string,
    content: string,
    sender: User,
    files: File[] = []
  ): Promise<void> {
    try {
      const message = await this.chatController.sendMessage(
        chatId,
        content,
        sender,
        files
      );
      
      // The chat controller already adds the message to the chat
      // We'll just make sure the message is displayed
      await this.messagePresenter.displayMessage(message, sender);
    } catch (error) {
      console.error("Error sending message:", error);
      if (this.view) {
        this.view.showError("Failed to send message: " + (error as Error).message);
      }
    }
  }
  
  /**
   * Format a chat title for display
   * 
   * @param chat - The chat to format title for
   * @param currentUserId - Current user ID
   * @param userMap - Map of user IDs to User objects for looking up names
   * @returns Formatted title string
   */
  formatChatTitle(
    chat: Chat,
    currentUserId: string,
    userMap: Map<string, User>
  ): string {
    // Direct message chat (one-on-one)
    if (chat.type === ChatType.PRIVATE && chat.participants.length === 2) {
      const otherUserId = chat.participants.find(id => id !== currentUserId);
      if (otherUserId && userMap.has(otherUserId)) {
        return userMap.get(otherUserId)!.displayName;
      }
    }
    
    // Use the chat name
    return chat.name;
  }
  
  /**
   * Get a summary of the last message for chat list display
   * 
   * @param chat - The chat to get a summary for
   * @returns Summary string
   */
  getLastMessageSummary(chat: Chat): string {
    const lastMessage = chat.latestMessage;
    
    if (!lastMessage) {
      return "No messages yet";
    }
    
    let prefix = '';
    if (chat.type !== ChatType.PRIVATE) {
      prefix = `${lastMessage.senderName}: `;
    }
    
    let content = lastMessage.isEncrypted ? "🔒 Encrypted message" : lastMessage.content;
    
    // Truncate if needed
    if (content.length > 30) {
      content = content.substring(0, 30) + "...";
    }
    
    return prefix + content;
  }
  
  /**
   * Get chat metadata for display in the UI
   * 
   * @param chat - The chat to get metadata for
   * @param users - Map of user data
   * @returns Object with display metadata
   */
  getChatMetadata(chat: Chat, users: Map<string, User>): any {
    return {
      id: chat.id,
      name: chat.name,
      type: chat.type,
      isEncrypted: chat.isEncrypted,
      participantCount: chat.participants.length,
      lastActivity: chat.updatedAt,
      participantNames: chat.participants
        .map(id => users.get(id)?.displayName || 'Unknown user')
        .join(', ')
    };
  }
}
