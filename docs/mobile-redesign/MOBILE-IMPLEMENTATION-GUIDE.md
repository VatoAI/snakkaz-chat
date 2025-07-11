# 🚀 SNAKKAZ MOBILE IMPLEMENTATION GUIDE

## 📱 **IMMEDIATE ACTION PLAN - START TODAY!**

Based on analyzing Telegram, Signal, and modern mobile patterns, here's our step-by-step implementation:

---

## 🔧 **STEP 1: INSTALL MOBILE DEVELOPMENT TOOLS**

```bash
# Essential VS Code extensions for mobile development
```

```vscode-extensions
cirlorm.mobileview,npsulav.phoneview,flutterbricksproductions.flutterbricks,mrezechi3l.css-responsive
```

```bash
# Core mobile libraries
npm install --save \
  @use-gesture/react \
  react-spring \
  framer-motion \
  react-intersection-observer \
  react-window \
  react-swipeable \
  @headlessui/react \
  react-aria \
  workbox-webpack-plugin

# Mobile UI components
npm install --save \
  @tamagui/core \
  @tamagui/config \
  @tamagui/animations-react-native \
  clsx \
  class-variance-authority
```

---

## 📱 **STEP 2: CREATE MOBILE NAVIGATION SYSTEM**

### **A. Bottom Navigation Component**

```tsx
// src/components/mobile/MobileBottomNav.tsx
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/utils/cn';
import { 
  MessageCircle, 
  Users, 
  UserPlus, 
  Settings,
  Heart
} from 'lucide-react';

interface NavTab {
  id: string;
  label: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  path: string;
  badge?: number;
}

const tabs: NavTab[] = [
  {
    id: 'chats',
    label: 'Chats',
    icon: MessageCircle,
    path: '/chat',
    badge: 3
  },
  {
    id: 'friends',
    label: 'Friends',
    icon: Users,
    path: '/friends'
  },
  {
    id: 'groups',
    label: 'Groups',
    icon: UserPlus,
    path: '/groups'
  },
  {
    id: 'profile',
    label: 'Me',
    icon: Settings,
    path: '/profile'
  }
];

export const MobileBottomNav: React.FC = () => {
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-cyberdark-900/95 backdrop-blur-md border-t border-cyberdark-700">
      {/* Safe area for iPhone home indicator */}
      <div className="pb-safe">
        <div className="flex items-center justify-around px-4 py-2">
          {tabs.map((tab) => {
            const isActive = location.pathname.startsWith(tab.path);
            const Icon = tab.icon;
            
            return (
              <Link
                key={tab.id}
                to={tab.path}
                className={cn(
                  "flex flex-col items-center justify-center relative",
                  "min-h-[56px] min-w-[56px] px-2 py-1",
                  "transition-all duration-200 ease-out",
                  "active:scale-95",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cybergold-500",
                  isActive 
                    ? "text-cybergold-400" 
                    : "text-cyberdark-300 hover:text-cyberdark-100"
                )}
              >
                <div className="relative">
                  <Icon 
                    size={24} 
                    className={cn(
                      "transition-all duration-200",
                      isActive && "scale-110"
                    )} 
                  />
                  {tab.badge && (
                    <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full min-w-[18px] h-[18px] flex items-center justify-center font-medium">
                      {tab.badge > 99 ? '99+' : tab.badge}
                    </div>
                  )}
                </div>
                <span className={cn(
                  "text-xs font-medium mt-1 transition-all duration-200",
                  isActive ? "opacity-100" : "opacity-70"
                )}>
                  {tab.label}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
};
```

### **B. Mobile Chat Header**

