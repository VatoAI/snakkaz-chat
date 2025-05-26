/**
 * Chat Model
 * 
 * Represents a chat conversation in the Snakkaz application, with end-to-end encryption support.
 * A chat contains the participants, messages, and encryption configuration.
 */

import { Message } from './Message';

export enum ChatType {
  PRIVATE = 'private',
  GROUP = 'group',
  CHANNEL = 'channel'
}

export class Chat {
  /**
   * The list of messages in this chat
   */
  private _messages: Message[] = [];

  /**
   * Create a new chat
   * 
   * @param id - Unique identifier for the chat
   * @param name - The name/title of the chat 
   * @param participants - User IDs of chat participants
   * @param type - Type of chat (private, group, channel)
   * @param isEncrypted - Whether this chat uses end-to-end encryption
   * @param encryptionKeyId - ID of the shared encryption key, if applicable
   * @param createdAt - When the chat was created
   * @param updatedAt - When the latest activity occurred in this chat
   * @param adminIds - User IDs of chat administrators (for groups and channels)
   */
  constructor(
    public id: string,
    public name: string,
    public participants: string[],
    public type: ChatType = ChatType.PRIVATE,
    public isEncrypted: boolean = true,
    public encryptionKeyId?: string,
    public createdAt: Date = new Date(),
    public updatedAt: Date = new Date(),
    public adminIds: string[] = []
  ) {}

  /**
   * Get all messages in this chat
   */
  get messages(): Message[] {
    return [...this._messages]; // Return a copy to prevent direct modification
  }

  /**
   * Add a message to this chat
   * @param message - The message to add
   */
  addMessage(message: Message): void {
    this._messages.push(message);
    this.updatedAt = message.timestamp;
  }

  /**
   * Get the latest message in this chat
   */
  get latestMessage(): Message | undefined {
    if (this._messages.length === 0) return undefined;
    return this._messages[this._messages.length - 1];
  }

  /**
   * Check if a user is a participant in this chat
   * @param userId - The user ID to check
   * @returns True if the user is a participant
   */
  hasParticipant(userId: string): boolean {
    return this.participants.includes(userId);
  }

  /**
   * Check if a user is an admin of this chat
   * @param userId - The user ID to check
   * @returns True if the user is an admin
   */
  isUserAdmin(userId: string): boolean {
    return this.adminIds.includes(userId);
  }

  /**
   * Add a participant to this chat
   * @param userId - The user ID to add
   * @param asAdmin - Whether to add the user as an admin
   * @returns True if user was added, false if already a participant
   */
  addParticipant(userId: string, asAdmin: boolean = false): boolean {
    if (this.hasParticipant(userId)) {
      return false;
    }
    
    this.participants.push(userId);
    
    if (asAdmin) {
      this.adminIds.push(userId);
    }
    
    return true;
  }

  /**
   * Remove a participant from this chat
   * @param userId - The user ID to remove
   * @returns True if user was removed
   */
  removeParticipant(userId: string): boolean {
    const index = this.participants.indexOf(userId);
    if (index === -1) {
      return false;
    }
    
    this.participants.splice(index, 1);
    
    // Also remove from admins if needed
    const adminIndex = this.adminIds.indexOf(userId);
    if (adminIndex !== -1) {
      this.adminIds.splice(adminIndex, 1);
    }
    
    return true;
  }

  /**
   * Creates a JSON representation of the chat for storage or transmission
   */
  toJSON(): any {
    return {
      id: this.id,
      name: this.name,
      participants: this.participants,
      type: this.type,
      isEncrypted: this.isEncrypted,
      encryptionKeyId: this.encryptionKeyId,
      createdAt: this.createdAt.toISOString(),
      updatedAt: this.updatedAt.toISOString(),
      adminIds: this.adminIds,
      // Messages are not included by default for efficiency
    };
  }

  /**
   * Create a Chat instance from a JSON representation
   * @param json - JSON representation of a chat
   * @param includeMessages - Whether to include message data
   * @returns New Chat instance
   */
  static fromJSON(json: any, includeMessages: boolean = false): Chat {
    const chat = new Chat(
      json.id,
      json.name,
      json.participants || [],
      json.type || ChatType.PRIVATE,
      json.isEncrypted || false,
      json.encryptionKeyId,
      new Date(json.createdAt || Date.now()),
      new Date(json.updatedAt || Date.now()),
      json.adminIds || []
    );
    
    // Add messages if they exist and are requested
    if (includeMessages && json.messages && Array.isArray(json.messages)) {
      json.messages.forEach((msgJson: any) => {
        chat.addMessage(Message.fromJSON(msgJson));
      });
    }
    
    return chat;
  }
}
