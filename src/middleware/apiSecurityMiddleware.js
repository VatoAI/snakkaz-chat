/**
 * apiSecurityMiddleware.js
 * 
 * This module provides a security layer for cPanel API operations.
 * It restricts what operations can be performed with a cPanel API token,
 * which inherently has full access to all cPanel functions.
 */

// Define the allowed cPanel API operations
const PERMITTED_OPERATIONS = {
  // Standard email operations - available to premium users
  'Email/list_pops': { adminOnly: false },
  'Email/add_pop': { adminOnly: false },
  'Email/delete_pop': { adminOnly: false },
  'Email/passwd_pop': { adminOnly: false },
  'Email/get_pop_quota': { adminOnly: false },
  
  // Admin-only operations
  'Email/list_mail_domains': { adminOnly: true },
  'Email/get_main_account_disk_usage': { adminOnly: true },
  'Email/validate_email_password': { adminOnly: true },
  'Email/set_pop_quota': { adminOnly: true },
};

/**
 * Check if a cPanel API operation is permitted
 * @param {string} operation - The cPanel API operation (e.g., 'Email/list_pops')
 * @param {boolean} isAdmin - Whether the user is an admin
 * @returns {boolean} - Whether the operation is permitted
 */
const isOperationPermitted = (operation, isAdmin) => {
  // If operation isn't in the permitted list, it's not allowed
  if (!PERMITTED_OPERATIONS[operation]) {
    return false;
  }
  
  // If operation requires admin privileges, check if user is admin
  if (PERMITTED_OPERATIONS[operation].adminOnly && !isAdmin) {
    return false;
  }
  
  return true;
};

/**
 * Express middleware to restrict API operations
 * Used for admin raw API calls
 */
const restrictApiOperations = (req, res, next) => {
  const { operation } = req.body;
  const isAdmin = req.isAdmin || false;
  
  if (!operation) {
    return res.status(400).json({
      success: false,
      message: 'Operation parameter is required'
    });
  }
  
  if (!isOperationPermitted(operation, isAdmin)) {
    console.warn(`[SECURITY] Blocked forbidden operation: ${operation} by user: ${req.user?.id || 'unknown'}`);
    return res.status(403).json({
      success: false,
      message: `Operation ${operation} is not permitted`
    });
  }
  
  next();
};

/**
 * Log API operations for audit purposes
 */
const logApiOperation = (req, res, next) => {
  const { operation } = req.body;
  const userId = req.user?.id || 'anonymous';
  const userIp = req.ip || req.connection.remoteAddress;
  
  console.log(`[${new Date().toISOString()}] API Operation: ${operation}, User: ${userId}, IP: ${userIp}`);
  
  // You can also log to a database or external service for audit purposes
  // logToDatabase({ timestamp: new Date(), operation, userId, userIp });
  
  next();
};

/**
 * Secure wrapper for making cPanel API calls
 * 
 * @param {string} operation - The cPanel API operation
 * @param {object} params - Parameters for the operation
 * @param {boolean} isAdmin - Whether the user is an admin
 * @returns {Promise<object>} - The API response
 * @throws {Error} - If the operation is not permitted
 */
const secureCpanelApiCall = async (operation, params, isAdmin = false) => {
  // Security check: Only permit operations on the allowlist
  if (!isOperationPermitted(operation, isAdmin)) {
    throw new Error(`Operation ${operation} is not permitted`);
  }
  
  // Load credentials from environment variables
  const username = process.env.CPANEL_USERNAME;
  const token = process.env.CPANEL_API_TOKEN;
  const domain = process.env.CPANEL_DOMAIN;
  
  if (!username || !token || !domain) {
    throw new Error('cPanel API credentials are not configured');
  }
  
  // Log the operation for audit purposes
  console.log(`[${new Date().toISOString()}] Executing cPanel API: ${operation}`);
  
  try {
    // Make the API call
    const response = await callCpanelApi(username, token, domain, operation, params);
    
    // Return a sanitized response (removing any sensitive data)
    return sanitizeApiResponse(response);
  } catch (error) {
    console.error(`[ERROR] cPanel API call failed: ${operation}`, error);
    throw new Error(`API call failed: ${error.message}`);
  }
};

/**
 * Helper function to make actual cPanel API calls
 * 
 * @param {string} username - cPanel username
 * @param {string} token - cPanel API token
 * @param {string} domain - cPanel domain
 * @param {string} operation - API operation
 * @param {object} params - API parameters
 * @returns {Promise<object>} - API response
 */
const callCpanelApi = async (username, token, domain, operation, params) => {
  // Split module and function
  const [module, func] = operation.split('/');
  
  // Create authorization header
  const authHeader = `cpanel ${username}:${token}`;
  
  // Build URL with query parameters
  const baseUrl = `https://${domain}:2083/execute/${module}/${func}`;
  const url = new URL(baseUrl);
  
  // Add parameters to URL
  Object.keys(params).forEach(key => {
    url.searchParams.append(key, params[key]);
  });
  
  // Make the API call
  const response = await fetch(url.toString(), {
    method: 'GET',
    headers: {
      'Authorization': authHeader,
      'Accept': 'application/json'
    }
  });
  
  if (!response.ok) {
    throw new Error(`cPanel API returned ${response.status}: ${response.statusText}`);
  }
  
  return response.json();
};

/**
 * Sanitize API response to remove sensitive data
 * 
 * @param {object} response - The API response
 * @returns {object} - Sanitized response
 */
const sanitizeApiResponse = (response) => {
  // Create a deep copy to avoid modifying the original
  const sanitized = JSON.parse(JSON.stringify(response));
  
  // Remove any sensitive fields if present
  if (sanitized.data) {
    // Remove passwords and tokens if they exist
    if (Array.isArray(sanitized.data)) {
      sanitized.data = sanitized.data.map(item => {
        if (item.password) delete item.password;
        if (item.token) delete item.token;
        if (item.api_token) delete item.api_token;
        return item;
      });
    } else if (typeof sanitized.data === 'object') {
      if (sanitized.data.password) delete sanitized.data.password;
      if (sanitized.data.token) delete sanitized.data.token;
      if (sanitized.data.api_token) delete sanitized.data.api_token;
    }
  }
  
  return sanitized;
};

module.exports = {
  isOperationPermitted,
  restrictApiOperations,
  logApiOperation,
  secureCpanelApiCall,
  PERMITTED_OPERATIONS
};
