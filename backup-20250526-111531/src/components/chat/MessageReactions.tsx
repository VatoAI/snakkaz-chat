import React, { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Smile, Heart, ThumbsUp, ThumbsDown, Laugh, Frown, PartyPopper, Plus, Settings, Star } from 'lucide-react';
import { CustomEmojiManager } from '@/components/emoji/CustomEmojiManager';
import { CustomEmojiDisplay } from '@/components/emoji/CustomEmojiDisplay';
import { useCustomEmojis, type CustomEmoji } from '@/hooks/useCustomEmojis';
import { isCustomEmoji as checkCustomEmoji } from '@/utils/customEmojiUtils';

interface MessageReactionsProps {
  messageId: string;
  reactions?: Record<string, { count: number; users: string[]; hasReacted: boolean; isCustom?: boolean }>;
  onReactionAdd?: (messageId: string, emoji: string, isCustom?: boolean) => void;
  onReactionRemove?: (messageId: string, emoji: string, isCustom?: boolean) => void;
  disabled?: boolean;
  className?: string;
  showCustomEmojiManager?: boolean;
  onCustomEmojiSelect?: (emoji: CustomEmoji) => void;
}

// Quick reaction emojis with icons
const QUICK_REACTIONS = [
  { emoji: '👍', icon: ThumbsUp, label: 'Like' },
  { emoji: '❤️', icon: Heart, label: 'Love' },
  { emoji: '😂', icon: Laugh, label: 'Laugh' },
  { emoji: '😮', icon: Frown, label: 'Wow' },
  { emoji: '😢', icon: Frown, label: 'Sad' },
  { emoji: '👎', icon: ThumbsDown, label: 'Dislike' },
  { emoji: '🎉', icon: PartyPopper, label: 'Party' },
];

// Extended emoji set for the picker
const EMOJI_CATEGORIES = {
  'Faces': ['😀', '😃', '😄', '😁', '😆', '😅', '😂', '🤣', '😊', '😇', '🙂', '🙃', '😉', '😌', '😍', '🥰', '😘', '😗', '😙', '😚', '😋', '😛', '😝', '😜', '🤪', '🤨', '🧐', '🤓', '😎', '🤩', '🥳'],
  'Gestures': ['👍', '👎', '👌', '🤌', '🤏', '✌️', '🤞', '🤟', '🤘', '🤙', '👈', '👉', '👆', '🖕', '👇', '☝️', '👋', '🤚', '🖐️', '✋', '🖖', '👏', '🙌', '🤲', '🤝', '🙏'],
  'Hearts': ['❤️', '🧡', '💛', '💚', '💙', '💜', '🖤', '🤍', '🤎', '💔', '❣️', '💕', '💞', '💓', '💗', '💖', '💘', '💝'],
  'Activities': ['🎉', '🎊', '🎈', '🎁', '🎂', '🎄', '🎆', '🎇', '🧨', '✨', '🎃', '🎗️', '🎟️', '🎫', '🎖️', '🏆', '🏅', '🥇', '🥈', '🥉'],
};

