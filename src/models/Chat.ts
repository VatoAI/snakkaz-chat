/**
 * Chat Model
 * 
 * Represents a chat conversation in the Snakkaz chat application.
 * A chat contains information about participants and associated messages.
 */

import { Message } from "./Message";

export enum ChatType {
  PRIVATE = 'private',
  GROUP = 'group',
  CHANNEL = 'channel'
}

export class Chat {
  private _messages: Message[] = [];
  
  /**
   * Create a new chat
   * 
   * @param id - Unique identifier for the chat
   * @param name - Display name for the chat
   * @param participants - List of user IDs participating in this chat
   * @param type - Type of chat (private, group, channel)
   * @param isEncrypted - Whether the chat uses end-to-end encryption
   * @param encryptionKeyId - ID of the key used for encryption (if applicable)
   * @param createdAt - Creation timestamp
   * @param updatedAt - Last update timestamp
   */
  constructor(
    public id: string,
    public name: string,
    public participants: string[],
    public type: ChatType = ChatType.PRIVATE,
    public isEncrypted: boolean = false,
    public encryptionKeyId?: string,
    public createdAt: Date = new Date(),
    public updatedAt: Date = new Date()
  ) {}

  /**
   * Add a message to this chat
   */
  addMessage(message: Message): void {
    this._messages.push(message);
    this.updatedAt = new Date();
  }

  /**
   * Get all messages in this chat
   */
  get messages(): Message[] {
    return [...this._messages];
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
   */
  hasParticipant(userId: string): boolean {
    return this.participants.includes(userId);
  }

  /**
   * Creates a JSON representation of the chat
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
      messages: this._messages.map(m => m.toJSON())
    };
  }

  /**
   * Create a Chat instance from a JSON representation
   */
  static fromJSON(json: any): Chat {
    const chat = new Chat(
      json.id,
      json.name,
      json.participants,
      json.type as ChatType,
      json.isEncrypted,
      json.encryptionKeyId,
      new Date(json.createdAt),
      new Date(json.updatedAt)
    );
    
    if (json.messages) {
      chat._messages = json.messages.map((m: any) => Message.fromJSON(m));
    }
    
    return chat;
  }
}
