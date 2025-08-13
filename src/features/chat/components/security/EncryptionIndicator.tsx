import React from 'react';
import { Shield, ShieldCheck, ShieldX, Lock, LockOpen, AlertTriangle } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

export type EncryptionStatus = 'encrypted' | 'not-encrypted' | 'partial' | 'error' | 'group-encrypted';

interface EncryptionIndicatorProps {
  status: EncryptionStatus;
  transmissionType?: 'webrtc' | 'mcp' | 'supabase';
  className?: string;
  variant?: 'full' | 'icon-only' | 'badge';
  groupInfo?: {
    totalParticipants: number;
    encryptedParticipants: number;
  };
}

export const EncryptionIndicator: React.FC<EncryptionIndicatorProps> = ({
  status,
  transmissionType = 'supabase',
  className,
  variant = 'icon-only',
  groupInfo
}) => {
  // Determine icon and colors based on encryption status
  const getIndicatorInfo = () => {
    switch (status) {
      case 'encrypted':
        return {
          icon: Shield,
          color: 'text-green-500',
          bgColor: 'bg-green-500/10',
          borderColor: 'border-green-500/30',
          label: 'Ende-til-ende kryptert',
          description: 'Meldingen er fullstendig kryptert og sikker'
        };
      case 'group-encrypted':
        return {
          icon: ShieldCheck,
          color: 'text-blue-500',
          bgColor: 'bg-blue-500/10',
          borderColor: 'border-blue-500/30',
          label: 'Gruppekryptert',
          description: groupInfo 
            ? `${groupInfo.encryptedParticipants}/${groupInfo.totalParticipants} deltakere kryptert`
            : 'Gruppekryptering aktivert'
        };
      case 'partial':
        return {
          icon: AlertTriangle,
          color: 'text-yellow-500',
          bgColor: 'bg-yellow-500/10',
          borderColor: 'border-yellow-500/30',
          label: 'Delvis kryptert',
          description: 'Noen deltakere har ikke kryptering aktivert'
        };
      case 'error':
        return {
          icon: ShieldX,
          color: 'text-red-500',
          bgColor: 'bg-red-500/10',
          borderColor: 'border-red-500/30',
          label: 'Krypteringsfeil',
          description: 'Det oppstod en feil under kryptering/dekryptering'
        };
      case 'not-encrypted':
      default:
        return {
          icon: LockOpen,
          color: 'text-gray-500',
          bgColor: 'bg-gray-500/10',
          borderColor: 'border-gray-500/30',
          label: 'Ikke kryptert',
          description: 'Meldingen er sendt uten kryptering'
        };
    }
  };

  // Get transmission type info
  const getTransmissionInfo = () => {
    switch (transmissionType) {
      case 'webrtc':
        return {
          label: 'WebRTC',
          color: 'text-green-400',
          description: 'Sendt via sikker WebRTC-forbindelse'
        };
      case 'mcp':
        return {
          label: 'MCP',
          color: 'text-blue-400',
          description: 'Sendt via Model Context Protocol'
        };
      case 'supabase':
      default:
        return {
          label: 'Standard',
          color: 'text-gray-400',
          description: 'Sendt via standard server-forbindelse'
        };
    }
  };

  const indicatorInfo = getIndicatorInfo();
  const transmissionInfo = getTransmissionInfo();
  const IconComponent = indicatorInfo.icon;

  if (variant === 'icon-only') {
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <div className={cn(
            "inline-flex items-center justify-center w-4 h-4 rounded-full",
            indicatorInfo.bgColor,
            indicatorInfo.borderColor,
            "border",
            className
          )}>
            <IconComponent className={cn("w-2.5 h-2.5", indicatorInfo.color)} />
          </div>
        </TooltipTrigger>
        <TooltipContent side="top" className="max-w-xs">
          <div className="space-y-1">
            <p className="font-medium">{indicatorInfo.label}</p>
            <p className="text-xs text-muted-foreground">{indicatorInfo.description}</p>
            <div className="flex items-center gap-1 text-xs">
              <span className={transmissionInfo.color}>{transmissionInfo.label}</span>
              <span className="text-muted-foreground">• {transmissionInfo.description}</span>
            </div>
          </div>
        </TooltipContent>
      </Tooltip>
    );
  }

  if (variant === 'badge') {
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <Badge 
            variant="outline" 
            className={cn(
              "text-xs gap-1 px-2 py-0.5",
              indicatorInfo.bgColor,
              indicatorInfo.borderColor,
              indicatorInfo.color,
              className
            )}
          >
            <IconComponent className="w-3 h-3" />
            {indicatorInfo.label}
          </Badge>
        </TooltipTrigger>
        <TooltipContent side="top">
          <div className="space-y-1">
            <p>{indicatorInfo.description}</p>
            <p className="text-xs text-muted-foreground">
              Via {transmissionInfo.label} • {transmissionInfo.description}
            </p>
          </div>
        </TooltipContent>
      </Tooltip>
    );
  }

  // Full variant
  return (
    <div className={cn(
      "inline-flex items-center gap-2 px-3 py-1 rounded-lg",
      indicatorInfo.bgColor,
      indicatorInfo.borderColor,
      "border",
      className
    )}>
      <IconComponent className={cn("w-4 h-4", indicatorInfo.color)} />
      <div className="flex flex-col">
        <span className={cn("text-sm font-medium", indicatorInfo.color)}>
          {indicatorInfo.label}
        </span>
        <span className="text-xs text-muted-foreground">
          Via {transmissionInfo.label}
        </span>
      </div>
    </div>
  );
};

