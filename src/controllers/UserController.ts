/**
 * User Controller
 * 
 * Handles the logic for user authentication, profile management,
 * and encryption key management in the Snakkaz chat application.
 */

import { User, PublicKeyInfo } from "../models/User";

export class UserController {
  // Map of user ID to User object
  private users: Map<string, User> = new Map();
  
  constructor(
    private currentUser: User | null = null,
    private authService?: any, // Will be connected to actual auth service
    private encryptionService?: any // Will be connected to actual encryption service
  ) {}
  
  /**
   * Sign in a user
   */
  async signIn(username: string, password: string): Promise<User | null> {
    if (!this.authService) {
      console.error("Authentication service not available");
      return null;
    }
    
    try {
      const userData = await this.authService.signIn(username, password);
      
      if (!userData) {
        console.error("Authentication failed");
        return null;
      }
      
      const user = new User(
        userData.id,
        userData.username,
        userData.displayName || userData.username,
        userData.avatarUrl,
        true, // Set as online
        new Date()
      );
      
      // Add public keys if available
      if (userData.publicKeys) {
        userData.publicKeys.forEach((keyData: any) => {
          user.addPublicKey({
            keyId: keyData.keyId,
            publicKey: keyData.publicKey,
            algorithm: keyData.algorithm,
            createdAt: new Date(keyData.createdAt),
            expiresAt: keyData.expiresAt ? new Date(keyData.expiresAt) : undefined
          });
        });
      }
      
      // Set as current user
      this.currentUser = user;
      
      // Add to users map
      this.users.set(user.id, user);
      
      return user;
    } catch (error) {
      console.error("Sign in failed:", error);
      return null;
    }
  }
  
  /**
   * Sign out the current user
   */
  async signOut(): Promise<boolean> {
    if (!this.currentUser || !this.authService) return false;
    
    try {
      await this.authService.signOut();
      this.currentUser = null;
      return true;
    } catch (error) {
      console.error("Sign out failed:", error);
      return false;
    }
  }
  
  /**
   * Get the current user
   */
  getCurrentUser(): User | null {
    return this.currentUser;
  }
  
  /**
   * Update the current user's profile
   */
  async updateUserProfile(updates: {
    displayName?: string;
    avatarUrl?: string;
  }): Promise<User | null> {
    if (!this.currentUser || !this.authService) return null;
    
    try {
      const updatedData = await this.authService.updateUserProfile(
        this.currentUser.id,
        updates
      );
      
      // Update the local user object
      if (updates.displayName) {
        this.currentUser.displayName = updates.displayName;
      }
      
      if (updates.avatarUrl) {
        this.currentUser.avatarUrl = updates.avatarUrl;
      }
      
      // Update in users map
      this.users.set(this.currentUser.id, this.currentUser);
      
      return this.currentUser;
    } catch (error) {
      console.error("Update profile failed:", error);
      return null;
    }
  }
  
  /**
   * Generate new encryption keys for the current user
   */
  async generateEncryptionKeys(): Promise<PublicKeyInfo | null> {
    if (!this.currentUser || !this.encryptionService) {
      console.error("User not signed in or encryption service not available");
      return null;
    }
    
    try {
      // Generate new keys
      const keyPair = await this.encryptionService.generateKeyPair();
      
      // Create a key info object
      const keyInfo: PublicKeyInfo = {
        keyId: keyPair.keyId,
        publicKey: keyPair.publicKey,
        algorithm: keyPair.algorithm,
        createdAt: new Date(),
        expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000) // 1 year expiration
      };
      
      // Add to current user
      this.currentUser.addPublicKey(keyInfo);
      
      // Upload public key to server
      await this.authService.uploadPublicKey(
        this.currentUser.id,
        keyInfo
      );
      
      return keyInfo;
    } catch (error) {
      console.error("Key generation failed:", error);
      return null;
    }
  }
  
  /**
   * Fetch a user by ID
   */
  async getUserById(userId: string): Promise<User | null> {
    // Check if we already have the user
    if (this.users.has(userId)) {
      return this.users.get(userId) || null;
    }
    
    // If no auth service, we can't fetch users
    if (!this.authService) {
      console.error("Authentication service not available");
      return null;
    }
    
    try {
      const userData = await this.authService.getUserById(userId);
      
      if (!userData) {
        console.error(`User ${userId} not found`);
        return null;
      }
      
      const user = new User(
        userData.id,
        userData.username,
        userData.displayName || userData.username,
        userData.avatarUrl,
        userData.isOnline || false,
        userData.lastSeen ? new Date(userData.lastSeen) : new Date()
      );
      
      // Add public keys if available
      if (userData.publicKeys) {
        userData.publicKeys.forEach((keyData: any) => {
          user.addPublicKey({
            keyId: keyData.keyId,
            publicKey: keyData.publicKey,
            algorithm: keyData.algorithm,
            createdAt: new Date(keyData.createdAt),
            expiresAt: keyData.expiresAt ? new Date(keyData.expiresAt) : undefined
          });
        });
      }
      
      // Add to users map
      this.users.set(user.id, user);
      
      return user;
    } catch (error) {
      console.error(`Failed to fetch user ${userId}:`, error);
      return null;
    }
  }
  
  /**
   * Search for users
   */
  async searchUsers(query: string): Promise<User[]> {
    if (!this.authService) {
      console.error("Authentication service not available");
      return [];
    }
    
    try {
      const userDataList = await this.authService.searchUsers(query);
      
      const users: User[] = [];
      
      for (const userData of userDataList) {
        // Check if we already have this user
        let user = this.users.get(userData.id);
        
        if (!user) {
          // Create new user object
          user = new User(
            userData.id,
            userData.username,
            userData.displayName || userData.username,
            userData.avatarUrl,
            userData.isOnline || false,
            userData.lastSeen ? new Date(userData.lastSeen) : new Date()
          );
          
          // Add public keys if available
          if (userData.publicKeys) {
            userData.publicKeys.forEach((keyData: any) => {
              user!.addPublicKey({
                keyId: keyData.keyId,
                publicKey: keyData.publicKey,
                algorithm: keyData.algorithm,
                createdAt: new Date(keyData.createdAt),
                expiresAt: keyData.expiresAt ? new Date(keyData.expiresAt) : undefined
              });
            });
          }
          
          // Add to users map
          this.users.set(user.id, user);
        }
        
        users.push(user);
      }
      
      return users;
    } catch (error) {
      console.error(`Failed to search users with query "${query}":`, error);
      return [];
    }
  }
  
  /**
   * Get all known users
   */
  getKnownUsers(): User[] {
    return Array.from(this.users.values());
  }
}
