import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, ShieldCheck, UserCircle, Users } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { nb } from 'date-fns/locale';
import { useFriendships } from '../../hooks/useFriendships';
import { useGroups } from '../../hooks/useGroups';
import { useMessages } from '../../hooks/useMessages';

// Type for combined conversations (direct messages and groups)
type ConversationItem = {
  id: string;
  type: 'direct' | 'group';
  name: string;
  avatarUrl?: string;
  lastMessage?: {
    content: string;
    timestamp: Date;
    read: boolean;
  };
  unreadCount: number;
  securityLevel: 'standard' | 'high' | 'maximum';
};

const ChatList = () => {
  const navigate = useNavigate();
  const { friends, isLoading: loadingFriends } = useFriendships();
  const { groups, loading: loadingGroups } = useGroups();
  const { messages } = useMessages(null); // Get the messages from the hook

  const [conversations, setConversations] = useState<ConversationItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Mock function for getLatestMessages since it's not available in useMessages
  const getLatestMessages = async (friendId: string, limit: number) => {
    // Filter messages for this friend
    const friendMessages = messages.filter(msg => 
      msg.sender.id === friendId || msg.receiver_id === friendId
    ).slice(0, limit);
    
    return friendMessages.map(msg => ({
      id: msg.id,
      content: msg.content,
      encryptedContent: msg.is_encrypted ? msg.content : undefined,
      createdAt: msg.created_at,
      read: true // Assume all messages are read
    }));
  };

  useEffect(() => {
    const loadConversations = async () => {
      if (loadingFriends || loadingGroups) return;
      
      try {
        // Process direct messages/friends
        const directConversations = await Promise.all((friends || []).map(async friend => {
          const messages = await getLatestMessages(friend.id, 1);
          const lastMsg = messages.length > 0 ? messages[0] : null;
          
          return {
            id: friend.id,
            type: 'direct' as const,
            name: friend.profile?.username || 'Unknown user',
            avatarUrl: friend.profile?.avatar_url,
            lastMessage: lastMsg ? {
              content: lastMsg.encryptedContent ? '🔒 Kryptert melding' : lastMsg.content,
              timestamp: new Date(lastMsg.createdAt),
              read: lastMsg.read || false
            } : undefined,
            unreadCount: Math.floor(Math.random() * 5), // Placeholder - replace with actual count
            securityLevel: 'standard' // Default to standard security level
          };
        }));
        
        // Process groups
        const groupConversations = (groups || []).map(group => {
          // Safely convert Group securityLevel to ConversationItem securityLevel
          let securityLevel: 'standard' | 'high' | 'maximum' = 'standard';
          if (group.security_level === 'high' || group.security_level === 'maximum') {
            securityLevel = group.security_level;
          }
          
          return {
            id: group.id,
            type: 'group' as const,
            name: group.name,
            avatarUrl: group.avatar_url,
            lastMessage: undefined, // Groups don't have lastMessage property, so we set to undefined
            unreadCount: group.unreadCount || 0,
            securityLevel
          };
        });
        
        // Combine and sort by latest message
        const allConversations = [...directConversations, ...groupConversations]
          .sort((a, b) => {
            if (!a.lastMessage && !b.lastMessage) return 0;
            if (!a.lastMessage) return 1;
            if (!b.lastMessage) return -1;
            return b.lastMessage.timestamp.getTime() - a.lastMessage.timestamp.getTime();
          });
          
        setConversations(allConversations);
      } catch (error) {
        console.error('Error loading conversations:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadConversations();
  }, [friends, groups, loadingFriends, loadingGroups]);

  const handleConversationClick = (conversation: ConversationItem) => {
    if (conversation.type === 'direct') {
      navigate(`/chat/${conversation.id}`);
    } else {
      navigate(`/groups/${conversation.id}`);
    }
  };

  const getSecurityIcon = (level: string) => {
    switch (level) {
      case 'maximum':
        return <ShieldCheck className="text-green-500" size={16} />;
      case 'high':
        return <Shield className="text-blue-500" size={16} />;
      default:
        return null;
    }
  };

  if (isLoading) {
    return <div className="flex justify-center items-center h-full p-4">Laster samtaler...</div>;
  }

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b">
        <h1 className="text-xl font-bold">Samtaler</h1>
      </div>
      
      <div className="overflow-y-auto flex-1">
        {conversations.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full p-6 text-center">
            <p className="text-muted-foreground mb-4">Ingen samtaler ennå</p>
            <button 
              onClick={() => navigate('/contacts')}
              className="px-4 py-2 bg-cybergold-800 text-cybergold-100 rounded-md hover:bg-cybergold-700 transition-colors"
            >
              Start en ny samtale
            </button>
          </div>
        ) : (
          conversations.map(conversation => (
            <div 
              key={`${conversation.type}-${conversation.id}`}
              onClick={() => handleConversationClick(conversation)}
              className="flex items-center p-4 border-b hover:bg-muted/30 transition-colors cursor-pointer"
            >
              {conversation.avatarUrl ? (
                <img 
                  src={conversation.avatarUrl} 
                  alt={conversation.name} 
                  className="w-12 h-12 rounded-full object-cover"
                />
              ) : (
                conversation.type === 'direct' ? (
                  <UserCircle className="w-12 h-12 text-muted-foreground" />
                ) : (
                  <Users className="w-12 h-12 text-muted-foreground" />
                )
              )}
              
              <div className="ml-3 flex-1 overflow-hidden">
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <h3 className="font-medium truncate">{conversation.name}</h3>
                    {getSecurityIcon(conversation.securityLevel)}
                  </div>
                  {conversation.lastMessage && (
                    <span className="text-xs text-muted-foreground">
                      {formatDistanceToNow(conversation.lastMessage.timestamp, { addSuffix: true, locale: nb })}
                    </span>
                  )}
                </div>
                
                <div className="flex justify-between items-center mt-1">
                  {conversation.lastMessage ? (
                    <p className="text-sm text-muted-foreground truncate max-w-[70%]">
                      {conversation.lastMessage.content}
                    </p>
                  ) : (
                    <p className="text-sm text-muted-foreground italic">Ingen meldinger</p>
                  )}
                  
                  {conversation.unreadCount > 0 && (
                    <div className="bg-cybergold-600 text-white text-xs rounded-full min-w-[20px] h-5 flex items-center justify-center px-1">
                      {conversation.unreadCount}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ChatList;