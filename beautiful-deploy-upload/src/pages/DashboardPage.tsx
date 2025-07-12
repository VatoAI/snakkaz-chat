import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { UnifiedLayout } from '@/components/layout/UnifiedLayout';
import { 
  MessageSquare, 
  Users, 
  Bot, 
  UserPlus,
  TrendingUp,
  Clock,
  ChevronRight,
  Settings,
  Mail
} from 'lucide-react';

const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [timeOfDay, setTimeOfDay] = useState('');

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setTimeOfDay('God morgen');
    else if (hour < 18) setTimeOfDay('God dag');
    else setTimeOfDay('God kveld');
  }, []);

  const quickActions = [
    {
      title: 'Start Chat',
      description: 'Begynn en ny samtale',
      icon: <MessageSquare className="h-5 w-5" />,
      action: () => navigate('/chat'),
      color: 'bg-cybergold-500/10 text-cybergold-400 border-cybergold-500/20'
    },
    {
      title: 'Finn Venner',
      description: 'Utvid nettverket ditt',
      icon: <UserPlus className="h-5 w-5" />,
      action: () => navigate('/find-friends'),
      color: 'bg-cybergreen-500/10 text-cybergreen-400 border-cybergreen-500/20'
    },
    {
      title: 'Grupper',
      description: 'Bli med i grupper',
      icon: <Users className="h-5 w-5" />,
      action: () => navigate('/groups'),
      color: 'bg-cyberblue-500/10 text-cyberblue-400 border-cyberblue-500/20'
    },
    {
      title: 'AI Assistent',
      description: 'Chat med AI',
      icon: <Bot className="h-5 w-5" />,
      action: () => navigate('/ai-assistant'),
      color: 'bg-cyberred-500/10 text-cyberred-400 border-cyberred-500/20'
    }
  ];

  return (
    <UnifiedLayout 
      title="Dashboard"
      subtitle="Din sikre kommunikasjonsplattform"
    >
      <div className="px-4 py-4">
        <div className="max-w-sm mx-auto space-y-6">
          {/* Welcome Header */}
          <div className="bg-gradient-to-r from-cybergold-600/20 to-cybergold-400/20 border border-cybergold-500/30 rounded-xl p-4">
            <h1 className="text-xl font-bold text-cybergold-400">
              {timeOfDay}, {user?.user_metadata?.username || 'Bruker'}!
            </h1>
            <p className="text-cybergold-300 mt-1 text-sm">
              Velkommen til SnakkaZ Chat
            </p>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            <div className="bg-gradient-to-r from-cybergold-500/20 to-cybergold-600/20 rounded-lg p-3 border border-cybergold-500/30">
              <div className="flex items-center space-x-2">
                <MessageSquare size={18} className="text-cybergold-400" />
                <div>
                  <div className="text-lg font-bold text-cybergold-400">24</div>
                  <div className="text-xs text-cyberdark-300">Chats</div>
                </div>
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-cyberblue-500/20 to-cyberblue-600/20 rounded-lg p-3 border border-cyberblue-500/30">
              <div className="flex items-center space-x-2">
                <Users size={18} className="text-cyberblue-400" />
                <div>
                  <div className="text-lg font-bold text-cyberblue-400">8</div>
                  <div className="text-xs text-cyberdark-300">Grupper</div>
                </div>
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-cybergreen-500/20 to-cybergreen-600/20 rounded-lg p-3 border border-cybergreen-500/30">
              <div className="flex items-center space-x-2">
                <TrendingUp size={18} className="text-cybergreen-400" />
                <div>
                  <div className="text-lg font-bold text-cybergreen-400">156</div>
                  <div className="text-xs text-cyberdark-300">Venner</div>
                </div>
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-cyberred-500/20 to-cyberred-600/20 rounded-lg p-3 border border-cyberred-500/30">
              <div className="flex items-center space-x-2">
                <Clock size={18} className="text-cyberred-400" />
                <div>
                  <div className="text-lg font-bold text-cyberred-400">12</div>
                  <div className="text-xs text-cyberdark-300">Uleste</div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-white">⚡ Quick Actions</h3>
            
            {quickActions.map((action, index) => (
              <button
                key={index}
                onClick={action.action}
                className={`w-full p-4 rounded-lg border transition-all duration-200 active:scale-95 ${action.color}`}
              >
                <div className="flex items-center space-x-3">
                  {action.icon}
                  <div className="text-left">
                    <h4 className="font-medium">{action.title}</h4>
                    <p className="text-sm opacity-70">{action.description}</p>
                  </div>
                  <ChevronRight size={16} className="opacity-50" />
                </div>
              </button>
            ))}
          </div>

          {/* Recent Activity */}
          <div className="bg-cyberdark-800 rounded-lg p-4 border border-cyberdark-700">
            <h3 className="font-semibold text-white mb-3">📈 Siste Aktivitet</h3>
            <div className="space-y-3">
              {[
                { action: 'Ny melding', from: 'Lisa Hansen', time: '2 min siden', type: 'message' },
                { action: 'Ble med i gruppe', from: 'Team Norge', time: '15 min siden', type: 'group' },
                { action: 'Ny venn lagt til', from: 'Erik Johansen', time: '1t siden', type: 'friend' },
                { action: 'AI Assistant brukt', from: 'Kundeservice', time: '2t siden', type: 'ai' },
              ].map((activity, index) => (
                <div key={index} className="flex items-center space-x-3 py-2">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                    activity.type === 'message' ? 'bg-cybergold-500 text-cyberdark-900' :
                    activity.type === 'group' ? 'bg-cyberblue-500 text-white' :
                    activity.type === 'friend' ? 'bg-cybergreen-500 text-cyberdark-900' :
                    'bg-cyberred-500 text-white'
                  }`}>
                    {activity.from.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <div className="text-sm text-white">{activity.action}</div>
                    <div className="text-xs text-cyberdark-400">{activity.from}</div>
                  </div>
                  <div className="text-xs text-cyberdark-400">{activity.time}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Settings */}
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-white">⚙️ Hurtiginnstillinger</h3>
            {[
              { icon: <Settings size={18} />, label: 'Profil & Innstillinger', path: '/profile' },
              { icon: <Mail size={18} />, label: 'E-post', path: '/mail' },
            ].map((setting, index) => (
              <button
                key={index}
                onClick={() => navigate(setting.path)}
                className="w-full bg-cyberdark-800 rounded-lg p-3 border border-cyberdark-700 flex items-center space-x-3 active:bg-cyberdark-700 transition-colors"
              >
                {setting.icon}
                <span className="text-white">{setting.label}</span>
                <ChevronRight size={16} className="text-cyberdark-400 ml-auto" />
              </button>
            ))}
          </div>
        </div>
      </div>
    </UnifiedLayout>
  );
};

export default DashboardPage;
