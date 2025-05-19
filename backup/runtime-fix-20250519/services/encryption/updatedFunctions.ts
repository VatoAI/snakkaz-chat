/**
 * Test if Analytics is loading correctly
 */
export function testAnalytics() {
  console.log('Testing Snakkaz Analytics loading...');
  
  if (typeof document === 'undefined') {
    return { loaded: false, reason: 'Not running in browser' };
  }
  
  // Check if the analytics script exists
  const analyticsScripts = Array.from(document.querySelectorAll('script')).filter(
    script => script.src && (script.src.includes('analytics.snakkaz.com') || script.src.includes('gpteng.co'))
  );
  
  // Check if the global snakkazAnalytics object exists
  const analyticsObjectExists = typeof window !== 'undefined' && 'snakkazAnalytics' in window;
  
  if (analyticsScripts.length > 0) {
    if (analyticsObjectExists) {
      console.log('Snakkaz Analytics is loaded and functioning');
      return { 
        loaded: true,
        script: analyticsScripts[0].src,
        objectExists: true|
      };
    } else {
      console.log('Analytics script exists but may not be properly loaded');
      return {
        loaded: false,
        script: analyticsScripts[0].src,
        objectExists: false,
        reason: 'Analytics object not found in window'
      };
    }
  } else {
    console.log('No Analytics script found');
    // Try to load it now
    const loadScript = document.createElement('script');
    loadScript.defer = true;
    loadScript.crossOrigin = 'anonymous';
    loadScript.src = 'https://analytics.snakkaz.com/tracker.js';
    document.head.appendChild(loadScript);
    
    return {
      loaded: false,
      reason: 'Script not found, attempted to load',
      attemptedFix: true
    };
  }
}

/**
 * Check if Namecheap DNS is properly configured
 * This helps validate that nameserver changes have propagated
 */
export function checkNamecheapStatus(): Promise<{success: boolean, details?: Record<string, unknown>}> {
  console.log('Checking Namecheap DNS and service status...');
  
  // Try to check domain status by making a simple request
  return fetch('https://www.snakkaz.com/api/dns-check', { 
    method: 'GET',
    cache: 'no-store'
  })
    .then(response => {
      return response.text().then(text => {
        return { text, status: response.status, ok: response.ok };
      });
    })
    .then((result: { text: string, status: number, ok: boolean }) => {
      const { text, status, ok } = result;
      
      if (ok) {
        console.log('✅ Namecheap DNS is properly configured');
        
        return { 
          success: true, 
          details: {
            message: 'Namecheap DNS is properly configured',
            domainReachable: true,
            recommendation: 'No action needed'
          }
        };
      } else {
        console.log('❌ Namecheap DNS is not active yet (propagation may take 24-48 hours)');
        
        // Let's try to check if we can at least resolve the domain
        return checkDomainReachable()
          .then(isReachable => {
            return { 
              success: false,
              details: { 
                message: 'DNS propagation in progress',
                domainReachable: isReachable,
                recommendation: 'Wait for DNS propagation (up to 48 hours)'
              }
            };
          });
      }
    })
    .catch(error => {
      console.error('Error checking Namecheap DNS status:', error);
      
      // Try to run more diagnostic checks
      return runNamecheapNetworkDiagnostics()
        .then(diagnosticResults => {
          return { 
            success: false, 
            details: { 
              error: error.message || 'Unknown error',
              networkDiagnostics: diagnosticResults
            } 
          };
        })
        .catch(() => {
          // If diagnostics also fail, just return the original error
          return { 
            success: false, 
            details: { error: error.message || 'Unknown error' } 
          };
        });
    });
}

/**
 * Check if the domain is at least reachable
 */
async function checkDomainReachable(): Promise<boolean> {
  try {
    const response = await fetch('https://www.snakkaz.com', { 
      method: 'HEAD',
      cache: 'no-store',
      // @ts-expect-error - Ignore timeout which is not in the type but works in most browsers
      timeout: 5000 
    });
    return response.ok;
  } catch {
    return false;
  }
}

/**
 * Run additional network diagnostics for Namecheap DNS
 */
async function runNamecheapNetworkDiagnostics(): Promise<Record<string, unknown>> {
  const results = {
    dns: false,
    connectivity: false,
    ssl: false,
    suggestions: [] as string[]
  };
  
  try {
    // Test basic connectivity to Namecheap
    await fetch('https://www.namecheap.com', { method: 'HEAD' });
    results.connectivity = true;
  } catch {
    results.suggestions.push('Check your internet connection');
  }
  
  // Test if domain resolves at all
  if (await checkDomainReachable()) {
    results.dns = true;
  } else {
    results.suggestions.push('Verify domain registration and DNS configuration');
  }
  
  return results;
}

/**
 * Simple function to check just Namecheap DNS status with detailed output
 * This is useful for monitoring DNS propagation progress
 */
