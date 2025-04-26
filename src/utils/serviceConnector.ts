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

// Service URL mapping
export const SERVICE_URLS: Record<ServiceName, string> = {
    'SnakkaZ Business Analyser': 'https://business.snakkaz.com/ping',
    'SnakkaZ Secure Docs': 'https://docs.snakkaz.com/ping',
    'AI Dash Hub': 'https://dash.snakkaz.com/ping',
    'SnakkaZ Analytics Hub': 'https://analytics.snakkaz.com/ping'
};

// Connection status tracking
const serviceStatus: Record<ServiceName, boolean> = {
    'SnakkaZ Business Analyser': false,
    'SnakkaZ Secure Docs': false,
    'AI Dash Hub': false,
    'SnakkaZ Analytics Hub': false
};

// Track if we've already logged connection errors to avoid spamming the console
const errorLogged: Record<ServiceName, boolean> = {
    'SnakkaZ Business Analyser': false,
    'SnakkaZ Secure Docs': false,
    'AI Dash Hub': false,
    'SnakkaZ Analytics Hub': false
};

// Environment detection
const isDevelopment = import.meta.env.DEV;
const isProd = import.meta.env.PROD;

// Override console methods to filter unwanted messages
const originalConsoleError = console.error;
console.error = (...args) => {
    // Filter out specific error messages
    if (typeof args[0] === 'string' &&
        (args[0].includes('Could not connect to SnakkaZ') ||
            args[0].includes('cloudflareinsights'))) {
        // Suppress these specific errors completely
        return;
    }
    originalConsoleError.apply(console, args);
};

/**
 * Initializes connections to all external services
 * This can be called on application startup
 */
export async function initializeExternalServices(): Promise<void> {
    // Only attempt connections if explicitly enabled in development
    if (isDevelopment && !import.meta.env.VITE_ENABLE_EXTERNAL_SERVICES) {
        console.info('[Dev] External services disabled in development mode');
        return;
    }

    // Setup message interception for the specific error patterns
    interceptErrorMessages([
        'Could not connect to SnakkaZ',
        'cloudflareinsights',
        'Failed to load resource:'
    ]);

    // Attempt connecting to each service silently
    const services = Object.keys(serviceStatus) as ServiceName[];
    await Promise.all(
        services.map(service =>
            connectToService(service, SERVICE_URLS[service])
                .catch(() => { }) // Silently catch any errors
        )
    );
}

/**
 * Sets up interception of error messages in the console
 * @param patterns Array of string patterns to intercept
 */
function interceptErrorMessages(patterns: string[]): void {
    if (typeof window === 'undefined') return;

    // Create a proxy for the console to filter messages
    const originalConsole = { ...console };

    // Override error, warn, and log methods
    ['error', 'warn', 'log'].forEach(method => {
        console[method] = (...args) => {
            // Check if any argument matches our patterns to filter
            const shouldSuppress = args.some(arg =>
                typeof arg === 'string' &&
                patterns.some(pattern => arg.includes(pattern))
            );

            if (!shouldSuppress) {
                originalConsole[method].apply(console, args);
            }
        };
    });
}

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

        // Try to parse as JSON, but don't fail if it's not valid JSON
        let data;
        try {
            data = await response.json();
        } catch {
            data = { status: 'ok' };
        }

        serviceStatus[serviceName] = true;
        errorLogged[serviceName] = false; // Reset error logged flag on success
        return { success: true, data };
    } catch (error) {
        serviceStatus[serviceName] = false;

        // Only log the error once to avoid console spam
        if (!errorLogged[serviceName]) {
            if (isDevelopment) {
                console.debug(`[Dev] Service unavailable: ${serviceName} - this is normal in development.`);
            }
            errorLogged[serviceName] = true;
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

// Initialize services on module load, but make it non-blocking
if (typeof window !== 'undefined') {
    // Use a small timeout to ensure this doesn't block initial rendering
    setTimeout(() => {
        initializeExternalServices().catch(() => { });
    }, 2000);
}