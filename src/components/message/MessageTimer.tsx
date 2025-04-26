
import { useState, useEffect, useCallback } from "react";
import { Timer } from "lucide-react";
import { DecryptedMessage } from "@/types/message";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface MessageTimerProps {
  message: DecryptedMessage;
  onExpired?: (messageId: string) => void;
  showIcon?: boolean;
}

export const MessageTimer = ({ message, onExpired, showIcon = true }: MessageTimerProps) => {
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [isExpiringSoon, setIsExpiringSoon] = useState(false);
  
  // Ensure all messages have a TTL, defaulting to 24 hours
  const messageTtl = message.ephemeral_ttl || 86400; // Default to 24 hours in seconds

  const calculateTimeLeft = useCallback(() => {
    const createdAt = new Date(message.created_at).getTime();
    const expiresAt = createdAt + (messageTtl * 1000);
    const now = new Date().getTime();
    const difference = expiresAt - now;
    
    // Set expiring soon flag if less than 5 minutes
    setIsExpiringSoon(difference > 0 && difference < 300000);
    
    return difference > 0 ? Math.ceil(difference / 1000) : 0;
  }, [message.created_at, messageTtl]);

  useEffect(() => {
    setTimeLeft(calculateTimeLeft());
    
    const timer = setInterval(() => {
      const remaining = calculateTimeLeft();
      setTimeLeft(remaining);
      
      if (remaining <= 0) {
        clearInterval(timer);
        if (onExpired) {
          onExpired(message.id);
        }
      }
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, [message.created_at, messageTtl, onExpired, message.id, calculateTimeLeft]);

  if (timeLeft === null || timeLeft <= 0) return null;

  // Format the display based on time remaining
  const formatTime = () => {
    const hours = Math.floor(timeLeft / 3600);
    const minutes = Math.floor((timeLeft % 3600) / 60);
    const seconds = timeLeft % 60;
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    } else if (minutes > 0) {
      return `${minutes}m ${seconds}s`;
    } else {
      return `${seconds}s`;
    }
  };

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div className={`flex items-center gap-1 text-xs ${isExpiringSoon ? 'text-cyberred-300 animate-pulse' : 'text-cybergold-300'}`}>
          {showIcon && <Timer className={`w-3 h-3 ${isExpiringSoon ? 'text-cyberred-400' : 'text-cyberblue-400'}`} />}
          <span className="font-medium">{formatTime()}</span>
        </div>
      </TooltipTrigger>
      <TooltipContent side="top" className="bg-cyberdark-900 border-cyberblue-500/30 py-1 px-2">
        <p className="text-xs">
          {isExpiringSoon 
            ? "This message will be deleted soon" 
            : "This message will auto-delete"}
        </p>
      </TooltipContent>
    </Tooltip>
  );
};
