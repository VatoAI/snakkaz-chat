import React, { useState, useEffect, useMemo } from 'react';
import { useCustomEmojis } from '@/hooks/useCustomEmojis';
import { searchEmojis, groupEmojisByCategory, getFavoriteEmojis, getMostUsedEmojis, EmojiSearchResult } from '@/utils/emojiSearchUtils';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';
import { Badge } from '@/components/ui/badge';
import { Search, Star, Clock, Tag, X } from 'lucide-react';

interface EmojiSearchProps {
  onSelectEmoji: (emoji: string, isCustom: boolean) => void;
}

const EmojiSearch: React.FC<EmojiSearchProps> = ({ onSelectEmoji }) => {
  const { customEmojis } = useCustomEmojis();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('recent');
  
  // Search results based on the current query
  const searchResults = useMemo(() => {
    return searchEmojis(searchQuery, customEmojis);
  }, [searchQuery, customEmojis]);
  
  // Group emojis by category for the Category tab
  const categoryGroups = useMemo(() => {
    return groupEmojisByCategory(customEmojis);
  }, [customEmojis]);
  
  // Get favorite emojis for the Favorites tab
  const favoriteEmojis = useMemo(() => {
    return getFavoriteEmojis(customEmojis);
  }, [customEmojis]);
  
  // Get most used emojis for the Recent tab
  const recentEmojis = useMemo(() => {
    return getMostUsedEmojis(customEmojis, 20);
  }, [customEmojis]);
  
  // Clear search when changing tabs
  useEffect(() => {
    if (searchQuery && activeTab !== 'search') {
      setSearchQuery('');
    }
  }, [activeTab, searchQuery]);
  
  // Automatically switch to search tab when typing
  useEffect(() => {
    if (searchQuery && activeTab !== 'search') {
      setActiveTab('search');
    }
  }, [searchQuery, activeTab]);
  
  // Handle emoji selection
  const handleSelectEmoji = (emoji: string) => {
    onSelectEmoji(emoji, true);
  };
  
  // Render a single emoji
  const renderEmoji = (emoji: any, index: number) => {
    // Handle both direct emoji objects and search results
    const emojiObj = 'emoji' in emoji ? emoji.emoji : emoji;
    
    return (
      <Tooltip key={index}>
        <TooltipTrigger asChild>
          <button
            className="p-1 hover:bg-black/20 rounded cursor-pointer transition-colors"
            onClick={() => handleSelectEmoji(emojiObj.shortcode)}
          >
            <img 
              src={emojiObj.url} 
              alt={`:${emojiObj.shortcode}:`}
              title={`:${emojiObj.shortcode}:`}
              className="w-8 h-8 object-contain"
            />
          </button>
        </TooltipTrigger>
        <TooltipContent side="bottom">
          <p className="text-xs">:{emojiObj.shortcode}:</p>
        </TooltipContent>
      </Tooltip>
    );
  };
  
  return (
    <div className="w-full max-w-sm p-4">
      <div className="mb-4 relative">
        <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
        <Input
          placeholder="Search emojis..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9 pr-9 bg-cyberdark-800"
        />
        {searchQuery && (
          <button 
            className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-200"
            onClick={() => setSearchQuery('')}
          >
            <X size={16} />
          </button>
        )}
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-4 mb-4">
          <TabsTrigger value="recent">
            <Clock size={16} className="mr-1" /> Recent
          </TabsTrigger>
          <TabsTrigger value="favorites">
            <Star size={16} className="mr-1" /> Favorites
          </TabsTrigger>
          <TabsTrigger value="categories">
            <Tag size={16} className="mr-1" /> Categories
          </TabsTrigger>
          <TabsTrigger value="search">
            <Search size={16} className="mr-1" /> Search
          </TabsTrigger>
        </TabsList>
        
        {/* Recent Tab */}
        <TabsContent value="recent" className="h-64">
          <ScrollArea className="h-full">
            <div className="grid grid-cols-5 gap-1">
              {recentEmojis.length > 0 ? (
                recentEmojis.map((emoji, index) => renderEmoji(emoji, index))
              ) : (
                <p className="col-span-5 text-center text-gray-400 py-8">
                  No recently used emojis yet
                </p>
              )}
            </div>
          </ScrollArea>
        </TabsContent>
        
        {/* Favorites Tab */}
        <TabsContent value="favorites" className="h-64">
          <ScrollArea className="h-full">
            <div className="grid grid-cols-5 gap-1">
              {favoriteEmojis.length > 0 ? (
                favoriteEmojis.map((emoji, index) => renderEmoji(emoji, index))
              ) : (
                <p className="col-span-5 text-center text-gray-400 py-8">
                  No favorite emojis yet. Click the star icon on any emoji to add it to your favorites.
                </p>
              )}
            </div>
          </ScrollArea>
        </TabsContent>
        
        {/* Categories Tab */}
        <TabsContent value="categories" className="h-64">
          <ScrollArea className="h-full">
            {Object.keys(categoryGroups).length > 0 ? (
              Object.entries(categoryGroups).map(([category, emojis]) => (
                <div key={category} className="mb-4">
                  <h4 className="text-sm font-medium text-gray-300 mb-2 flex items-center">
                    <Tag size={14} className="mr-2 text-gray-400" />
                    {category}
                    <Badge variant="outline" className="ml-2 text-xs">
                      {emojis.length}
                    </Badge>
                  </h4>
                  <div className="grid grid-cols-5 gap-1">
                    {emojis.map((emoji, index) => renderEmoji(emoji, index))}
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-400 py-8">
                No categorized emojis found
              </p>
            )}
          </ScrollArea>
        </TabsContent>
        
        {/* Search Tab */}
        <TabsContent value="search" className="h-64">
          <ScrollArea className="h-full">
            <div className="grid grid-cols-5 gap-1">
              {searchQuery ? (
                searchResults.length > 0 ? (
                  searchResults.map((result, index) => renderEmoji(result, index))
                ) : (
                  <p className="col-span-5 text-center text-gray-400 py-8">
                    No emojis found matching "{searchQuery}"
                  </p>
                )
              ) : (
                <p className="col-span-5 text-center text-gray-400 py-8">
                  Type to search for emojis
                </p>
              )}
            </div>
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EmojiSearch;
