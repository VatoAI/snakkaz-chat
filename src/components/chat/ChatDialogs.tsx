
import { GroupPasswordDialog } from "@/components/chat/groups/GroupPasswordDialog";
import { GroupInviteDialog } from "@/components/chat/groups/GroupInviteDialog";
import { GroupInvite, Group } from "@/types/group";

interface ChatDialogsProps {
  isPasswordDialogOpen: boolean;
  isInviteDialogOpen: boolean;
  selectedPasswordGroup: Group | null;
  groupInvites: GroupInvite[];
  onClosePassword: () => void;
  onCloseInvite: () => void;
  onSubmitPassword: (password: string) => Promise<boolean>;
  onAcceptInvite: (invite: GroupInvite) => Promise<void>;
  onDeclineInvite: (invite: GroupInvite) => Promise<void>;
  userProfiles: Record<string, { username: string | null; avatar_url: string | null }>;
}

export const ChatDialogs = ({
  isPasswordDialogOpen,
  isInviteDialogOpen,
  selectedPasswordGroup,
  groupInvites,
  onClosePassword,
  onCloseInvite,
  onSubmitPassword,
  onAcceptInvite,
  onDeclineInvite,
  userProfiles
}: ChatDialogsProps) => {
  return (
    <>
      <GroupPasswordDialog
        isOpen={isPasswordDialogOpen}
        onClose={onClosePassword}
        onSubmit={onSubmitPassword}
        group={selectedPasswordGroup}
      />
      <GroupInviteDialog
        isOpen={isInviteDialogOpen}
        onClose={onCloseInvite}
        invites={groupInvites}
        onAccept={onAcceptInvite}
        onDecline={onDeclineInvite}
        userProfiles={userProfiles}
      />
    </>
  );
};
