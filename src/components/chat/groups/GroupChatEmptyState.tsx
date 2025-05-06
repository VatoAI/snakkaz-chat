import React from 'react';
import { SecurityLevel } from '@/types/security';
import { MessageSquare, Shield, UserPlus, Lock, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface GroupChatEmptyStateProps {
  groupName?: string;
  connectionState: string;
  securityLevel: SecurityLevel;
  isAdmin: boolean;
  isPremium: boolean;
  isPremiumMember: boolean;
  memberCount: number;
  onShowInvite: () => void;
  onShowPremium: () => void;
  isPageEncryptionEnabled: boolean;
  onEnablePageEncryption?: () => void;
}

export const GroupChatEmptyState: React.FC<GroupChatEmptyStateProps> = ({
  groupName,
  connectionState,
  securityLevel,
  isAdmin,
  isPremium,
  isPremiumMember,
  memberCount,
  onShowInvite,
  onShowPremium,
  isPageEncryptionEnabled,
  onEnablePageEncryption
}) => {
  return (
    <div className="flex flex-col items-center justify-center h-full p-6 text-center">
      <div className="p-6 rounded-xl bg-cyberdark-800/60 border border-cyberdark-700 mb-5 shadow-lg">
        <MessageSquare className="h-12 w-12 text-cybergold-500 opacity-70" />
      </div>
      
      <h3 className="text-lg font-medium text-cybergold-300 mb-2">
        Ingen meldinger enda
      </h3>
      
      <p className="text-cybergold-500 mb-6 max-w-md">
        Det er ingen meldinger i denne gruppen enda. Send den første meldingen eller inviter flere medlemmer til å delta.
      </p>
      
      <div className="flex flex-wrap gap-3 justify-center mb-8">
        <Button 
          variant="outline" 
          className="bg-cyberdark-800 border-cyberdark-700 text-cybergold-400 hover:bg-cyberdark-700"
          onClick={onShowInvite}
        >
          <UserPlus className="mr-2 h-4 w-4" />
          Inviter medlemmer
        </Button>
        
        {isPremium && !isPremiumMember && (
          <Button 
            variant="default" 
            className="bg-gradient-to-r from-cybergold-800 to-cybergold-700 hover:from-cybergold-700 hover:to-cybergold-600 text-cybergold-200"
            onClick={onShowPremium}
          >
            <Star className="mr-2 h-4 w-4" />
            Oppgrader medlemskap
          </Button>
        )}
        
        {(isAdmin || isPremiumMember) && !isPageEncryptionEnabled && onEnablePageEncryption && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="outline" 
                  className="border-cybergold-800 text-cybergold-500 hover:bg-cybergold-900/30"
                  onClick={onEnablePageEncryption}
                >
                  <Lock className="mr-2 h-4 w-4" />
                  Aktiver kryptering
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Aktiver helside-kryptering for denne gruppen</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </div>
      
      <div className="bg-cyberdark-800/50 rounded-lg p-4 max-w-md">
        <div className="flex items-center mb-3">
          <Shield className="h-5 w-5 text-cybergold-500 mr-2" />
          <h4 className="text-sm font-medium text-cybergold-400">Sikkerhetsnivå: {getSecurityLevelText(securityLevel)}</h4>
        </div>
        
        <p className="text-xs text-cybergold-600 leading-relaxed">
          {getSecurityLevelDescription(securityLevel)}
        </p>
        
        <div className="mt-3 text-xs text-cybergold-500">
          <span className="font-medium">Antall medlemmer:</span> {memberCount}
        </div>
      </div>
    </div>
  );
};

function getSecurityLevelText(level: SecurityLevel): string {
  switch (level) {
    case 'p2p_e2ee':
      return 'P2P (Ende-til-ende kryptert)';
    case 'server_e2ee':
      return 'Server (Ende-til-ende kryptert)';
    case 'premium':
      return 'Premium';
    case 'high':
      return 'Høy';
    case 'maximum':
      return 'Maksimum';
    default:
      return 'Standard';
  }
}

function getSecurityLevelDescription(level: SecurityLevel): string {
  switch (level) {
    case 'p2p_e2ee':
      return 'Direkte peer-to-peer kommunikasjon med ende-til-ende kryptering. Ingen data lagres på serveren.';
    case 'server_e2ee':
      return 'Ende-til-ende kryptert kommunikasjon via server, med midlertidig lagring av krypterte meldinger.';
    case 'premium':
      return 'Premium sikkerhetsnivå med avansert kryptering og ytterligere sikkerhetsfunksjoner.';
    case 'high':
      return 'Høy sikkerhet med TLS-kryptering og krypterte meldinger på serveren.';
    case 'maximum':
      return 'Maksimal sikkerhet med flere lag av kryptering og strenge adgangsregler.';
    default:
      return 'Standard sikkerhetsnivå med TLS-kryptering for all kommunikasjon.';
  }
}
