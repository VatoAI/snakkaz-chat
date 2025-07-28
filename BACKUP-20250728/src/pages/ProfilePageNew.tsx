import React, { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { UnifiedLayout } from '@/components/layout/UnifiedLayout';
import { 
  User, 
  Settings, 
  Shield, 
  Bell, 
  Palette, 
  Download, 
  HelpCircle,
  LogOut,
  Edit,
  Camera,
  Mail,
  Phone
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ProfilePage: React.FC = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);

  const userStats = [
    { label: 'Chats', value: '24', color: 'text-cybergold-400' },
    { label: 'Grupper', value: '8', color: 'text-cyberblue-400' },
    { label: 'Venner', value: '156', color: 'text-cybergreen-400' },
  ];

  const settingsMenu = [
    { 
      icon: <Bell size={20} />, 
      label: 'Varsler', 
      desc: 'Administrer varsler og lyder',
      action: () => navigate('/settings/notifications')
    },
    { 
      icon: <Shield size={20} />, 
      label: 'Personvern', 
      desc: 'Sikkerhet og personvern',
      action: () => navigate('/settings/privacy')
    },
    { 
      icon: <Palette size={20} />, 
      label: 'Utseende', 
      desc: 'Tema og visning',
      action: () => navigate('/settings/appearance')
    },
    { 
      icon: <Download size={20} />, 
      label: 'Data & Lagring', 
      desc: 'Sikkerhetskopi og data',
      action: () => navigate('/settings/storage')
    },
    { 
      icon: <HelpCircle size={20} />, 
      label: 'Hjelp & Support', 
      desc: 'FAQ og kundeservice',
      action: () => navigate('/help')
    },
  ];

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <UnifiedLayout 
      title="Min Profil"
      subtitle="Profil og innstillinger"
    >
      <div className="px-4 py-4">
        <div className="max-w-sm mx-auto space-y-6">
          
          {/* Profile Header */}
          <div className="bg-gradient-to-r from-cybergold-500/20 to-cyberblue-500/20 rounded-lg p-6 border border-cybergold-500/30">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <div className="w-20 h-20 bg-cybergold-500 rounded-full flex items-center justify-center text-cyberdark-900 font-bold text-2xl">
                  {user?.user_metadata?.username?.charAt(0)?.toUpperCase() || 
                   user?.email?.charAt(0)?.toUpperCase() || 'U'}
                </div>
                <button className="absolute -bottom-2 -right-2 bg-cybergold-500 p-2 rounded-full text-cyberdark-900 active:scale-90 transition-transform">
                  <Camera size={14} />
                </button>
              </div>
              
              <div className="flex-1">
                <div className="flex items-center space-x-2">
                  <h2 className="text-xl font-bold text-white">
                    {user?.user_metadata?.username || 'Bruker'}
                  </h2>
                  <button 
                    onClick={() => setIsEditing(!isEditing)}
                    className="text-cybergold-400 p-1"
                  >
                    <Edit size={16} />
                  </button>
                </div>
                <p className="text-cybergold-400 text-sm">@{user?.user_metadata?.username || 'bruker'}</p>
                <div className="flex items-center space-x-1 mt-1">
                  <div className="w-2 h-2 bg-cybergreen-500 rounded-full" />
                  <span className="text-xs text-cybergreen-400">Online nå</span>
                </div>
              </div>
            </div>
          </div>

          {/* User Stats */}
          <div className="grid grid-cols-3 gap-3">
            {userStats.map((stat, index) => (
              <div key={index} className="bg-cyberdark-800 rounded-lg p-3 text-center border border-cyberdark-700">
                <div className={`text-lg font-bold ${stat.color}`}>{stat.value}</div>
                <div className="text-xs text-cyberdark-300">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Contact Info */}
          <div className="bg-cyberdark-800 rounded-lg p-4 border border-cyberdark-700">
            <h3 className="font-semibold text-white mb-3">📋 Kontaktinfo</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Mail size={16} className="text-cybergold-400" />
                <span className="text-sm text-white">{user?.email}</span>
              </div>
              {user?.user_metadata?.phone && (
                <div className="flex items-center space-x-3">
                  <Phone size={16} className="text-cybergold-400" />
                  <span className="text-sm text-white">{user.user_metadata.phone}</span>
                </div>
              )}
            </div>
          </div>

          {/* Settings Menu */}
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-white">⚙️ Innstillinger</h3>
            
            {settingsMenu.map((setting, index) => (
              <button
                key={index}
                onClick={setting.action}
                className="w-full bg-cyberdark-800 rounded-lg p-4 border border-cyberdark-700 active:bg-cyberdark-700 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <div className="text-cybergold-400">{setting.icon}</div>
                  <div className="flex-1 text-left">
                    <h4 className="font-medium text-white">{setting.label}</h4>
                    <p className="text-sm text-cyberdark-400">{setting.desc}</p>
                  </div>
                  <Settings size={16} className="text-cyberdark-400" />
                </div>
              </button>
            ))}
          </div>

          {/* Account Actions */}
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-white">👤 Konto</h3>
            
            <button
              onClick={() => navigate('/settings/account')}
              className="w-full bg-cyberdark-800 rounded-lg p-4 border border-cyberdark-700 active:bg-cyberdark-700 transition-colors flex items-center space-x-3"
            >
              <User size={20} className="text-cyberblue-400" />
              <div className="flex-1 text-left">
                <h4 className="font-medium text-white">Kontoinnstillinger</h4>
                <p className="text-sm text-cyberdark-400">Administrer kontoen din</p>
              </div>
            </button>

            <button
              onClick={handleSignOut}
              className="w-full bg-red-500/10 border border-red-500/30 rounded-lg p-4 active:bg-red-500/20 transition-colors flex items-center space-x-3"
            >
              <LogOut size={20} className="text-red-400" />
              <div className="flex-1 text-left">
                <h4 className="font-medium text-red-400">Logg ut</h4>
                <p className="text-sm text-red-400/70">Avslutt økten din</p>
              </div>
            </button>
          </div>

          {/* App Info */}
          <div className="bg-cyberdark-900 rounded-lg p-4 border border-cyberdark-700 text-center">
            <div className="text-xs text-cyberdark-400 space-y-1">
              <div>SnakkaZ Chat v1.0.0</div>
              <div>Sikker kommunikasjon siden 2025</div>
              <div className="text-cybergold-400">Bygget med ❤️ i Norge</div>
            </div>
          </div>
        </div>
      </div>
    </UnifiedLayout>
  );
};

export default ProfilePage;
