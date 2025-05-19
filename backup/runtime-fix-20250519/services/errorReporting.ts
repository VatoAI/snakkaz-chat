/**
 * Error Reporting Service for Snakkaz Chat
 * 
 * This service provides centralized error handling, logging, and reporting capabilities.
 * It integrates with Sentry for production error tracking but works locally during development.
 */
import * as Sentry from '@sentry/react';

// Error categories for better organization
export enum ErrorCategory {
  NETWORK = 'network',
  AUTHENTICATION = 'authentication',
  DATABASE = 'database',
  UI = 'ui',
  ENCRYPTION = 'encryption',
  MEDIA = 'media',
  MESSAGING = 'messaging',
  UNKNOWN = 'unknown'
}

// Severity levels
export enum ErrorSeverity {
  DEBUG = 'debug',
  INFO = 'info',
  WARNING = 'warning',
  ERROR = 'error',
  CRITICAL = 'critical'
}

// Structure for error context
interface ErrorContext {
  userId?: string;
  groupId?: string;
  messageId?: string;
  componentName?: string;
  action?: string;
  [key: string]: any;
}

// Configuration for the error service
interface ErrorServiceConfig {
  environment: 'development' | 'staging' | 'production';
  sentryDsn?: string;
  consoleEnabled: boolean;
  telemetryEnabled: boolean;
  maxRetries: number;
}

// Default configuration
const defaultConfig: ErrorServiceConfig = {
  environment: import.meta.env.MODE as 'development' | 'staging' | 'production',
  sentryDsn: import.meta.env.VITE_SENTRY_DSN,
  consoleEnabled: import.meta.env.MODE !== 'production',
  telemetryEnabled: import.meta.env.MODE === 'production',
  maxRetries: 3
};

/**
 * Error Reporting Service
 */
class ErrorReportingService {
  private config: ErrorServiceConfig;
  private initialized: boolean = false;
  private pendingErrors: Array<{
    error: Error | string;
    category: ErrorCategory;
    severity: ErrorSeverity;
    context?: ErrorContext;
  }> = [];

  constructor(config: Partial<ErrorServiceConfig> = {}) {
    this.config = { ...defaultConfig, ...config };
    this.initialize();
  }

  /**
   * Initialize the error reporting service and Sentry if available
   */
  private initialize(): void {
    try {
      if (this.config.telemetryEnabled && this.config.sentryDsn) {
        Sentry.init({
          dsn: this.config.sentryDsn,
          environment: this.config.environment,
          tracesSampleRate: this.config.environment === 'production' ? 0.2 : 1.0,
          beforeSend: (event) => {
            // Remove any sensitive data before sending to Sentry
            if (event.extra) {
              // Sanitize passwords, tokens, etc.
              if (event.extra.password) event.extra.password = '[REDACTED]';
              if (event.extra.token) event.extra.token = '[REDACTED]';
              if (event.extra.apiKey) event.extra.apiKey = '[REDACTED]';
            }
            return event;
          }
        });
        
        console.log('Sentry initialized for error tracking');
      } else {
        console.log('Sentry disabled or not configured');
      }

      this.initialized = true;
      
      // Process any errors that occurred before initialization
      this.processPendingErrors();
      
    } catch (error) {
      console.error('Failed to initialize error reporting:', error);
      // We're in the error service, so we can't report this error
    }
  }

  /**
   * Process any errors that were captured before initialization
   */
  private processPendingErrors(): void {
    if (this.pendingErrors.length > 0) {
      console.log(`Processing ${this.pendingErrors.length} pending errors`);
      
      this.pendingErrors.forEach(({ error, category, severity, context }) => {
        this.reportError(error, category, severity, context);
      });
      
      this.pendingErrors = [];
    }
  }

