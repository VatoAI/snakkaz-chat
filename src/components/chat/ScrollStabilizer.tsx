import React, { useRef, useEffect } from 'react';
import { useScrollControl } from './hooks/useScrollControl';

interface ScrollStabilizerProps {
  children: React.ReactNode;
  className?: string;
  scrollToBottom?: boolean;
  recomputeKey?: any;
  threshold?: number;
  debug?: boolean;
  onScrollStateChange?: (atBottom: boolean) => void;
}

export const ScrollStabilizer: React.FC<ScrollStabilizerProps> = ({
  children,
  className = '',
  scrollToBottom = false,
  recomputeKey,
  threshold = 100,
  debug = false,
  onScrollStateChange,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const {
    isAtBottom,
    autoScroll,
    setAutoScroll,
    handleScroll,
    saveScrollPosition,
    restoreScrollPosition,
  } = useScrollControl(threshold, debug);

  // Handle scroll events
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const scrollHandler = () => handleScroll(container, onScrollStateChange);
    container.addEventListener('scroll', scrollHandler, { passive: true });

    return () => {
      container.removeEventListener('scroll', scrollHandler);
    };
  }, [handleScroll, onScrollStateChange]);

  // Lagre scrollposisjon før innholdet oppdateres
  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      saveScrollPosition(container);
    }
  }, [children, saveScrollPosition]);

  // Gjenopprett scrollposisjon og/eller rull til bunn etter oppdatering
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Bruker requestAnimationFrame for å sikre at DOM er oppdatert
    requestAnimationFrame(() => {
      // Hvis vi skal rulle til bunnen, gjør det
      if (scrollToBottom || autoScroll) {
        container.scrollTop = container.scrollHeight;
        onScrollStateChange?.(true);
      } else {
        // Ellers, gjenopprett forrige scrollposisjon
        restoreScrollPosition(container);
      }
    });
  }, [scrollToBottom, autoScroll, onScrollStateChange, children, restoreScrollPosition]);

  // Handle recomputeKey changes
  useEffect(() => {
    if (recomputeKey !== undefined) {
      const container = containerRef.current;
      if (!container) return;

      // Lagre posisjon først
      saveScrollPosition(container);

      requestAnimationFrame(() => {
        if (autoScroll || scrollToBottom) {
          container.scrollTop = container.scrollHeight;
          onScrollStateChange?.(true);
        } else {
          restoreScrollPosition(container);
        }
      });
    }
  }, [recomputeKey, autoScroll, scrollToBottom, onScrollStateChange, saveScrollPosition, restoreScrollPosition]);

  return (
    <div
      ref={containerRef}
      className={`overflow-y-auto overflow-x-hidden scroll-smooth ${className}`}
      style={{ WebkitOverflowScrolling: 'touch', scrollBehavior: 'smooth' }}
    >
      {children}
    </div>
  );
};
