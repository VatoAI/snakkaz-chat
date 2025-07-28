import React, { useState, useRef, useEffect } from 'react';
import { useGesture } from '@use-gesture/react';
import { useSpring, animated } from 'react-spring';
import { MobileChatHeader } from './MobileChatHeader';
import { MobileMessageList } from './MobileMessageList';
import { MobileInputArea } from './MobileInputArea';
import { useAuth } from '@/hooks/useAuth';

interface Message {
  id: string;
  text: string;
  user: string;
  timestamp: Date;
  type: 'sent' | 'received';
  isDelivered?: boolean;
  isRead?: boolean;
}

interface MobileChatInterfaceProps {
  chatId: string;
  chatTitle: string;
  chatAvatar?: string;
  isGroup?: boolean;
  memberCount?: number;
}

export const MobileChatInterface: React.FC<MobileChatInterfaceProps> = ({
  chatId,
  chatTitle,
  chatAvatar,
  isGroup,
  memberCount
}) => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [replyToMessage, setReplyToMessage] = useState<Message | null>(null);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Pull-to-refresh gesture
  const [refreshProps, refreshApi] = useSpring(() => ({
    transform: 'translateY(0px)',
    opacity: 0,
  }));

  const bind = useGesture({
    onDrag: ({ down, movement: [, my], velocity: [, vy], direction: [, dy] }) => {
      if (my < 0) return; // Only allow downward drag
      
      if (down) {
        refreshApi.start({
          transform: `translateY(${Math.min(my, 80)}px)`,
          opacity: Math.min(my / 80, 1),
        });
      } else {
        if (my > 60 && vy > 0.5) {
          // Trigger refresh
          handleRefresh();
        }
        refreshApi.start({
          transform: 'translateY(0px)',
          opacity: 0,
        });
      }
    },
  });

  const handleRefresh = async () => {
    // Load more messages
    console.log('Refreshing messages...');
  };

  const handleSendMessage = (text: string, replyTo?: string) => {
    if (!text.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      text,
      user: user?.email?.split('@')[0] || 'You',
      timestamp: new Date(),
      type: 'sent',
      isDelivered: true,
    };

    setMessages(prev => [...prev, newMessage]);
    setReplyToMessage(null);

    // Simulate typing indicator
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      const botReply: Message = {
        id: (Date.now() + 1).toString(),
        text: `Got your message: "${text}"`,
        user: chatTitle,
        timestamp: new Date(),
        type: 'received',
        isDelivered: true,
        isRead: true,
      };
      setMessages(prev => [...prev, botReply]);
    }, 1500);
  };

  const handleMessageSwipe = (message: Message, direction: 'left' | 'right') => {
    if (direction === 'right') {
      // Reply to message
      setReplyToMessage(message);
      inputRef.current?.focus();
    } else if (direction === 'left') {
      // Forward or delete message
      console.log('Forward/delete message:', message.id);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-cyberdark-950">
      <MobileChatHeader
        title={chatTitle}
        subtitle={isGroup ? `${memberCount} members` : 'Last seen recently'}
        avatarUrl={chatAvatar}
        isGroup={isGroup}
        memberCount={memberCount}
        isOnline={!isGroup}
        isSecure={true}
        onCall={() => console.log('Call')}
        onVideoCall={() => console.log('Video call')}
        onOptions={() => console.log('Options')}
      />

      <div 
        ref={containerRef}
        className="flex-1 relative overflow-hidden"
        {...bind()}
      >
        {/* Pull to refresh indicator */}
        <animated.div
          style={refreshProps}
          className="absolute top-0 left-1/2 transform -translate-x-1/2 z-10"
        >
          <div className="bg-cyberdark-800 rounded-full p-2 shadow-lg">
            <div className="w-6 h-6 border-2 border-cybergold-400 border-t-transparent rounded-full animate-spin" />
          </div>
        </animated.div>

        <MobileMessageList
          messages={messages}
          onMessageSwipe={handleMessageSwipe}
          isTyping={isTyping}
          typingUser={isTyping ? chatTitle : undefined}
        />
      </div>

      <MobileInputArea
        ref={inputRef}
        onSendMessage={handleSendMessage}
        replyToMessage={replyToMessage}
        onCancelReply={() => setReplyToMessage(null)}
        placeholder={`Message ${chatTitle}...`}
      />
    </div>
  );
};
