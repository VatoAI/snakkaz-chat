
import React from 'react';
import { Button } from '@/components/ui/button';
import { UserPlus, Lock, ShieldAlert } from 'lucide-react';
import { SecurityLevel } from '@/types/security';

export interface GroupChatEmptyStateProps {
  usingServerFallback: boolean;
  securityLevel: SecurityLevel;
  isAdmin: boolean;
  isPremium?: boolean; // Add missing props
  isPremiumMember: boolean;
  memberCount: number;
  onShowInvite: () => void;
  onShowPremium: () => void;
  isPageEncryptionEnabled: boolean;
  onEnablePageEncryption?: () => Promise<void>;
}

export const GroupChatEmptyState: React.FC<GroupChatEmptyStateProps> = ({
  usingServerFallback,
  securityLevel,
  isAdmin,
  isPremium = false,
  isPremiumMember,
  memberCount,
  onShowInvite,
  onShowPremium,
  isPageEncryptionEnabled,
  onEnablePageEncryption
}) => {
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
      <div className="w-full max-w-md space-y-6">
        <h3 className="text-xl font-semibold text-cybergold-300">
          Start en ny samtale
        </h3>
        
        <p className="text-cybergold-400 text-sm">
          Det er ingen meldinger i denne gruppen enda. Vær den første til å si hei!
        </p>
        
        <div className="flex flex-col gap-3 mt-4">
          <Button 
            onClick={onShowInvite}
            variant="outline" 
            className="bg-cyberdark-800 border-cybergold-500/30 text-cybergold-300 hover:bg-cyberdark-700"
          >
            <UserPlus className="mr-2 h-4 w-4" />
            Inviter flere medlemmer
          </Button>
          
          {!isPageEncryptionEnabled && (isAdmin || isPremiumMember) && onEnablePageEncryption && (
            <Button 
              onClick={onEnablePageEncryption}
              variant="outline" 
              className="bg-cyberdark-800 border-cybergold-500/30 text-cybergold-300 hover:bg-cyberdark-700"
            >
              <Lock className="mr-2 h-4 w-4" />
              Aktiver helside-kryptering
            </Button>
          )}
          
          {!isPremiumMember && (
            <Button 
              onClick={onShowPremium}
              variant="outline"
              className="bg-cybergold-900/30 border-cybergold-500/30 text-cybergold-300 hover:bg-cybergold-900/50"
            >
              <ShieldAlert className="mr-2 h-4 w-4" />
              Oppgrader til premium
            </Button>
          )}
        </div>
        
        <div className="pt-4 text-xs text-cybergold-500">
          {securityLevel === 'p2p_e2ee' ? (
            <p>Denne gruppen bruker ende-til-ende kryptering for maksimal sikkerhet.</p>
          ) : securityLevel === 'server_e2ee' ? (
            <p>Denne gruppen bruker serverkryptering for å beskytte meldingene dine.</p>
          ) : (
            <p>Denne gruppen bruker standardkryptering for meldinger.</p>
          )}
          
          <p className="mt-2">
            Antall medlemmer i gruppen: {memberCount}
          </p>
        </div>
      </div>
    </div>
  );
};