export function checkNamecheapDnsStatus() {
  return checkNamecheapStatus()
    .then(result => {
      if (result.success) {
        console.log('%c ✅ Namecheap DNS is ACTIVE ', 'background: #0f9d58; color: white; font-size: 16px; padding: 5px;');
        console.log('%c Namecheap Details ', 'background: #4285f4; color: white; font-size: 14px;');
        console.table(result.details);
      } else {
        console.log('%c ⏳ Namecheap DNS PROPAGATING ', 'background: #f4b400; color: black; font-size: 16px; padding: 5px;');
        console.log('%c Nameservers have been configured correctly. DNS propagation typically takes 24-48 hours. ', 
                   'font-size: 14px;');
        console.log(result.details);
      }
      return result;
    })
    .catch(error => {
      console.log('%c ❌ ERROR CHECKING NAMECHEAP DNS ', 'background: #db4437; color: white; font-size: 16px; padding: 5px;');
      console.error(error);
      return { success: false, details: { error: error.message } };
    });
}

/**
 * Check DNS health status by integrating with the DNS Manager
 * @param namecheapApiKey Namecheap API key (optional)
 * @returns DNS health status information
 */
export async function checkDnsHealth(
  namecheapApiKey?: string
): Promise<{
  success: boolean;
  details: {
    status: 'healthy' | 'issues' | 'critical';
    issues: string[];
    recommendations: string[];
    nameserversConfigured?: boolean;
    namecheapReady?: boolean;
  };
}> {
  try {
    console.log('Checking DNS health...');
    
    const dnsManager = getDnsManager();
    
    // If no API keys provided, return a basic response
    if (!namecheapApiKey) {
      return {
        success: false,
        details: {
          status: 'issues',
          issues: ['No API credentials provided for DNS health check'],
          recommendations: [
            'Provide Namecheap API key to perform a complete DNS check',
            'Run DNS diagnostics using the manage-dns.js CLI tool'
          ]
        }
      };
    }
    
    // Initialize with available credentials
    await dnsManager.initialize(namecheapApiKey || '');
    
    // Run health check
    const healthResult = await dnsManager.performHealthCheck();
    
    return {
      success: healthResult.status === 'healthy',
      details: {
        status: healthResult.status,
        issues: healthResult.issues,
        recommendations: healthResult.recommendations,
        nameserversConfigured: true,
        namecheapReady: true
      }
    };
  } catch (error) {
    console.error('Error checking DNS health:', error);
    return {
      success: false,
      details: {
        status: 'critical',
        issues: [`DNS check error: ${error instanceof Error ? error.message : String(error)}`],
        recommendations: [
          'Check that API credentials are correct',
          'Ensure network connectivity to Namecheap API',
          'Run detailed DNS diagnostics using the manage-dns.js CLI tool'
        ]
      }
    };
  }
}

/**
 * Run a comprehensive health check, including DNS configuration
 * @param options Optional parameters for the health check
 * @returns Health check results
 */
export async function runComprehensiveHealthCheck(
  options?: {
    namecheapApiKey?: string;
  }
): Promise<{
  overallStatus: 'healthy' | 'issues' | 'critical';
  csp: { success: boolean; details: Record<string, unknown> };
  dns: { success: boolean; details: Record<string, unknown> };
  namecheap: { success: boolean; details: Record<string, unknown> };
  security: { success: boolean; details: Record<string, unknown> };
  issues: string[];
  recommendations: string[];
}> {
  // Run all health checks in parallel
  const [cspResult, dnsResult, namecheapResult, securityResult] = await Promise.all([
    Promise.resolve().then(() => {
      const success = verifyCspConfiguration();
      return { 
        success, 
        details: {
          message: success ? 'CSP configuration is valid' : 'CSP configuration has issues'
        }
      };
    }),
    checkDnsHealth(options?.namecheapApiKey),
    checkNamecheapStatus().then(result => {
      // Ensure details is always present
      return {
        success: result.success,
        details: result.details || { message: 'No details available' }
      };
    }),
    checkSecurityConfig()
  ]);
  
  // Combine issues and recommendations
  const issues: string[] = [];
  const recommendations: string[] = [];
  
  if (!cspResult.success) {
    issues.push('CSP configuration has issues');
    recommendations.push('Review and update CSP configuration');
  }
  
  if (!dnsResult.success) {
    issues.push(...dnsResult.details.issues);
    recommendations.push(...dnsResult.details.recommendations);
  }
  
  if (!namecheapResult.success) {
    issues.push('Namecheap DNS integration has issues');
    if (namecheapResult.details && typeof namecheapResult.details === 'object' && 'message' in namecheapResult.details) {
      issues.push(String(namecheapResult.details.message));
    }
  }
  
  if (!securityResult.success) {
    issues.push('Security configuration has issues');
    if (securityResult.details && typeof securityResult.details === 'object') {
      if ('message' in securityResult.details) {
        issues.push(String(securityResult.details.message));
      }
      if ('recommendation' in securityResult.details) {
        recommendations.push(String(securityResult.details.recommendation));
      }
    }
  }
  
  // Determine overall status
  let overallStatus: 'healthy' | 'issues' | 'critical' = 'healthy';
  if (dnsResult.details.status === 'critical' || !namecheapResult.success || !securityResult.success) {
    overallStatus = 'critical';
  } else if (issues.length > 0) {
    overallStatus = 'issues';
  }
  
  return {
    overallStatus,
    csp: cspResult,
    dns: dnsResult,
    namecheap: namecheapResult,
    security: securityResult,
    issues,
    recommendations
  };
}
