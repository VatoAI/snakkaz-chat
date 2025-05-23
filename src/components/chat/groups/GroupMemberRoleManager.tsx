/**
 * Group Member Role Manager Component for Snakkaz Chat
 * 
 * This component provides an interface for managing member roles in groups, 
 * allowing admins to promote/demote members to different roles like admin, 
 * moderator, and regular member.
 */

import React, { useState, useEffect } from "react";
import { GroupMember, GroupRole } from "@/types/group";
import { UserAvatar } from "../header/UserAvatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Crown,
  Shield,
  User,
  Search,
  UserCheck,
  Star,
  XCircle,
  Info,
  Lock
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { getRoleLabel, getRoleDescription, getRolePermissions, validateRoleChange } from "@/utils/group-roles";

interface GroupMemberRoleManagerProps {
  isOpen: boolean;
  onClose: () => void;
  members: GroupMember[];
  currentUserId: string;
  userProfiles: Record<string, { 
    username?: string;
    full_name?: string;
    avatar_url?: string;
    status?: string;
  }>;
  groupId: string;
  onMemberUpdated?: () => void;
}

type Role = "admin" | "moderator" | "member" | "premium";

export function GroupMemberRoleManager({
  isOpen,
  onClose,
  members,
  currentUserId,
  userProfiles,
  groupId,
  onMemberUpdated,
}: GroupMemberRoleManagerProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [isUpdating, setIsUpdating] = useState<Record<string, boolean>>({});
  const { toast } = useToast();
  
  const filteredMembers = members.filter((member) => {
    const username = userProfiles[member.user_id]?.username || "";
    const fullName = userProfiles[member.user_id]?.full_name || "";
    
    return (
      username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      fullName.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });
  
  // Check if current user is an admin
  const isCurrentUserAdmin = members.some(
    (member) => member.user_id === currentUserId && member.role === "admin"
  );
  
  // Check if there are multiple admins
  const adminCount = members.filter(member => member.role === "admin").length;

  const updateMemberRole = async (memberId: string, newRole: Role) => {
    // Validate the role change using our utility
    const validationResult = validateRoleChange(
      members, 
      currentUserId, 
      memberId, 
      newRole as GroupRole
    );
    
    if (!validationResult.valid) {
      toast({
        title: "Action not allowed",
        description: validationResult.message,
        variant: "destructive",
      });
      return;
    }
    
    setIsUpdating((prev) => ({ ...prev, [memberId]: true }));
    
    try {
      const { error } = await supabase
        .from("group_members")
        .update({ role: newRole })
        .eq("group_id", groupId)
        .eq("user_id", memberId);
      
      if (error) throw error;
      
      toast({
        title: "Role updated",
        description: `Member role successfully updated to ${getRoleLabel(newRole as GroupRole)}.`,
      });
      
      if (onMemberUpdated) {
        onMemberUpdated();
      }
    } catch (error) {
      console.error("Error updating member role:", error);
      toast({
        title: "Failed to update role",
        description: "An error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUpdating((prev) => ({ ...prev, [memberId]: false }));
    }
  };
  
  const getRoleIcon = (role: string) => {
    switch (role) {
      case "admin":
        return <Crown className="h-4 w-4 text-amber-400" />;
      case "moderator":
        return <Shield className="h-4 w-4 text-cybergold-400" />;
      case "premium":
        return <Star className="h-4 w-4 text-purple-400" />;
      default:
        return <User className="h-4 w-4 text-gray-400" />;
    }
  };
  
  const getRoleName = (role: string) => getRoleLabel(role as GroupRole);
  
  // Using imported getRoleDescription from utils

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-cyberdark-900 border-cybergold-500/30 text-cybergold-200 sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Shield className="mr-2 h-5 w-5 text-cybergold-400" />
            Manage Member Roles
          </DialogTitle>
          <DialogDescription className="text-cybergold-500/70">
            Assign different roles to members to control their permissions in the group
          </DialogDescription>
        </DialogHeader>
        
        <div className="relative mb-4">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-cybergold-500/70" />
          <Input
            placeholder="Search members..."
            className="pl-8 bg-cyberdark-800 border-cybergold-500/30 text-cybergold-300 placeholder:text-cybergold-500/50"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className="space-y-3 overflow-y-auto max-h-[60vh]">
          {filteredMembers.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-4 text-cybergold-500">
              <XCircle className="h-8 w-8 mb-2" />
              <p>No members found</p>
            </div>
          ) : (
            filteredMembers.map((member) => {
              const profile = userProfiles[member.user_id] || {};
              const isCurrentUser = member.user_id === currentUserId;
              const isCreator = member.user_id === members.find(m => m.user_id === currentUserId)?.group_id;
              
              return (
                <div
                  key={member.user_id}
                  className="flex items-center justify-between p-3 rounded-md bg-cyberdark-800/50 border border-cyberdark-700"
                >
                  <div className="flex items-center gap-3">
                    <UserAvatar
                      src={profile.avatar_url}
                      alt={profile.username || "User"}
                      size={40}
                    />
                    <div>
                      <div className="text-sm font-medium text-cybergold-300 flex items-center gap-2">
                        {profile.username || "Unknown User"}
                        {isCurrentUser && (
                          <Badge variant="outline" className="text-xs">You</Badge>
                        )}
                        {isCreator && (
                          <Badge className="bg-amber-950/60 text-amber-400 border-amber-500/30 text-xs">
                            Creator
                          </Badge>
                        )}
                      </div>
                      <div className="text-xs text-cybergold-500 flex items-center gap-1">
                        {getRoleIcon(member.role)}
                        <span>{getRoleName(member.role)}</span>
                      </div>
                    </div>
                  </div>
                  
                  {isCurrentUserAdmin && (!isCreator || isCurrentUser) && (
                    <Select
                      defaultValue={member.role}
                      onValueChange={(value) => updateMemberRole(member.user_id, value as Role)}
                      disabled={isUpdating[member.user_id] || (isCurrentUser && adminCount < 2)}
                    >
                      <SelectTrigger className="w-32 h-8 bg-cyberdark-900/70 border-cybergold-500/30">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-cyberdark-900 border-cybergold-500/30">
                        <SelectItem value="admin" className="flex items-center gap-2">
                          <span className="flex items-center gap-1">
                            <Crown className="h-3.5 w-3.5 text-amber-400" />
                            Admin
                          </span>
                        </SelectItem>
                        <SelectItem value="moderator" className="flex items-center gap-2">
                          <span className="flex items-center gap-1">
                            <Shield className="h-3.5 w-3.5 text-cybergold-400" />
                            Moderator
                          </span>
                        </SelectItem>
                        <SelectItem value="premium" className="flex items-center gap-2">
                          <span className="flex items-center gap-1">
                            <Star className="h-3.5 w-3.5 text-purple-400" />
                            Premium
                          </span>
                        </SelectItem>
                        <SelectItem value="member" className="flex items-center gap-2">
                          <span className="flex items-center gap-1">
                            <User className="h-3.5 w-3.5 text-gray-400" />
                            Member
                          </span>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                </div>
              );
            })
          )}
        </div>
        
        <div className="mt-2 flex items-start gap-2 p-2 rounded-md bg-cyberdark-800/30 border border-cybergold-500/20">
          <Info className="h-5 w-5 text-cybergold-400 flex-shrink-0 mt-0.5" />
          <div className="text-xs text-cybergold-400/80">
            <p className="font-medium mb-1">Role permissions:</p>
            <ul className="space-y-1">
              <li className="flex items-center gap-1">
                <Crown className="h-3 w-3 text-amber-400" />
                <span>Admins: {getRoleDescription('admin' as GroupRole)}</span>
              </li>
              <li className="flex items-center gap-1">
                <Shield className="h-3 w-3 text-cybergold-400" />
                <span>Moderators: {getRoleDescription('moderator' as GroupRole)}</span>
              </li>
              <li className="flex items-center gap-1">
                <Star className="h-3 w-3 text-purple-400" />
                <span>Premium: {getRoleDescription('premium' as GroupRole)}</span>
              </li>
              <li className="flex items-center gap-1">
                <Users className="h-3 w-3 text-gray-400" />
                <span>Members: {getRoleDescription('member' as GroupRole)}</span>
              </li>
            </ul>
          </div>
        </div>
        
        <DialogFooter>
          <Button
            variant="ghost"
            onClick={onClose}
            className="bg-cyberdark-800 text-cybergold-300 border-cybergold-500/30 hover:bg-cyberdark-700"
          >
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
