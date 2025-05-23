import { Header } from "@/components/index/Header";
import { Footer } from "@/components/index/Footer";
import { useIsMobile } from "@/hooks/use-mobile";
import { ProjectGrid } from "@/components/index/ProjectGrid";
import { ProgressSection } from "@/components/index/ProgressSection";
import { SyncDashboard } from "@/components/sync/SyncDashboard";
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { 
  Download, X, Info, Smartphone, Laptop, MessageCircle, 
  Shield, Clock, Users, Zap, Lock, Star, QrCode,
  Mail, CheckCircle, Bell, UserCircle, Globe, 
  UserPlus, Gift, Crown, Smartphone as MobileIcon,
  Image, Heart, LucideIcon
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

// BeforeInstallPromptEvent type definition
interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

// Feature highlight components
const FeatureCard = ({ icon: Icon, title, description }: { 
  icon: LucideIcon, 
  title: string, 
  description: string 
}) => (
  <div className="bg-card rounded-lg p-6 flex flex-col items-center text-center transition-all hover:shadow-lg hover:bg-cyberdark-800">
    <div className="bg-primary/10 p-4 rounded-full mb-4">
      <Icon className="h-6 w-6 text-primary" />
    </div>
    <h3 className="text-lg font-semibold mb-2">{title}</h3>
    <p className="text-muted-foreground text-sm">{description}</p>
  </div>
);

// New component for premium features
const PremiumFeatureCard = ({ icon: Icon, title, description }: { 
  icon: LucideIcon, 
  title: string, 
  description: string 
}) => (
  <div className="bg-gradient-to-br from-cyberdark-900 to-cyberdark-800 rounded-lg p-6 border border-cybergold-500/30 flex flex-col items-center text-center transition-all hover:shadow-lg">
    <div className="bg-cybergold-500/20 p-4 rounded-full mb-4">
      <Icon className="h-6 w-6 text-cybergold-400" />
    </div>
    <h3 className="text-lg font-semibold mb-2 text-cybergold-300">{title}</h3>
    <p className="text-cybergold-600 text-sm">{description}</p>
  </div>
);

// New component for testimonials
const Testimonial = ({ quote, author, role }: { quote: string, author: string, role: string }) => (
  <div className="bg-cyberdark-800/50 p-6 rounded-xl border border-cyberblue-500/20">
    <p className="italic text-gray-300 mb-4">"{quote}"</p>
    <div>
      <p className="font-medium text-cyberblue-400">{author}</p>
      <p className="text-xs text-gray-400">{role}</p>
    </div>
  </div>
);

const Index = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [showDownloadDialog, setShowDownloadDialog] = useState(false);
  const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isPWAInstalled, setIsPWAInstalled] = useState(false);
  const [showInstallTip, setShowInstallTip] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const { data } = await supabase.auth.getSession();
        setIsLoggedIn(!!data.session);
      } catch (error) {
        console.error("Feil ved sjekk av innloggingsstatus:", error);
      } finally {
        setIsCheckingAuth(false);
      }
    };

    checkAuthStatus();
  }, []);

  useEffect(() => {
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsPWAInstalled(true);
    }

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setInstallPrompt(e as BeforeInstallPromptEvent);

      setTimeout(() => {
        if (!isPWAInstalled) {
          setShowInstallTip(true);
        }
      }, 5000);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, [isPWAInstalled]);

  const handleInstallClick = async () => {
    if (installPrompt) {
      try {
        await installPrompt.prompt();
        const choiceResult = await installPrompt.userChoice;

        if (choiceResult.outcome === 'accepted') {
          toast({
            title: "Installasjon startet",
            description: "Takk for at du installerer SnakkaZ Hub!",
          });
          setIsPWAInstalled(true);
        }

        setInstallPrompt(null);
      } catch (err) {
        console.error('Installation error:', err);
        toast({
          title: "Installasjonen mislyktes",
          description: "Prøv å oppdatere siden og prøv på nytt.",
          variant: "destructive",
        });
      }
    }

    setShowDownloadDialog(false);
  };

  const handleStartSnakkaZ = () => {
    if (isLoggedIn) {
      navigate('/chat');
    } else {
      navigate('/login', { state: { redirectTo: '/chat' } });
    }
  };

  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as Window & { MSStream?: unknown }).MSStream;

  return (
    <div className="bg-cyberdark-950 min-h-screen overflow-x-hidden">
      <div className="relative min-h-screen flex flex-col p-2 md:p-4">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-1/4 w-72 md:w-96 h-72 md:h-96 bg-gradient-to-r from-cyberblue-500/30 to-transparent rounded-full filter blur-3xl animate-pulse-slow"></div>
          <div className="absolute bottom-0 right-1/4 w-72 md:w-96 h-72 md:h-96 bg-gradient-to-l from-red-500/30 to-transparent rounded-full filter blur-3xl animate-pulse-slow delay-200"></div>
          <div className="absolute top-1/3 right-1/4 w-48 h-48 bg-cyberblue-400/10 rounded-full filter blur-2xl animate-pulse-slow delay-300"></div>
          <div className="absolute bottom-1/4 left-1/3 w-40 h-40 bg-red-300/10 rounded-full filter blur-xl animate-pulse-slow delay-500"></div>
          <div className="absolute inset-0 bg-gradient-to-br from-cyberblue-900/5 via-transparent to-red-900/5 pointer-events-none"></div>
        </div>

        <div className="container mx-auto px-2 md:px-4 relative z-10 flex-grow">
          <Header />

          {/* Hero Section */}
          <div className="mt-8 mb-12">
            <div className="max-w-4xl mx-auto text-center">
              <div className="mb-6 flex justify-center">
                <img 
                  src="/snakkaz-logo.png" 
                  alt="SnakkaZ Logo" 
                  className="h-24 w-24 rounded-full border-2 p-1"
                  style={{ borderImage: "linear-gradient(90deg, #1a9dff, #d62828) 1" }}
                />
              </div>
              
              <h1
                className="text-3xl md:text-4xl font-bold mb-4"
                style={{
                  background: 'linear-gradient(90deg, #1a9dff 0%, #ffffff 50%, #d62828 100%)',
                  WebkitBackgroundClip: 'text',
                  backgroundClip: 'text',
                  color: 'transparent',
                  textShadow: '0 0 15px rgba(26,157,255,0.3)'
                }}
              >
                SnakkaZ Hub - Sikker Kommunikasjon
              </h1>
              
              <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
                Velkommen til neste generasjons messaging app - der sikkerhet, 
                hastighet og personvern står i fokus. Kommuniser fritt uten å bekymre deg.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
                <Button
                  onClick={handleStartSnakkaZ}
                  disabled={isCheckingAuth}
                  className="py-6 text-lg font-semibold rounded-lg shadow-glow transition-all duration-300 w-full sm:w-auto"
                  style={{
                    background: 'linear-gradient(135deg, #1a9dff 0%, #3b82f6 50%, #d62828 100%)',
                    boxShadow: '0 0 15px rgba(26,157,255,0.5), 0 0 15px rgba(214,40,40,0.5)'
                  }}
                >
                  <MessageCircle className="mr-2" size={24} />
                  {isCheckingAuth ? 'Laster...' : isLoggedIn ? 'Åpne SnakkaZ Chat' : 'Logg inn til SnakkaZ Chat'}
                </Button>
                
                {!isPWAInstalled && (
                  <Button
                    onClick={() => setShowDownloadDialog(true)}
                    variant="outline"
                    className="py-6 text-lg font-semibold rounded-lg border-cyberblue-500/70 text-cyberblue-400 hover:bg-cyberblue-900/50 w-full sm:w-auto"
                  >
                    <Download className="mr-2" size={24} />
                    Installer App
                  </Button>
                )}
              </div>

              <div className="flex justify-center gap-4 mb-4">
                <Badge variant="outline" className="bg-cyberdark-800/80 border-cyberblue-500/30 py-1.5">
                  <Shield size={14} className="mr-1 text-green-500" /> End-to-End Kryptert
                </Badge>
                <Badge variant="outline" className="bg-cyberdark-800/80 border-red-500/30 py-1.5">
                  <Clock size={14} className="mr-1 text-red-500" /> Selvdestruerende Meldinger
                </Badge>
              </div>
            </div>
          </div>

          {/* App Features */}
          <div className="max-w-4xl mx-auto my-12 px-4">
            <h2 className="text-2xl font-bold text-center mb-3 bg-gradient-to-r from-cyberblue-400 to-cybergold-400 bg-clip-text text-transparent">
              Hvorfor velge SnakkaZ?
            </h2>
            <p className="text-center text-gray-400 mb-8 max-w-2xl mx-auto">
              Vi kombinerer banebrytende teknologi med brukervennlig design for å gi deg den beste og sikreste kommunikasjonsplattformen.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <FeatureCard 
                icon={Shield} 
                title="End-to-End Kryptert" 
                description="Full kryptering av både tekst og mediefiler. Ingen kan lese dine meldinger, ikke engang oss." 
              />
              <FeatureCard 
                icon={Clock} 
                title="Selvdestruerende Meldinger" 
                description="Sett tidsfrist for når meldinger og bilder skal slettes automatisk for maksimal sikkerhet." 
              />
              <FeatureCard 
                icon={MessageCircle} 
                title="P2P Kommunikasjon" 
                description="Direkte kommunikasjon mellom brukere uten mellomledd når begge er online." 
              />
              <FeatureCard 
                icon={Users} 
                title="Gruppechatter" 
                description="Opprett og administrer sikre gruppechatter med venner og kolleger. Del filer, meldinger og planlegg arrangementer." 
              />
              <FeatureCard 
                icon={Zap} 
                title="Rask og Stabil" 
                description="Opplev lynrask meldingslevering og stabil tilkobling selv under dårlige nettverksforhold." 
              />
              <FeatureCard 
                icon={Lock} 
                title="Personvern i Fokus" 
                description="Vi samler ingen data om deg. Dine meldinger er kun dine. Ingen annonsesporing eller profilering." 
              />
            </div>
          </div>
          
          {/* New Features Section */}
          <div className="max-w-4xl mx-auto my-16 px-4">
            <div className="text-center mb-12">
              <Badge className="mb-3 bg-cyberblue-900/50 text-cyberblue-400 border-cyberblue-500/30">
                Nye Funksjoner
              </Badge>
              <h2 className="text-2xl font-bold mb-3 bg-gradient-to-r from-cyberblue-400 to-white bg-clip-text text-transparent">
                Konstant Forbedring for Deg
              </h2>
              <p className="text-gray-400 max-w-2xl mx-auto">
                Vi jobber kontinuerlig for å forbedre SnakkaZ med nye funksjoner som gjør kommunikasjonen din mer effektiv, sikker og morsom.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              <div className="bg-cyberdark-800/50 rounded-lg p-6 border border-cyberblue-500/20">
                <Users className="h-8 w-8 text-cyberblue-400 mb-4" />
                <h3 className="text-lg font-semibold mb-2 text-white">Forbedret Gruppechat</h3>
                <p className="text-gray-400 mb-3">Organiserte gruppechatrom med avanserte administrasjonsfunksjoner, deling og rollestyring.</p>
                <ul className="text-sm text-gray-400 space-y-1">
                  <li className="flex items-center gap-2">
                    <CheckCircle size={14} className="text-green-500" /> Rolle-basert tilgangsstyring
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle size={14} className="text-green-500" /> Dedikerte fildelingsområder
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle size={14} className="text-green-500" /> Meningsmålinger og avstemminger
                  </li>
                </ul>
              </div>
              
              <div className="bg-cyberdark-800/50 rounded-lg p-6 border border-cyberblue-500/20">
                <UserPlus className="h-8 w-8 text-cyberblue-400 mb-4" />
                <h3 className="text-lg font-semibold mb-2 text-white">Vennesystem</h3>
                <p className="text-gray-400 mb-3">Administrer dine kontakter med et intuitivt vennesystem som respekterer ditt personvern.</p>
                <ul className="text-sm text-gray-400 space-y-1">
                  <li className="flex items-center gap-2">
                    <CheckCircle size={14} className="text-green-500" /> Forespørsler og godkjenninger
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle size={14} className="text-green-500" /> Favoritter og grupper
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle size={14} className="text-green-500" /> QR-kode invitasjoner
                  </li>
                </ul>
              </div>
              
              <div className="bg-cyberdark-800/50 rounded-lg p-6 border border-cyberblue-500/20">
                <UserCircle className="h-8 w-8 text-cyberblue-400 mb-4" />
                <h3 className="text-lg font-semibold mb-2 text-white">Profilhåndtering</h3>
                <p className="text-gray-400 mb-3">Tilpass din brukeropplevelse med detaljert profilkontroll og personverninnstillinger.</p>
                <ul className="text-sm text-gray-400 space-y-1">
                  <li className="flex items-center gap-2">
                    <CheckCircle size={14} className="text-green-500" /> Tilpassbare profilbilder
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle size={14} className="text-green-500" /> Status og tilgjengelighet
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle size={14} className="text-green-500" /> Granuler personvernkontroll
                  </li>
                </ul>
              </div>
              
              <div className="bg-cyberdark-800/50 rounded-lg p-6 border border-cyberblue-500/20">
                <Bell className="h-8 w-8 text-cyberblue-400 mb-4" />
                <h3 className="text-lg font-semibold mb-2 text-white">Varslingssystem</h3>
                <p className="text-gray-400 mb-3">Intelligent varslingssystem som prioriterer viktige meldinger uten å forstyrre.</p>
                <ul className="text-sm text-gray-400 space-y-1">
                  <li className="flex items-center gap-2">
                    <CheckCircle size={14} className="text-green-500" /> Stille timer og unntak
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle size={14} className="text-green-500" /> Prioriterte kontakter
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle size={14} className="text-green-500" /> Tilpassbare lyder og vibrasjon
                  </li>
                </ul>
              </div>
              
              <div className="bg-cyberdark-800/50 rounded-lg p-6 border border-cyberblue-500/20">
                <MobileIcon className="h-8 w-8 text-cyberblue-400 mb-4" />
                <h3 className="text-lg font-semibold mb-2 text-white">Mobil Responsiv</h3>
                <p className="text-gray-400 mb-3">Sømløs opplevelse på alle enheter - fra mobil til desktop med synkroniserte samtaler.</p>
                <ul className="text-sm text-gray-400 space-y-1">
                  <li className="flex items-center gap-2">
                    <CheckCircle size={14} className="text-green-500" /> Tilpasset UI for alle skjermstørrelser
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle size={14} className="text-green-500" /> Offline modus med synkronisering
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle size={14} className="text-green-500" /> Lavt batteriforbruk
                  </li>
                </ul>
              </div>
              
              <div className="bg-cyberdark-800/50 rounded-lg p-6 border border-cyberblue-500/20">
                <QrCode className="h-8 w-8 text-cyberblue-400 mb-4" />
                <h3 className="text-lg font-semibold mb-2 text-white">QR Invitasjonssystem</h3>
                <p className="text-gray-400 mb-3">Enkelt delbart QR-system for invitasjoner til samtaler, grupper eller venneforespørsler.</p>
                <ul className="text-sm text-gray-400 space-y-1">
                  <li className="flex items-center gap-2">
                    <CheckCircle size={14} className="text-green-500" /> Utløpsdato for QR-koder
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle size={14} className="text-green-500" /> Begrenset antall bruk
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle size={14} className="text-green-500" /> Tilgangsnivåer og roller
                  </li>
                </ul>
              </div>
            </div>
          </div>
          
          {/* Premium Features */}
          <div className="max-w-4xl mx-auto my-16 px-4 pb-8 pt-12 border-y border-cybergold-500/30 bg-gradient-to-b from-cyberdark-900/50 to-transparent">
            <div className="text-center mb-12">
              <Badge className="mb-3 bg-cybergold-900/50 text-cybergold-400 border-cybergold-500/30">
                <Crown size={14} className="mr-2" /> Premium
              </Badge>
              <h2 className="text-2xl font-bold mb-3 bg-gradient-to-r from-cybergold-400 to-white bg-clip-text text-transparent">
                Premium Funksjoner for Krevende Brukere
              </h2>
              <p className="text-gray-400 max-w-2xl mx-auto">
                Oppgrader til premium for ekstra funksjonalitet, større kapasitet og avanserte sikkerhetsfunksjoner.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <PremiumFeatureCard 
                icon={Crown} 
                title="Premium Grupper" 
                description="Opprett og administrer ekstra sikre premium grupper med utvidet funksjonalitet og lagringsplass." 
              />
              <PremiumFeatureCard 
                icon={Mail} 
                title="Premium E-post" 
                description="Få din egen @snakkaz.com e-postadresse med fullstendig kryptert innhold og premium støtte." 
              />
              <PremiumFeatureCard 
                icon={Image} 
                title="Utvidet Mediestøtte" 
                description="Større filstørrelser, høyere videokvalitet og lengre mediaoppbevaring." 
              />
            </div>
            
            <div className="mt-10 text-center">
              <Button
                className="bg-gradient-to-r from-cybergold-700 to-cybergold-500 hover:from-cybergold-600 hover:to-cybergold-400 text-cyberdark-950 font-semibold px-8 py-2"
                onClick={() => navigate('/premium')}
              >
                <Crown className="mr-2" size={18} />
                Oppgrader til Premium
              </Button>
            </div>
          </div>
          
          {/* Testimonials */}
          <div className="max-w-4xl mx-auto my-16 px-4">
            <div className="text-center mb-12">
              <h2 className="text-2xl font-bold mb-3 bg-gradient-to-r from-cyberblue-400 to-white bg-clip-text text-transparent">
                Hva Brukerne Våre Sier
              </h2>
              <p className="text-gray-400 max-w-2xl mx-auto">
                Hør fra de som allerede bruker SnakkaZ til sin daglige kommunikasjon.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Testimonial 
                quote="SnakkaZ har revolusjonert måten teamet vårt kommuniserer på. Sikkerheten er på topp, og vi kan samarbeide uten å bekymre oss for sensitiv informasjon."
                author="Thomas B."
                role="Prosjektleder, TechSolutions"
              />
              <Testimonial 
                quote="Jeg har prøvd mange messenger-apper, men ingen kommer i nærheten av hastigheten og sikkerheten til SnakkaZ. Premium-funksjonene er verdt hver krone."
                author="Lise M."
                role="Digital Markedsfører"
              />
              <Testimonial 
                quote="Som lege setter jeg pris på det høye sikkerhetsnivået. Jeg kan diskutere sensitive temaer med kolleger uten å bekymre meg for datalekkasjer."
                author="Dr. Kristian H."
                role="Lege, Medisinsk Senter"
              />
              <Testimonial 
                quote="Gruppefunksjonene er utrolig nyttige for familien vår. Vi har egne grupper for ulike formål, og alt synkroniseres perfekt mellom enhetene."
                author="Nina S."
                role="Familiekoordinator og mor til tre"
              />
            </div>
          </div>

          <ProjectGrid />
          <SyncDashboard />
          <ProgressSection />

          {!isPWAInstalled && (
            <div className="fixed bottom-6 right-6 z-50">
              <Button
                onClick={() => setShowDownloadDialog(true)}
                className="rounded-full w-16 h-16 shadow-lg"
                style={{
                  background: 'linear-gradient(135deg, #1a9dff 0%, #3b82f6 50%, #d62828 100%)',
                  boxShadow: '0 0 20px rgba(26,157,255,0.5), 0 0 20px rgba(214,40,40,0.5)'
                }}
              >
                <Download size={24} />
              </Button>
            </div>
          )}

          {showInstallTip && (
            <div className="fixed bottom-24 right-6 z-50 max-w-xs bg-cyberdark-800 p-4 rounded-lg shadow-lg border border-cyberblue-500/30 animate-fade-in">
              <button
                onClick={() => setShowInstallTip(false)}
                className="absolute top-2 right-2 text-gray-400 hover:text-white"
              >
                <X size={16} />
              </button>
              <div className="flex items-start mb-2">
                <Info className="mr-2 text-cyberblue-400 mt-0.5 flex-shrink-0" size={18} />
                <h4 className="text-sm font-semibold text-cyberblue-300">Visste du at?</h4>
              </div>
              <p className="text-xs text-gray-300 mb-3">
                Du kan installere SnakkaZ som en app på enheten din for raskere tilgang og bedre opplevelse.
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setShowInstallTip(false);
                  setShowDownloadDialog(true);
                }}
                className="w-full text-xs border-cyberblue-500/50 text-cyberblue-400"
              >
                <Download size={12} className="mr-1" /> Installer App
              </Button>
            </div>
          )}
        </div>
      </div>

      <Footer />

      <Dialog open={showDownloadDialog} onOpenChange={setShowDownloadDialog}>
        <DialogContent className="bg-cyberdark-900 border-2 sm:max-w-md"
          style={{ borderImage: "linear-gradient(90deg, #1a9dff, #d62828) 1" }}
        >
          <DialogHeader>
            <DialogTitle
              className="text-xl font-bold text-center"
              style={{
                background: 'linear-gradient(90deg, #1a9dff 0%, #ffffff 50%, #d62828 100%)',
                WebkitBackgroundClip: 'text',
                backgroundClip: 'text',
                color: 'transparent',
              }}
            >
              Last ned SnakkaZ App
            </DialogTitle>
            <DialogDescription className="text-gray-400 text-center">
              Få sikker kommunikasjon hvor som helst
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-6 py-4">
            <div className="flex items-center justify-center">
              <img
                src="/snakkaz-logo.png"
                alt="SnakkaZ Logo"
                className="h-24 w-24 rounded-full border-2 p-1"
                style={{ borderImage: "linear-gradient(90deg, #1a9dff, #d62828) 1" }}
              />
            </div>

            {installPrompt ? (
              <Button
                className="w-full bg-gradient-to-r from-cyberblue-500 to-cyberblue-700 hover:from-cyberblue-600 hover:to-cyberblue-800 py-6"
                onClick={handleInstallClick}
              >
                <Laptop className="mr-2" size={18} /> Installer på Denne Enheten
              </Button>
            ) : (
              <div className="space-y-4">
                {isIOS ? (
                  <div className="space-y-4">
                    <div className="bg-cyberdark-800 p-4 rounded-md text-sm text-gray-300 space-y-2">
                      <p className="font-semibold text-white flex items-center">
                        <Smartphone className="mr-2" size={16} /> For iOS:
                      </p>
                      <ol className="list-decimal pl-5 space-y-2 text-xs">
                        <li>Trykk på Del-ikonet (firkant med pil opp)</li>
                        <li>Scroll ned og trykk <span className="font-semibold">Legg til på Hjem-skjerm</span></li>
                        <li>Trykk <span className="font-semibold">Legg til</span> i øvre høyre hjørne</li>
                      </ol>
                    </div>
                  </div>
                ) : (
                  <div className="bg-cyberdark-800 p-4 rounded-md text-sm text-gray-300 space-y-2">
                    <p className="flex items-center text-white font-semibold mb-2">
                      <Info className="mr-2" size={16} /> Installasjonsmuligheter:
                    </p>
                    <p>For å installere appen i nettleseren din, trykk på menyknappen (⋮) og velg "Installer app" eller "Legg til på startskjermen".</p>
                  </div>
                )}
              </div>
            )}

            <p className="text-xs text-center text-gray-500 mt-2">
              Installer appen for en bedre brukeropplevelse og påminnelser
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Index;
