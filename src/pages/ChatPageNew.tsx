import React, { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { UnifiedLayout } from '@/components/layout/UnifiedLayout';
import { 
  MessageCircle, 
  Search, 
  Plus, 
  Pin,
  Archive,
  MoreVertical,
  Phone,
  Video
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ChatPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  const chats = [
    { 
      name: 'Team Norge', 
      lastMsg: 'Møte i morgen kl 10', 
      time: '14:32', 
      unread: 3, 
      pinned: true, 
      isGroup: true,
      avatar: 'TN',
      online: false 
    },
    { 
      name: 'Lisa Hansen', 
      lastMsg: 'Takk for hjelpen! 🙏', 
      time: '13:45', 
      unread: 1, 
      pinned: false, 
      isGroup: false,
      avatar: 'LH',
      online: true 
    },
    { 
      name: 'Utvikler Chat', 
      lastMsg: 'Ny versjon er klar', 
      time: '12:15', 
      unread: 0, 
      pinned: false, 
      isGroup: true,
      avatar: 'UC',
      online: false 
    },
    { 
      name: 'Familie', 
      lastMsg: 'Middag på søndag?', 
      time: '11:30', 
      unread: 5, 
      pinned: true, 
      isGroup: true,
      avatar: 'FA',
      online: false 
    },
    { 
      name: 'Erik Johansen', 
      lastMsg: 'Ser deg i morgen', 
      time: '10:15', 
      unread: 0, 
      pinned: false, 
      isGroup: false,
      avatar: 'EJ',
      online: false 
    },
    { 
      name: 'Maria Silva', 
      lastMsg: 'Bra jobba! 👏', 
      time: '09:30', 
      unread: 2, 
      pinned: false, 
      isGroup: false,
      avatar: 'MS',
      online: true 
    },
  ];

  const filteredChats = chats.filter(chat =>
    chat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    chat.lastMsg.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getAvatarColor = (isGroup: boolean, name: string) => {
    if (isGroup) return 'bg-cyberblue-500';
    // Generate color based on name
    const colors = ['bg-cybergold-500', 'bg-cybergreen-500', 'bg-cyberred-500', 'bg-cyberblue-500'];
    return colors[name.length % colors.length];
  };

  return (
    <UnifiedLayout 
      title="Chats"
      subtitle="Dine samtaler"
      headerActions={{
        onCall: () => navigate('/calls'),
        onVideoCall: () => navigate('/video-calls'),
        onOptions: () => navigate('/chat/settings')
      }}
    >
      <div className="px-4 py-4">
        <div className="max-w-sm mx-auto space-y-4">
          
          {/* Search bar */}
          <div className="relative">
            <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-cyberdark-400" />
            <input
              type="text"
              placeholder="Søk i chats..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-cyberdark-800 border border-cyberdark-700 rounded-lg pl-10 pr-4 py-3 text-white placeholder-cyberdark-400 focus:outline-none focus:ring-2 focus:ring-cybergold-500"
            />
          </div>

          {/* Quick actions */}
          <div className="flex space-x-3">
            <button
              onClick={() => navigate('/chat/new')}
              className="flex-1 bg-cybergold-500/10 border border-cybergold-500/30 rounded-lg p-3 flex items-center justify-center space-x-2 text-cybergold-400 active:bg-cybergold-500/20 transition-colors"
            >
              <Plus size={18} />
              <span className="text-sm font-medium">Ny Chat</span>
            </button>
            
            <button
              onClick={() => navigate('/groups/create')}
              className="flex-1 bg-cyberblue-500/10 border border-cyberblue-500/30 rounded-lg p-3 flex items-center justify-center space-x-2 text-cyberblue-400 active:bg-cyberblue-500/20 transition-colors"
            >
              <MessageCircle size={18} />
              <span className="text-sm font-medium">Ny Gruppe</span>
            </button>
          </div>

          {/* Chat stats */}
          <div className="bg-cyberdark-800 rounded-lg p-4 border border-cyberdark-700">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-lg font-bold text-cybergold-400">{chats.length}</div>
                <div className="text-xs text-cyberdark-300">Totale chats</div>
              </div>
              <div>
                <div className="text-lg font-bold text-cybergreen-400">
                  {chats.reduce((sum, chat) => sum + chat.unread, 0)}
                </div>
                <div className="text-xs text-cyberdark-300">Uleste</div>
              </div>
              <div>
                <div className="text-lg font-bold text-cyberblue-400">
                  {chats.filter(chat => chat.online).length}
                </div>
                <div className="text-xs text-cyberdark-300">Online</div>
              </div>
            </div>
          </div>

          {/* Pinned chats */}
          {chats.some(chat => chat.pinned) && (
            <div className="space-y-2">
              <h3 className="text-sm font-semibold text-cybergold-400 flex items-center space-x-2">
                <Pin size={16} />
                <span>Festede chats</span>
              </h3>
              
              {filteredChats.filter(chat => chat.pinned).map((chat, index) => (
                <div
                  key={`pinned-${index}`}
                  className="bg-cybergold-500/10 border border-cybergold-500/20 rounded-lg p-4 active:bg-cybergold-500/20 transition-colors"
                  onClick={() => navigate(`/chat/${chat.name.toLowerCase().replace(/\s+/g, '-')}`)}
                >
                  <div className="flex items-center space-x-3">
                    <div className="relative">
                      <div className={`w-12 h-12 ${getAvatarColor(chat.isGroup, chat.name)} rounded-full flex items-center justify-center text-white font-bold`}>
                        {chat.avatar}
                      </div>
                      {chat.online && (
                        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-cybergreen-500 border-2 border-cyberdark-800 rounded-full" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2">
                        <h3 className="font-medium text-white truncate">{chat.name}</h3>
                        <Pin size={12} className="text-cybergold-400" />
                      </div>
                      <p className="text-sm text-cyberdark-300 truncate">{chat.lastMsg}</p>
                    </div>
                    <div className="flex flex-col items-end space-y-1">
                      <span className="text-xs text-cyberdark-400">{chat.time}</span>
                      {chat.unread > 0 && (
                        <div className="bg-cybergold-500 text-cyberdark-900 text-xs rounded-full min-w-[20px] h-5 flex items-center justify-center font-medium">
                          {chat.unread}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* All chats */}
          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-white flex items-center space-x-2">
              <MessageCircle size={16} />
              <span>Alle chats</span>
            </h3>
            
            {filteredChats.filter(chat => !chat.pinned).map((chat, index) => (
              <div
                key={index}
                className="bg-cyberdark-800 rounded-lg p-4 border border-cyberdark-700 active:bg-cyberdark-700 transition-colors"
                onClick={() => navigate(`/chat/${chat.name.toLowerCase().replace(/\s+/g, '-')}`)}
              >
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <div className={`w-12 h-12 ${getAvatarColor(chat.isGroup, chat.name)} rounded-full flex items-center justify-center text-white font-bold`}>
                      {chat.avatar}
                    </div>
                    {chat.online && (
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-cybergreen-500 border-2 border-cyberdark-800 rounded-full" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-white truncate">{chat.name}</h3>
                    <p className="text-sm text-cyberdark-300 truncate">{chat.lastMsg}</p>
                  </div>
                  <div className="flex flex-col items-end space-y-1">
                    <span className="text-xs text-cyberdark-400">{chat.time}</span>
                    {chat.unread > 0 && (
                      <div className="bg-cybergold-500 text-cyberdark-900 text-xs rounded-full min-w-[20px] h-5 flex items-center justify-center font-medium">
                        {chat.unread}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Empty state */}
          {filteredChats.length === 0 && (
            <div className="text-center py-8">
              <MessageCircle size={48} className="text-cyberdark-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">Ingen chats funnet</h3>
              <p className="text-cyberdark-400 text-sm mb-4">
                {searchQuery ? 'Prøv et annet søk' : 'Start din første samtale'}
              </p>
              <button
                onClick={() => navigate('/chat/new')}
                className="bg-cybergold-500 text-cyberdark-900 px-6 py-2 rounded-lg font-medium active:scale-95 transition-transform"
              >
                Start ny chat
              </button>
            </div>
          )}
        </div>
      </div>
    </UnifiedLayout>
  );
};

export default ChatPage;
