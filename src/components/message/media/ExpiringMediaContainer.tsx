
import { useState, useEffect, ReactNode, useRef } from "react";
import { Progress } from "@/components/ui/progress";
import { IconClockHour4 } from "@tabler/icons-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface ExpiringMediaContainerProps {
  children: ReactNode;
  ttl: number | null;
  onExpired?: () => void;
}

export const ExpiringMediaContainer = ({ 
  children, 
  ttl, 
  onExpired 
}: ExpiringMediaContainerProps) => {
  const [timeLeft, setTimeLeft] = useState<number | null>(ttl);
  const [progress, setProgress] = useState(100);
  const timerRef = useRef<number | null>(null);
  const expiryDateRef = useRef<number | null>(null);
  
  useEffect(() => {
    // If no TTL or TTL is 0, media doesn't expire
    if (!ttl) return;
    
    // Clear any existing timer
    if (timerRef.current) {
      window.clearInterval(timerRef.current);
    }
    
    // Calculate expiry time
    const now = Date.now();
    const expiryTime = now + ttl * 1000; // Convert to milliseconds
    expiryDateRef.current = expiryTime;
    
    // Initial time left
    const initialRemaining = Math.max(0, Math.ceil((expiryTime - now) / 1000));
    setTimeLeft(initialRemaining);
    setProgress(100);
    
    timerRef.current = window.setInterval(() => {
      const currentTime = Date.now();
      const remaining = Math.max(0, expiryTime - currentTime);
      const remainingSeconds = Math.ceil(remaining / 1000);
      
      // Update time left
      setTimeLeft(remainingSeconds);
      
      // Update progress percentage
      const progressPercent = (remaining / (ttl * 1000)) * 100;
      setProgress(progressPercent);
      
      // Check if expired
      if (remaining <= 0) {
        if (timerRef.current) {
          window.clearInterval(timerRef.current);
          timerRef.current = null;
        }
        
        if (onExpired) {
          console.log("Media expired, calling onExpired callback");
          onExpired();
        }
      }
    }, 1000);
    
    return () => {
      if (timerRef.current) {
        window.clearInterval(timerRef.current);
      }
    };
  }, [ttl, onExpired]);
  
  // Format time for display
  const formatTimeLeft = () => {
    if (!timeLeft) return null;
    
    if (timeLeft > 3600) {
      const hours = Math.floor(timeLeft / 3600);
      const minutes = Math.floor((timeLeft % 3600) / 60);
      return `${hours}h ${minutes}m`;
    }
    
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };
  
  // If no TTL, just render the children
  if (!ttl) {
    return <>{children}</>;
  }
  
  return (
    <TooltipProvider>
      <div className="space-y-1">
        {children}
        
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="flex items-center gap-2 mt-1">
              <IconClockHour4 className="text-cybergold-400" size={14} />
              <div className="text-xs text-cybergold-400">{formatTimeLeft()}</div>
              <div className="flex-1 max-w-32">
                <Progress value={progress} className="h-1" />
              </div>
            </div>
          </TooltipTrigger>
          <TooltipContent side="top">
            <p className="text-xs">Content will expire {timeLeft && timeLeft < 60 ? "soon" : "automatically"}</p>
          </TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  );
};
