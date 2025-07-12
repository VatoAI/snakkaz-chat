import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import { UnifiedLayout } from '@/components/layout/UnifiedLayout';
import { Users, UserPlus, Search, MessageCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const FriendsPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const friends = [
    { name: 'Lisa Hansen', status: 'Online', lastSeen: 'Nå', mutual: 3, avatar: 'LH' },
    { name: 'Erik Johansen', status: 'Offline', lastSeen: '2t siden', mutual: 8, avatar: 'EJ' },
    { name: 'Maria Silva', status: 'Online', lastSeen: 'Nå', mutual: 1, avatar: 'MS' },
    { name: 'Thomas Berg', status: 'Away', lastSeen: '30 min siden', mutual: 12, avatar: 'TB' },
    { name: 'Anna Nordahl', status: 'Online', lastSeen: 'Nå', mutual: 5, avatar: 'AN' },
    { name: 'John Smith', status: 'Offline', lastSeen: '1 dag siden', mutual: 2, avatar: 'JS' },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Online': return 'bg-cybergreen-500';
      case 'Away': return 'bg-cybergold-500';
      case 'Offline': return 'bg-cyberdark-500';
      default: return 'bg-cyberdark-500';
    }
  };

  return (
    <UnifiedLayout 
      title="Venner"
      subtitle="Dine kontakter og venner"
    >
      <div className="px-4 py-4">
        <div className="max-w-sm mx-auto space-y-4">
          
          {/* Search bar */}
          <div className="relative">
            <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-cyberdark-400" />
            <input
              type="text"
              placeholder="Søk etter venner..."
              className="w-full bg-cyberdark-800 border border-cyberdark-700 rounded-lg pl-10 pr-4 py-3 text-white placeholder-cyberdark-400 focus:outline-none focus:ring-2 focus:ring-cybergold-500"
            />
          </div>

          {/* Quick actions */}
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => navigate('/find-friends')}
              className="bg-cybergold-500/10 border border-cybergold-500/30 rounded-lg p-3 flex items-center space-x-2 text-cybergold-400 active:bg-cybergold-500/20 transition-colors"
            >
              <UserPlus size={18} />
              <span className="text-sm font-medium">Finn Venner</span>
            </button>
            
            <button
              onClick={() => navigate('/groups')}
              className="bg-cyberblue-500/10 border border-cyberblue-500/30 rounded-lg p-3 flex items-center space-x-2 text-cyberblue-400 active:bg-cyberblue-500/20 transition-colors"
            >
              <Users size={18} />
              <span className="text-sm font-medium">Grupper</span>
            </button>
          </div>

          {/* Friends stats */}
          <div className="bg-cyberdark-800 rounded-lg p-4 border border-cyberdark-700">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-xl font-bold text-cybergold-400">{friends.length}</div>
                <div className="text-xs text-cyberdark-300">Totalt</div>
              </div>
              <div>
                <div className="text-xl font-bold text-cybergreen-400">
                  {friends.filter(f => f.status === 'Online').length}
                </div>
                <div className="text-xs text-cyberdark-300">Online</div>
              </div>
              <div>
                <div className="text-xl font-bold text-cyberblue-400">
                  {friends.reduce((sum, f) => sum + f.mutual, 0)}
                </div>
                <div className="text-xs text-cyberdark-300">Felles</div>
              </div>
            </div>
          </div>

          {/* Friends list */}
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-white flex items-center space-x-2">
              <Users size={20} />
              <span>Mine Venner</span>
            </h3>
            
            {friends.map((friend, index) => (
              <div
                key={index}
                className="bg-cyberdark-800 rounded-lg p-4 border border-cyberdark-700 active:bg-cyberdark-700 transition-colors"
                onClick={() => navigate(`/chat/${friend.name.toLowerCase().replace(' ', '-')}`)}
              >
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <div className="w-12 h-12 bg-cybergold-500 rounded-full flex items-center justify-center text-cyberdark-900 font-bold">
                      {friend.avatar}
                    </div>
                    <div className={`absolute -bottom-1 -right-1 w-4 h-4 ${getStatusColor(friend.status)} border-2 border-cyberdark-800 rounded-full`} />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-white truncate">{friend.name}</h4>
                    <div className="flex items-center space-x-2 text-sm">
                      <span className={
                        friend.status === 'Online' ? 'text-cybergreen-400' :
                        friend.status === 'Away' ? 'text-cybergold-400' :
                        'text-cyberdark-400'
                      }>
                        {friend.status}
                      </span>
                      <span className="text-cyberdark-400">•</span>
                      <span className="text-cyberdark-400">{friend.lastSeen}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <div className="text-xs text-cybergold-400 bg-cybergold-500/10 px-2 py-1 rounded">
                      {friend.mutual} felles
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/chat/${friend.name.toLowerCase().replace(' ', '-')}`);
                      }}
                      className="p-2 text-cybergold-400 hover:bg-cybergold-500/10 rounded-lg transition-colors"
                    >
                      <MessageCircle size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Recently added */}
          <div className="bg-cyberdark-900 rounded-lg p-4 border border-cyberdark-700">
            <h4 className="font-semibold text-white mb-3">🆕 Nylig lagt til</h4>
            <div className="space-y-2">
              {friends.slice(0, 2).map((friend, index) => (
                <div key={index} className="flex items-center space-x-3 py-2">
                  <div className="w-8 h-8 bg-cybergreen-500 rounded-full flex items-center justify-center text-cyberdark-900 text-xs font-bold">
                    {friend.avatar}
                  </div>
                  <div className="flex-1">
                    <div className="text-sm text-white">{friend.name}</div>
                    <div className="text-xs text-cyberdark-400">Lagt til i dag</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </UnifiedLayout>
  );
};

export default FriendsPage;
