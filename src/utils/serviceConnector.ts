/**
 * Utility for managing connections to external SnakkaZ services
 * Provides graceful fallbacks when services are unavailable
 */

// List of external services used by the application
export type ServiceName = 
  | 'SnakkaZ Business Analyser' 
  | 'SnakkaZ Secure Docs' 
  | 'AI Dash Hub' 
  | 'SnakkaZ Analytics Hub';

// Connection status tracking
const serviceStatus: Record<ServiceName, boolean> = {
  'SnakkaZ Business Analyser': false,
  'SnakkaZ Secure Docs': false,
  'AI Dash Hub': false,
  'SnakkaZ Analytics Hub': false
};

// Environment detection
const isDevelopment = import.meta.env.DEV;
const isProd = import.meta.env.PROD;

/**
 * Attempts to connect to an external service with graceful error handling
 * @param serviceName The name of the service to connect to
 * @param serviceUrl The URL of the service endpoint
 * @param options Additional fetch options
 * @returns Promise resolving to the connection result
 */
export async function connectToService(
  serviceName: ServiceName, 
  serviceUrl: string, 
  options: RequestInit = {}
): Promise<{ success: boolean; data?: any; error?: string }> {
  // Skip actual connection in development unless explicitly enabled
  if (isDevelopment && !import.meta.env.VITE_ENABLE_EXTERNAL_SERVICES) {
    console.info(`[Dev] Simulating connection to ${serviceName} - disabled in development`);
    return { success: false, error: 'Service connections disabled in development' };
  }
  
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout
    
    const response = await fetch(serviceUrl, {
      ...options,
      signal: controller.signal,
      headers: {
        ...options.headers,
        'Content-Type': 'application/json',
      }
    });
    
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      throw new Error(`Service returned ${response.status}`);
    }
    
    const data = await response.json();
    serviceStatus[serviceName] = true;
    return { success: true, data };
  } catch (error) {
    serviceStatus[serviceName] = false;
    
    // Provide user-friendly error for development
    if (isDevelopment) {
      console.info(`Could not connect to ${serviceName} - this is normal in development.`);
    } else {
      // Only log as error in production
      console.error(`Could not connect to ${serviceName}`, error);
    }
    
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown connection error'
    };
  }
}

/**
 * Checks if a service is currently connected
 * @param serviceName The name of the service to check
 * @returns Whether the service is connected
 */
export function isServiceConnected(serviceName: ServiceName): boolean {
  return serviceStatus[serviceName];
}

/**
 * Gets the status of all external services
 * @returns Record of service connection statuses
 */
export function getAllServiceStatuses(): Record<ServiceName, boolean> {
  return { ...serviceStatus };
}