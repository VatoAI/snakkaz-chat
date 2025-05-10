/**
 * Not Found Page
 * 
 * 404 page for routes that don't exist in the Snakkaz app
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { AlertTriangle } from 'lucide-react';

const NotFoundPage: React.FC = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-cyberdark-950 p-4">
      <div className="max-w-md w-full text-center space-y-6">
        {/* 404 Icon/Image */}
        <div className="flex justify-center">
          <div className="w-24 h-24 rounded-full bg-red-900/20 border border-red-700/30 flex items-center justify-center">
            <AlertTriangle className="h-12 w-12 text-red-500" />
          </div>
        </div>
        
        {/* Title and description */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-cybergold-400">404 - Siden finnes ikke</h1>
          <p className="text-cybergold-600">
            Beklager, men siden du leter etter eksisterer ikke eller er flyttet.
          </p>
        </div>
        
        {/* Navigation options */}
        <div className="pt-6 flex flex-col items-center space-y-4">
          <p className="text-cybergold-500">Her er noen alternativer:</p>
          
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/">
              <Button variant="outline" className="border-cybergold-700 text-cybergold-400">
                Gå til forsiden
              </Button>
            </Link>
            
            <Link to="/secure-chat">
              <Button className="bg-cybergold-600 text-black hover:bg-cybergold-500">
                Åpne Sikker Chat
              </Button>
            </Link>
          </div>
        </div>
        
        {/* Additional help */}
        <div className="mt-8 text-sm text-cybergold-700">
          <p>Hvis du fulgte en lenke for å komme hit, vennligst rapporter dette til oss.</p>
          <p className="mt-1">Kontakt: <a href="mailto:support@snakkaz.com" className="text-cybergold-500 hover:text-cybergold-400">support@snakkaz.com</a></p>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
