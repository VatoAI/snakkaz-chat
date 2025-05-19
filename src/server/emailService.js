// emailService.js
// This file contains the API endpoints for managing premium user email accounts

const axios = require('axios');
const { createClient } = require('@supabase/supabase-js');
const { isOperationPermitted } = require('../middleware/apiSecurityMiddleware');

// Initialize Supabase client
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// cPanel API configuration
const cPanelConfig = {
  username: process.env.CPANEL_USERNAME,
  apiToken: process.env.CPANEL_API_TOKEN, 
  domain: process.env.CPANEL_DOMAIN,
};

/**
 * Secure wrapper for cPanel API calls
 * This function provides an additional security layer
 * 
 * @param {string} operation - The cPanel API operation (e.g., 'Email/list_pops')
 * @param {Object} params - The parameters for the API call
 * @param {boolean} isAdmin - Whether the requesting user is an admin
 * @returns {Promise<Object>} - The response from the cPanel API
 */
async function secureCpanelApiCall(operation, params, isAdmin = false) {
  // Security check: Only permit operations on the allowlist
  if (!isOperationPermitted(operation, isAdmin)) {
    throw new Error(`Operation ${operation} is not permitted or requires admin privileges`);
  }
  
  // Log operation for audit purposes
  console.log(`[${new Date().toISOString()}] cPanel API Call: ${operation}`, params);
  
  try {
    const response = await axios({
      method: 'get',
      url: `https://${cPanelConfig.domain}:2083/execute/${operation}`,
      headers: {
        'Authorization': `cpanel ${cPanelConfig.username}:${cPanelConfig.apiToken}`
      },
      params
    });
    
    // Check for errors in the response
    if (response.data.errors) {
      throw new Error(response.data.errors[0]);
    }
    
    // Return only the necessary data to prevent information leakage
    return {
      success: true,
      data: response.data.data
    };
  } catch (error) {
    console.error(`Error in cPanel API operation ${operation}:`, error);
    
    // Return a sanitized error
    throw new Error(error.message || 'Failed to perform operation');
  }
}

/**
 * Create a new email account for a premium user
 * @param {string} username - The username portion of the email (before @snakkaz.com)
 * @param {string} password - The password for the email account
 * @param {number} quota - The quota in MB for the email account
 * @param {string} userId - The Supabase user ID of the premium user
 * @param {boolean} isAdmin - Whether the requesting user is an admin
 * @returns {Promise<Object>} - The response from the cPanel API
 */
async function createPremiumEmail(username, password, quota, userId, isAdmin = false) {
  try {
    // First check if the user is a premium member
    const { data: subscription, error: subscriptionError } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', userId)
      .eq('status', 'active')
      .single();
    
    if (subscriptionError || !subscription) {
      throw new Error('User is not a premium member');
    }
    
    // Then check if the username is already taken
    const { data: existingEmail, error: emailError } = await supabase
      .from('premium_emails')
      .select('*')
      .eq('email_username', username)
      .single();
    
    if (existingEmail) {
      throw new Error('This email username is already taken');
    }
    
    // Call the secure cPanel API wrapper to create the email account
    await secureCpanelApiCall('Email/add_pop', {
      email: username,
      password: password,
      quota: quota,
      domain: 'snakkaz.com'
    }, isAdmin);
    
    // Store the email account information in the database
    await supabase
      .from('premium_emails')
      .insert([
        {
          user_id: userId,
          email_username: username,
          email_address: `${username}@snakkaz.com`,
          quota_mb: quota,
          created_at: new Date()
        }
      ]);
    
    return {
      success: true,
      email: `${username}@snakkaz.com`,
      message: 'Email account created successfully'
    };
  } catch (error) {
    console.error('Error creating email account:', error);
    return {
      success: false,
      message: error.message || 'Failed to create email account'
    };
  }
}

/**
 * Delete an email account for a premium user
 * @param {string} username - The username portion of the email
 * @param {string} userId - The Supabase user ID of the premium user
 * @param {boolean} isAdmin - Whether the requesting user is an admin
 * @returns {Promise<Object>} - The response from the cPanel API
 */
