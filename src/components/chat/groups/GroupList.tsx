
import React from "react";
import { Group } from "@/types/groups";
import { Shield, Lock, Users, Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { UnreadBadge } from "../UnreadBadge";
import { getInitials } from "@/utils/user";

interface GroupListProps {
  groups: Group[];
  groupConversations: Record<string, any[]>;
  currentUserId: string;
  userProfiles?: Record<string, any>;
  searchQuery?: string;
  onSelectGroup?: (group: Group) => void;
  onJoinGroup?: (groupId: string) => Promise<boolean>;
  onJoinProtectedGroup?: (group: Group) => void;
}

export function GroupList({
  groups,
  groupConversations,
  currentUserId,
  userProfiles = {},
  searchQuery = "",
  onSelectGroup,
  onJoinGroup,
  onJoinProtectedGroup
}: GroupListProps) {
  // Filter groups based on search query
  const filteredGroups = groups.filter(group => 
    group.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  if (filteredGroups.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-center">
        <div className="w-12 h-12 bg-cyberdark-800 rounded-full flex items-center justify-center mb-3">
          <Users className="h-6 w-6 text-cybergold-500/70" />
        </div>
        <h4 className="text-sm font-medium text-cybergold-400 mb-1">Ingen grupper funnet</h4>
        <p className="text-xs text-cybergold-600 max-w-[250px]">
          {searchQuery ? `Ingen grupper matcher "${searchQuery}"` : "Du har ikke tilgang til noen grupper ennå"}
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-2">
      {filteredGroups.map(group => {
        const isCreator = group.creator_id === currentUserId;
        const isMember = !!group.members?.some(m => m.user_id === currentUserId);
        const hasPassword = !!group.password;
        const unreadMessages = groupConversations[group.id]?.length || 0;
        
        return (
          <div 
            key={group.id}
            className={cn(
              "flex items-center p-2 rounded-lg",
              isMember ? "hover:bg-cybergold-900/10 cursor-pointer" : "opacity-80"
            )}
            onClick={() => {
              if (isMember && onSelectGroup) {
                onSelectGroup(group);
              } else if (!isMember && hasPassword && onJoinProtectedGroup) {
                onJoinProtectedGroup(group);
              } else if (!isMember && onJoinGroup) {
                onJoinGroup(group.id);
              }
            }}
          >
            <Avatar className="h-10 w-10 mr-3 border border-cybergold-800/30">
              {group.avatar_url ? (
                <AvatarImage src={group.avatar_url} alt={group.name} />
              ) : (
                <AvatarFallback className="bg-cyberdark-700/70 text-cybergold-400">
                  {getInitials(group.name)}
                </AvatarFallback>
              )}
            </Avatar>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center">
                <span className="text-sm font-medium text-cybergold-300 truncate">{group.name}</span>
                {group.is_premium && (
                  <Badge variant="outline" className="ml-2 py-0 h-4 bg-cybergold-900/30 border-cybergold-700/50">
                    <Star className="h-2.5 w-2.5 mr-0.5 text-cybergold-500" />
                    <span className="text-[10px] text-cybergold-500">Premium</span>
                  </Badge>
                )}
              </div>
              
              <div className="flex items-center text-xs text-cybergold-500">
                <Users className="h-3 w-3 mr-1" />
                <span>{group.members?.length || 0} medlemmer</span>
                
                {hasPassword && (
                  <div className="flex items-center ml-2">
                    <Lock className="h-3 w-3 mr-1 text-cybergold-600" />
                    <span className="text-cybergold-600">Beskyttet</span>
                  </div>
                )}
              </div>
            </div>
            
            {unreadMessages > 0 && isMember && (
              <UnreadBadge count={unreadMessages} variant="primary" size="sm" className="ml-2" />
            )}
            
            {!isMember && (
              <Button 
                variant="ghost" 
                size="sm" 
                className="ml-2 h-7 text-xs bg-cybergold-900/20 hover:bg-cybergold-900/30 text-cybergold-400"
              >
                {hasPassword ? "Bli med (krever passord)" : "Bli med"}
              </Button>
            )}
          </div>
        );
      })}
    </div>
  );
}
