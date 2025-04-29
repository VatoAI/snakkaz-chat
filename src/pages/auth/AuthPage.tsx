import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { LoginForm } from "./LoginForm";
import { RegisterForm } from "./RegisterForm";
import { DownloadSection } from "./DownloadSection";
import { useDeviceDetection } from "@/hooks/useDeviceDetection";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Shield, Download, ArrowRight } from "lucide-react";

const AuthPage = () => {
  const [activeTab, setActiveTab] = useState<"login" | "register" | "download">("login");
  const { user } = useAuth();
  const navigate = useNavigate();
  const { isMobile, isTablet, isIOS, isAndroid } = useDeviceDetection();

  // Redirect if already authenticated
  useEffect(() => {
    if (user) {
      navigate("/chat", { replace: true });
    }
  }, [user, navigate]);

  // Dynamisk bakgrunnsstil basert på enhet
  const mobileBackground = isIOS 
    ? "bg-gradient-to-br from-blue-900 to-black" 
    : "bg-gradient-to-br from-indigo-900 to-black";

  return (
    <div className={`flex flex-col min-h-screen ${isMobile ? mobileBackground : "bg-cyberdark-950"} text-cybergold-200`}>
      {/* Logo og topp-seksjon */}
      <div className="pt-6 pb-2 px-4 flex justify-center">
        <div className="flex items-center gap-2">
          <img src="/snakkaz-logo.png" alt="SnakkaZ Logo" className="w-10 h-10" />
          <h1 className="text-3xl font-bold text-cybergold-400">SnakkaZ</h1>
        </div>
      </div>

      {/* Hovedinnhold - mobiltilpasset med Tabs */}
      <div className="flex-1 flex flex-col md:flex-row">
        <div className="flex-1 flex items-center justify-center p-4">
          <div className="w-full max-w-md">
            {isMobile || isTablet ? (
              <Tabs defaultValue="login" className="w-full" onValueChange={(v) => setActiveTab(v as any)}>
                <TabsList className="grid grid-cols-3 mb-4">
                  <TabsTrigger value="login">Logg inn</TabsTrigger>
                  <TabsTrigger value="register">Registrer</TabsTrigger>
                  <TabsTrigger value="download">Last ned</TabsTrigger>
                </TabsList>
                <TabsContent value="login" className="mt-2">
                  <LoginForm />
                </TabsContent>
                <TabsContent value="register" className="mt-2">
                  <RegisterForm onSuccess={() => setActiveTab("login")} />
                </TabsContent>
                <TabsContent value="download" className="mt-2">
                  <DownloadSection />
                </TabsContent>
              </Tabs>
            ) : (
              <>
                <div className="flex mb-6">
                  <button
                    className={`flex-1 py-2 text-center transition-colors ${
                      activeTab === "login"
                        ? "text-cybergold-300 border-b-2 border-cybergold-500"
                        : "text-cybergold-600 hover:text-cybergold-400"
                    }`}
                    onClick={() => setActiveTab("login")}
                  >
                    Logg inn
                  </button>
                  <button
                    className={`flex-1 py-2 text-center transition-colors ${
                      activeTab === "register"
                        ? "text-cybergold-300 border-b-2 border-cybergold-500"
                        : "text-cybergold-600 hover:text-cybergold-400"
                    }`}
                    onClick={() => setActiveTab("register")}
                  >
                    Registrer
                  </button>
                  <button
                    className={`flex-1 py-2 text-center transition-colors ${
                      activeTab === "download"
                        ? "text-cybergold-300 border-b-2 border-cybergold-500"
                        : "text-cybergold-600 hover:text-cybergold-400"
                    }`}
                    onClick={() => setActiveTab("download")}
                  >
                    Last ned
                  </button>
                </div>
                
                {activeTab === "login" && <LoginForm />}
                {activeTab === "register" && <RegisterForm onSuccess={() => setActiveTab("login")} />}
                {activeTab === "download" && <DownloadSection />}
              </>
            )}
          </div>
        </div>
        
        {/* Høyre side - kun på store skjermer */}
        {!isMobile && !isTablet && (
          <div className="hidden lg:flex lg:flex-1 bg-cyberdark-900 relative overflow-hidden">
            <div className="absolute inset-0 w-full h-full bg-gradient-to-br from-cyberdark-900/90 to-transparent z-10"></div>
            <div className="absolute inset-0 w-full h-full bg-[url('/images/auth-bg.jpg')] bg-cover bg-center opacity-60"></div>
            <div className="relative z-20 p-12 flex flex-col justify-center">
              <h2 className="text-4xl font-bold text-cybergold-300 mb-4">Sikker Kommunikasjon</h2>
              <p className="text-xl text-cybergold-400 max-w-md">
                Velkommen til SnakkaZ - en plattform for kryptert kommunikasjon, private samtaler og gruppesamtaler med høyt sikkerhetsnivå.
              </p>
              <div className="mt-8">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-10 h-10 rounded-full bg-cybergold-600/20 flex items-center justify-center">
                    <Shield className="text-cybergold-400 h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-medium text-cybergold-300">Ende-til-ende kryptert</h3>
                    <p className="text-cybergold-500">Ingen kan se meldingene dine</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-10 h-10 rounded-full bg-cybergold-600/20 flex items-center justify-center">
                    <span className="text-cybergold-400">⏱️</span>
                  </div>
                  <div>
                    <h3 className="font-medium text-cybergold-300">Automatisk sletting</h3>
                    <p className="text-cybergold-500">Meldinger slettes etter en definert tid</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-10 h-10 rounded-full bg-cybergold-600/20 flex items-center justify-center">
                    <span className="text-cybergold-400">👥</span>
                  </div>
                  <div>
                    <h3 className="font-medium text-cybergold-300">Sikre gruppesamtaler</h3>
                    <p className="text-cybergold-500">Sikker kommunikasjon i grupper</p>
                  </div>
                </div>
                
                <button 
                  onClick={() => setActiveTab("download")}
                  className="mt-4 flex items-center gap-2 bg-cybergold-500/20 hover:bg-cybergold-500/30 text-cybergold-300 px-6 py-3 rounded-lg transition-all"
                >
                  <Download className="h-5 w-5" />
                  <span>Last ned appen</span>
                  <ArrowRight className="h-4 w-4 ml-2" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Bunn-info for mobil */}
      {isMobile && (
        <div className="p-4 text-center text-sm text-cybergold-500">
          <p>SnakkaZ - Sikker kommunikasjon © 2025</p>
          <p className="mt-1">Ende-til-ende kryptert med Perfect Forward Secrecy</p>
        </div>
      )}
    </div>
  );
};

export default AuthPage;
