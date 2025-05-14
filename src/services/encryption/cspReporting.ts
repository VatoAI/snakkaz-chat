/**
 * CSP Violation Reporting System
 * 
 * This module provides:
 * 1. A client-side handler for CSP violation reports
 * 2. Integration with the system health check
 * 3. Logging and analytics for CSP violations
 * 
 * Updated: May 14, 2025 - Removed Cloudflare dependencies
 */

interface CspViolationReport {
  documentURI: string;
  referrer: string;
  blockedURI: string;
  violatedDirective: string;
  effectiveDirective: string;
  originalPolicy: string;
  disposition: string;
  sourceFile?: string;
  lineNumber?: number;
  columnNumber?: number;
  statusCode?: number;
}

interface CspViolationEvent extends Event {
  detail?: {
    originalEvent: SecurityPolicyViolationEvent;
    report: CspViolationReport;
  }
}

// Store recent violations for health monitoring
const recentViolations: CspViolationReport[] = [];
const MAX_STORED_VIOLATIONS = 50;

/**
 * Initialize CSP violation reporting
 */
export function initCspReporting(options: {
  reportToEndpoint?: string; 
  logToConsole?: boolean;
  logToAnalytics?: boolean;
} = {}): void {
  const { 
    reportToEndpoint = 'https://analytics.snakkaz.com/csp-report', 
    logToConsole = true,
    logToAnalytics = false // Deaktivert for å fjerne Cloudflare-avhengighet
  } = options;
  
  // Only run in browser environment
  if (typeof document === 'undefined') return;
  
  // Add report-uri and report-to directives if not already present
  updateCspWithReporting(reportToEndpoint);
  
  // Listen for CSP violations
  document.addEventListener('securitypolicyviolation', (e: SecurityPolicyViolationEvent) => {
    const report: CspViolationReport = {
      documentURI: e.documentURI,
      referrer: e.referrer,
      blockedURI: e.blockedURI,
      violatedDirective: e.violatedDirective,
      effectiveDirective: e.effectiveDirective,
      originalPolicy: e.originalPolicy,
      disposition: e.disposition,
      sourceFile: e.sourceFile,
      lineNumber: e.lineNumber,
      columnNumber: e.columnNumber,
      statusCode: e.statusCode
    };
    
    // Store for health check
    storeViolation(report);
    
    // Log to console if enabled
    if (logToConsole) {
      console.warn('CSP violation:', report);
    }
    
    // Log to analytics if enabled - using custom analytics instead of gtag
    if (logToAnalytics && typeof window !== 'undefined') {
      try {
        // Send to our custom analytics endpoint
        const analyticsEndpoint = 'https://analytics.snakkaz.com/events';
        fetch(analyticsEndpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            eventType: 'csp_violation',
            category: 'security',
            label: `${report.violatedDirective} | ${report.blockedURI}`,
            nonInteraction: true
          }),
          // Use keepalive to ensure the request completes even if the page navigates away
          keepalive: true
        }).catch(e => console.error('Analytics request failed:', e));
      } catch (error) {
        console.error('Failed to send CSP violation to analytics:', error);
      }
    }
    
    // Dispatch custom event for other listeners
    const customEvent = new CustomEvent('snakkaz:csp-violation', {
      detail: {
        originalEvent: e,
        report
      }
    });
    document.dispatchEvent(customEvent);
  });
  
  console.log('CSP violation reporting initialized');
}

/**
 * Update CSP meta tag with reporting directives
 */
