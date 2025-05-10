
import { Shield } from "lucide-react";

export const RegisterHeader = () => {
  return (
    <div className="flex flex-col items-center mb-8 relative">
      <div className="w-20 h-20 rounded-full bg-gradient-to-r from-cyberdark-900 to-cyberdark-950 border-2 border-cybergold-400 flex items-center justify-center mb-4 shadow-[0_0_20px_rgba(230,179,0,0.3)] relative">
        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-cybergold-400/20 to-transparent animate-spin-slow"></div>
        <Shield className="w-10 h-10 text-cybergold-300 relative z-10" />
      </div>
      <h1 className="text-4xl font-bold bg-gradient-to-r from-cybergold-300 via-cybergold-200 to-cybergold-300 bg-clip-text text-transparent animate-gradient">
        Opprett konto
      </h1>
      <p className="text-cybergold-400 mt-2 text-lg">Bli med i SnakkaZ i dag</p>
      <div className="absolute -top-4 -left-4 w-8 h-8 border-t-2 border-l-2 border-cybergold-400/30"></div>
      <div className="absolute -top-4 -right-4 w-8 h-8 border-t-2 border-r-2 border-cybergold-400/30"></div>
    </div>
  );
};
