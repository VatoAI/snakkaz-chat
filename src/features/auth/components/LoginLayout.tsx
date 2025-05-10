
import React from 'react';
import { Shield } from "lucide-react";

interface LoginLayoutProps {
  children: React.ReactNode;
}

export const LoginLayout = ({ children }: LoginLayoutProps) => {
  return (
    <div className="space-y-8">
      <div className="text-center space-y-2">
        <div className="inline-block relative">
          <div className="w-20 h-20 rounded-full bg-gradient-to-r from-cyberdark-900 to-cyberdark-950 border-2 border-cyberblue-400 flex items-center justify-center mb-4 shadow-[0_0_20px_rgba(26,157,255,0.3)] relative group">
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-cyberblue-400/20 to-transparent animate-spin-slow"></div>
            <Shield className="w-10 h-10 text-cyberblue-300 relative z-10 group-hover:text-cyberblue-200 transition-colors" />
          </div>
        </div>
        <h1 className="text-4xl font-bold bg-gradient-to-r from-cyberblue-300 via-white to-cyberred-300 bg-clip-text text-transparent animate-gradient">
          SnakkaZ
        </h1>
        <p className="text-lg text-cyberblue-300">
          Logg inn eller registrer deg
        </p>
      </div>

      <div className="bg-cyberdark-900/80 backdrop-blur-lg rounded-lg border border-cyberblue-500/30 shadow-neon-blue p-8 relative">
        {/* Decorative corner elements */}
        <div className="absolute -top-2 -left-2 w-6 h-6 border-t-2 border-l-2 border-cyberblue-400/50"></div>
        <div className="absolute -top-2 -right-2 w-6 h-6 border-t-2 border-r-2 border-cyberblue-400/50"></div>
        <div className="absolute -bottom-2 -left-2 w-6 h-6 border-b-2 border-l-2 border-cyberblue-400/50"></div>
        <div className="absolute -bottom-2 -right-2 w-6 h-6 border-b-2 border-r-2 border-cyberblue-400/50"></div>
        
        {children}
      </div>
    </div>
  );
};
