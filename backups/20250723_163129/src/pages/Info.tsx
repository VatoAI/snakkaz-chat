import React from 'react';
import { Shield, Users, ArrowRight, Star, Crown, Zap, Sparkles, Rocket, MessageCircle, Globe, Heart } from 'lucide-react';

export const Info: React.FC = () => {

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyberdark-950 via-cyberdark-900 to-cyberdark-800 overflow-hidden">
      {/* Animated background elements */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute top-20 left-20 w-72 h-72 bg-cybergold-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-cyberblue-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      <div className="container mx-auto px-6 py-8 relative">
        <div className="max-w-6xl mx-auto">
          {/* Hero Section - Completely redesigned */}
          <div className="text-center mb-16 relative">
            <div className="liquid-glass-dramatic p-12 rounded-3xl border border-cybergold-500/30 mb-8 backdrop-blur-xl">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-cybergold-500/20 rounded-full border border-cybergold-500/50 mb-6">
                <Sparkles className="text-cybergold-400" size={16} />
                <span className="text-cybergold-300 text-sm font-medium">BETA LANSERING</span>
                <Sparkles className="text-cybergold-400" size={16} />
              </div>
              
              <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-cybergold-400 via-white to-cyberblue-400 bg-clip-text text-transparent leading-tight">
                SnakkaZ Beta
              </h1>
              
              <p className="text-2xl md:text-3xl font-light mb-6 text-white/90 leading-relaxed">
                Fremtidens chat er her
              </p>
              
              <p className="text-xl text-cybergold-200 max-w-3xl mx-auto leading-relaxed mb-8">
                Opplev next-generation real-time chat med LiquidGlass design, banknivå sikkerhet og AI-drevne funksjoner. 
                Bygget for deg som krever det beste.
              </p>

              <div className="flex flex-wrap justify-center gap-4 text-lg">
                <div className="flex items-center gap-2 px-4 py-2 liquid-glass-subtle rounded-full">
                  <Rocket className="text-cybergold-400" size={20} />
                  <span className="text-white">Real-time chat</span>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 liquid-glass-subtle rounded-full">
                  <Shield className="text-cyberblue-400" size={20} />
                  <span className="text-white">End-to-end kryptering</span>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 liquid-glass-subtle rounded-full">
                  <Sparkles className="text-purple-400" size={20} />
                  <span className="text-white">LiquidGlass UI</span>
                </div>
              </div>
            </div>

            {/* CTA Buttons - Enhanced */}
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <div className="h-16 px-12 text-xl liquid-glass-moderate bg-gradient-to-r from-cybergold-600 to-cybergold-500 hover:from-cybergold-500 hover:to-cybergold-400 text-black font-bold shadow-2xl shadow-cybergold-500/50 border border-cybergold-400/50 group rounded-2xl flex items-center justify-center cursor-pointer transition-all">
                <Rocket className="mr-3 group-hover:animate-bounce" size={24} />
                Bli med i Beta
                <ArrowRight className="ml-3 group-hover:translate-x-1 transition-transform" size={24} />
              </div>
              <div className="h-16 px-12 text-xl liquid-glass-subtle border border-cyberblue-500/70 text-cyberblue-300 hover:bg-cyberblue-900/30 hover:text-white rounded-2xl flex items-center justify-center cursor-pointer transition-all">
                <Users className="mr-3" size={24} />
                Logg inn
              </div>
              <a 
                href="/invite-demo" 
                className="h-16 px-12 text-xl liquid-glass-subtle border border-purple-500/70 text-purple-300 hover:bg-purple-900/30 hover:text-white rounded-2xl flex items-center justify-center cursor-pointer transition-all"
              >
                <Sparkles className="mr-3" size={24} />
                Se Invitasjonssystem
              </a>
            </div>
          </div>

          {/* What is SnakkaZ Beta Section */}
          <div className="mb-16">
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-cybergold-400 via-white to-cyberblue-400 bg-clip-text text-transparent">
                Hva er SnakkaZ Beta?
              </h2>
              <p className="text-xl text-cybergold-200 max-w-4xl mx-auto leading-relaxed">
                Vi bygger fremtidens kommunikasjonsplattform. Beta-versjonen gir deg early access til revolusjonerende chat-teknologi.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Feature Cards with LiquidGlass */}
              <div className="liquid-glass-moderate p-8 rounded-2xl border border-cybergold-500/30 hover:border-cybergold-400/50 transition-all duration-300 group">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-cybergold-500 to-cybergold-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                    <MessageCircle className="text-black" size={32} />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4">Real-time Chat</h3>
                  <p className="text-cybergold-200 leading-relaxed">
                    Lynrask meldinger med null latency. Opplev samtaler som flyter naturlig med våre optimaliserte servere.
                  </p>
                </div>
              </div>

              <div className="liquid-glass-moderate p-8 rounded-2xl border border-cyberblue-500/30 hover:border-cyberblue-400/50 transition-all duration-300 group">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-cyberblue-500 to-cyberblue-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                    <Sparkles className="text-white" size={32} />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4">LiquidGlass Design</h3>
                  <p className="text-cyberblue-200 leading-relaxed">
                    Revolusjonerende glassmorphism UI som tilpasser seg dine preferanser. Vakkert, moderne og intuitivt.
                  </p>
                </div>
              </div>

              <div className="liquid-glass-moderate p-8 rounded-2xl border border-purple-500/30 hover:border-purple-400/50 transition-all duration-300 group">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                    <Shield className="text-white" size={32} />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4">Banknivå Sikkerhet</h3>
                  <p className="text-purple-200 leading-relaxed">
                    End-to-end kryptering, zero-knowledge arkitektur og åpen kildekode. Dine samtaler er 100% private.
                  </p>
                </div>
              </div>

              <div className="liquid-glass-moderate p-8 rounded-2xl border border-green-500/30 hover:border-green-400/50 transition-all duration-300 group">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                    <Users className="text-white" size={32} />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4">Smart Grupper</h3>
                  <p className="text-green-200 leading-relaxed">
                    Opprett og administrer grupper med avanserte tillatelser. Perfekt for team, venner og familie.
                  </p>
                </div>
              </div>

              <div className="liquid-glass-moderate p-8 rounded-2xl border border-orange-500/30 hover:border-orange-400/50 transition-all duration-300 group">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                    <Globe className="text-white" size={32} />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4">Cross-Platform</h3>
                  <p className="text-orange-200 leading-relaxed">
                    Fungerer perfekt på mobil, desktop og nettbrett. En enhetlig opplevelse overalt.
                  </p>
                </div>
              </div>

              <div className="liquid-glass-moderate p-8 rounded-2xl border border-pink-500/30 hover:border-pink-400/50 transition-all duration-300 group">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-pink-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                    <Heart className="text-white" size={32} />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4">Community First</h3>
                  <p className="text-pink-200 leading-relaxed">
                    Bygget med og for community. Din tilbakemelding former fremtiden til SnakkaZ.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Beta Launch Information */}
          <div className="mb-16">
            <div className="liquid-glass-dramatic p-12 rounded-3xl border border-cybergold-500/30 text-center">
              <div className="inline-flex items-center gap-2 px-6 py-3 bg-cybergold-500/20 rounded-full border border-cybergold-500/50 mb-8">
                <Star className="text-cybergold-400" size={20} />
                <span className="text-cybergold-300 text-lg font-medium">BETA TESTING PROGRAM</span>
                <Star className="text-cybergold-400" size={20} />
              </div>
              
              <h2 className="text-4xl font-bold mb-6 text-white">
                Bli en del av fremtiden
              </h2>
              
              <p className="text-xl text-cybergold-200 max-w-3xl mx-auto mb-8 leading-relaxed">
                Som beta-tester får du early access til cutting-edge funksjoner, direkte innflytelse på utviklingen, 
                og en unik mulighet til å forme fremtidens kommunikasjonsplattform.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="liquid-glass-subtle p-6 rounded-xl">
                  <Zap className="text-cybergold-400 mx-auto mb-4" size={32} />
                  <h3 className="text-lg font-bold text-white mb-2">Early Access</h3>
                  <p className="text-cybergold-200 text-sm">Først til å teste nye funksjoner</p>
                </div>
                
                <div className="liquid-glass-subtle p-6 rounded-xl">
                  <Users className="text-cyberblue-400 mx-auto mb-4" size={32} />
                  <h3 className="text-lg font-bold text-white mb-2">Direkte Feedback</h3>
                  <p className="text-cyberblue-200 text-sm">Din mening former produktet</p>
                </div>
                
                <div className="liquid-glass-subtle p-6 rounded-xl">
                  <Crown className="text-purple-400 mx-auto mb-4" size={32} />
                  <h3 className="text-lg font-bold text-white mb-2">VIP Status</h3>
                  <p className="text-purple-200 text-sm">Eksklusiv tilgang og fordeler</p>
                </div>
              </div>
            </div>
          </div>

          {/* Why Choose SnakkaZ */}
          <div className="mb-16">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold mb-6 bg-gradient-to-r from-cybergold-400 via-white to-cyberblue-400 bg-clip-text text-transparent">
                Hvorfor SnakkaZ?
              </h2>
              <p className="text-xl text-cybergold-200 max-w-4xl mx-auto leading-relaxed">
                Vi bygger ikke bare en chat-app, vi bygger fremtidens kommunikasjonsplattform
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="liquid-glass-moderate p-8 rounded-2xl border border-green-500/30">
                <h3 className="text-2xl font-bold text-green-400 mb-4 flex items-center">
                  <Shield className="mr-3" size={28} />
                  Privacy First
                </h3>
                <p className="text-green-200 leading-relaxed mb-4">
                  Zero-knowledge arkitektur betyder at selv vi ikke kan lese meldingene dine. 
                  End-to-end kryptering på alt.
                </p>
                <ul className="space-y-2 text-green-300">
                  <li>• Ingen datamining eller sporing</li>
                  <li>• Open source sikkerhet</li>
                  <li>• GDPR og CCPA compliant</li>
                </ul>
              </div>
              
              <div className="liquid-glass-moderate p-8 rounded-2xl border border-cyberblue-500/30">
                <h3 className="text-2xl font-bold text-cyberblue-400 mb-4 flex items-center">
                  <Zap className="mr-3" size={28} />
                  Performance
                </h3>
                <p className="text-cyberblue-200 leading-relaxed mb-4">
                  Bygget med moderne teknologi for optimal hastighet og pålitelighet. 
                  Meldinger leveres på millisekunder.
                </p>
                <ul className="space-y-2 text-cyberblue-300">
                  <li>• Edge-optimaliserte servere</li>
                  <li>• 99.9% oppetid garanti</li>
                  <li>• Global CDN nettverk</li>
                </ul>
              </div>
              
              <div className="liquid-glass-moderate p-8 rounded-2xl border border-purple-500/30">
                <h3 className="text-2xl font-bold text-purple-400 mb-4 flex items-center">
                  <Sparkles className="mr-3" size={28} />
                  Innovation
                </h3>
                <p className="text-purple-200 leading-relaxed mb-4">
                  LiquidGlass design, AI-assistert kommunikasjon og funksjoner som ikke finnes andre steder.
                </p>
                <ul className="space-y-2 text-purple-300">
                  <li>• Revolusjonerende UI/UX</li>
                  <li>• AI-drevne funksjoner</li>
                  <li>• Kontinuerlig innovasjon</li>
                </ul>
              </div>
              
              <div className="liquid-glass-moderate p-8 rounded-2xl border border-orange-500/30">
                <h3 className="text-2xl font-bold text-orange-400 mb-4 flex items-center">
                  <Heart className="mr-3" size={28} />
                  Community
                </h3>
                <p className="text-orange-200 leading-relaxed mb-4">
                  Bygget av utviklere som bryr seg, for et community som verdsetter kvalitet og personvern.
                </p>
                <ul className="space-y-2 text-orange-300">
                  <li>• Community-drevet utvikling</li>
                  <li>• Transparent roadmap</li>
                  <li>• Direkte tilgang til utviklerne</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modern Footer */}
      <footer className="relative">
        <div className="liquid-glass-dramatic border-t border-cybergold-500/30">
          <div className="container mx-auto px-6 py-12">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-8">
                <h3 className="text-3xl font-bold mb-4 bg-gradient-to-r from-cybergold-400 to-cyberblue-400 bg-clip-text text-transparent">
                  SnakkaZ Beta
                </h3>
                <p className="text-cybergold-200 text-lg">
                  Fremtidens kommunikasjon starter her
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
                <div className="text-center">
                  <Shield className="text-cybergold-400 mx-auto mb-3" size={32} />
                  <h4 className="font-semibold text-white mb-2">100% Sikker</h4>
                  <p className="text-cyberdark-300 text-sm">End-to-end kryptering på alt</p>
                </div>
                
                <div className="text-center">
                  <Zap className="text-cyberblue-400 mx-auto mb-3" size={32} />
                  <h4 className="font-semibold text-white mb-2">Lynrask</h4>
                  <p className="text-cyberdark-300 text-sm">Millisekund responstid</p>
                </div>
                
                <div className="text-center">
                  <Heart className="text-pink-400 mx-auto mb-3" size={32} />
                  <h4 className="font-semibold text-white mb-2">Community</h4>
                  <p className="text-cyberdark-300 text-sm">Bygget for og med brukerne</p>
                </div>
              </div>
              
              <div className="text-center border-t border-cybergold-500/30 pt-8">
                <p className="text-cyberdark-400 mb-2">
                  © 2025 SnakkaZ Beta. Alle rettigheter reservert.
                </p>
                <p className="text-cyberdark-500 text-sm">
                  End-to-end kryptering • Zero-knowledge arkitektur • Open source sikkerhet
                </p>
                <div className="flex justify-center items-center gap-2 mt-4">
                  <Sparkles className="text-cybergold-400" size={16} />
                  <span className="text-cybergold-400 text-sm font-medium">Bygget med LiquidGlass Design System</span>
                  <Sparkles className="text-cybergold-400" size={16} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Info;
