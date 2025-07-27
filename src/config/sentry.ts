import * as Sentry from '@sentry/react';
import React from 'react';
import { 
  useLocation, 
  useNavigationType, 
  createRoutesFromChildren, 
  matchRoutes 
} from 'react-router-dom';

export const initSentry = () => {
  // Initialize Sentry in both development and production for better error tracking
  const isProduction = import.meta.env.PROD;
  const isDevelopment = import.meta.env.DEV;
  
  if (isProduction || isDevelopment) {
    Sentry.init({
      dsn: import.meta.env.VITE_SENTRY_DSN || 'https://aa367ec7aaab09fd6d953cc9f654c571@o4509737553952768.ingest.de.sentry.io/4509737772843088',
      environment: import.meta.env.VITE_ENVIRONMENT || (isProduction ? 'production' : 'development'),
      release: `snakkaz-chat@${import.meta.env.VITE_APP_VERSION || '1.0.0'}`,
      
      integrations: [
        Sentry.browserTracingIntegration({
          // Track navigation and page loads
          routingInstrumentation: Sentry.reactRouterV6Instrumentation(
            React.useEffect,
            useLocation,
            useNavigationType,
            createRoutesFromChildren,
            matchRoutes
          ),
        }),
        Sentry.replayIntegration({
          // Capture user interactions for debugging
          maskAllText: true,
          blockAllMedia: true,
        }),
      ],
      
      // Performance monitoring
      tracesSampleRate: isProduction ? 0.1 : 1.0, // 10% in prod, 100% in dev
      
      // Session replay
      replaysSessionSampleRate: isProduction ? 0.1 : 1.0,
      replaysOnErrorSampleRate: 1.0,
      
      // Norwegian-specific configuration
      initialScope: {
        tags: {
          component: 'snakkaz-chat',
          country: 'norway',
          language: 'norwegian'
        },
        user: {
          country: 'NO',
          timezone: 'Europe/Oslo'
        },
        contexts: {
          app: {
            name: 'SnakkaZ Chat',
            version: import.meta.env.VITE_APP_VERSION || '1.0.0',
            build: import.meta.env.VITE_BUILD_ID || 'development'
          }
        }
      },
      
      beforeSend(event, hint) {
        // Filter out sensitive information
        if (event.exception) {
          event.exception.values?.forEach(exception => {
            if (exception.stacktrace?.frames) {
              exception.stacktrace.frames = exception.stacktrace.frames.filter(
                frame => !frame.filename?.includes('node_modules')
              );
            }
          });
        }
        
        // Add Norwegian context to errors
        if (event.extra) {
          event.extra.locale = 'nb-NO';
          event.extra.userAgent = navigator.userAgent;
          event.extra.timestamp = new Date().toISOString();
        }
        
        // Don't send errors in development unless explicitly enabled
        if (isDevelopment && !import.meta.env.VITE_SENTRY_DEBUG) {
          console.warn('🐛 Sentry Error (not sent in dev):', hint.originalException || event);
          return null;
        }
        
        return event;
      },
      
      beforeBreadcrumb(breadcrumb) {
        // Filter out noisy breadcrumbs
        if (breadcrumb.category === 'console' && breadcrumb.level === 'log') {
          return null;
        }
        return breadcrumb;
      },
    });
    
    // Set up additional context
    Sentry.setContext('browser', {
      name: navigator.userAgent,
      language: navigator.language,
      cookieEnabled: navigator.cookieEnabled,
      onLine: navigator.onLine
    });
    
    console.log(`🔍 Sentry initialized for ${isProduction ? 'production' : 'development'}`);
  }
};

export const captureError = (error: Error, context?: Record<string, any>) => {
  Sentry.withScope(scope => {
    if (context) {
      scope.setContext('error_context', context);
    }
    Sentry.captureException(error);
  });
};

export const captureMessage = (message: string, level: Sentry.SeverityLevel = 'info') => {
  Sentry.captureMessage(message, level);
};
