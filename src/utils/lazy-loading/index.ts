/**
 * Lazy loading utilities for Snakkaz Chat
 * These utilities help with code splitting and lazy loading components
 */
import React, { Suspense, lazy } from 'react';

// Basic lazy loading wrapper for React components
export function lazyLoadComponent<T extends React.ComponentType<any>>(
  importFunc: () => Promise<{ default: T }>,
  fallback: React.ReactNode = <div className="snakkaz-loading">Loading...</div>
): React.FC<React.ComponentProps<T>> {
  const LazyComponent = lazy(importFunc);
  
  return (props: React.ComponentProps<T>) => (
    <Suspense fallback={fallback}>
      <LazyComponent {...props} />
    </Suspense>
  );
}

// Lazy load a component with error boundary
export function lazyLoadWithErrorBoundary<T extends React.ComponentType<any>>(
  importFunc: () => Promise<{ default: T }>,
  fallback: React.ReactNode = <div className="snakkaz-loading">Loading...</div>,
  errorFallback: (error: Error) => React.ReactNode = (error) => (
    <div className="snakkaz-error">
      Something went wrong: {error.message}
    </div>
  )
): React.FC<React.ComponentProps<T>> {
  const LazyComponent = lazy(importFunc);
  
  return (props: React.ComponentProps<T>) => (
    <ErrorBoundary fallback={errorFallback}>
      <Suspense fallback={fallback}>
        <LazyComponent {...props} />
      </Suspense>
    </ErrorBoundary>
  );
}

// Simple Error Boundary component
class ErrorBoundary extends React.Component<{
  fallback: (error: Error) => React.ReactNode;
  children: React.ReactNode;
}, {
  hasError: boolean;
  error: Error | null;
}> {
  constructor(props: { fallback: (error: Error) => React.ReactNode; children: React.ReactNode; }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Component error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError && this.state.error) {
      return this.props.fallback(this.state.error);
    }

    return this.props.children;
  }
}

// Prefetch a component before it's needed
export function prefetchComponent<T extends React.ComponentType<any>>(
  importFunc: () => Promise<{ default: T }>
): void {
  importFunc();
}

// Preload multiple components in the background
export function preloadComponents(
  importFuncs: Array<() => Promise<{ default: React.ComponentType<any> }>>
): void {
  // Use requestIdleCallback if available, or setTimeout as fallback
  const schedulePreload = 'requestIdleCallback' in window
    ? (window as any).requestIdleCallback
    : setTimeout;
  
  schedulePreload(() => {
    importFuncs.forEach(importFunc => {
      importFunc();
    });
  });
}

// Load components on viewport visibility (useful for routes)
export function onViewportLoad<T extends React.ComponentType<any>>(
  importFunc: () => Promise<{ default: T }>,
  target: HTMLElement
): Promise<T> {
  return new Promise((resolve) => {
    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            importFunc().then(module => {
              resolve(module.default);
            });
            observer.disconnect();
          }
        });
      });
      
      observer.observe(target);
    } else {
      // Fallback for browsers that don't support IntersectionObserver
      importFunc().then(module => {
        resolve(module.default);
      });
    }
  });
}

// Dynamically load a component based on condition
export function conditionalLoad<T extends React.ComponentType<any>>(
  condition: boolean,
  importFunc: () => Promise<{ default: T }>,
  fallbackComponent: React.ReactNode
): React.ReactNode {
  if (condition) {
    const DynamicComponent = lazyLoadComponent(importFunc);
    return <DynamicComponent />;
  }
  
  return fallbackComponent;
}
