import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { EnhancedLoginForm } from '@/features/auth/components/EnhancedLoginForm';
import { Button } from '@/components/ui/button';
import { UserPlus, Info, Mail } from 'lucide-react';

const Login: React.FC = () => {

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-cyberdark-950 via-cyberdark-900 to-cyberdark-950 p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Logo Section */}
        <div className="flex justify-center mb-8">
          <img 
            src="/logos/snakkaz-gold.svg" 
            alt="Snakkaz Logo" 
            className="h-16 w-auto"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = "/logos/snakkaz-gold.png";
            }}
          />
        </div>
        {/* Enhanced Login Form with 2FA Support */}
        <EnhancedLoginForm />
        
        {/* Additional Options */}
        <Card className="w-full bg-cyberdark-900/80 border-cyberdark-700">
          <CardFooter className="flex flex-col space-y-4">
            <div className="relative w-full">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-cyberdark-700"></span>
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="bg-cyberdark-950 px-2 text-cyberdark-300">eller</span>
              </div>
            </div>
            
            <Link to="/register" className="w-full">
              <Button variant="outline" className="w-full border-cybergold-500/30 text-cybergold-400 hover:bg-cybergold-500/10">
                <UserPlus className="mr-2 h-4 w-4" />
                Opprett ny konto
              </Button>
            </Link>
            
            <div className="text-center text-sm">
              <Link to="/forgot-password" className="text-cybergold-500 hover:text-cybergold-400 underline-offset-4 hover:underline">
                Glemt passord?
              </Link>
            </div>
          </CardFooter>
        </Card>

        {/* Information Cards */}
        <Card className="w-full bg-cyberdark-800/80 border-cybergold-500/20">
          <CardContent className="p-4">
            <div className="flex flex-col space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Info className="h-4 w-4 text-cybergold-400 mr-2" />
                  <span className="text-sm text-cybergold-300">Ny her? Les hvorfor Snakkaz er ditt beste valg</span>
                </div>
                <Link 
                  to="/info" 
                  className="px-3 py-1 rounded bg-cybergold-600/30 text-xs font-medium text-cybergold-400 hover:bg-cybergold-600/40 transition-colors"
                >
                  Les mer
                </Link>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Mail className="h-4 w-4 text-blue-400 mr-2" />
                  <span className="text-sm text-blue-300">Få din egen @snakkaz.com e-post med Pro-abonnement!</span>
                </div>
                <Link 
                  to="/info#premium-email" 
                  className="px-3 py-1 rounded bg-blue-600/30 text-xs font-medium text-blue-400 hover:bg-blue-600/40 transition-colors"
                >
                  Les mer
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Login;
