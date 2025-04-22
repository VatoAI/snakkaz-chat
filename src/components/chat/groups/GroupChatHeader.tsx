
import { Users, ArrowLeft, RefreshCw } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Group } from "@/types/group";
import { SecurityBadge } from "../security/SecurityBadge";
import { SecurityLevelSelector } from "../security/SecurityLevelSelector";
import { SecurityLevel } from "@/types/security";
import { supabase } from "@/integrations/supabase/client";

interface GroupChatHeaderProps {
  group: Group;
  connectionState: string;
  dataChannelState: string;
  usingServerFallback: boolean;
  connectionAttempts: number;
  onBack: () => void;
  onReconnect: () => void;
  securityLevel: SecurityLevel;
  setSecurityLevel: (level: SecurityLevel) => void;
  userProfiles?: Record<string, {username: string | null, avatar_url: string | null}>;
}

export const GroupChatHeader = ({
  group,
  connectionState,
  dataChannelState,
  usingServerFallback,
  connectionAttempts,
  onBack,
  onReconnect,
  securityLevel,
  setSecurityLevel,
  userProfiles = {}
}: GroupChatHeaderProps) => {
  const memberCount = group.members.length;
  const canUsePeerToPeer = memberCount <= 5; // Limit P2P for small groups
  
  // Get avatars for the first 3 members
  const memberAvatars = group.members
    .slice(0, 3)
    .map(member => {
      const profile = member.profile || userProfiles[member.user_id];
      return {
        userId: member.user_id,
        username: profile?.username || 'Unknown',
        avatarUrl: profile?.avatar_url || null
      };
    });
  
  // Handle security level change
  const handleSecurityChange = (level: SecurityLevel) => {
    // If trying to set P2P but group is too large, default to server_e2ee
    if (level === 'p2p_e2ee' && !canUsePeerToPeer) {
      setSecurityLevel('server_e2ee');
    } else {
      setSecurityLevel(level);
    }
  };

  return (
    <div className="border-b border-cybergold-500/30 p-3 flex items-center bg-cyberdark-900">
      <Button
        variant="ghost"
        size="icon"
        onClick={onBack}
        className="mr-2 text-cybergold-400 hover:text-cybergold-300 hover:bg-cyberdark-800"
      >
        <ArrowLeft className="h-5 w-5" />
      </Button>
      
      <div className="flex items-center space-x-3 flex-1">
        <div className="relative">
          {memberAvatars.length > 0 ? (
            <div className="flex -space-x-2">
              {memberAvatars.map((member, index) => (
                <Avatar
                  key={member.userId}
                  className={`w-8 h-8 border-2 border-cyberdark-800 ${
                    index === 0 ? "z-30" : index === 1 ? "z-20" : "z-10"
                  }`}
                >
                  {member.avatarUrl ? (
                    <AvatarImage
                      src={supabase.storage.from('avatars').getPublicUrl(member.avatarUrl).data.publicUrl}
                      alt={member.username}
                    />
                  ) : (
                    <AvatarFallback className="bg-cybergold-500/30 text-cybergold-200">
                      {member.username[0].toUpperCase()}
                    </AvatarFallback>
                  )}
                </Avatar>
              ))}
            </div>
          ) : (
            <Avatar className="w-10 h-10 border-2 border-cybergold-500/20">
              <AvatarFallback className="bg-cybergold-500/20 text-cybergold-300">
                <Users className="h-5 w-5" />
              </AvatarFallback>
            </Avatar>
          )}
          
          {memberCount > 3 && (
            <div className="absolute -bottom-1 -right-1 bg-cyberdark-800 text-cybergold-300 text-xs rounded-full w-5 h-5 flex items-center justify-center border border-cybergold-500/30">
              +{memberCount - 3}
            </div>
          )}
        </div>
        
        <div className="flex flex-col">
          <h2 className="text-cybergold-200 font-medium truncate max-w-[150px]">
            {group.name}
          </h2>
          <p className="text-xs text-cybergold-400">
            {memberCount} {memberCount === 1 ? 'medlem' : 'medlemmer'}
          </p>
        </div>
      </div>
      
      <div className="flex items-center space-x-3">
        <SecurityBadge
          securityLevel={securityLevel}
          connectionState={connectionState}
          dataChannelState={dataChannelState}
          usingServerFallback={usingServerFallback}
          showLabel={true}
        />
        
        <SecurityLevelSelector
          value={securityLevel}
          onChange={handleSecurityChange}
          disabled={!canUsePeerToPeer}
        />
        
        {securityLevel === 'p2p_e2ee' && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onReconnect}
            className="text-cybergold-400 hover:text-cybergold-300 hover:bg-cyberdark-800"
            disabled={connectionState === 'connecting'}
          >
            <RefreshCw className={`h-5 w-5 ${connectionState === 'connecting' ? 'animate-spin' : ''}`} />
          </Button>
        )}
      </div>
    </div>
  );
};
