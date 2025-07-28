import React from 'react';
import { Link } from 'react-router-dom';

function ProfilePageCloudMCPDemo() {
  // Mock demo data - no authentication required
  const demoProfile = {
    display_name: 'Demo User',
    username: 'demo_user',
    bio: 'This is a demo profile showcasing the CloudMCP liquid glass design.',
    avatar_url: null,
    created_at: '2025-01-15T10:30:00Z'
  };

  const demoUser = {
    email: 'demo@snakkaz.com'
  };

  const getInitials = () => {
    return demoProfile.display_name?.charAt(0) || 'D';
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('no-NO', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Navigation */}
      <nav className="p-6 glass-container bg-white/5 border-b border-white/10 backdrop-blur-xl">
        <div className="flex items-center justify-between max-w-6xl mx-auto">
          <div className="flex items-center space-x-6">
            <Link to="/" className="text-2xl font-bold text-yellow-400">
              SnakkaZ
            </Link>
            <span className="px-3 py-1 bg-yellow-400/20 text-yellow-400 rounded-full text-sm border border-yellow-400/30">
              CloudMCP Demo
            </span>
          </div>
          
          <div className="flex items-center space-x-4">
            <Link 
              to="/cloudmcp-chat-demo"
              className="py-2 px-4 bg-white/10 rounded-lg hover:bg-white/20 transition-all"
            >
              💬 Chat Demo
            </Link>
            <Link 
              to="/design-overview"
              className="py-2 px-4 bg-white/10 rounded-lg hover:bg-white/20 transition-all"
            >
              🎨 Design Overview
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto p-8">
        {/* Profile Header */}
        <div className="glass-container bg-white/5 border border-white/10 backdrop-blur-xl rounded-2xl p-8 mb-8">
          <div className="flex items-start space-x-6">
            {/* Avatar */}
            <div className="w-24 h-24 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center text-black font-bold text-3xl">
              {getInitials()}
            </div>
            
            {/* Profile Info */}
            <div className="flex-1">
              <div className="flex items-center space-x-4 mb-2">
                <h1 className="text-3xl font-bold text-white">{demoProfile.display_name}</h1>
                <span className="text-green-400 text-sm">🟢 Online (Demo)</span>
              </div>
              <p className="text-gray-400 mb-2">@{demoProfile.username}</p>
              <p className="text-gray-300 mb-4">{demoProfile.bio}</p>
              
              <div className="flex items-center space-x-6 text-sm text-gray-400">
                <span>📧 {demoUser.email}</span>
                <span>📅 Medlem siden {formatDate(demoProfile.created_at)}</span>
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className="flex flex-col space-y-3">
              <button className="py-2 px-4 bg-gradient-to-r from-yellow-600 to-yellow-500 rounded-lg hover:from-yellow-500 hover:to-yellow-400 transition-all text-black font-semibold">
                ✏️ Rediger Profil
              </button>
              <button className="py-2 px-4 bg-white/10 border border-white/20 rounded-lg hover:bg-white/20 transition-all">
                ⚙️ Innstillinger
              </button>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="glass-container bg-white/5 border border-white/10 backdrop-blur-xl rounded-xl p-6 text-center">
            <div className="text-3xl font-bold text-yellow-400 mb-2">147</div>
            <div className="text-gray-400">Meldinger Sendt</div>
          </div>
          <div className="glass-container bg-white/5 border border-white/10 backdrop-blur-xl rounded-xl p-6 text-center">
            <div className="text-3xl font-bold text-blue-400 mb-2">23</div>
            <div className="text-gray-400">Chat Rooms</div>
          </div>
          <div className="glass-container bg-white/5 border border-white/10 backdrop-blur-xl rounded-xl p-6 text-center">
            <div className="text-3xl font-bold text-green-400 mb-2">8</div>
            <div className="text-gray-400">Dager Aktiv</div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="glass-container bg-white/5 border border-white/10 backdrop-blur-xl rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">🕒 Nylig Aktivitet</h2>
          
          <div className="space-y-4">
            <div className="flex items-center space-x-4 p-4 bg-white/5 rounded-lg border border-white/10">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <div className="flex-1">
                <p className="text-white">Ble med i #CloudMCP Discussion</p>
                <p className="text-gray-400 text-sm">2 timer siden</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4 p-4 bg-white/5 rounded-lg border border-white/10">
              <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
              <div className="flex-1">
                <p className="text-white">Sendte en melding i #General</p>
                <p className="text-gray-400 text-sm">4 timer siden</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4 p-4 bg-white/5 rounded-lg border border-white/10">
              <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
              <div className="flex-1">
                <p className="text-white">Oppdaterte profil bio</p>
                <p className="text-gray-400 text-sm">1 dag siden</p>
              </div>
            </div>
          </div>
        </div>

        {/* Demo Notice */}
        <div className="mt-8 text-center">
          <div className="inline-flex items-center space-x-2 bg-yellow-400/20 border border-yellow-400/30 rounded-full px-6 py-3">
            <span className="text-yellow-400">✨</span>
            <span className="text-yellow-400 font-semibold">CloudMCP Liquid Glass Design System Demo</span>
            <span className="text-yellow-400">✨</span>
          </div>
          <p className="text-gray-400 text-sm mt-2">
            Dette er en demo-versjon som viser CloudMCP-inspirert design uten autentisering
          </p>
        </div>
      </div>
    </div>
  );
}

export default ProfilePageCloudMCPDemo;