```tsx
// src/components/mobile/MobileChatHeader.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/utils/cn';
import { 
  ArrowLeft, 
  Phone, 
  Video, 
  MoreVertical,
  Users,
  Shield
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';

interface MobileChatHeaderProps {
  title: string;
  subtitle?: string;
  avatarUrl?: string;
  isOnline?: boolean;
  memberCount?: number;
  isGroup?: boolean;
  isSecure?: boolean;
  onBack?: () => void;
  onCall?: () => void;
  onVideoCall?: () => void;
  onOptions?: () => void;
}

export const MobileChatHeader: React.FC<MobileChatHeaderProps> = ({
  title,
  subtitle,
  avatarUrl,
  isOnline,
  memberCount,
  isGroup,
  isSecure,
  onBack,
  onCall,
  onVideoCall,
  onOptions
}) => {
  const navigate = useNavigate();

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      navigate(-1);
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-cyberdark-900/95 backdrop-blur-md border-b border-cyberdark-700">
      {/* Safe area for notch */}
      <div className="pt-safe">
        <div className="flex items-center justify-between px-4 py-3">
          {/* Left section */}
          <div className="flex items-center space-x-3 flex-1 min-w-0">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleBack}
              className="p-2 -ml-2 hover:bg-cyberdark-800"
            >
              <ArrowLeft size={20} className="text-cyberdark-300" />
            </Button>

            <div className="relative">
              <Avatar className="w-10 h-10">
                <AvatarImage src={avatarUrl} alt={title} />
                <AvatarFallback className="bg-cybergold-500/20 text-cybergold-400">
                  {isGroup ? <Users size={16} /> : title.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              {isOnline && !isGroup && (
                <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-cyberdark-900 rounded-full" />
              )}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2">
                <h1 className="text-white font-semibold truncate">
                  {title}
                </h1>
                {isSecure && (
                  <Shield size={14} className="text-cybergold-400 flex-shrink-0" />
                )}
              </div>
              {subtitle && (
                <p className="text-cyberdark-300 text-sm truncate">
                  {isGroup && memberCount ? `${memberCount} members` : subtitle}
                </p>
              )}
            </div>
          </div>

          {/* Right actions */}
          <div className="flex items-center space-x-1">
            {onCall && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onCall}
                className="p-2 hover:bg-cyberdark-800"
              >
                <Phone size={20} className="text-cyberdark-300" />
              </Button>
            )}

            {onVideoCall && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onVideoCall}
                className="p-2 hover:bg-cyberdark-800"
              >
                <Video size={20} className="text-cyberdark-300" />
              </Button>
            )}

            <Button
              variant="ghost"
              size="sm"
              onClick={onOptions}
              className="p-2 hover:bg-cyberdark-800"
            >
              <MoreVertical size={20} className="text-cyberdark-300" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};
```

---

## 💬 **STEP 3: MOBILE CHAT INTERFACE**

### **A. Enhanced Mobile Chat Page**

```tsx
// src/components/mobile/MobileChatInterface.tsx
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
  const inputRef = useRef<HTMLInputElement>(null);

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
```

### **B. Mobile Message List with Gestures**

```tsx
// src/components/mobile/MobileMessageList.tsx
import React, { useEffect, useRef } from 'react';
import { FixedSizeList as List } from 'react-window';
import { useGesture } from '@use-gesture/react';
import { useSpring, animated } from 'react-spring';
import { cn } from '@/utils/cn';
import { formatDistanceToNow } from 'date-fns';
import { Check, CheckCheck, Reply, Forward } from 'lucide-react';

interface Message {
  id: string;
  text: string;
  user: string;
  timestamp: Date;
  type: 'sent' | 'received';
  isDelivered?: boolean;
  isRead?: boolean;
}

interface MobileMessageListProps {
  messages: Message[];
  onMessageSwipe: (message: Message, direction: 'left' | 'right') => void;
  isTyping?: boolean;
  typingUser?: string;
}

const MessageBubble: React.FC<{
  message: Message;
  onSwipe: (direction: 'left' | 'right') => void;
}> = ({ message, onSwipe }) => {
  const isSent = message.type === 'sent';
  
  const [springs, api] = useSpring(() => ({
    x: 0,
    scale: 1,
    opacity: 1,
  }));

  const bind = useGesture({
    onDrag: ({ down, movement: [mx], velocity: [vx], direction: [dx] }) => {
      const trigger = Math.abs(mx) > 80;
      
      if (down) {
        api.start({
          x: mx,
          scale: trigger ? 0.95 : 1,
        });
      } else {
        if (trigger && Math.abs(vx) > 0.5) {
          onSwipe(dx > 0 ? 'right' : 'left');
        }
        api.start({
          x: 0,
          scale: 1,
        });
      }
    },
  });

  return (
    <div className={cn(
      "flex w-full px-4 py-1",
      isSent ? "justify-end" : "justify-start"
    )}>
      <animated.div
        {...bind()}
        style={springs}
        className={cn(
          "relative max-w-[80%] group",
          "touch-pan-y" // Allow vertical scrolling
        )}
      >
        {/* Swipe action indicators */}
        <div className="absolute inset-y-0 -left-12 flex items-center opacity-0 group-hover:opacity-100 transition-opacity">
          <Reply size={20} className="text-cybergold-400" />
        </div>
        <div className="absolute inset-y-0 -right-12 flex items-center opacity-0 group-hover:opacity-100 transition-opacity">
          <Forward size={20} className="text-cyberdark-400" />
        </div>

        <div className={cn(
          "px-4 py-2 rounded-2xl shadow-lg",
          "break-words hyphens-auto",
          isSent 
            ? "bg-cybergold-500 text-cyberdark-900 rounded-br-md" 
            : "bg-cyberdark-800 text-white rounded-bl-md"
        )}>
          <p className="text-sm leading-relaxed">{message.text}</p>
          
          <div className={cn(
            "flex items-center justify-end mt-1 space-x-1",
            isSent ? "text-cyberdark-700" : "text-cyberdark-400"
          )}>
            <span className="text-xs">
              {formatDistanceToNow(message.timestamp, { addSuffix: false })}
            </span>
            {isSent && (
              <div className="flex">
                {message.isRead ? (
                  <CheckCheck size={14} className="text-blue-400" />
                ) : message.isDelivered ? (
                  <CheckCheck size={14} />
                ) : (
                  <Check size={14} />
                )}
              </div>
            )}
          </div>
        </div>
      </animated.div>
    </div>
  );
};

export const MobileMessageList: React.FC<MobileMessageListProps> = ({
  messages,
  onMessageSwipe,
  isTyping,
  typingUser
}) => {
  const listRef = useRef<List>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollToItem(messages.length - 1, 'end');
    }
  }, [messages.length]);

  const renderMessage = ({ index, style }: { index: number; style: React.CSSProperties }) => {
    const message = messages[index];
    return (
      <div style={style}>
        <MessageBubble
          message={message}
          onSwipe={(direction) => onMessageSwipe(message, direction)}
        />
      </div>
    );
  };

  return (
    <div className="flex-1 relative">
      <List
        ref={listRef}
        height={window.innerHeight - 200} // Approximate available height
        itemCount={messages.length}
        itemSize={80} // Approximate message height
        className="scrollbar-thin scrollbar-thumb-cyberdark-600 scrollbar-track-transparent"
      >
        {renderMessage}
      </List>

      {/* Typing indicator */}
      {isTyping && typingUser && (
        <div className="absolute bottom-4 left-4">
          <div className="bg-cyberdark-800 rounded-2xl px-4 py-2 shadow-lg">
            <div className="flex items-center space-x-2">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-cyberdark-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-2 h-2 bg-cyberdark-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-2 h-2 bg-cyberdark-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
              <span className="text-xs text-cyberdark-300">{typingUser} is typing...</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
```

