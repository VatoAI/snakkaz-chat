import React, { useState, useRef, useCallback, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Reply, Archive, Trash2, Star, Copy } from 'lucide-react';

interface SwipeAction {
  id: string;
  icon: React.ElementType;
  label: string;
  color: string;
  bgColor: string;
  onAction: () => void;
}

interface MobileGesturesProps {
  children: React.ReactNode;
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onLongPress?: () => void;
  onDoubleTap?: () => void;
  leftActions?: SwipeAction[];
  rightActions?: SwipeAction[];
  disabled?: boolean;
  className?: string;
  swipeThreshold?: number;
  longPressDelay?: number;
}

interface TouchData {
  startX: number;
  startY: number;
  startTime: number;
  isPressed: boolean;
  hasMoved: boolean;
}

export const MobileGestures: React.FC<MobileGesturesProps> = ({
  children,
  onSwipeLeft,
  onSwipeRight,
  onLongPress,
  onDoubleTap,
  leftActions = [],
  rightActions = [],
  disabled = false,
  className,
  swipeThreshold = 80,
  longPressDelay = 500
}) => {
  const [translateX, setTranslateX] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [showLeftActions, setShowLeftActions] = useState(false);
  const [showRightActions, setShowRightActions] = useState(false);
  const [longPressTriggered, setLongPressTriggered] = useState(false);
  
  const touchData = useRef<TouchData>({
    startX: 0,
    startY: 0,
    startTime: 0,
    isPressed: false,
    hasMoved: false
  });
  
  const longPressTimer = useRef<NodeJS.Timeout>();
  const lastTapTime = useRef(0);

  const resetState = useCallback(() => {
    setTranslateX(0);
    setShowLeftActions(false);
    setShowRightActions(false);
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 300);
  }, []);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (disabled) return;

    const touch = e.touches[0];
    touchData.current = {
      startX: touch.clientX,
      startY: touch.clientY,
      startTime: Date.now(),
      isPressed: true,
      hasMoved: false
    };

    setLongPressTriggered(false);

    // Start long press timer
    if (onLongPress) {
      longPressTimer.current = setTimeout(() => {
        if (touchData.current.isPressed && !touchData.current.hasMoved) {
          setLongPressTriggered(true);
          onLongPress();
          // Add haptic feedback if available
          if (navigator.vibrate) {
            navigator.vibrate(50);
          }
        }
      }, longPressDelay);
    }
  }, [disabled, onLongPress, longPressDelay]);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (disabled || !touchData.current.isPressed) return;

    const touch = e.touches[0];
    const deltaX = touch.clientX - touchData.current.startX;
    const deltaY = Math.abs(touch.clientY - touchData.current.startY);

    // Cancel long press if user moves
    if (!touchData.current.hasMoved && (Math.abs(deltaX) > 10 || deltaY > 10)) {
      touchData.current.hasMoved = true;
      if (longPressTimer.current) {
        clearTimeout(longPressTimer.current);
      }
    }

    // Only allow horizontal swipes (ignore vertical scrolling)
    if (deltaY > 30) return;

    // Prevent default to stop scrolling when swiping horizontally
    if (Math.abs(deltaX) > 20) {
      e.preventDefault();
    }

    // Apply resistance to the swipe
    const resistance = 0.7;
    const maxSwipe = 120;
    const dampedDelta = Math.sign(deltaX) * Math.min(Math.abs(deltaX) * resistance, maxSwipe);

    setTranslateX(dampedDelta);

    // Show/hide action buttons based on swipe distance
    if (deltaX > swipeThreshold / 2 && rightActions.length > 0) {
      setShowRightActions(true);
      setShowLeftActions(false);
    } else if (deltaX < -swipeThreshold / 2 && leftActions.length > 0) {
      setShowLeftActions(true);
      setShowRightActions(false);
    } else {
      setShowLeftActions(false);
      setShowRightActions(false);
    }
  }, [disabled, swipeThreshold, leftActions.length, rightActions.length]);

  const handleTouchEnd = useCallback(() => {
    if (disabled) return;

    const deltaX = translateX;
    const deltaTime = Date.now() - touchData.current.startTime;
    
    // Clear long press timer
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
    }

    // Handle double tap
    if (onDoubleTap && !touchData.current.hasMoved && deltaTime < 300) {
      const now = Date.now();
      if (now - lastTapTime.current < 300) {
        onDoubleTap();
        lastTapTime.current = 0; // Reset to prevent triple tap
        resetState();
        return;
      }
      lastTapTime.current = now;
    }

    // Handle swipe actions
    if (Math.abs(deltaX) > swipeThreshold) {
      if (deltaX > 0 && onSwipeRight) {
        onSwipeRight();
      } else if (deltaX < 0 && onSwipeLeft) {
        onSwipeLeft();
      }
    }

    // Reset state
    touchData.current.isPressed = false;
    resetState();
  }, [disabled, translateX, swipeThreshold, onSwipeLeft, onSwipeRight, onDoubleTap, resetState]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (longPressTimer.current) {
        clearTimeout(longPressTimer.current);
      }
    };
  }, []);

  const handleActionClick = (action: SwipeAction) => {
    action.onAction();
    resetState();
  };

  return (
    <div className={cn('relative overflow-hidden', className)}>
      {/* Left actions */}
      {leftActions.length > 0 && (
        <div 
          className={cn(
            'absolute left-0 top-0 bottom-0 flex items-center gap-1 px-2 transition-all duration-300',
            showLeftActions ? 'opacity-100' : 'opacity-0 pointer-events-none'
          )}
        >
          {leftActions.map((action) => {
            const IconComponent = action.icon;
            return (
              <button
                key={action.id}
                onClick={() => handleActionClick(action)}
                className={cn(
                  'w-10 h-10 rounded-full flex items-center justify-center transition-transform hover:scale-110',
                  action.bgColor,
                  action.color,
                  'animate-in slide-in-from-left duration-300'
                )}
                title={action.label}
              >
                <IconComponent className="w-5 h-5" />
              </button>
            );
          })}
        </div>
      )}

      {/* Right actions */}
      {rightActions.length > 0 && (
        <div 
          className={cn(
            'absolute right-0 top-0 bottom-0 flex items-center gap-1 px-2 transition-all duration-300',
            showRightActions ? 'opacity-100' : 'opacity-0 pointer-events-none'
          )}
        >
          {rightActions.map((action) => {
            const IconComponent = action.icon;
            return (
              <button
                key={action.id}
                onClick={() => handleActionClick(action)}
                className={cn(
                  'w-10 h-10 rounded-full flex items-center justify-center transition-transform hover:scale-110',
                  action.bgColor,
                  action.color,
                  'animate-in slide-in-from-right duration-300'
                )}
                title={action.label}
              >
                <IconComponent className="w-5 h-5" />
              </button>
            );
          })}
        </div>
      )}

      {/* Main content */}
      <div
        className={cn(
          'transition-transform duration-300 ease-out',
          isAnimating && 'transition-transform',
          longPressTriggered && 'bg-cybergold-500/10 rounded-lg'
        )}
        style={{ 
          transform: `translateX(${translateX}px)`,
          transitionDuration: isAnimating ? '300ms' : '0ms'
        }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {children}
      </div>
    </div>
  );
};

