
import { ScrollArea } from "@/components/ui/scroll-area";
import { useRef, useState, useCallback, useEffect, ReactNode } from "react";
import { useIsMobile } from "@/hooks/use-mobile";

interface MessageScrollAreaProps {
  onScrollBottom: () => void;
  setAutoScroll: (value: boolean) => void;
  setWasScrolledToBottom: (value: boolean) => void;
  wasScrolledToBottom: boolean;
  autoScroll: boolean;
  children: ReactNode;
  scrollAreaRef: React.RefObject<HTMLDivElement>;
}

export const MessageScrollArea = ({
  onScrollBottom,
  setAutoScroll,
  setWasScrolledToBottom,
  wasScrolledToBottom,
  autoScroll,
  children,
  scrollAreaRef
}: MessageScrollAreaProps) => {
  const isMobile = useIsMobile();
  const [touchStartY, setTouchStartY] = useState(0);

  // Scroll handling
  const handleScroll = useCallback(() => {
    if (!scrollAreaRef.current) return;

    const { scrollTop, scrollHeight, clientHeight } = scrollAreaRef.current;
    const scrolledToBottom = scrollHeight - scrollTop - clientHeight < 50;

    if (scrolledToBottom !== wasScrolledToBottom) {
      setWasScrolledToBottom(scrolledToBottom);
      setAutoScroll(scrolledToBottom);

      if (scrolledToBottom) {
        onScrollBottom();
      }
    }
  }, [scrollAreaRef, wasScrolledToBottom, setWasScrolledToBottom, setAutoScroll, onScrollBottom]);

  // Touch events for mobile pull-to-refresh behavior
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartY(e.touches[0].clientY);
  };
  const handleTouchMove = (e: React.TouchEvent) => {
    const touchY = e.touches[0].clientY;
    const scrollTop = scrollAreaRef.current?.scrollTop || 0;
    if (scrollTop <= 0 && touchY - touchStartY > 70) {
      e.preventDefault();
      // Add custom pull-to-refresh UI if needed
    }
  };
  const handleTouchEnd = (e: React.TouchEvent) => {
    // Let MessageListContent handle refresh via a prop if needed
  };

  return (
    <ScrollArea
      className="h-full px-2 sm:px-4 py-2 sm:py-4 overscroll-contain"
      onScrollCapture={handleScroll}
      ref={scrollAreaRef}
    >
      <div
        className="touch-pan-y"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {children}
      </div>
    </ScrollArea>
  );
};
