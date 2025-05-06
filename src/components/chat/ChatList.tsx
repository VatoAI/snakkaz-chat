
import React from 'react';
import { Shield, Lock, Users } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Group } from '@/types/group';
import { SecurityLevel } from '@/types/security';

interface ChatItemProps {
  id: string;
  name: string;
  avatar?: string;
  isActive: boolean;
  onClick: () => void;
  unreadCount?: number;
  securityLevel?: SecurityLevel;
  lastMessage?: string;
  lastMessageTime?: string;
  isGroup?: boolean;
}

const ChatItem: React.FC<ChatItemProps> = ({
  name,
  avatar,
  isActive,
  onClick,
  unreadCount = 0,
  securityLevel,
  lastMessage,
  lastMessageTime,
  isGroup
}) => {
  // Security icon based on level
  const getSecurityIcon = () => {
    if (securityLevel === 'p2p_e2ee') {
      return <Lock className="w-3 h-3 text-green-500" />;
    }
    if (securityLevel === 'server_e2ee') {
      return <Shield className="w-3 h-3 text-cybergold-400" />;
    }
    return null;
  };
  
  return (
    <div
      className={cn(
        "flex items-center p-2 rounded-lg cursor-pointer hover:bg-cyberdark-800/50 transition-colors",
        isActive ? "bg-cyberdark-800" : ""
      )}
      onClick={onClick}
    >
      {/* Avatar */}
      <div className="relative w-10 h-10 rounded-full overflow-hidden bg-cyberdark-800 mr-3">
        {avatar ? (
          <img src={avatar} alt={name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-cybergold-500">
            {isGroup ? <Users className="w-5 h-5" /> : name.charAt(0).toUpperCase()}
          </div>
        )}
      </div>
      
      {/* Content */}
      <div className="flex-1 min-w-0">
        {/* Name and security level */}
        <div className="flex items-center">
          <h3 className="text-sm font-medium text-gray-200 truncate">{name}</h3>
          {getSecurityIcon() && <span className="ml-1">{getSecurityIcon()}</span>}
        </div>
        
        {/* Last message */}
        {lastMessage && (
          <p className="text-xs text-gray-400 truncate">{lastMessage}</p>
        )}
      </div>
      
      {/* Right side - time and unread count */}
      <div className="flex flex-col items-end ml-2">
        {lastMessageTime && (
          <span className="text-xs text-gray-500">{lastMessageTime}</span>
        )}
        
        {unreadCount > 0 && (
          <span className="mt-1 px-1.5 py-0.5 text-xs rounded-full bg-cybergold-600 text-white min-w-5 text-center">
            {unreadCount}
          </span>
        )}
      </div>
    </div>
  );
};

interface ChatListProps {
  groups: Group[];
  activeGroupId?: string;
  onSelectGroup: (groupId: string) => void;
  conversations?: Record<string, any>[];
  activeConversationId?: string;
  onSelectConversation?: (conversationId: string) => void;
  userProfiles?: Record<string, any>;
  className?: string;
}

export const ChatList: React.FC<ChatListProps> = ({
  groups,
  activeGroupId,
  onSelectGroup,
  conversations = [],
  activeConversationId,
  onSelectConversation,
  userProfiles = {},
  className = ""
}) => {
  // Helper to get security icon description
  const getSecurityDescription = (level: SecurityLevel | undefined) => {
    if (level === 'p2p_e2ee') {
      return 'Maximum security';
    } 
    if (level === 'server_e2ee') {
      return 'High security';
    }
    return 'Standard security';
  };
  
  return (
    <div className={cn("space-y-1", className)}>
      {/* Group section */}
      {groups.length > 0 && (
        <div>
          <h2 className="px-2 mb-1 text-xs uppercase font-semibold text-gray-500">Grupper</h2>
          <div className="space-y-0.5">
            {groups.map(group => (
              <ChatItem
                key={group.id}
                id={group.id}
                name={group.name}
                avatar={group.avatar_url}
                isActive={group.id === activeGroupId}
                onClick={() => onSelectGroup(group.id)}
                unreadCount={0} // Replace with actual unread count logic
                securityLevel={group.security_level}
                lastMessage={getSecurityDescription(group.security_level)}
                isGroup={true}
              />
            ))}
          </div>
        </div>
      )}
      
      {/* Conversations section */}
      {conversations.length > 0 && (
        <div>
          <h2 className="px-2 mb-1 text-xs uppercase font-semibold text-gray-500">Samtaler</h2>
          <div className="space-y-0.5">
            {conversations.map(conversation => {
              const profile = userProfiles[conversation.id] || { username: 'Unknown', avatar_url: null };
              return (
                <ChatItem
                  key={conversation.id}
                  id={conversation.id}
                  name={profile.username}
                  avatar={profile.avatar_url}
                  isActive={conversation.id === activeConversationId}
                  onClick={() => onSelectConversation?.(conversation.id)}
                  unreadCount={conversation.unreadCount || 0}
                  lastMessage={conversation.lastMessage?.content}
                  lastMessageTime={conversation.lastMessage ? new Date(conversation.lastMessage.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : undefined}
                  isGroup={false}
                />
              );
            })}
          </div>
        </div>
      )}
      
      {/* Empty state */}
      {groups.length === 0 && conversations.length === 0 && (
        <div className="p-4 text-center">
          <p className="text-sm text-gray-400">Ingen samtaler eller grupper</p>
        </div>
      )}
    </div>
  );
};
