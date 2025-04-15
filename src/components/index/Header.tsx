
import { useNavigate } from 'react-router-dom';
import { useIsMobile } from '@/hooks/use-mobile';

export const Header = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  
  const handleChatRedirect = () => {
    navigate('/chat');
  };
  
  return (
    <div className="text-center mb-8 md:mb-12">
      <div className="relative">
        {/* Logo with enhanced red/blue glow effect */}
        <div className={`${isMobile ? 'w-32 h-32' : 'w-48 h-48'} mx-auto rounded-full bg-gradient-to-r from-cyberdark-900 to-cyberdark-950 border-2 border-red-400 border-l-red-400 border-t-red-400 border-r-cyberblue-400 border-b-cyberblue-400 flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(26,157,255,0.4)_,_0_0_30px_rgba(214,40,40,0.4)] hover:shadow-[0_0_40px_rgba(26,157,255,0.6)_,_0_0_40px_rgba(214,40,40,0.6)] transition-all duration-300`}>
          <img
            src="/snakkaz-logo.png" 
            alt="SnakkaZ Logo"
            className={`rounded-full ${isMobile ? 'w-24 h-24' : 'w-40 h-40'} object-cover`}
            onError={(e) => {
              console.log("Logo failed to load, using fallback");
              (e.target as HTMLImageElement).src = "/placeholder.svg";
            }}
          />
        </div>
        
        {/* Decorative elements with split red/blue glow */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-60 h-60 rounded-full border-2 border-l-cyberblue-400/40 border-t-cyberblue-400/40 border-r-red-400/40 border-b-red-400/40 animate-pulse-slow -z-10"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-72 h-72 rounded-full border border-l-cyberblue-400/30 border-t-cyberblue-400/30 border-r-red-400/30 border-b-red-400/30 -z-10"></div>
      </div>

      {/* Hub title with enhanced red/blue styling */}
      <div className="relative mb-6">
        <h1
          className={`${isMobile ? 'text-4xl' : 'text-5xl md:text-6xl'} font-bold`}
          style={{
            background: 'linear-gradient(90deg, #1a9dff 0%, #ffffff 50%, #d62828 100%)',
            WebkitBackgroundClip: 'text',
            backgroundClip: 'text',
            color: 'transparent',
            textShadow: '-5px 0 15px rgba(26,157,255,0.6), 5px 0 15px rgba(214,40,40,0.6)',
            filter: 'drop-shadow(0 0 8px rgba(255,255,255,0.5))'
          }}
        >
          SnakkaZ Hub
        </h1>
        
        {/* Add backlight effect to improve text visibility */}
        <div className="absolute inset-0 bg-gradient-to-r from-cyberblue-500/20 via-transparent to-red-500/20 filter blur-xl rounded-full -z-10"></div>
      </div>
      
      {/* Updated button with red/blue styling */}
      <div className="flex flex-col items-center">
        <button 
          onClick={handleChatRedirect}
          className="px-8 py-4 text-white rounded-lg font-medium text-lg transition-all duration-300 transform hover:scale-105"
          style={{
            background: 'linear-gradient(90deg, #1a9dff 0%, #3b82f6 50%, #d62828 100%)',
            boxShadow: '0 0 15px rgba(26,157,255,0.4), 0 0 15px rgba(214,40,40,0.4)'
          }}
        >
          Start SnakkaZ
        </button>
      </div>
    </div>
  );
};
