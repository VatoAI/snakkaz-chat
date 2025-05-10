import React from 'react';

export const ChatTypingIndicator: React.FC = () => {
  return (
    <div className="flex items-center gap-1 px-3 py-1.5 bg-cyberdark-800/60 rounded-lg border border-cybergold-900/30 max-w-[100px]">
      <div className="typing-dot bg-cybergold-500 animate-pulse-slow"></div>
      <div className="typing-dot bg-cybergold-500 animate-pulse-slower delay-300"></div>
      <div className="typing-dot bg-cybergold-500 animate-pulse-slowest delay-600"></div>
      <style jsx>{`
        .typing-dot {
          width: 5px;
          height: 5px;
          border-radius: 50%;
          opacity: 0.7;
        }
        .animate-pulse-slow {
          animation: pulse 1s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
        .animate-pulse-slower {
          animation: pulse 1s cubic-bezier(0.4, 0, 0.6, 1) infinite;
          animation-delay: 300ms;
        }
        .animate-pulse-slowest {
          animation: pulse 1s cubic-bezier(0.4, 0, 0.6, 1) infinite;
          animation-delay: 600ms;
        }
        @keyframes pulse {
          0%, 100% {
            opacity: 0.7;
          }
          50% {
            opacity: 0.3;
          }
        }
        .delay-300 {
          animation-delay: 300ms;
        }
        .delay-600 {
          animation-delay: 600ms;
        }
      `}</style>
    </div>
  );
};