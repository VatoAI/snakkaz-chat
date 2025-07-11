import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  MessageCircle, 
  Users, 
  Smartphone, 
  Zap, 
  Shield, 
  Sparkles,
  ArrowRight,
  CheckCircle
} from 'lucide-react';

const SnakkaZBetaLanding: React.FC = () => {
  const { user } = useAuth();

  const features = [
    {
      icon: <MessageCircle className="w-6 h-6" />,
      title: "Sanntidschat",
      description: "Chat med venner og nye bekjentskaper i sanntid"
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "Grupper",
      description: "Opprett og bli med i grupper basert på interesser"
    },
    {
      icon: <Smartphone className="w-6 h-6" />,
      title: "Mobiloptimalisert",
      description: "Perfekt opplevelse på alle enheter"
    },
    {
      icon: <Sparkles className="w-6 h-6" />,
      title: "LiquidGlass UI",
      description: "Moderne glassmorphism design-system"
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Sikker",
      description: "Kryptert kommunikasjon og databeskyttelse"
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: "Rask",
      description: "Optimalisert for hastighet og ytelse"
    }
  ];

  const betaFeatures = [
    "🔥 Sanntids gruppechat",
    "📱 Responsiv mobile-first design", 
    "✨ LiquidGlass moderate effekter",
    "👥 Bruker-tilstedeværelse (online/offline)",
    "🎨 SnakkaZ cyberpunk tema",
    "⚡ Optimalisert ytelse"
  ];

  return (
    <div className="min-h-screen bg-cyberdark-950 overflow-hidden">
      {/* Background gradients */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyberblue-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cybergold-500/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10">
        {/* Header */}
        <header className="p-6">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-cybergold-500 rounded-full flex items-center justify-center">
                <MessageCircle className="w-6 h-6 text-cyberdark-950" />
              </div>
              <h1 className="text-2xl font-bold liquid-text">SnakkaZ</h1>
            </div>

            <div className="flex items-center space-x-4">
              {user ? (
                <Link to="/beta-chat">
                  <Button className="liquid-glass-moderate border-cybergold-500/30 text-cybergold-400 hover:text-white">
                    Gå til Chat
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              ) : (
                <div className="flex items-center space-x-2">
                  <Link to="/login">
                    <Button variant="ghost" className="text-cybergold-400 hover:text-white">
                      Logg inn
                    </Button>
                  </Link>
                  <Link to="/register">
                    <Button className="liquid-glass-moderate border-cybergold-500/30 text-cybergold-400 hover:text-white">
                      Registrer deg
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Hero Section */}
        <section className="py-20 px-6">
          <div className="max-w-4xl mx-auto text-center">
            <div className="mb-6">
              <Badge variant="outline" className="border-cybergold-500/50 text-cybergold-400 mb-4">
                🚀 BETA TESTING - NÅ TILGJENGELIG
              </Badge>
            </div>
            
            <h2 className="text-5xl md:text-7xl font-bold mb-6">
              <span className="liquid-text">
                Fremtidens
              </span>
              <br />
              <span className="text-white">
                Chat-plattform
              </span>
            </h2>
            
            <p className="text-xl text-cybergold-300 mb-8 max-w-2xl mx-auto">
              Test vår nye beta-versjon med avansert gruppechat, mobiloptimalisering og et helt nytt LiquidGlass design-system.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
              {user ? (
                <Link to="/beta-chat">
                  <Button size="lg" className="liquid-glass-dramatic text-white text-lg px-8 py-3">
                    Start Beta Testing
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </Link>
              ) : (
                <>
                  <Link to="/register">
                    <Button size="lg" className="liquid-glass-dramatic text-white text-lg px-8 py-3">
                      Bli med i Beta
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </Button>
                  </Link>
                  <Link to="/liquid-glass-demo">
                    <Button variant="outline" size="lg" className="border-cybergold-500/50 text-cybergold-400 hover:text-white text-lg px-8 py-3">
                      Se Design Demo
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </section>

        {/* Beta Features */}
        <section className="py-16 px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h3 className="text-3xl font-bold text-white mb-4">
                Hva du kan teste i beta
              </h3>
              <p className="text-cybergold-300 text-lg">
                Få tidlig tilgang til alle de nye funksjonene
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
              <div className="liquid-glass-moderate p-6 rounded-2xl">
                <h4 className="text-xl font-semibold text-white mb-4 flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-400 mr-2" />
                  Beta Funksjoner
                </h4>
                <ul className="space-y-2">
                  {betaFeatures.map((feature, index) => (
                    <li key={index} className="text-cybergold-300 flex items-center">
                      <span className="mr-2">{feature.split(' ')[0]}</span>
                      <span>{feature.substring(feature.indexOf(' ') + 1)}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="liquid-glass-moderate p-6 rounded-2xl">
                <h4 className="text-xl font-semibold text-white mb-4">
                  💬 Test Scenario
                </h4>
                <div className="space-y-3 text-cybergold-300">
                  <p>1. <strong>Registrer deg</strong> med din e-post</p>
                  <p>2. <strong>Utforsk chatrooms</strong> - Generell, Teknologi, Gaming, Musikk</p>
                  <p>3. <strong>Opprett grupper</strong> med venner og kolleger</p>
                  <p>4. <strong>Test på mobil</strong> - responsive design</p>
                  <p>5. <strong>Gi tilbakemelding</strong> på opplevelsen</p>
                </div>
              </div>
            </div>

            {/* Feature Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {features.map((feature, index) => (
                <Card key={index} className="liquid-glass-subtle border-cybergold-500/20">
                  <CardHeader>
                    <div className="w-12 h-12 bg-cybergold-500/20 rounded-lg flex items-center justify-center text-cybergold-400 mb-2">
                      {feature.icon}
                    </div>
                    <CardTitle className="text-white">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-cybergold-300">{feature.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-6">
          <div className="max-w-4xl mx-auto text-center">
            <div className="liquid-glass-dramatic p-8 rounded-3xl">
              <h3 className="text-3xl font-bold text-white mb-4">
                Klar for å teste fremtiden?
              </h3>
              <p className="text-cybergold-300 text-lg mb-6">
                Bli med i beta-testingen og hjelp oss å bygge den beste chat-opplevelsen.
              </p>
              
              {user ? (
                <Link to="/beta-chat">
                  <Button size="lg" className="liquid-glass-premium text-white text-xl px-12 py-4">
                    Gå til Beta Chat
                    <MessageCircle className="w-6 h-6 ml-2" />
                  </Button>
                </Link>
              ) : (
                <Link to="/register">
                  <Button size="lg" className="liquid-glass-premium text-white text-xl px-12 py-4">
                    Registrer deg nå
                    <Users className="w-6 h-6 ml-2" />
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-8 px-6 border-t border-cybergold-500/20">
          <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <div className="w-8 h-8 bg-cybergold-500 rounded-full flex items-center justify-center">
                <MessageCircle className="w-5 h-5 text-cyberdark-950" />
              </div>
              <span className="text-white font-medium">SnakkaZ Beta</span>
            </div>
            
            <div className="flex items-center space-x-6 text-cybergold-400">
              <Link to="/liquid-glass-demo" className="hover:text-white transition-colors">
                Design Demo
              </Link>
              <Link to="/info" className="hover:text-white transition-colors">
                Om oss
              </Link>
              <Badge variant="outline" className="border-cybergold-500/50 text-cybergold-400">
                v1.0.0-beta
              </Badge>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default SnakkaZBetaLanding;
