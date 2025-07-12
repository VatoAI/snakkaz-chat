/**
 * Message Model
 * 
 * Represents a message in the Snakkaz chat application with end-to-end encryption support.
 * Each message contains the content, sender information, timestamp, and encryption-related fields.
 */

export class Message {
  /**
   * Create a new message
   * 
   * @param id - Unique identifier for the message
   * @param content - The content of the message (can be encrypted or plain text)
   * @param sender - The user ID of the sender
   * @param senderName - Display name of the sender
   * @param timestamp - When the message was sent
   * @param isEncrypted - Whether the message content is encrypted
   * @param encryptionKeyId - ID of the key used for encryption (if applicable)
   * @param recipients - List of user IDs who can decrypt this message
   * @param attachments - Optional list of attachment metadata
   */
  constructor(
    public id: string,
    public content: string,
    public sender: string,
    public senderName: string,
    public timestamp: Date,
    public isEncrypted: boolean = false,
    public encryptionKeyId?: string,
    public recipients?: string[],
    public attachments?: MessageAttachment[]
  ) {}

  /**
   * Creates a plain text representation of the message suitable for display
   */
  toDisplayText(): string {
    return `[${this.timestamp.toLocaleTimeString()}] ${this.senderName}: ${this.isEncrypted ? '🔒 ' : ''}${this.content}`;
  }

  /**
   * Creates a JSON representation of the message suitable for storage or transmission
   */
  toJSON(): any {
    return {
      id: this.id,
      content: this.content,
      sender: this.sender,
      senderName: this.senderName,
      timestamp: this.timestamp.toISOString(),
      isEncrypted: this.isEncrypted,
      encryptionKeyId: this.encryptionKeyId,
      recipients: this.recipients,
      attachments: this.attachments?.map(a => a.toJSON())
    };
  }

  /**
   * Create a Message instance from a JSON representation
   */
  static fromJSON(json: any): Message {
    return new Message(
      json.id,
      json.content,
      json.sender,
      json.senderName,
      new Date(json.timestamp),
      json.isEncrypted,
      json.encryptionKeyId,
      json.recipients,
      json.attachments?.map(a => MessageAttachment.fromJSON(a))
    );
  }
}

/**
 * Represents an attachment to a message
 */
export class MessageAttachment {
  constructor(
    public id: string,
    public type: 'image' | 'file' | 'audio' | 'video',
    public url: string,
    public name: string,
    public size: number,
    public isEncrypted: boolean = false,
    public encryptionKeyId?: string
  ) {}

  /**
   * Creates a JSON representation of the attachment
   */
  toJSON(): any {
    return {
      id: this.id,
      type: this.type,
      url: this.url,
      name: this.name,
      size: this.size,
      isEncrypted: this.isEncrypted,
      encryptionKeyId: this.encryptionKeyId
    };
  }

  /**
   * Create a MessageAttachment instance from a JSON representation
   */
  static fromJSON(json: any): MessageAttachment {
    return new MessageAttachment(
      json.id,
      json.type,
      json.url,
      json.name,
      json.size,
      json.isEncrypted,
      json.encryptionKeyId
    );
  }
}