// Helper component for group encryption status
interface GroupEncryptionStatusProps {
  participants: Array<{
    id: string;
    name: string;
    hasEncryption: boolean;
  }>;
  className?: string;
}

export const GroupEncryptionStatus: React.FC<GroupEncryptionStatusProps> = ({
  participants,
  className
}) => {
  const encryptedCount = participants.filter(p => p.hasEncryption).length;
  const totalCount = participants.length;
  const percentage = totalCount > 0 ? (encryptedCount / totalCount) * 100 : 0;

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div className={cn(
          "inline-flex items-center gap-2 px-3 py-2 rounded-lg border",
          percentage >= 100 ? "bg-green-500/10 border-green-500/30" :
          percentage >= 75 ? "bg-blue-500/10 border-blue-500/30" :
          percentage >= 50 ? "bg-yellow-500/10 border-yellow-500/30" :
          "bg-red-500/10 border-red-500/30",
          className
        )}>
          <ShieldCheck className={cn(
            "w-4 h-4",
            percentage >= 100 ? "text-green-500" :
            percentage >= 75 ? "text-blue-500" :
            percentage >= 50 ? "text-yellow-500" :
            "text-red-500"
          )} />
          <div className="flex flex-col">
            <span className="text-sm font-medium">
              {encryptedCount}/{totalCount} Kryptert
            </span>
            <span className="text-xs text-muted-foreground">
              {Math.round(percentage)}% sikkerhet
            </span>
          </div>
        </div>
      </TooltipTrigger>
      <TooltipContent side="top" className="max-w-sm">
        <div className="space-y-2">
          <p className="font-medium">Gruppekrypteringsstatus</p>
          <div className="space-y-1">
            {participants.map(participant => (
              <div key={participant.id} className="flex items-center gap-2 text-xs">
                <div className={cn(
                  "w-2 h-2 rounded-full",
                  participant.hasEncryption ? "bg-green-500" : "bg-red-500"
                )}>
                </div>
                <span className="flex-1">{participant.name}</span>
                <span className={cn(
                  participant.hasEncryption ? "text-green-400" : "text-red-400"
                )}>
                  {participant.hasEncryption ? "Kryptert" : "Ikke kryptert"}
                </span>
              </div>
            ))}
          </div>
        </div>
      </TooltipContent>
    </Tooltip>
  );
};
