import React, { useMemo } from 'react';
import { useCustomEmojis } from '@/hooks/useCustomEmojis';
import { cn } from '@/lib/utils';
import { CustomEmojiDisplay } from '@/components/emoji/CustomEmojiDisplay';

interface MessageTextWithEmojisProps {
  text: string;
  className?: string;
  emojiSize?: 'xs' | 'sm' | 'md' | 'lg';
  animated?: boolean;
  enableEmojis?: boolean;
}

/**
 * Component that renders text content with custom emojis
 * It looks for :shortcode: patterns and replaces them with custom emoji components
 */
export const MessageTextWithEmojis: React.FC<MessageTextWithEmojisProps> = ({
  text,
  className,
  emojiSize = 'md',
  animated = true,
  enableEmojis = true
}) => {
  const { customEmojis } = useCustomEmojis();
  
  // Process the message text to replace emoji shortcodes if enabled
  const processedContent = useMemo(() => {
    if (!text || !enableEmojis) {
      return [text];
    }
    
    // Match :shortcode: pattern
    const shortcodeRegex = /:([\w-]+):/g;
    const parts: (string | { shortcode: string })[] = [];
    
    let lastIndex = 0;
    let match: RegExpExecArray | null;
    
    // Find all emoji shortcodes and split the text
    while ((match = shortcodeRegex.exec(text)) !== null) {
      // Add text before the match
      if (match.index > lastIndex) {
        parts.push(text.substring(lastIndex, match.index));
      }
      
      // Add the emoji shortcode as a special object
      parts.push({ shortcode: match[1] });
      
      lastIndex = match.index + match[0].length;
    }
    
    // Add any remaining text
    if (lastIndex < text.length) {
      parts.push(text.substring(lastIndex));
    }
    
    return parts;
  }, [text, enableEmojis]);
  
  // If no text or no emojis found/enabled, render text directly
  if (!text || !enableEmojis || (typeof processedContent[0] === 'string' && processedContent.length === 1)) {
    return <span className={className}>{text}</span>;
  }
  
  return (
    <span className={cn('inline-flex items-center flex-wrap gap-0.5', className)}>
      {processedContent.map((part, index) => {
        if (typeof part === 'string') {
          return <React.Fragment key={index}>{part}</React.Fragment>;
        } else {
          // Render custom emoji component for shortcodes
          return (
            <CustomEmojiDisplay
              key={`emoji-${index}`}
              emoji={part.shortcode}
              size={emojiSize}
              animated={animated}
              className="align-middle"
            />
          );
        }
      })}
    </span>
  );
};
