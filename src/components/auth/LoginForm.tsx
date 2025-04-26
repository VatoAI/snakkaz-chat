import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, LogIn, UserPlus, Eye, EyeOff } from "lucide-react";

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
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onLogin(email, password);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Logo på toppen */}
      <div className="flex flex-col items-center justify-center mb-4">
        <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full border-2 border-gold-500/40 shadow-neon-gold overflow-hidden mb-4">
          <img 
            src="/snakkaz-logo.png" 
            alt="SnakkaZ" 
            className="w-full h-full object-cover p-0.5"
            onError={(e) => {
              (e.target as HTMLImageElement).src = "/placeholder.svg";
            }}
          />
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-gold-400 via-white to-gold-400 text-transparent bg-clip-text mb-1">
          SnakkaZ
        </h1>
        <p className="text-sm text-cyberblue-300/70">
          Sikker kryptert kommunikasjon
        </p>
      </div>
      
      <div className="space-y-3">
        <label htmlFor="email" className="block text-sm font-medium text-white">
          E-post
        </label>
        <Input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="bg-cyberdark-800 border-cyberblue-500/30 text-white placeholder:text-cyberblue-300/50 focus:border-cyberblue-400 focus:ring-2 focus:ring-cyberblue-400/50 h-12 text-base px-4"
          placeholder="din@epost.no"
          autoComplete="email"
        />
        {emailError && (
          <p className="text-sm text-cyberred-400">{emailError}</p>
        )}
      </div>

      <div className="space-y-3">
        <label htmlFor="password" className="block text-sm font-medium text-white">
          Passord
        </label>
        <div className="relative">
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="bg-cyberdark-800 border-cyberblue-500/30 text-white placeholder:text-cyberblue-300/50 focus:border-cyberblue-400 focus:ring-2 focus:ring-cyberblue-400/50 h-12 text-base px-4 pr-10"
            placeholder="••••••••"
            autoComplete="current-password"
          />
          <button
            type="button"
            onClick={togglePasswordVisibility}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-cyberblue-400 hover:text-cyberblue-300"
            tabIndex={-1}
          >
            {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
          </button>
        </div>
        {passwordError && (
          <p className="text-sm text-cyberred-400">{passwordError}</p>
        )}
        <p className="text-xs text-cyberblue-300/70">
          Minimum 6 tegn
        </p>
      </div>

      <div className="space-y-4 pt-2">
        <div className="flex items-center">
          <input
            type="checkbox"
            id="remember-me"
            className="h-4 w-4 rounded border-gray-300 text-cyberblue-600 focus:ring-cyberblue-500"
          />
          <label htmlFor="remember-me" className="ml-2 block text-sm text-white">
            Hold meg pålogget
          </label>
        </div>

        <Button
          type="submit"
          className="w-full bg-gradient-to-r from-cyberblue-500 to-cyberblue-700 hover:from-cyberblue-600 hover:to-cyberblue-800 text-white font-medium text-lg h-14 shadow-neon-blue transition-all duration-200 rounded-lg"
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
          className="w-full bg-cyberdark-800 border border-cybergold-500/30 text-cybergold-400 hover:bg-cyberdark-700 font-medium text-lg h-14 shadow-neon-gold/20 hover:shadow-neon-gold/40 transition-all duration-200 rounded-lg"
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
