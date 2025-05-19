// apiSecurityMiddleware.js
// This middleware implements additional security controls for cPanel API operations
// Since cPanel tokens have full access, this provides an application-level security layer

/**
 * Allowlist of permitted cPanel API operations
 * This restricts what operations our application can perform using the cPanel API token
 */
const PERMITTED_OPERATIONS = {
  // Email operations
  'Email/list_pops': { adminOnly: false },
  'Email/add_pop': { adminOnly: false },
  'Email/delete_pop': { adminOnly: false },
  'Email/passwd_pop': { adminOnly: false },
  'Email/get_pop_quota': { adminOnly: false },
  
  // Add any other permitted operations here
  // Example: 'SSL/install_ssl': { adminOnly: true }
};

/**
 * Validate if an API operation is permitted
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
 * Middleware to restrict cPanel API operations
 * This enforces the permitted operations list
 */
const restrictApiOperations = (req, res, next) => {
  const { operation } = req.body;
  const isAdmin = req.user?.role === 'admin';
  
  if (!operation) {
    return res.status(400).json({
      success: false,
      message: 'API operation not specified'
    });
  }
  
  if (!isOperationPermitted(operation, isAdmin)) {
    // Log unauthorized attempt
    console.warn(`Unauthorized API operation attempt: ${operation} by user ${req.user?.id}`);
    
    return res.status(403).json({
      success: false,
      message: 'This API operation is not permitted or requires admin privileges'
    });
  }
  
  // Operation is permitted, proceed
  next();
};

/**
 * Rate limiting for sensitive operations
 * This prevents abuse of the API
 */
const sensitiveOperationLimiter = (req, res, next) => {
  // Implement rate limiting logic here
  // For example, restrict email creation to 5 per day per user
  // This is a simplified example - in production, use a proper rate limiting library
  
  next();
};

/**
 * Log all API operations for audit purposes
 */
const logApiOperation = (req, res, next) => {
  const { operation } = req.body;
  const userId = req.user?.id || 'anonymous';
  
  console.log(`[${new Date().toISOString()}] User ${userId} performed ${operation}`);
  
  // In a real implementation, you'd log this to a secure audit log
  
  next();
};

module.exports = {
  restrictApiOperations,
  sensitiveOperationLimiter,
  logApiOperation,
  isOperationPermitted
};
