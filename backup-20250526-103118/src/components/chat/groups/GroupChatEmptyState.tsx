import React from "react";
import { Button } from "@/components/ui/button";
import { SecurityLevel } from "@/types/security";
import { Users, Lock, Shield, Star, Zap } from "lucide-react";

interface GroupChatEmptyStateProps {
  groupName?: string;
  connectionState: string;
  securityLevel: string;
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
  onEnablePageEncryption,
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 h-full">
      <div className="bg-cyberdark-800/70 rounded-xl p-6 border border-cybergold-800/40 max-w-md w-full">
        <div className="text-center">
          <h3 className="text-cybergold-300 text-xl font-semibold mb-1">
            {groupName ? `Velkommen til ${groupName}` : "Ny gruppesamtale"}
          </h3>
          <p className="text-cybergold-500 mb-6">
            Denne samtalen er tom. Start samtalen ved å sende en melding!
          </p>

          <div className="flex flex-col gap-4">
            {/* Security level info */}
            <div className="bg-cyberdark-900/50 rounded-lg p-4 text-left border border-cyberdark-700/50">
              <div className="flex items-center mb-2">
                {securityLevel === SecurityLevel.SERVER_E2EE ? (
                  <Shield className="h-5 w-5 mr-2 text-cybergold-500" />
                ) : securityLevel === SecurityLevel.P2P_E2EE ? (
                  <Lock className="h-5 w-5 mr-2 text-cybergold-500" />
                ) : (
                  <Shield className="h-5 w-5 mr-2 text-cybergold-600/70" />
                )}
                <h4 className="text-cybergold-300 font-medium">Sikkerhetsnivå</h4>
              </div>
              <p className="text-sm text-cybergold-500/80">
                {securityLevel === SecurityLevel.SERVER_E2EE
                  ? "Denne samtalen er beskyttet med ende-til-ende-kryptering via serveren."
                  : securityLevel === SecurityLevel.P2P_E2EE
                  ? connectionState === "connected"
                    ? "Denne samtalen er beskyttet med direkte ende-til-ende-kryptering mellom deltakerne."
                    : "Venter på direkte ende-til-ende-kryptert tilkobling..."
                  : "Standard sikkerhetsnivå. Meldinger lagres kryptert på serveren."}
              </p>
            </div>

            {/* Members info */}
            <Button
              variant="outline"
              className="bg-cyberdark-900/50 text-cybergold-400 border-cyberdark-700/50 hover:bg-cyberdark-800 hover:text-cybergold-300 justify-start gap-2"
              onClick={onShowInvite}
            >
              <Users className="h-4 w-4" />
              <span className="flex-1 text-left">
                {memberCount} {memberCount === 1 ? "medlem" : "medlemmer"} i denne gruppen
              </span>
              <span className="text-xs text-cybergold-500">Inviter flere</span>
            </Button>

            {/* Premium group info */}
            {isPremium && !isPremiumMember && (
              <Button
                variant="outline"
                className="bg-cybergold-900/20 text-cybergold-400 border-cybergold-700/30 hover:bg-cybergold-900/40 hover:text-cybergold-300 justify-start gap-2"
                onClick={onShowPremium}
              >
                <Star className="h-4 w-4 text-cybergold-500" />
                <span className="flex-1 text-left">
                  Dette er en premium-gruppe
                </span>
                <span className="text-xs text-cybergold-500">Oppgrader</span>
              </Button>
            )}

            {/* Page encryption option */}
            {(isAdmin || isPremiumMember) && !isPageEncryptionEnabled && onEnablePageEncryption && (
              <Button
                variant="outline"
                className="bg-cyberdark-900/50 text-cybergold-400 border-cyberdark-700/50 hover:bg-cyberdark-800 hover:text-cybergold-300 justify-start gap-2"
                onClick={onEnablePageEncryption}
              >
                <Zap className="h-4 w-4" />
                <span className="flex-1 text-left">
                  Aktiver helside-kryptering
                </span>
                <span className="text-xs text-cybergold-500">Anbefalt</span>
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
