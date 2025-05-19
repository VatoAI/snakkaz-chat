/**
 * Snakkaz Chat Error Monitoring
 * 
 * A comprehensive error detection and reporting system
 * for production deployments of Snakkaz Chat.
 */

// Configuration for error reporting
const ERROR_CONFIG = {
  // Whether to enable verbose logging
  verboseLogging: false,
  
  // Maximum number of errors to report per session
  maxErrorsPerSession: 10,
  
  // Track how many errors we've seen
  errorCount: 0,
  
  // Domains to suppress console errors for (typically CDNs, analytics)
  suppressDomains: [
    'cdn.gpteng.co',
    'analytics.snakkaz.com',
    'googletagmanager.com',
    'google-analytics.com'
  ]
};

// Initialize error monitoring
export function initErrorMonitoring() {
  if (typeof window === 'undefined') return;
  
  // Set up global handlers
  setupGlobalErrorHandler();
  setupUnhandledRejectionHandler();
  setupResourceErrorHandler();
  
  console.log('Snakkaz error monitoring initialized');
}

// Handle uncaught errors
function setupGlobalErrorHandler() {
  const originalOnError = window.onerror;
  
  window.onerror = function(message, source, lineno, colno, error) {
    // Don't exceed reporting limit
    if (ERROR_CONFIG.errorCount >= ERROR_CONFIG.maxErrorsPerSession) {
      return originalOnError ? originalOnError.call(this, message, source, lineno, colno, error) : false;
    }
    
    // Check if we should suppress this error
    if (source && typeof source === 'string') {
      if (ERROR_CONFIG.suppressDomains.some(domain => source.includes(domain))) {
        return true; // Suppress error
      }
    }
    
    // Track that we saw an error
    ERROR_CONFIG.errorCount++;
    
    // Log the error in a structured way
    logErrorDetails('Uncaught Exception', {
      message,
      source,
      lineno,
      colno,
      stack: error?.stack,
      timestamp: new Date().toISOString()
    });
    
    // Call the original handler if it exists
    if (originalOnError) {
      return originalOnError.call(this, message, source, lineno, colno, error);
    }
    
    return false; // Let the error propagate to the console
  };
}

// Handle promise rejections
function setupUnhandledRejectionHandler() {
  window.addEventListener('unhandledrejection', function(event) {
    // Don't exceed reporting limit
    if (ERROR_CONFIG.errorCount >= ERROR_CONFIG.maxErrorsPerSession) return;
    
    ERROR_CONFIG.errorCount++;
    
    // Extract relevant details
    const error = event.reason;
    const errorInfo = {
      message: error?.message || String(error),
      stack: error?.stack,
      timestamp: new Date().toISOString()
    };
    
    logErrorDetails('Unhandled Promise Rejection', errorInfo);
  });
}

// Handle resource loading errors
function setupResourceErrorHandler() {
  window.addEventListener('error', function(event) {
    // Only handle resource errors (not JS errors, which go to window.onerror)
    if (!event.target || !('tagName' in event.target)) return;
    
    // Don't exceed reporting limit
    if (ERROR_CONFIG.errorCount >= ERROR_CONFIG.maxErrorsPerSession) return;
    
    const target = event.target as HTMLElement;
    
    // Check if this is a resource error
    if (['IMG', 'SCRIPT', 'LINK', 'AUDIO', 'VIDEO'].includes(target.tagName)) {
      ERROR_CONFIG.errorCount++;
      
      // Extract URL information carefully to avoid errors
      let resourceUrl = '';
      try {
        if ('src' in target) {
          resourceUrl = (target as HTMLImageElement | HTMLScriptElement).src;
        } else if ('href' in target) {
          resourceUrl = (target as HTMLLinkElement).href;
        }
      } catch (e) {
        resourceUrl = 'Unable to extract URL';
      }
      
      logErrorDetails('Resource Loading Error', {
        resourceType: target.tagName,
        resourceUrl,
        timestamp: new Date().toISOString()
      });
    }
  }, true); // Capture phase to get resource errors before they're handled
}

// Log error details in a structured way
function logErrorDetails(errorType: string, details: any) {
  // Always log to console in development
  if (import.meta.env.DEV || ERROR_CONFIG.verboseLogging) {
    console.group(`%c${errorType}`, 'color: #ff5555; font-weight: bold;');
    console.error(details.message || 'Error occurred');
    
    // Log additional details
    for (const [key, value] of Object.entries(details)) {
      if (key !== 'message') {
        console.log(`${key}: `, value);
      }
    }
    console.groupEnd();
  }
  
  // In production, we could send this to a backend error logging service
  if (import.meta.env.PROD) {
    try {
      // This could be replaced with a call to an error logging service
      logErrorToLocalStorage(errorType, details);
    } catch (e) {
      // Silent fail for logging errors
    }
  }
}

// Simple local storage error logging
function logErrorToLocalStorage(errorType: string, details: any) {
  try {
    // Get existing logs
    const existingLogsStr = localStorage.getItem('snakkaz_error_logs') || '[]';
    const existingLogs = JSON.parse(existingLogsStr);
    
    // Add new log, keeping only the most recent 50
    existingLogs.push({
      type: errorType,
      details,
      timestamp: new Date().toISOString()
    });
    
    // Limit size
    const trimmedLogs = existingLogs.slice(-50);
    
    // Save back to localStorage
    localStorage.setItem('snakkaz_error_logs', JSON.stringify(trimmedLogs));
  } catch (e) {
    // Silently fail
  }
}

// Export function to get logs (useful for admin panels)
export function getErrorLogs() {
  try {
    const logsStr = localStorage.getItem('snakkaz_error_logs') || '[]';
    return JSON.parse(logsStr);
  } catch (e) {
    return [];
  }
}

// Export function to clear logs
export function clearErrorLogs() {
  try {
    localStorage.removeItem('snakkaz_error_logs');
    return true;
  } catch (e) {
    return false;
  }
}
