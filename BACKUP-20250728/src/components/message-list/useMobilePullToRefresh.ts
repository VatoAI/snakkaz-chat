
import { useEffect } from "react";

interface UseMobilePullToRefreshProps {
  scrollAreaRef: React.RefObject<HTMLDivElement>;
  onRefresh: () => void;
}

export function useMobilePullToRefresh({ scrollAreaRef, onRefresh }: UseMobilePullToRefreshProps) {
  useEffect(() => {
    const element = scrollAreaRef.current;
    if (!element) return;
    
    let touchStartY = 0;
    
    const handleTouchStart = (e: TouchEvent) => {
      touchStartY = e.touches[0].clientY;
    };

    const handleTouchMove = (e: TouchEvent) => {
      const touchY = e.touches[0].clientY;
      const scrollTop = element.scrollTop || 0;
      if (scrollTop <= 0 && touchY - touchStartY > 70) {
        // Could add UI feedback here
      }
    };

    const handleTouchEnd = (e: TouchEvent) => {
      const scrollTop = element.scrollTop || 0;
      const pullDistance = e.changedTouches[0].clientY - touchStartY;
      if (scrollTop <= 0 && pullDistance > 100) {
        onRefresh();
      }
    };
    
    element.addEventListener('touchstart', handleTouchStart);
    element.addEventListener('touchmove', handleTouchMove);
    element.addEventListener('touchend', handleTouchEnd);
    
    return () => {
      element.removeEventListener('touchstart', handleTouchStart);
      element.removeEventListener('touchmove', handleTouchMove);
      element.removeEventListener('touchend', handleTouchEnd);
    };
  }, [scrollAreaRef, onRefresh]);
  
  return {};
}
