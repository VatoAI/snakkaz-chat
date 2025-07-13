import React, { useState, useEffect } from 'react';
import { Sparkles, Zap } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface SnakkaZLogoProps {
  variant?: 'header' | 'hero' | 'compact';
  animated?: boolean;
  showCreature?: boolean;
  className?: string;
}

export const SnakkaZLogo: React.FC<SnakkaZLogoProps> = ({ 
  variant = 'header',
  animated = true,
  showCreature = true,
  className = ''
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [creaturePhase, setCreaturePhase] = useState<'🐛' | '🦋' | '✨'>('🐛');
  
  useEffect(() => {
    if (!animated) return;
    
    const phases: Array<'🐛' | '🦋' | '✨'> = ['🐛', '🦋', '✨'];
    let currentIndex = 0;
    
    const interval = setInterval(() => {
      currentIndex = (currentIndex + 1) % phases.length;
      setCreaturePhase(phases[currentIndex]);
    }, 3000);
    
    return () => clearInterval(interval);
  }, [animated]);
  
  const handleCreatureClick = () => {
    // Cycle through phases manually
    const phases: Array<'🐛' | '🦋' | '✨'> = ['🐛', '🦋', '✨'];
    const currentIndex = phases.indexOf(creaturePhase);
    const nextIndex = (currentIndex + 1) % phases.length;
    setCreaturePhase(phases[nextIndex]);
  };
  
  const baseClasses = "flex items-center gap-2 font-bold";
  
  const variantClasses = {
    header: "text-xl",
    hero: "text-4xl",
    compact: "text-lg"
  };
  
  const logoText = variant === 'hero' ? 'SnakkaZ Chat Beta' : 'SnakkaZ';
  
  return (
    <div 
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Adaptive Creature */}
      {showCreature && (
        <button
          onClick={handleCreatureClick}
          className={`
            text-2xl transition-all duration-300 cursor-pointer
            ${animated ? 'hover:scale-110' : ''}
            ${isHovered ? 'animate-pulse' : ''}
          `}
          title="Klikk for å utvikle SnakkaZ-skapningen!"
        >
          {creaturePhase}
        </button>
      )}
      
      {/* Logo Text */}
      <span className={`
        liquid-text bg-gradient-to-r from-cybergold-400 to-cyberblue-400 
        bg-clip-text text-transparent
        ${animated && isHovered ? 'animate-pulse' : ''}
      `}>
        {logoText}
      </span>
      
      {/* Beta Badge */}
      {variant !== 'compact' && (
        <div className="flex items-center gap-1">
          <Badge 
            variant="outline" 
            className="border-cybergold-500/50 text-cybergold-400 text-xs"
          >
            BETA
          </Badge>
          
          {animated && (
            <Sparkles 
              className={`
                w-4 h-4 text-cybergold-400 
                ${isHovered ? 'animate-spin' : ''}
              `} 
            />
          )}
        </div>
      )}
      
      {/* Magic Effects */}
      {animated && isHovered && variant === 'hero' && (
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-cybergold-500/20 to-cyberblue-500/20 rounded-lg animate-pulse" />
          <Zap className="absolute top-2 right-2 w-6 h-6 text-cybergold-400 animate-bounce" />
        </div>
      )}
    </div>
  );
};

export default SnakkaZLogo;