// Pre-configured message gestures component
export const MessageGestures: React.FC<{
  children: React.ReactNode;
  messageId: string;
  onReply?: () => void;
  onDelete?: () => void;
  onStar?: () => void;
  onCopy?: () => void;
  onEdit?: () => void;
  canDelete?: boolean;
  canEdit?: boolean;
  className?: string;
}> = ({
  children,
  messageId,
  onReply,
  onDelete,
  onStar,
  onCopy,
  onEdit,
  canDelete = false,
  canEdit = false,
  className
}) => {
  const leftActions: SwipeAction[] = [];
  const rightActions: SwipeAction[] = [];

  // Right swipe actions (left side)
  if (onReply) {
    leftActions.push({
      id: 'reply',
      icon: Reply,
      label: 'Svar',
      color: 'text-blue-100',
      bgColor: 'bg-blue-500',
      onAction: onReply
    });
  }

  if (onStar) {
    leftActions.push({
      id: 'star',
      icon: Star,
      label: 'Merk',
      color: 'text-yellow-100',
      bgColor: 'bg-yellow-500',
      onAction: onStar
    });
  }

  // Left swipe actions (right side)
  if (onCopy) {
    rightActions.push({
      id: 'copy',
      icon: Copy,
      label: 'Kopier',
      color: 'text-gray-100',
      bgColor: 'bg-gray-500',
      onAction: onCopy
    });
  }

  if (canDelete && onDelete) {
    rightActions.push({
      id: 'delete',
      icon: Trash2,
      label: 'Slett',
      color: 'text-red-100',
      bgColor: 'bg-red-500',
      onAction: onDelete
    });
  }

  return (
    <MobileGestures
      leftActions={leftActions}
      rightActions={rightActions}
      onLongPress={canEdit ? onEdit : undefined}
      className={className}
    >
      {children}
    </MobileGestures>
  );
};

// Touch feedback component for buttons
export const TouchFeedback: React.FC<{
  children: React.ReactNode;
  onPress?: () => void;
  onLongPress?: () => void;
  disabled?: boolean;
  className?: string;
  hapticFeedback?: boolean;
}> = ({
  children,
  onPress,
  onLongPress,
  disabled = false,
  className,
  hapticFeedback = true
}) => {
  const [isPressed, setIsPressed] = useState(false);
  const longPressTimer = useRef<NodeJS.Timeout>();

  const handleTouchStart = () => {
    if (disabled) return;
    
    setIsPressed(true);
    
    if (onLongPress) {
      longPressTimer.current = setTimeout(() => {
        onLongPress();
        if (hapticFeedback && navigator.vibrate) {
          navigator.vibrate(50);
        }
      }, 500);
    }
  };

  const handleTouchEnd = () => {
    if (disabled) return;
    
    setIsPressed(false);
    
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
    }
    
    if (onPress) {
      onPress();
      if (hapticFeedback && navigator.vibrate) {
        navigator.vibrate(20);
      }
    }
  };

  const handleTouchCancel = () => {
    setIsPressed(false);
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
    }
  };

  return (
    <div
      className={cn(
        'transition-transform active:scale-95',
        isPressed && 'scale-95',
        disabled && 'pointer-events-none opacity-50',
        className
      )}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onTouchCancel={handleTouchCancel}
      onMouseDown={handleTouchStart}
      onMouseUp={handleTouchEnd}
      onMouseLeave={handleTouchCancel}
    >
      {children}
    </div>
  );
};

export default MobileGestures;
