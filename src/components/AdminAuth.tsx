import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Eye, EyeOff, Shield, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface AdminAuthProps {
  onAuthenticated: () => void;
}

export const AdminAuth = ({ onAuthenticated }: AdminAuthProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isOpen, setIsOpen] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loginAttempts, setLoginAttempts] = useState(0);
  const [isLocked, setIsLocked] = useState(false);
  const [lockTimer, setLockTimer] = useState(0);
  const { toast } = useToast();

  useEffect(() => {
    // Check if already authenticated
    const isAuthenticated = localStorage.getItem("adminAuthenticated") === "true";
    const sessionExpiry = localStorage.getItem("adminSessionExpiry");

    // Check if session is expired
    if (isAuthenticated && sessionExpiry) {
      const expiryTime = parseInt(sessionExpiry);
      if (Date.now() > expiryTime) {
        // Session expired
        localStorage.removeItem("adminAuthenticated");
        localStorage.removeItem("adminSessionExpiry");
        toast({
          title: "Økten utløpt",
          description: "Din admin-økt har utløpt. Vennligst logg inn på nytt.",
          variant: "default",
        });
      } else {
        setIsOpen(false);
        onAuthenticated();
      }
    }

    // Check for locked state
    const lockedUntil = localStorage.getItem("adminLoginLocked");
    if (lockedUntil) {
      const lockTime = parseInt(lockedUntil);
      if (Date.now() < lockTime) {
        setIsLocked(true);
        const remainingTime = Math.ceil((lockTime - Date.now()) / 1000);
        setLockTimer(remainingTime);

        // Set up countdown timer
        const interval = setInterval(() => {
          setLockTimer(prev => {
            if (prev <= 1) {
              clearInterval(interval);
              setIsLocked(false);
              localStorage.removeItem("adminLoginLocked");
              return 0;
            }
            return prev - 1;
          });
        }, 1000);

        return () => clearInterval(interval);
      } else {
        localStorage.removeItem("adminLoginLocked");
      }
    }

    // Retrieve previous login attempts
    const attempts = localStorage.getItem("adminLoginAttempts");
    if (attempts) {
      setLoginAttempts(parseInt(attempts));
    }
  }, [onAuthenticated, toast]);

  const handleLogin = async () => {
    if (isLocked) return;

    // Valider e-post og passord
    if (!email || !password) {
      toast({
        title: "Feil",
        description: "Både e-post og passord er påkrevd",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      // 1. Autentisering gjennom Supabase
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password
      });

      if (error) throw error;

      if (!data || !data.user) {
        throw new Error("Autentisering feilet");
      }

      // 2. Sjekk om brukeren har admin-rolle
      const { data: hasAdminRole, error: roleError } = await supabase.rpc('has_role', {
        user_id: data.user.id,
        role: 'admin'
      });

      if (roleError) throw roleError;

      if (!hasAdminRole) {
        throw new Error("Ikke tilstrekkelige rettigheter");
      }

      // Autentisering vellykket og brukeren har admin-rettigheter
      try {
        await supabase
          .from('health')
          .upsert({
            id: "admin-login-" + new Date().toISOString(),
            status: `admin_login_successful_${data.user.id}`,
            last_checked: new Date().toISOString()
          });
      } catch (error) {
        console.error("Could not log admin login:", error);
      }

      // Set 4-hour session expiry
      const expiryTime = Date.now() + (4 * 60 * 60 * 1000);
      localStorage.setItem("adminAuthenticated", "true");
      localStorage.setItem("adminSessionExpiry", expiryTime.toString());
      localStorage.setItem("adminUserId", data.user.id);
      localStorage.removeItem("adminLoginAttempts");

      setIsOpen(false);
      onAuthenticated();
      toast({
        title: "Innlogget",
        description: "Du er nå logget inn som administrator",
      });
    } catch (error: any) {
      console.error("Admin login error:", error);

      // Håndter feilede innloggingsforsøk
      const newAttempts = loginAttempts + 1;
      setLoginAttempts(newAttempts);
      localStorage.setItem("adminLoginAttempts", newAttempts.toString());

      // Log failed attempt
      try {
        await supabase
          .from('health')
          .upsert({
            id: "admin-login-failed-" + new Date().toISOString(),
            status: `admin_login_failed_${new Date().toISOString()}`,
            last_checked: new Date().toISOString()
          });
      } catch (logError) {
        console.error("Could not log failed login:", logError);
      }

      // Vis spesifikke feilmeldinger
      let errorMessage = "Ugyldig e-post eller passord";

      if (error.message.includes("role") || error.message.includes("permission") ||
        error.message === "Ikke tilstrekkelige rettigheter") {
        errorMessage = "Du har ikke admin-rettigheter";
      }

      // If too many attempts, lock the login
      if (newAttempts >= 5) {
        const lockTime = Date.now() + (30 * 1000); // Lock for 30 seconds
        localStorage.setItem("adminLoginLocked", lockTime.toString());
        setIsLocked(true);
        setLockTimer(30);

        // Set up countdown timer
        const interval = setInterval(() => {
          setLockTimer(prev => {
            if (prev <= 1) {
              clearInterval(interval);
              setIsLocked(false);
              localStorage.removeItem("adminLoginLocked");
              return 0;
            }
            return prev - 1;
          });
        }, 1000);

        toast({
          title: "For mange forsøk",
          description: `Innlogging er låst i ${lockTimer} sekunder`,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Feil",
          description: errorMessage,
          variant: "destructive",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      // Prevent closing the dialog by clicking outside
      if (!open && !localStorage.getItem("adminAuthenticated")) return;
      setIsOpen(open);
    }}>
      <DialogContent className="sm:max-w-md bg-cyberdark-900 border-cyberblue-500/30">
        <DialogHeader>
          <div className="flex items-center justify-center mb-4">
            <Shield className="h-12 w-12 text-cyberblue-400" />
          </div>
          <DialogTitle className="text-cyberblue-300 text-center">Administrator Innlogging</DialogTitle>
          <DialogDescription className="text-gray-400 text-center">
            Skriv inn dine admin-legitimasjoner for å fortsette
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {isLocked ? (
            <div className="bg-red-900/20 border border-red-500/30 rounded-md p-4 text-center">
              <h3 className="text-red-400 font-medium mb-2">Konto låst</h3>
              <p className="text-gray-300 text-sm mb-2">For mange mislykkede innloggingsforsøk.</p>
              <p className="text-cyberblue-400 font-mono">
                Prøv igjen om {lockTimer} sekunder
              </p>
            </div>
          ) : (
            <>
              <div className="space-y-2">
                <Input
                  placeholder="E-post"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-cyberdark-950 border-cyberblue-500/30"
                  disabled={isLoading}
                  autoComplete="email"
                />
              </div>
              <div className="space-y-2 relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Passord"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-cyberdark-950 border-cyberblue-500/30 pr-10"
                  disabled={isLoading}
                  autoComplete="current-password"
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !isLoading) {
                      handleLogin();
                    }
                  }}
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute right-3 top-3 text-gray-400 hover:text-gray-300"
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <EyeOff size={16} />
                  ) : (
                    <Eye size={16} />
                  )}
                </button>
              </div>

              {loginAttempts > 0 && (
                <div className="text-xs text-yellow-400 text-center">
                  {5 - loginAttempts} forsøk gjenstår før kontoen låses
                </div>
              )}

              <Button
                type="submit"
                className="w-full"
                onClick={handleLogin}
                disabled={isLoading || !email || !password}
                style={{
                  background: 'linear-gradient(90deg, #1a9dff, #3b82f6)',
                  boxShadow: '0 0 10px rgba(26,157,255,0.4)',
                }}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Logger inn...
                  </>
                ) : (
                  'Logg Inn'
                )}
              </Button>
            </>
          )}
        </div>

        <div className="text-xs text-gray-500 text-center">
          For admin tilgang, kontakt din systemadministrator
        </div>
      </DialogContent>
    </Dialog>
  );
};
