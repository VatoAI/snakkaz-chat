import React, { Suspense } from 'react';

interface LazyComponentProps {
  fallback?: React.ReactNode;
}

/**
 * Helper for lazy loading komponenter
 * @param importFunc - Importfunksjon for komponenten (f.eks. () => import('./MinKomponent'))
 * @param fallbackComponent - Komponent som vises under lasting (valgfri)
 */
export function lazyLoadComponent<T extends React.ComponentType<any>>(
  importFunc: () => Promise<{ default: T }>,
  fallbackComponent: React.ReactNode = <div className="loading-spinner">Laster...</div>
) {
  const LazyComponent = React.lazy(importFunc);
  
  return (props: React.ComponentProps<T> & LazyComponentProps) => {
    const { fallback = fallbackComponent, ...componentProps } = props;
    
    return (
      <Suspense fallback={fallback}>
        <LazyComponent {...componentProps as any} />
      </Suspense>
    );
  };
}

/**
 * Helper for lazy loading av ruter
 */
export function lazyLoadRoute(importFunc: () => Promise<{ default: React.ComponentType<any> }>) {
  return lazyLoadComponent(importFunc, 
    <div className="route-loading-container">
      <div className="loading-spinner-large"></div>
      <p>Laster innhold...</p>
    </div>
  );
}
