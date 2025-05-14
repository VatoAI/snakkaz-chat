/**
 * MCP Architecture Integration Module
 * 
 * This file exports the Model-Controller-Presenter components
 * for the Snakkaz E2EE Chat application. Use this as the main
 * entry point when integrating the MCP architecture into your app.
 */

// Models
export { User } from './models/User';
export { Message, MessageAttachment } from './models/Message';
export { Chat, ChatType } from './models/Chat';

// Controllers
export { UserController } from './controllers/UserController';
export { MessageController } from './controllers/MessageController';
export { ChatController } from './controllers/ChatController';

// Presenters
export { BasePresenter, View } from './presenters/BasePresenter';
export { UserPresenter, UserView } from './presenters/UserPresenter';
export { MessagePresenter, MessageView } from './presenters/MessagePresenter';
export { ChatPresenter, ChatView } from './presenters/ChatPresenter';

// Factory for creating the MCP stack
export class MCPFactory {
  /**
   * Create the complete MCP stack with all components initialized and connected
   * @returns Object containing all MCP components
   */
  static createMCPStack() {
    // Create controllers
    const userController = new UserController();
    const messageController = new MessageController();
    const chatController = new ChatController(messageController);
    
    // Create presenters
    const userPresenter = new UserPresenter(userController);
    const messagePresenter = new MessagePresenter(messageController);
    const chatPresenter = new ChatPresenter(chatController, messagePresenter);
    
    return {
      controllers: {
        userController,
        messageController,
        chatController
      },
      presenters: {
        userPresenter,
        messagePresenter,
        chatPresenter
      }
    };
  }
}
