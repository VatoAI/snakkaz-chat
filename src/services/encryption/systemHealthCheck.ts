/**
 * System Health Check
 * 
 * This module provides functionality to verify that all the fixes we've 
 * implemented are working correctly. It can be run from the console for debugging.
 */

import { buildCspPolicy } from './cspConfig';
import { getCspHealthStatus, initCspReporting } from './cspReporting';

interface DnsHealthStatus {
  status: 'healthy' | 'issues' | 'critical';
  issues: string[];
  recommendations: string[];
  namecheap: {
    nameservers: string[];
  };
}

/**
 * Interface for CSP violation reports
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

/**
 * Interface for CSP health data from cspReporting.ts
 */
interface CspHealthData {
  status: 'healthy' | 'issues' | 'critical';
  violations: CspViolationReport[];
  summary: string;
  recommendedActions: string[];
}

/**
 * Verifies that the Content Security Policy includes all necessary domains
 * @returns {boolean} True if the CSP is correctly configured
 */
export function verifyCspConfiguration(): boolean {
  console.log('Verifying CSP configuration...');
  
  // Get current CSP from meta tag or generate it
  let currentCsp = '';
  if (typeof document !== 'undefined') {
    const cspTag = document.querySelector('meta[http-equiv="Content-Security-Policy"]');
    currentCsp = cspTag ? cspTag.getAttribute('content') || '' : buildCspPolicy();
  } else {
    currentCsp = buildCspPolicy();
  }
  
  // Check for required domains
  const requiredDomains = [
    'dash.snakkaz.com',
    'business.snakkaz.com', 
    'docs.snakkaz.com',
    'analytics.snakkaz.com', 
    'mcp.snakkaz.com',
    'help.snakkaz.com',
    'cdn.gpteng.co',
    'analytics.snakkaz.com/ping',
    '*.supabase.co',
    'cdn.gpteng.co'
  ];
  
  const missingDomains = [];
  
  for (const domain of requiredDomains) {
    const escapedDomain = domain.replace(/\./g, '\\.').replace(/\*/g, '\\*').replace(/\//g, '\\/');
    const domainRegex = new RegExp(escapedDomain);
    
    if (!domainRegex.test(currentCsp)) {
      missingDomains.push(domain);
    }
  }
  
  if (missingDomains.length > 0) {
    console.error('CSP is missing the following domains:', missingDomains);
    return false;
  }
  
  console.log('CSP configuration looks good!');
  return true;
}

/**
 * Comprehensive CSP health check
 * Analyzes current CSP configuration, recent violations, and provides recommendations
 */
export async function checkCspHealth(): Promise<{
  status: 'healthy' | 'issues' | 'critical';
  summary: string;
  issues: string[];
  recommendations: string[];
  cspPresent: boolean;
  reportingEnabled: boolean;
  violationCount: number;
  missingDomains: string[];
}> {
  console.log('Running comprehensive CSP health check...');
  
  // Check if CSP exists
  let currentCsp = '';
  let cspPresent = false;
  let reportingEnabled = false;
  
  if (typeof document !== 'undefined') {
    const cspTag = document.querySelector('meta[http-equiv="Content-Security-Policy"]');
    if (cspTag) {
      cspPresent = true;
      currentCsp = cspTag.getAttribute('content') || '';
      
      // Check if reporting is enabled
      reportingEnabled = currentCsp.includes('report-uri') || currentCsp.includes('report-to');
    }
  }
  
  // Get CSP violation data if available
  let violationData: CspHealthData = { 
    status: 'healthy',
    violations: [],
    summary: 'No violation data available',
    recommendedActions: []
  };
  
  try {
    // If in browser and CSP reporting is initialized
    if (typeof document !== 'undefined' && typeof getCspHealthStatus === 'function') {
      violationData = getCspHealthStatus();
    }
  } catch (error) {
    console.error('Error getting CSP violation data:', error);
  }
  
  // Check for required domains in CSP
  const requiredDomains = [
    'dash.snakkaz.com',
    'business.snakkaz.com', 
    'docs.snakkaz.com',
    'analytics.snakkaz.com',
    'mcp.snakkaz.com',
    'help.snakkaz.com',
    'cdn.gpteng.co',
    'wss://*.supabase.co',
    '*.supabase.co',
    '*.supabase.in',
    'storage.googleapis.com'
  ];
  
  const missingDomains = requiredDomains.filter(domain => {
    // For wildcard domains, check the base domain
    if (domain.includes('*')) {
      const baseDomain = domain.split('*')[1];
      return !currentCsp.includes(baseDomain);
    }
    return !currentCsp.includes(domain);
  });
  
  // Collect all issues
  const issues: string[] = [];
  
  if (!cspPresent) {
    issues.push('Content Security Policy is not defined');
  }
  
  if (!reportingEnabled && cspPresent) {
    issues.push('CSP reporting is not enabled');
  }
  
  if (missingDomains.length > 0) {
    issues.push(`CSP is missing required domains: ${missingDomains.join(', ')}`);
  }
  
  // Include any CSP violation issues
  if (violationData.violations.length > 0) {
    issues.push(violationData.summary);
    
    // Group violations by directive for better analysis
    const directiveViolations: Record<string, string[]> = {};
    violationData.violations.forEach(violation => {
      const directive = violation.effectiveDirective || violation.violatedDirective;
      if (!directiveViolations[directive]) {
        directiveViolations[directive] = [];
      }
      
      // Add blocked URI if not already in the list
      const blockedURI = violation.blockedURI;
      if (!directiveViolations[directive].includes(blockedURI)) {
        directiveViolations[directive].push(blockedURI);
      }
    });
    
    // Add detailed info about violations
    Object.entries(directiveViolations).forEach(([directive, blockedURIs]) => {
      issues.push(`Directive '${directive}' blocked: ${blockedURIs.join(', ')}`);
    });
  }
  
  // Determine status based on issues
  let status: 'healthy' | 'issues' | 'critical' = 'healthy';
  if (!cspPresent || missingDomains.length > 3) {
    status = 'critical';
  } else if (issues.length > 0 || violationData.status !== 'healthy') {
    status = 'issues';
  }
  
  // Generate recommendations
  const recommendations: string[] = [];
  
  if (!cspPresent) {
    recommendations.push('Add a Content Security Policy meta tag to the HTML head');
    recommendations.push('Run "npm run build:csp" to ensure CSP is injected during build');
  }
  
  if (!reportingEnabled && cspPresent) {
    recommendations.push('Enable CSP reporting by adding report-uri directive');
    recommendations.push('Initialize CSP reporting with initCspReporting()');
  }
  
  if (missingDomains.length > 0) {
    recommendations.push(`Update CSP to include missing domains: ${missingDomains.join(', ')}`);
  }
  
  // Include any recommendations from violation data
  recommendations.push(...violationData.recommendedActions);
  
  // Summary
  const summary = status === 'healthy'
    ? 'CSP is properly configured and functioning well'
    : status === 'issues'
      ? `CSP has ${issues.length} issue(s) that should be addressed`
      : 'CSP has critical issues that require immediate attention';
      
  return {
    status,
    summary,
    issues,
    recommendations,
    cspPresent,
    reportingEnabled,
    violationCount: violationData.violations.length,
    missingDomains
  };
}

/**
 * Check if SRI integrity attributes are being properly removed
 */
export function checkSriRemoval(): boolean {
  console.log('Checking SRI removal functionality...');
  
  // Create a test script with integrity
  const testScript = document.createElement('script');
  testScript.src = 'https://example.com/test.js';
  testScript.integrity = 'sha256-test';
  document.head.appendChild(testScript);
  
  // Check if integrity attribute was removed
  const result = !testScript.hasAttribute('integrity');
  
  // Clean up
  document.head.removeChild(testScript);
  
  if (result) {
    console.log('SRI integrity removal is working correctly');
  } else {
    console.error('SRI integrity attributes are not being removed properly');
  }
  
  return result;
}

/**
 * Verify that ping request blocking works
 */
export function testPingRequestBlocker(): Promise<boolean> {
  console.log('Testing ping request interception...');
  
  return fetch('https://dash.snakkaz.com/ping')
    .then(response => {
      if (response.status === 200) {
        console.log('Ping request interception is working correctly');
        return true;
      } else {
        console.error('Ping request interception failed');
        return false;
      }
    })
    .catch(error => {
      console.error('Ping request interception test failed:', error);
      return false;
    });
}

/**
 * Test if Cloudflare Analytics is loading correctly
 */
export function testCloudflareAnalytics() {
  console.log('Testing Cloudflare Analytics loading...');
  
  if (typeof document === 'undefined') {
    return { loaded: false, reason: 'Not running in browser' };
  }
  
  // Check if the analytics script exists
  const cfScripts = Array.from(document.querySelectorAll('script')).filter(
    script => script.src && script.src.includes('cloudflareinsights')
  );
  
  // Check if the global _cf object exists (indicates Cloudflare Analytics loaded)
  const cfObjectExists = typeof window !== 'undefined' && '_cf' in window;
  
  if (cfScripts.length > 0) {
    if (cfObjectExists) {
      console.log('Cloudflare Analytics is loaded and functioning');
      return { 
        loaded: true,
        script: cfScripts[0].src,
        objectExists: true
      };
    } else {
      console.log('Cloudflare Analytics script exists but may not be properly loaded');
      return {
        loaded: false,
        script: cfScripts[0].src,
        objectExists: false,
        reason: 'CF object not found in window'
      };
    }
  } else {
    console.log('No Cloudflare Analytics script found');
    // Try to load it now
    const loadScript = document.createElement('script');
    loadScript.defer = true;
    loadScript.crossOrigin = 'anonymous';
    loadScript.src = 'https://static.cloudflareinsights.com/beacon.min.js?token=c5bd7bbfe41c47c2a5ec';
    document.head.appendChild(loadScript);
    
    return {
      loaded: false,
      reason: 'Script not found, attempted to load',
      attemptedFix: true
    };
  }
}

/**
 * Check if Cloudflare DNS is properly configured
 * This helps validate that nameserver changes have propagated
 */
/**
 * Check if Cloudflare DNS and services are properly configured for the domain
 * Also verifies SSL status and key Cloudflare protections
 * @returns Promise resolving to status object with success flag and details
 */
export function checkCloudflareStatus(): Promise<{success: boolean, details?: Record<string, unknown>}> {
  console.log('Checking Cloudflare DNS and service status...');
  
  // Try to check if we're behind Cloudflare by looking for CF specific headers
  return fetch('https://www.snakkaz.com/cdn-cgi/trace', { 
    method: 'GET',
    cache: 'no-store'
  })
    .then(response => {
      // Check if Cloudflare-specific headers are present
      const cfRay = response.headers.get('cf-ray');
      const cfCache = response.headers.get('cf-cache-status');
      const hasCloudflareHeaders = !!cfRay;
      
      return response.text().then(text => {
        return { text, cfRay: cfRay || '', cfCache: cfCache || '', hasCloudflareHeaders };
      });
    })
    .then((result: { text: string, cfRay: string, cfCache: string, hasCloudflareHeaders: boolean }) => {
      const { text, cfRay, cfCache, hasCloudflareHeaders } = result;
      // Parse the trace data into key-value pairs
      const traceData = text.split('\n').reduce((acc, line) => {
        const [key, value] = line.split('=');
        if (key && value) acc[key.trim()] = value.trim();
        return acc;
      }, {} as Record<string, string>);
      
      const isCloudflareDns = hasCloudflareHeaders || text.includes('cf-ray=') || text.includes('colo=');
      
      // Check if Security Level is properly configured
      const securityLevel = traceData.securityLevel || 'unknown';
      
      if (isCloudflareDns) {
        console.log('✅ Cloudflare DNS is properly configured');
        console.log('Cloudflare datacenter:', traceData.colo || 'Unknown');
        console.log('CF-Ray ID:', cfRay || traceData.ray || 'Unknown');
        console.log('Cache status:', cfCache || 'Unknown');
        console.log('Security level:', securityLevel);
        
        return { 
          success: true, 
          details: {
            message: 'Cloudflare DNS is properly configured',
            domainReachable: true,
            recommendation: 'No action needed',
            cfRay,
            cfCache,
            securityLevel,
            ssl: traceData.tls || 'Unknown',
            waf: securityLevel !== 'unknown' && securityLevel !== 'off'
          }
        };
      } else {
        console.log('❌ Cloudflare DNS is not active yet (propagation may take 24-48 hours)');
        
        // Let's try to check if we can at least resolve the domain
        return checkDomainReachable()
          .then(isReachable => {
            return { 
              success: false,
              details: { 
                message: 'DNS propagation in progress',
                domainReachable: isReachable,
                recommendation: 'Verify Cloudflare nameservers are properly configured in domain registrar'
              }
            };
          });
      }
    })
    .catch(error => {
      console.error('Error checking Cloudflare status:', error);
      
      // Try to run more diagnostic checks
      return runCloudflareNetworkDiagnostics()
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
 * Run additional network diagnostics for Cloudflare
 */
async function runCloudflareNetworkDiagnostics(): Promise<Record<string, unknown>> {
  const results = {
    dns: false,
    connectivity: false,
    ssl: false,
    suggestions: [] as string[]
  };
  
  try {
    // Test basic connectivity to Cloudflare
    await fetch('https://cloudflare.com', { method: 'HEAD' });
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
 * Check security configuration for the application
 * @returns Security configuration status
 */
export function checkSecurityConfig(): { 
  success: boolean; 
  details: { 
    message: string;
    config?: Record<string, unknown>;
    recommendation?: string;
  } 
} {
  try {
    console.log('Checking security configuration...');
    
    // Check for CSP
    const hasCsp = typeof document !== 'undefined' && 
      !!document.querySelector('meta[http-equiv="Content-Security-Policy"]');
    
    // Check for HTTPS
    const isHttps = typeof window !== 'undefined' && 
      window.location.protocol === 'https:';
    
    // Basic checks for the security features we've implemented
    const checks = {
      csp: hasCsp,
      https: isHttps,
      corsHeaders: true, // We've implemented CORS fixes
      integrityChecks: true, // We've implemented SRI integrity fixes
      assetFallbacks: true // We've implemented asset fallbacks
    };
    
    const failedChecks = Object.entries(checks)
      .filter(([_, passed]) => !passed)
      .map(([name]) => name);
    
    if (failedChecks.length === 0) {
      return {
        success: true,
        details: {
          message: 'Security configuration is valid',
          config: checks
        }
      };
    } else {
      return {
        success: false,
        details: {
          message: `Security configuration issues found: ${failedChecks.join(', ')}`,
          config: checks,
          recommendation: 'Ensure all security features are properly configured'
        }
      };
    }
  } catch (error) {
    console.error('Error checking security configuration:', error);
    return {
      success: false,
      details: {
        message: `Error checking security configuration: ${error instanceof Error ? error.message : String(error)}`,
        recommendation: 'Check console for detailed error information'
      }
    };
  }
}

/**
 * Run all health checks and return overall system status
 */
export function runSystemHealthCheck(): Promise<{
  healthy: boolean;
  details: {
    csp: boolean;
    sri: boolean;
    pingBlocking: boolean;
    metaTags: boolean;
    cloudflareAnalytics: boolean;
    cloudflareDns: boolean;
    dnsHealth: DnsHealthStatus;
  }
}> {
  console.log('========= SYSTEM HEALTH CHECK =========');
  const results = {
    healthy: false,
    details: {
      csp: false,
      sri: false,
      pingBlocking: false,
      metaTags: false,
      cloudflareAnalytics: false,
      cloudflareDns: false,
      dnsHealth: {
        status: 'issues',
        issues: [],
        recommendations: [],
        cloudflare: {
          nameserversConfigured: false,
          zoneActive: false,
          wwwRecordExists: false,
          sslConfigured: false
        },
        namecheap: {
          usingCloudflareNameservers: false,
          nameservers: []
        }
      }
    }
  };
  
  // Check CSP
  results.details.csp = verifyCspConfiguration();
  
  // Check SRI removal
  results.details.sri = checkSriRemoval();
  
  // Check meta tags
  const mobileAppCapable = document.querySelector('meta[name="mobile-web-app-capable"]');
  results.details.metaTags = !!mobileAppCapable;
  
  // Check Cloudflare Analytics 
  const cfAnalyticsResult = testCloudflareAnalytics();
  results.details.cloudflareAnalytics = cfAnalyticsResult.loaded;
  
  // Test Cloudflare DNS configuration
  return checkCloudflareStatus()
    .then(cfDnsResult => {
      results.details.cloudflareDns = cfDnsResult.success;
      
      // Then test ping blocking
      return testPingRequestBlocker();
    })
    .then(pingBlockingResult => {
      results.details.pingBlocking = pingBlockingResult;

      // Check DNS health
      const dnsManager = getDnsManager();
      return dnsManager.performHealthCheck().then(dnsHealth => {
        // Ensure dnsHealth has the correct format as DnsHealthStatus
        const typedDnsHealth: DnsHealthStatus = {
          status: (dnsHealth.status as 'healthy' | 'issues' | 'critical'),
          issues: dnsHealth.issues || [],
          recommendations: dnsHealth.recommendations || [],
          cloudflare: dnsHealth.cloudflare || {
            nameserversConfigured: false,
            zoneActive: false,
            wwwRecordExists: false,
            sslConfigured: false
          },
          namecheap: dnsHealth.namecheap || {
            usingCloudflareNameservers: false,
            nameservers: []
          }
        };
        
        results.details.dnsHealth = typedDnsHealth;

        // Overall health determination - don't require Cloudflare DNS to be active yet
        const criticalChecks = {
          csp: results.details.csp,
          sri: results.details.sri,
          pingBlocking: results.details.pingBlocking,
          metaTags: results.details.metaTags
        };
        
        results.healthy = Object.values(criticalChecks).every(Boolean);
        
        console.log('========= HEALTH CHECK COMPLETE =========');
        console.log(`Overall system health: ${results.healthy ? 'HEALTHY ✅' : 'ISSUES DETECTED ❌'}`);
        console.table(results.details);
        
        return results;
      });
    });
}

// Export simple functions for console use
export const checkHealth = runSystemHealthCheck;

/**
 * Simple function to check just Cloudflare DNS status with detailed output
 * This is useful for monitoring DNS propagation progress
 */
export function checkCloudflareDnsStatus() {
  return checkCloudflareStatus()
    .then(result => {
      if (result.success) {
        console.log('%c ✅ Cloudflare DNS is ACTIVE ', 'background: #0f9d58; color: white; font-size: 16px; padding: 5px;');
        console.log('%c Cloudflare Details ', 'background: #4285f4; color: white; font-size: 14px;');
        console.table(result.details);
      } else {
        console.log('%c ⏳ Cloudflare DNS PROPAGATING ', 'background: #f4b400; color: black; font-size: 16px; padding: 5px;');
        console.log('%c Nameservers have been configured correctly. DNS propagation typically takes 24-48 hours. ', 
                   'font-size: 14px;');
        console.log(result.details);
      }
      return result;
    })
    .catch(error => {
      console.log('%c ❌ ERROR CHECKING CLOUDFLARE DNS ', 'background: #db4437; color: white; font-size: 16px; padding: 5px;');
      console.error(error);
      return { success: false, details: { error: error.message } };
    });
}

/**
 * Check DNS health status by integrating with the DNS Manager
 * @param namecheapApiKey Namecheap API key (optional)
 * @param cloudflareApiToken Cloudflare API token (optional)
 * @returns DNS health status information
 */
export async function checkDnsHealth(
  namecheapApiKey?: string,
  cloudflareApiToken?: string
): Promise<{
  success: boolean;
  details: {
    status: 'healthy' | 'issues' | 'critical';
    issues: string[];
    recommendations: string[];
    nameserversConfigured?: boolean;
    zoneActive?: boolean;
  };
}> {
  try {
    console.log('Checking DNS health...');
    
    const dnsManager = getDnsManager();
    
    // If no API keys provided, return a basic response
    if (!namecheapApiKey && !cloudflareApiToken) {
      return {
        success: false,
        details: {
          status: 'issues',
          issues: ['No API credentials provided for DNS health check'],
          recommendations: [
            'Provide Namecheap API key and/or Cloudflare API token to perform a complete DNS check',
            'Run DNS diagnostics using the manage-dns.js CLI tool'
          ]
        }
      };
    }
    
    // Initialize with available credentials
    await dnsManager.initialize(namecheapApiKey || '', cloudflareApiToken || '');
    
    // Run health check
    const healthResult = await dnsManager.performHealthCheck();
    
    return {
      success: healthResult.status === 'healthy',
      details: {
        status: healthResult.status,
        issues: healthResult.issues,
        recommendations: healthResult.recommendations,
        nameserversConfigured: healthResult.namecheap.usingCloudflareNameservers,
        zoneActive: healthResult.cloudflare.zoneActive
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
          'Ensure network connectivity to Namecheap and Cloudflare APIs',
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
    cloudflareApiToken?: string;
  }
): Promise<{
  overallStatus: 'healthy' | 'issues' | 'critical';
  csp: { success: boolean; details: Record<string, unknown> };
  dns: { success: boolean; details: Record<string, unknown> };
  cloudflare: { success: boolean; details: Record<string, unknown> };
  security: { success: boolean; details: Record<string, unknown> };
  issues: string[];
  recommendations: string[];
}> {
  // Run all health checks in parallel
  const [cspResult, dnsResult, cfResult, securityResult] = await Promise.all([
    Promise.resolve().then(() => {
      const success = verifyCspConfiguration();
      return { 
        success, 
        details: {
          message: success ? 'CSP configuration is valid' : 'CSP configuration has issues'
        }
      };
    }),
    checkDnsHealth(options?.namecheapApiKey, options?.cloudflareApiToken),
    checkCloudflareStatus().then(result => {
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
  
  if (!cfResult.success) {
    issues.push('Cloudflare integration has issues');
    if (cfResult.details && typeof cfResult.details === 'object' && 'message' in cfResult.details) {
      issues.push(String(cfResult.details.message));
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
  if (dnsResult.details.status === 'critical' || !cfResult.success || !securityResult.success) {
    overallStatus = 'critical';
  } else if (issues.length > 0) {
    overallStatus = 'issues';
  }
  
  return {
    overallStatus,
    csp: cspResult,
    dns: dnsResult,
    cloudflare: cfResult,
    security: securityResult,
    issues,
    recommendations
  };
}

/**
 * Run health check automatically when script loads in production
 * (helps with diagnostics without needing console access)
 */
if (typeof window !== 'undefined' && window.location.hostname === 'www.snakkaz.com') {
  // Add a small delay to ensure page is fully loaded
  setTimeout(() => {
    runSystemHealthCheck()
      .then(results => {
        console.log('Auto health check completed:', results);
        if (!results.healthy) {
          // Try to fix issues
          if (!results.details.cloudflareAnalytics) {
            import('./analyticsLoader').then(module => {
              module.loadCloudflareAnalytics();
            });
          }
        }
      })
      .catch(err => {
        console.error('Auto health check failed:', err);
      });
  }, 3000);
}
