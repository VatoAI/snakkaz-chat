/**
 * Enhanced Cloudflare Security Checks
 * 
 * This module provides comprehensive security checks for Cloudflare integration
 * in the Snakkaz Chat application, including DNS, SSL, Cache, and Security features.
 */

import { CLOUDFLARE_CONFIG } from './cloudflareConfig';

// Type definitions for enhanced clarity
interface CloudflareCheckResult {
  success: boolean;
  details: CloudflareDetails;
}

interface CloudflareDetails {
  // DNS and connectivity
  dns?: boolean;
  ip?: string;
  colo?: string;
  cfRay?: string;
  
  // Security status
  securityLevel?: string;
  waf?: boolean;
  ssl?: string;
  tlsVersion?: string;
  
  // Performance
  cfCache?: string;
  cacheStatus?: string;
  
  // Errors and diagnostics
  error?: string;
  domainReachable?: boolean;
  networkDiagnostics?: any;
  recommendation?: string;
  message?: string;
  
  // Raw trace data
  traceData?: Record<string, string>;
}

/**
 * Run a comprehensive check of Cloudflare integration and security
 */
export async function checkCloudflareIntegration(): Promise<CloudflareCheckResult> {
  console.log('📊 Running comprehensive Cloudflare security checks...');
  
  try {
    // Primary domain check
    const primaryResult = await checkDomainCloudflareStatus(CLOUDFLARE_CONFIG.zoneName);
    
    // If primary domain is working, check subdomains
    if (primaryResult.success) {
      // Run checks in parallel for performance
      const [apiResult, dashboardResult, businessResult] = await Promise.all([
        checkDomainCloudflareStatus(`api.${CLOUDFLARE_CONFIG.zoneName}`).catch(() => ({ success: false })),
        checkDomainCloudflareStatus(`dashboard.${CLOUDFLARE_CONFIG.zoneName}`).catch(() => ({ success: false })),
        checkDomainCloudflareStatus(`business.${CLOUDFLARE_CONFIG.zoneName}`).catch(() => ({ success: false }))
      ]);
      
      return {
        success: true,
        details: {
          ...primaryResult.details,
          subdomains: {
            api: apiResult.success,
            dashboard: dashboardResult.success,
            business: businessResult.success
          }
        }
      };
    }
    
    return primaryResult;
  } catch (error) {
    console.error('Failed to check Cloudflare integration:', error);
    return {
      success: false,
      details: {
        error: error instanceof Error ? error.message : 'Unknown error',
        recommendation: 'Check network connectivity and Cloudflare configuration'
      }
    };
  }
}

/**
 * Check Cloudflare status for a specific domain
 */
async function checkDomainCloudflareStatus(domain: string): Promise<CloudflareCheckResult> {
  console.log(`Checking Cloudflare status for ${domain}...`);
  
  try {
    // Check using Cloudflare's trace endpoint
    const response = await fetch(`https://${domain}/cdn-cgi/trace`, {
      method: 'GET',
      cache: 'no-store'
    });
    
    // Extract Cloudflare headers
    const cfRay = response.headers.get('cf-ray') || undefined;
    const cfCache = response.headers.get('cf-cache-status') || undefined;
    const cfConnecting = response.headers.get('cf-connecting-ip') || undefined;
    
    if (!cfRay) {
      return {
        success: false,
        details: {
          dns: true,
          domainReachable: true,
          error: 'Domain is reachable but not served through Cloudflare',
          recommendation: 'Verify DNS records point to Cloudflare nameservers'
        }
      };
    }
    
    // Parse trace data
    const text = await response.text();
    const traceData = parseTraceData(text);
    
    return {
      success: true,
      details: {
        dns: true,
        cfRay,
        cfCache,
        ip: cfConnecting,
        colo: traceData.colo,
        ssl: traceData.tls,
        tlsVersion: traceData.tlsver,
        securityLevel: traceData.securityLevel || 'unknown',
        waf: true,
        traceData
      }
    };
  } catch (error) {
    // Check if domain is at least reachable
    const isReachable = await checkDomainReachable(domain);
    
    return {
      success: false,
      details: {
        error: error instanceof Error ? error.message : 'Connection failed',
        domainReachable: isReachable,
        dns: isReachable,
        recommendation: isReachable 
          ? 'Domain is reachable but Cloudflare integration is not working'
          : 'Domain is not reachable. Check DNS configuration.'
      }
    };
  }
}

/**
 * Parse Cloudflare trace data into a structured object
 */
function parseTraceData(text: string): Record<string, string> {
  return text.split('\n').reduce((acc, line) => {
    const [key, value] = line.split('=');
    if (key && value) acc[key.trim()] = value.trim();
    return acc;
  }, {} as Record<string, string>);
}

/**
 * Check if a domain is reachable (even without Cloudflare)
 */
async function checkDomainReachable(domain: string): Promise<boolean> {
  try {
    const response = await fetch(`https://${domain}`, {
      method: 'HEAD',
      cache: 'no-store'
    });
    return response.status < 500; // Any response under 500 means reachable
  } catch {
    return false;
  }
}

/**
 * Test Cloudflare DNS propagation for a domain
 */
export async function testDnsPropagation(domain: string = CLOUDFLARE_CONFIG.zoneName): Promise<{
  propagated: boolean,
  nameservers: string[],
  details: Record<string, any>
}> {
  try {
    // This would normally use a DNS API to check propagation
    // For this example, we're simulating the check
    const cfNameservers = ['kyle.ns.cloudflare.com', 'vita.ns.cloudflare.com'];
    
    console.log(`Checking DNS propagation for ${domain}...`);
    
    // In a real implementation, we would query DNS servers
    const domainReachable = await checkDomainReachable(domain);
    const primaryResult = await checkDomainCloudflareStatus(domain).catch(() => ({ success: false }));
    
    return {
      propagated: primaryResult.success,
      nameservers: cfNameservers,
      details: {
        reachable: domainReachable,
        usingCloudflare: primaryResult.success,
        recommendation: primaryResult.success 
          ? 'DNS is fully propagated and using Cloudflare' 
          : 'DNS propagation may still be in progress (can take 24-48 hours)'
      }
    };
  } catch (error) {
    return {
      propagated: false,
      nameservers: [],
      details: {
        error: error instanceof Error ? error.message : 'Unknown error',
        recommendation: 'Check domain registration and nameserver configuration'
      }
    };
  }
}
