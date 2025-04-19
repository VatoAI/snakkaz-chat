
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";

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
        <label htmlFor="email" className="block text-sm font-medium text-cybergold-300">
          E-post
        </label>
        <Input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="bg-cyberdark-800 border-cybergold-500/30 text-cybergold-200 placeholder:text-cyberdark-400 focus:border-cybergold-400 focus:ring-2 focus:ring-cybergold-400/50"
          placeholder="din@epost.no"
          autoComplete="email"
        />
        {emailError && (
          <p className="text-sm text-red-400">{emailError}</p>
        )}
      </div>

      <div className="space-y-2">
        <label htmlFor="password" className="block text-sm font-medium text-cybergold-300">
          Passord
        </label>
        <Input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="bg-cyberdark-800 border-cybergold-500/30 text-cybergold-200 placeholder:text-cyberdark-400 focus:border-cybergold-400 focus:ring-2 focus:ring-cybergold-400/50"
          placeholder="••••••••"
          autoComplete="current-password"
        />
        {passwordError && (
          <p className="text-sm text-red-400">{passwordError}</p>
        )}
        <p className="text-sm text-cybergold-300/70">
          Minimum 6 tegn
        </p>
      </div>

      <div className="space-y-4">
        <Button
          type="submit"
          className="w-full bg-cybergold-500 hover:bg-cybergold-600 text-cyberdark-950 font-medium text-lg h-11 transition-all duration-200"
          disabled={isLoading}
        >
          {isLoading ? (
            <div className="flex items-center justify-center gap-2">
              <Loader2 className="h-5 w-5 animate-spin" />
              Logger inn...
            </div>
          ) : (
            'Logg inn'
          )}
        </Button>

        <Button
          type="button"
          onClick={() => onSignup(email, password)}
          className="w-full bg-cyberdark-800 border border-cybergold-500/30 text-cybergold-400 hover:bg-cyberdark-700 font-medium text-lg h-11 transition-all duration-200"
          disabled={isLoading}
        >
          {isLoading ? (
            <div className="flex items-center justify-center gap-2">
              <Loader2 className="h-5 w-5 animate-spin" />
              Registrerer...
            </div>
          ) : (
            'Registrer ny bruker'
          )}
        </Button>
      </div>
    </form>
  );
};
