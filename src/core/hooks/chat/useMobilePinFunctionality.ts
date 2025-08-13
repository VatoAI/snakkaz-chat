/**
 * useMobilePinFunctionality Hook
 * 
 * A custom hook specifically designed for mobile pin functionality
 * Enhances the pin experience on mobile/touch devices
 */

import { useState, useEffect } from 'react';
import { useDeviceDetection } from '@/hooks/useDeviceDetection';
import { DecryptedMessage } from '@/types/message';

interface UseMobilePinFunctionalityOptions {
  chatId: string | null;
  chatType: 'private' | 'group' | 'global';
  pinnedMessageIds: Set<string>;
  onPinMessage: (messageId: string) => Promise<void>;
  onUnpinMessage: (messageId: string) => Promise<void>;
}

interface MobilePinFunctionality {
  isLongPressing: boolean;
  longPressedMessageId: string | null;
  isPinOptionsOpen: boolean;
  handleLongPress: (messageId: string) => void;
  handleTouchEnd: () => void;
  handlePinOptionSelect: (action: 'pin' | 'unpin') => void;
  showPinOptions: (messageId: string) => void;
  hidePinOptions: () => void;
}

export const useMobilePinFunctionality = ({
  chatId,
  chatType,
  pinnedMessageIds,
  onPinMessage,
  onUnpinMessage
}: UseMobilePinFunctionalityOptions): MobilePinFunctionality => {
  const { isMobile, isTablet, isTouchDevice } = useDeviceDetection();
  const [isLongPressing, setIsLongPressing] = useState(false);
  const [longPressTimeout, setLongPressTimeout] = useState<NodeJS.Timeout | null>(null);
  const [longPressedMessageId, setLongPressedMessageId] = useState<string | null>(null);
  const [isPinOptionsOpen, setIsPinOptionsOpen] = useState(false);

  // Clean up timeout on unmount
  useEffect(() => {
    return () => {
      if (longPressTimeout) {
        clearTimeout(longPressTimeout);
      }
    };
  }, [longPressTimeout]);

  // Only enable touch-specific features on mobile/touch devices
  const isTouchEnabled = isMobile || isTablet || isTouchDevice;

  /**
   * Handle long press on a message
   * This is the main entry point for mobile pin functionality
   */
  const handleLongPress = (messageId: string) => {
    if (!isTouchEnabled) return;

    // Clear any existing timeout
    if (longPressTimeout) {
      clearTimeout(longPressTimeout);
    }

    // Start a new long press timeout
    const timeout = setTimeout(() => {
      setIsLongPressing(true);
      setLongPressedMessageId(messageId);
      showPinOptions(messageId);
    }, 500); // 500ms is a good duration for a long press

    setLongPressTimeout(timeout);
  };

  /**
   * Handle touch end event
   * This clears the long press state
   */
  const handleTouchEnd = () => {
    if (longPressTimeout) {
      clearTimeout(longPressTimeout);
      setLongPressTimeout(null);
    }
    setIsLongPressing(false);
  };

  /**
   * Show pin options popup for a specific message
   */
  const showPinOptions = (messageId: string) => {
    setLongPressedMessageId(messageId);
    setIsPinOptionsOpen(true);
  };

  /**
   * Hide pin options popup
   */
  const hidePinOptions = () => {
    setIsPinOptionsOpen(false);
    setLongPressedMessageId(null);
  };

  /**
   * Handle when a user selects a pin option (pin or unpin)
   */
  const handlePinOptionSelect = async (action: 'pin' | 'unpin') => {
    if (!longPressedMessageId) return;

    try {
      if (action === 'pin') {
        await onPinMessage(longPressedMessageId);
      } else {
        await onUnpinMessage(longPressedMessageId);
      }
    } catch (error) {
      console.error(`Failed to ${action} message:`, error);
    } finally {
      hidePinOptions();
    }
  };

  return {
    isLongPressing,
    longPressedMessageId,
    isPinOptionsOpen,
    handleLongPress,
    handleTouchEnd,
    handlePinOptionSelect,
    showPinOptions,
    hidePinOptions
  };
};

export default useMobilePinFunctionality;
