import { CustomEmoji } from '@/hooks/useCustomEmojis';

/**
 * Custom emoji utilities for handling emoji display, reactions, and processing
 */

/**
 * Process emoji shortcodes in text and replace with custom emoji images
 * @param text - Text containing shortcodes like :emoji_name:
 * @param customEmojis - Array of available custom emojis
 * @returns Text with shortcodes replaced with HTML img elements
 */
export const processCustomEmojiShortcodes = (text: string, customEmojis: CustomEmoji[]): string => {
  // Match :shortcode: pattern
  const shortcodeRegex = /:([\w-]+):/g;
  
  return text.replace(shortcodeRegex, (match, shortcode) => {
    const emoji = customEmojis.find(e => e.shortcode === shortcode);
    if (!emoji) return match; // Keep original text if emoji not found
    
    return `<img src="${emoji.url}" alt=":${shortcode}:" class="inline-emoji" />`;
  });
};

/**
 * Convert a custom emoji to a standard reaction format
 * @param customEmoji - The custom emoji object
 * @returns Shortcode representation of the custom emoji
 */
export const customEmojiToReaction = (customEmoji: CustomEmoji): string => {
  return customEmoji.shortcode || customEmoji.id;
};

/**
 * Find a custom emoji by shortcode, name or ID
 * @param identifier - Shortcode, name or ID to search for
 * @param customEmojis - Array of available custom emojis
 * @returns Found custom emoji or undefined if not found
 */
export const findCustomEmoji = (
  identifier: string, 
  customEmojis: CustomEmoji[]
): CustomEmoji | undefined => {
  return customEmojis.find(
    emoji => emoji.shortcode === identifier || 
             emoji.name === identifier || 
             emoji.id === identifier
  );
};

/**
 * Check if an emoji string is a custom emoji
 * @param emoji - Emoji string to check
 * @param customEmojis - Array of available custom emojis
 * @returns Boolean indicating if the emoji is a custom emoji
 */
export const isCustomEmoji = (emoji: string, customEmojis: CustomEmoji[]): boolean => {
  return customEmojis.some(
    e => e.shortcode === emoji || e.name === emoji || e.id === emoji
  );
};

/**
 * Group reactions by type (standard vs custom)
 * @param reactions - Record of reaction data
 * @param customEmojis - Array of available custom emojis
 * @returns Object with standard and custom reactions
 */
export const groupReactionsByType = (
  reactions: Record<string, { count: number; users: string[]; hasReacted: boolean; isCustom?: boolean }>,
  customEmojis: CustomEmoji[]
) => {
  const standard: typeof reactions = {};
  const custom: typeof reactions = {};

  Object.entries(reactions).forEach(([emoji, data]) => {
    // Check if explicitly marked as custom or if found in custom emojis
    if (data.isCustom || isCustomEmoji(emoji, customEmojis)) {
      custom[emoji] = { ...data, isCustom: true };
    } else {
      standard[emoji] = data;
    }
  });

  return { standard, custom };
};

/**
 * Render a custom emoji as an HTML image element
 * @param emoji - Emoji shortcode or ID
 * @param customEmojis - Array of available custom emojis
 * @returns HTML string or original emoji if not found
 */
export const renderCustomEmoji = (emoji: string, customEmojis: CustomEmoji[]): string => {
  const customEmoji = findCustomEmoji(emoji, customEmojis);
  
  if (customEmoji) {
    return `<img src="${customEmoji.url}" alt=":${customEmoji.shortcode}:" class="inline-emoji" title=":${customEmoji.shortcode}:" />`;
  }
  
  return emoji; // Return original if not found
};

/**
 * Get all custom emojis used in a message's reactions
 * @param reactions - Message reaction data
 * @param customEmojis - Array of available custom emojis
 * @returns Array of custom emojis used in the message
 */
export const getUsedCustomEmojis = (
  reactions: Record<string, { count: number; users: string[]; hasReacted: boolean; isCustom?: boolean }> | undefined,
  customEmojis: CustomEmoji[]
): CustomEmoji[] => {
  if (!reactions) return [];
  
  const used: CustomEmoji[] = [];
  
  Object.keys(reactions).forEach(emoji => {
    const customEmoji = findCustomEmoji(emoji, customEmojis);
    if (customEmoji) {
      used.push(customEmoji);
    }
  });
  
  return used;
};

/**
 * Formats reaction data for API requests
 * @param messageId - ID of the message
 * @param emoji - Emoji or custom emoji shortcode
 * @param userId - Current user ID
 * @param isCustom - Whether this is a custom emoji
 * @returns Formatted reaction data for API
 */
export const formatReactionData = (
  messageId: string,
  emoji: string,
  userId: string,
  isCustom = false
) => {
  return {
    message_id: messageId,
    emoji,
    user_id: userId,
    is_custom: isCustom,
    created_at: new Date().toISOString()
  };
};
