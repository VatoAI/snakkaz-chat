/**
 * Supabase Preview Environment Fix Utilities
 * 
 * This module provides utilities for working with Supabase preview branches
 * created by GitHub Actions workflow for testing changes in pull requests.
 * 
 * Preview branches are temporary database branches that allow testing database
 * changes in isolation before merging to the main branch.
 */

import { supabase } from '@/lib/supabase-singleton';
import { environment, checkSupabasePreviewStatus } from '@/config/environment';
import type { SupabaseClient } from '@supabase/supabase-js';
import { ENV } from '@/utils/env/environmentFix';

// Extend environment types to include preview properties
declare module '@/config/environment' {
  interface EnvironmentType {
    supabase: {
      url: string;
      anonKey: string;
      customDomain: string | null;
      preview?: {
        enabled: boolean;
        branch: string;
      };
    };
  }
}

/**
 * Preview branch information
 */
interface PreviewBranchInfo {
  enabled: boolean;
  branch: string | null;
  connectionStatus: 'unknown' | 'connected' | 'error';
  error?: string;
}

// Cache the preview status to avoid repeated checks
let previewStatus: PreviewBranchInfo | null = null;

/**
 * Apply fixes for Supabase preview environments
 * 
 * This function checks if we're running in a preview environment,
 * and applies necessary configuration adjustments.
 */
export async function applyPreviewFixes(): Promise<PreviewBranchInfo> {
  // If we already have the preview status cached, return it
  if (previewStatus) {
    return previewStatus;
  }
  
  // First check for a branch name in URL
  const urlBranch = checkBranchFromUrl();
  
  // Then check for a branch name in sessionStorage
  const storedBranch = typeof sessionStorage !== 'undefined' 
    ? sessionStorage.getItem('SUPABASE_PREVIEW_BRANCH') 
    : null;
  
  // Set the branch in environment if found in URL or sessionStorage
  if (urlBranch || storedBranch) {
    // Apply to process.env if available
    if (typeof process !== 'undefined' && process.env) {
      process.env.SUPABASE_BRANCH = urlBranch || storedBranch;
    }
    
    // Persist the branch in sessionStorage for future page loads
    if (typeof sessionStorage !== 'undefined' && urlBranch) {
      sessionStorage.setItem('SUPABASE_PREVIEW_BRANCH', urlBranch);
    }
  }
  
  // Check if we're using a preview branch (uses environment.ts function)
  const isPreviewEnabled = checkSupabasePreviewStatus();
  
  // Get branch name from environment
  let branchName: string | null = null;
  if (isPreviewEnabled && 'preview' in environment.supabase) {
    branchName = (environment.supabase.preview as { branch: string }).branch;
  }
  
  // Initialize preview info
  previewStatus = {
    enabled: isPreviewEnabled,
    branch: branchName,
    connectionStatus: 'unknown'
  };

  // If not a preview environment, just return the status
  if (!isPreviewEnabled) {
    // Still verify the connection to make sure the regular environment works
    try {
      const { error } = await supabase.auth.getSession();
      previewStatus.connectionStatus = error ? 'error' : 'connected';
      if (error) {
        previewStatus.error = `Regular connection error: ${error.message}`;
        console.error('Supabase connection error:', error.message);
      }
    } catch (err) {
      previewStatus.connectionStatus = 'error';
      previewStatus.error = `Unexpected error: ${err instanceof Error ? err.message : 'Unknown error'}`;
      console.error('Supabase unexpected error:', err);
    }
    return previewStatus;
  }

  // For preview environments, we need to verify the connection
  try {
    // Test the preview connection
    const { error } = await testPreviewConnection();
    
    if (error) {
      previewStatus.connectionStatus = 'error';
      previewStatus.error = `Preview connection error: ${error}`;
      console.error('Supabase preview connection error:', error);
    } else {
      previewStatus.connectionStatus = 'connected';
      console.log(`Successfully connected to Supabase preview branch: ${previewStatus.branch}`);
    }
  } catch (err) {
    previewStatus.connectionStatus = 'error';
    previewStatus.error = `Unexpected error: ${err instanceof Error ? err.message : 'Unknown error'}`;
    console.error('Supabase preview unexpected error:', err);
  }

  return previewStatus;
}

/**
 * Test the connection to the Supabase preview branch
 */
