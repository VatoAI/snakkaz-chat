import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { EnhancedLoginForm } from '@/features/auth/components/EnhancedLoginForm';
import { Button } from '@/components/ui/button';
import { UserPlus } from 'lucide-react';

const Login: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-cyberdark-950 via-cyberdark-900 to-cyberdark-950 p-4">
      <div className="w-full max-w-md space-y-6">
        <EnhancedLoginForm />
        
        <Card className="w-full">
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
      </div>
    </div>
  );
};

export default Login;
