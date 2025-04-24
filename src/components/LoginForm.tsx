// DEPRECATED: This file is no longer in use and should be removed.
// The new login form is at /src/components/auth/LoginForm.tsx
import { Button } from "@/components/ui/button";
import { KeyRound } from "lucide-react";

interface LoginFormProps {
  email: string;
  setEmail: (email: string) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export const LoginForm = ({ email, setEmail, onSubmit }: LoginFormProps) => {
  // This component is deprecated and should not be used
  console.warn('Using deprecated LoginForm component. Use /src/components/auth/LoginForm.tsx instead');
  
  return (
    <div className="min-h-screen bg-cyberdark-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md relative">
        {/* Decorative elements */}
        <div className="absolute -top-20 -right-20 w-40 h-40 bg-cybergold-500/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-cyberblue-500/10 rounded-full blur-3xl"></div>
        
        <div className="bg-cyberdark-900/80 backdrop-blur-lg rounded-lg border border-cybergold-500/30 shadow-lg p-8 relative z-10">
          <div className="flex flex-col items-center mb-8">
            <div className="w-16 h-16 rounded-full bg-cyberdark-800 border-2 border-cybergold-500 flex items-center justify-center mb-4 shadow-neon-gold">
              <KeyRound className="w-8 h-8 text-cybergold-400" />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-cybergold-400 to-cybergold-200 bg-clip-text text-transparent">
              Logg inn på SnakkaZ
            </h1>
          </div>
          
          <form onSubmit={onSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-cyberblue-300 mb-1">
                E-post
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 bg-cyberdark-800 border border-cybergold-500/30 rounded-md text-cyberblue-100 placeholder:text-cyberdark-600 focus:outline-none focus:ring-2 focus:ring-cyberblue-500 focus:border-cyberblue-500 transition-all duration-300"
                required
                placeholder="din@epost.no"
              />
            </div>
            <Button 
              type="submit"
              className="w-full bg-cybergold-500 hover:bg-cybergold-600 text-cyberdark-900 shadow-neon-gold transition-all duration-300"
            >
              Send magisk lenke
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};