---

## 🎯 **STEP 4: MOBILE INPUT SYSTEM**

```tsx
// src/components/mobile/MobileInputArea.tsx
import React, { useState, useRef, forwardRef } from 'react';
import { useGesture } from '@use-gesture/react';
import { useSpring, animated } from 'react-spring';
import { cn } from '@/utils/cn';
import { 
  Send, 
  Smile, 
  Paperclip, 
  Mic, 
  X,
  Image,
  Camera
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

interface Message {
  id: string;
  text: string;
  user: string;
  timestamp: Date;
  type: 'sent' | 'received';
}

interface MobileInputAreaProps {
  onSendMessage: (text: string, replyTo?: string) => void;
  replyToMessage?: Message | null;
  onCancelReply?: () => void;
  placeholder?: string;
}

export const MobileInputArea = forwardRef<HTMLTextAreaElement, MobileInputAreaProps>(({
  onSendMessage,
  replyToMessage,
  onCancelReply,
  placeholder = "Type a message..."
}, ref) => {
  const [message, setMessage] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [showAttachments, setShowAttachments] = useState(false);
  
  const recordingRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Voice recording gesture
  const [recordProps, recordApi] = useSpring(() => ({
    scale: 1,
    opacity: 1,
  }));

  const recordBind = useGesture({
    onDragStart: () => {
      setIsRecording(true);
      recordApi.start({ scale: 1.2, opacity: 0.8 });
    },
    onDrag: ({ movement: [mx], cancel }) => {
      if (mx < -100) {
        // Cancel recording if dragged too far left
        cancel();
        setIsRecording(false);
        recordApi.start({ scale: 1, opacity: 1 });
      }
    },
    onDragEnd: () => {
      setIsRecording(false);
      recordApi.start({ scale: 1, opacity: 1 });
      // Send voice message here
    },
  });

  const handleSend = () => {
    if (message.trim()) {
      onSendMessage(message, replyToMessage?.id);
      setMessage('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleAttachment = (type: 'photo' | 'camera' | 'file') => {
    setShowAttachments(false);
    
    if (type === 'photo' || type === 'file') {
      fileInputRef.current?.click();
    } else if (type === 'camera') {
      // Open camera
      console.log('Open camera');
    }
  };

  return (
    <div className="bg-cyberdark-900/95 backdrop-blur-md border-t border-cyberdark-700">
      {/* Safe area for iPhone home indicator */}
      <div className="pb-safe">
        {/* Reply preview */}
        {replyToMessage && (
          <div className="px-4 py-2 bg-cyberdark-800/50 border-l-4 border-cybergold-500 mx-4 mt-2 rounded">
            <div className="flex items-center justify-between">
              <div className="flex-1 min-w-0">
                <p className="text-xs text-cybergold-400 font-medium">
                  Replying to {replyToMessage.user}
                </p>
                <p className="text-sm text-cyberdark-300 truncate">
                  {replyToMessage.text}
                </p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={onCancelReply}
                className="p-1 ml-2"
              >
                <X size={16} />
              </Button>
            </div>
          </div>
        )}

        {/* Attachment options */}
        {showAttachments && (
          <div className="px-4 py-2">
            <div className="flex space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleAttachment('camera')}
                className="flex flex-col items-center p-3"
              >
                <Camera size={24} className="text-cybergold-400" />
                <span className="text-xs mt-1">Camera</span>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleAttachment('photo')}
                className="flex flex-col items-center p-3"
              >
                <Image size={24} className="text-cybergold-400" />
                <span className="text-xs mt-1">Photo</span>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleAttachment('file')}
                className="flex flex-col items-center p-3"
              >
                <Paperclip size={24} className="text-cybergold-400" />
                <span className="text-xs mt-1">File</span>
              </Button>
            </div>
          </div>
        )}

        {/* Input area */}
        <div className="flex items-end space-x-2 p-4">
          {/* Attachment button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowAttachments(!showAttachments)}
            className={cn(
              "p-2 mb-1",
              showAttachments && "bg-cyberdark-800"
            )}
          >
            <Paperclip size={20} className="text-cyberdark-300" />
          </Button>

          {/* Text input */}
          <div className="flex-1 relative">
            <Textarea
              ref={ref}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={placeholder}
              className={cn(
                "min-h-[44px] max-h-32 resize-none",
                "bg-cyberdark-800 border-cyberdark-600",
                "text-white placeholder-cyberdark-400",
                "rounded-2xl px-4 py-3 pr-12",
                "focus:ring-2 focus:ring-cybergold-500 focus:border-transparent"
              )}
              rows={1}
            />
            
            {/* Emoji button */}
            <Button
              variant="ghost"
              size="sm"
              className="absolute right-2 bottom-2 p-1"
            >
              <Smile size={18} className="text-cyberdark-400" />
            </Button>
          </div>

          {/* Send/Voice button */}
          {message.trim() ? (
            <Button
              onClick={handleSend}
              className="bg-cybergold-500 hover:bg-cybergold-600 text-cyberdark-900 rounded-full p-3 mb-1"
            >
              <Send size={20} />
            </Button>
          ) : (
            <animated.div
              ref={recordingRef}
              style={recordProps}
              {...recordBind()}
              className={cn(
                "rounded-full p-3 mb-1 touch-none",
                isRecording 
                  ? "bg-red-500 text-white" 
                  : "bg-cyberdark-800 text-cyberdark-300"
              )}
            >
              <Mic size={20} />
            </animated.div>
          )}
        </div>

        {/* Voice recording indicator */}
        {isRecording && (
          <div className="px-4 pb-2">
            <div className="flex items-center justify-center space-x-2 text-red-400">
              <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
              <span className="text-sm">Recording... slide left to cancel</span>
            </div>
          </div>
        )}
      </div>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*,*"
        multiple
        className="hidden"
        onChange={(e) => {
          const files = Array.from(e.target.files || []);
          console.log('Selected files:', files);
        }}
      />
    </div>
  );
});

MobileInputArea.displayName = 'MobileInputArea';
```

