
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

  // Handle explicit scroll to bottom
  useEffect(() => {
    if (scrollToBottom || autoScroll) {
      const container = containerRef.current;
      if (container) {
        requestAnimationFrame(() => {
          container.scrollTop = container.scrollHeight;
          onScrollStateChange?.(true);
        });
      }
    }
  }, [scrollToBottom, autoScroll, onScrollStateChange, children]);

  // Handle recomputeKey changes
  useEffect(() => {
    if (recomputeKey !== undefined) {
      const container = containerRef.current;
      if (!container) return;

      if (autoScroll || scrollToBottom) {
        requestAnimationFrame(() => {
          container.scrollTop = container.scrollHeight;
          onScrollStateChange?.(true);
        });
      }
    }
  }, [recomputeKey, autoScroll, scrollToBottom, onScrollStateChange]);

  return (
    <div 
      ref={containerRef} 
      className={`overflow-y-auto overflow-x-hidden ${className}`}
      style={{ WebkitOverflowScrolling: 'touch' }}
    >
      {children}
    </div>
  );
};