export const MessageReactions: React.FC<MessageReactionsProps> = ({
  messageId,
  reactions = {},
  onReactionAdd,
  onReactionRemove,
  disabled = false,
  className,
  showCustomEmojiManager = true,
  onCustomEmojiSelect
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('Faces');
  const [showQuickReactions, setShowQuickReactions] = useState(false);
  const [showCustomManager, setShowCustomManager] = useState(false);
  const [customEmojiCategory, setCustomEmojiCategory] = useState<'all' | 'favorites' | 'user'>('all');

  // Use the custom emojis hook
  const { 
    customEmojis, 
    isLoading: customEmojisLoading, 
    incrementUsage,
    getUserCustomEmojis,
    getPublicCustomEmojis,
    getFavoriteCustomEmojis
  } = useCustomEmojis();

  const handleReactionClick = (emoji: string, isCustom = false) => {
    const reaction = reactions[emoji];
    
    // Determine if this is a custom emoji either by parameter or by checking
    const isCustomEmoji = isCustom || checkCustomEmoji(emoji, customEmojis);
    
    if (reaction?.hasReacted) {
      onReactionRemove?.(messageId, emoji, isCustomEmoji);
    } else {
      onReactionAdd?.(messageId, emoji, isCustomEmoji);
    }
    
    setIsOpen(false);
    setShowQuickReactions(false);
  };

  const handleCustomEmojiSelect = (customEmoji: CustomEmoji) => {
    // Handle custom emoji selection
    const emojiId = customEmoji.shortcode || customEmoji.name;
    handleReactionClick(emojiId, true);
    onCustomEmojiSelect?.(customEmoji);
    
    // Increment usage count
    incrementUsage(customEmoji.id);
    
    setShowCustomManager(false);
    setIsOpen(false);
  };

  const handleQuickReaction = (emoji: string) => {
    handleReactionClick(emoji);
    setShowQuickReactions(false);
  };

  const renderEmojiDisplay = (emoji: string, isCustom = false) => {
    if (isCustom) {
      // For custom emojis, use our CustomEmojiDisplay component
      return <CustomEmojiDisplay emoji={emoji} size="xs" />;
    }
    return <span>{emoji}</span>;
  };

  const totalReactions = Object.values(reactions).reduce((sum, reaction) => sum + reaction.count, 0);

  return (
    <div className={cn('flex items-center gap-1', className)}>
      {/* Existing reactions */}
      {Object.entries(reactions).map(([emoji, reaction]) => (
        reaction.count > 0 && (
          <Button
            key={emoji}
            variant="ghost"
            size="sm"
            onClick={() => handleReactionClick(emoji, reaction.isCustom)}
            disabled={disabled}
            className={cn(
              'h-6 px-2 py-0 text-xs rounded-full transition-all hover:scale-105',
              reaction.hasReacted 
                ? 'bg-cybergold-500/20 text-cybergold-300 border border-cybergold-500/40' 
                : 'bg-cyberdark-700/50 text-cybergold-400 hover:bg-cyberdark-600',
              'animate-in fade-in zoom-in duration-200'
            )}
          >
            <span className="mr-1">{renderEmojiDisplay(emoji, reaction.isCustom)}</span>
            <span className="text-[10px]">{reaction.count}</span>
          </Button>
        )
      ))}

      {/* Add reaction button */}
      <div className="relative">
        <Popover open={isOpen} onOpenChange={setIsOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              disabled={disabled}
              className={cn(
                'h-6 w-6 p-0 rounded-full transition-all hover:scale-110',
                'bg-cyberdark-700/30 hover:bg-cyberdark-600 text-cybergold-400',
                'opacity-0 group-hover:opacity-100 animate-in fade-in duration-200'
              )}
              onMouseEnter={() => setShowQuickReactions(true)}
              onMouseLeave={() => setTimeout(() => setShowQuickReactions(false), 150)}
            >
              <Smile className="h-3 w-3" />
            </Button>
          </PopoverTrigger>

          <PopoverContent 
            className="w-96 p-2 bg-cyberdark-900 border-cyberdark-700"
            align="start"
            side="top"
          >
            <Tabs defaultValue="standard" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-2">
                <TabsTrigger value="standard" className="text-xs">Standard</TabsTrigger>
                <TabsTrigger value="custom" className="text-xs">Custom</TabsTrigger>
              </TabsList>
              
              <TabsContent value="standard" className="space-y-2">
                {/* Category tabs */}
                <div className="flex gap-1 border-b border-cyberdark-700 pb-2">
                  {Object.keys(EMOJI_CATEGORIES).map((category) => (
                    <Button
                      key={category}
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedCategory(category)}
                      className={cn(
                        'text-xs px-2 py-1 h-auto',
                        selectedCategory === category 
                          ? 'bg-cybergold-500/20 text-cybergold-300' 
                          : 'text-cybergold-400 hover:text-cybergold-300'
                      )}
                    >
                      {category}
                    </Button>
                  ))}
                </div>

                {/* Emoji grid */}
                <div className="grid grid-cols-8 gap-1 max-h-32 overflow-y-auto">
                  {EMOJI_CATEGORIES[selectedCategory as keyof typeof EMOJI_CATEGORIES].map((emoji) => (
                    <Button
                      key={emoji}
                      variant="ghost"
                      size="sm"
                      onClick={() => handleReactionClick(emoji)}
                      className="h-8 w-8 p-0 rounded hover:bg-cyberdark-700 text-lg hover:scale-125 transition-transform"
                    >
                      {emoji}
                    </Button>
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="custom" className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-cybergold-400">Custom Emojis</span>
                  <div className="flex items-center gap-2">
                    {/* Custom emoji category filter */}
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setCustomEmojiCategory('all')}
                        className={cn(
                          'text-xs px-2 py-1 h-auto',
                          customEmojiCategory === 'all' 
                            ? 'bg-cybergold-500/20 text-cybergold-300' 
                            : 'text-cybergold-400 hover:text-cybergold-300'
                        )}
                        title="All custom emojis"
                      >
                        All
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setCustomEmojiCategory('favorites')}
                        className={cn(
                          'text-xs px-2 py-1 h-auto',
                          customEmojiCategory === 'favorites' 
                            ? 'bg-cybergold-500/20 text-cybergold-300' 
                            : 'text-cybergold-400 hover:text-cybergold-300'
                        )}
                        title="Favorite custom emojis"
                      >
                        <Star className="h-3 w-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setCustomEmojiCategory('user')}
                        className={cn(
                          'text-xs px-2 py-1 h-auto',
                          customEmojiCategory === 'user' 
                            ? 'bg-cybergold-500/20 text-cybergold-300' 
                            : 'text-cybergold-400 hover:text-cybergold-300'
                        )}
                        title="My custom emojis"
                      >
                        Mine
                      </Button>
                    </div>
                    
                    {showCustomEmojiManager && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowCustomManager(true)}
                        className="text-xs text-cybergold-400 hover:text-cybergold-300"
                      >
                        <Settings className="h-3 w-3 mr-1" />
                        Manage
                      </Button>
                    )}
                  </div>
                </div>
                
                {/* Custom emoji grid */}
                {customEmojisLoading ? (
                  <div className="text-center text-sm text-cybergold-500 py-4">
                    Loading custom emojis...
                  </div>
                ) : (() => {
                  let filteredEmojis: CustomEmoji[];
                  
                  switch (customEmojiCategory) {
                    case 'favorites':
                      filteredEmojis = getFavoriteCustomEmojis();
                      break;
                    case 'user':
                      filteredEmojis = getUserCustomEmojis();
                      break;
                    default:
                      filteredEmojis = getPublicCustomEmojis();
                  }
                  
                  return filteredEmojis.length > 0 ? (
                    <div className="grid grid-cols-8 gap-1 max-h-32 overflow-y-auto">
                      {filteredEmojis.map((customEmoji) => (
                        <Button
                          key={customEmoji.id}
                          variant="ghost"
                          size="sm"
                          onClick={() => handleCustomEmojiSelect(customEmoji)}
                          className="h-8 w-8 p-0 rounded hover:bg-cyberdark-700 hover:scale-125 transition-transform relative group"
                          title={`:${customEmoji.shortcode}: - ${customEmoji.name}`}
                        >
                          <img 
                            src={customEmoji.url}
                            alt={customEmoji.name}
                            className="w-6 h-6 object-contain"
                          />
                          {customEmoji.isFavorite && (
                            <Star className="absolute -top-1 -right-1 h-2 w-2 text-cybergold-400 fill-current" />
                          )}
                        </Button>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center text-sm text-cybergold-500 py-4">
                      {customEmojiCategory === 'favorites' && 'No favorite custom emojis yet'}
                      {customEmojiCategory === 'user' && 'You haven\'t created any custom emojis yet'}
                      {customEmojiCategory === 'all' && 'No custom emojis available'}
                      <br />
                      <Button
                        variant="link"
                        size="sm"
                        onClick={() => setShowCustomManager(true)}
                        className="text-cybergold-400 hover:text-cybergold-300 p-0 h-auto"
                      >
                        {customEmojiCategory === 'user' ? 'Create your first custom emoji' : 'Add custom emojis'}
                      </Button>
                    </div>
                  );
                })()}
              </TabsContent>
            </Tabs>
          </PopoverContent>
        </Popover>

        {/* Quick reactions on hover */}
        {showQuickReactions && !isOpen && (
          <div 
            className="absolute bottom-full left-0 mb-1 flex gap-1 bg-cyberdark-900 border border-cyberdark-700 rounded-lg p-1 shadow-lg animate-in slide-in-from-bottom-2 duration-200"
            onMouseEnter={() => setShowQuickReactions(true)}
            onMouseLeave={() => setShowQuickReactions(false)}
          >
            {QUICK_REACTIONS.slice(0, 5).map(({ emoji, label }) => (
              <Button
                key={emoji}
                variant="ghost"
                size="sm"
                onClick={() => handleQuickReaction(emoji)}
                className="h-8 w-8 p-0 rounded hover:bg-cyberdark-700 text-lg hover:scale-125 transition-transform"
                title={label}
              >
                {emoji}
              </Button>
            ))}
          </div>
        )}
      </div>

      {/* Custom Emoji Manager Dialog */}
      {showCustomEmojiManager && (
        <CustomEmojiManager 
          isOpen={showCustomManager}
          onClose={() => setShowCustomManager(false)}
          onEmojiSelect={handleCustomEmojiSelect}
          onEmojiAdd={(emoji) => {
            // Handle new custom emoji added
            console.log('New custom emoji added:', emoji);
          }}
          onEmojiDelete={(emojiId) => {
            // Handle custom emoji deleted
            console.log('Custom emoji deleted:', emojiId);
          }}
        />
      )}
    </div>
  );
};

export default MessageReactions;
