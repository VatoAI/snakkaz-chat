
interface TypingIndicatorProps {
  isTyping?: boolean;
}

export const TypingIndicator = ({ isTyping }: TypingIndicatorProps) => {
  if (!isTyping) {
    return null;
  }

  return (
    <div className="flex justify-start">
      <div className="bg-cyberdark-800 text-cybergold-200 p-2 rounded-lg flex items-center gap-2 max-w-[80%]">
        <div className="flex space-x-1">
          <div className="w-2 h-2 bg-cybergold-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
          <div className="w-2 h-2 bg-cybergold-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
          <div className="w-2 h-2 bg-cybergold-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
        </div>
        <span className="text-xs text-cybergold-300">Skriver...</span>
      </div>
    </div>
  );
};
