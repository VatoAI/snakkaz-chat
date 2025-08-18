import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MessageSquare, Users, Bot, Settings } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

const WelcomeDashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <div
      className="min-h-screen liquid-glass css-protection-lock"
      style={{
        background: 'linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%)',
        fontFamily: 'var(--font-body, "Space Grotesk", sans-serif)'
      }}
    >
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse animation-delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-green-500/5 rounded-full blur-2xl animate-pulse"></div>
      </div>

      <div className="relative z-10 container mx-auto py-8 px-4">
        <div className="text-center mb-12">
          <h1
            className="text-4xl font-bold text-white mb-4"
            style={{ fontFamily: 'var(--font-display, "Orbitron", monospace)' }}
          >
            SNAKKAZ
          </h1>
          <div className="text-2xl text-white mb-2">
            SnakkaZ Norge 🇳🇴
          </div>
          <p className="text-blue-300 text-lg">
            ✨ Spektakulær chat er her! ⭐
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Private Chat Card */}
            <div
              className="liquid-glass p-8 rounded-3xl cursor-pointer transform hover:scale-105 transition-all duration-300 hover:shadow-2xl border border-white/20"
              onClick={() => navigate('/chat')}
            >
              <div className="text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-600/50 via-purple-600/50 to-indigo-600/50 backdrop-blur-sm border border-white/20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <MessageSquare className="w-10 h-10 text-white" />
                </div>
                <h3
                  className="text-2xl font-bold text-white mb-4"
                  style={{ fontFamily: 'var(--font-display, "Orbitron", monospace)' }}
                >
                  SPEKTAKULÆR CHAT!
                </h3>
                <p className="text-gray-300 text-lg leading-relaxed">
                  Det nye designet virker! 🔥<br />
                  Skriv en spektakulær melding... ✨ (Enter for å sende)
                </p>
              </div>
            </div>

            {/* Groups Card */}
            <div
              className="liquid-glass p-8 rounded-3xl cursor-pointer transform hover:scale-105 transition-all duration-300 hover:shadow-2xl border border-white/20"
              onClick={() => navigate('/dashboard')}
            >
              <div className="text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-green-600/50 via-blue-600/50 to-purple-600/50 backdrop-blur-sm border border-white/20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Users className="w-10 h-10 text-white" />
                </div>
                <h3
                  className="text-2xl font-bold text-white mb-4"
                  style={{ fontFamily: 'var(--font-display, "Orbitron", monospace)' }}
                >
                  DASHBOARD
                </h3>
                <p className="text-gray-300 text-lg leading-relaxed">
                  Administrer profil, innstillinger og venner.<br />
                  Kontroller din SnakkaZ-opplevelse.
                </p>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="mt-12 text-center">
            <div className="flex justify-center space-x-6">
              <button
                className="liquid-glass p-4 rounded-2xl transform hover:scale-110 transition-all duration-300 border border-white/20"
                onClick={() => navigate('/profile')}
              >
                <Bot className="w-8 h-8 text-white" />
              </button>
              <button
                className="liquid-glass p-4 rounded-2xl transform hover:scale-110 transition-all duration-300 border border-white/20"
                onClick={() => navigate('/settings')}
              >
                <Settings className="w-8 h-8 text-white" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WelcomeDashboard;
