/**
 * User Model
 * 
 * Represents a user in the Snakkaz chat application.
 * Contains information about the user and their encryption keys.
 */

export interface PublicKeyInfo {
  keyId: string;
  publicKey: string;
  algorithm: string;
  createdAt: Date;
  expiresAt?: Date;
}

export class User {
  private _publicKeys: PublicKeyInfo[] = [];

  /**
   * Create a new user
   * 
   * @param id - Unique identifier for the user
   * @param username - Username for display
   * @param displayName - Full display name
   * @param avatarUrl - URL to user's avatar
   * @param isOnline - Current online status
   * @param lastSeen - Last time user was active
   */
  constructor(
    public id: string,
    public username: string,
    public displayName: string,
    public avatarUrl?: string,
    public isOnline: boolean = false,
    public lastSeen: Date = new Date()
  ) {}

  /**
   * Add a public key for this user
   */
  addPublicKey(keyInfo: PublicKeyInfo): void {
    this._publicKeys.push(keyInfo);
  }

  /**
   * Get all public keys for this user
   */
  get publicKeys(): PublicKeyInfo[] {
    return [...this._publicKeys];
  }

  /**
   * Get the most recent valid public key
   */
  getActivePublicKey(): PublicKeyInfo | undefined {
    const now = new Date();
    
    // Find valid keys (not expired)
    const validKeys = this._publicKeys.filter(key => 
      !key.expiresAt || key.expiresAt > now
    );
    
    if (validKeys.length === 0) return undefined;
    
    // Sort by creation date (newest first)
    validKeys.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    
    return validKeys[0];
  }

  /**
   * Creates a JSON representation of the user
   */
  toJSON(): any {
    return {
      id: this.id,
      username: this.username,
      displayName: this.displayName,
      avatarUrl: this.avatarUrl,
      isOnline: this.isOnline,
      lastSeen: this.lastSeen.toISOString(),
      publicKeys: this._publicKeys.map(key => ({
        ...key,
        createdAt: key.createdAt.toISOString(),
        expiresAt: key.expiresAt?.toISOString()
      }))
    };
  }

  /**
   * Create a User instance from a JSON representation
   */
  static fromJSON(json: any): User {
    const user = new User(
      json.id,
      json.username,
      json.displayName,
      json.avatarUrl,
      json.isOnline,
      new Date(json.lastSeen)
    );
    
    if (json.publicKeys) {
      user._publicKeys = json.publicKeys.map((key: any) => ({
        ...key,
        createdAt: new Date(key.createdAt),
        expiresAt: key.expiresAt ? new Date(key.expiresAt) : undefined
      }));
    }
    
    return user;
  }
}
