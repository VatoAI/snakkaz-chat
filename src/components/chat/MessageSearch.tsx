
import React, { useState, useEffect } from 'react';
import { Search, X, ArrowUp, ArrowDown } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { DecryptedMessage } from '@/types/message';

interface MessageSearchProps {
  messages: DecryptedMessage[];
  onResultClick: (messageId: string) => void;
  className?: string;
}

export const MessageSearch: React.FC<MessageSearchProps> = ({
  messages,
  onResultClick,
  className
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState<DecryptedMessage[]>([]);
  const [selectedResultIndex, setSelectedResultIndex] = useState(-1);

  // Handle search query changes
  useEffect(() => {
    if (!searchQuery.trim()) {
      setResults([]);
      setSelectedResultIndex(-1);
      return;
    }
    
    const query = searchQuery.toLowerCase();
    const matchingMessages = messages.filter(message => 
      message.content?.toLowerCase().includes(query)
    );
    
    setResults(matchingMessages);
    setSelectedResultIndex(matchingMessages.length > 0 ? 0 : -1);
  }, [searchQuery, messages]);

  // Handle navigation through results
  const goToPreviousResult = () => {
    if (results.length === 0) return;
    
    setSelectedResultIndex(prev => 
      prev <= 0 ? results.length - 1 : prev - 1
    );
  };

  const goToNextResult = () => {
    if (results.length === 0) return;
    
    setSelectedResultIndex(prev => 
      prev >= results.length - 1 ? 0 : prev + 1
    );
  };

  // Jump to selected result
  useEffect(() => {
    if (selectedResultIndex >= 0 && results[selectedResultIndex]) {
      onResultClick(results[selectedResultIndex].id);
    }
  }, [selectedResultIndex, results, onResultClick]);

  // Toggle search box
  const toggleSearch = () => {
    setIsOpen(prev => !prev);
    if (isOpen) {
      setSearchQuery('');
    }
  };

  return (
    <div className={`relative ${className || ''}`}>
      {!isOpen ? (
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleSearch}
          className="text-cybergold-400 hover:bg-cyberdark-800"
        >
          <Search className="h-5 w-5" />
        </Button>
      ) : (
        <div className="flex items-center bg-cyberdark-800 rounded-md overflow-hidden border border-cyberdark-700 p-1">
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Søk i meldinger..."
            className="border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 text-sm"
            autoFocus
          />
          
          <div className="flex items-center gap-1">
            {results.length > 0 && (
              <span className="text-xs text-cybergold-500 mx-1">
                {selectedResultIndex + 1}/{results.length}
              </span>
            )}
            
            <Button
              variant="ghost"
              size="icon"
              onClick={goToPreviousResult}
              disabled={results.length === 0}
              className="h-7 w-7 text-cybergold-400"
            >
              <ArrowUp className="h-4 w-4" />
            </Button>
            
            <Button
              variant="ghost"
              size="icon"
              onClick={goToNextResult}
              disabled={results.length === 0}
              className="h-7 w-7 text-cybergold-400"
            >
              <ArrowDown className="h-4 w-4" />
            </Button>
            
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleSearch}
              className="h-7 w-7 text-cybergold-400"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MessageSearch;
