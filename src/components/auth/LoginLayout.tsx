
import React from 'react';

interface LoginLayoutProps {
  children: React.ReactNode;
}

export const LoginLayout = ({ children }: LoginLayoutProps) => {
  return (
    <div className="min-h-screen bg-cyberdark-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold text-cybergold-400">
            SnakkaZ
          </h1>
          <p className="text-lg text-cybergold-300">
            Logg inn eller registrer deg
          </p>
        </div>

        <div className="bg-cyberdark-900/80 backdrop-blur-lg rounded-lg border border-cybergold-500/30 shadow-lg p-8">
          {children}
        </div>
      </div>
    </div>
  );
};
