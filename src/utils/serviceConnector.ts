/**
 * Utility for managing connections to external SnakkaZ services
 * Provides graceful fallbacks when services are unavailable
 */
import * as Sentry from '@sentry/react';
import { getConfig } from '../config/app-config';

// Define ServiceName type
export type ServiceName = 'SnakkaZ Business Analyser' | 'SnakkaZ Secure Docs' | 'AI Dash Hub' | 'SnakkaZ Analytics Hub';

// Service status tracking
const serviceStatuses: Record<ServiceName, boolean> = {
    'SnakkaZ Business Analyser': false,
    'SnakkaZ Secure Docs': false,
    'AI Dash Hub': false,
    'SnakkaZ Analytics Hub': false
};

// Map of domains we want to suppress console errors for in development mode
const SUPPRESS_DOMAINS = new Set([
    'dash.snakkaz.com',
    'business.snakkaz.com',
    'docs.snakkaz.com',
    'analytics.snakkaz.com',
    'www.snakkaz.com',  // Added main www domain
    'snakkaz.com',      // Added root domain
    'cloudflareinsights.com',
]);

// Connection cache to prevent multiple connection attempts to the same service
type ConnectionCache = {
    [url: string]: {
        status: 'online' | 'offline';
        timestamp: number;
    };
};

const connectionCache: ConnectionCache = {};

/**
 * Get all service statuses
 * @returns Record of service names and their connection status
 */
export function getAllServiceStatuses(): Record<ServiceName, boolean> {
    return { ...serviceStatuses };
}

/**
 * Connect to a specific service
 * @param service The service name to connect to
 * @param url The service URL
 * @returns Object with success status
 */
export async function connectToService(service: ServiceName, url: string): Promise<{ success: boolean }> {
    const success = await checkServiceStatus(url);

    // Update service status
    serviceStatuses[service] = success;

    return { success };
}

/**
 * Check if a service is available
 * @param url The service URL to check
 * @param timeout Timeout in milliseconds
 * @returns Promise that resolves to true if service is online, false otherwise
 */
export async function checkServiceStatus(url: string, timeout = 3000): Promise<boolean> {
    // Early return for development mode when testing locally
    if (import.meta.env.DEV && !import.meta.env.VITE_CONNECT_EXTERNAL_SERVICES) {
        const domain = new URL(url).hostname;
        if (SUPPRESS_DOMAINS.has(domain)) {
            return false;
        }
    }

    // Check cache first
    if (connectionCache[url]) {
        const cache = connectionCache[url];
        // Cache valid for 5 minutes
        if (Date.now() - cache.timestamp < 5 * 60 * 1000) {
            return cache.status === 'online';
        }
    }

    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), timeout);

        const response = await fetch(`${url}/ping`, {
            method: 'HEAD',
            signal: controller.signal,
            mode: 'no-cors',
            cache: 'no-store',
        });

        clearTimeout(timeoutId);

        // Update cache
        connectionCache[url] = {
            status: 'online',
            timestamp: Date.now()
        };

        return true;
    } catch (error) {
        // Silent error handling in development mode
        if (import.meta.env.DEV && !import.meta.env.VITE_DEBUG_NETWORK) {
            // Don't log anything
        } else {
            console.debug(`Service connection failed: ${url}`);
        }

        // Update cache
        connectionCache[url] = {
            status: 'offline',
            timestamp: Date.now()
        };

        return false;
    }
}

/**
 * Initialize all external services and handle connections silently
 * @returns Promise that resolves when all services have been checked
 */
export async function initializeExternalServices(): Promise<void> {
    // List of all external services to initialize
    const services = [
        'https://dash.snakkaz.com',
        'https://business.snakkaz.com',
        'https://docs.snakkaz.com',
        'https://analytics.snakkaz.com',
    ];

    // Check all services in parallel
    await Promise.allSettled(services.map(service => checkServiceStatus(service)));
}

/**
 * Override the default fetch to handle certain errors silently
 */
