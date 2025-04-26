import React, { useRef, useEffect, useState } from 'react';

interface ScrollStabilizerProps {
  children: React.ReactNode;
  className?: string;
  scrollToBottom?: boolean;
  recomputeKey?: any; // A value that changes when we should re-evaluate scroll position
  threshold?: number; // How close to bottom (in pixels) to trigger auto-scroll
  debug?: boolean; // Enable debug logging
  onScrollStateChange?: (atBottom: boolean) => void; // Callback for when scroll state changes
}

/**
 * A component that stabilizes scroll position and prevents unexpected jumps
 * when content changes or user is scrolling
 */
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
  const lastScrollHeightRef = useRef<number>(0);
  const lastScrollTopRef = useRef<number>(0);
  const isUserScrollingRef = useRef<boolean>(false);
  const isNearBottomRef = useRef<boolean>(true);
  const [autoScrollEnabled, setAutoScrollEnabled] = useState(true);
  const scrollTimerRef = useRef<number | null>(null);
  const contentChangedRef = useRef(false);

  // Log debug info if debug is enabled
  const log = (message: string, ...args: any[]) => {
    if (debug) {
      console.log(`[ScrollStabilizer] ${message}`, ...args);
    }
  };

  // Handle scroll events
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = container;
      
      // Clear any existing scroll timer
      if (scrollTimerRef.current) {
        window.clearTimeout(scrollTimerRef.current);
      }
      
      isUserScrollingRef.current = true;
      lastScrollTopRef.current = scrollTop;
      lastScrollHeightRef.current = scrollHeight;
      
      // Check if we're near the bottom
      const wasNearBottom = isNearBottomRef.current;
      const isNearBottom = scrollHeight - scrollTop - clientHeight < threshold;
      isNearBottomRef.current = isNearBottom;
      
      // Update auto-scroll state based on user's scroll position
      if (wasNearBottom && !isNearBottom) {
        log('User scrolled away from bottom, disabling auto-scroll');
        setAutoScrollEnabled(false);
        if (onScrollStateChange) {
          onScrollStateChange(false);
        }
      } else if (!wasNearBottom && isNearBottom) {
        log('User scrolled to bottom, enabling auto-scroll');
        setAutoScrollEnabled(true);
        if (onScrollStateChange) {
          onScrollStateChange(true);
        }
      }
      
      // Clear the user scrolling flag after a delay
      scrollTimerRef.current = window.setTimeout(() => {
        isUserScrollingRef.current = false;
        scrollTimerRef.current = null;
      }, 150); // Slightly longer than animation frames
    };

    container.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      container.removeEventListener('scroll', handleScroll);
      if (scrollTimerRef.current) {
        window.clearTimeout(scrollTimerRef.current);
      }
    };
  }, [threshold, debug, onScrollStateChange]);

  // Handle initial scroll position
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    
    // Start at the bottom when first mounted
    container.scrollTop = container.scrollHeight;
    lastScrollHeightRef.current = container.scrollHeight;
    lastScrollTopRef.current = container.scrollTop;
    
    log('Initial scroll position set', {
      height: container.scrollHeight,
      scrollTop: container.scrollTop
    });
    
    if (onScrollStateChange) {
      onScrollStateChange(true);
    }
  }, [debug, onScrollStateChange]);

  // Maintain scroll position when content changes
  useEffect(() => {
    const handleContentMutation = () => {
      contentChangedRef.current = true;
      requestAnimationFrame(() => {
        const container = containerRef.current;
        if (!container) return;
        
        const oldScrollHeight = lastScrollHeightRef.current;
        const oldScrollTop = lastScrollTopRef.current;
        const newScrollHeight = container.scrollHeight;
        
        log('Content changed', {
          oldHeight: oldScrollHeight,
          newHeight: newScrollHeight,
          oldScrollTop,
          autoScrollEnabled,
          isUserScrolling: isUserScrollingRef.current,
          isNearBottom: isNearBottomRef.current
        });
        
        // If auto-scroll is enabled or we were explicitly told to scroll to bottom
        if ((autoScrollEnabled && !isUserScrollingRef.current) || scrollToBottom) {
          log('Scrolling to bottom');
          container.scrollTop = newScrollHeight;
        } 
        // Otherwise, maintain relative scroll position
        else if (!isUserScrollingRef.current && oldScrollHeight > 0 && newScrollHeight !== oldScrollHeight) {
          log('Maintaining relative position');
          container.scrollTop = oldScrollTop + (newScrollHeight - oldScrollHeight);
        }
        
        lastScrollHeightRef.current = newScrollHeight;
        lastScrollTopRef.current = container.scrollTop;
        contentChangedRef.current = false;
      });
    };
    
    // Set up mutation observer to detect content changes
    const observer = new MutationObserver(handleContentMutation);
    const container = containerRef.current;
    
    if (container) {
      observer.observe(container, { 
        childList: true, 
        subtree: true, 
        characterData: true,
        attributes: true
      });
    }
    
    return () => {
      observer.disconnect();
    };
  }, [autoScrollEnabled, scrollToBottom, debug]);

  // Handle explicit scroll to bottom when scrollToBottom prop changes
  useEffect(() => {
    if (scrollToBottom) {
      const container = containerRef.current;
      if (container) {
        log('Explicit scroll to bottom requested');
        requestAnimationFrame(() => {
          container.scrollTop = container.scrollHeight;
          lastScrollHeightRef.current = container.scrollHeight;
          lastScrollTopRef.current = container.scrollTop;
          
          if (onScrollStateChange) {
            onScrollStateChange(true);
          }
        });
      }
    }
  }, [scrollToBottom, debug, onScrollStateChange]);

  // Handle recomputeKey changes - recalculate scroll position
  useEffect(() => {
    if (recomputeKey !== undefined) {
      const container = containerRef.current;
      if (!container || contentChangedRef.current) return;
      
      log('Recomputing scroll position due to key change', { recomputeKey });
      
      requestAnimationFrame(() => {
        if (autoScrollEnabled || scrollToBottom) {
          container.scrollTop = container.scrollHeight;
          
          if (onScrollStateChange) {
            onScrollStateChange(true);
          }
        }
        lastScrollHeightRef.current = container.scrollHeight;
        lastScrollTopRef.current = container.scrollTop;
      });
    }
  }, [recomputeKey, autoScrollEnabled, scrollToBottom, debug, onScrollStateChange]);

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