---

## 📱 **STEP 5: MOBILE LAYOUT WRAPPER**

```tsx
// src/components/mobile/MobileLayout.tsx
import React from 'react';
import { Outlet } from 'react-router-dom';
import { MobileBottomNav } from './MobileBottomNav';
import { cn } from '@/utils/cn';

export const MobileLayout: React.FC = () => {
  return (
    <div className="relative min-h-screen bg-cyberdark-950">
      {/* Main content area */}
      <main className={cn(
        "pb-20", // Space for bottom navigation
        "min-h-screen"
      )}>
        <Outlet />
      </main>

      {/* Bottom navigation */}
      <MobileBottomNav />
    </div>
  );
};
```

---

## 🎨 **STEP 6: MOBILE-FIRST CSS UPDATES**

```scss
// src/styles/mobile.scss
// Add to your main CSS file

// Safe area support for iOS
:root {
  --safe-area-inset-top: env(safe-area-inset-top);
  --safe-area-inset-bottom: env(safe-area-inset-bottom);
  --safe-area-inset-left: env(safe-area-inset-left);
  --safe-area-inset-right: env(safe-area-inset-right);
}

.pt-safe {
  padding-top: var(--safe-area-inset-top);
}

.pb-safe {
  padding-bottom: var(--safe-area-inset-bottom);
}

.pl-safe {
  padding-left: var(--safe-area-inset-left);
}

.pr-safe {
  padding-right: var(--safe-area-inset-right);
}

// Touch-friendly interactions
.touch-none {
  touch-action: none;
}

.touch-pan-y {
  touch-action: pan-y;
}

.touch-pan-x {
  touch-action: pan-x;
}

// Smooth animations for mobile
@media (prefers-reduced-motion: no-preference) {
  * {
    scroll-behavior: smooth;
  }
}

// Mobile-specific scrollbars
.scrollbar-thin {
  scrollbar-width: thin;
}

.scrollbar-thumb-cyberdark-600::-webkit-scrollbar-thumb {
  background-color: rgb(75 85 99);
  border-radius: 9999px;
}

.scrollbar-track-transparent::-webkit-scrollbar-track {
  background-color: transparent;
}

// Mobile breakpoints
@media (max-width: 768px) {
  // Optimize for mobile
  html {
    font-size: 16px; // Prevent zoom on input focus
  }
  
  input,
  textarea,
  select {
    font-size: 16px; // Prevent zoom on iOS
  }
  
  // Larger touch targets
  button,
  [role="button"],
  input[type="submit"],
  input[type="button"] {
    min-height: 44px;
    min-width: 44px;
  }
}

// Dark mode optimizations for mobile
@media (prefers-color-scheme: dark) {
  // Optimize for OLED displays
  .bg-true-black {
    background-color: #000000;
  }
}

// Landscape mode adjustments
@media (orientation: landscape) and (max-height: 500px) {
  // Compact UI for landscape phones
  .mobile-compact {
    padding: 0.5rem;
  }
}
```

