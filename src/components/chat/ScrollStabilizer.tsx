import React, { useRef, useEffect } from 'react';

interface ScrollStabilizerProps {
  children: React.ReactNode;
  className?: string;
  scrollToBottom?: boolean;
  scrollKey?: any; // A value that changes when we should re-evaluate scroll position
  threshold?: number; // How close to bottom (in pixels) to trigger auto-scroll
}

/**
 * A component that stabilizes scroll position and prevents unexpected jumps
 * when content changes or user is scrolling
 */
export const ScrollStabilizer: React.FC<ScrollStabilizerProps> = ({
  children,
  className = '',
  scrollToBottom = false,
  scrollKey,
  threshold = 100,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const lastScrollHeightRef = useRef<number>(0);
  const lastScrollTopRef = useRef<number>(0);
  const isUserScrollingRef = useRef<boolean>(false);
  const isNearBottomRef = useRef<boolean>(true);

  // Calculate if scrolled near bottom
  const checkIfNearBottom = () => {
    const container = containerRef.current;
    if (!container) return false;
    
    const { scrollTop, scrollHeight, clientHeight } = container;
    return scrollHeight - scrollTop - clientHeight < threshold;
  };

  // Handle scroll events
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = container;
      
      isUserScrollingRef.current = true;
      lastScrollTopRef.current = scrollTop;
      lastScrollHeightRef.current = scrollHeight;
      
      // Update near-bottom status
      isNearBottomRef.current = scrollHeight - scrollTop - clientHeight < threshold;
      
      // Clear the user scrolling flag after a delay
      setTimeout(() => {
        isUserScrollingRef.current = false;
      }, 100);
    };

    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, [threshold]);

  // Maintain scroll position when content changes
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    
    const wasNearBottom = isNearBottomRef.current;
    const oldScrollHeight = lastScrollHeightRef.current;
    const oldScrollTop = lastScrollTopRef.current;
    const newScrollHeight = container.scrollHeight;
    
    // If we were near the bottom before content changed, scroll to bottom
    if (wasNearBottom || scrollToBottom) {
      requestAnimationFrame(() => {
        if (container) {
          container.scrollTop = container.scrollHeight;
        }
      });
    } 
    // Otherwise, maintain relative scroll position
    else if (!isUserScrollingRef.current && oldScrollHeight > 0 && newScrollHeight !== oldScrollHeight) {
      requestAnimationFrame(() => {
        if (container) {
          container.scrollTop = oldScrollTop + (newScrollHeight - oldScrollHeight);
        }
      });
    }
    
    lastScrollHeightRef.current = newScrollHeight;
  }, [children, scrollToBottom, scrollKey]);

  // Force scroll to bottom when explicitly requested
  useEffect(() => {
    if (scrollToBottom) {
      const container = containerRef.current;
      if (container) {
        requestAnimationFrame(() => {
          container.scrollTop = container.scrollHeight;
        });
      }
    }
  }, [scrollToBottom]);

  return (
    <div 
      ref={containerRef} 
      className={`overflow-y-auto overflow-x-hidden ${className}`}
    >
      {children}
    </div>
  );
};