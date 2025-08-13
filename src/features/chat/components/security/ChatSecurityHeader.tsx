import React, { useState } from 'react';
import { Shield, ShieldCheck, Info, Settings, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { cn } from '@/lib/utils';
import { EncryptionIndicator } from './EncryptionIndicator';
import { GroupEncryptionPanel } from './GroupEncryptionPanel';

interface ChatSecurityHeaderProps {
  chatTitle: string;
  chatType: 'direct' | 'group' | 'public';
  isEncrypted: boolean;
  participants?: Array<{
    id: string;
    name: string;
    hasEncryption: boolean;
    isOnline: boolean;
  }>;
  encryptionMetrics?: {
    totalMessages: number;
    encryptedMessages: number;
    encryptionSuccessRate: number;
  };
  onSecuritySettings?: () => void;
  className?: string;
}

export const ChatSecurityHeader: React.FC<ChatSecurityHeaderProps> = ({
  chatTitle,
  chatType,
  isEncrypted,
  participants = [],
  encryptionMetrics = { totalMessages: 0, encryptedMessages: 0, encryptionSuccessRate: 0 },
  onSecuritySettings,
  className
}) => {
  const [showSecurityPanel, setShowSecurityPanel] = useState(false);
  
  const getSecurityStatus = () => {
    if (chatType === 'public') {
      return {
        status: 'not-encrypted' as const,
        label: 'Offentlig chat',
        description: 'Offentlige chatter er ikke kryptert'
      };
    }
    
    if (chatType === 'direct') {
      return {
        status: isEncrypted ? 'encrypted' as const : 'not-encrypted' as const,
        label: isEncrypted ? 'Sikker direktemelding' : 'Usikret direktemelding',
        description: isEncrypted 
          ? 'Alle meldinger er ende-til-ende kryptert'
          : 'Meldinger sendes uten kryptering'
      };
    }
    
    // Group chat
    if (participants.length === 0) {
      return {
        status: 'not-encrypted' as const,
        label: 'Gruppe uten deltakere',
        description: 'Ingen deltakere i gruppen'
      };
    }
    
    const encryptedCount = participants.filter(p => p.hasEncryption).length;
    const percentage = (encryptedCount / participants.length) * 100;
    
    if (percentage >= 100) {
      return {
        status: 'encrypted' as const,
        label: 'Fullstendig kryptert gruppe',
        description: 'Alle deltakere støtter kryptering'
      };
    } else if (percentage >= 50) {
      return {
        status: 'partial' as const,
        label: 'Delvis kryptert gruppe',
        description: `${encryptedCount}/${participants.length} deltakere har kryptering`
      };
    } else {
      return {
        status: 'not-encrypted' as const,
        label: 'Ukryptert gruppe',
        description: 'Få eller ingen deltakere støtter kryptering'
      };
    }
  };

  const securityInfo = getSecurityStatus();

  return (
    <div className={cn("bg-cyberdark-800/30 border-b border-cyberdark-700", className)}>
      <div className="flex items-center justify-between p-3">
        <div className="flex items-center gap-3">
          <div className="flex flex-col">
            <h2 className="text-sm font-medium text-white">{chatTitle}</h2>
            <div className="flex items-center gap-2">
              <EncryptionIndicator 
                status={securityInfo.status}
                variant="icon-only"
                className="scale-75"
              />
              <span className="text-xs text-cybergold-400">{securityInfo.label}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Encryption success rate for groups */}
          {chatType === 'group' && encryptionMetrics.totalMessages > 0 && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Badge 
                  variant="outline" 
                  className={cn(
                    "text-xs",
                    encryptionMetrics.encryptionSuccessRate >= 95 ? "border-green-500 text-green-400" :
                    encryptionMetrics.encryptionSuccessRate >= 80 ? "border-yellow-500 text-yellow-400" :
                    "border-red-500 text-red-400"
                  )}
                >
                  {Math.round(encryptionMetrics.encryptionSuccessRate)}%
                </Badge>
              </TooltipTrigger>
              <TooltipContent>
                <p>Krypteringseffektivitet</p>
                <p className="text-xs text-muted-foreground">
                  {encryptionMetrics.encryptedMessages}/{encryptionMetrics.totalMessages} meldinger kryptert
                </p>
              </TooltipContent>
            </Tooltip>
          )}

          {/* Security info toggle */}
          {chatType === 'group' && participants.length > 0 && (
            <Collapsible 
              open={showSecurityPanel} 
              onOpenChange={setShowSecurityPanel}
            >
              <CollapsibleTrigger asChild>
                <Button variant="ghost" size="sm" className="text-cybergold-400 hover:bg-cyberdark-700">
                  <Info className="w-4 h-4 mr-1" />
                  <span className="text-xs">Sikkerhet</span>
                  <ChevronDown className={cn(
                    "w-3 h-3 ml-1 transition-transform",
                    showSecurityPanel && "rotate-180"
                  )} />
                </Button>
              </CollapsibleTrigger>
            </Collapsible>
          )}

          {/* Security settings */}
          {onSecuritySettings && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={onSecuritySettings}
                  className="text-cybergold-400 hover:bg-cyberdark-700"
                >
                  <Settings className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Sikkerhetsinnstillinger</p>
              </TooltipContent>
            </Tooltip>
          )}
        </div>
      </div>

      {/* Security panel for groups */}
      {chatType === 'group' && participants.length > 0 && (
        <Collapsible open={showSecurityPanel} onOpenChange={setShowSecurityPanel}>
          <CollapsibleContent>
            <div className="px-3 pb-3">
              <GroupEncryptionPanel
                participants={participants}
                isGroupEncrypted={isEncrypted}
                totalMessages={encryptionMetrics.totalMessages}
                encryptedMessages={encryptionMetrics.encryptedMessages}
              />
            </div>
          </CollapsibleContent>
        </Collapsible>
      )}
    </div>
  );
};
