
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { LoginForm } from "./LoginForm";
import { RegisterForm } from "./RegisterForm";

const AuthPage = () => {
  const [activeTab, setActiveTab] = useState<"login" | "register">("login");
  const { user } = useAuth();
  const navigate = useNavigate();

  // Redirect if already authenticated
  useEffect(() => {
    if (user) {
      navigate("/chat", { replace: true });
    }
  }, [user, navigate]);

  return (
    <div className="flex min-h-screen bg-cyberdark-950 text-cybergold-200">
      <div className="flex-1 flex items-center justify-center">
        <div className="w-full max-w-md p-8">
          <h1 className="text-3xl font-bold text-cybergold-400 text-center mb-8">SnakkaZ</h1>
          
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
          </div>
          
          {activeTab === "login" ? <LoginForm /> : <RegisterForm onSuccess={() => setActiveTab("login")} />}
        </div>
      </div>
      
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
                <span className="text-cybergold-400">🔒</span>
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
            
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-cybergold-600/20 flex items-center justify-center">
                <span className="text-cybergold-400">👥</span>
              </div>
              <div>
                <h3 className="font-medium text-cybergold-300">Sikre gruppesamtaler</h3>
                <p className="text-cybergold-500">Sikker kommunikasjon i grupper</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
