import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { messageReactionsService, ReactionCount } from '@/services/reactions/MessageReactionsService';
import { Plus, Smile } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MessageReactionsProps {
  messageId: string;
  className?: string;
}

// Common emojis for quick access
const QUICK_EMOJIS = [
  '👍', '👎', '❤️', '😂', '😮', '😢', '😡', '🎉', '🚀', '🇳🇴'
];

// Norwegian-themed emojis
const NORWEGIAN_EMOJIS = [
  '🇳🇴', '⛷️', '🏔️', '🐟', '🦌', '❄️', '🌊', '🏔️', '⭐', '🔥'
];

export const MessageReactions: React.FC<MessageReactionsProps> = ({ 
  messageId, 
  className 
}) => {
  const [reactions, setReactions] = useState<ReactionCount[]>([]);
  const [userReactions, setUserReactions] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  // Load initial reactions
  useEffect(() => {
    loadReactions();
    loadUserReactions();

    // Subscribe to real-time updates
    const subscription = messageReactionsService.subscribeToMessageReactions(
      messageId,
      (newReactions) => {
        setReactions(newReactions);
        loadUserReactions(); // Refresh user reactions
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, [messageId]);

  const loadReactions = async () => {
    try {
      const messageReactions = await messageReactionsService.getMessageReactions(messageId);
      setReactions(messageReactions);
    } catch (error) {
      console.error('Error loading reactions:', error);
    }
  };

  const loadUserReactions = async () => {
    try {
      const userReactionData = await messageReactionsService.getUserReactions(messageId);
      const userEmojiCodes = userReactionData.map(r => r.emoji_code);
      setUserReactions(userEmojiCodes);
    } catch (error) {
      console.error('Error loading user reactions:', error);
    }
  };

  const handleReactionClick = async (emojiCode: string) => {
    if (loading) return;
    
    setLoading(true);
    try {
      await messageReactionsService.toggleReaction(messageId, emojiCode);
      // Real-time subscription will handle the update
    } catch (error) {
      console.error('Error toggling reaction:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEmojiSelect = async (emoji: string) => {
    setShowEmojiPicker(false);
    await handleReactionClick(emoji);
  };

  const getUsersWhoReacted = (reaction: ReactionCount): string => {
    const count = reaction.count;
    if (count === 1) {
      return '1 person reagerte';
    }
    return `${count} personer reagerte`;
  };

  return (
    <div className={cn('flex flex-wrap items-center gap-1 mt-1', className)}>
      {/* Existing reactions */}
      {reactions.map((reaction) => {
        const isUserReaction = userReactions.includes(reaction.emoji_code);
        
        return (
          <TooltipProvider key={`${reaction.emoji_code}-${reaction.emoji_type}`}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant={isUserReaction ? "default" : "outline"}
                  size="sm"
                  className={cn(
                    "h-7 px-2 text-xs rounded-full transition-all",
                    isUserReaction 
                      ? "bg-blue-500 text-white border-blue-500 shadow-sm" 
                      : "bg-gray-50 hover:bg-gray-100 border-gray-200 text-gray-700"
                  )}
                  onClick={() => handleReactionClick(reaction.emoji_code)}
                  disabled={loading}
                >
                  <span className="mr-1 text-sm">{reaction.emoji_code}</span>
                  <span className="text-xs font-medium">{reaction.count}</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{getUsersWhoReacted(reaction)}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        );
      })}

      {/* Add reaction button */}
      <Popover open={showEmojiPicker} onOpenChange={setShowEmojiPicker}>
        <PopoverTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="h-7 w-7 p-0 rounded-full hover:bg-gray-100 text-gray-500 hover:text-gray-700"
            disabled={loading}
          >
            <Plus className="h-3 w-3" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80 p-3" side="top" align="start">
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
              <Smile className="h-4 w-4" />
              Reager på meldingen
            </div>
            
            {/* Quick emojis */}
            <div>
              <div className="text-xs font-medium text-gray-500 mb-2">Populære</div>
              <div className="grid grid-cols-5 gap-1">
                {QUICK_EMOJIS.map((emoji) => (
                  <Button
                    key={emoji}
                    variant="ghost"
                    className="h-8 w-8 p-0 text-lg hover:bg-gray-100 rounded"
                    onClick={() => handleEmojiSelect(emoji)}
                  >
                    {emoji}
                  </Button>
                ))}
              </div>
            </div>

            {/* Norwegian emojis */}
            <div>
              <div className="text-xs font-medium text-gray-500 mb-2">Norsk 🇳🇴</div>
              <div className="grid grid-cols-5 gap-1">
                {NORWEGIAN_EMOJIS.map((emoji) => (
                  <Button
                    key={emoji}
                    variant="ghost"
                    className="h-8 w-8 p-0 text-lg hover:bg-gray-100 rounded"
                    onClick={() => handleEmojiSelect(emoji)}
                  >
                    {emoji}
                  </Button>
                ))}
              </div>
            </div>

            <div className="text-xs text-gray-400 pt-2 border-t">
              Klikk for å reagere • Klikk igjen for å fjerne
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default MessageReactions;