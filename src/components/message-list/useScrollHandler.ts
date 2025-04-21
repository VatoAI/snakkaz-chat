
import { useRef, useCallback, useState } from "react";

interface UseScrollHandlerProps {
  isMobile: boolean;
  initialMessagesCount: number;
}

export function useScrollHandler({ isMobile, initialMessagesCount }: UseScrollHandlerProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const [autoScroll, setAutoScroll] = useState(true);
  const [wasScrolledToBottom, setWasScrolledToBottom] = useState(true);
  const [newMessageCount, setNewMessageCount] = useState(0);
  const lastMessageCountRef = useRef(initialMessagesCount);

  const handleScroll = useCallback(() => {
    if (!scrollAreaRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = scrollAreaRef.current;
    const scrolledToBottom = scrollHeight - scrollTop - clientHeight < 50;
    if (scrolledToBottom !== wasScrolledToBottom) {
      setWasScrolledToBottom(scrolledToBottom);
      setAutoScroll(scrolledToBottom);
      if (scrolledToBottom) {
        setNewMessageCount(0);
      }
    }
  }, [wasScrolledToBottom]);

  const handleScrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: isMobile ? 'auto' : 'smooth' });
    setAutoScroll(true);
    setNewMessageCount(0);
  };

  // Expose scroll handler & refs
  return {
    messagesEndRef,
    scrollAreaRef,
    autoScroll,
    setAutoScroll,
    wasScrolledToBottom,
    setWasScrolledToBottom,
    newMessageCount,
    setNewMessageCount,
    lastMessageCountRef,
    handleScroll,
    handleScrollToBottom,
  };
}
