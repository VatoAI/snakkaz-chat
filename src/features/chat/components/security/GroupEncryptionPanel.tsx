import React from 'react';
import { Shield, Users, AlertCircle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { EncryptionIndicator, GroupEncryptionStatus } from './EncryptionIndicator';

interface GroupEncryptionPanelProps {
  participants: Array<{
    id: string;
    name: string;
    hasEncryption: boolean;
    isOnline: boolean;
  }>;
  isGroupEncrypted: boolean;
  totalMessages: number;
  encryptedMessages: number;
  className?: string;
}

export const GroupEncryptionPanel: React.FC<GroupEncryptionPanelProps> = ({
  participants,
  isGroupEncrypted,
  totalMessages,
  encryptedMessages,
  className
}) => {
  const encryptedParticipants = participants.filter(p => p.hasEncryption).length;
  const onlineParticipants = participants.filter(p => p.isOnline).length;
  const encryptionPercentage = totalMessages > 0 ? (encryptedMessages / totalMessages) * 100 : 0;
  
  const getSecurityLevel = () => {
    if (encryptedParticipants === participants.length && encryptionPercentage >= 95) {
      return 'høy';
    } else if (encryptedParticipants >= participants.length * 0.7 && encryptionPercentage >= 70) {
      return 'medium';
    } else {
      return 'lav';
    }
  };

  const securityLevel = getSecurityLevel();

  return (
    <Card className={cn("bg-cyberdark-800/50 border-cyberdark-700", className)}>
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-cybergold-400" />
            <h3 className="text-sm font-medium text-white">Gruppesikkerhet</h3>
          </div>
          <Badge 
            variant="outline" 
            className={cn(
              "text-xs",
              securityLevel === 'høy' ? "border-green-500 text-green-400" :
              securityLevel === 'medium' ? "border-yellow-500 text-yellow-400" :
              "border-red-500 text-red-400"
            )}
          >
            {securityLevel === 'høy' ? 'Høy sikkerhet' :
             securityLevel === 'medium' ? 'Medium sikkerhet' :
             'Lav sikkerhet'}
          </Badge>
        </div>

        <div className="space-y-3">
          {/* Group encryption status */}
          <GroupEncryptionStatus 
            participants={participants}
            className="w-full"
          />

          {/* Statistics */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-cyberdark-900/50 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-1">
                <Users className="w-4 h-4 text-cybergold-400" />
                <span className="text-xs text-cybergold-300">Deltakere</span>
              </div>
              <div className="text-sm font-medium text-white">
                {onlineParticipants}/{participants.length} pålogget
              </div>
              <div className="text-xs text-cybergold-500">
                {encryptedParticipants}/{participants.length} kryptert
              </div>
            </div>

            <div className="bg-cyberdark-900/50 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-1">
                <Shield className="w-4 h-4 text-cybergold-400" />
                <span className="text-xs text-cybergold-300">Meldinger</span>
              </div>
              <div className="text-sm font-medium text-white">
                {Math.round(encryptionPercentage)}% kryptert
              </div>
              <div className="text-xs text-cybergold-500">
                {encryptedMessages}/{totalMessages} meldinger
              </div>
            </div>
          </div>

          {/* Individual participant status */}
          <div className="space-y-1">
            <h4 className="text-xs font-medium text-cybergold-300 mb-2">Deltakerstatus</h4>
            <div className="space-y-1 max-h-32 overflow-y-auto">
              {participants.map(participant => (
                <div key={participant.id} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <div className={cn(
                      "w-2 h-2 rounded-full",
                      participant.isOnline ? "bg-green-500" : "bg-gray-500"
                    )} />
                    <span className="text-white truncate max-w-[120px]">
                      {participant.name}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    {participant.hasEncryption ? (
                      <Tooltip>
                        <TooltipTrigger>
                          <Shield className="w-3 h-3 text-green-400" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Kryptering aktivert</p>
                        </TooltipContent>
                      </Tooltip>
                    ) : (
                      <Tooltip>
                        <TooltipTrigger>
                          <AlertCircle className="w-3 h-3 text-red-400" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Kryptering ikke støttet</p>
                        </TooltipContent>
                      </Tooltip>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recommendations */}
          {securityLevel !== 'høy' && (
            <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-3">
              <div className="flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-yellow-400 mt-0.5" />
                <div className="text-xs">
                  <p className="text-yellow-300 font-medium mb-1">Sikkerhetsanbefaling</p>
                  <p className="text-yellow-200">
                    {securityLevel === 'lav' 
                      ? "Få deltakere har kryptering aktivert. Be alle om å oppdatere til siste versjon."
                      : "Noen deltakere mangler kryptering. Sjekk at alle bruker siste versjon av appen."
                    }
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
