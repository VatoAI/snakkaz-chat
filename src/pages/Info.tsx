import React from 'react';
import { Shield, Lock, Users, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

export const Info: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyberdark-950 via-cyberdark-900 to-cyberdark-800">
      <div className="container mx-auto px-6 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-green-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
              Snakkaz Chat
            </h1>
            <p className="text-xl text-cyberdark-200 max-w-2xl mx-auto leading-relaxed">
              En revolusjonerende chat-plattform som kombinerer kraften av moderne teknologi 
              med sikkerhet som matcher bankenes standarder og en brukeropplevelse som overgår forventningene.
            </p>
          </div>

          {/* Trust Badges */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
            <div className="flex flex-col items-center p-4 rounded-xl bg-cyberdark-900/50 border border-green-500/20 backdrop-blur-sm">
              <Shield className="text-green-400 mb-2" size={32} />
              <span className="text-sm font-medium text-green-300">100% Sikker</span>
              <span className="text-xs text-cyberdark-300">Vi samler IKKE data</span>
            </div>
            <div className="flex flex-col items-center p-4 rounded-xl bg-cyberdark-900/50 border border-cyberblue-500/20 backdrop-blur-sm">
              <Lock className="text-cyberblue-400 mb-2" size={32} />
              <span className="text-sm font-medium text-cyberblue-300">✅ Verifisert</span>
              <span className="text-xs text-cyberdark-300">E2E Kryptering</span>
            </div>
            <div className="flex flex-col items-center p-4 rounded-xl bg-cyberdark-900/50 border border-purple-500/20 backdrop-blur-sm">
              <Users className="text-purple-400 mb-2" size={32} />
              <span className="text-sm font-medium text-purple-300">🏆 Community</span>
              <span className="text-xs text-cyberdark-300">Trust-system</span>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              onClick={() => navigate("/register")}
              className="h-12 px-8 text-lg bg-gradient-to-r from-cybergold-500 to-cybergold-400 hover:from-cybergold-400 hover:to-cybergold-300 text-black font-semibold shadow-lg shadow-cybergold-500/25"
            >
              Start sikker chat
              <ArrowRight className="ml-2" size={20} />
            </Button>
            <Button 
              onClick={() => navigate("/login")}
              variant="outline"
              className="h-12 px-8 text-lg border-cyberblue-500/70 text-cyberblue-400 hover:bg-cyberblue-900/30"
            >
              Logg inn
            </Button>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h3 className="text-2xl md:text-3xl font-bold mb-4 text-cyberdark-100">
            Ny her? Les hvorfor SnakkaZ er ditt beste valg
          </h3>
          <p className="text-cyberdark-300 text-lg max-w-3xl mx-auto">
            Oppdag hvorfor tusenvis av brukere stoler på SnakkaZ for sin daglige kommunikasjon
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          <div className="p-6 rounded-xl bg-cyberdark-900/50 border border-green-500/20 backdrop-blur-sm">
            <h4 className="text-xl font-bold text-green-400 mb-4">🛡️ Militær-grad Sikkerhet</h4>
            <p className="text-cyberdark-200">
              End-to-end kryptering, zero-knowledge arkitektur og åpen kildekode sikkerhet.
            </p>
          </div>
          
          <div className="p-6 rounded-xl bg-cyberdark-900/50 border border-cyberblue-500/20 backdrop-blur-sm">
            <h4 className="text-xl font-bold text-cyberblue-400 mb-4">⚡ Lynrask Ytelse</h4>
            <p className="text-cyberdark-200">
              Optimalisert for hastighet med moderne teknologi og effektiv datahåndtering.
            </p>
          </div>
          
          <div className="p-6 rounded-xl bg-cyberdark-900/50 border border-purple-500/20 backdrop-blur-sm">
            <h4 className="text-xl font-bold text-purple-400 mb-4">🎨 Tilpassbar Opplevelse</h4>
            <p className="text-cyberdark-200">
              Egendefinerte emojis, temaer og grensesnitt som tilpasser seg dine behov.
            </p>
          </div>
          
          <div className="p-6 rounded-xl bg-cyberdark-900/50 border border-orange-500/20 backdrop-blur-sm">
            <h4 className="text-xl font-bold text-orange-400 mb-4">🌐 Global Tilgjengelighet</h4>
            <p className="text-cyberdark-200">
              Tilgjengelig på alle enheter med støtte for flere språk og tidssoner.
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-cyberdark-700/50 mt-12">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <p className="text-cyberdark-400 text-sm">
              © 2025 Snakkaz Chat. Alle rettigheter reservert.
            </p>
            <p className="text-cyberdark-500 text-xs mt-2">
              End-to-end kryptering • Zero-knowledge arkitektur • Open source sikkerhet
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Info;
