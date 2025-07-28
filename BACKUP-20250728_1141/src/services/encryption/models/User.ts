/**
 * User Model for Snakkaz Chat
 * 
 * Represents a user in the Snakkaz chat system with end-to-end encryption capabilities
 * Contains identity information and cryptographic keys required for secure messaging
 */

export class User {
  /**
   * Create a new user
   * 
   * @param id - Unique identifier for the user
   * @param username - Username for login
   * @param displayName - Name shown in the UI
   * @param publicKey - Public encryption key (base64 encoded)
   * @param avatarUrl - URL to user's profile image
   * @param isOnline - Whether the user is currently online
   * @param lastSeen - When the user was last active
   * @param keySignature - Signature for key verification
   */
  constructor(
    public id: string,
    public username: string,
    public displayName: string,
    public publicKey: string,
    public avatarUrl?: string,
    public isOnline: boolean = false,
    public lastSeen: Date = new Date(),
    public keySignature?: string
  ) {}

  /**
   * Check if this user has valid encryption keys
   */
  hasValidKeys(): boolean {
    return !!this.publicKey && this.publicKey.length > 0;
  }

  /**
   * Export the public data of this user suitable for sharing
   */
  toPublicProfile(): any {
    return {
      id: this.id,
      username: this.username,
      displayName: this.displayName,
      avatarUrl: this.avatarUrl,
      isOnline: this.isOnline,
      lastSeen: this.lastSeen.toISOString(),
      publicKey: this.publicKey
    };
  }

  /**
   * Convert user to JSON format for storage or transmission
   */
  toJSON(): any {
    return {
      id: this.id,
      username: this.username,
      displayName: this.displayName,
      publicKey: this.publicKey,
      avatarUrl: this.avatarUrl,
      isOnline: this.isOnline,
      lastSeen: this.lastSeen.toISOString(),
      keySignature: this.keySignature
    };
  }

  /**
   * Create a User from JSON data
   */
  static fromJSON(json: any): User {
    return new User(
      json.id,
      json.username,
      json.displayName,
      json.publicKey,
      json.avatarUrl,
      json.isOnline || false,
      json.lastSeen ? new Date(json.lastSeen) : new Date(),
      json.keySignature
    );
  }
}
