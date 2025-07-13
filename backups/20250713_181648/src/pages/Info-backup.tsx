import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ChevronLeft, MessageSquare, Shield, Lock, Globe, Home, Zap, Crown, Clock, RefreshCw, Users, Star, Tag, Gift, InfoIcon, HelpCircle, Mail, Heart, Check, ArrowRight, Smartphone, Monitor, Tablet } from "lucide-react";
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

const InfoPage = () => {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-cyberdark-950 via-cyberdark-900 to-cyberdark-950 text-white overflow-x-hidden">
      {/* Mobile-optimized header */}
      <div className="sticky top-0 z-50 backdrop-blur-lg bg-cyberdark-950/80 border-b border-cyberdark-700/30">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Button 
            variant="ghost" 
            className="text-cybergold-400 hover:bg-cybergold-900/20" 
            onClick={() => navigate("/")}
          >
            <ChevronLeft className="mr-2" size={20} /> Tilbake
          </Button>
          <h1 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-cybergold-400 to-cybergold-300 bg-clip-text text-transparent">
            🐍 SnakkaZ
          </h1>
          <Button 
            variant="outline"
            className="border-cyberblue-500/70 text-cyberblue-400 hover:bg-cyberblue-900/50 text-sm"
            onClick={() => navigate("/")}
          >
            <Home className="mr-1 md:mr-2" size={16} />
            <span className="hidden sm:inline">Hjem</span>
          </Button>
        </div>
      </div>

      {/* Hero Section - Mobile First */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-cyberblue-900/20 via-transparent to-cybergold-900/20"></div>
        <div className="container mx-auto px-4 py-8 md:py-16 relative z-10">
          {/* Hero Content */}
          <div className="text-center max-w-4xl mx-auto mb-12">
            <div className="mb-8">
              <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-4 leading-tight">
                <span className="bg-gradient-to-r from-cyberblue-400 via-cybergold-400 to-cyberblue-400 bg-clip-text text-transparent">
                  Sikker kommunikasjon
                </span>
                <br />
                <span className="text-cyberdark-100">for den moderne verden</span>
              </h2>
              <p className="text-lg md:text-xl text-cyberdark-300 mb-8 max-w-3xl mx-auto leading-relaxed">
                End-to-end kryptering møter elegant design. SnakkaZ gir deg fullstendig kontroll over din kommunikasjon,
                med sikkerhet som matcher bankenes standarder og en brukeropplevelse som overgår forventningene.
              </p>
            </div>

            {/* Trust Badges with SiteLock */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <div className="flex flex-col items-center p-4 rounded-xl bg-cyberdark-900/50 border border-green-500/20 backdrop-blur-sm">
                <Shield className="text-green-400 mb-2" size={32} />
                <span className="text-xs md:text-sm font-medium text-green-300">100% Sikker</span>
                <span className="text-xs text-cyberdark-300">Vi samler IKKE data</span>
              </div>
              <div className="flex flex-col items-center p-4 rounded-xl bg-cyberdark-900/50 border border-cyberblue-500/20 backdrop-blur-sm">
                <Lock className="text-cyberblue-400 mb-2" size={32} />
                <span className="text-xs md:text-sm font-medium text-cyberblue-300">✅ Verifisert</span>
                <span className="text-xs text-cyberdark-300">E2E Kryptering</span>
              </div>
              <div className="flex flex-col items-center p-4 rounded-xl bg-cyberdark-900/50 border border-purple-500/20 backdrop-blur-sm">
                <Users className="text-purple-400 mb-2" size={32} />
                <span className="text-xs md:text-sm font-medium text-purple-300">🏆 Community</span>
                <span className="text-xs text-cyberdark-300">Trust-system</span>
              </div>
              <div className="flex flex-col items-center p-4 rounded-xl bg-cyberdark-900/50 border border-orange-500/20 backdrop-blur-sm">
                <div className="mb-2">
                  <img 
                    src="https://shield.sitelock.com/shield/snakkaz.com" 
                    alt="SiteLock Protected" 
                    className="h-8 w-auto"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                      const nextElement = target.nextElementSibling as HTMLElement;
                      if (nextElement) {
                        nextElement.classList.remove('hidden');
                      }
                    }}
                  />
                  <Crown className="text-orange-400 hidden" size={32} />
                </div>
                <span className="text-xs md:text-sm font-medium text-orange-300">🔐 Beskyttet</span>
                <span className="text-xs text-cyberdark-300">SiteLock sikkerhet</span>
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
      </div>

      {/* SiteLock Security Section */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="p-8 rounded-2xl bg-gradient-to-r from-orange-900/30 via-cyberdark-900/50 to-red-900/30 border border-orange-500/20 backdrop-blur-sm">
            <div className="text-center mb-8">
              <h3 className="text-2xl md:text-3xl font-bold mb-4 text-orange-300">
                🛡️ Beskyttet av SiteLock sikkerhet
              </h3>
              <p className="text-lg text-cyberdark-300 max-w-2xl mx-auto">
                SnakkaZ er beskyttet av profesjonell SiteLock sikkerhet med kontinuerlig overvåking, 
                automatisk malware-fjerning og sanntids trussel-beskyttelse.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div className="text-center p-4 rounded-xl bg-cyberdark-900/50 border border-green-500/20">
                <div className="text-3xl mb-2">🔍</div>
                <div className="text-sm font-medium text-green-300">Kontinuerlig skanning</div>
                <div className="text-xs text-gray-400 mt-1">24/7 overvåking</div>
              </div>
              <div className="text-center p-4 rounded-xl bg-cyberdark-900/50 border border-blue-500/20">
                <div className="text-3xl mb-2">🦠</div>
                <div className="text-sm font-medium text-blue-300">Malware-beskyttelse</div>
                <div className="text-xs text-gray-400 mt-1">Automatisk fjerning</div>
              </div>
              <div className="text-center p-4 rounded-xl bg-cyberdark-900/50 border border-orange-500/20">
                <div className="text-3xl mb-2">🔐</div>
                <div className="text-sm font-medium text-orange-300">SSL overvåking</div>
                <div className="text-xs text-gray-400 mt-1">Sertifikat-sikkerhet</div>
              </div>
            </div>

            <div className="text-center">
              <a 
                href="#" 
                onClick={(e) => {
                  e.preventDefault();
                  window.open('https://www.sitelock.com/verify.php?site=snakkaz.com','SiteLock','width=600,height=600,left=160,top=170');
                }}
                className="inline-block"
              >
                <img 
                  src="https://shield.sitelock.com/shield/snakkaz.com" 
                  alt="SiteLock Verified" 
                  className="h-12 w-auto mx-auto hover:scale-105 transition-transform duration-200"
                />
              </a>
              <p className="text-xs text-cyberdark-400 mt-2">
                Klikk på logoen for å verifisere vår sikkerhetsstatus
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Why Choose SnakkaZ - Mobile Optimized */}
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h3 className="text-2xl md:text-3xl font-bold mb-4 text-cyberdark-100">
            Ny her? Les hvorfor SnakkaZ er ditt beste valg
          </h3>
          <p className="text-cyberdark-300 text-lg max-w-3xl mx-auto">
            Oppdag hvorfor tusenvis av brukere stoler på SnakkaZ for sin daglige kommunikasjon
          </p>
        </div>

        {/* Feature Grid - Mobile First */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto mb-12">
          {/* Security First Card */}
          <div className="group relative">
            <div className="absolute inset-0 bg-gradient-to-r from-green-500/10 to-cyberblue-500/10 rounded-2xl blur-xl group-hover:blur-lg transition-all duration-300"></div>
            <div className="relative p-6 md:p-8 rounded-2xl bg-cyberdark-900/80 border border-cyberdark-700/50 backdrop-blur-sm hover:border-green-500/30 transition-all duration-300">
              <div className="flex items-center mb-6">
                <div className="p-3 rounded-xl bg-green-500/20 mr-4">
                  <Shield className="text-green-400" size={28} />
                </div>
                <h4 className="text-xl md:text-2xl font-bold text-green-300">Sikkerhet først</h4>
              </div>
              <p className="text-cyberdark-300 mb-6 text-lg leading-relaxed">
                Militærgrads end-to-end kryptering beskyttet av SiteLock sikkerhetssystem beskytter alle dine samtaler. 
                Vi kan ikke lese meldingene dine, og ingen andre kan det heller.
              </p>
              <div className="space-y-3">
                <div className="flex items-center">
                  <Check className="text-green-400 mr-3 flex-shrink-0" size={20} />
                  <span className="text-cyberdark-200">Ingen datainnsamling av personlig informasjon</span>
                </div>
                <div className="flex items-center">
                  <Check className="text-green-400 mr-3 flex-shrink-0" size={20} />
                  <span className="text-cyberdark-200">WebRTC P2P-forbindelser for direktekommunikasjon</span>
                </div>
                <div className="flex items-center">
                  <Check className="text-green-400 mr-3 flex-shrink-0" size={20} />
                  <span className="text-cyberdark-200">SiteLock kontinuerlig overvåking og malware-beskyttelse</span>
                </div>
                <div className="flex items-center">
                  <Check className="text-green-400 mr-3 flex-shrink-0" size={20} />
                  <span className="text-cyberdark-200">Automatisk sletting av sensitive data</span>
                </div>
              </div>
            </div>
          </div>

          {/* Modern Design Card */}
          <div className="group relative">
            <div className="absolute inset-0 bg-gradient-to-r from-cyberblue-500/10 to-cybergold-500/10 rounded-2xl blur-xl group-hover:blur-lg transition-all duration-300"></div>
            <div className="relative p-6 md:p-8 rounded-2xl bg-cyberdark-900/80 border border-cyberdark-700/50 backdrop-blur-sm hover:border-cyberblue-500/30 transition-all duration-300">
              <div className="flex items-center mb-6">
                <div className="p-3 rounded-xl bg-cyberblue-500/20 mr-4">
                  <Zap className="text-cyberblue-400" size={28} />
                </div>
                <h4 className="text-xl md:text-2xl font-bold text-cyberblue-300">Moderne opplevelse</h4>
              </div>
              <p className="text-cyberdark-300 mb-6 text-lg leading-relaxed">
                Elegant design som fungerer sømløst på alle enheter. Lynrask, intuitiv og bygget for hvordan du kommuniserer i dag.
              </p>
              <div className="space-y-3">
                <div className="flex items-center">
                  <Check className="text-cyberblue-400 mr-3 flex-shrink-0" size={20} />
                  <span className="text-cyberdark-200">Responsiv design for mobil, tablet og desktop</span>
                </div>
                <div className="flex items-center">
                  <Check className="text-cyberblue-400 mr-3 flex-shrink-0" size={20} />
                  <span className="text-cyberdark-200">Sanntids-synkronisering mellom alle enheter</span>
                </div>
                <div className="flex items-center">
                  <Check className="text-cyberblue-400 mr-3 flex-shrink-0" size={20} />
                  <span className="text-cyberdark-200">Offline-støtte og intelligente varsler</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Device Compatibility */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto text-center">
          <h3 className="text-2xl md:text-3xl font-bold mb-8 text-cyberdark-100">
            Perfekt på alle dine enheter
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="p-6 rounded-xl bg-cyberdark-900/50 border border-cyberdark-700/30">
              <Smartphone className="mx-auto mb-4 text-cybergold-400" size={48} />
              <h4 className="text-lg font-semibold mb-2 text-cyberdark-100">Mobilvennlig</h4>
              <p className="text-cyberdark-300 text-sm">Touch-optimert grensesnitt designet for moderne smartphones</p>
            </div>
            <div className="p-6 rounded-xl bg-cyberdark-900/50 border border-cyberdark-700/30">
              <Tablet className="mx-auto mb-4 text-cybergold-400" size={48} />
              <h4 className="text-lg font-semibold mb-2 text-cyberdark-100">Tablet-ready</h4>
              <p className="text-cyberdark-300 text-sm">Skalerbart design som utnytter større skjermer optimalt</p>
            </div>
            <div className="p-6 rounded-xl bg-cyberdark-900/50 border border-cyberdark-700/30">
              <Monitor className="mx-auto mb-4 text-cybergold-400" size={48} />
              <h4 className="text-lg font-semibold mb-2 text-cyberdark-100">Desktop-kraftig</h4>
              <p className="text-cyberdark-300 text-sm">Fullverdig opplevelse med avanserte funksjoner for produktivitet</p>
            </div>
          </div>
        </div>
      </div>

      {/* Final Call-to-Action Section */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-cyberblue-900/40 via-cyberdark-900/50 to-cybergold-900/40 border border-cyberblue-500/30 backdrop-blur-sm">
            <div className="absolute inset-0 bg-gradient-to-r from-cyberblue-500/10 via-transparent to-cybergold-500/10"></div>
            <div className="relative p-8 md:p-12 text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-6 bg-gradient-to-r from-cyberblue-400 via-white to-cybergold-400 bg-clip-text text-transparent">
                Klar til å ta kontrollen over din kommunikasjon?
              </h2>
              <p className="text-xl text-cyberdark-200 mb-8 max-w-2xl mx-auto leading-relaxed">
                Bli med i tusenvis av brukere som allerede har oppdaget fremtiden for sikker kommunikasjon.
                Start din reise med SnakkaZ i dag.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
                <Button 
                  onClick={() => navigate("/register")}
                  className="h-14 px-8 text-lg bg-gradient-to-r from-cybergold-500 to-cybergold-400 hover:from-cybergold-400 hover:to-cybergold-300 text-black font-semibold shadow-lg shadow-cybergold-500/25 transform hover:scale-105 transition-all duration-200"
                >
                  <Crown className="mr-2" size={20} />
                  Opprett konto gratis
                </Button>
                <Button 
                  onClick={() => navigate("/login")}
                  variant="outline"
                  className="h-14 px-8 text-lg border-cyberblue-500/70 text-cyberblue-400 hover:bg-cyberblue-900/30 transform hover:scale-105 transition-all duration-200"
                >
                  <MessageSquare className="mr-2" size={20} />
                  Allerede medlem? Logg inn
                </Button>
              </div>
              
              <div className="text-center">
                <p className="text-cyberdark-300 text-sm mb-2">
                  🔒 100% sikker • ⚡ Lynrask • 🌍 Tilgjengelig overalt
                </p>
                <p className="text-cyberdark-400 text-xs">
                  Ingen skjulte kostnader eller forpliktelser. Start med alle grunnleggende funksjoner inkludert.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Premium Footer */}
      <footer className="bg-cyberdark-950 border-t border-cyberdark-800 mt-16">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            {/* SnakkaZ Brand */}
            <div className="md:col-span-1">
              <h3 className="text-2xl font-bold mb-4 bg-gradient-to-r from-cybergold-400 to-cyberblue-400 bg-clip-text text-transparent">
                🐍 SnakkaZ
              </h3>
              <p className="text-cyberdark-300 text-sm mb-4">
                Sikker kommunikasjon for den moderne verden. End-to-end kryptering møter elegant design.
              </p>
              <div className="flex space-x-4">
                <Shield className="text-green-400" size={20} />
                <Lock className="text-cyberblue-400" size={20} />
                <Crown className="text-cybergold-400" size={20} />
              </div>
            </div>
            
            {/* Produkt */}
            <div>
              <h4 className="text-lg font-semibold text-white mb-4">Produkt</h4>
              <ul className="space-y-2 text-cyberdark-300 text-sm">
                <li><button onClick={() => navigate("/")} className="hover:text-cyberblue-400 transition-colors">Hjem</button></li>
                <li><button onClick={() => navigate("/register")} className="hover:text-cyberblue-400 transition-colors">Registrer deg</button></li>
                <li><button onClick={() => navigate("/login")} className="hover:text-cyberblue-400 transition-colors">Logg inn</button></li>
                <li><button onClick={() => navigate("/subscription")} className="hover:text-cyberblue-400 transition-colors">Premium abonnement</button></li>
              </ul>
            </div>
            
            {/* Support */}
            <div>
              <h4 className="text-lg font-semibold text-white mb-4">Support</h4>
              <ul className="space-y-2 text-cyberdark-300 text-sm">
                <li><a href="#" className="hover:text-cyberblue-400 transition-colors">Hjelp</a></li>
                <li><a href="#" className="hover:text-cyberblue-400 transition-colors">Sikkerhet</a></li>
                <li><a href="#" className="hover:text-cyberblue-400 transition-colors">Personvern</a></li>
                <li><a href="#" className="hover:text-cyberblue-400 transition-colors">Vilkår</a></li>
              </ul>
            </div>
            
            {/* Kontakt */}
            <div>
              <h4 className="text-lg font-semibold text-white mb-4">Kontakt</h4>
              <ul className="space-y-2 text-cyberdark-300 text-sm">
                <li className="flex items-center">
                  <Mail className="mr-2" size={16} />
                  <span>support@snakkaz.com</span>
                </li>
                <li className="flex items-center">
                  <Shield className="mr-2" size={16} />
                  <span>security@snakkaz.com</span>
                </li>
                <li className="flex items-center">
                  <Globe className="mr-2" size={16} />
                  <span>Tilgjengelig 24/7</span>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-cyberdark-800 pt-8 text-center">
            <p className="text-cyberdark-400 text-sm">
              © 2025 SnakkaZ. Alle rettigheter reservert. Bygget med ❤️ for sikker kommunikasjon.
            </p>
            <p className="text-cyberdark-500 text-xs mt-2">
              End-to-end kryptering • Zero-knowledge arkitektur • Open source sikkerhet • SiteLock beskyttet
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default InfoPage;
