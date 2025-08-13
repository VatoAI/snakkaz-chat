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
  const scrollPosBeforeUpdateRef = useRef<{ scrollHeight: number, scrollTop: number } | null>(null);

  const log = useCallback((message: string, ...args: any[]) => {
    if (debug) {
      console.log(`[ScrollControl] ${message}`, ...args);
    }
  }, [debug]);

  // Denne funksjonen lagrer scroll-posisjonen før oppdateringer for å bevare det relative scrolle-punktet
  const saveScrollPosition = useCallback((container: HTMLElement) => {
    if (!container) return;

    const { scrollTop, scrollHeight } = container;
    scrollPosBeforeUpdateRef.current = { scrollHeight, scrollTop };
    log('Saved scroll position', { scrollTop, scrollHeight });
  }, [log]);

  // Denne funksjonen gjenoppretter scroll-posisjonen etter oppdateringer
  const restoreScrollPosition = useCallback((container: HTMLElement) => {
    if (!container || !scrollPosBeforeUpdateRef.current) return;

    const { scrollHeight, scrollTop } = scrollPosBeforeUpdateRef.current;
    const newScrollHeight = container.scrollHeight;
    const heightDiff = newScrollHeight - scrollHeight;

    // Bare juster hvis høyden faktisk har endret seg og ikke er på bunnen
    if (heightDiff > 0 && !isAtBottom) {
      // Beregn ny scrollTop for å beholde samme relative posisjon
      const newScrollTop = scrollTop + heightDiff;
      requestAnimationFrame(() => {
        container.scrollTop = newScrollTop;
        log('Restored scroll position with adjustment', {
          originalScrollTop: scrollTop,
          newScrollTop,
          heightDiff
        });
      });
    }

    scrollPosBeforeUpdateRef.current = null;
  }, [isAtBottom, log]);

  const handleScroll = useCallback(debounce((
    container: HTMLElement,
    onScrollStateChange?: (atBottom: boolean) => void
  ) => {
    if (!container) return;

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

    // Reset user scrolling after a longer delay for better stability
    setTimeout(() => {
      isUserScrollingRef.current = false;
    }, 300); // Økt fra 150ms til 300ms for mer stabilitet
  }, 100), [threshold, log, isAtBottom]); // Økt debounce fra 50ms til 100ms for bedre ytelse

  return {
    isAtBottom,
    autoScroll,
    setAutoScroll,
    handleScroll,
    saveScrollPosition,
    restoreScrollPosition,
    lastScrollHeight: lastScrollHeightRef.current,
    lastScrollTop: lastScrollTopRef.current,
    isUserScrolling: isUserScrollingRef.current
  };
};
