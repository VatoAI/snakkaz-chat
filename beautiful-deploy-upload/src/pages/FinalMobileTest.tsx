import React, { useState } from 'react';
import { SmartMobileNav } from '@/components/mobile/SmartMobileNav';
import { MobileChatHeader } from '@/components/mobile/MobileChatHeader';
import { cn } from '@/utils/cn';
import { BarChart3, Users, MessageCircle, TrendingUp, Clock, Shield } from 'lucide-react';

const FinalMobileTest: React.FC = () => {
  const [isAdmin, setIsAdmin] = useState(false);

  const renderDashboard = () => (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-white mb-4">📊 Dashboard</h2>
      
      {/* Quick stats */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <div className="bg-gradient-to-r from-cybergold-500/20 to-cybergold-600/20 rounded-lg p-4 border border-cybergold-500/30">
          <div className="flex items-center space-x-2">
            <MessageCircle size={20} className="text-cybergold-400" />
            <div>
              <div className="text-2xl font-bold text-cybergold-400">24</div>
              <div className="text-xs text-cyberdark-300">Aktive Chats</div>
            </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-cyberblue-500/20 to-cyberblue-600/20 rounded-lg p-4 border border-cyberblue-500/30">
          <div className="flex items-center space-x-2">
            <Users size={20} className="text-cyberblue-400" />
            <div>
              <div className="text-2xl font-bold text-cyberblue-400">8</div>
              <div className="text-xs text-cyberdark-300">Grupper</div>
            </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-cybergreen-500/20 to-cybergreen-600/20 rounded-lg p-4 border border-cybergreen-500/30">
          <div className="flex items-center space-x-2">
            <TrendingUp size={20} className="text-cybergreen-400" />
            <div>
              <div className="text-2xl font-bold text-cybergreen-400">156</div>
              <div className="text-xs text-cyberdark-300">Venner Online</div>
            </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-cyberred-500/20 to-cyberred-600/20 rounded-lg p-4 border border-cyberred-500/30">
          <div className="flex items-center space-x-2">
            <Clock size={20} className="text-cyberred-400" />
            <div>
              <div className="text-2xl font-bold text-cyberred-400">12</div>
              <div className="text-xs text-cyberdark-300">Uleste</div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent activity */}
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
              <div className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold",
                activity.type === 'message' && "bg-cybergold-500 text-cyberdark-900",
                activity.type === 'group' && "bg-cyberblue-500 text-white",
                activity.type === 'friend' && "bg-cybergreen-500 text-cyberdark-900",
                activity.type === 'ai' && "bg-cyberred-500 text-white"
              )}>
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
    </div>
  );

  return (
    <div className="relative min-h-screen bg-cyberdark-950">
      {/* Mobile header */}
      <MobileChatHeader
        title="SnakkaZ Smart Navigation"
        subtitle="Claude-inspirert struktur"
        isOnline={true}
        isSecure={true}
        onCall={() => alert('📞 Call funksjon')}
        onVideoCall={() => alert('📹 Video call funksjon')}
        onOptions={() => alert('⚙️ Innstillinger')}
      />

      {/* Main content with proper spacing */}
      <main className={cn(
        "pt-16 pb-24", // Header + bottom nav space
        "min-h-screen px-4 py-4",
        "mobile-theme-dark"
      )}>
        <div className="max-w-sm mx-auto">
          
          {/* Admin toggle for testing */}
          <div className="bg-cyberdark-900 rounded-lg p-4 border border-cyberdark-700 mb-4">
            <div className="flex items-center justify-between">
              <span className="text-white font-medium">Admin Mode</span>
              <button
                onClick={() => setIsAdmin(!isAdmin)}
                className={cn(
                  "relative w-12 h-6 rounded-full transition-colors duration-300",
                  isAdmin ? "bg-cybergold-500" : "bg-cyberdark-600"
                )}
              >
                <div className={cn(
                  "absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform duration-300",
                  isAdmin && "transform translate-x-6"
                )} />
              </button>
            </div>
            {isAdmin && (
              <div className="mt-2 text-sm text-cybergold-400 flex items-center space-x-2">
                <Shield size={16} />
                <span>Admin-only sektioner er nå synlige</span>
              </div>
            )}
          </div>

          {/* Navigation structure explanation */}
          <div className="bg-gradient-to-r from-cybergold-500/10 to-cyberblue-500/10 rounded-lg p-4 border border-cybergold-500/30 mb-6">
            <h2 className="text-lg font-bold text-cybergold-400 mb-3">🗂️ Smart Navigation</h2>
            <div className="text-sm text-white space-y-2">
              <div>✅ <strong>Bottom nav:</strong> 4 viktigste funksjoner</div>
              <div>✅ <strong>Full meny:</strong> Alle seksjoner organisert logisk</div>
              <div>✅ <strong>Admin toggle:</strong> Skjuler/viser admin-seksjoner</div>
              <div>✅ <strong>Claude-inspirert:</strong> Logisk gruppering av features</div>
            </div>
          </div>

          {/* Dashboard content */}
          {renderDashboard()}

          {/* Navigation structure overview */}
          <div className="mt-8 bg-cyberdark-900 rounded-lg p-4 border border-cyberdark-700">
            <h3 className="text-lg font-semibold text-white mb-3">📋 Navigation Structure</h3>
            <div className="space-y-3 text-sm">
              <div className="space-y-1">
                <div className="text-cybergold-400 font-medium">🏠 Hovedmeny</div>
                <div className="text-cyberdark-300 ml-4">• Dashboard (stats & aktivitet)</div>
              </div>
              
              <div className="space-y-1">
                <div className="text-cyberblue-400 font-medium">💬 Chat Hub</div>
                <div className="text-cyberdark-300 ml-4">• Chat (private meldinger)</div>
                <div className="text-cyberdark-300 ml-4">• Grupper (team-chats)</div>
              </div>
              
              <div className="space-y-1">
                <div className="text-cybergreen-400 font-medium">👥 Sosialt</div>
                <div className="text-cyberdark-300 ml-4">• Venner (kontaktliste)</div>
                <div className="text-cyberdark-300 ml-4">• Finn Venner (søk nye)</div>
              </div>
              
              <div className="space-y-1">
                <div className="text-cyberred-400 font-medium">🤖 Tjenester</div>
                <div className="text-cyberdark-300 ml-4">• AI Assistent (kundeservice)</div>
                <div className="text-cyberdark-300 ml-4">• Mail (e-post system)</div>
              </div>
              
              <div className="space-y-1">
                <div className="text-cyberdark-300 font-medium">⚙️ Innstillinger</div>
                <div className="text-cyberdark-300 ml-4">• Profil • Innstillinger • Info</div>
              </div>
              
              {isAdmin && (
                <div className="space-y-1">
                  <div className="text-red-400 font-medium">🛡️ Admin (kun admin)</div>
                  <div className="text-cyberdark-300 ml-4">• Admin Panel • Memory (MCP)</div>
                </div>
              )}
            </div>
          </div>

          {/* Instructions */}
          <div className="mt-6 bg-cyberdark-800 rounded-lg p-4 border border-cyberdark-700">
            <h3 className="font-semibold text-white mb-2">📱 Test Instructions</h3>
            <div className="text-sm text-cyberdark-300 space-y-1">
              <div>1. Klikk "Meny" i bottom navigation</div>
              <div>2. Utforsk de ulike seksjonene</div>
              <div>3. Toggle admin mode for å se admin-seksjoner</div>
              <div>4. Test quick action button (+ knapp)</div>
            </div>
          </div>
        </div>
      </main>

      {/* Smart mobile navigation */}
      <SmartMobileNav isAdmin={isAdmin} userRole={isAdmin ? 'admin' : 'user'} />
    </div>
  );
};

export default FinalMobileTest;
