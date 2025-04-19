
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, LogIn, UserPlus } from "lucide-react";

interface LoginFormProps {
  onLogin: (email: string, password: string) => Promise<void>;
  onSignup: (email: string, password: string) => Promise<void>;
  isLoading: boolean;
  emailError: string;
  passwordError: string;
}

export const LoginForm = ({ 
  onLogin, 
  onSignup, 
  isLoading, 
  emailError, 
  passwordError 
}: LoginFormProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onLogin(email, password);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <label htmlFor="email" className="block text-sm font-medium text-cyberblue-300">
          E-post
        </label>
        <Input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="bg-cyberdark-800 border-cyberblue-500/30 text-cyberblue-200 placeholder:text-cyberblue-300/50 focus:border-cyberblue-400 focus:ring-2 focus:ring-cyberblue-400/50"
          placeholder="din@epost.no"
          autoComplete="email"
        />
        {emailError && (
          <p className="text-sm text-cyberred-400">{emailError}</p>
        )}
      </div>

      <div className="space-y-2">
        <label htmlFor="password" className="block text-sm font-medium text-cyberblue-300">
          Passord
        </label>
        <Input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="bg-cyberdark-800 border-cyberblue-500/30 text-cyberblue-200 placeholder:text-cyberblue-300/50 focus:border-cyberblue-400 focus:ring-2 focus:ring-cyberblue-400/50"
          placeholder="••••••••"
          autoComplete="current-password"
        />
        {passwordError && (
          <p className="text-sm text-cyberred-400">{passwordError}</p>
        )}
        <p className="text-sm text-cyberblue-300/70">
          Minimum 6 tegn
        </p>
      </div>

      <div className="space-y-4">
        <Button
          type="submit"
          className="w-full bg-gradient-to-r from-cyberblue-500 to-cyberblue-700 hover:from-cyberblue-600 hover:to-cyberblue-800 text-white font-medium text-lg h-11 shadow-neon-blue transition-all duration-200"
          disabled={isLoading}
        >
          {isLoading ? (
            <div className="flex items-center justify-center gap-2">
              <Loader2 className="h-5 w-5 animate-spin" />
              Logger inn...
            </div>
          ) : (
            <div className="flex items-center justify-center gap-2">
              <LogIn className="h-5 w-5" />
              Logg inn
            </div>
          )}
        </Button>

        <Button
          type="button"
          onClick={() => onSignup(email, password)}
          className="w-full bg-cyberdark-800 border border-cyberblue-500/30 text-cyberblue-400 hover:bg-cyberdark-700 font-medium text-lg h-11 shadow-neon-blue/20 hover:shadow-neon-blue/40 transition-all duration-200"
          disabled={isLoading}
        >
          {isLoading ? (
            <div className="flex items-center justify-center gap-2">
              <Loader2 className="h-5 w-5 animate-spin" />
              Registrerer...
            </div>
          ) : (
            <div className="flex items-center justify-center gap-2">
              <UserPlus className="h-5 w-5" />
              Registrer ny bruker
            </div>
          )}
        </Button>
      </div>
    </form>
  );
};
