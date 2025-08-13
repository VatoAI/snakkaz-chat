import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Briefcase, Shield, AlertCircle, Info } from 'lucide-react';
import { useBusiness } from '@/hooks/useBusiness';

interface BusinessIndicatorProps {
  userId: string;
  size?: 'sm' | 'md' | 'lg';
  showTooltip?: boolean;
  className?: string;
  verified?: boolean;
}

/**
 * Komponent som viser en tydelig indikator for forretningskontoer
 * Inspirert av WhatsApp og andre sikre meldingsapper som tydelig markerer forretningskontoer
 */
export const BusinessIndicator: React.FC<BusinessIndicatorProps> = ({
  userId,
  size = 'md',
  showTooltip = true,
  className = '',
  verified = false
}) => {
  const { businessConfig } = useBusiness(userId);
  
  if (!businessConfig.enabled) return null;
  
  const sizes = {
    sm: 'h-3 w-3',
    md: 'h-4 w-4',
    lg: 'h-5 w-5'
  };
  
  const badgeSizes = {
    sm: 'text-xs px-1 py-0',
    md: 'text-xs px-2 py-0.5',
    lg: 'text-sm px-2 py-1'
  };
  
  const tooltipContent = verified 
    ? 'Verifisert forretningskonto: Denne kontoen er bekreftet av Snakkaz som en legitim virksomhet.'
    : 'Forretningskonto: Denne kontoen er registrert som en forretningskonto. Meldinger til forretningskontoer kan ha ulike personverninnstillinger.';
  
  const indicator = (
    <Badge 
      variant={verified ? "default" : "secondary"} 
      className={`flex items-center gap-1 ${badgeSizes[size]} ${className}`}
    >
      <Briefcase className={sizes[size]} />
      <span>{businessConfig.businessName || 'Bedrift'}</span>
      {verified && <Shield className={sizes[size]} />}
    </Badge>
  );
  
  if (!showTooltip) return indicator;
  
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          {indicator}
        </TooltipTrigger>
        <TooltipContent className="max-w-xs">
          <div className="flex items-start gap-2">
            {verified ? (
              <Shield className="h-4 w-4 mt-0.5 flex-shrink-0" />
            ) : (
              <Info className="h-4 w-4 mt-0.5 flex-shrink-0" />
            )}
            <p className="text-sm">{tooltipContent}</p>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};