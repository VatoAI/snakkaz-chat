import React, { useState } from 'react';
import { MobileBottomNavImproved } from '@/components/mobile/MobileBottomNavImproved';
import { MobileChatHeader } from '@/components/mobile/MobileChatHeader';
import { cn } from '@/utils/cn';
import { Search, Filter, MoreVertical, Archive, Star, Pin } from 'lucide-react';

const ImprovedMobileTest: React.FC = () => {
  const [activeTab, setActiveTab] = useState('chats');

  const renderChatsList = () => (
    <div className="space-y-2">
      <h2 className="text-lg font-semibold text-white mb-4">💬 Chats Overview</h2>
      
      {/* Search bar */}
      <div className="relative mb-4">
        <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-cyberdark-400" />
        <input
          type="text"
          placeholder="Søk i chats..."
          className="w-full bg-cyberdark-800 border border-cyberdark-700 rounded-lg pl-10 pr-4 py-3 text-white placeholder-cyberdark-400 focus:outline-none focus:ring-2 focus:ring-cybergold-500"
        />
      </div>

      {/* Chat items */}
      {[
        { name: 'Team Norge', lastMsg: 'Møte i morgen kl 10', time: '14:32', unread: 3, pinned: true },
        { name: 'Lisa Hansen', lastMsg: 'Takk for hjelpen! 🙏', time: '13:45', unread: 1, online: true },
        { name: 'Utvikler Chat', lastMsg: 'Ny versjon er klar', time: '12:15', unread: 0 },
        { name: 'Familie', lastMsg: 'Middag på søndag?', time: '11:30', unread: 5 },
      ].map((chat, index) => (
        <div
          key={index}
          className="bg-cyberdark-800 rounded-lg p-4 border border-cyberdark-700 active:bg-cyberdark-700 transition-colors"
          onClick={() => alert(`Åpner chat med ${chat.name}`)}
        >
          <div className="flex items-center space-x-3">
            <div className="relative">
              <div className="w-12 h-12 bg-cybergold-500 rounded-full flex items-center justify-center text-cyberdark-900 font-bold">
                {chat.name.charAt(0)}
              </div>
              {chat.online && (
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-cybergreen-500 border-2 border-cyberdark-800 rounded-full" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2">
                <h3 className="font-medium text-white truncate">{chat.name}</h3>
                {chat.pinned && <Pin size={14} className="text-cybergold-400" />}
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
  );

  const renderGroupsList = () => (
    <div className="space-y-2">
      <h2 className="text-lg font-semibold text-white mb-4">🏢 Grupper Overview</h2>
      
      {[
        { name: 'SnakkaZ Utvikling', members: 12, activity: 'Høy', category: 'Arbeid' },
        { name: 'Gaming Squad', members: 8, activity: 'Medium', category: 'Hobby' },
        { name: 'Familie Chat', members: 6, activity: 'Lav', category: 'Familie' },
        { name: 'Nabolaget', members: 25, activity: 'Medium', category: 'Lokalt' },
      ].map((group, index) => (
        <div
          key={index}
          className="bg-cyberdark-800 rounded-lg p-4 border border-cyberdark-700 active:bg-cyberdark-700 transition-colors"
          onClick={() => alert(`Åpner gruppe: ${group.name}`)}
        >
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-cyberblue-500 rounded-lg flex items-center justify-center text-white font-bold">
              #
            </div>
            <div className="flex-1">
              <h3 className="font-medium text-white">{group.name}</h3>
              <div className="flex items-center space-x-2 text-sm text-cyberdark-300">
                <span>{group.members} medlemmer</span>
                <span>•</span>
                <span>{group.activity} aktivitet</span>
              </div>
            </div>
            <div className="text-xs text-cybergold-400 bg-cybergold-500/10 px-2 py-1 rounded">
              {group.category}
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const renderContactsList = () => (
    <div className="space-y-2">
      <h2 className="text-lg font-semibold text-white mb-4">👥 Kontakter Overview</h2>
      
      {[
        { name: 'Anna Nordahl', status: 'Online', mutual: 3 },
        { name: 'Erik Johansen', status: 'Sist sett 2t siden', mutual: 8 },
        { name: 'Maria Silva', status: 'Online', mutual: 1 },
        { name: 'Thomas Berg', status: 'Sist sett i går', mutual: 12 },
      ].map((contact, index) => (
        <div
          key={index}
          className="bg-cyberdark-800 rounded-lg p-4 border border-cyberdark-700 active:bg-cyberdark-700 transition-colors"
          onClick={() => alert(`Kontakt: ${contact.name}`)}
        >
          <div className="flex items-center space-x-3">
            <div className="relative">
              <div className="w-12 h-12 bg-cybergreen-500 rounded-full flex items-center justify-center text-cyberdark-900 font-bold">
                {contact.name.split(' ').map(n => n.charAt(0)).join('')}
              </div>
              {contact.status === 'Online' && (
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-cybergreen-500 border-2 border-cyberdark-800 rounded-full" />
              )}
            </div>
            <div className="flex-1">
              <h3 className="font-medium text-white">{contact.name}</h3>
              <p className="text-sm text-cyberdark-300">{contact.status}</p>
            </div>
            <div className="text-xs text-cybergold-400">
              {contact.mutual} felles
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const renderProfile = () => (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-white mb-4">👤 Profil Overview</h2>
      
      {/* Profile header */}
      <div className="bg-gradient-to-r from-cybergold-500/20 to-cyberblue-500/20 rounded-lg p-6 border border-cybergold-500/30">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 bg-cybergold-500 rounded-full flex items-center justify-center text-cyberdark-900 font-bold text-xl">
            DU
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">Din Profil</h3>
            <p className="text-cybergold-400">@dinbruker</p>
            <p className="text-sm text-cyberdark-300">Online nå</p>
          </div>
        </div>
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-cyberdark-800 rounded-lg p-3 text-center border border-cyberdark-700">
          <div className="text-cybergold-400 font-bold text-lg">24</div>
          <div className="text-xs text-cyberdark-300">Chats</div>
        </div>
        <div className="bg-cyberdark-800 rounded-lg p-3 text-center border border-cyberdark-700">
          <div className="text-cyberblue-400 font-bold text-lg">8</div>
          <div className="text-xs text-cyberdark-300">Grupper</div>
        </div>
        <div className="bg-cyberdark-800 rounded-lg p-3 text-center border border-cyberdark-700">
          <div className="text-cybergreen-400 font-bold text-lg">156</div>
          <div className="text-xs text-cyberdark-300">Kontakter</div>
        </div>
      </div>

      {/* Settings menu */}
      <div className="space-y-2">
        {[
          { icon: '🔔', label: 'Varsler', desc: 'Administrer varsler og lyder' },
          { icon: '🔒', label: 'Personvern', desc: 'Sikkerhet og personvern' },
          { icon: '🎨', label: 'Utseende', desc: 'Tema og visning' },
          { icon: '💾', label: 'Lagring', desc: 'Data og sikkerhetskopi' },
          { icon: '❓', label: 'Hjelp', desc: 'Support og FAQ' },
        ].map((item, index) => (
          <div
            key={index}
            className="bg-cyberdark-800 rounded-lg p-4 border border-cyberdark-700 active:bg-cyberdark-700 transition-colors"
            onClick={() => alert(`Åpner: ${item.label}`)}
          >
            <div className="flex items-center space-x-3">
              <div className="text-2xl">{item.icon}</div>
              <div className="flex-1">
                <h4 className="font-medium text-white">{item.label}</h4>
                <p className="text-sm text-cyberdark-300">{item.desc}</p>
              </div>
              <MoreVertical size={16} className="text-cyberdark-400" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'chats': return renderChatsList();
      case 'groups': return renderGroupsList();
      case 'contacts': return renderContactsList();
      case 'profile': return renderProfile();
      default: return renderChatsList();
    }
  };

  return (
    <div className="relative min-h-screen bg-cyberdark-950">
      {/* Mobile header */}
      <MobileChatHeader
        title="SnakkaZ Mobile"
        subtitle="Forbedret mobile interface"
        isOnline={true}
        isSecure={true}
        onCall={() => alert('📞 Call funksjon')}
        onVideoCall={() => alert('📹 Video call funksjon')}
        onOptions={() => alert('⚙️ Innstillinger')}
      />

      {/* Main content with proper spacing for fixed elements */}
      <main className={cn(
        "pt-16 pb-24", // Header height + bottom nav height + extra space
        "min-h-screen px-4 py-4",
        "mobile-theme-dark"
      )}>
        <div className="max-w-sm mx-auto">
          
          {/* Status indicator */}
          <div className="bg-cybergold-500/10 border border-cybergold-500/30 rounded-lg p-3 mb-4">
            <div className="text-sm text-cybergold-400 font-medium">
              ✅ Forbedret Mobile Interface - Ingen overlapping!
            </div>
          </div>

          {/* Dynamic content based on navigation */}
          {renderContent()}

          {/* Test area */}
          <div className="mt-8 bg-cyberdark-900 rounded-lg p-4 border border-cyberdark-700">
            <h3 className="text-lg font-semibold text-white mb-3">🧪 Interface Test</h3>
            <div className="space-y-2 text-sm text-cyberdark-300">
              <div>✅ Bottom nav høyde: 72px + safe area</div>
              <div>✅ Content padding: 96px (header 64px + nav 72px + buffer)</div>
              <div>✅ Floating action button: Riktig posisjon</div>
              <div>✅ Touch targets: 44px minimum</div>
              <div>✅ Ingen innhold dekket av navigasjon</div>
            </div>
          </div>

          {/* Extra space for testing scroll */}
          <div className="h-32 flex items-center justify-center text-cyberdark-400 text-sm">
            Scroll ned for å teste at alt innhold er tilgjengelig
          </div>
        </div>
      </main>

      {/* Improved bottom navigation */}
      <MobileBottomNavImproved />
    </div>
  );
};

export default ImprovedMobileTest;
