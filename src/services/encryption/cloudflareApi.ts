/**
 * Cloudflare API Utilities
 * 
 * This file provides utility functions for interacting with the Cloudflare API,
 * enabling operations like cache purging, DNS management, and analytics retrieval.
 */

import { CLOUDFLARE_CONFIG, createCloudflareApiHeaders } from './cloudflareConfig';

/**
 * Interface for Cloudflare API responses
 */
interface CloudflareApiResponse {
  success: boolean;
  errors: any[];
  messages: string[];
  result?: any;
}

/**
 * Purge the cache for specific files
 * @param apiToken Cloudflare API token
 * @param files Array of file URLs to purge from cache
 * @returns API response
 */
export async function purgeCache(apiToken: string, files: string[]): Promise<CloudflareApiResponse> {
  try {
    const response = await fetch(`${CLOUDFLARE_CONFIG.apiBaseUrl}/zones/${CLOUDFLARE_CONFIG.zoneId}/purge_cache`, {
      method: 'POST',
      headers: createCloudflareApiHeaders(apiToken),
      body: JSON.stringify({ files })
    });
    
    return await response.json();
  } catch (error) {
    console.error('Error purging Cloudflare cache:', error);
    return {
      success: false,
      errors: [{ message: error.message }],
      messages: ['Failed to purge cache']
    };
  }
}

/**
 * Purge everything from Cloudflare's cache
 * @param apiToken Cloudflare API token
 * @returns API response
 */
export async function purgeEverything(apiToken: string): Promise<CloudflareApiResponse> {
  try {
    const response = await fetch(`${CLOUDFLARE_CONFIG.apiBaseUrl}/zones/${CLOUDFLARE_CONFIG.zoneId}/purge_cache`, {
      method: 'POST',
      headers: createCloudflareApiHeaders(apiToken),
      body: JSON.stringify({ purge_everything: true })
    });
    
    return await response.json();
  } catch (error) {
    console.error('Error purging entire Cloudflare cache:', error);
    return {
      success: false,
      errors: [{ message: error.message }],
      messages: ['Failed to purge entire cache']
    };
  }
}

/**
 * Get DNS records for the zone
 * @param apiToken Cloudflare API token
 * @returns API response with DNS records
 */
export async function getDnsRecords(apiToken: string): Promise<CloudflareApiResponse> {
  try {
    const response = await fetch(`${CLOUDFLARE_CONFIG.apiBaseUrl}/zones/${CLOUDFLARE_CONFIG.zoneId}/dns_records`, {
      method: 'GET',
      headers: createCloudflareApiHeaders(apiToken)
    });
    
    return await response.json();
  } catch (error) {
    console.error('Error getting DNS records:', error);
    return {
      success: false,
      errors: [{ message: error.message }],
      messages: ['Failed to retrieve DNS records']
    };
  }
}

/**
 * Get zone details
 * @param apiToken Cloudflare API token
 * @returns API response with zone details
 */
export async function getZoneDetails(apiToken: string): Promise<CloudflareApiResponse> {
  try {
    const response = await fetch(`${CLOUDFLARE_CONFIG.apiBaseUrl}/zones/${CLOUDFLARE_CONFIG.zoneId}`, {
      method: 'GET',
      headers: createCloudflareApiHeaders(apiToken)
    });
    
    return await response.json();
  } catch (error) {
    console.error('Error getting zone details:', error);
    return {
      success: false,
      errors: [{ message: error.message }],
      messages: ['Failed to retrieve zone details']
    };
  }
}

/**
 * Check if a Cloudflare API token is valid
 * @param apiToken Cloudflare API token to validate
 * @returns Boolean indicating if token is valid
 */
export async function validateApiToken(apiToken: string): Promise<boolean> {
  try {
    const response = await fetch(`${CLOUDFLARE_CONFIG.apiBaseUrl}/user/tokens/verify`, {
      method: 'GET',
      headers: createCloudflareApiHeaders(apiToken)
    });
    
    const data = await response.json();
    return data.success === true;
  } catch (error) {
    console.error('Error validating API token:', error);
    return false;
  }
}
