
// Environment configuration for the Snakkaz application
export const environment = {
  production: import.meta.env.PROD || false,
  supabase: {
    url: import.meta.env.VITE_SUPABASE_URL || 'https://wqpoozpbceucynsojmbk.supabase.co',
    anonKey: import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndxcG9venBiY2V1Y3luc29qbWJrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzk1NjgzMDUsImV4cCI6MjA1NTE0NDMwNX0.vu1s86gQKEPXFleOZ1U2uOjW-kj4k4RAiKTbOuXPUD8',
    customDomain: null, // Removed custom domain since www.snakkaz.com now points to our own hosting
  },
  app: {
    name: 'Snakkaz',
    version: '1.0.0',
    baseUrl: import.meta.env.PROD ? 'https://www.snakkaz.com' : 'http://localhost:5173',
  }
};

/**
 * Check and update Supabase Preview status
 * This function checks if we're connected to a Supabase preview branch
 * and updates the environment configuration accordingly
 */
export function checkSupabasePreviewStatus() {
  try {
    // Check if we're using a preview branch (typically set by GitHub Actions workflow)
    const previewBranch = 
      typeof process !== 'undefined' && 
      process.env && 
      process.env.SUPABASE_BRANCH;
    
    if (previewBranch) {
      console.log(`Using Supabase Preview branch: ${previewBranch}`);
      // Update the environment config
      environment.supabase.preview = {
        enabled: true,
        branch: previewBranch
      };
      return true;
    } else {
      console.log('Using main Supabase instance');
      return false;
    }
  } catch (error) {
    console.error('Failed to check Supabase Preview status:', error);
    return false;
  }
}
