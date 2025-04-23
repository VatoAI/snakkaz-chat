
import { Button } from "@/components/ui/button";
import { MessageSquare, Shield, UserPlus } from "lucide-react";
import { SecurityLevel } from "@/types/security";

interface GroupChatEmptyStateProps {
  usingServerFallback: boolean;
  securityLevel: SecurityLevel;
  isAdmin?: boolean;
  memberCount?: number;
  onShowInvite?: () => void;
}

export const GroupChatEmptyState = ({ 
  usingServerFallback, 
  securityLevel,
  isAdmin = false,
  memberCount = 0,
  onShowInvite
}: GroupChatEmptyStateProps) => {
  let securityText = "End-to-end kryptert";
  
  if (usingServerFallback) {
    securityText = "Faller tilbake til server-kryptering";
  } else if (securityLevel === 'server_e2ee') {
    securityText = "Server-kryptert (e2ee)";
  } else if (securityLevel === 'standard') {
    securityText = "Standard kryptering";
  }
  
  const showInviteButton = isAdmin && memberCount <= 1 && onShowInvite;

  return (
    <div className="flex flex-col items-center justify-center h-full p-6 text-center">
      <MessageSquare className="h-16 w-16 mb-4 text-cybergold-500/30" />
      
      <h3 className="text-xl font-medium text-cybergold-300 mb-2">
        Ingen meldinger ennå
      </h3>
      
      <p className="text-cybergold-400 max-w-sm mb-4">
        {memberCount <= 1 ? (
          <>Denne gruppen har kun deg som medlem. Inviter venner for å starte en samtale.</>
        ) : (
          <>Start samtalen ved å skrive en melding nedenfor.</>
        )}
      </p>
      
      <div className="flex items-center justify-center mb-6 text-sm">
        <Shield className="h-4 w-4 mr-1.5 text-green-500" />
        <span className="text-green-500">{securityText}</span>
      </div>
      
      {showInviteButton && (
        <Button 
          onClick={onShowInvite} 
          className="bg-cybergold-600 hover:bg-cybergold-700 text-black flex gap-2"
        >
          <UserPlus className="h-4 w-4" />
          <span>Inviter venner</span>
        </Button>
      )}
    </div>
  );
};