function updateCspWithReporting(reportUri: string): void {
  const cspTag = document.querySelector('meta[http-equiv="Content-Security-Policy"]');
  if (!cspTag) return;
  
  let cspContent = cspTag.getAttribute('content') || '';
  
  // Only add report-uri if not already present
  if (!cspContent.includes('report-uri')) {
    cspContent += `; report-uri ${reportUri}`;
    cspTag.setAttribute('content', cspContent);
  }
  
  // Set up a report-to endpoint for newer browsers
  if (!cspContent.includes('report-to')) {
    const reportGroup = 'csp-endpoint';
    
    // Add reporting endpoint configuration
    const reportToHeader = {
      group: reportGroup,
      max_age: 86400,
      endpoints: [{ url: reportUri }]
    };
    
    // Create a script to set the Report-To header using a fetch request
    // This is a workaround since meta tags can't set Report-To
    const script = document.createElement('script');
    script.innerHTML = `
      (function() {
        try {
          const reportToValue = ${JSON.stringify(reportToHeader)};
          // Use sendBeacon to avoid CORS issues
          if (navigator.sendBeacon) {
            navigator.sendBeacon('${reportUri}/config', JSON.stringify(reportToValue));
          }
        } catch(e) {
          console.error('Failed to configure report-to:', e);
        }
      })();
    `;
    document.head.appendChild(script);
    
    // Update CSP with report-to directive
    cspContent += `; report-to ${reportGroup}`;
    cspTag.setAttribute('content', cspContent);
  }
}

/**
 * Store a CSP violation for health monitoring
 */
function storeViolation(report: CspViolationReport): void {
  recentViolations.unshift(report);
  
  // Limit the size of stored violations
  if (recentViolations.length > MAX_STORED_VIOLATIONS) {
    recentViolations.pop();
  }
}

/**
 * Get CSP health status - for integration with systemHealthCheck
 */
export function getCspHealthStatus(): {
  status: 'healthy' | 'issues' | 'critical';
  violations: CspViolationReport[];
  summary: string;
  recommendedActions: string[];
} {
  // Count violations by directive
  const directiveViolations: Record<string, number> = {};
  const blockedDomains: Record<string, number> = {};
  
  recentViolations.forEach(violation => {
    // Count by directive
    const directive = violation.effectiveDirective || violation.violatedDirective;
    directiveViolations[directive] = (directiveViolations[directive] || 0) + 1;
    
    // Count by blocked domain
    try {
      const domain = new URL(violation.blockedURI).hostname;
      blockedDomains[domain] = (blockedDomains[domain] || 0) + 1;
    } catch (e) {
      // Some blockedURIs aren't valid URLs (e.g., 'inline')
      const key = violation.blockedURI || 'unknown';
      blockedDomains[key] = (blockedDomains[key] || 0) + 1;
    }
  });
  
  // Determine health status
  let status: 'healthy' | 'issues' | 'critical' = 'healthy';
  const recommendedActions: string[] = [];
  
  if (recentViolations.length > 0) {
    if (recentViolations.length > 10) {
      status = 'critical';
      recommendedActions.push('Multiple CSP violations detected. Review and update the CSP policy.');
    } else {
      status = 'issues';
      recommendedActions.push('Some CSP violations detected. Monitor and update if persistent.');
    }
    
    // Add specific recommendations based on violated directives
    Object.entries(directiveViolations).forEach(([directive, count]) => {
      if (count > 3) {
        recommendedActions.push(`Frequent violations of the '${directive}' directive. Consider updating this directive.`);
      }
    });
    
    // Add domain-specific recommendations
    Object.entries(blockedDomains).forEach(([domain, count]) => {
      if (count > 3) {
        if (domain.includes('snakkaz.com')) {
          recommendedActions.push(`Frequent blocks for ${domain}. This is a Snakkaz subdomain that should be allowed.`);
        } else if (domain.includes('cloudflare') || domain.includes('supabase')) {
          recommendedActions.push(`Frequent blocks for ${domain}. This is a required service that should be allowed.`);
        } else if (count > 5) {
          recommendedActions.push(`Consider adding ${domain} to the CSP if it's a required resource.`);
        }
      }
    });
  } else {
    recommendedActions.push('No CSP violations detected. Continue monitoring.');
  }
  
  // Build summary
  const summary = recentViolations.length === 0
    ? 'No CSP violations detected. CSP functioning well.'
    : `${recentViolations.length} CSP violation(s) detected. Most frequent: ${
        Object.entries(directiveViolations)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 3)
          .map(([directive, count]) => `${directive} (${count})`)
          .join(', ')
      }`;
      
  return {
    status,
    violations: [...recentViolations],
    summary,
    recommendedActions
  };
}

/**
 * Clear stored CSP violations
 */
export function clearCspViolations(): void {
  recentViolations.length = 0;
}
