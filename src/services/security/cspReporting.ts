/**
 * CSP Reporting Service
 * 
 * Handles Content Security Policy violation reporting.
 * Updated version without Cloudflare dependencies.
 */

// Types for CSP report data
interface CspReportData {
  blockedUri?: string;
  columnNumber?: number;
  disposition?: string;
  documentUri?: string;
  effectiveDirective?: string;
  lineNumber?: number;
  originalPolicy?: string;
  referrer?: string;
  scriptSample?: string;
  sourceFile?: string;
  statusCode?: number;
  violatedDirective?: string;
}

interface CspViolationEvent extends Event {
  blockedURI: string;
  violatedDirective: string;
  originalPolicy: string;
  documentURI?: string;
  sourceFile?: string;
  lineNumber?: number;
  columnNumber?: number;
}

// Initialize CSP reporting
export function initCspReporting(options: {
  reportToEndpoint?: string; 
  logToConsole?: boolean;
  logToAnalytics?: boolean;
} = {}): void {
  const { 
    reportToEndpoint = 'https://analytics.snakkaz.com/csp-report', 
    logToConsole = true,
    logToAnalytics = false // Disabled to remove Cloudflare dependency
  } = options;

  // Skip if not in browser context
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    return;
  }
  
  try {
    // Set up listener for CSP violations
    document.addEventListener('securitypolicyviolation', (e: Event) => {
      const event = e as CspViolationEvent;
      
      // Format the report data
      const reportData: CspReportData = {
        blockedUri: event.blockedURI,
        violatedDirective: event.violatedDirective,
        originalPolicy: event.originalPolicy,
        documentUri: event.documentURI,
        sourceFile: event.sourceFile,
        lineNumber: event.lineNumber,
        columnNumber: event.columnNumber
      };
      
      // Log to console if enabled
      if (logToConsole) {
        console.warn('CSP Violation:', reportData);
      }
      
      // Send to reporting endpoint if available
      if (reportToEndpoint) {
        try {
          fetch(reportToEndpoint, {
            method: 'POST',
            body: JSON.stringify({ 
              'csp-report': reportData 
            }),
            headers: {
              'Content-Type': 'application/csp-report+json'
            },
            mode: 'no-cors'
          }).catch(err => {
            // Silent fail for reporting - don't block the app
            if (logToConsole) {
              console.error('Failed to send CSP report:', err);
            }
          });
        } catch (error) {
          // Silent fail for reporting - don't block the app
          if (logToConsole) {
            console.error('Error while reporting CSP violation:', error);
          }
        }
      }
    });
    
    console.log('CSP violation reporting initialized successfully');
  } catch (error) {
    console.error('Failed to initialize CSP reporting:', error);
  }
}
