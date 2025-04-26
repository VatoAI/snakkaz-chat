import { useState, useEffect, ReactNode } from "react";
import { Progress } from "@/components/ui/progress";
import { IconClockHour4 } from "@tabler/icons-react";

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
  
  useEffect(() => {
    // If no TTL or TTL is 0, media doesn't expire
    if (!ttl) return;
    
    // Set initial time left
    setTimeLeft(ttl);
    
    const startTime = Date.now();
    const expiryTime = startTime + ttl * 1000; // Convert to milliseconds
    
    const timer = setInterval(() => {
      const now = Date.now();
      const remaining = Math.max(0, expiryTime - now);
      const remainingSeconds = Math.ceil(remaining / 1000);
      
      // Update time left
      setTimeLeft(remainingSeconds);
      
      // Update progress percentage
      const progressPercent = (remaining / (ttl * 1000)) * 100;
      setProgress(progressPercent);
      
      // Check if expired
      if (remaining <= 0) {
        clearInterval(timer);
        if (onExpired) {
          onExpired();
        }
      }
    }, 1000);
    
    return () => clearInterval(timer);
  }, [ttl, onExpired]);
  
  // Format time for display
  const formatTimeLeft = () => {
    if (!timeLeft) return null;
    
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };
  
  // If no TTL, just render the children
  if (!ttl) {
    return <>{children}</>;
  }
  
  return (
    <div className="space-y-1">
      {children}
      
      <div className="flex items-center gap-2 mt-1">
        <IconClockHour4 className="text-cybergold-400" size={14} />
        <div className="text-xs text-cybergold-400">{formatTimeLeft()}</div>
        <div className="flex-1 max-w-32">
          <Progress value={progress} className="h-1" />
        </div>
      </div>
    </div>
  );
};