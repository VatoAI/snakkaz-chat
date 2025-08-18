import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  MessageSquare, 
  Users, 
  Bot, 
  Heart, 
  Shield, 
  Search,
  TrendingUp,
  Clock,
  User
} from 'lucide-react';
import { useAuth } from '@/core/hooks/useAuth';
import './Dashboard.css';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  // Quick action items with proper navigation
  const quickActions = [
    {
      icon: MessageSquare,
      label: 'Start Chat',
      description: 'Begynn en ny samtale',
      path: '/app/chat',
      color: 'from-cyberblue-500/20 to-cyberblue-600/20 border-cyberblue-500/30',
      textColor: 'text-cyberblue-400'
    },
    {
      icon: Users,
      label: 'Finn Venner',
      description: 'Koble til nye personer',
      path: '/app/friends',
      color: 'from-cybergreen-500/20 to-cybergreen-600/20 border-cybergreen-500/30',
      textColor: 'text-cybergreen-400'
    },
    {
      icon: Bot,
      label: 'AI Assistent',
      description: 'Snakk med AI-assistenten',
      path: '/app/ai-chat',
      color: 'from-cybergold-500/20 to-cybergold-600/20 border-cybergold-500/30',
      textColor: 'text-cybergold-400'
    },
    {
      icon: Search,
      label: 'Utforsk',
      description: 'Søk i samtaler og grupper',
      path: '/app/search',
      color: 'from-purple-500/20 to-purple-600/20 border-purple-500/30',
      textColor: 'text-purple-400'
    }
  ];

  // Stats
  const stats = [
    { label: 'Samtaler', value: '24', icon: MessageSquare, color: 'text-cyberblue-400' },
    { label: 'Venner', value: '12', icon: Heart, color: 'text-cybergreen-400' },
    { label: 'Grupper', value: '5', icon: Users, color: 'text-cybergold-400' },
    { label: 'Meldinger', value: '1.2k', icon: TrendingUp, color: 'text-purple-400' }
  ];

  // Recent activity
  const recentActivity = [
    {
      type: 'message',
      icon: MessageSquare,
      title: 'Ny melding i Teknologi-gruppen',
      time: '5 min siden',
      color: 'text-cyberblue-400'
    },
    {
      type: 'friend',
      icon: Heart,
      title: 'Du har en ny venneforespørsel',
      time: '10 min siden',
      color: 'text-cybergreen-400'
    },
    {
      type: 'ai',
      icon: Bot,
      title: 'AI-assistent svarte på spørsmålet ditt',
      time: '1 time siden',
      color: 'text-cybergold-400'
    }
  ];

  return (
    <div className="dashboard min-h-screen bg-cyberdark-950 p-6">
      {/* Welcome Section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="bg-gradient-to-r from-cybergold-500/20 to-cybergold-600/20 border border-cybergold-500/30 rounded-xl p-6">
          <h1 className="text-2xl font-bold text-cybergold-400 mb-2">
            Velkommen tilbake, {user?.user_metadata?.username || 'Bruker'}! 👋
          </h1>
          <p className="text-cyberdark-300">
            Din sikre kommunikasjonsplattform er klar for bruk
          </p>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
      >
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="bg-cyberdark-800/50 border border-cyberdark-700 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-cyberdark-400 text-sm">{stat.label}</p>
                  <p className="text-2xl font-bold text-white">{stat.value}</p>
                </div>
                <Icon size={24} className={stat.color} />
              </div>
            </div>
          );
        })}
      </motion.div>

      {/* Quick Actions */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mb-8"
      >
        <h2 className="text-xl font-semibold text-white mb-4">Hurtighandlinger</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action, index) => {
            const Icon = action.icon;
            return (
              <motion.button
                key={action.label}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate(action.path)}
                className={`bg-gradient-to-br ${action.color} rounded-xl p-6 text-left hover:shadow-lg transition-all duration-200`}
              >
                <Icon size={32} className={`${action.textColor} mb-3`} />
                <h3 className={`font-semibold mb-1 ${action.textColor}`}>{action.label}</h3>
                <p className="text-cyberdark-300 text-sm">{action.description}</p>
              </motion.button>
            );
          })}
        </div>
      </motion.div>

      {/* Recent Activity */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <h2 className="text-xl font-semibold text-white mb-4">Nylig aktivitet</h2>
        <div className="bg-cyberdark-800/50 border border-cyberdark-700 rounded-xl divide-y divide-cyberdark-700">
          {recentActivity.map((activity, index) => {
            const Icon = activity.icon;
            return (
              <div key={index} className="p-4 hover:bg-cyberdark-800/70 transition-colors cursor-pointer">
                <div className="flex items-center space-x-4">
                  <div className="p-2 bg-cyberdark-700 rounded-lg">
                    <Icon size={20} className={activity.color} />
                  </div>
                  <div className="flex-1">
                    <p className="text-white font-medium">{activity.title}</p>
                    <div className="flex items-center space-x-2 mt-1">
                      <Clock size={14} className="text-cyberdark-400" />
                      <p className="text-cyberdark-400 text-sm">{activity.time}</p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
};

export default Dashboard;