async function deletePremiumEmail(username, userId, isAdmin = false) {
  try {
    // First check if the user owns this email
    const { data: emailAccount, error: emailError } = await supabase
      .from('premium_emails')
      .select('*')
      .eq('user_id', userId)
      .eq('email_username', username)
      .single();
    
    if (emailError || !emailAccount) {
      throw new Error('Email account not found or not owned by this user');
    }
    
    // Call the secure cPanel API wrapper to delete the email account
    await secureCpanelApiCall('Email/delete_pop', {
      email: username,
      domain: 'snakkaz.com'
    }, isAdmin);
    
    // Remove the email account from the database
    await supabase
      .from('premium_emails')
      .delete()
      .eq('user_id', userId)
      .eq('email_username', username);
    
    return {
      success: true,
      message: 'Email account deleted successfully'
    };
  } catch (error) {
    console.error('Error deleting email account:', error);
    return {
      success: false,
      message: error.message || 'Failed to delete email account'
    };
  }
}

/**
 * Change the password for an email account
 * @param {string} username - The username portion of the email
 * @param {string} password - The new password for the email account
 * @param {string} userId - The Supabase user ID of the premium user
 * @param {boolean} isAdmin - Whether the requesting user is an admin
 * @returns {Promise<Object>} - The response from the cPanel API
 */
async function changeEmailPassword(username, password, userId, isAdmin = false) {
  try {
    // First check if the user owns this email
    const { data: emailAccount, error: emailError } = await supabase
      .from('premium_emails')
      .select('*')
      .eq('user_id', userId)
      .eq('email_username', username)
      .single();
    
    if (emailError || !emailAccount) {
      throw new Error('Email account not found or not owned by this user');
    }
    
    // Call the secure cPanel API wrapper to change the password
    await secureCpanelApiCall('Email/passwd_pop', {
      email: username,
      password: password,
      domain: 'snakkaz.com'
    }, isAdmin);
    
    return {
      success: true,
      message: 'Email password changed successfully'
    };
  } catch (error) {
    console.error('Error changing email password:', error);
    return {
      success: false,
      message: error.message || 'Failed to change email password'
    };
  }
}

/**
 * Get all email accounts for a premium user
 * @param {string} userId - The Supabase user ID of the premium user
 * @returns {Promise<Object>} - The list of email accounts
 */
async function getUserEmails(userId) {
  try {
    // Get the user's email accounts from the database
    const { data: emailAccounts, error } = await supabase
      .from('premium_emails')
      .select('*')
      .eq('user_id', userId);
    
    if (error) {
      throw new Error(error.message);
    }
    
    return {
      success: true,
      emails: emailAccounts
    };
  } catch (error) {
    console.error('Error fetching user emails:', error);
    return {
      success: false,
      message: error.message || 'Failed to fetch email accounts'
    };
  }
}

// Admin-only email management functions
const adminEmailFunctions = {
  /**
   * List all email accounts on the domain (admin only)
   * @returns {Promise<Object>} - List of all email accounts
   */
  async listAllEmails() {
    try {
      const result = await secureCpanelApiCall('Email/list_pops', {}, true);
      
      return {
        success: true,
        emails: result.data
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || 'Failed to list email accounts'
      };
    }
  },
  
  /**
   * Force delete an email account (admin only)
   * @param {string} username - The username portion of the email
   * @returns {Promise<Object>} - The response from the cPanel API
   */
  async forceDeleteEmail(username) {
    try {
      await secureCpanelApiCall('Email/delete_pop', {
        email: username,
        domain: 'snakkaz.com'
      }, true);
      
      // Also remove from database if exists
      await supabase
        .from('premium_emails')
        .delete()
        .eq('email_username', username);
      
      return {
        success: true,
        message: 'Email account forcibly deleted'
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || 'Failed to delete email account'
      };
    }
  }
};

module.exports = {
  createPremiumEmail,
  deletePremiumEmail,
  changeEmailPassword,
  getUserEmails,
  adminEmailFunctions
};
