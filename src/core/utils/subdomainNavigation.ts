/**
 * Subdomain-aware navigation utility for Snakkaz Chat
 * 
 * This utility ensures that navigation preserves subdomain context
 * when routing between pages, preventing users from losing their
 * subdomain-specific context during navigation.
 */

// Detect current subdomain
export const detectSubdomain = () => {
  const hostname = window.location.hostname;
  const parts = hostname.split('.');
  
  if (parts.length > 2) {
    const subdomain = parts[0];
    const allowedSubdomains = ['dash', 'business', 'docs', 'analytics', 'mcp', 'help'];
    
    if (allowedSubdomains.includes(subdomain)) {
      return subdomain;
    }
  }
  
  return null;
};

// Get current domain with subdomain
export const getCurrentDomain = () => {
  const subdomain = detectSubdomain();
  const hostname = window.location.hostname;
  
  if (subdomain) {
    return hostname; // Already includes subdomain
  }
  
  // Default to main domain
  return 'snakkaz.com';
};

// Create subdomain-aware URL
export const createSubdomainAwareUrl = (path: string, preserveSubdomain: boolean = true) => {
  const subdomain = detectSubdomain();
  const protocol = window.location.protocol;
  
  // Clean up path (ensure it starts with /)
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  
  if (preserveSubdomain && subdomain) {
    // Preserve current subdomain
    return `${protocol}//${subdomain}.snakkaz.com${cleanPath}`;
  } else {
    // Navigate to main domain
    return `${protocol}//snakkaz.com${cleanPath}`;
  }
};

// Subdomain-aware navigation function
export const navigateWithSubdomain = (
  path: string, 
  options: {
    preserveSubdomain?: boolean;
    replace?: boolean;
    external?: boolean;
  } = {}
) => {
  const { 
    preserveSubdomain = true, 
    replace = false, 
    external = false 
  } = options;

  const url = createSubdomainAwareUrl(path, preserveSubdomain);
  
  if (external || url.includes('://')) {
    // External navigation or full URL
    if (replace) {
      window.location.replace(url);
    } else {
      window.location.href = url;
    }
  } else {
    // Internal navigation using React Router would go here
    // For now, we'll use window.location for subdomain preservation
    if (replace) {
      window.location.replace(url);
    } else {
      window.location.href = url;
    }
  }
};

// Hook for React components to get subdomain-aware navigation
export const useSubdomainNavigation = () => {
  const navigate = (path: string, options?: {
    preserveSubdomain?: boolean;
    replace?: boolean;
  }) => {
    navigateWithSubdomain(path, { ...options, external: true });
  };

  const getCurrentSubdomain = () => detectSubdomain();
  
  const isSubdomainActive = () => !!detectSubdomain();
  
  return {
    navigate,
    getCurrentSubdomain,
    isSubdomainActive,
    createUrl: createSubdomainAwareUrl
  };
};

// Utility to check if we're on a specific subdomain
export const isOnSubdomain = (targetSubdomain: string) => {
  const currentSubdomain = detectSubdomain();
  return currentSubdomain === targetSubdomain;
};

// Get subdomain-specific app mode
export const getSubdomainAppMode = () => {
  const subdomain = detectSubdomain();
  return subdomain || 'main';
};