---

## 🚀 **STEP 7: UPDATE APP ROUTER**

```tsx
// src/AppRouter.tsx - Add mobile routes
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from '@/hooks/useAuth';
import { MobileLayout } from '@/components/mobile/MobileLayout';
import { MobileChatInterface } from '@/components/mobile/MobileChatInterface';

// Import existing components
import Login from '@/pages/Login';
import Register from '@/pages/Register';
import BasicChatPage from '@/pages/BasicChatPage';
import Groups from '@/pages/Groups';
import Profile from '@/pages/Profile';

const AppRouter: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Auth routes (no layout) */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* Mobile app routes */}
          <Route path="/" element={<MobileLayout />}>
            <Route index element={<Navigate to="/chat" replace />} />
            <Route path="chat" element={<BasicChatPage />} />
            <Route path="chat/:id" element={
              <MobileChatInterface 
                chatId="1" 
                chatTitle="John Doe" 
                chatAvatar="/avatars/john.jpg"
              />
            } />
            <Route path="friends" element={<div>Friends Page</div>} />
            <Route path="groups" element={<Groups />} />
            <Route path="groups/:id" element={
              <MobileChatInterface 
                chatId="group-1" 
                chatTitle="Team Chat" 
                isGroup={true}
                memberCount={5}
              />
            } />
            <Route path="profile" element={<Profile />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default AppRouter;
```

---

## 📱 **STEP 8: TESTING ON MOBILE DEVICES**

```bash
# Start development server
npm run dev

# Open in mobile view extensions
# Use MobileView and PhoneView extensions in VS Code

# Test on real devices
# Open http://your-ip:5173 on your phone
# Or use ngrok for external testing
npx ngrok http 5173
```

---

## 🎯 **SUCCESS METRICS TO AIM FOR**

```typescript
// Mobile Performance Targets
interface MobilePerformanceTargets {
  loadTime: "< 2 seconds"
  scrollFPS: "60 FPS"
  touchResponse: "< 100ms"
  gestureRecognition: "< 50ms"
  memoryUsage: "< 100MB"
  batteryImpact: "Minimal"
}
```

---

## 🚀 **IMMEDIATE NEXT STEPS**

1. **Install Extensions**: Install the mobile development extensions
2. **Install Dependencies**: Run the npm install commands
3. **Create Components**: Copy the component code into your project
4. **Update Router**: Add the mobile routes
5. **Test Mobile**: Use the mobile view extensions to test

**Vil du at jeg starter med å implementere disse komponentene i ditt SnakkaZ prosjekt nå? 📱🚀**

*This will give you a world-class mobile chat experience like Telegram and Signal! 🌟*
