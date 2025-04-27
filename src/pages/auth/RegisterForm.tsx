
import { useState } from "react";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

interface RegisterFormProps {
  onSuccess: () => void;
}

export const RegisterForm = ({ onSuccess }: RegisterFormProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password || !confirmPassword || !username) {
      toast({
        title: "Feil",
        description: "Du må fylle inn alle feltene.",
        variant: "destructive",
      });
      return;
    }
    
    if (password !== confirmPassword) {
      toast({
        title: "Feil",
        description: "Passordene er ikke like.",
        variant: "destructive",
      });
      return;
    }
    
    if (password.length < 6) {
      toast({
        title: "Feil",
        description: "Passordet må være minst 6 tegn.",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            username,
          },
        },
      });
      
      if (error) {
        throw error;
      }
      
      toast({
        title: "Konto opprettet",
        description: "Din konto ble opprettet. Du kan nå logge inn.",
      });
      
      onSuccess();
    } catch (error: any) {
      console.error("Registration error:", error);
      toast({
        title: "Registreringsfeil",
        description: error.message || "Kunne ikke opprette konto.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleRegister} className="space-y-4">
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
        <label htmlFor="username" className="block text-sm font-medium text-cybergold-300">
          Brukernavn
        </label>
        <Input
          id="username"
          type="text"
          placeholder="Ditt brukernavn"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
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
      
      <div className="space-y-2">
        <label htmlFor="confirmPassword" className="block text-sm font-medium text-cybergold-300">
          Bekreft passord
        </label>
        <div className="relative">
          <Input
            id="confirmPassword"
            type={showPassword ? "text" : "password"}
            placeholder="Bekreft ditt passord"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="bg-cyberdark-800 border-cybergold-500/30 text-cybergold-200 pr-10"
            disabled={isLoading}
            required
          />
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
            Oppretter konto...
          </>
        ) : (
          "Opprett konto"
        )}
      </Button>
      
      <p className="text-xs text-cybergold-500 text-center mt-4">
        Ved å registrere deg godtar du våre <a href="#" className="underline hover:text-cybergold-400">vilkår og betingelser</a> og <a href="#" className="underline hover:text-cybergold-400">personvernregler</a>.
      </p>
    </form>
  );
};
