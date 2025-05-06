import React, { useState, useCallback } from "react";
import { GroupMember } from "@/types/groups";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { MoreVertical, CheckCircle, UserPlus, UserMinus, UserCog } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { getInitials } from "@/utils/user";

interface GroupMembersListProps {
  members: GroupMember[];
  currentUserId: string;
  userProfiles: Record<string, any>;
  isAdmin: boolean;
  groupId: string;
  onMemberUpdated?: () => void; // Make onMemberUpdated optional
  isMobile?: boolean; // Add isMobile property
}

export const GroupMembersList: React.FC<GroupMembersListProps> = ({
  members,
  currentUserId,
  userProfiles,
  isAdmin,
  groupId,
  onMemberUpdated,
  isMobile
}) => {
  const [loadingMember, setLoadingMember] = useState<string | null>(null);

  const handlePromoteMember = useCallback(async (member: GroupMember) => {
    if (!isAdmin || loadingMember) return;

    setLoadingMember(member.id || null);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Update member role to admin
      // In a real implementation, you would call your API here
      console.log(`Promoting member ${member.user_id} to admin`);

      onMemberUpdated?.();
    } catch (error) {
      console.error("Failed to promote member", error);
    } finally {
      setLoadingMember(null);
    }
  }, [isAdmin, loadingMember, onMemberUpdated]);

  const handleRemoveMember = useCallback(async (member: GroupMember) => {
    if (!isAdmin || loadingMember) return;

    setLoadingMember(member.id || null);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Remove member from group
      // In a real implementation, you would call your API here
      console.log(`Removing member ${member.user_id} from group`);

      onMemberUpdated?.();
    } catch (error) {
      console.error("Failed to remove member", error);
    } finally {
      setLoadingMember(null);
    }
  }, [isAdmin, loadingMember, onMemberUpdated]);

  return (
    <div className="space-y-2">
      {members.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-4 text-center">
          <div className="w-10 h-10 bg-cyberdark-800 rounded-full flex items-center justify-center mb-2">
            <Users className="h-5 w-5 text-cybergold-500/70" />
          </div>
          <p className="text-sm text-cybergold-500">Ingen medlemmer i denne gruppen</p>
        </div>
      ) : (
        members.map((member) => {
          const userProfile = userProfiles[member.user_id];
          const isAdminMember = member.role === "admin";
          const isLoading = loadingMember === member.id;
          const isCurrentUser = member.user_id === currentUserId;

          return (
            <div key={member.id} className="flex items-center justify-between p-2 rounded-md bg-cyberdark-800">
              <div className="flex items-center space-x-3">
                <Avatar className="h-8 w-8">
                  {userProfile?.avatar_url ? (
                    <AvatarImage src={userProfile.avatar_url} alt={userProfile?.username || "Group Member"} />
                  ) : (
                    <AvatarFallback className="bg-cyberdark-700 text-cybergold-300">
                      {getInitials(userProfile?.username || "Ukjent bruker")}
                    </AvatarFallback>
                  )}
                </Avatar>
                <div>
                  <p className="text-sm font-medium text-cybergold-300">{userProfile?.username || "Ukjent bruker"}</p>
                  <p className="text-xs text-cybergold-500">{userProfile?.status || "Offline"}</p>
                </div>
              </div>
              {isAdmin && !isCurrentUser ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0 rounded-full hover:bg-cyberdark-700">
                      <span className="sr-only">Åpne meny</span>
                      <MoreVertical className="h-4 w-4 text-cybergold-400" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-40 bg-cyberdark-900 border-cybergold-500/30 text-cybergold-200">
                    <DropdownMenuLabel>Administrer</DropdownMenuLabel>
                    <DropdownMenuSeparator className="bg-cybergold-500/30" />
                    {!isAdminMember ? (
                      <DropdownMenuItem onClick={() => handlePromoteMember(member)} disabled={isLoading}>
                        <UserCog className="mr-2 h-4 w-4" />
                        Gjør til admin
                      </DropdownMenuItem>
                    ) : (
                      <DropdownMenuItem disabled>
                        <CheckCircle className="mr-2 h-4 w-4" />
                        Allerede admin
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuItem onClick={() => handleRemoveMember(member)} disabled={isLoading}>
                      <UserMinus className="mr-2 h-4 w-4" />
                      Fjern fra gruppen
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                isCurrentUser && (
                  <Badge variant="secondary" className="bg-cybergold-900/30 border-cybergold-700 text-cybergold-400">
                    Deg
                  </Badge>
                )
              )}
            </div>
          );
        })
      )}
    </div>
  );
};
