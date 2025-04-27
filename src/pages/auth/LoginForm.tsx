
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

export const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast({
        title: "Feil",
        description: "Du må fylle inn både e-post og passord.",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        throw error;
      }
      
      if (data.user) {
        navigate("/chat", { replace: true });
      }
    } catch (error: any) {
      console.error("Login error:", error);
      toast({
        title: "Påloggingsfeil",
        description: error.message || "Kunne ikke logge inn. Sjekk brukernavn og passord.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleLogin} className="space-y-4">
      <div className="space-y-2">
        <label htmlFor="email" className="block text-sm font-medium text-cybergold-300">
          E-post
        </label>
        <Input
          id="email"
          type="email"
          placeholder="din@epost.no"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="bg-cyberdark-800 border-cybergold-500/30 text-cybergold-200"
          disabled={isLoading}
          required
        />
      </div>
      
      <div className="space-y-2">
        <label htmlFor="password" className="block text-sm font-medium text-cybergold-300">
          Passord
        </label>
        <div className="relative">
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            placeholder="Ditt passord"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="bg-cyberdark-800 border-cybergold-500/30 text-cybergold-200 pr-10"
            disabled={isLoading}
            required
          />
          <button
            type="button"
            className="absolute right-3 top-1/2 -translate-y-1/2 text-cybergold-500"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
      </div>
      
      <Button
        type="submit"
        className="w-full bg-cybergold-600 hover:bg-cybergold-500 text-black"
        disabled={isLoading}
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Logger inn...
          </>
        ) : (
          "Logg inn"
        )}
      </Button>
      
      <div className="text-center mt-4">
        <button
          type="button"
          className="text-sm text-cybergold-500 hover:text-cybergold-400"
          disabled={isLoading}
        >
          Glemt passord?
        </button>
      </div>
    </form>
  );
};