  /**
   * Report an error to the error service
   */
  public reportError(
    error: Error | string,
    category: ErrorCategory = ErrorCategory.UNKNOWN,
    severity: ErrorSeverity = ErrorSeverity.ERROR,
    context?: ErrorContext
  ): void {
    if (!this.initialized) {
      // Queue the error for later if not initialized
      this.pendingErrors.push({ error, category, severity, context });
      return;
    }

    // Convert string to Error if needed
    const errorObject = typeof error === 'string' ? new Error(error) : error;
    
    // Include more context in the error
    const errorWithContext: any = errorObject;
    
    if (context) {
      errorWithContext.category = category;
      errorWithContext.severity = severity;
      errorWithContext.context = context;
    }

    try {
      // Console logging for development
      if (this.config.consoleEnabled) {
        const logMethod = this.getLogMethodForSeverity(severity);
        
        console.group(`[${category.toUpperCase()}] ${errorObject.message}`);
        logMethod(errorObject);
        
        if (context) {
          console.log('Context:', context);
        }
        
        console.groupEnd();
      }

      // Report to Sentry in production
      if (this.config.telemetryEnabled && this.config.sentryDsn) {
        Sentry.withScope((scope) => {
          scope.setLevel(this.getSentryLevel(severity));
          scope.setTag('category', category);
          
          if (context) {
            // Add context as extra data
            Object.keys(context).forEach((key) => {
              scope.setExtra(key, context[key]);
            });
            
            // Set user context if available
            if (context.userId) {
              scope.setUser({ id: context.userId });
            }
          }
          
          Sentry.captureException(errorObject);
        });
      }
    } catch (reportingError) {
      // Last resort - just log to console
      console.error('Error in error reporting service:', reportingError);
      console.error('Original error:', errorObject);
    }
  }

  /**
   * Get the appropriate console logging method for the given severity
   */
  private getLogMethodForSeverity(severity: ErrorSeverity) {
    switch (severity) {
      case ErrorSeverity.DEBUG:
        return console.debug;
      case ErrorSeverity.INFO:
        return console.info;
      case ErrorSeverity.WARNING:
        return console.warn;
      case ErrorSeverity.ERROR:
      case ErrorSeverity.CRITICAL:
        return console.error;
      default:
        return console.log;
    }
  }

  /**
   * Convert our severity level to Sentry's level format
   */
  private getSentryLevel(severity: ErrorSeverity): Sentry.SeverityLevel {
    switch (severity) {
      case ErrorSeverity.DEBUG:
        return 'debug';
      case ErrorSeverity.INFO:
        return 'info';
      case ErrorSeverity.WARNING:
        return 'warning';
      case ErrorSeverity.ERROR:
        return 'error';
      case ErrorSeverity.CRITICAL:
        return 'fatal';
      default:
        return 'error';
    }
  }

  /**
   * Set user ID for error context
   */
  public setUser(userId: string | null): void {
    if (this.config.telemetryEnabled && this.config.sentryDsn) {
      if (userId) {
        Sentry.setUser({ id: userId });
      } else {
        Sentry.setUser(null);
      }
    }
  }

  /**
   * Create an error boundary component for React
   */
  public getErrorBoundary() {
    return Sentry.ErrorBoundary;
  }

  /**
   * Manually capture a message (for non-error events)
   */
  public captureMessage(
    message: string, 
    level: ErrorSeverity = ErrorSeverity.INFO,
    context?: ErrorContext
  ): void {
    if (this.config.consoleEnabled) {
      const logMethod = this.getLogMethodForSeverity(level);
      logMethod(`[MESSAGE] ${message}`, context);
    }
    
    if (this.config.telemetryEnabled && this.config.sentryDsn) {
      Sentry.withScope((scope) => {
        scope.setLevel(this.getSentryLevel(level));
        
        if (context) {
          // Add context as extra data
          Object.keys(context).forEach((key) => {
            scope.setExtra(key, context[key]);
          });
          
          // Set user context if available
          if (context.userId) {
            scope.setUser({ id: context.userId });
          }
        }
        
        Sentry.captureMessage(message);
      });
    }
  }
}

// Export a singleton instance
export const errorReporting = new ErrorReportingService();

// Optional: Export a React error boundary component
export const ErrorBoundary = errorReporting.getErrorBoundary();

export default errorReporting;