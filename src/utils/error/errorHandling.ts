/**
 * Error handling utility functions for Snakkaz Chat
 */

/**
 * Global error handler setup
 * Sets up a global unhandled rejection handler and error handler
 */
export function setupGlobalErrorHandlers() {
  if (typeof window === 'undefined') return;
  
  // Handle unhandled promise rejections
  window.addEventListener('unhandledrejection', (event) => {
    console.error('Unhandled Promise Rejection:', event.reason);
    
    // If the error is a proper Error object with stack trace
    if (event.reason instanceof Error) {
      logErrorToConsole('Unhandled Promise Rejection', event.reason);
    } else {
      // If it's some other value 
      logErrorToConsole('Unhandled Promise Rejection', new Error(String(event.reason)));
    }
  });
  
  // Handle global errors
  window.addEventListener('error', (event) => {
    if (event.error) {
      logErrorToConsole('Global Error', event.error);
    }
  });
  
  console.log('Global error handlers initialized');
}

/**
 * Log error details to console in a structured way
 */
function logErrorToConsole(errorType: string, error: Error) {
  console.group(`%c${errorType}`, 'color: #ff5555; font-weight: bold;');
  console.error(error.message);
  console.error(error.stack);
  console.log('User Agent:', navigator.userAgent);
  console.log('Timestamp:', new Date().toISOString());
  console.log('URL:', window.location.href);
  console.groupEnd();
}

/**
 * Wrap an async function to catch and handle any errors
 */
export function withErrorHandling<T>(
  fn: (...args: any[]) => Promise<T>,
  errorHandler?: (error: Error) => void
): (...args: any[]) => Promise<T | undefined> {
  return async (...args: any[]) => {
    try {
      return await fn(...args);
    } catch (error) {
      const typedError = error instanceof Error ? error : new Error(String(error));
      logErrorToConsole('Caught Async Error', typedError);
      
      if (errorHandler) {
        errorHandler(typedError);
      }
      
      return undefined;
    }
  };
}

/**
 * Format an error message for display to users
 */
export function formatErrorForUser(error: Error): string {
  // Remove technical details that wouldn't be useful to users
  let message = error.message
    .replace(/Error:/gi, '')
    .replace(/\[.*?\]/g, '')
    .replace(/\(.*?\)/g, '')
    .trim();
  
  // If the message is empty or just technical gibberish, provide a generic message
  if (!message || message.length < 5 || message.includes('undefined') || message.includes('null')) {
    return 'Det oppsto en uventet feil. Vennligst prøv igjen senere.';
  }
  
  return message;
}

/**
 * Check for common network errors
 */
export function isNetworkError(error: Error): boolean {
  const message = error.message.toLowerCase();
  return (
    message.includes('network') ||
    message.includes('failed to fetch') ||
    message.includes('timeout') ||
    message.includes('abort') ||
    message.includes('offline')
  );
}

/**
 * Attempt to recover from a common error
 * Returns true if recovery was attempted
 */
export function attemptErrorRecovery(error: Error): boolean {
  if (isNetworkError(error)) {
    // For network errors, we might want to retry the request
    console.log('Network error detected, could attempt retry logic here');
    return true;
  }
  
  // Add more recovery strategies as needed
  
  return false; // No recovery attempted
}
