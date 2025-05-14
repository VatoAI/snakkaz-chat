/**
 * User Presenter
 * 
 * Presents user data to the UI and handles user interface interactions
 * related to user profiles, authentication, and user management.
 */

import { BasePresenter, View } from './BasePresenter';
import { User } from '../models/User';
import { UserController } from '../controllers/UserController';

export interface UserView extends View {
  renderProfile(user: User): void;
  showLoginStatus(isLoggedIn: boolean, user?: User): void;
  showUserSearchResults(users: User[]): void;
  showError(message: string): void;
}

export class UserPresenter extends BasePresenter<UserView> {
  constructor(private userController: UserController) {
    super();
  }
  
  /**
   * Handle user login
   * 
   * @param username - Username to login with
   */
  async loginUser(username: string): Promise<void> {
    try {
      const user = await this.userController.loginUser(username);
      
      if (user) {
        if (this.view) {
          this.view.showLoginStatus(true, user);
          this.view.renderProfile(user);
        }
      } else {
        if (this.view) {
          this.view.showError("Invalid username");
          this.view.showLoginStatus(false);
        }
      }
    } catch (error) {
      console.error("Login error:", error);
      if (this.view) {
        this.view.showError("Login failed: " + (error as Error).message);
        this.view.showLoginStatus(false);
      }
    }
  }
  
  /**
   * Handle user registration
   * 
   * @param username - Username for new account
   * @param displayName - Display name for new account
   */
  async registerUser(username: string, displayName: string): Promise<void> {
    try {
      const user = await this.userController.registerUser(username, displayName);
      
      if (this.view) {
        this.view.showLoginStatus(true, user);
        this.view.renderProfile(user);
      }
    } catch (error) {
      console.error("Registration error:", error);
      if (this.view) {
        this.view.showError("Registration failed: " + (error as Error).message);
      }
    }
  }
  
  /**
   * Handle user logout
   */
  logoutUser(): void {
    this.userController.logoutUser();
    if (this.view) {
      this.view.showLoginStatus(false);
    }
  }
  
  /**
   * Update user profile
   * 
   * @param updates - Object with fields to update
   */
  updateProfile(updates: Partial<User>): void {
    const currentUser = this.userController.getCurrentUser();
    
    if (!currentUser) {
      if (this.view) {
        this.view.showError("You must be logged in to update your profile");
      }
      return;
    }
    
    const updatedUser = this.userController.updateUserProfile(currentUser.id, updates);
    
    if (updatedUser && this.view) {
      this.view.renderProfile(updatedUser);
    }
  }
  
  /**
   * Handle user search
   * 
   * @param searchTerm - Term to search for
   */
  searchUsers(searchTerm: string): void {
    if (searchTerm.trim().length < 2) {
      if (this.view) {
        this.view.showUserSearchResults([]);
      }
      return;
    }
    
    const results = this.userController.searchUsers(searchTerm);
    
    if (this.view) {
      this.view.showUserSearchResults(results);
    }
  }
  
  /**
   * Load the current user profile if logged in
   */
  loadCurrentProfile(): void {
    const currentUser = this.userController.getCurrentUser();
    
    if (currentUser && this.view) {
      this.view.showLoginStatus(true, currentUser);
      this.view.renderProfile(currentUser);
    } else if (this.view) {
      this.view.showLoginStatus(false);
    }
  }
}
