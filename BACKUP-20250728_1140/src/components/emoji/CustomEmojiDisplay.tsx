import React from 'react';
import { cn } from '@/lib/utils';
import { useCustomEmojis, type CustomEmoji } from '@/hooks/useCustomEmojis';
import { findCustomEmoji } from '@/utils/customEmojiUtils';

interface CustomEmojiDisplayProps {
  emoji: string;
  className?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg';
  animated?: boolean;
  title?: string;
  onClick?: () => void;
}

/**
 * Component for displaying a custom emoji
 */
export const CustomEmojiDisplay: React.FC<CustomEmojiDisplayProps> = ({
  emoji,
  className,
  size = 'md',
  animated = true,
  title,
  onClick
}) => {
  const { customEmojis } = useCustomEmojis();
  
  // Find the custom emoji data
  const customEmoji = findCustomEmoji(emoji, customEmojis);
  
  // If emoji not found, render a placeholder
  if (!customEmoji) {
    return (
      <span 
        className={cn(
          'inline-block text-gray-400 bg-cyberdark-800 rounded',
          {
            'w-4 h-4 text-xs': size === 'xs',
            'w-5 h-5 text-xs': size === 'sm',
            'w-6 h-6 text-sm': size === 'md',
            'w-8 h-8 text-base': size === 'lg',
          },
          className
        )}
        title={title || `Custom emoji not found: ${emoji}`}
        onClick={onClick}
      >
        🎨
      </span>
    );
  }
  
  // Get size class based on prop
  const sizeClass = {
    xs: 'w-4 h-4',
    sm: 'w-5 h-5',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
  }[size];
  
  // Determine if animation should play
  const shouldAnimate = animated && customEmoji.isAnimated;
  
  return (
    <img
      src={customEmoji.url}
      alt={`:${customEmoji.shortcode}:`}
      title={title || `:${customEmoji.shortcode}: - ${customEmoji.name}`}
      className={cn(
        'inline-block object-contain',
        sizeClass,
        shouldAnimate ? 'emoji-animated' : '',
        onClick && 'cursor-pointer hover:scale-110 transition-transform',
        className
      )}
      onClick={onClick}
    />
  );
};

/**
 * Component for displaying a custom emoji by ID
 */
export const CustomEmojiById: React.FC<{
  id: string;
  className?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg';
  animated?: boolean;
  onClick?: () => void;
}> = ({ id, ...props }) => {
  return <CustomEmojiDisplay emoji={id} {...props} />;
};

/**
 * Component for displaying a custom emoji directly from a CustomEmoji object
 */
export const CustomEmojiFromObject: React.FC<{
  emoji: CustomEmoji;
  className?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg';
  animated?: boolean;
  onClick?: () => void;
}> = ({ emoji, className, size = 'md', animated = true, onClick }) => {
  // Get size class based on prop
  const sizeClass = {
    xs: 'w-4 h-4',
    sm: 'w-5 h-5',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
  }[size];
  
  // Determine if animation should play
  const shouldAnimate = animated && emoji.isAnimated;
  
  return (
    <img
      src={emoji.url}
      alt={`:${emoji.shortcode}:`}
      title={`:${emoji.shortcode}: - ${emoji.name}`}
      className={cn(
        'inline-block object-contain',
        sizeClass,
        shouldAnimate ? 'emoji-animated' : '',
        onClick && 'cursor-pointer hover:scale-110 transition-transform',
        className
      )}
      onClick={onClick}
    />
  );
};
