import React from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { UserCheck, UserX } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { nb } from "date-fns/locale";
import { GroupInvite } from "@/types/group";

interface GroupInviteDialogProps {
  isOpen: boolean;
  onClose: () => void;
  invites: GroupInvite[];
  onAccept: (invite: GroupInvite) => Promise<void>;
  onDecline: (invite: GroupInvite) => Promise<void>;
  userProfiles: Record<string, { username: string | null; avatar_url: string | null }>;
}

export const GroupInviteDialog: React.FC<GroupInviteDialogProps> = ({
  isOpen,
  onClose,
  invites,
  onAccept,
  onDecline,
  userProfiles
}) => {
  const [loadingInviteId, setLoadingInviteId] = React.useState<string | null>(null);
  
  const handleAccept = async (invite: GroupInvite) => {
    setLoadingInviteId(invite.id);
    try {
      await onAccept(invite);
    } finally {
      setLoadingInviteId(null);
    }
  };
  
  const handleDecline = async (invite: GroupInvite) => {
    setLoadingInviteId(invite.id);
    try {
      await onDecline(invite);
    } finally {
      setLoadingInviteId(null);
    }
  };
  
  const getSenderName = (invite: GroupInvite) => {
    const senderId = invite.invitedById || invite.invited_by;
    if (!senderId) return 'Unknown user';
    
    const profile = userProfiles[senderId];
    return profile?.username || 'Unknown user';
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-cyberdark-900 border-cybergold-500/30">
        <DialogHeader>
          <DialogTitle className="text-cybergold-300">Group Invitations</DialogTitle>
          <DialogDescription className="text-cybergold-500">
            You have received invitations to join the following groups
          </DialogDescription>
        </DialogHeader>
        
        {invites.length === 0 ? (
          <div className="py-6 text-center text-cybergold-400">
            No pending invitations
          </div>
        ) : (
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {invites.map((invite) => (
              <div 
                key={invite.id} 
                className="p-4 border border-cyberdark-700 rounded-md bg-cyberdark-800"
              >
                <div className="mb-2">
                  <h3 className="text-cybergold-200 font-semibold">
                    {invite.group_name || 'Unnamed Group'}
                  </h3>
                  <p className="text-sm text-cybergold-500">
                    Invited by {getSenderName(invite)}
                  </p>
                </div>
                
                <div className="flex space-x-2">
                  <Button
                    variant="outline" 
                    size="sm"
                    className="bg-cyberdark-700 hover:bg-cyberdark-600 border-cybergold-700"
                    onClick={() => handleAccept(invite)}
                    disabled={loadingInviteId === invite.id}
                  >
                    {loadingInviteId === invite.id ? (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <UserCheck className="h-4 w-4 mr-2 text-green-500" />
                    )}
                    Accept
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-cyberdark-700 hover:bg-cyberdark-700"
                    onClick={() => handleDecline(invite)}
                    disabled={loadingInviteId === invite.id}
                  >
                    {loadingInviteId === invite.id ? (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <UserX className="h-4 w-4 mr-2 text-red-500" />
                    )}
                    Decline
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
