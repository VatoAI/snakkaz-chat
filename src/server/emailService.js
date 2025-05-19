// emailService.js
// This file contains the API endpoints for managing premium user email accounts

const axios = require('axios');
const { createClient } = require('@supabase/supabase-js');

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
 * Create a new email account for a premium user
 * @param {string} username - The username portion of the email (before @snakkaz.com)
 * @param {string} password - The password for the email account
 * @param {number} quota - The quota in MB for the email account
 * @param {string} userId - The Supabase user ID of the premium user
 * @returns {Promise<Object>} - The response from the cPanel API
 */
async function createPremiumEmail(username, password, quota, userId) {
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
    
    // Call the cPanel API to create the email account
    const response = await axios({
      method: 'get',
      url: `https://${cPanelConfig.domain}:2083/execute/Email/add_pop`,
      headers: {
        'Authorization': `cpanel ${cPanelConfig.username}:${cPanelConfig.apiToken}`
      },
      params: {
        email: username,
        password: password,
        quota: quota,
        domain: 'snakkaz.com'
      }
    });
    
    if (response.data.errors) {
      throw new Error(response.data.errors[0]);
    }
    
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
 * @returns {Promise<Object>} - The response from the cPanel API
 */
async function deletePremiumEmail(username, userId) {
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
    
    // Call the cPanel API to delete the email account
    const response = await axios({
      method: 'get',
      url: `https://${cPanelConfig.domain}:2083/execute/Email/delete_pop`,
      headers: {
        'Authorization': `cpanel ${cPanelConfig.username}:${cPanelConfig.apiToken}`
      },
      params: {
        email: username,
        domain: 'snakkaz.com'
      }
    });
    
    if (response.data.errors) {
      throw new Error(response.data.errors[0]);
    }
    
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
 * @returns {Promise<Object>} - The response from the cPanel API
 */
async function changeEmailPassword(username, password, userId) {
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
    
    // Call the cPanel API to change the password
    const response = await axios({
      method: 'get',
      url: `https://${cPanelConfig.domain}:2083/execute/Email/passwd_pop`,
      headers: {
        'Authorization': `cpanel ${cPanelConfig.username}:${cPanelConfig.apiToken}`
      },
      params: {
        email: username,
        password: password,
        domain: 'snakkaz.com'
      }
    });
    
    if (response.data.errors) {
      throw new Error(response.data.errors[0]);
    }
    
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

module.exports = {
  createPremiumEmail,
  deletePremiumEmail,
  changeEmailPassword,
  getUserEmails
};
