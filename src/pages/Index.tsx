import { Header } from "@/components/index/Header";
import { Footer } from "@/components/index/Footer";
import { useIsMobile } from "@/hooks/use-mobile";
import { ProjectGrid } from "@/components/index/ProjectGrid";
import { ProgressSection } from "@/components/index/ProgressSection";
import { SyncDashboard } from "@/components/sync/SyncDashboard";
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Download, X, Info, Smartphone, Laptop } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

const Index = () => {
  const isMobile = useIsMobile();
  const [showDownloadDialog, setShowDownloadDialog] = useState(false);
  const [installPrompt, setInstallPrompt] = useState<any>(null);
  const [isPWAInstalled, setIsPWAInstalled] = useState(false);
  const [showInstallTip, setShowInstallTip] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsPWAInstalled(true);
    }
    
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setInstallPrompt(e);
      
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
  
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;

  return (
    <div className="min-h-screen bg-cyberdark-950 overflow-x-hidden">
      <div className="relative min-h-screen flex flex-col p-2 md:p-4">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 left-1/4 w-72 md:w-96 h-72 md:h-96 bg-gradient-to-r from-cyberblue-500/30 to-transparent rounded-full filter blur-3xl animate-pulse-slow"></div>
          <div className="absolute bottom-0 right-1/4 w-72 md:w-96 h-72 md:h-96 bg-gradient-to-l from-red-500/30 to-transparent rounded-full filter blur-3xl animate-pulse-slow delay-200"></div>
          <div className="absolute top-1/3 right-1/4 w-48 h-48 bg-cyberblue-400/10 rounded-full filter blur-2xl animate-pulse-slow delay-300"></div>
          <div className="absolute bottom-1/4 left-1/3 w-40 h-40 bg-red-300/10 rounded-full filter blur-xl animate-pulse-slow delay-500"></div>
          <div className="absolute inset-0 bg-gradient-to-br from-cyberblue-900/5 via-transparent to-red-900/5 pointer-events-none"></div>
        </div>

        <div className="container mx-auto px-2 md:px-4 relative z-10 flex-grow">
          <Header />
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
