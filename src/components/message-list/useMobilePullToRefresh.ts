
import { useState } from "react";

interface UseMobilePullToRefreshProps {
  scrollAreaRef: React.RefObject<HTMLDivElement>;
  onRefresh: () => void;
}

export function useMobilePullToRefresh({ scrollAreaRef, onRefresh }: UseMobilePullToRefreshProps) {
  const [touchStartY, setTouchStartY] = useState(0);
  
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartY(e.touches[0].clientY);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    const touchY = e.touches[0].clientY;
    const scrollTop = scrollAreaRef.current?.scrollTop || 0;
    if (scrollTop <= 0 && touchY - touchStartY > 70) {
      // Could add UI feedback here
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const scrollTop = scrollAreaRef.current?.scrollTop || 0;
    const pullDistance = e.changedTouches[0].clientY - touchStartY;
    if (scrollTop <= 0 && pullDistance > 100) {
      onRefresh();
    }
  };

  return { handleTouchStart, handleTouchMove, handleTouchEnd };
}
