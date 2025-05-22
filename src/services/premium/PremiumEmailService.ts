/**
 * SnakkaZ Premium Email Service
 * 
 * This service handles the creation and management of custom @snakkaz.com email addresses
 * for premium users through integration with the email provider API.
 */

interface EmailAccount {
  username: string;
  domain: string;
  fullAddress: string;
  isActive: boolean;
  created: Date;
  storage: {
    used: number;
    total: number;
  };
  forwardingAddresses?: string[];
}

interface EmailCreationOptions {
  password: string;
  enableForwarding?: boolean;
  forwardTo?: string;
  storageQuota?: number; // in MB
}

/**
 * Service class for managing premium email accounts
 */
export class PremiumEmailService {
  private apiBaseUrl = process.env.EMAIL_API_URL || 'https://api.snakkaz.com/email';
  private apiKey = process.env.EMAIL_API_KEY;
  
  /**
   * Check if a username is available for a snakkaz.com email address
   * @param username The desired username
   * @returns Promise resolving to availability status
   */
  async checkUsernameAvailability(username: string): Promise<boolean> {
    try {
      const normalizedUsername = this.normalizeUsername(username);
      
      const response = await fetch(`${this.apiBaseUrl}/check-availability`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify({ username: normalizedUsername })
      });
      
      const data = await response.json();
      return data.available === true;
    } catch (error) {
      console.error('Failed to check email availability:', error);
      throw new Error('Could not check email availability');
    }
  }
  
  /**
   * Create a new premium email account
   * @param userId The user's ID
   * @param username The desired username for the email address
   * @param options Configuration options for the email account
   * @returns Promise resolving to the newly created email account
   */
  async createEmailAccount(
    userId: string,
    username: string,
    options: EmailCreationOptions
  ): Promise<EmailAccount> {
    try {
      const normalizedUsername = this.normalizeUsername(username);
      
      // Validate the username
      if (!this.isValidUsername(normalizedUsername)) {
        throw new Error('Invalid username format');
      }
      
      // Check availability
      const isAvailable = await this.checkUsernameAvailability(normalizedUsername);
      if (!isAvailable) {
        throw new Error('This email address is already taken');
      }
      
      // Create the account
      const response = await fetch(`${this.apiBaseUrl}/accounts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify({
          userId,
          username: normalizedUsername,
          domain: 'snakkaz.com',
          password: options.password,
          enableForwarding: options.enableForwarding || false,
          forwardTo: options.forwardTo || null,
          storageQuota: options.storageQuota || 2048 // Default 2GB
        })
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to create email account');
      }
      
      const newAccount = await response.json();
      return {
        username: newAccount.username,
        domain: 'snakkaz.com',
        fullAddress: `${newAccount.username}@snakkaz.com`,
        isActive: true,
        created: new Date(),
        storage: {
          used: 0,
          total: options.storageQuota || 2048
        },
        forwardingAddresses: options.forwardTo ? [options.forwardTo] : []
      };
    } catch (error) {
      console.error('Failed to create email account:', error);
      throw error;
    }
  }
  
  /**
   * Get all email accounts for a user
   * @param userId The user's ID
   * @returns Promise resolving to an array of email accounts
   */
  async getUserEmailAccounts(userId: string): Promise<EmailAccount[]> {
    try {
      const response = await fetch(`${this.apiBaseUrl}/accounts?userId=${userId}`, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch email accounts');
      }
      
      return response.json();
    } catch (error) {
      console.error('Failed to get user email accounts:', error);
      throw error;
    }
  }
  
  /**
   * Update email account settings
   * @param userId The user's ID
   * @param emailAddress The full email address to update
   * @param updates The properties to update
   * @returns Promise resolving to the updated account
   */
  async updateEmailAccount(
    userId: string,
    emailAddress: string,
    updates: Partial<EmailCreationOptions>
  ): Promise<EmailAccount> {
    try {
      const [username, domain] = emailAddress.split('@');
      
      if (domain !== 'snakkaz.com') {
        throw new Error('Can only update snakkaz.com email addresses');
      }
      
      const response = await fetch(`${this.apiBaseUrl}/accounts/${username}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify({
          userId,
          ...updates
        })
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to update email account');
      }
      
      return response.json();
    } catch (error) {
      console.error('Failed to update email account:', error);
      throw error;
    }
  }
  
  /**
   * Delete an email account
   * @param userId The user's ID
   * @param emailAddress The full email address to delete
   * @returns Promise resolving to success status
   */
  async deleteEmailAccount(userId: string, emailAddress: string): Promise<boolean> {
    try {
      const [username, domain] = emailAddress.split('@');
      
      if (domain !== 'snakkaz.com') {
        throw new Error('Can only delete snakkaz.com email addresses');
      }
      
      const response = await fetch(`${this.apiBaseUrl}/accounts/${username}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify({ userId })
      });
      
      return response.ok;
    } catch (error) {
      console.error('Failed to delete email account:', error);
      throw error;
    }
  }
  
  /**
   * Normalize a username by removing invalid characters and converting to lowercase
   * @param username The raw username input
   * @returns Normalized username
   */
  private normalizeUsername(username: string): string {
    return username
      .toLowerCase()
      .replace(/[^a-z0-9.-]/g, '');
  }
  
  /**
   * Validate a username according to email address rules
   * @param username Username to validate
   * @returns Whether the username is valid
   */
  private isValidUsername(username: string): boolean {
    // Must be 3-64 characters
    if (username.length < 3 || username.length > 64) {
      return false;
    }
    
    // Must start with letter or number
    if (!/^[a-z0-9]/.test(username)) {
      return false;
    }
    
    // Cannot have consecutive dots or hyphens
    if (/(\.\.)|(--)/.test(username)) {
      return false;
    }
    
    // Cannot end with dot or hyphen
    if (/[.-]$/.test(username)) {
      return false;
    }
    
    // Must only contain valid characters
    return /^[a-z0-9.-]+$/.test(username);
  }
}

// Export a singleton instance
export default new PremiumEmailService();
