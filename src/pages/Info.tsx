import React from 'react';
import { Shield, Lock, Users, ArrowRight, Mail, Star, Crown, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useSubdomainNavigation } from '@/utils/subdomainNavigation';

export const Info: React.FC = () => {
  const navigate = useNavigate();
  const subdomainNav = useSubdomainNavigation();

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
              Koble deg til ekte mennesker. Bygg meningsfulle vennskap. 
              Chat sikkert med venner, familie og nye bekjentskaper med banknivå sikkerhet.
            </p>
            <p className="text-lg text-cyberdark-300 mt-4 max-w-xl mx-auto">
              💫 Inviter venner • 🤝 Bygg nettverk • 🔒 100% privat
            </p>
          </div>

          {/* Trust Badges */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
            <div className="flex flex-col items-center p-4 rounded-xl bg-cyberdark-900/50 border border-green-500/20 backdrop-blur-sm">
              <Users className="text-green-400 mb-2" size={32} />
              <span className="text-sm font-medium text-green-300">Venn-system</span>
              <span className="text-xs text-cyberdark-300">Inviter & koble</span>
            </div>
            <div className="flex flex-col items-center p-4 rounded-xl bg-cyberdark-900/50 border border-cyberblue-500/20 backdrop-blur-sm">
              <Lock className="text-cyberblue-400 mb-2" size={32} />
              <span className="text-sm font-medium text-cyberblue-300">✅ Privat</span>
              <span className="text-xs text-cyberdark-300">E2E Kryptering</span>
            </div>
            <div className="flex flex-col items-center p-4 rounded-xl bg-cyberdark-900/50 border border-purple-500/20 backdrop-blur-sm">
              <Shield className="text-purple-400 mb-2" size={32} />
              <span className="text-sm font-medium text-purple-300">🏆 Sikkert</span>
              <span className="text-xs text-cyberdark-300">Null datamining</span>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              onClick={() => subdomainNav.navigate("/register")}
              className="h-12 px-8 text-lg bg-gradient-to-r from-cybergold-500 to-cybergold-400 hover:from-cybergold-400 hover:to-cybergold-300 text-black font-semibold shadow-lg shadow-cybergold-500/25"
            >
              Start sikker chat
              <ArrowRight className="ml-2" size={20} />
            </Button>
            <Button 
              onClick={() => subdomainNav.navigate("/login")}
              variant="outline"
              className="h-12 px-8 text-lg border-cyberblue-500/70 text-cyberblue-400 hover:bg-cyberblue-900/30"
            >
              Logg inn
            </Button>
          </div>
        </div>
      </div>

      {/* Premium Email Section - Now Secure */}
      <div className="container mx-auto px-4 py-12" id="premium-email">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-cybergold-400 via-orange-400 to-cybergold-300 bg-clip-text text-transparent">
              Premium E-post med @snakkaz.com
            </h2>
            <p className="text-cyberdark-200 text-lg max-w-3xl mx-auto">
              Oppgrader til Premium og få din egen profesjonelle @snakkaz.com e-postadresse som fungerer med alle e-postklienter
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            {/* Left Column - Features */}
            <div className="space-y-6">
              <h3 className="text-2xl font-semibold text-cybergold-300 mb-6">
                Hva får du med Premium E-post?
              </h3>
              
              <div className="space-y-4">
                <div className="flex items-start gap-4 p-4 rounded-lg bg-cyberdark-900/50 border border-cybergold-500/20">
                  <Mail className="text-cybergold-400 mt-1 flex-shrink-0" size={24} />
                  <div>
                    <h4 className="font-semibold text-cybergold-200 mb-2">Din egen @snakkaz.com adresse</h4>
                    <p className="text-cyberdark-300 text-sm">
                      Få en profesjonell e-postadresse som delnavn@snakkaz.com - perfekt for jobb og personlig bruk
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 rounded-lg bg-cyberdark-900/50 border border-green-500/20">
                  <CheckCircle className="text-green-400 mt-1 flex-shrink-0" size={24} />
                  <div>
                    <h4 className="font-semibold text-green-200 mb-2">Fungerer med alle e-postklienter</h4>
                    <p className="text-cyberdark-300 text-sm">
                      Bruk Gmail, Outlook, Apple Mail eller hvilken som helst annen e-postklient via IMAP/SMTP
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 rounded-lg bg-cyberdark-900/50 border border-cyberblue-500/20">
                  <Lock className="text-cyberblue-400 mt-1 flex-shrink-0" size={24} />
                  <div>
                    <h4 className="font-semibold text-cyberblue-200 mb-2">Sikker webmail-tilgang</h4>
                    <p className="text-cyberdark-300 text-sm">
                      Tilgang til e-post via webmail på mail.snakkaz.com med SSL-kryptering
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 rounded-lg bg-cyberdark-900/50 border border-purple-500/20">
                  <Star className="text-purple-400 mt-1 flex-shrink-0" size={24} />
                  <div>
                    <h4 className="font-semibold text-purple-200 mb-2">Profesjonell og pålitelig</h4>
                    <p className="text-cyberdark-300 text-sm">
                      99.9% oppetid, spam-beskyttelse og daglige sikkerhetskopier
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Secure Configuration Access */}
            <div className="space-y-6">
              <h3 className="text-2xl font-semibold text-cybergold-300 mb-6">
                Sikker konfigurering
              </h3>
              
              <div className="p-6 rounded-lg bg-cyberdark-800/50 border border-amber-500/30">
                <div className="flex items-start gap-3 mb-4">
                  <Shield className="text-amber-400 mt-1" size={20} />
                  <div>
                    <h4 className="font-semibold text-amber-200 mb-2">Beskyttet informasjon</h4>
                    <p className="text-cyberdark-300 text-sm">
                      E-postkonfigurasjonsdetaljer er nå beskyttet og vises kun til verifiserte Premium-brukere.
                    </p>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="bg-amber-900/20 p-3 rounded border border-amber-500/30">
                    <p className="text-xs text-amber-300">
                      <strong>Sikkerhet:</strong> For å beskytte mot misbruk vises server-detaljer kun etter innlogging og identitetsverifisering.
                    </p>
                  </div>
                  
                  <Button 
                    onClick={() => subdomainNav.navigate("/login")}
                    className="w-full bg-cyberblue-600 hover:bg-cyberblue-500 text-white font-medium"
                  >
                    <Lock className="mr-2" size={16} />
                    Logg inn for konfigurasjonsdetaljer
                  </Button>
                </div>
              </div>

              <div className="text-center">
                <Button 
                  onClick={() => subdomainNav.navigate("/premium")}
                  className="h-12 px-8 bg-gradient-to-r from-cybergold-600 to-orange-500 hover:from-cybergold-500 hover:to-orange-400 text-black font-semibold"
                >
                  <Crown className="mr-2" size={20} />
                  Oppgrader til Premium
                </Button>
                <p className="text-xs text-cyberdark-400 mt-2">
                  Kun 99 kr/måned • Kan kanselleres når som helst
                </p>
              </div>
            </div>
          </div>

          {/* Feature Comparison */}
          <div className="border border-cyberdark-700 rounded-lg overflow-hidden">
            <div className="bg-cyberdark-800/50 p-4 border-b border-cyberdark-700">
              <h3 className="text-xl font-semibold text-cyberdark-100">E-post funksjoner sammenligning</h3>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <h4 className="font-semibold text-cyberdark-300 mb-3">Snakkaz Chat</h4>
                  <ul className="space-y-2 text-sm text-cyberdark-400">
                    <li>Sikker chat i appen</li>
                    <li>Grunnleggende funksjoner</li>
                    <li>Standard lagring</li>
                  </ul>
                </div>
                <div className="text-center border border-cybergold-500/30 rounded-lg p-4 bg-cybergold-900/10">
                  <h4 className="font-semibold text-cybergold-300 mb-3">
                    <Crown className="inline mr-1" size={16} />
                    Premium Snakkaz
                  </h4>
                  <ul className="space-y-2 text-sm text-cybergold-200">
                    <li>✅ @snakkaz.com e-post</li>
                    <li>✅ Webmail tilgang</li>
                    <li>✅ IMAP/SMTP støtte</li>
                    <li>✅ Ubegrenset lagring</li>
                    <li>✅ Spam beskyttelse</li>
                  </ul>
                </div>
                <div className="text-center">
                  <h4 className="font-semibold text-cyberdark-300 mb-3">Vanlige e-post tjenester</h4>
                  <ul className="space-y-2 text-sm text-cyberdark-400">
                    <li>Kostbar domene</li>
                    <li>Komplisert oppsett</li>
                    <li>Mangler integrering</li>
                  </ul>
                </div>
              </div>
            </div>
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
