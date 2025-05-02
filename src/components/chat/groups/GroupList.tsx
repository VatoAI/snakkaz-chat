
import React from 'react';
import { Group } from '@/types/group';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { DecryptedMessage } from '@/types/message';

const defaultGroupAvatar = "/icons/snakkaz-icon-512.png";

interface GroupListProps {
  groups: Group[];
  onSelectGroup?: (group: Group) => void;
  onJoinGroup?: (groupId: string, password?: string) => Promise<boolean>;
  onOpenPasswordDialog?: (group: Group) => void;
  searchQuery?: string;
  currentUserId: string;
  onOpenCreateGroupModal?: () => void;
  groupConversations?: Record<string, DecryptedMessage[]>;
  setSelectedGroup?: (group: Group) => void;
}

export const GroupList: React.FC<GroupListProps> = ({
  groups,
  onSelectGroup,
  onJoinGroup,
  onOpenPasswordDialog,
  searchQuery = "",
  currentUserId,
  onOpenCreateGroupModal,
  groupConversations,
  setSelectedGroup
}) => {
  const handleSelectGroup = (group: Group) => {
    if (onSelectGroup) {
      onSelectGroup(group);
    } else if (setSelectedGroup) {
      setSelectedGroup(group);
    }
  };

  const filteredGroups = groups.filter(group =>
    group.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const renderGroupItem = (group: Group) => {
    // Get avatar URL safely with fallback, supporting both camelCase and snake_case
    const avatarUrl = group.avatarUrl || group.avatar_url || defaultGroupAvatar;
    
    return (
      <Button
        key={group.id}
        variant="ghost"
        className="flex items-center space-x-4 py-3 w-full justify-start rounded-md hover:bg-secondary"
        onClick={() => handleSelectGroup(group)}
      >
        <Avatar>
          <AvatarImage src={avatarUrl} alt={group.name} />
          <AvatarFallback>{group.name.charAt(0)}</AvatarFallback>
        </Avatar>
        <div className="flex flex-col space-y-1 leading-none">
          <p className="text-sm font-medium">{group.name}</p>
          <p className="text-sm text-muted-foreground">
            {group.memberCount || group.members?.length} members
          </p>
        </div>
        {group.password !== undefined && (
          <div className="password-protected">Password Protected</div>
        )}
      </Button>
    );
  };

  return (
    <div className="flex flex-col h-full">
      {onOpenCreateGroupModal && (
        <div className="p-4">
          <Button variant="outline" className="w-full" onClick={onOpenCreateGroupModal}>
            Lag ny gruppe
          </Button>
        </div>
      )}
      <ScrollArea className="flex-1 p-4 space-y-2">
        {filteredGroups.map((group) => renderGroupItem(group))}
      </ScrollArea>
    </div>
  );
};
