import React from 'react';

export const ChatTypingIndicator: React.FC = () => {
  return (
    <div className="flex items-center p-2 text-cybergold-400/70">
      <div className="flex space-x-1 mr-2">
        <div className="w-2 h-2 bg-cybergold-400/70 rounded-full animate-pulse" style={{ animationDelay: '0ms' }}></div>
        <div className="w-2 h-2 bg-cybergold-400/70 rounded-full animate-pulse" style={{ animationDelay: '300ms' }}></div>
        <div className="w-2 h-2 bg-cybergold-400/70 rounded-full animate-pulse" style={{ animationDelay: '600ms' }}></div>
      </div>
      <span className="text-sm">skriver...</span>
    </div>
  );
};