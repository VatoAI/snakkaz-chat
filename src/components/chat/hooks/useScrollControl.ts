
import { useCallback, useState, useRef, useEffect } from 'react';
import debounce from 'lodash/debounce';

export const useScrollControl = (
  threshold: number = 100, 
  debug: boolean = false
) => {
  const [isAtBottom, setIsAtBottom] = useState(true);
  const [autoScroll, setAutoScroll] = useState(true);
  const lastScrollHeightRef = useRef<number>(0);
  const lastScrollTopRef = useRef<number>(0);
  const isUserScrollingRef = useRef<boolean>(false);

  const log = useCallback((message: string, ...args: any[]) => {
    if (debug) {
      console.log(`[ScrollControl] ${message}`, ...args);
    }
  }, [debug]);

  const handleScroll = useCallback(debounce((
    container: HTMLElement,
    onScrollStateChange?: (atBottom: boolean) => void
  ) => {
    const { scrollTop, scrollHeight, clientHeight } = container;
    const distanceFromBottom = scrollHeight - scrollTop - clientHeight;
    const wasAtBottom = isAtBottom;
    const isNearBottom = distanceFromBottom < threshold;

    log('Scroll position', { scrollTop, scrollHeight, clientHeight, distanceFromBottom });
    
    setIsAtBottom(isNearBottom);
    
    if (wasAtBottom !== isNearBottom) {
      setAutoScroll(isNearBottom);
      onScrollStateChange?.(isNearBottom);
    }

    lastScrollHeightRef.current = scrollHeight;
    lastScrollTopRef.current = scrollTop;
    isUserScrollingRef.current = true;

    // Reset user scrolling after a delay
    setTimeout(() => {
      isUserScrollingRef.current = false;
    }, 150);
  }, 50), [threshold, log, isAtBottom]);

  return {
    isAtBottom,
    autoScroll,
    setAutoScroll,
    handleScroll,
    lastScrollHeight: lastScrollHeightRef.current,
    lastScrollTop: lastScrollTopRef.current,
    isUserScrolling: isUserScrollingRef.current
  };
};
