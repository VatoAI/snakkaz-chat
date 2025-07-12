import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { GroupInvite } from '@/types/groups';
import { Button } from '@/components/ui/button';
import { CheckIcon, XIcon } from 'lucide-react';

interface GroupInviteDialogProps {
  isOpen: boolean;
  onClose: () => void;
  invites: GroupInvite[];
  onAccept: (invite: GroupInvite) => Promise<void>;
  onDecline: (invite: GroupInvite) => Promise<void>;
  userProfiles: Record<string, { username: string | null; avatar_url: string | null; }>;
}

export const GroupInviteDialog: React.FC<GroupInviteDialogProps> = ({
  isOpen,
  onClose,
  invites,
  onAccept,
  onDecline,
  userProfiles
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-cyberdark-900 border-cybergold-500/30 text-cybergold-200 max-w-md">
        <DialogHeader>
          <DialogTitle>Group Invites</DialogTitle>
        </DialogHeader>
        <div className="divide-y divide-cybergold-500/20">
          {invites.map((invite) => (
            <div key={invite.id} className="py-4 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-cybergold-300">
                  {userProfiles[invite.invited_by]?.username || 'Unknown User'} invited you to join {invite.group_name || 'Unknown Group'}
                </p>
                <p className="text-xs text-cybergold-500">
                  Created at: {invite.created_at}
                </p>
              </div>
              <div className="flex space-x-2">
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-green-500 hover:bg-green-500/10"
                  onClick={() => onAccept(invite)}
                >
                  <CheckIcon className="h-4 w-4" />
                  <span className="sr-only">Accept</span>
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-red-500 hover:bg-red-500/10"
                  onClick={() => onDecline(invite)}
                >
                  <XIcon className="h-4 w-4" />
                  <span className="sr-only">Decline</span>
                </Button>
              </div>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};
