/**
 * User Controller
 * 
 * Handles business logic for user operations in the Snakkaz chat application.
 * Manages user authentication, profile updates, and user-related operations.
 */

import { User } from '../models/User';
import { keyStorageService } from '../keyStorageService';
import { generateRsaKeyPair, exportKeyToJwk, importKeyFromJwk } from '../cryptoUtils';

export class UserController {
  private currentUser: User | null = null;
  private users: Map<string, User> = new Map();
  
  /**
   * Register a new user with the system
   * 
   * @param username - Username for the new account
   * @param displayName - Display name for the user
   * @returns The newly created user
   */
  async registerUser(username: string, displayName: string): Promise<User> {
    // Generate a unique ID
    const userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // Generate encryption keys for the user
    const keyPair = await generateRsaKeyPair();
    const publicKeyJwk = await exportKeyToJwk(keyPair.publicKey);
    
    // Store the private key securely
    await keyStorageService.storeKey(
      `user_${userId}_private_key`,
      JSON.stringify(await exportKeyToJwk(keyPair.privateKey)),
      true
    );
    
    // Create the new user
    const user = new User(
      userId,
      username,
      displayName,
      JSON.stringify(publicKeyJwk)
    );
    
    // Save the user to the storage
    this.users.set(userId, user);
    this.currentUser = user;
    
    return user;
  }
  
  /**
   * Login an existing user
   * 
   * @param username - Username to login with
   * @param keyId - ID of the stored encryption key
   * @returns The logged in user or null if authentication fails
   */
  async loginUser(username: string): Promise<User | null> {
    // In a real app, this would validate credentials against a server
    // For now, we'll simulate finding the user by username
    let foundUser: User | null = null;
    
    for (const user of this.users.values()) {
      if (user.username === username) {
        foundUser = user;
        break;
      }
    }
    
    if (foundUser) {
      this.currentUser = foundUser;
      return foundUser;
    }
    
    return null;
  }
  
  /**
   * Log out the current user
   */
  logoutUser(): void {
    this.currentUser = null;
  }
  
  /**
   * Get the currently logged in user
   */
  getCurrentUser(): User | null {
    return this.currentUser;
  }
  
  /**
   * Update the user's profile information
   * 
   * @param userId - ID of the user to update
   * @param updates - Object containing fields to update
   * @returns Updated user or null if user not found
   */
  updateUserProfile(userId: string, updates: Partial<User>): User | null {
    const user = this.users.get(userId);
    
    if (!user) {
      return null;
    }
    
    // Apply updates
    if (updates.displayName) user.displayName = updates.displayName;
    if (updates.avatarUrl) user.avatarUrl = updates.avatarUrl;
    if (updates.isOnline !== undefined) user.isOnline = updates.isOnline;
    if (updates.lastSeen) user.lastSeen = updates.lastSeen;
    
    // Save the updated user
    this.users.set(userId, user);
    
    return user;
  }
  
  /**
   * Get a user by their ID
   * 
   * @param userId - ID of the user to retrieve
   * @returns The user or null if not found
   */
  getUserById(userId: string): User | null {
    return this.users.get(userId) || null;
  }
  
  /**
   * Search for users by name or username
   * 
   * @param searchTerm - Term to search for
   * @returns Array of matching users
   */
  searchUsers(searchTerm: string): User[] {
    const results: User[] = [];
    const lowerSearchTerm = searchTerm.toLowerCase();
    
    for (const user of this.users.values()) {
      if (
        user.username.toLowerCase().includes(lowerSearchTerm) || 
        user.displayName.toLowerCase().includes(lowerSearchTerm)
      ) {
        results.push(user);
      }
    }
    
    return results;
  }
  
  /**
   * Load users from storage
   * 
   * @returns Map of loaded users
   */
  async loadUsers(): Promise<Map<string, User>> {
    // In a real app, this would load users from a database
    // For now, we're just using the in-memory cache
    return this.users;
  }
  
  /**
   * Save users to persistent storage
   */
  async saveUsers(): Promise<void> {
    // In a real app, this would save to a database
    // This is just a placeholder for the implementation
    console.log("Saving users to storage:", this.users.size);
  }
}
