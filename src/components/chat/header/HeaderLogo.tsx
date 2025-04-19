
import { useNavigate } from 'react-router-dom';

export const HeaderLogo = () => {
  return (
    <div className="hidden sm:flex w-12 h-12 rounded-full mr-2 border-2 border-cybergold-500/40 shadow-neon-gold overflow-hidden">
      <img 
        src="/snakkaz-logo.png" 
        alt="SnakkaZ" 
        className="w-full h-full object-cover p-0.5"
        onError={(e) => {
          (e.target as HTMLImageElement).src = "/placeholder.svg";
        }}
      />
    </div>
  );
};
