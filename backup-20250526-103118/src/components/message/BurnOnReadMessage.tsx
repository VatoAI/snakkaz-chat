import React, { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { formatTimeLeft } from '../../utils/formatting/time';
import { Flame } from 'lucide-react';
import { cn } from '@/lib/utils';

interface BurnOnReadMessageProps {
  expiryTime: number;  // Timestamp i millisekunder når meldingen utløper
  onExpire?: () => void;
  children: React.ReactNode;
  className?: string;
  isRead?: boolean;
}

export const BurnOnReadMessage: React.FC<BurnOnReadMessageProps> = ({
  expiryTime,
  onExpire,
  children,
  className,
  isRead = false
}) => {
  const [timeLeft, setTimeLeft] = useState<string>(formatTimeLeft(expiryTime));
  const [isExpired, setIsExpired] = useState<boolean>(false);

  // Effekt for å oppdatere nedtelling og håndtere utløp
  useEffect(() => {
    if (isExpired) return; // Ikke fortsett hvis allerede utløpt

    // Sjekk om meldingen allerede er utløpt
    if (Date.now() >= expiryTime) {
      setIsExpired(true);
      onExpire?.();
      return;
    }

    // Opprett intervall for å oppdatere nedtellingstimer
    const intervalId = setInterval(() => {
      const formattedTime = formatTimeLeft(expiryTime);
      setTimeLeft(formattedTime);

      if (Date.now() >= expiryTime) {
        setIsExpired(true);
        clearInterval(intervalId);
        onExpire?.();
      }
    }, 1000);

    // Cleanup intervall ved unmounting
    return () => clearInterval(intervalId);
  }, [expiryTime, onExpire, isExpired]);

  // Beregn gradientstyrke basert på gjenværende tid
  const calculateGradientIntensity = () => {
    const now = Date.now();
    const totalDuration = expiryTime - now;
    const maxDuration = 1000 * 60 * 10; // 10 minutter som max
    const normalizedDuration = Math.min(totalDuration, maxDuration);
    const intensity = Math.max(0, (maxDuration - normalizedDuration) / maxDuration);
    
    return Math.round(intensity * 100);
  };

  // Ikke vis hvis meldingen er utløpt
  if (isExpired) {
    return null;
  }

  const gradientIntensity = calculateGradientIntensity();
  
  return (
    <div
      className={cn(
        "relative transition-all",
        isRead && "animate-pulse",
        className
      )}
      style={{
        background: `linear-gradient(rgba(255, 100, 50, 0.${gradientIntensity}), 
                    rgba(255, 50, 50, 0.${gradientIntensity}))`,
      }}
    >
      {children}

      <Badge 
        variant="destructive"
        className="absolute top-0 right-0 -mt-1 -mr-1 bg-red-600 text-white flex items-center gap-1 px-2"
      >
        <Flame className="h-3 w-3" />
        <span className="text-xs">{timeLeft}</span>
      </Badge>
    </div>
  );
};