async function testPreviewConnection() {
  try {
    // First do a simple auth check
    const { error: authError } = await supabase.auth.getSession();
    if (authError) {
      return { error: `Auth error: ${authError.message}` };
    }

    // Then try a simple database query
    const { error: dbError } = await supabase.from('profiles').select('id').limit(1);
    if (dbError) {
      return { error: `Database error: ${dbError.message}` };
    }

    return { error: null };
  } catch (err) {
    return { error: err instanceof Error ? err.message : 'Unknown error' };
  }
}

/**
 * Get the current preview branch information
 */
export function getPreviewInfo(): PreviewBranchInfo {
  // If we haven't checked yet, return a default object
  if (!previewStatus) {
    return {
      enabled: false,
      branch: null,
      connectionStatus: 'unknown'
    };
  }
  return previewStatus;
}

/**
 * Reset the preview status cache
 * Useful for testing or when switching environments
 */
export function resetPreviewStatus(): void {
  previewStatus = null;
}

/**
 * Create a URL with the preview branch parameter
 * Useful for sharing links that will connect to the same preview branch
 */
export function createPreviewUrl(baseUrl: string): string {
  if (!previewStatus?.enabled || !previewStatus?.branch) {
    return baseUrl;
  }
  
  const url = new URL(baseUrl);
  url.searchParams.set('supabase_branch', previewStatus.branch);
  return url.toString();
}

/**
 * Initialize preview functionality
 * This should be called during application startup
 */
export async function initializePreview(): Promise<PreviewBranchInfo> {
  // Apply fixes and get the status
  const status = await applyPreviewFixes();
  
  // Log the status for debugging
  if (ENV.DEV) {
    console.log('Supabase Preview Status:', status);
  }
  
  return status;
}

/**
 * Get a configured Supabase client for the current environment
 * This will return the preview client if in a preview environment,
 * or the regular client otherwise
 */
export function getConfiguredClient(): SupabaseClient {
  // We're using the singleton pattern, so the client is already configured
  // based on the environment by the time this function is called
  return supabase;
}

/**
 * Check if we need to show a preview environment notification
 * Returns true if this is a preview environment and we should show a notice to users
 */
export function shouldShowPreviewNotice(): boolean {
  return !!(previewStatus?.enabled && previewStatus?.branch && previewStatus?.connectionStatus === 'connected');
}

/**
 * Get display information about the current preview branch
 * Useful for showing in UI components
 */
export function getPreviewDisplayInfo(): {
  branch: string;
  isPreview: boolean;
  label: string;
  isPR: boolean;
  prNumber?: number;
} {
  const branch = previewStatus?.branch || '';
  const isPR = branch.startsWith('pr-');
  
  let prNumber: number | undefined = undefined;
  if (isPR) {
    const match = branch.match(/^pr-(\d+)$/);
    if (match && match[1]) {
      prNumber = parseInt(match[1], 10);
    }
  }
  
  return {
    branch,
    isPreview: !!previewStatus?.enabled,
    isPR,
    prNumber,
    label: isPR ? `PR #${prNumber}` : branch || 'Main'
  };
}

/**
 * Loads a specific preview branch by name
 * This is useful for switching between different preview environments
 * 
 * @param branchName The name of the branch to load
 * @returns The result of the operation
 */
export async function loadPreviewBranch(branchName: string): Promise<{
  success: boolean;
  error?: string;
}> {
  try {
    if (!branchName) {
      return { success: false, error: 'No branch name provided' };
    }
    
    // Reset the preview status cache first
    resetPreviewStatus();
    
    // Set the branch in sessionStorage for persistence
    sessionStorage.setItem('SUPABASE_PREVIEW_BRANCH', branchName);
    
    // Manually set process.env if it exists
    if (typeof process !== 'undefined' && process.env) {
      process.env.SUPABASE_BRANCH = branchName;
    }
    
    // Apply the preview fixes with the new branch
    const status = await applyPreviewFixes();
    
    if (status.connectionStatus === 'error') {
      return { 
        success: false, 
        error: status.error || 'Failed to connect to preview branch'
      };
    }
    
    return { success: true };
  } catch (err) {
    return { 
      success: false, 
      error: err instanceof Error ? err.message : 'Unknown error occurred'
    };
  }
}

// Helper function to check if a branch exists from URL parameters
export function checkBranchFromUrl(): string | null {
  if (typeof window === 'undefined') {
    return null;
  }
  
  try {
    const url = new URL(window.location.href);
    return url.searchParams.get('supabase_branch');
  } catch {
    return null;
  }
}

// Export additional types for convenience
export type { PreviewBranchInfo };