export function setupSilentFetch(): void {
    // Save original fetch
    const originalFetch = window.fetch;

    // Override fetch to prevent certain errors from logging
    window.fetch = async function (input, init) {
        try {
            return await originalFetch(input, init);
        } catch (error) {
            // If this is a request to a domain we want to suppress
            const url = typeof input === 'string' ? input : input instanceof URL ? input.toString() : input.url;
            const domain = new URL(url, window.location.origin).hostname;

            if (SUPPRESS_DOMAINS.has(domain) && import.meta.env.DEV) {
                // Return a mock response for development
                return new Response(null, { status: 200 });
            }

            // Otherwise, let the error propagate
            throw error;
        }
    };
}

/**
 * Initialize Sentry for error monitoring in production
 */
export function initializeSentry(): void {
    const config = getConfig();
    const isProd = import.meta.env.PROD;
    const sentryDsn = config.sentryDsn;

    if (isProd && sentryDsn) {
        try {
            Sentry.init({
                dsn: sentryDsn,
                integrations: [
                    new Sentry.BrowserTracing({
                        // Set sampling rate for performance monitoring
                        tracePropagationTargets: ['localhost', 'snakkaz.com'],
                    }),
                    new Sentry.Replay()
                ],
                // Set tracesSampleRate to 1.0 to capture 100% of transactions for performance monitoring
                // We recommend adjusting this value in production
                tracesSampleRate: 0.2,
                // Capture Replay for 10% of all sessions
                replaysSessionSampleRate: 0.1,
                // Capture Replay for 100% of sessions with an error
                replaysOnErrorSampleRate: 1.0,
                environment: import.meta.env.MODE,
                release: `snakkaz-chat@${import.meta.env.VITE_APP_VERSION || '1.0.0'}`,
                beforeSend(event) {
                    // Don't send events for known issues or development environments
                    if (!isProd) {
                        return null;
                    }
                    return event;
                },
            });

            // Set user info if available
            const user = localStorage.getItem('snakkaz_user');
            if (user) {
                try {
                    const parsedUser = JSON.parse(user);
                    if (parsedUser && parsedUser.id) {
                        Sentry.setUser({
                            id: parsedUser.id,
                            // Don't include personal info like email or name
                        });
                    }
                } catch (e) {
                    console.debug('Failed to parse user for Sentry');
                }
            }

            console.debug('Sentry initialized successfully');
        } catch (error) {
            console.error('Failed to initialize Sentry:', error);
        }
    }
}

/**
 * Setup global error handlers for resource loading errors
 */
export function setupErrorHandlers(): void {
    if (typeof window === 'undefined') return;

    // Suppress console errors for certain domains
    const originalErrorHandler = window.onerror;
    window.onerror = function (message, source, lineno, colno, error) {
        if (typeof source === 'string') {
            const suppressedDomains = Array.from(SUPPRESS_DOMAINS);
            if (suppressedDomains.some(domain => source.includes(domain)) && import.meta.env.DEV) {
                // Prevent error from showing in console
                return true;
            }
        }

        // Capture in Sentry for production environment
        if (import.meta.env.PROD && error && getConfig().sentryDsn) {
            Sentry.captureException(error, {
                extra: {
                    source,
                    lineno,
                    colno,
                    message,
                }
            });
        }

        // Pass to original handler
        if (originalErrorHandler) {
            return originalErrorHandler.call(this, message, source, lineno, colno, error);
        }
        return false;
    };

    // Handle resource loading errors silently for certain domains
    window.addEventListener('error', function (event) {
        if (event.target && (event.target as HTMLElement).tagName === 'IMG') {
            // Let the component's own error handler work
            return;
        }

        if (typeof event.filename === 'string') {
            const suppressedDomains = Array.from(SUPPRESS_DOMAINS);
            if (suppressedDomains.some(domain => event.filename.includes(domain)) && import.meta.env.DEV) {
                // Prevent error from showing in console
                event.preventDefault();
                event.stopPropagation();
                return true;
            }
        }
    }, true);

    // Monitor fetch errors
    window.addEventListener('unhandledrejection', function(event) {
        if (import.meta.env.PROD && getConfig().sentryDsn) {
            if (event.reason instanceof Error) {
                Sentry.captureException(event.reason);
            } else {
                Sentry.captureMessage(`Unhandled Promise Rejection: ${JSON.stringify(event.reason)}`);
            }
        }
    });
}

/**
 * Initialize all error handling features
 */
export function initializeErrorHandling(): void {
    setupSilentFetch();
    setupErrorHandlers();
    initializeSentry();
}