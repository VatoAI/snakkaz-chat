
import { useNavigate } from 'react-router-dom';
import { Home, Info, Settings } from 'lucide-react';

export const Footer = () => {
  const navigate = useNavigate();
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="py-6 border-t border-gradient-rb bg-cyberdark-900/50 backdrop-blur-sm">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <p className="text-center md:text-left text-cyberblue-400/70">
              © {currentYear} SnakkaZ. Sikker kommunikasjon for alle.
            </p>
          </div>
          
          <div className="flex space-x-8">
            <button 
              onClick={() => navigate('/')}
              className="flex flex-col items-center text-cyberblue-400 hover:text-cyberblue-300 transition-colors relative group"
            >
              <Home size={20} className="mb-1" />
              <span className="text-sm">Home</span>
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-cyberblue-500 to-transparent group-hover:w-full transition-all duration-300"></span>
            </button>
            
            <button
              onClick={() => navigate('/info')} 
              className="flex flex-col items-center text-cyberblue-400 hover:text-cyberblue-300 transition-colors relative group"
            >
              <Info size={20} className="mb-1" />
              <span className="text-sm">Info</span>
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-cyberblue-500 to-transparent group-hover:w-full transition-all duration-300"></span>
            </button>
            
            <button 
              onClick={() => navigate('/admin')}
              className="flex flex-col items-center text-red-400 hover:text-red-300 transition-colors relative group"
            >
              <Settings size={20} className="mb-1" />
              <span className="text-sm">Admin</span>
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-red-500 to-transparent group-hover:w-full transition-all duration-300"></span>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
