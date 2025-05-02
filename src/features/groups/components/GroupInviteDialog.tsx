
import React from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogDescription,
  DialogFooter 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { GroupInvite } from "@/types/group";
import { Loader2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface GroupInviteDialogProps {
  isOpen: boolean;
  onClose: () => void;
  invites: GroupInvite[];
  onAccept: (invite: GroupInvite) => Promise<void>;
  onDecline: (invite: GroupInvite) => Promise<void>;
  userProfiles: Record<string, { username: string | null; avatar_url: string | null; }>;
}

export function GroupInviteDialog({
  isOpen,
  onClose,
  invites,
  onAccept,
  onDecline,
  userProfiles
}: GroupInviteDialogProps) {
  const [processingInvite, setProcessingInvite] = React.useState<string | null>(null);
  const [processingAction, setProcessingAction] = React.useState<'accept' | 'decline' | null>(null);

  const handleAccept = async (invite: GroupInvite) => {
    try {
      setProcessingInvite(invite.id);
      setProcessingAction('accept');
      await onAccept(invite);
    } finally {
      setProcessingInvite(null);
      setProcessingAction(null);
    }
  };

  const handleDecline = async (invite: GroupInvite) => {
    try {
      setProcessingInvite(invite.id);
      setProcessingAction('decline');
      await onDecline(invite);
    } finally {
      setProcessingInvite(null);
      setProcessingAction(null);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Group Invitations</DialogTitle>
          <DialogDescription>
            You have {invites.length} pending group {invites.length === 1 ? 'invitation' : 'invitations'}.
          </DialogDescription>
        </DialogHeader>

        <div className="max-h-[300px] overflow-y-auto py-2">
          {invites.length === 0 ? (
            <div className="text-center py-4 text-muted-foreground">
              No pending invitations
            </div>
          ) : (
            invites.map(invite => {
              const senderProfile = invite.invitedById ? userProfiles[invite.invitedById] : null;
              const isProcessing = processingInvite === invite.id;
              
              return (
                <div key={invite.id} className="flex items-center justify-between py-3 border-b last:border-0">
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src={senderProfile?.avatar_url || ''} />
                      <AvatarFallback>
                        {senderProfile?.username?.charAt(0) || 'U'}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{invite.group_name || 'Unknown Group'}</p>
                      <p className="text-sm text-muted-foreground">
                        From: {senderProfile?.username || 'Unknown user'}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      onClick={() => handleAccept(invite)}
                      disabled={isProcessing}
                    >
                      {isProcessing && processingAction === 'accept' ? (
                        <Loader2 className="h-4 w-4 animate-spin mr-1" />
                      ) : 'Accept'}
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDecline(invite)}
                      disabled={isProcessing}
                    >
                      {isProcessing && processingAction === 'decline' ? (
                        <Loader2 className="h-4 w-4 animate-spin mr-1" />
                      ) : 'Decline'}
                    </Button>
                  </div>
                </div>
              );
            })
          )}
        </div>
        
        <DialogFooter>
          <Button variant="secondary" onClick={onClose}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
