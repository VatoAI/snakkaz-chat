/**
 * MobileChatMessage Component
 * 
 * A mobile-friendly wrapper for the ChatMessage component that adds touch
 * interactions for pin functionality on mobile devices.
 */

import React, { useState, useRef } from 'react';
import { ChatMessage } from '@/components/chat/ChatMessage';
import { DecryptedMessage } from '@/types/message';
import { UserProfile } from '@/types/profile';
import { MobilePinOptionsPopup } from './MobilePinOptionsPopup';
import { useMobilePinFunctionality } from '@/hooks/chat/useMobilePinFunctionality';

interface MobileChatMessageProps {
  message: DecryptedMessage;
  isCurrentUser: boolean;
  userProfiles: Record<string, UserProfile>;
  onEdit?: () => void;
  onDelete?: () => void;
  onPin?: (id: string) => Promise<void>;
  onUnpin?: (id: string) => Promise<void>;
  onCopy?: (content: string) => void;
  onShare?: (message: DecryptedMessage) => void;
  isPinned?: boolean;
  canPin?: boolean;
  chatType?: 'private' | 'group' | 'global';
  chatId?: string;
  pinnedMessageIds?: Set<string>;
}

export const MobileChatMessage: React.FC<MobileChatMessageProps> = ({
  message,
  isCurrentUser,
  userProfiles,
  onEdit,
  onDelete,
  onPin,
  onUnpin,
  onCopy,
  onShare,
  isPinned = false,
  canPin = true,
  chatType = 'private',
  chatId,
  pinnedMessageIds = new Set(),
}) => {
  const messageRef = useRef<HTMLDivElement>(null);
  const [popupPosition, setPopupPosition] = useState({ top: 0, left: 0 });

  // Use the mobile pin functionality hook
  const {
    isLongPressing,
    longPressedMessageId,
    isPinOptionsOpen,
    handleLongPress,
    handleTouchEnd,
    handlePinOptionSelect,
    showPinOptions,
    hidePinOptions,
  } = useMobilePinFunctionality({
    chatId: chatId || null,
    chatType,
    pinnedMessageIds,
    onPinMessage: onPin || (() => Promise.resolve()),
    onUnpinMessage: onUnpin || (() => Promise.resolve()),
  });

  // Calculate the popup position based on the message element position
  const calculatePopupPosition = (messageId: string) => {
    if (messageRef.current) {
      const rect = messageRef.current.getBoundingClientRect();
      setPopupPosition({
        top: rect.top + window.scrollY,
        left: rect.left + window.scrollX - (isCurrentUser ? 150 : 0),
      });
    }
    
    // If we have a valid message ID, show the pin options
    if (messageId) {
      showPinOptions(messageId);
    }
  };

  // Handle touch start on the message
  const handleTouchStart = () => {
    if (message.id && canPin) {
      handleLongPress(message.id);
    }
  };

  // Handle when users select a pin/unpin option
  const handlePinOptionSelectWrapper = (action: 'pin' | 'unpin') => {
    handlePinOptionSelect(action);
  };

  // Handle copy option
  const handleCopyOption = (messageId: string) => {
    if (onCopy && message.content) {
      onCopy(message.content);
    }
  };

  // Handle share option
  const handleShareOption = (messageId: string) => {
    if (onShare) {
      onShare(message);
    }
  };

  return (
    <div ref={messageRef}>
      <div
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onTouchCancel={handleTouchEnd}
        onContextMenu={(e) => {
          if (message.id && canPin) {
            e.preventDefault();
            calculatePopupPosition(message.id);
          }
        }}
        className={`${isLongPressing && longPressedMessageId === message.id ? 'opacity-70' : ''}`}
        data-testid="mobile-chat-message"
      >
        <ChatMessage
          message={message}
          isCurrentUser={isCurrentUser}
          userProfiles={userProfiles}
          onEdit={onEdit}
          onDelete={onDelete}
          onPin={canPin && onPin ? (id) => {
            calculatePopupPosition(id);
            return Promise.resolve();
          } : undefined}
          onCopy={onCopy}
          onShare={onShare}
          isPinned={isPinned}
          canPin={canPin}
          chatType={chatType}
        />
      </div>

      {/* Mobile pin options popup */}
      <MobilePinOptionsPopup
        isVisible={isPinOptionsOpen}
        messageId={longPressedMessageId}
        isPinned={isPinned}
        onPinOption={handlePinOptionSelectWrapper}
        onCopyOption={onCopy ? handleCopyOption : undefined}
        onShareOption={onShare ? handleShareOption : undefined}
        onClose={hidePinOptions}
        position={popupPosition}
      />
    </div>
  );
};

export default MobileChatMessage;
