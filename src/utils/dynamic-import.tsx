/**
 * Dynamic Import Utilities for Snakkaz Chat
 * 
 * This module provides utilities for improving code splitting with dynamic imports.
 * It allows components to be loaded only when needed, reducing the initial bundle size.
 */

import React, { lazy, Suspense } from 'react';

// Basic loading component that can be customized by the caller
const DefaultLoader = () => (
  <div className="flex items-center justify-center p-4 h-full w-full min-h-[100px]">
    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-cybergold-500"></div>
  </div>
);

// Default error fallback component
const DefaultErrorFallback = ({ error }: { error: Error }) => (
  <div className="p-4 bg-cyberdark-800 border border-red-900 rounded-md text-red-400 text-sm">
    <p className="font-medium mb-2">Kunne ikke laste komponent</p>
    <p>{error.message}</p>
  </div>
);

/**
 * Creates a dynamically imported component with Suspense and error handling
 * 
 * @param importFn - The import function that returns the component
 * @param LoadingComponent - Optional custom loading component
 * @param ErrorFallback - Optional custom error component
 * @returns A component that will be loaded dynamically
 */
export function createDynamicComponent<T extends React.ComponentType<any>>(
  importFn: () => Promise<{ default: T }>,
  LoadingComponent: React.ReactNode = <DefaultLoader />,
  ErrorFallback: React.ComponentType<{ error: Error }> = DefaultErrorFallback
) {
  const LazyComponent = lazy(importFn);

  // Return a component that wraps the lazy component with Suspense and error handling
  return function DynamicComponent(props: React.ComponentProps<T>) {
    return (
      <Suspense fallback={LoadingComponent}>
        <ErrorBoundary FallbackComponent={ErrorFallback}>
          <LazyComponent {...props} />
        </ErrorBoundary>
      </Suspense>
    );
  };
}

// Simple error boundary component
class ErrorBoundary extends React.Component<{
  children: React.ReactNode;
  FallbackComponent: React.ComponentType<{ error: Error }>;
}> {
  state = { hasError: false, error: null as Error | null };

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // You could log the error to an error reporting service here
    console.error('Dynamic import error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError && this.state.error) {
      return <this.props.FallbackComponent error={this.state.error} />;
    }

    return this.props.children;
  }
}

/**
 * Preload a component to improve perceived performance
 * Use this for routes that are likely to be visited next
 * 
 * @param importFn - The import function to preload
 */
export function preloadComponent(importFn: () => Promise<any>) {
  importFn().catch(err => {
    console.warn('Preloading failed:', err);
  });
}

// Export a namespace for use in modules that want to group dynamic imports
export const DynamicImport = {
  createComponent: createDynamicComponent,
  preload: preloadComponent,
};

export default DynamicImport;
